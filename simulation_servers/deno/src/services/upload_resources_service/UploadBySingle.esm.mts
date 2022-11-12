/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadBySingle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:16 星期五
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

  if( _request.body ){
    const contentType = ( _request.headers.get( 'content-type' ) ?? '' ).trim();

    if( contentType.startsWith( 'multipart/form-data;' ) ){
      let formData: FormData;

      try{
        formData = await _request.formData();

        let file: File | string | null = formData.get( 'file' ),
          fileName: string = ( formData.get( 'fileName' ) ?? '' ) as string;

        const str001: string = Object.prototype.toString.call( file );

        if( str001 === '[object File]' || str001 === '[object Blob]' ){
          const {
            isWriteFile,
            fileInfo,
          }: TypeObj001 = await UpdateFileSRI( _request, file, fileName );

          const {
            savePath,
            filePath,
            fileType,
            fileName: fileName001,
          }: TypeFileSRI001 = fileInfo;

          fileName = fileName001;

          if( !isWriteFile ){
            return new Response( JSON.stringify( {
              data: {
                message: `已存在跟此文件的SRI值一致的文件（${ fileName }，文件类型：${ fileType }），本次上传不写入文件，但更新了文件信息。`,
                filePath: `${ filePath }`,
              },
              message: resMessageStatus[ 200 ],
            } ), {
              status: 200,
              statusText: 'OK',
              headers: {
                ...httpHeaders,
                'content-type': 'application/json; charset=utf-8',
              },
            } );
          }

          try{
            // @ts-ignore
            const file001: Deno.FsFile = await Deno.open( new URL( savePath ), {
              write: true,
              create: true,
            } );

            await ( file as File ).stream().pipeTo( writableStreamFromWriter( file001 ) );

            return new Response( JSON.stringify( {
              data: {
                // @ts-ignore
                message: `文件（${ fileName }，文件类型：${ fileType }）上传成功。`,
                filePath: `${ filePath }`,
              },
              message: resMessageStatus[ 200 ],
            } ), {
              status: 200,
              statusText: 'OK',
              headers: {
                ...httpHeaders,
                'content-type': 'application/json; charset=utf-8',
              },
            } );
          }
          catch( error: unknown ){
            return new Response( JSON.stringify( {
              data: {
                message: `${ ( error as Error ).message }`,
              },
              message: resMessageStatus[ 9999 ],
            } ), {
              status: 200,
              statusText: 'OK',
              headers: {
                ...httpHeaders,
                'content-type': 'application/json; charset=utf-8',
              },
            } );
          }
        }
        else{
          return new Response( JSON.stringify( {
            data: {
              message: `客户端上传的不是一个File或Blob类型的数据，其数据类型为“${ str001 }”。`,
            },
            message: resMessageStatus[ 1002 ],
          } ), {
            status: 200,
            statusText: 'OK',
            headers: {
              ...httpHeaders,
              'content-type': 'application/json; charset=utf-8',
            },
          } );
        }
      }
      catch( error: unknown ){
        return new Response( JSON.stringify( {
          data: {
            message: `${ ( error as Error ).message }`,
          },
          message: resMessageStatus[ 9999 ],
        } ), {
          status: 200,
          statusText: 'OK',
          headers: {
            ...httpHeaders,
            'content-type': 'application/json; charset=utf-8',
          },
        } );
      }
    }
    else{
      return new Response( JSON.stringify( {
        data: {
          message: `请求体中的“content-type”值（${ contentType }）不是服务端要求的类型（multipart/form-data），可能客户端上传的body不是“FormData”类型或客户端设置了不正确的“content-type”值。`,
        },
        message: resMessageStatus[ 1001 ],
      } ), {
        status: 200,
        statusText: 'OK',
        headers: {
          ...httpHeaders,
          'content-type': 'application/json; charset=utf-8',
        },
      } );
    }
  }
  else{
    return new Response( JSON.stringify( {
      data: {
        message: `body为空，未上传任何数据。`,
      },
      message: resMessageStatus[ 1000 ],
    } ), {
      status: 200,
      statusText: 'OK',
      headers: {
        ...httpHeaders,
        'content-type': 'application/json; charset=utf-8',
      },
    } );
  }
}

export default UploadBySingle;
