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
  type T_GraphQLUploadFile,
  type T_GraphQLUploadFileOptions,

  DEFAULT_MAX_HEADER_SIZE,
  DEFAULT_MAX_HEADER_PAIRS,
  DEFAULT_MAX_PARTS,
  DEFAULT_MAX_FIELDS,
  DEFAULT_MAX_FIELD_NAME_SIZE,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_FIELD_SIZE,

  GetSafeFilename,
  GetStoredFilename,
} from './GraphQLServerForUploadFile.esm.mts';

import {
  type T_MultipartFilePart,

  IsMultipartRequest,
} from './GraphQLServerForMultipartUpload.esm.mts';

import {
  GraphQLServerForWriteFileStream,
} from './GraphQLServerForUploadFileStorage.esm.mts';

import {
  IsString,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

async function GraphQLServerForMultipartParser(
  request: Request,
  options: T_GraphQLUploadFileOptions,
): Promise<Request>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  if( !IsMultipartRequest( request ) ){
    throw new Error( `请求“${ pathName }”中的请求头里的“content-type”属性的值不为“multipart/form-data”，GraphQL文件上传功能仅支持请求头中的“content-type”属性的值为“multipart/form-data”。` );
  }

  if( !request.clone().body ){
    throw new Error( `请求“${ pathName }”中的请求体body不能为空！` );
  }

  const maxHeaderSize: number = options.maxHeaderSize ?? DEFAULT_MAX_HEADER_SIZE;
  const maxHeaderPairs: number = options.maxHeaderPairs ?? DEFAULT_MAX_HEADER_PAIRS;
  const maxParts: number = options.maxParts ?? DEFAULT_MAX_PARTS;
  const maxFields: number = options.maxFields ?? DEFAULT_MAX_FIELDS;
  const maxFieldNameSize: number = options.maxFieldNameSize ?? DEFAULT_MAX_FIELD_NAME_SIZE;
  const maxFileSize: number = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  const maxFiles: number = options.maxFiles ?? DEFAULT_MAX_FILES;
  const maxFieldSize: number = options.maxFieldSize ?? DEFAULT_MAX_FIELD_SIZE;

  await Deno.mkdir( options.uploadDir, {
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

    const fileParts: T_MultipartFilePart[] = [];

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

    busboy.on( 'file', (
      fieldname: string,
      stream: Readable,
      filename: string,
      transferEncoding: string,
      mimeType: string,
    ): void => {
      const safeFilename: string = GetSafeFilename( filename );

      const storedFilename: string = GetStoredFilename( safeFilename );

      const filepath: string = join( options.uploadDir, storedFilename );

      const file: T_GraphQLUploadFile = {
        filename: safeFilename,
        mimetype: mimeType,
        encoding: transferEncoding,
        size: 0,
        filepath,
      };

      const task: Promise<void> = ( async (): Promise<void> => {
        const readable: AsyncIterable<Uint8Array> = stream as AsyncIterable<Uint8Array>;

        file.size = await GraphQLServerForWriteFileStream(
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

        const fileByFieldName: Map<string, T_GraphQLUploadFile> = new Map<string, T_GraphQLUploadFile>();

        for( const part of
          fileParts ){
          fileByFieldName.set( part.fieldName, part.file );
        }

        for(
          const [ fileFieldName, variablePaths ]
          of
          Object.entries( mapObject )
          ){
          const file: T_GraphQLUploadFile | undefined = fileByFieldName.get( fileFieldName );

          if( !file ){
            throw new Error( `“${ fileFieldName }”对应的文件不存在！` );
          }

          if( !( Array.isArray( variablePaths ) && variablePaths.length > 0 ) ){
            throw new Error( `“${ fileFieldName }”对应的值的数据类型不是数组类型！而且不能为空数组！` );
          }

          for( const variablePath of
            variablePaths ){
            SetObjectPath( operationsObject, variablePath, file as T_GraphQLUploadFile );
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
    signal: request.signal,
  } );
}

// TODO 从这里开始审查代码！！！
function SetObjectPath( root: Record<string, any>, path: string, value: T_GraphQLUploadFile ): void{
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
  GraphQLServerForMultipartParser,
  SetObjectPath,
};

export default {
  GraphQLServerForMultipartParser,
  SetObjectPath,
};
