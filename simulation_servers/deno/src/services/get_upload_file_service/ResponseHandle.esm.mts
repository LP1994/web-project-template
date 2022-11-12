/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/get_upload_file_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。<br />
 * 2、安装证书如下：<br />
 * configures/openssl/HTTPS001/HTTPS001CACert.crt
 * configures/openssl/HTTPS001/HTTPS001Client.crt
 * configures/openssl/HTTPS001/HTTPS001Server.crt
 * configures/openssl/HTTPS001/HTTPS001CACert.p12
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况，大概率系因为“自定义的HTTPS证书”没把迅雷自己的下载域名、IP列入证书其中吧。<br />
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
