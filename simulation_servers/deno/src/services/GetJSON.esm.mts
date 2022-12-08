/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/GetJSON.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:30:07 星期二
 */

/**
 * 用于响应HTTP服务的GET请求，如：“https://127.0.0.1:9200/simulation_servers_deno/GetJSON”。
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteMapConfig”中的配置。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_192_168_10_101_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_192_168_10_101_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  // type TypeResponse001,

  staticDir,

  httpHeaders,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  mime,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

import {
  mongoDBClient,
  mongoDB,

  // @ts-ignore
} from 'mongo/Connect.esm.mts';

interface StartupLogSchema {
  _id: string;

  hostname: string;

  startTimeLocal: string;
}

/**
 * 响应请求的处理函数。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {TypeResponse001} 返回值类型为Response、Promise<Response>。
 */
async function Handle(
  // @ts-ignore
  request: Request
): Promise<Response>{
  // @ts-ignore
  let filePath: URL = new URL( import.meta.resolve( `${ staticDir }/json/JSON001.json` ) );

  console.log( `\n\n\nmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDB Start\n\n\n` );

  console.dir( mongoDBClient );
  console.dir( mongoDB );

  // @ts-ignore
  const startupLog = mongoDB.collection<StartupLogSchema>( 'startup_log' );

  // @ts-ignore
  const log = await startupLog.find( {
    _id: `LPQAQ-1670364636573`,
  } );

  console.dir( log );

  console.log( `\n\n\nmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDBmongoDB End\n\n\n` );

  // @ts-ignore
  return new Response( Deno.readTextFileSync( filePath ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': `${ mime.getType( filePath.href ) }; charset=utf-8`,
    },
  } );
}

// 必须部署这个默认的导出值。
export default Handle;
