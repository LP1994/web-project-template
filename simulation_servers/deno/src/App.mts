/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/App.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  serversDir,
  // @ts-ignore
} from './configures/GlobalParameters.esm.mts';

Promise.allSettled( [
  // 同时提供“http:”和“ws:”协议的服务，端口都是9000，基于HTTP/1.1。
  // import( `${ serversDir }/HTTPAndWebSocketByServerForPort9000.mts` ),
  // 同时提供“https:”和“wss:”协议的服务，端口都是9000，基于HTTP/1.1。
  // import( `${ serversDir }/HTTPSAndWebSocketSByServerForPort9000.mts` ),

  // 提供“http:”协议的服务，端口9100，基于HTTP/1.1。
  // import(`${ serversDir }/HTTPServerForPort9100.mts`),
  // 提供“https:”协议的服务，端口9100，基于HTTP/1.1。
  // import( `${ serversDir }/HTTPSServerForPort9100.mts` ),

  // 提供“https:”和“wss:”协议的服务，端口都是9200，基于HTTP/2，Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
  import( `${ serversDir }/HTTPV2AndWebSocketSServerForPort9200.mts` ),

  // 提供“ws:”协议的服务，端口9300，基于HTTP/1.1。
  // import( `${ serversDir }/WebSocketServerForPort9300.mts` ),
  // 提供“wss:”协议的服务，端口9300，基于HTTP/1.1。
  // import( `${ serversDir }/WebSocketSServerForPort9300.mts` ),
] )
.then(
  ( resolve: Array<PromiseSettledResult<unknown>> ): void => {
    console.log( `\nresolve--->Start` );
    /*
     [ { status: "fulfilled", value: Module {} } ]
     */
    console.dir( resolve );
    console.log( `resolve--->End\n` );
  },
  ( reject: unknown ): void => {
    console.log( `\nreject--->Start` );
    console.error( reject );
    console.log( `reject--->End\n` );
  }
)
.catch( ( error: unknown ): void => {
  console.log( `\ncatch error--->Start` );
  console.error( error );
  console.log( `catch error--->End\n` );
} );
