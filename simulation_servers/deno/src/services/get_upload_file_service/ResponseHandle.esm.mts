/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/get_upload_file_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 1、目前发现当启用HTTPS协议时，用迅雷下载文件时，会报错，但是改用HTTP协议就能正常用迅雷下载了。
 * 2、启用HTTPS协议时，用迅雷下载文件时，会报错的原因，极可能是因为在制作自定义的HTTPS证书时，只是指定了某些可访问的IP地址，并没有包括迅雷自己的下载IP、域名之类的，从而导致报错。
 */

'use strict';

import {
  type TypeResponse001,

  uploadDir,

  httpHeaders,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  mime,
  // @ts-ignore
} from 'public/PublicTools.esm.mts';

// @ts-ignore
import InterceptorError from 'public/InterceptorError.esm.mts';

import {
  myURLPathName,
  // @ts-ignore
} from './Condition.esm.mts';

function ResponseHandle( request: Request ): TypeResponse001{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname ),
    filePath: URL = new URL( `${ uploadDir }/${ pathName.slice( myURLPathName.length ) }` );

  //@ts-ignore
  let fileState: Deno.FileInfo;

  try{
    // @ts-ignore
    fileState = Deno.statSync( filePath );

    if( fileState.isFile ){
      //@ts-ignore
      const file: Deno.FsFile = Deno.openSync( filePath, {
        read: true,
      } );

      // @ts-ignore
      return new Response( file.readable, {
        status: 200,
        statusText: 'OK',
        headers: {
          ...httpHeaders,
          'accept-ranges': 'bytes',
          'content-type': `${ mime.getType( filePath.href ) }`,
        },
      } );
    }
    else if( fileState.isDirectory ){
      return InterceptorError.ResError( {
        title: `Error`,
        message: `当前无法获取该文件夹（${ pathName }）的信息。`,
      } );
    }
    else{
      return InterceptorError.ResError( {
        title: `Error`,
        message: `该路径（${ pathName }）既不指向有效的文件也不指向有效的文件夹。`,
      } );
    }
  }
  catch( error: unknown ){
    return new InterceptorError( request ).res404();
  }
}

export default ResponseHandle;
