/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UpdateFileSRI.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-12 20:22:16 星期六
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
  shaType: string;
  sri: string;
  requestURL: string;
  savePath: string;
  filePath: string;
  fileType: string;
  fileSize: string;
  fileLastModified: string;
  fileName: string;
};

export type TypeObj001 = {
  isWriteFile: boolean;
  fileInfo: TypeFileSRI001;
  file: File | Blob | TypeCustomBlob;
};

type TypeCustomBlob = {
  [ Symbol.toStringTag ]: string;
  stream: () => ReadableStream;
  lastModified: string;
  type: string;
  size: string;
  name: string;
};

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
