/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadBySingle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:16 星期五
 */

/**
 * 单文件上传。
 *
 * 1、客户端上传的body必须是用FormData包装。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=single”。
 * 3、FormData中必须要有的字段：
 *    uploadType：值为'single'。
 *    file：其值类型可以是File、Blob二者之一。
 * 4、可选字段有：
 * fileName：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行。
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

async function UploadBySingle( request: Request ): Promise<Response>{
  const _request: Request = request.clone();

  let result001: string = JSON.stringify( {
    data: {
      success: false,
      message: `body为空，未上传任何数据。`,
    },
    messageStatus: resMessageStatus[ 1000 ],
  } );

  if( _request.body ){
    const contentType = ( _request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase();

    if( contentType.startsWith( 'multipart/form-data;' ) ){
      let formData: FormData;

      try{
        formData = await _request.formData();

        let file: File | Blob | string | null = formData.get( 'file' ),
          fileName: string = ( formData.get( 'fileName' ) ?? '' ) as string;

        const str001: string = Object.prototype.toString.call( file );

        if( str001 === '[object File]' || str001 === '[object Blob]' ){
          const {
            isWriteFile,
            fileInfo,
          }: TypeObj001 = await UpdateFileSRI( _request, file as ( File | Blob ), fileName );

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
                message: `已存在跟此文件（${ file.name }，文件类型：${ fileType }）的SRI值一致的文件，故本次上传不写入此文件，但更新了此文件信息。`,
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

              await ( file as File ).stream().pipeTo( writableStreamFromWriter( file001 ) );

              result001 = JSON.stringify( {
                data: {
                  success: true,
                  // @ts-ignore
                  message: `文件（${ file.name }，文件类型：${ fileType }）上传成功。`,
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
        else{
          result001 = JSON.stringify( {
            data: {
              success: false,
              message: `客户端上传的不是一个File或Blob类型的数据，其数据类型为“${ str001 }”。`,
            },
            messageStatus: resMessageStatus[ 1002 ],
          } );
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
    else{
      result001 = JSON.stringify( {
        data: {
          success: false,
          message: `请求体中的“content-type”值（${ contentType }）不是服务端要求的类型（multipart/form-data），可能客户端上传的body不是“FormData”类型或客户端设置了不正确的“content-type”值。`,
        },
        messageStatus: resMessageStatus[ 1001 ],
      } );
    }
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

export default UploadBySingle;
