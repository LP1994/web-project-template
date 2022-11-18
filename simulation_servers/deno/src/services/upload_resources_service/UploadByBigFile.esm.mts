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

// @ts-ignore
async function UploadByBigFile( request: Request ): Promise<Response>{
  /*
   const contentType: string = ( request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase(),
   contentLength: string = ( request.headers.get( 'content-length' ) ?? '' ).trim().toLowerCase();
   */

  const hash: ArrayBuffer = await crypto.subtle.digest( 'SHA3-512', ( request.clone().body as ReadableStream ) ),
    sri: string = toHashString( hash, 'hex' );

  // @ts-ignore
  const file001: Deno.FsFile = await Deno.open( new URL( `${ uploadDir }/BigFile` ), {
    write: true,
    create: true,
  } );

  await ( request.body as ReadableStream ).pipeTo( writableStreamFromWriter( file001 ) );

  return new Response( JSON.stringify( {
    data: {
      success: true,
      message: `大文件上传成功。${ sri }`,
    },
    messageStatus: resMessageStatus[ 200 ],
  } ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

export default UploadByBigFile;
