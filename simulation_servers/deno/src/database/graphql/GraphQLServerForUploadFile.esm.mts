/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/GraphQLServerForUploadFile.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能。
 */

'use strict';

import {
  basename,
  extname,
  join,
} from 'deno_std_path';

import {
  createHash,
} from 'node:crypto';

import {
  Readable,
} from 'node:stream';

import {
  type BusboyInstance,

  Busboy,
} from 'npm:@fastify/busboy';

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
  HttpResponseHeadersFun,
  HTTPStatus,
  uploadDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import {
  IsAsyncFun,
  IsAsyncGeneratorFun,
  IsFunction,
  IsGeneratorFun,
  GetDataType,
  IsArray,
  IsEmpty,
  IsObject,
  IsString,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

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

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 * 解析成功后，将清理会话关联到转换后的 Request。
 * WeakMap 不会因为保存 Request 而阻止 Request 被垃圾回收。
 */
const uploadCleanupSessionByRequest: WeakMap<Request, T_GraphQLServerForUploadCleanupSession> = new WeakMap<Request, T_GraphQLServerForUploadCleanupSession>();

/**
 * 删除一次上传请求创建的所有文件。该函数是幂等的，可被多个错误分支重复调用。
 * 调用方必须先确保对应的 fileTasks 已全部结束，避免 Windows 上因文件句柄仍打开而删除失败。
 */
async function GraphQLServerForCleanupUploadSession( session: T_GraphQLServerForUploadCleanupSession ): Promise<void>{
  if( session.cleanupPromise ){
    await session.cleanupPromise;
  }
  else{
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
}

/**
 * GraphQL HTTP 处理失败时，由 GraphQLServer 调用此函数删除本次请求已写入的文件。
 */
async function GraphQLServerForCleanupUploadedFiles( request: Request ): Promise<void>{
  const session: T_GraphQLServerForUploadCleanupSession | undefined = uploadCleanupSessionByRequest.get( request );

  if( session ){
    await GraphQLServerForCleanupUploadSession( session as T_GraphQLServerForUploadCleanupSession );

    uploadCleanupSessionByRequest.delete( request );
  }
}

/**
 * 批量处理。
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
  }: T_GraphQLServerForUploadFileOptions = {} as T_GraphQLServerForUploadFileOptions,
): Promise<Request>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  if( !GraphQLServerForIsMultipartRequest( request ) ){
    errorWriteStream.write( `
请求“${ pathName }”中的请求头里的“content-type”属性的值不为“multipart/form-data”，或不是以该值为开头。GraphQL文件上传功能仅支持请求头中的“content-type”属性的值为“multipart/form-data”，或是以该值为开头的。且该请求方式必须是“post”请求。
` );

    throw new Error( `请求“${ pathName }”中的请求头里的“content-type”属性的值不为“multipart/form-data”，或不是以该值为开头。GraphQL文件上传功能仅支持请求头中的“content-type”属性的值为“multipart/form-data”，或是以该值为开头的。且该请求方式必须是“post”请求。` );
  }

  if( !request.clone().body ){
    errorWriteStream.write( `
请求“${ pathName }”中的请求体body不能为空！
` );

    throw new Error( `请求“${ pathName }”中的请求体body不能为空！` );
  }

  if( request.signal.aborted ){
    errorWriteStream.write( `
请求“${ pathName }”在开始解析前已经中断！
` );

    throw new DOMException( `请求“${ pathName }”在开始解析前已经中断。`, 'AbortError' );
  }

  await Deno.mkdir( uploadDir, {
    recursive: true,
  } );

  const cleanupSession: T_GraphQLServerForUploadCleanupSession = {
    filePaths: new Set<string>(),
    fileStreams: new Set<Readable>(),
  };

  const fields: Map<string, string> = new Map<string, string>(),
    fileParts: T_GraphQLServerForMultipartFilePart[] = [],
    fileTasks: Promise<void>[] = [],
    fileByFieldName: Map<string, T_GraphQLServerForUploadFile> = new Map<string, T_GraphQLServerForUploadFile>();

  let abortHandler: () => void | undefined;

  try{
    const operationsText: string = await new Promise<string>( (
      resolve: ( value: string ) => void,
      reject: ( reason?: unknown ) => void
    ): void => {
      let busboy: BusboyInstance = new Busboy( {
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

      const fields: Map<string, string> = new Map<string, string>();

      const fileParts: T_GraphQLServerForMultipartFilePart[] = [];

      const fileTasks: Promise<void>[] = [];

      let hasError: boolean = false;

      const fail: ( error: unknown ) => void = ( error: unknown ): void => {
        if( hasError ){
          return;
        }

        hasError = true;

        reject(
          error instanceof Error
          ? error
          : new Error( String( error ) )
        );
      };

      /**
       * 每当发现新的文件表单字段时，就会触发此事件。<br />
       * 注意：<br />
       * 1、如果监听了此事件，无论你是否关心文件内容，都务必处理该数据流（例如，若想丢弃文件内容，只需调用 `stream.resume()` 即可）；否则，Busboy 实例将永远不会触发 `finish` 事件。<br />
       * 2、不过，如果你完全不关心传入的文件，只需不去监听 `file` 事件即可，所有文件都会被自动且安全地丢弃（注意：这些被丢弃的文件仍会被计入文件数量和数据部分数量的限制中）。<br />
       * 3、如果文件大小达到了预设的限制，数据流对象会包含一个名为 `truncated` 的布尔属性（建议在数据流结束时进行检查），同时还会触发 `limit` 事件，以通知你已达到限制。<br />
       */
      busboy.on( 'file', (
        fieldname: string,
        stream: Readable,
        filename: string,
        /**
         * 包含文件流的“Content-Transfer-Encoding”值。
         */
        transferEncoding: string,
        /**
         * 包含文件流的“Content-Type”值。
         */
        mimeType: string,
      ): void => {
        const safeFileName: string = GraphQLServerForGetSafeFileName( filename );

        const storedFileName: string = GraphQLServerForGetStoredFileName( safeFileName );

        const filePath: string = join( uploadDir, storedFileName );

        const file: T_GraphQLServerForUploadFile = {
          fileName: safeFileName,
          mimeType: mimeType,
          encoding: transferEncoding,
          size: 0,
          filePath,
        };

        const task: Promise<void> = ( async (): Promise<void> => {
          file.size = await GraphQLServerForUploadFileStorage(
            stream as AsyncIterable<Uint8Array>,
            filePath,
            maxFileSize,
          );

          fileParts.push( {
            fieldName: fieldname,
            file,
          } );
        } )();

        fileTasks.push( task );

        task.catch( fail );

        stream.on( 'limit', (): void => {
          errorWriteStream.write( `
请求“${ pathName }”中上传的文件（${ safeFileName }）的大小超过了程序的设定值（${ maxFileSize }，单位为字节）！
` );

          fail( new Error( `请求“${ pathName }”中上传的文件（${ safeFileName }）的大小超过了程序的设定值（${ maxFileSize }，单位为字节）！` ) );
        } );
      } );

      /**
       * 每发现一个非文件类型的新字段时触发。
       */
      busboy.on( 'field', (
        fieldname: string,
        value: string,
        fieldnameTruncated: string,
        valueTruncated: boolean,
        transferEncoding: string,
        mimeType: string,
      ): void => {
        if( valueTruncated ){
          errorWriteStream.write( `
请求“${ pathName }”中多部分（Multipart）字段“${ fieldname }”的值的大小超出程序设置的限制值（${ maxFieldSize }）！
` );

          fail( new Error( `请求“${ pathName }”中多部分（Multipart）字段“${ fieldname }”的值的大小超出程序设置的限制值（${ maxFieldSize }）！` ) );

          return;
        }

        fields.set( fieldname, value );
      } );

      busboy.on( 'finish', async (): Promise<void> => {
        if( hasError ){
          return;
        }

        try{
          await Promise.all( fileTasks );

          const operations: string | undefined = fields.get( 'operations' );
          const map: string | undefined = fields.get( 'map' );

          if( !( IsString( operations ) && ( operations as string ).trim().length > 0 ) ){
            errorWriteStream.write( `
请求“${ pathName }”中的请求体body中的多部分（multipart）里缺少有效的字段“operations”。
` );

            throw new Error( `请求“${ pathName }”中的请求体body中的多部分（multipart）里缺少有效的字段“operations”。` );
          }

          if( !( IsString( map ) && ( map as string ).trim().length > 0 ) ){
            errorWriteStream.write( `
请求“${ pathName }”中的请求体body中的多部分（multipart）里缺少有效的字段“map”。
` );

            throw new Error( `请求“${ pathName }”中的请求体body中的多部分（multipart）里缺少有效的字段“map”。` );
          }

          const operationsObject: T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations> = JSON.parse( operations ) as ( T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations> );

          const mapObject: Record<string, string[]> = JSON.parse( map ) as Record<string, string[]>;

          const fileByFieldName: Map<string, T_GraphQLServerForUploadFile> = new Map<string, T_GraphQLServerForUploadFile>();

          for( const part of
            fileParts ){
            fileByFieldName.set( part.fieldName, part.file );
          }

          for(
            const [ fileFieldName, variablePaths ]
            of
            Object.entries( mapObject )
            ){
            const file: T_GraphQLServerForUploadFile | undefined = fileByFieldName.get( fileFieldName );

            if( !file ){
              errorWriteStream.write( `
请求“${ pathName }”中“${ fileFieldName }”对应的文件不存在！
` );

              throw new Error( `请求“${ pathName }”中“${ fileFieldName }”对应的文件不存在！` );
            }

            if( !( Array.isArray( variablePaths ) && ( variablePaths as string[] ).length > 0 ) ){
              errorWriteStream.write( `
请求“${ pathName }”中“${ fileFieldName }”对应的值的数据类型必须得是数组类型！而且不能为空数组！
` );

              throw new Error( `请求“${ pathName }”中“${ fileFieldName }”对应的值的数据类型必须得是数组类型！而且不能为空数组！` );
            }

            for( const variablePath of
              variablePaths ){
              GraphQLServerForSetObjectPath( request, operationsObject, variablePath, file as T_GraphQLServerForUploadFile );
            }
          }

          resolve( JSON.stringify( operationsObject ) );
        }
        catch( error: unknown ){
          fail( error );
        }
      } );

      /**
       * 当达到指定的文件数量限制时触发。此后将不再触发“file”事件。
       */
      busboy.on( 'filesLimit', (): void => {
        errorWriteStream.write( `
请求“${ pathName }”中的请求体body中的“文件（file）”数超过程序设定的最大数量（${ maxFiles }）！
` );

        fail( new Error( `请求“${ pathName }”中的请求体body中的“文件（file）”数超过程序设定的最大数量（${ maxFiles }）！` ) );
      } );

      /**
       * 当达到指定的字段数量上限时触发。此后将不再触发“字段”事件。
       */
      busboy.on( 'fieldsLimit', (): void => {
        errorWriteStream.write( `
请求“${ pathName }”中的请求体body中的“字段（field）”数超过程序设定的最大数量（${ maxFields }）！
` );

        fail( new Error( `请求“${ pathName }”中的请求体body中的“字段（field）”数超过程序设定的最大数量（${ maxFields }）！` ) );
      } );

      busboy.on( 'error', fail );

      const nodeRequest: Readable = Readable.fromWeb( request.body );

      nodeRequest.on( 'error', fail );

      nodeRequest.pipe( busboy );
    } );

    const headers: Headers = new Headers( request.headers );

    headers.set( 'content-type', 'application/json; charset=utf-8' );

    headers.delete( 'content-length' );
    headers.delete( 'transfer-encoding' );

    const graphqlRequest: Request = new Request( request.url, {
      method: request.method,
      headers,
      body: operationsText,
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
    } );

    uploadCleanupSessionByRequest.set( graphqlRequest, cleanupSession );

    return graphqlRequest;
  }
  catch( error: unknown ){
    await Promise.allSettled( fileTasks );

    fields.clear();

    fileParts.length = 0;

    fileTasks.length = 0;

    fileByFieldName.clear();

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

/**
 * GraphQL HTTP 处理成功时，仅释放清理追踪缓存，不删除已经成功接收的文件。
 */
function GraphQLServerForReleaseUploadedFiles( request: Request ): void{
  const session: T_GraphQLServerForUploadCleanupSession | undefined = uploadCleanupSessionByRequest.get( request );

  if( session ){
    ( session as T_GraphQLServerForUploadCleanupSession ).filePaths.clear();

    ( session as T_GraphQLServerForUploadCleanupSession ).fileStreams.clear();

    uploadCleanupSessionByRequest.delete( request );
  }
}

function GraphQLServerForNormalizeUploadError( error: unknown ): Error{
  return error instanceof Error
         ? error
         : new Error( String( error ) );
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
 * @param {AsyncIterable<Uint8Array>} fileStream 客户端上传上来的文件数据。
 *
 * @param {string | URL} filePath 保存在磁盘上的文件路径。
 *
 * @param {number} maxFileSize 用于限制单个文件的大小。单位是字节。
 *
 * @param {{onFileCreated?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void, onFileWriting?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, chunk: Uint8Array, currentFileWritedSize: number) => void, onFileWrited?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, fileSize: number) => void, onFileClosed?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void}} param3
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void} param3.onFileCreated 该函数会在文件创建成功后被调用，注意！这个阶段，文件是还没写入任何数据的，仅是创建并打开了该文件。<br />
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, chunk: Uint8Array, currentFileWritedSize: number) => void} param3.onFileWriting 该函数会在每次文件写入一部分数据后被调用。<br />
 * PS：<br />
 * 1、函数参数currentFileWritedSize：表示当前文件已经写入的总数据大小（单位为字节）。<br />
 * 2、函数参数chunk：表示当前这次写入文件的数据块，想知道当前这次写入文件的数据块的大小，可以通过chunk.byteLength获取，其单位为字节。<br />
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, fileSize: number) => void} param3.onFileWrited 该函数会在文件写入全部数据完成后被调用。<br />
 * PS：<br />
 * 1、函数参数fileSize：表示文件写入全部数据完成后，文件的大小（单位为字节）。<br />
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void} param3.onFileClosed 该函数会在文件关闭后被调用。<br />
 *
 * @returns {Promise<number>}
 */
