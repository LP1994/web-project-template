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

async function UploadByBinary( request: Request ): Promise<Response>{
  const _request: Request = request.clone();

  let result001: string = JSON.stringify( {
    data: {
      success: false,
      message: `body为空，未上传任何数据。`,
    },
    messageStatus: resMessageStatus[ 1000 ],
  } );

  const contentType = ( _request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase();

  if( _request.body && contentType.length !== 0 ){
    let blob: Blob;

    try{
      blob = await _request.blob();

      const {
        isWriteFile,
        fileInfo,
      }: TypeObj001 = await UpdateFileSRI( _request, blob );

      const {
        savePath,
        filePath,
        fileType,
      }: TypeFileSRI001 = fileInfo;

      if( !isWriteFile ){
        result001 = JSON.stringify( {
          data: {
            success: true,
            // @ts-ignore
            message: `已存在跟此文件（文件类型：${ fileType }）的SRI值一致的文件，故本次上传不写入此文件，但更新了此文件信息。`,
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

          await blob.stream().pipeTo( writableStreamFromWriter( file001 ) );

          result001 = JSON.stringify( {
            data: {
              success: true,
              // @ts-ignore
              message: `文件（文件类型：${ fileType }）上传成功。`,
              filePath: `${ filePath }`,
            },
            messageStatus: resMessageStatus[ 200 ],
          } );
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
