/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:42 星期四
 */

'use strict';

import {
  writableStreamFromWriter,
  // @ts-ignore
} from 'DenoStd/streams/mod.ts';

import {
  type TypeResponse001,

  uploadDir,

  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

// @ts-ignore
async function ResponseHandle( request: Request ): TypeResponse001{
  const _request: Request = request.clone();

  if( _request.body ){
    const contentType = ( _request.headers.get( 'content-type' ) ?? '' ).trim();

    if( contentType.startsWith( 'multipart/form-data;' ) ){
      let formData: FormData;

      try{
        formData = await _request.formData();

        let file: File | string | null = formData.get( 'fileName' );

        if( Object.prototype.toString.call( file ) === '[object File]' ){
          /*
           file.name--->2.avif
           file.type--->image/avif
           file.lastModified--->1668106823045
           file.size--->1095740
           */
          file = file as File;

          // @ts-ignore
          const file001: Deno.FsFile = await Deno.open( new URL( `${ uploadDir }/${ file.name }` ), {
            write: true,
            create: true,
          } );

          // arrayBuffer(): Promise<ArrayBuffer>;

          await file.stream().pipeTo( writableStreamFromWriter( file001 ) );

          return new Response( JSON.stringify( {
            data: {
              message: `文件（${ file.name }）上传成功。`,
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
        else{
          return new Response( JSON.stringify( {
            data: {
              message: `客户端上传的不是一个File类型的数据，其数据类型为${ Object.prototype.toString.call( file ) }。`,
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
          message: `请求体中的“content-type”值（${ contentType }）不是服务端要求的类型（multipart/form-data），可能客户端上传的body不是“FormData”类型。`,
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

export default ResponseHandle;
