/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByBigFile.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 19:07:04 星期五
 */

'use strict';

import {
  extensionsByType,
  // @ts-ignore
} from 'DenoStd/media_types/mod.ts';

import {
  writableStreamFromWriter,
  // @ts-ignore
} from 'DenoStd/streams/mod.ts';

import {
  crypto,
  toHashString,
  // @ts-ignore
} from 'DenoStd/crypto/mod.ts';

import {
  uploadDir,

  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  myURLPathName,
  // @ts-ignore
} from './Condition.esm.mts';

// @ts-ignore
import FileSRI from 'upload/_FileSRI.json' assert { type: 'json', };

type TypeFileSRI001 = {
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

async function UploadByBigFile( request: Request ): Promise<Response>{
  const _request: Request = request.clone(),
    contentType: string = ( _request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase(),
    contentLength: string = ( _request.headers.get( 'content-length' ) ?? '' ).trim().toLowerCase(),
    extension: string[] | undefined = extensionsByType( contentType );

  let result: string;

  const boo001: boolean = contentType.length !== 0 && Array.isArray( extension ) && extension.length !== 0,
    boo002: boolean = contentLength.length !== 0 && Number( contentLength ) > 0;

  if( !request.clone().body ){
    result = JSON.stringify( {
      data: {
        success: false,
        message: `body为空，未上传任何数据。`,
      },
      messageStatus: resMessageStatus[ 1000 ],
    } );
  }
  else if( boo001 && boo002 ){
    try{
      const hash: ArrayBuffer = await crypto.subtle.digest( 'SHA3-512', ( request.clone().body as ReadableStream ) ),
        sri: string = toHashString( hash, 'hex' );

      const fileName: string = `${ sri }.${ ( extension as string[] )[ 0 ] as string }`,
        savePath: URL = new URL( `${ uploadDir }/big_files/${ fileName }` ),
        filePath: string = `${ myURLPathName }/big_files/${ fileName }`;

      // @ts-ignore
      Deno.mkdirSync( new URL( `${ uploadDir }/big_files` ), {
        recursive: true,
      } );

      const fileSRIInfo: boolean | TypeFileSRI001 = ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ sri ] ?? false;

      if( fileSRIInfo ){
        // @ts-ignore
        Deno.renameSync( new URL( fileSRIInfo.savePath ), savePath );

        ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ sri ] = Object.assign( {}, fileSRIInfo, {
          requestURL: decodeURI( _request.url ),
          savePath: savePath.href,
          filePath,
          fileType: contentType,
          fileLastModified: String( Date.now() ),
          fileName,
        } );

        // @ts-ignore
        Deno.writeTextFileSync( new URL( `${ uploadDir }/_FileSRI.json` ), JSON.stringify( FileSRI, null, ' ' ), {
          create: true,
        } );

        result = JSON.stringify( {
          data: {
            success: true,
            message: `已存在跟此大文件（文件类型：${ contentType }）的SRI值一致的大文件，故本次上传不写入此大文件。`,
            filePath: `${ ( fileSRIInfo as TypeFileSRI001 ).filePath }`,
          },
          messageStatus: resMessageStatus[ 200 ],
        } );
      }
      else{
        // @ts-ignore
        const file001: Deno.FsFile = await Deno.open( savePath, {
          write: true,
          create: true,
        } );

        await ( _request.body as ReadableStream ).pipeTo( writableStreamFromWriter( file001 ) );

        ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ sri ] = {
          shaType: 'SHA3-512',
          sri,
          requestURL: decodeURI( _request.url ),
          savePath: savePath.href,
          filePath,
          fileType: contentType,
          fileSize: String( contentLength ),
          fileLastModified: String( Date.now() ),
          fileName,
        };

        // @ts-ignore
        Deno.writeTextFileSync( new URL( `${ uploadDir }/_FileSRI.json` ), JSON.stringify( FileSRI, null, ' ' ), {
          create: true,
        } );

        result = JSON.stringify( {
          data: {
            success: true,
            message: `大文件（文件类型：${ contentType }）上传成功。`,
            filePath: `${ filePath }`,
          },
          messageStatus: resMessageStatus[ 200 ],
        } );
      }
    }
    catch( error: unknown ){
      result = JSON.stringify( {
        data: {
          success: false,
          message: `${ ( error as Error ).message }`,
        },
        messageStatus: resMessageStatus[ 9999 ],
      } );
    }
  }
  else if( boo001 && !boo002 ){
    result = JSON.stringify( {
      data: {
        success: false,
        message: `请求头中的“content-length”的值（${ contentLength }）不是有效的，可能是缺少该属性，或其值为0。`,
      },
      messageStatus: resMessageStatus[ 1004 ],
    } );
  }
  else{
    result = JSON.stringify( {
      data: {
        success: false,
        message: `请求头中的“content-type”的值（${ contentType }）不符合要求，必须是一个明确的、有效的“媒体类型”，诸如：'text/html; charset=UTF-8'、'application/json'等等。`,
      },
      messageStatus: resMessageStatus[ 1001 ],
    } );
  }

  return new Response( result, {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

export default UploadByBigFile;
