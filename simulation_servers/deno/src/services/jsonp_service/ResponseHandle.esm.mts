/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/jsonp_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_192_168_2_7_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_192_168_2_7_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 该文件夹是用于响应“jsonp”（GET请求），如：
 * https://127.0.0.1:9200/simulation_servers_deno/jsonp?callBack=JSONPCallBack&name=林沐风&age=12#personal_information
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteHandle”中的配置。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  type T_Response001,

  httpResponseHeaders,
} from 'configures/GlobalParameters.esm.mts';

// @ts-expect-error
import ResponseError from 'public/ResponseError.esm.mts';

/**
 * 当满足“Condition.esm.mts”中的条件时就会被执行以响应请求的处理函数。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {T_Response001} 返回值类型为Response、Promise<Response>。
 */
function ResponseHandle( request: Request ): T_Response001{
  const url: URL = new URL( request.url ),
    callBack: string = String( url.searchParams.get( 'callBack' ) );

  let result: string = '';

  switch( callBack ){
  case 'JSONPCallBack':
    const name: string = url.searchParams.get( 'name' ) as string,
      age: string = url.searchParams.get( 'age' ) as string;

    result = `${ callBack }(
  '${ name }',
  ${ age },
  true,
  ${ JSON.stringify( {
      name: String( name ),
      age: Number( age ),
      timer: Number( Date.now() ),
    } ) },
  '姓名：${ name }，年龄：${ age }，座右铭：路漫漫其修远兮，吾将上下而求索。',
);`;

    break;

  default:
    result = `console.error( '还未对“${ callBack }”这个函数做处理。' );`;

    break;
  }

  return new Response( result, {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpResponseHeaders,
      'Content-Type': `application/javascript; charset=utf-8`,
    },
  } );
}

// 必须部署这个默认的导出值。
export default ResponseHandle;
