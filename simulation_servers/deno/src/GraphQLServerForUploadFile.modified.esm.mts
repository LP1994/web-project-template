'use strict';

/**
 * 一次 Multipart 上传请求对应一个清理会话。
 * filePaths：本次请求创建过的所有文件路径（即使文件只写入了一部分，也会登记）。
 * fileStreams：当前仍在读取/写入的 Busboy 文件流。
 */
interface T_GraphQLServerForUploadCleanupSession {
  filePaths: Set<string>;
  fileStreams: Set<Readable>;
  cleanupPromise?: Promise<void>;
}

/**
 * 解析成功后，将清理会话关联到转换后的 Request。
 * WeakMap 不会因为保存 Request 而阻止 Request 被垃圾回收。
 */
const uploadCleanupSessionByRequest: WeakMap<Request, T_GraphQLServerForUploadCleanupSession> = new WeakMap<Request, T_GraphQLServerForUploadCleanupSession>();

function GraphQLServerForNormalizeUploadError( error: unknown ): Error{
  return error instanceof Error
         ? error
         : new Error( String( error ) );
}

/**
 * 删除一次上传请求创建的所有文件。该函数是幂等的，可被多个错误分支重复调用。
 * 调用方必须先确保对应的 fileTasks 已全部结束，避免 Windows 上因文件句柄仍打开而删除失败。
 */
async function GraphQLServerForCleanupUploadSession( session: T_GraphQLServerForUploadCleanupSession ): Promise<void>{
  if( session.cleanupPromise ){
    await session.cleanupPromise;
    return;
  }

  session.cleanupPromise = ( async (): Promise<void> => {
    for( const filePath of
      session.filePaths ){
      try{
        await Deno.remove( filePath );
      }
      catch( error: unknown ){
        if( !( error instanceof Deno.errors.NotFound ) ){
          errorWriteStream.write( `
GraphQLServerForCleanupUploadSession：删除上传文件失败！
文件路径：${ filePath }
错误信息：${ error instanceof Error
            ? error.message
            : String( error ) }
` );
        }
      }
    }

    // 清空本次请求的文件路径、活动流引用，释放会话缓存。
    session.filePaths.clear();
    session.fileStreams.clear();
  } )();

  await session.cleanupPromise;
}

/**
 * GraphQL HTTP 处理失败时，由 GraphQLServer 调用此函数删除本次请求已写入的文件。
 */
async function GraphQLServerForCleanupUploadedFiles( request: Request ): Promise<void>{
  const session: T_GraphQLServerForUploadCleanupSession | undefined = uploadCleanupSessionByRequest.get( request );

  if( !session ){
    return;
  }

  await GraphQLServerForCleanupUploadSession( session );
  uploadCleanupSessionByRequest.delete( request );
}

/**
 * GraphQL HTTP 处理成功时，仅释放清理追踪缓存，不删除已经成功接收的文件。
 */
function GraphQLServerForReleaseUploadedFiles( request: Request ): void{
  const session: T_GraphQLServerForUploadCleanupSession | undefined = uploadCleanupSessionByRequest.get( request );

  if( session ){
    session.filePaths.clear();

    session.fileStreams.clear();

    uploadCleanupSessionByRequest.delete( request );
  }
}

/**
 *
 * @param {Request} request
 *
 * @param {T_HandlerOptions} options
 *
 * @param {Partial<T_FetchAPI>} reqCtx
 *
 * @returns {Promise<Response>}
 */
