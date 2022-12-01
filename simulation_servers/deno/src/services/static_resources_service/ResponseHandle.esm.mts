/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/static_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * openssl/HTTPS001/HTTPS001CACert.crt
 * openssl/HTTPS001/HTTPS001Client.crt
 * openssl/HTTPS001/HTTPS001Server.crt
 * openssl/HTTPS001/HTTPS001CACert.p12
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 * 4、就算安装了上述的证书到iPhone 13 Pro Max上，其上的谷歌浏览器、火狐浏览器（但Safari浏览器却不会）在访问相关链接时，还是会报如下错误提示，但还是能顺利访问，只是会输出这个错误提示：
 * error writing a body to connection: tls handshake eof: tls handshake eof
 */

/**
 * 用于响应“static”文件夹下的静态文件获取（GET请求），如：
 * 获取“static”文件夹下的“json”文件夹下的“JSON001.json”文件
 * https://127.0.0.1:9200/simulation_servers_deno/static/json/JSON001.json
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteHandle”中的配置。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  type TypeResponse001,

  staticDir,

  httpHeaders,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  mime,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

// @ts-ignore
import ResponseError from 'public/ResponseError.esm.mts';

import {
  myURLPathName,

  // @ts-ignore
} from './Condition.esm.mts';

/**
 * 当满足“Condition.esm.mts”中的条件时就会被执行以响应请求的处理函数。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {TypeResponse001} 返回值类型为Response、Promise<Response>。
 */
function ResponseHandle( request: Request ): TypeResponse001{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname ),
    filePath: URL = new URL( `${ staticDir }/${ pathName.slice( myURLPathName.length ) }` );

  let result: TypeResponse001;

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
      result = new Response( file.readable, {
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
      result = ResponseError.ResError( {
        title: `Error`,
        message: `当前无法获取该文件夹（${ pathName }）的信息。`,
      } );
    }
    else{
      result = ResponseError.ResError( {
        title: `Error`,
        message: `该路径（${ pathName }）既不指向有效的文件也不指向有效的文件夹。`,
      } );
    }
  }
  catch( error: unknown ){
    result = new ResponseError( request ).res404();
  }

  return result;
}

// 必须部署这个默认的导出值。
export default ResponseHandle;
