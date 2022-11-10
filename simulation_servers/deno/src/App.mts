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
  MyConsole,
  // @ts-ignore
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mjs';

Promise.allSettled( [
  // 同时提供“http:”和“ws:”协议的服务，端口都是9000，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/HTTPAndWebSocketByServerForPort9000.mts' ),
  // 同时提供“https:”和“wss:”协议的服务，端口都是9000，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/HTTPSAndWebSocketSByServerForPort9000.mts' ),

  // 提供“http:”协议的服务，端口9100，基于HTTP/1.1。
  // @ts-ignore
  // import('servers/HTTPServerForPort9100.mts'),
  // 提供“https:”协议的服务，端口9100，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/HTTPSServerForPort9100.mts' ),

  // 首选，提供“https:”和“wss:”协议的服务，端口都是9200，基于HTTP/2，Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
  // @ts-ignore
  import( 'servers/HTTPV2AndWebSocketSServerForPort9200.mts' ),

  // 提供“ws:”协议的服务，端口9300，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/WebSocketServerForPort9300.mts' ),
  // 提供“wss:”协议的服务，端口9300，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/WebSocketSServerForPort9300.mts' ),
] )
.then(
  ( resolve: Array<PromiseSettledResult<unknown>> ): void => {
    /*
     [ { status: "fulfilled", value: Module {} } ]
     */
    MyConsole.Cyan( `
resolve--->Start
${ JSON.stringify( resolve, null, ' ' ) }
resolve--->End
` );
  },
  ( reject: unknown ): void => {
    MyConsole.Red( `
reject--->Start
${ JSON.stringify( reject as object, null, ' ' ) }
reject--->End
` );
  }
)
.catch( ( error: unknown ): void => {
  MyConsole.Red( `
catch error--->Start
${ ( error as Error ).message }
catch error--->End
` );
} );