async function GraphQLServerForExecuteBatch( request: Request, options: T_HandlerOptions, reqCtx: Partial<T_FetchAPI> ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  const operationsPayload: T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations> = await request.clone().json(),
    isNotBatchOperations: boolean = ( operationsPayload as Array<T_GraphQLServerForMultipartOperations> ).length === 0 || !( operationsPayload as Array<T_GraphQLServerForMultipartOperations> ).every( ( value: T_GraphQLServerForMultipartOperations ): boolean => ( IsObject( value ) && !IsEmpty( value ) ) );

  if( IsArray( operationsPayload ) && isNotBatchOperations ){
    errorWriteStream.write( `
请求“${ pathName }”中：
1）GraphQLServerForExecuteBatch: The multipart "operations" array must contain one or more GraphQL operation objects.
` );

    return new Response( JSON.stringify( {
      errors: [
        {
          message: `The multipart "operations" array must contain one or more GraphQL operation objects.`,
        },
      ],
    }, null, 2 ), {
      headers: {
        ...HttpResponseHeadersFun( request ),
        'content-type': 'application/json; charset=utf-8',
      },
      status: HTTPStatus[ 400 ].status,
      statusText: HTTPStatus[ 400 ].statusText,
    } );
  }
  else if( IsArray( operationsPayload ) && !isNotBatchOperations ){
    const results: Array<Record<string, any>> = [];

    const handler: ( req: Request ) => Promise<Response> = createHandlerByHTTP( options, reqCtx );

    // 该批处理中只要有某个操作在 HTTP 层抛错，或者返回非 2xx 状态，就认为本次批处理失败并清理上传文件。
    let hasOperationHTTPError: boolean = false;

    for(
      const operation of
      operationsPayload as Array<T_GraphQLServerForMultipartOperations>
      ){
      try{
        const headers: Headers = new Headers( request.headers );

        headers.set( 'content-type', 'application/json; charset=utf-8' );

        headers.delete( 'content-length' );
        headers.delete( 'transfer-encoding' );

        const operationResponse: Response = await handler( new Request( request.url, {
          method: 'POST',
          headers,
          body: JSON.stringify( operation ),
          ...( ( () => (
            'signal' in request
            ? { signal: request.signal }
            : {}
          ) )() ),
          ...( ( () => (
            'cache' in request
            ? { cache: request.cache }
            : {}
          ) )() ),
          ...( ( () => (
            'credentials' in request
            ? { credentials: request.credentials }
            : {}
          ) )() ),
          ...( ( () => (
            'integrity' in request
            ? { integrity: request.integrity }
            : {}
          ) )() ),
          ...( ( () => (
            'keepalive' in request
            ? { keepalive: request.keepalive }
            : {}
          ) )() ),
          ...( ( () => (
            'mode' in request
            ? { mode: request.mode }
            : {}
          ) )() ),
          ...( ( () => (
            'redirect' in request
            ? { redirect: request.redirect }
            : {}
          ) )() ),
          ...( ( () => (
            'referrer' in request
            ? { referrer: request.referrer }
            : {}
          ) )() ),
          ...( ( () => (
            'referrerPolicy' in request
            ? { referrerPolicy: request.referrerPolicy }
            : {}
          ) )() ),
        } ) );

        if( !operationResponse.ok ){
          hasOperationHTTPError = true;
        }

        results.push( await operationResponse.json() );
      }
      catch( error: unknown ){
        hasOperationHTTPError = true;

        errorWriteStream.write( `
请求“${ pathName }”中：
2）GraphQLServerForExecuteBatch: ${ error instanceof Error
                                   ? error.message
                                   : String( error ) }
` );

        results.push( {
          errors: [
            {
              message: error instanceof Error
                       ? error.message
                       : String( error ),
            },
          ],
        } );
      }
    }

    if( hasOperationHTTPError ){
      await GraphQLServerForCleanupUploadedFiles( request );
    }

    return new Response( JSON.stringify( results, null, 2 ), {
      headers: {
        ...HttpResponseHeadersFun( request ),
        'content-type': 'application/json; charset=utf-8',
      },
      status: HTTPStatus[ 200 ].status,
      statusText: HTTPStatus[ 200 ].statusText,
    } );
  }
  else{
    return await createHandlerByHTTP( options, reqCtx )( request );
  }
}

/**
 * multipart解析器。
 *
 * @param {Request} request
 *
 * @param {T_GraphQLServerForUploadFileOptions} options
 *
 * @returns {Promise<Request>}
 */
