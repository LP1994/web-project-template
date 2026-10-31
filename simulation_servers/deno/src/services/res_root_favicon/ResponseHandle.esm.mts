/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/res_root_favicon/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 用于响应HTTP服务的根图片GET请求，如：
 * https://127.0.0.1:9200/favicon.ico
 * https://127.0.0.1:9200/favicon.png
 * https://127.0.0.1:9200/apple-touch-icon.png
 * https://127.0.0.1:9200/apple-touch-icon-precomposed.png
 * https://127.0.0.1:9200/apple-touch-icon-120x120.png
 * https://127.0.0.1:9200/apple-touch-icon-120x120-precomposed.png
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteHandle”中的配置。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001_Root_CA：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002_Servers_CA：HTTPSSL001_Servers_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003_Clients_CA：HTTPSSL001_Clients_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  type T_Awaitable,

  HttpResponseHeadersFun,
  HTTPStatus,
  staticDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  mime,
} from 'public/PublicTools.esm.mts';

import ResponseError from 'public/ResponseError.esm.mts';

/**
 * 当满足“Condition.esm.mts”中的条件时就会被执行以响应请求的处理函数。<br /><br />
 *
 * 具体请求URL如：<br />
 * https://127.0.0.1:9200/favicon.ico <br />
 * https://127.0.0.1:9200/favicon.png <br />
 * https://127.0.0.1:9200/apple-touch-icon.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-precomposed.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-120x120.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-120x120-precomposed.png <br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {T_Awaitable<Response>} 返回值类型为Response、Promise<Response>。
 */
function ResponseHandle( request: Request ): T_Awaitable<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  let filePath: URL,
    isHit: boolean;

  switch( pathName ){
    case '/favicon.ico':
      isHit = true;

      filePath = new URL( import.meta.resolve( `${ staticDir }/ico/favicon.ico` ) );

      break;
    case '/favicon.png':
      isHit = true;

      filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

      break;
    case '/apple-touch-icon.png':
      isHit = true;

      filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

      break;
    case '/apple-touch-icon-precomposed.png':
      isHit = true;

      filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

      break;
    case '/apple-touch-icon-120x120.png':
      isHit = true;

      filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

      break;
    case '/apple-touch-icon-120x120-precomposed.png':
      isHit = true;

      filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

      break;
    default:
      isHit = false;

      break;
  }

  if( isHit ){
    return new Response( Deno.readFileSync( filePath ), {
      headers: {
        ...HttpResponseHeadersFun( request ),
        'content-type': mime.getType( filePath.href ),
      },
      status: HTTPStatus[ 200 ].status,
      statusText: HTTPStatus[ 200 ].statusText,
    } );
  }
  else{
    return new ResponseError( request ).resPage404();
  }
}

// 必须部署这个默认的导出值。
export default ResponseHandle;
