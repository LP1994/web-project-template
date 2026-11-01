'use strict';

import {
  type ConstValueNode as T_ConstValueNode,

  GraphQLError,
  GraphQLScalarType,
} from 'esm_sh_graphql';

import {
  type FetchAPI as T_FetchAPI,
  type HandlerOptions as T_HandlerOptions,

  createHandler as createHandlerByHTTP,
} from 'esm_sh_graphql_http/lib/use/fetch';

import {
  GetDataType,
  IsObject,
  IsArray,
  IsEmpty,
  IsString,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  HttpResponseHeadersFun,
  HTTPStatus,

  uploadDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  join,
  basename,
  extname,
} from 'deno_std_path';

import {
  Readable,
} from 'node:stream';

import {
  type BusboyInstance,

  Busboy,
} from 'npm:@fastify/busboy';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

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
错误信息：${ error instanceof Error ? error.message : String( error ) }
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

  if( !session ){
    return;
  }

  session.filePaths.clear();
  session.fileStreams.clear();
  uploadCleanupSessionByRequest.delete( request );
}

/**
 * 一个文件对象，该对象里有关于文件的元数据和文件存储的磁盘路径、文件大小等等信息。<br />
 * 例子：<br />
 * ```ts
 * {
 *   fileName: 'test.png',
 *   mimeType: 'image/png',
 *   encoding: 'binary',
 *   size: 102400,
 *   filePath: 'G:/WebStormWS/7788/1.png',
 * }
 * ```
 */
interface T_GraphQLServerForUploadFile {
  fileName: string;
  mimeType: string;
  encoding: '7bit' | '8bit' | 'binary';
  size: number;
  filePath: string;
}

/**
 * 上传配置项。
 */
interface T_GraphQLServerForUploadFileOptions {
  /**
   * 字段名称的最大长度（以字节为单位）。
   *
   * @default Infinity
   */
  maxFieldNameSize?: number;

  /**
   * 用于限制multipart中普通字段的最大字节数。
   *
   * @default Infinity
   */
  maxFieldSize?: number;

  /**
   * 非文件字段的最大数量。<br />
   * 当前默认值设置为：2，表示目前只接收“operations”、“map”这2个field字段。<br />
   *
   * @default 2
   */
  maxFields?: number;

  /**
   * 用于限制单个文件的大小。单位为字节。
   *
   * @default Infinity
   */
  maxFileSize?: number;

  /**
   * 用于限制上传文件的数量。
   *
   * @default Infinity
   */
  maxFiles?: number;

  /**
   * 对于多部分（multipart）表单，需解析的标头键值对的最大数量。
   *
   * @default Infinity
   */
  maxHeaderPairs?: number;

  /**
   * 对于多部分表单，标题部分的最大尺寸。
   *
   * @default Infinity
   */
  maxHeaderSize?: number;

  /**
   * 对于多部分表单，最大部分数（字段 + 文件）。
   *
   * @default Infinity
   */
  maxParts?: number;

  /**
   * 上用于保存上传文件的文件夹路径。表示上传的文件最后都是保存在哪个文件夹下。
   *
   * @default new URL( uploadDir )
   */
  uploadDir?: string | URL;

  /**
   * 文件保存成功后，生成对外访问URL。<br />
   */
  getFileUrl?: ( file: T_GraphQLServerForUploadFile ) => string;
}

interface T_GraphQLServerForMultipartFilePart {
  fieldName: string;
  file: T_GraphQLServerForUploadFile;
}

interface T_GraphQLServerForMultipartOperations {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  extensions?: Record<string, unknown>;
}

/**
 * 字段名称的最大长度（以字节为单位）。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FIELD_NAME_SIZE: number = Infinity;

/**
 * 用于限制multipart中普通字段的最大字节数。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FIELD_SIZE: number = Infinity;

/**
 * 非文件字段的最大数量。<br />
 * 当前默认值设置为：2，表示目前只接收“operations”、“map”这2个field字段。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FIELDS: number = 2;

/**
 * 用于限制单个文件的大小。单位为字节。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FILE_SIZE: number = Infinity;

/**
 * 用于限制上传文件的数量。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FILES: number = Infinity;

/**
 * 对于多部分（multipart）表单，需解析的标头键值对的最大数量。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_HEADER_PAIRS: number = Infinity;

/**
 * 对于多部分表单，标题部分的最大尺寸。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_HEADER_SIZE: number = Infinity;

/**
 * 对于多部分表单，最大部分数（字段 + 文件）。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_PARTS: number = Infinity;

/**
 * 保存上传文件的文件夹路径。表示上传的文件最后都是保存在哪个文件夹下。<br />
 * 当前默认值设置为：new URL( uploadDir )。<br />
 *
 * @type {string|URL}
 */
const DEFAULT_UPLOAD_DIR: string | URL = new URL( uploadDir );

/**
 * 返回路径的最后一部分。末尾的目录分隔符将被忽略，且可选后缀将被移除。
 *
 * @param {string| URL} fileName 用于提取名称的路径。若作为 URL 实例传递，其协议必须为 file:。对于其他协议，请将 URL 作为字符串传递，或传递其 pathname 属性。
 *
 * @returns {string} 路径的基本名称。返回值形如：'image.png'。
 */
