/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UpdateFileSRI.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-12 20:22:16 星期六
 */

/**
 * 更新文件的SRI及其他信息。
 */

'use strict';

import {
  extension,
  typeByExtension,
} from 'deno_std_media_types';

import {
  encodeHex,
} from 'deno_std_encoding/hex.ts';

import {
  fileTypeFromBlob,
} from 'npm:file-type';

import {
  uploadDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  myURLPathName,
} from './Condition.esm.mts';

import {
  type T_QueryOneResult,
  type I_UploadFileSRISchema,

  InsertOne,
  UpdateOne,
  QueryOne,
} from 'mongo/simulation_servers_deno/upload_file_sri/UploadFileSRI.esm.mts';

export type T_Obj001 = {
  // true表示开始写入文件，反之，不用写入文件。
  isWriteFile: boolean;
  // 存放文件信息的对象。
  fileInfo: T_QueryOneResult;
  // 表示文件本体对象。
  file: T_CustomBlob;
};

// 自定义一个类型为“Blob”的自定义类型，使用时，必须存在其全部的属性。
export type T_CustomBlob = {
  // 可以是："Blob"、"File"。
  [ Symbol.toStringTag ]: 'Blob' | 'File';
  stream: () => ReadableStream<Uint8Array>;
  arrayBuffer: () => Promise<ArrayBuffer>;
  blob: () => Promise<Blob>;
  slice: ( start?: number, end?: number, contentType?: string ) => Promise<Blob>;
  formData?: () => Promise<FormData>;
  json?: () => Promise<any>;
  text: () => Promise<string>;
  // 文件的修改时间或服务器开始写入文件的时间。
  lastModified: string;
  // 文件的媒体类型，值格式，如：“application/json”之类的。
  type: string;
  // 文件大小，单位为字节。
  size: string;
  // 客户端上传的文件的原文件名（由客户端设置的），但可能没有，服务端会使用默认名给它。
  name: string;
};

/**
 * 获取文件的MIME。<br />
 * PS：<br />
 * 1、返回的要么是专门的MIME（如："application/json"、"text/html"等等），要么就是通用的标识：'application/octet-stream'，要么就是空字符串（极为少数会出现返回空字符串）。
 *
 * @param {Blob} blob 值类型为Blob的参数，无默认值，必须。
 *
 * @param {string} fileName 文件名，无默认值，必须。
 *
 * @returns {Promise<string>} 返回文件的MIME。要么是专门的MIME（如："application/json"、"text/html"等等），要么就是通用的标识：'application/octet-stream'，要么就是空字符串（极为少数会出现返回空字符串）。
 */
async function GetFileMIME( blob: Blob, fileName: string ): Promise<string>{
  let fileMIME: string;

  if( !fileName.includes( '.' ) ){
    fileMIME = ( await fileTypeFromBlob( blob ) )?.mime ?? 'application/octet-stream';
  }
  else{
    fileMIME = typeByExtension( ( fileName.split( '.' ).pop() ) as string ) ?? ( ( await fileTypeFromBlob( blob ) )?.mime ?? 'application/octet-stream' );
  }

  return fileMIME;
}

/**
 * 更新文件的SRI及其他信息。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @param {T_CustomBlob} file 表示文件的文件对象，其值类型是自定义类型T_CustomBlob，无默认值，必须。
 *
 * @param {string} fileName 文件名，如：001.png，带不带扩展名都行，最好带，必须。
 *
 * @returns {Promise<T_Obj001>} 返回一个自定义类型T_Obj001的对象。
 */
async function UpdateFileSRI( request: Request, file: T_CustomBlob, fileName: string ): Promise<T_Obj001>{
  const isForcedWrite: string = ( new URL( request.url ).searchParams.get( 'isForcedWrite' ) ?? '' ).trim().toLowerCase(),
    hash: ArrayBuffer = await crypto.subtle.digest( 'SHA-512', await file.arrayBuffer() ),
    sri: string = encodeHex( hash );

  let isWriteFile: boolean = true,
    savePath: URL,
    filePath: string,
    ext: string = '';

  if( fileName.includes( '.' ) ){
    ext = `.${ fileName.split( '.' ).pop() }`;
  }
  else if( file.type !== 'application/octet-stream' && extension( file.type ) ){
    ext = `.${ extension( file.type ) }`;
  }

  const fileName001: string = `${ sri }${ ext }`;

  if( ext.length !== 0 ){
    savePath = new URL( `${ uploadDir }/${ ext.slice( 1 ) }/${ fileName001 }` );

    filePath = `${ myURLPathName }/${ ext.slice( 1 ) }/${ fileName001 }`;

    Deno.mkdirSync( new URL( `${ uploadDir }/${ ext.slice( 1 ) }` ), {
      recursive: true,
    } );
  }
  else{
    savePath = new URL( `${ uploadDir }/${ fileName001 }` );

    filePath = `${ myURLPathName }/${ fileName001 }`;
  }

  let fileSRI: T_QueryOneResult = await QueryOne( sri );

  if( fileSRI ){
    isWriteFile = false;

    if( isForcedWrite === 'true' ){
      isWriteFile = true;

      Deno.renameSync( new URL( ( fileSRI as I_UploadFileSRISchema ).savePath ), savePath );

      Object.assign( fileSRI as I_UploadFileSRISchema, {
        shaType: 'SHA-512',
        sri,
        requestURL: decodeURI( request.url ),
        savePath: savePath.href,
        filePath,
        fileType: file.type,
        fileSize: String( file.size ),
        fileLastModified: String( file.lastModified ),
        fileName: fileName,
      } );

      await UpdateOne( fileSRI as I_UploadFileSRISchema );
    }
  }
  else{
    fileSRI = {
      shaType: 'SHA-512',
      sri,
      requestURL: decodeURI( request.url ),
      savePath: savePath.href,
      filePath,
      fileType: file.type,
      fileSize: String( file.size ),
      fileLastModified: String( file.lastModified ),
      fileName: fileName,
    } as I_UploadFileSRISchema;

    await InsertOne( fileSRI );
  }

  return {
    isWriteFile,
    fileInfo: fileSRI as I_UploadFileSRISchema,
    file,
  };
}

export {
  type I_UploadFileSRISchema,
} from 'mongo/simulation_servers_deno/upload_file_sri/UploadFileSRI.esm.mts';

export {
  GetFileMIME,
  UpdateFileSRI,
};

export default UpdateFileSRI;
