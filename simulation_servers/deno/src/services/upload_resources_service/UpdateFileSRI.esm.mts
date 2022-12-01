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

  // @ts-ignore
} from 'DenoStd/media_types/mod.ts';

import {
  crypto,
  toHashString,

  // @ts-ignore
} from 'DenoStd/crypto/mod.ts';

import {
  uploadDir,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  myURLPathName,

  // @ts-ignore
} from './Condition.esm.mts';

// @ts-ignore
import FileSRI from 'upload/_FileSRI.json' assert { type: 'json', };

export type TypeFileSRI001 = {
  // 表示使用的是哪种哈希算法来计算文件的SRI值，当前使用的是"SHA3-512"。
  shaType: string;
  // 文件的SRI值，全是小写字母组成的。
  sri: string;
  // 上传本文件时，发起的请求URL。
  requestURL: string;
  // 文件在服务端的存储路径。
  savePath: string;
  // 供客户端再次通过GET请求获取已经上传到服务器的文件的URL，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
  filePath: string;
  // 文件的媒体类型，值格式，如：“application/json”之类的。
  fileType: string;
  // 文件大小，单位为字节。
  fileSize: string;
  // 文件的修改时间或服务器开始写入文件的时间。
  fileLastModified: string;
  // 客户端上传的文件的原文件名（由客户端设置的），但可能没有，服务端会使用默认名给它。
  fileName: string;
};

export type TypeObj001 = {
  // true表示开始写入文件，反之，不用写入文件。
  isWriteFile: boolean;
  // 存放文件信息的对象。
  fileInfo: TypeFileSRI001;
  // 表示文件本体对象。
  file: File | Blob | TypeCustomBlob;
};

// 自定义一个类型为“Blob”的自定义类型，使用时，必须存在其全部的属性。
type TypeCustomBlob = {
  // 可以是："Blob"、"File"。
  [ Symbol.toStringTag ]: string;
  stream: () => ReadableStream;
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
 * 更新文件的SRI及其他信息。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @param {File | Blob | TypeCustomBlob} file 表示文件的文件对象，其值类型可以是File、Blob、自定义类型TypeCustomBlob（必须存在其全部的属性），无默认值，必须。
 *
 * @param {string} fileName 文件名，如：001.png，带不带扩展名都行，最好带，默认值为空字符串，可选。
 *
 * @returns {Promise<TypeObj001>} 返回一个自定义类型TypeObj001的对象。
 */
async function UpdateFileSRI( request: Request, file: File | Blob | TypeCustomBlob, fileName: string = '' ): Promise<TypeObj001>{
  /*
   File：
   name--->2.avif
   type--->image/avif
   size--->1095740
   lastModified--->1668106823045

   Blob：
   type--->image/avif
   size--->1095740
   */

  let fileName001: string = fileName;

  const isForcedWrite: string = ( new URL( request.url ).searchParams.get( 'isForcedWrite' ) ?? '' ).trim()
  .toLowerCase();

  const hash: ArrayBuffer = await crypto.subtle.digest( 'SHA3-512', file.stream() ),
    sri: string = toHashString( hash, 'hex' );

  let isWriteFile: boolean = true,
    fileInfo: TypeFileSRI001;

  if( Object.prototype.toString.call( file ) === '[object Blob]' ){
    // @ts-ignore
    file.lastModified = String( Date.now() );
  }

  // @ts-ignore
  const fileExtensionName: string = ( extension( file.type ) ?? '' ) as string;

  fileName = `${ sri }${ fileExtensionName.length === 0
                         ? ``
                         : `.${ fileExtensionName }` }`;

  if( file.type === 'application/octet-stream' && fileName001.length !== 0 && fileName001.includes( '.' ) ){
    fileName = `${ sri }.${ fileName001.split( '.' ).at( -1 ) }`;
  }

  if( fileName001.length === 0 ){
    fileName001 = fileName;
  }

  let savePath: URL,
    filePath: string;

  if( file.type === 'application/octet-stream' || fileExtensionName.length === 0 ){
    savePath = new URL( `${ uploadDir }/${ fileName }` );

    filePath = `${ myURLPathName }/${ fileName }`;
  }
  else{
    savePath = new URL( `${ uploadDir }/${ fileExtensionName }/${ fileName }` );

    filePath = `${ myURLPathName }/${ fileExtensionName }/${ fileName }`;

    // @ts-ignore
    Deno.mkdirSync( new URL( `${ uploadDir }/${ fileExtensionName }` ), {
      recursive: true,
    } );
  }

  if( sri in ( FileSRI as { [ key: string ]: TypeFileSRI001; } ) ){
    isWriteFile = false;

    fileInfo = ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ sri ] as TypeFileSRI001;

    // @ts-ignore
    Deno.renameSync( new URL( fileInfo.savePath ), savePath );

    if( isForcedWrite === 'true' ){
      isWriteFile = true;

      ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ sri ] = fileInfo = {
        shaType: 'SHA3-512',
        sri,
        requestURL: decodeURI( request.url ),
        savePath: savePath.href,
        filePath,
        fileType: file.type,
        fileSize: String( file.size ),
        // @ts-ignore
        fileLastModified: String( file.lastModified ),
        fileName: fileName001,
      };
    }
    else{
      ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ sri ] = fileInfo = Object.assign( {}, fileInfo, {
        requestURL: decodeURI( request.url ),
        savePath: savePath.href,
        filePath,
        fileType: file.type,
        // @ts-ignore
        fileLastModified: String( file.lastModified ),
        fileName: fileName001,
      } );
    }
  }
  else{
    ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ sri ] = fileInfo = {
      shaType: 'SHA3-512',
      sri,
      requestURL: decodeURI( request.url ),
      savePath: savePath.href,
      filePath,
      fileType: file.type,
      fileSize: String( file.size ),
      // @ts-ignore
      fileLastModified: String( file.lastModified ),
      fileName: fileName001,
    };
  }

  // @ts-ignore
  Deno.writeTextFileSync( new URL( `${ uploadDir }/_FileSRI.json` ), JSON.stringify( FileSRI, null, ' ' ), {
    create: true,
  } );

  return {
    isWriteFile,
    fileInfo,
    file,
  };
}

export {
  UpdateFileSRI,
};

export default UpdateFileSRI;
