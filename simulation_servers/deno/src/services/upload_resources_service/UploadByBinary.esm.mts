/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByBinary.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:16 星期五
 */

/**
 * 单文件上传（客户端上传的body不使用FormData包装，直接就是一个File、Blob、二进制流等类型）。
 *
 * 1、客户端上传的body不使用FormData包装，直接就是一个File、Blob、二进制流等类型。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=binary”。
 */

'use strict';

import {
  writableStreamFromWriter,
  // @ts-ignore
} from 'DenoStd/streams/mod.ts';

import {
  uploadDir,

  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  type TypeObj001,
  type TypeFileSRI001,

  UpdateFileSRI,
  // @ts-ignore
} from './UpdateFileSRI.esm.mts';

// @ts-ignore
import FileSRI from 'upload/_FileSRI.json' assert { type: 'json', };

async function UploadByBinary( request: Request ): Promise<Response>{
  const _request: Request = request.clone();

  let result001: string = JSON.stringify( {
    data: {
      success: false,
      message: `body为空，未上传任何数据。`,
    },
    messageStatus: resMessageStatus[ 1000 ],
  } );

  const contentType: string = ( _request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase(),
    contentLength: string = ( _request.headers.get( 'content-length' ) ?? '' ).trim().toLowerCase();

  if( _request.body && contentType.length !== 0 ){
    try{
      let fileName: string = decodeURI( ( new URL( _request.url ).searchParams.get( 'fileName' ) ?? '' ).trim() );

      if( fileName.length === 0 ){
        fileName = `Binary_File`;
      }

      const {
        isWriteFile,
        fileInfo,
      }: TypeObj001 = await UpdateFileSRI( _request, {
        [ Symbol.toStringTag ]: 'Blob',
        stream: (): ReadableStream => request.clone().body as ReadableStream,
        lastModified: String( Date.now() ),
        type: String( contentType ),
        size: String( contentLength ),
        name: fileName,
      }, fileName );

      const {
        savePath,
        filePath,
        fileType,
        sri,
        fileName: fileName001,
      }: TypeFileSRI001 = fileInfo;

      if( !isWriteFile ){
        result001 = JSON.stringify( {
          data: {
            success: true,
            // @ts-ignore
            message: `已存在跟此文件（${ fileName001 }，文件类型：${ fileType }）的SRI值一致的文件，故本次上传不写入此文件。`,
            filePath: `${ filePath }`,
          },
          messageStatus: resMessageStatus[ 200 ],
        } );
      }
      else{
        try{
          // @ts-ignore
          const file001: Deno.FsFile = await Deno.open( new URL( savePath ), {
            write: true,
            create: true,
          } );

          await _request.body.pipeTo( writableStreamFromWriter( file001 ) );

          result001 = JSON.stringify( {
            data: {
              success: true,
              // @ts-ignore
              message: `文件（${ fileName001 }，文件类型：${ fileType }）上传成功。`,
              filePath: `${ filePath }`,
            },
            messageStatus: resMessageStatus[ 200 ],
          } );
        }
        catch( error: unknown ){
          // @ts-ignore
          delete FileSRI[ sri ];

          // @ts-ignore
          Deno.writeTextFileSync( new URL( `${ uploadDir }/_FileSRI.json` ), JSON.stringify( FileSRI, null, ' ' ), {
            create: true,
          } );

          result001 = JSON.stringify( {
            data: {
              success: false,
              message: `${ ( error as Error ).message }`,
            },
            messageStatus: resMessageStatus[ 9999 ],
          } );
        }
      }
    }
    catch( error: unknown ){
      result001 = JSON.stringify( {
        data: {
          success: false,
          message: `${ ( error as Error ).message }`,
        },
        messageStatus: resMessageStatus[ 9999 ],
      } );
    }
  }
  else if( _request.body && contentType.length === 0 ){
    result001 = JSON.stringify( {
      data: {
        success: false,
        message: `请求头中的“content-type”的值不能为空。`,
      },
      messageStatus: resMessageStatus[ 1001 ],
    } );
  }

  return new Response( result001, {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

export default UploadByBinary;