async function GraphQLServerForMultipartParser(
  request: Request,
  {
    maxFieldNameSize = DEFAULT_MAX_FIELD_NAME_SIZE,
    maxFieldSize = DEFAULT_MAX_FIELD_SIZE,
    maxFields = DEFAULT_MAX_FIELDS,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    maxFiles = DEFAULT_MAX_FILES,
    maxHeaderPairs = DEFAULT_MAX_HEADER_PAIRS,
    maxHeaderSize = DEFAULT_MAX_HEADER_SIZE,
    maxParts = DEFAULT_MAX_PARTS,
    uploadDir = DEFAULT_UPLOAD_DIR,
  } = {
    maxFieldNameSize: DEFAULT_MAX_FIELD_NAME_SIZE,
    maxFieldSize: DEFAULT_MAX_FIELD_SIZE,
    maxFields: DEFAULT_MAX_FIELDS,
    maxFileSize: DEFAULT_MAX_FILE_SIZE,
    maxFiles: DEFAULT_MAX_FILES,
    maxHeaderPairs: DEFAULT_MAX_HEADER_PAIRS,
    maxHeaderSize: DEFAULT_MAX_HEADER_SIZE,
    maxParts: DEFAULT_MAX_PARTS,
    uploadDir: DEFAULT_UPLOAD_DIR,
  } as T_GraphQLServerForUploadFileOptions,
): Promise<Request>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  if( !GraphQLServerForIsMultipartRequest( request ) ){
    errorWriteStream.write( `
请求“${ pathName }”中的请求头里的“content-type”属性的值不为“multipart/form-data”，或不是以该值为开头。GraphQL文件上传功能仅支持请求头中的“content-type”属性的值为“multipart/form-data”，或是以该值为开头的。且该请求方式必须是“post”请求。
` );

    throw new Error( `请求“${ pathName }”中的请求头里的“content-type”属性的值不为“multipart/form-data”，或不是以该值为开头。GraphQL文件上传功能仅支持请求头中的“content-type”属性的值为“multipart/form-data”，或是以该值为开头的。且该请求方式必须是“post”请求。` );
  }

  if( !request.body ){
    errorWriteStream.write( `
请求“${ pathName }”中的请求体body不能为空！
` );

    throw new Error( `请求“${ pathName }”中的请求体body不能为空！` );
  }

  if( request.signal.aborted ){
    throw new DOMException( `请求“${ pathName }”在开始解析前已经中断。`, 'AbortError' );
  }

  await Deno.mkdir( uploadDir, {
    recursive: true,
  } );

  const cleanupSession: T_GraphQLServerForUploadCleanupSession = {
    filePaths: new Set<string>(),
    fileStreams: new Set<Readable>(),
  };

  const fields: Map<string, string> = new Map<string, string>();
  const fileParts: T_GraphQLServerForMultipartFilePart[] = [];
  const fileTasks: Promise<void>[] = [];
  const fileByFieldName: Map<string, T_GraphQLServerForUploadFile> = new Map<string, T_GraphQLServerForUploadFile>();

  let abortHandler: ( () => void ) | undefined;

  try{
    const operationsText: string = await new Promise<string>( (
      resolve: ( value: string ) => void,
      reject: ( reason?: unknown ) => void,
    ): void => {
      let busboy: BusboyInstance;
      let nodeRequest: Readable;
      let hasError: boolean = false;
      let settled: boolean = false;
      let parserFinished: boolean = false;

      const fail: ( error: unknown ) => void = ( error: unknown ): void => {
        if( hasError || settled ){
          return;
        }

        hasError = true;
        const normalizedError: Error = GraphQLServerForNormalizeUploadError( error );

        // 停止接收后续 Multipart 数据，并中止所有仍在写盘的文件流。
        for( const fileStream of
          cleanupSession.fileStreams ){
          try{
            fileStream.destroy();
          }
          catch{
            // 清理过程继续，不能让 destroy 的次生异常覆盖最初的错误。
          }
        }

        try{
          if( nodeRequest && !nodeRequest.destroyed ){
            nodeRequest.unpipe( busboy );
            nodeRequest.destroy();
          }
        }
        catch{
          // 忽略停止输入流时的次生异常。
        }

        try{
          if( busboy && !busboy.destroyed ){
            busboy.destroy();
          }
        }
        catch{
          // 忽略停止 Multipart 解析器时的次生异常。
        }

        settled = true;
        reject( normalizedError );
      };

      try{
        busboy = new Busboy( {
          headers: {
            'content-type': request.headers.get( 'content-type' ) as string,
          },
          limits: {
            fieldNameSize: maxFieldNameSize,
            fieldSize: maxFieldSize,
            fields: maxFields,
            fileSize: maxFileSize,
            files: maxFiles,
            headerPairs: maxHeaderPairs,
            headerSize: maxHeaderSize,
            parts: maxParts,
          },
        } );

        nodeRequest = Readable.fromWeb( request.body as ReadableStream<Uint8Array> );
      }
      catch( error: unknown ){
        fail( error );
        return;
      }

      abortHandler = (): void => {
        fail( new DOMException( `客户端已中断请求“${ pathName }”。`, 'AbortError' ) );
      };

      request.signal.addEventListener( 'abort', abortHandler, {
        once: true,
      } );

      if( request.signal.aborted ){
        abortHandler();
        return;
      }

      /**
       * 文件字段：登记活动流并开始流式写入。
       * Deno.open(createNew:true) 成功创建文件后，存储函数会立即把路径登记到统一清理集合。
       */
      busboy.on( 'file', (
        fieldname: string,
        stream: Readable,
        filename: string,
        transferEncoding: string,
        mimeType: string,
      ): void => {
        if( hasError ){
          stream.resume();
          return;
        }

        try{
          const safeFileName: string = GraphQLServerForGetSafeFileName( filename );
          const storedFileName: string = GraphQLServerForGetStoredFileName( safeFileName );
          const filePath: string = join( uploadDir, storedFileName );

          const file: T_GraphQLServerForUploadFile = {
            fileName: safeFileName,
            mimeType,
            encoding: transferEncoding as T_GraphQLServerForUploadFile['encoding'],
            size: 0,
            filePath,
          };

          // 跟踪活动流；文件路径会在 Deno.open(createNew:true) 成功创建文件后立即登记。
          cleanupSession.fileStreams.add( stream );

          stream.once( 'limit', (): void => {
            errorWriteStream.write( `
请求“${ pathName }”中上传的文件（${ safeFileName }）的大小超过了程序的设定值（${ maxFileSize }，单位为字节）！
` );

            fail( new Error( `请求“${ pathName }”中上传的文件（${ safeFileName }）的大小超过了程序的设定值（${ maxFileSize }，单位为字节）！` ) );
          } );

          const task: Promise<void> = ( async (): Promise<void> => {
            try{
              file.size = await GraphQLServerForUploadFileStorage(
                stream as AsyncIterable<Uint8Array>,
                filePath,
                maxFileSize,
                (): void => cleanupSession.filePaths.add( filePath ),
              );

              if( Boolean( ( stream as Readable & {
                truncated?: boolean
              } ).truncated ) ){
                throw new Error( `文件“${ safeFileName }”的数据流被 Busboy 截断，文件大小超过限制（${ maxFileSize } 字节）。` );
              }

              if( !hasError ){
                fileParts.push( {
                  fieldName: fieldname,
                  file,
                } );
              }
            }
            finally{
              cleanupSession.fileStreams.delete( stream );
            }
          } )();

          fileTasks.push( task );
          task.catch( fail );
        }
        catch( error: unknown ){
          // 防止 file 事件处理器自身的同步异常逃逸到 EventEmitter 外部。
          stream.resume();
          fail( error );
        }
      } );

      /**
       * 普通字段：只接受一次 operations 和一次 map，且字段名和值都必须完整。
       */
      busboy.on( 'field', (
        fieldname: string,
        value: string,
        fieldnameTruncated: boolean,
        valueTruncated: boolean,
      ): void => {
        if( hasError ){
          return;
        }

        if( fieldnameTruncated ){
          fail( new Error( `Multipart 字段名称超过限制（${ maxFieldNameSize } 字节）。` ) );
          return;
        }

        if( valueTruncated ){
          errorWriteStream.write( `
请求“${ pathName }”中多部分（Multipart）字段“${ fieldname }”的值的大小超出程序设置的限制值（${ maxFieldSize }）！
` );

          fail( new Error( `请求“${ pathName }”中多部分（Multipart）字段“${ fieldname }”的值的大小超出程序设置的限制值（${ maxFieldSize }）！` ) );
          return;
        }

        if( fields.has( fieldname ) ){
          fail( new Error( `Multipart 字段“${ fieldname }”重复出现。` ) );
          return;
        }

        fields.set( fieldname, value );
      } );

      busboy.on( 'finish', (): void => {
        parserFinished = true;

        if( hasError || settled ){
          return;
        }

        void ( async (): Promise<void> => {
          try{
            // finish 表示 Multipart 输入已解析完；仍需等待所有磁盘写入任务完成。
            await Promise.all( fileTasks );

            if( hasError || settled ){
              return;
            }

            const operations: string | undefined = fields.get( 'operations' );
            const map: string | undefined = fields.get( 'map' );

            if( !( IsString( operations ) && ( operations as string ).trim().length > 0 ) ){
              throw new Error( `请求“${ pathName }”中的 Multipart 请求体缺少有效字段“operations”。` );
            }

            if( !( IsString( map ) && ( map as string ).trim().length > 0 ) ){
              throw new Error( `请求“${ pathName }”中的 Multipart 请求体缺少有效字段“map”。` );
            }

            const operationsObject: T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations> = JSON.parse( operations ) as ( T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations> );
            const mapValue: unknown = JSON.parse( map );

            if( !( IsObject( mapValue ) && !IsArray( mapValue ) ) ){
              throw new Error( `Multipart 字段“map”必须是 JSON 对象。` );
            }

            const mapObject: Record<string, string[]> = mapValue as Record<string, string[]>;

            for( const part of
              fileParts ){
              if( fileByFieldName.has( part.fieldName ) ){
                throw new Error( `Multipart 文件字段“${ part.fieldName }”重复出现。` );
              }

              fileByFieldName.set( part.fieldName, part.file );
            }

            // GraphQL multipart request 里的每个文件字段都必须在 map 中声明，避免落盘后无人引用。
            for( const part of
              fileParts ){
              if( !Object.prototype.hasOwnProperty.call( mapObject, part.fieldName ) ){
                throw new Error( `上传文件字段“${ part.fieldName }”没有对应的 Multipart map 映射。` );
              }
            }

            for(
              const [ fileFieldName, variablePaths ]
              of
              Object.entries( mapObject )
              ){
              const file: T_GraphQLServerForUploadFile | undefined = fileByFieldName.get( fileFieldName );

              if( !file ){
                throw new Error( `请求“${ pathName }”中“${ fileFieldName }”对应的文件不存在！` );
              }

              if( !( Array.isArray( variablePaths ) && variablePaths.length > 0 ) ){
                throw new Error( `请求“${ pathName }”中“${ fileFieldName }”对应的 map 值必须是非空数组！` );
              }

              for( const variablePath of
                variablePaths ){
                if( typeof variablePath !== 'string' || variablePath.length === 0 ){
                  throw new Error( `请求“${ pathName }”中“${ fileFieldName }”对应的变量路径必须是非空字符串。` );
                }

                // 如果路径映射失败，该异常会进入 fail；外层 catch 随后统一删除所有已写入文件。
                GraphQLServerForSetObjectPath( request, operationsObject, variablePath, file );
              }
            }

            const result: string = JSON.stringify( operationsObject );

            // 清空解析过程中的临时缓存；文件路径仍保留在 cleanupSession 中，供 HTTP 处理失败时回滚。
            fields.clear();
            fileParts.length = 0;
            fileByFieldName.clear();
            fileTasks.length = 0;

            settled = true;
            resolve( result );
          }
          catch( error: unknown ){
            fail( error );
          }
        } )();
      } );

      /**
       * 达到文件数量限制后，Busboy 不再触发后续 file 事件，必须终止本次解析并回滚已经创建的文件。
       */
      busboy.on( 'filesLimit', (): void => {
        errorWriteStream.write( `
请求“${ pathName }”中的文件（file）数量超过程序设定的最大数量（${ maxFiles }）！
` );

        fail( new Error( `请求“${ pathName }”中的文件（file）数量超过程序设定的最大数量（${ maxFiles }）！` ) );
      } );

      busboy.on( 'fieldsLimit', (): void => {
        errorWriteStream.write( `
请求“${ pathName }”中的普通字段（field）数量超过程序设定的最大数量（${ maxFields }）！
` );

        fail( new Error( `请求“${ pathName }”中的普通字段（field）数量超过程序设定的最大数量（${ maxFields }）！` ) );
      } );

      /** Multipart 总部分数（普通字段 + 文件）超限。 */
      busboy.on( 'partsLimit', (): void => {
        errorWriteStream.write( `
请求“${ pathName }”中的 Multipart 总部分数超过程序设定的最大数量（${ maxParts }）！
` );

        fail( new Error( `请求“${ pathName }”中的 Multipart 总部分数超过程序设定的最大数量（${ maxParts }）！` ) );
      } );

      // Busboy 报错通常代表 boundary、header 或 Multipart 格式异常。
      busboy.on( 'error', fail );
      nodeRequest.on( 'error', fail );

      // 源请求流提前关闭但没有正常 end，通常意味着客户端中途中断。
      nodeRequest.on( 'close', (): void => {
        if( !nodeRequest.readableEnded && !hasError && !settled ){
          fail( new Error( `客户端上传请求“${ pathName }”未正常结束，接收流提前关闭。` ) );
        }
      } );

      // Busboy 未发出 finish 就 close，按不完整/格式错误的 Multipart 请求处理。
      busboy.on( 'close', (): void => {
        if( !parserFinished && !hasError && !settled ){
          fail( new Error( `请求“${ pathName }”的 Multipart 解析器在 finish 前关闭，Multipart 数据可能不完整。` ) );
        }
      } );

      try{
        nodeRequest.pipe( busboy );
      }
      catch( error: unknown ){
        fail( error );
      }
    } );

    const headers: Headers = new Headers( request.headers );

    headers.set( 'content-type', 'application/json; charset=utf-8' );
    headers.delete( 'content-length' );
    headers.delete( 'transfer-encoding' );

    const graphqlRequest: Request = new Request( request.url, {
      method: request.method,
      headers,
      body: operationsText,
      signal: request.signal,
      ...( ( () => (
        'cache' in request
        ? { cache: request.cache }
        : {}
      ) )() ),
      ...( ( () => (
        'credentials' in request
        ? { credentials: request.credentials }
        : {}
      ) )() ),
      ...( ( () => (
        'integrity' in request
        ? { integrity: request.integrity }
        : {}
      ) )() ),
      ...( ( () => (
        'keepalive' in request
        ? { keepalive: request.keepalive }
        : {}
      ) )() ),
      ...( ( () => (
        'mode' in request
        ? { mode: request.mode }
        : {}
      ) )() ),
      ...( ( () => (
        'redirect' in request
        ? { redirect: request.redirect }
        : {}
      ) )() ),
      ...( ( () => (
        'referrer' in request
        ? { referrer: request.referrer }
        : {}
      ) )() ),
      ...( ( () => (
        'referrerPolicy' in request
        ? { referrerPolicy: request.referrerPolicy }
        : {}
      ) )() ),
    } );

    // 只有解析和落盘全部成功后才建立关联；之后 GraphQLServer 才能在 HTTP 处理异常时回滚。
    uploadCleanupSessionByRequest.set( graphqlRequest, cleanupSession );

    return graphqlRequest;
  }
  catch( error: unknown ){
    // 拒绝解析后，必须等所有正在进行的文件任务结束（包括 finally 中关闭文件句柄）再删除。
    await Promise.allSettled( fileTasks );

    fields.clear();
    fileParts.length = 0;
    fileByFieldName.clear();
    fileTasks.length = 0;

    await GraphQLServerForCleanupUploadSession( cleanupSession );

    errorWriteStream.write( `
GraphQLServerForMultipartParser：本次 Multipart 上传失败，已执行文件回滚。
请求路径：${ pathName }
错误信息：${ error instanceof Error
            ? error.message
            : String( error ) }
` );

    throw error;
  }
  finally{
    if( abortHandler ){
      request.signal.removeEventListener( 'abort', abortHandler );
    }
  }
}
