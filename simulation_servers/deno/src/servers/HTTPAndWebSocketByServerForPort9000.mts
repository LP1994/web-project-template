/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPAndWebSocketByServerForPort9000.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 同时提供“http:”和“ws:”协议的服务，端口都是9000，基于HTTP/1.1。
 * http://127.0.0.1:9000、ws://127.0.0.1:9000
 */

'use strict';

import {
  type T_Response001,
} from 'configures/GlobalParameters.esm.mts';

import {
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetLogWriteStreamForSingleton,
  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import ResponseError from 'public/ResponseError.esm.mts';

import {
  Routers,
} from 'routers/Routers.esm.mts';

const logWriteStream: T_MyCusDenoFsFile = await GetLogWriteStreamForSingleton();
const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

const HTTPAndWebSocketByServerForPort9000: Deno.HttpServer<Deno.NetAddr> = Deno.serve(
  {
    port: 9000,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“http://localhost:9000”能连接上（http、ws皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“http://127.0.0.1:9000”、“http://localhost:9000”能连接上（http、ws皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“http://localhost:9000”、“http://127.0.0.1:9000”、“http://192.168.2.7:9000”能连接上（http、ws皆是如此）。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“http://localhost:9000”能连接上（http、ws皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“http://127.0.0.1:9000”、“http://localhost:9000”能连接上（http、ws皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“http://localhost:9000”、“http://127.0.0.1:9000”、“http://192.168.2.7:9000”能连接上（http、ws皆是如此）。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9000”）跟其中的websocket服务地址（如“wss://localhost:9200”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9200”。<br />
     * 3、然后才能让页面（如“https://localhost:9000”）成功访问其中的websocket服务地址（如“wss://localhost:9200”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：http://0.0.0.0:9000。<br />
     */
    hostname: '0.0.0.0',
    onListen: (
      {
        hostname,
        port,
      }: {
        hostname: string;
        port: number;
      }
    ): void => {
      MyConsole.Cyan( `
来自：simulation_servers/deno/src/servers/HTTPAndWebSocketByServerForPort9000.mts
HTTP and WebSocket Server已启动（Windows系统上无法直接访问“0.0.0.0”，请改用本地、局域网IP等等，支持IPV4、IPV6）：http://${ hostname }:${ port }/、ws://${ hostname }:${ port }/。
` );

      logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPAndWebSocketByServerForPort9000.mts
HTTP and WebSocket Server已启动（Windows系统上无法直接访问“0.0.0.0”，请改用本地、局域网IP等等，支持IPV4、IPV6）：http://${ hostname }:${ port }/、ws://${ hostname }:${ port }/。
` );
    },
    onError: ( error: unknown ): T_Response001 => {
      MyConsole.Red( `
来自：simulation_servers/deno/src/servers/HTTPAndWebSocketByServerForPort9000.mts
HTTP and WebSocket Server onError--->Start

${ ( error as Error ).message }

HTTP and WebSocket Server onError--->End
` );

      errorWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPAndWebSocketByServerForPort9000.mts
HTTP and WebSocket Server onError--->Start

${ ( error as Error ).message }

HTTP and WebSocket Server onError--->End
` );

      return ResponseError.ResPageError( {
        title: `HTTP and WebSocket Server服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  },
  (
    request: Request,
    info: Deno.ServeHandlerInfo,
  ): T_Response001 => {
    logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPAndWebSocketByServerForPort9000.mts
HTTP and WebSocket Server request--->Start

${ JSON.stringify( {
      method: request.method,
      url: request.url,
      redirect: request.redirect,
      bodyUsed: request.bodyUsed,
      headers: ( () => {
        const result: {
          [ keyName: string ]: string;
        } = {};

        request.headers.forEach( (
          value: string,
          key: string,
          // @ts-expect-error
          parent: Headers
        ): void => {
          result[ key ] = value;
        } );

        return result;
      } )(),
    }, null, 4 ) }

HTTP and WebSocket Server request--->End
` );

    logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPAndWebSocketByServerForPort9000.mts
HTTP and WebSocket Server info--->Start

${ JSON.stringify( info, null, 4 ) }

HTTP and WebSocket Server info--->End
` );

    return Routers( request );
  },
);

export {
  HTTPAndWebSocketByServerForPort9000,
};

export default HTTPAndWebSocketByServerForPort9000;
