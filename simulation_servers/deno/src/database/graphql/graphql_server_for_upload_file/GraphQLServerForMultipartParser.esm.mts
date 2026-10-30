/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForMultipartParser.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之multipart解析器。
 */

'use strict';

import {
  join,
} from 'deno_std_path';

import {
  Readable,
} from 'node:stream';

import {
  type BusboyInstance,

  Busboy,
} from 'npm:@fastify/busboy';

import {
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

  GraphQLServerForGetSafeFileName,
  GraphQLServerForGetStoredFileName,
} from './GraphQLServerForUploadFile.esm.mts';

import {
  GraphQLServerForUploadFileStorage,
} from './GraphQLServerForUploadFileStorage.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import {
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

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

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

  if( !request.clone().body ){
    errorWriteStream.write( `
请求“${ pathName }”中的请求体body不能为空！
` );

    throw new Error( `请求“${ pathName }”中的请求体body不能为空！` );
  }

  await Deno.mkdir( uploadDir, {
    recursive: true,
  } );

  const operationsText: string = await new Promise<string>( async ( resolve, reject ): void => {
    const busboy: BusboyInstance = new Busboy( {
      headers: {
        'content-type': request.headers.get( 'content-type' ) ?? '',
      },
      limits: {
        headerSize: maxHeaderSize,
        headerPairs: maxHeaderPairs,
        parts: maxParts,
        fields: maxFields,
        fieldNameSize: maxFieldNameSize,
        fileSize: maxFileSize,
        files: maxFiles,
        fieldSize: maxFieldSize,
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
      const safeFilename: string = GraphQLServerForGetSafeFileName( filename );

      const storedFilename: string = GraphQLServerForGetStoredFileName( safeFilename );

      const filepath: string = join( uploadDir, storedFilename );

      const file: T_GraphQLServerForUploadFile = {
        filename: safeFilename,
        mimetype: mimeType,
        encoding: transferEncoding,
        size: 0,
        filepath,
      };

      const task: Promise<void> = ( async (): Promise<void> => {
        const readable: AsyncIterable<Uint8Array> = stream as AsyncIterable<Uint8Array>;

        file.size = await GraphQLServerForUploadFileStorage(
          readable,
          filepath,
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
        fail( new Error( `上传的文件（${ safeFilename }）的大小超过了程序的设定值（${ maxFileSize }，单位为字节）！` ) );
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
        fail( new Error( `多部分（Multipart）字段“${ fieldname }”的大小超出程序设置的限制值（${ maxFieldSize }）！` ) );

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
        const mapText: string | undefined = fields.get( 'map' );

        if( !( IsString( operations ) && ( operations as string ).trim().length > 0 ) ){
          throw new Error( `多部分（multipart）中缺少有效的字段“operations”。` );
        }

        if( !( IsString( mapText ) && ( mapText as string ).trim().length > 0 ) ){
          throw new Error( `多部分（multipart）中缺少有效的字段“map”。` );
        }

        const operationsObject: Record<string, any> = JSON.parse( operations );

        const mapObject: Record<string, string[]> = JSON.parse( mapText );

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
            throw new Error( `“${ fileFieldName }”对应的文件不存在！` );
          }

          if( !( Array.isArray( variablePaths ) && variablePaths.length > 0 ) ){
            throw new Error( `“${ fileFieldName }”对应的值的数据类型不是数组类型！而且不能为空数组！` );
          }

          for( const variablePath of
            variablePaths ){
            GraphQLServerForSetObjectPath( operationsObject, variablePath, file as T_GraphQLServerForUploadFile );
          }
        }

        resolve( JSON.stringify( operationsObject ) );
      }
      catch( error: unknown ){
        fail( error );
      }
    } );

    busboy.on( 'filesLimit', () => {
      fail(
        new Error(
          `Too many uploaded files. Maximum: ${ maxFiles }`,
        ),
      );
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

  return new Request( request.url, {
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

// TODO 从这里开始审查代码！！！
/**
 *
 * @param {Record<string, any>} root
 *
 * @param {string} path
 *
 * @param {T_GraphQLServerForUploadFile} value
 */
function GraphQLServerForSetObjectPath( root: Record<string, any>, path: string, value: T_GraphQLServerForUploadFile ): void{
  const segments = path.split( '.' );

  if( segments.length === 0 ){
    throw new Error( 'Invalid empty map path' );
  }

  for( const segment of
    segments ){
    if(
      segment === '__proto__' ||
      segment === 'prototype' ||
      segment === 'constructor'
    ){
      throw new Error( `Unsafe multipart map path: ${ path }` );
    }
  }

  let current: unknown = root;

  for(
    let index: number = 0;
    index < segments.length - 1;
    ++index
  ){
    const segment: string = segments[ index ];

    if(
      typeof current !== 'object' ||
      current === null
    ){
      throw new Error( `Invalid multipart map path: ${ path }` );
    }

    const object: Record<string, any> = current as Record<string, any>;

    if( !( segment in object ) ){
      throw new Error( `Multipart map path does not exist: ${ path }` );
    }

    current = object[ segment ];
  }

  const lastSegment: string = segments.at( -1 )!;

  if(
    typeof current !== 'object' ||
    current === null
  ){
    throw new Error( `Invalid multipart map path: ${ path }` );
  }

  const object: Record<string, any> = current as Record<string, any>;

  if( !( lastSegment in object ) ){
    throw new Error( `Multipart map path does not exist: ${ path }` );
  }

  object[ lastSegment ] = value;
}

export {
  type T_GraphQLServerForMultipartFilePart,
  type T_GraphQLServerForMultipartOperations,

  GraphQLServerForMultipartParser,
  GraphQLServerForIsMultipartRequest,
  GraphQLServerForSetObjectPath,
};

export default {
  GraphQLServerForMultipartParser,
  GraphQLServerForIsMultipartRequest,
  GraphQLServerForSetObjectPath,
};