function GraphQLServerForGetSafeFileName( fileName: string | URL ): string{
  return basename( fileName ).trim();
}

/**
 * 生成一个由随机数组成的所要保存文件的文件名。
 *
 * @param {string | URL} fileName 原始文件名。
 *
 * @returns {string} 一个由随机数组成的所要保存文件的文件名。
 */
function GraphQLServerForGetStoredFileName( fileName: string | URL ): string{
  return `${ crypto.randomUUID() }${ extname( GraphQLServerForGetSafeFileName( fileName ) ).replaceAll( /[^a-zA-Z0-9.]/g, '_' ).slice( 0, 20 ) }`;
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

              if( Boolean( ( stream as Readable & { truncated?: boolean } ).truncated ) ){
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
错误信息：${ error instanceof Error ? error.message : String( error ) }
` );

    throw error;
  }
  finally{
    if( abortHandler ){
      request.signal.removeEventListener( 'abort', abortHandler );
    }
  }
}

/**
 * 判断一个请求是不是“post”请求，并且其请求头中的"content-type"属性的值是不是"multipart/form-data"，或是以该值为开头的。
 *
 * @param {Request} request
 *
 * @returns {boolean}
 */
function GraphQLServerForIsMultipartRequest( request: Request ): boolean{
  return [
    'post',
  ].includes( request.method.toLowerCase() ) && ( request.headers.get( 'content-type' ) ?? '' ).toLowerCase().startsWith( 'multipart/form-data' );
}

/**
 *
 * @param {Request} request
 *
 * @param {T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations>} root
 *
 * @param {string} path
 *
 * @param {T_GraphQLServerForUploadFile} value
 */
function GraphQLServerForSetObjectPath( request: Request, root: T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations>, path: string, value: T_GraphQLServerForUploadFile ): void{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  const segments: string[] = path.split( '.' );

  if( segments.length === 0 ){
    errorWriteStream.write( `
请求“${ pathName }”：
Invalid empty map path.
` );

    throw new Error( `请求“${ pathName }”：Invalid empty map path.` );
  }

  for( const segment of
    segments ){
    if(
      segment === '__proto__' ||
      segment === 'prototype' ||
      segment === 'constructor'
    ){
      errorWriteStream.write( `
请求“${ pathName }”中：
Unsafe multipart map path: ${ path }
` );

      throw new Error( `请求“${ pathName }”中：Unsafe multipart map path: ${ path }` );
    }
  }

  let current: unknown = root;

  for(
    let index: number = 0;
    index < segments.length - 1;
    ++index
  ){
    const segment: string = segments[ index ];

    if( !( ( IsObject( current ) && !IsEmpty( current ) ) || ( IsArray( current ) && !IsEmpty( current ) ) ) ){
      errorWriteStream.write( `
请求“${ pathName }”中：
1）Invalid multipart map path: ${ path }
` );

      throw new Error( `请求“${ pathName }”中：1）Invalid multipart map path: ${ path }` );
    }

    const object: Record<string, any> | Array<Record<string, any>> | Array<any> = current as ( Record<string, any> | Array<Record<string, any>> | Array<any> );

    if( !( segment in object ) ){
      errorWriteStream.write( `
请求“${ pathName }”中：
Multipart map path does not exist: ${ path }
` );

      throw new Error( `请求“${ pathName }”中：Multipart map path does not exist: ${ path }` );
    }

    current = object[ segment ];
  }

  const lastSegment: string = segments.at( -1 )!;

  if( !( ( IsObject( current ) && !IsEmpty( current ) ) || ( IsArray( current ) && !IsEmpty( current ) ) ) ){
    errorWriteStream.write( `
请求“${ pathName }”中：
2）Invalid multipart map path: ${ path }
` );

    throw new Error( `请求“${ pathName }”中：2）Invalid multipart map path: ${ path }` );
  }

  const object: Record<string, any> | Array<any> = current as ( Record<string, any> | Array<any> );

  if( !( lastSegment in object ) ){
    errorWriteStream.write( `
请求“${ pathName }”中：
Multipart map path does not exist: ${ path }
` );

    throw new Error( `请求“${ pathName }”中：Multipart map path does not exist: ${ path }` );
  }

  object[ lastSegment ] = value;
}

/**
 * 保存客户端上传的文件。
 *
 * @param {AsyncIterable<Uint8Array>} fileStream
 *
 * @param {string | URL} filePath
 *
 * @param {number} maxFileSize 用于限制单个文件的大小。单位是字节。
 *
 * @returns {Promise<number>}
 */
async function GraphQLServerForUploadFileStorage(
  fileStream: AsyncIterable<Uint8Array>,
  filePath: string | URL,
  maxFileSize: number,
  onFileCreated?: () => void,
): Promise<number>{
  let file: Deno.FsFile | undefined;

  try{
    file = await Deno.open( filePath, {
      createNew: true,
      write: true,
    } );

    // 只有 open 成功创建出本请求自己的文件后才登记，避免 createNew 失败时误删别的文件。
    onFileCreated?.();

    let size: number = 0;

    for await ( const chunk of
      fileStream ){
      size += chunk.byteLength;

      if( size > maxFileSize ){
        throw new Error( `所要保存的文件的大小不能超过程序设定的最大值（${ maxFileSize } 字节）。` );
      }

      let offset: number = 0;

      // Deno.FsFile.write 允许短写；循环直到当前 chunk 的所有字节都写入磁盘。
      while( offset < chunk.byteLength ){
        const written: number = await file.write( chunk.subarray( offset ) );

        if( written <= 0 ){
          throw new Error( '文件写入数据失败：write() 未写入任何字节。' );
        }

        offset += written;
      }
    }

    return size;
  }
  catch( error: unknown ){
    errorWriteStream.write( `
GraphQLServerForUploadFileStorage：文件写入失败。
文件路径：${ String( filePath ) }
错误信息：${ error instanceof Error ? error.message : String( error ) }
` );

    // 保留原始异常对象，便于上层识别 Deno.errors.NoSpace 等底层错误。
    throw error;
  }
  finally{
    file?.close();
  }
}

/**
 * 自定义一个Upload标量（Upload Scalar），用于GraphQL文件上传。
 */
const GraphQLServerForUploadScalar: GraphQLScalarType = new GraphQLScalarType( {
  /**
   * 此模式元素的 GraphQL 名称。
   */
  name: 'Upload',

  /**
   * 此架构元素的人类可读描述（如有提供）。
   */
  description: 'The `Upload` scalar type represents a file upload.',

  /**
   * 将外部提供的值强制转换为可用作输入的值。<br />
   * 类型参数：<br />
   * TInternal —— 该标量在运行时内部所采用的表示形式。<br />
   *
   * @param {unknown} inputValue
   *
   * @returns {T_GraphQLServerForUploadFile}
   */
  coerceInputValue<T_GraphQLServerForUploadFile>( inputValue: unknown ): T_GraphQLServerForUploadFile{
    if(
      IsObject( inputValue ) && !IsEmpty( inputValue )
      && ( 'fileName' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'mimeType' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'encoding' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'size' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'filePath' in ( inputValue as T_GraphQLServerForUploadFile ) )
    ){
      return inputValue as T_GraphQLServerForUploadFile;
    }
    else{
      errorWriteStream.write( `
GraphQLServerForUploadScalar.esm.mts--->coerceInputValue：
Upload value invalid. inputValue的值类型为：“${ GetDataType( inputValue ) }”。inputValue的值为：${ JSON.stringify( inputValue ) }
` );

      throw new GraphQLError( `Upload value invalid. inputValue的值类型为：“${ GetDataType( inputValue ) }”。inputValue的值为：${ JSON.stringify( inputValue ) }`, );
    }
  },

  /**
   * 将内部值强制转换为适合包含在响应中的形式。
   *
   * @param {unknown} outputValue
   *
   * @returns {never}
   */
  coerceOutputValue( outputValue: unknown ): never{
    errorWriteStream.write( `
GraphQLServerForUploadScalar.esm.mts--->coerceOutputValue：
Upload serialization unsupported. outputValue的数据类型为：“${ GetDataType( outputValue ) }”。outputValue的值为：${ JSON.stringify( outputValue ) }
` );

    throw new GraphQLError( `Upload serialization unsupported. outputValue的数据类型为：“${ GetDataType( outputValue ) }”。outputValue的值为：${ JSON.stringify( outputValue ) }`, );
  },

  /**
   * 将外部提供的常量字面值强制转换为输入值。
   *
   * @param {T_ConstValueNode} valueNode
   *
   * @returns {never}
   */
  coerceInputLiteral( valueNode: T_ConstValueNode ): never{
    errorWriteStream.write( `
GraphQLServerForUploadScalar.esm.mts--->coerceInputLiteral：
Upload literal unsupported. valueNode的数据类型为：“${ GetDataType( valueNode ) }”。valueNode的值为：${ JSON.stringify( valueNode ) }
` );

    throw new GraphQLError( `Upload literal unsupported. valueNode的数据类型为：“${ GetDataType( valueNode ) }”。valueNode的值为：${ JSON.stringify( valueNode ) }`, { nodes: valueNode, } );
  },
} );

export {
  type T_GraphQLServerForUploadFile,
  type T_GraphQLServerForMultipartOperations,

  GraphQLServerForExecuteBatch,
  GraphQLServerForIsMultipartRequest,
  GraphQLServerForMultipartParser,
  GraphQLServerForCleanupUploadedFiles,
  GraphQLServerForReleaseUploadedFiles,
  GraphQLServerForUploadScalar,
};

export default {
  GraphQLServerForExecuteBatch,
  GraphQLServerForIsMultipartRequest,
  GraphQLServerForMultipartParser,
  GraphQLServerForCleanupUploadedFiles,
  GraphQLServerForReleaseUploadedFiles,
  GraphQLServerForUploadScalar,
};