async function GraphQLServerForUploadFileStorage(
  fileStream: AsyncIterable<Uint8Array>,
  filePath: string | URL,
  maxFileSize: number,
  {
    onFileCreated = (): void => {
    },
    onFileWriting = (): void => {
    },
    onFileWrited = (): void => {
    },
    onFileClosed = (): void => {
    },
  }: {
    onFileCreated?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array> ) => void;
    onFileWriting?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array>, chunk: Uint8Array, currentFileWritedSize: number ) => void;
    onFileWrited?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array>, fileSize: number ) => void;
    onFileClosed?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array> ) => void;
  } = {},
): Promise<number>{
  let file: Deno.FsFile | undefined;

  try{
    file = await Deno.open( filePath, {
      createNew: true,
      write: true,
    } );

    if( IsAsyncFun( onFileCreated ) || IsAsyncGeneratorFun( onFileCreated ) ){
      await onFileCreated( file, filePath, fileStream );
    }
    else if( IsFunction( onFileCreated ) || IsGeneratorFun( onFileCreated ) ){
      onFileCreated( file, filePath, fileStream );
    }

    let size: number = 0;

    for await ( const chunk of
      fileStream ){
      if( chunk.byteLength === 0 ){
        continue;
      }

      size += chunk.byteLength;

      if( size > maxFileSize ){
        errorWriteStream.write( `
GraphQLServerForUploadFileStorage：
所要保存的文件的大小不能超过程序设定的最大值，当前程序设置的最大值为（单位为字节）：${ maxFileSize }。
` );

        throw new Error( `所要保存的文件的大小不能超过程序设定的最大值，当前程序设置的最大值为（单位为字节）：${ maxFileSize }。` );
      }

      let offset: number = 0;

      while( offset < chunk.byteLength ){
        const written: number = await file.write( chunk.subarray( offset ) );

        if( written <= 0 ){
          errorWriteStream.write( `
GraphQLServerForUploadFileStorage：
文件写入数据失败：write() 未写入任何字节！
` );

          throw new Error( '文件写入数据失败：write() 未写入任何字节！' );
        }

        offset += written;

        if( IsAsyncFun( onFileWriting ) || IsAsyncGeneratorFun( onFileWriting ) ){
          await onFileWriting( file, filePath, fileStream, chunk, size );
        }
        else if( IsFunction( onFileWriting ) || IsGeneratorFun( onFileWriting ) ){
          onFileWriting( file, filePath, fileStream, chunk, size );
        }
      }
    }

    if( IsAsyncFun( onFileWrited ) || IsAsyncGeneratorFun( onFileWrited ) ){
      await onFileWrited( file, filePath, fileStream, size );
    }
    else if( IsFunction( onFileWrited ) || IsGeneratorFun( onFileWrited ) ){
      onFileWrited( file, filePath, fileStream, size );
    }

    return size;
  }
  catch( error: unknown ){
    errorWriteStream.write( `
GraphQLServerForUploadFileStorage，文件写入失败：
文件路径：${ String( filePath ) }
错误信息：${ error instanceof Error
            ? error.message
            : String( error ) }
` );

    throw error;
  }
  finally{
    if( file ){
      ( file as Deno.FsFile ).close();

      onFileClosed( file, filePath, fileStream );
    }
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
GraphQLServerForUploadScalar--->coerceInputValue：
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
GraphQLServerForUploadScalar--->coerceOutputValue：
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
GraphQLServerForUploadScalar--->coerceInputLiteral：
Upload literal unsupported. valueNode的数据类型为：“${ GetDataType( valueNode ) }”。valueNode的值为：${ JSON.stringify( valueNode ) }
` );

    throw new GraphQLError( `Upload literal unsupported. valueNode的数据类型为：“${ GetDataType( valueNode ) }”。valueNode的值为：${ JSON.stringify( valueNode ) }`, { nodes: valueNode, } );
  },
} );

export {
  type T_GraphQLServerForMultipartFilePart,
  type T_GraphQLServerForMultipartOperations,
  type T_GraphQLServerForUploadCleanupSession,
  type T_GraphQLServerForUploadFile,
  type T_GraphQLServerForUploadFileOptions,

  DEFAULT_MAX_FIELD_NAME_SIZE,
  DEFAULT_MAX_FIELD_SIZE,
  DEFAULT_MAX_FIELDS,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_HEADER_PAIRS,
  DEFAULT_MAX_HEADER_SIZE,
  DEFAULT_MAX_PARTS,
  DEFAULT_UPLOAD_DIR,

  GraphQLServerForCleanupUploadSession,
  GraphQLServerForCleanupUploadedFiles,
  GraphQLServerForExecuteBatch,
  GraphQLServerForGetSafeFileName,
  GraphQLServerForGetStoredFileName,
  GraphQLServerForIsMultipartRequest,
  GraphQLServerForMultipartParser,
  GraphQLServerForReleaseUploadedFiles,
  GraphQLServerForNormalizeUploadError,
  GraphQLServerForSetObjectPath,
  GraphQLServerForUploadFileStorage,
  GraphQLServerForUploadScalar,
};

export default {
  DEFAULT_MAX_FIELD_NAME_SIZE,
  DEFAULT_MAX_FIELD_SIZE,
  DEFAULT_MAX_FIELDS,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_HEADER_PAIRS,
  DEFAULT_MAX_HEADER_SIZE,
  DEFAULT_MAX_PARTS,
  DEFAULT_UPLOAD_DIR,

  GraphQLServerForCleanupUploadSession,
  GraphQLServerForCleanupUploadedFiles,
  GraphQLServerForExecuteBatch,
  GraphQLServerForGetSafeFileName,
  GraphQLServerForGetStoredFileName,
  GraphQLServerForIsMultipartRequest,
  GraphQLServerForMultipartParser,
  GraphQLServerForReleaseUploadedFiles,
  GraphQLServerForNormalizeUploadError,
  GraphQLServerForSetObjectPath,
  GraphQLServerForUploadFileStorage,
  GraphQLServerForUploadScalar,
};
