/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/App.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

// deno run -A --watch --config=deno.json --lock=lock.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 ./src/App.mts --color=16m

/**
 * 这是程序的启动入口。
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

'use strict';

import 'DenoX/corejs/index.js';

import {
  MyConsole,

  // @ts-ignore
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type TypeMyCusDenoFsFile,

  GetLogWriteStreamForSingleton,
  GetErrorWriteStreamForSingleton,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

const logWriteStream: TypeMyCusDenoFsFile = await GetLogWriteStreamForSingleton();
const errorWriteStream: TypeMyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

Promise.allSettled( [
  // 这两类服务不可同时启用，启用其中之一即可。Start

  // 同时提供“http:”和“ws:”协议的服务，端口都是9000，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/HTTPAndWebSocketByServerForPort9000.mts' ),
  // 同时提供“https:”和“wss:”协议的服务，端口都是9000，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/HTTPSAndWebSocketSByServerForPort9000.mts' ),

  // 这两类服务不可同时启用，启用其中之一即可。End

  // 这两类服务不可同时启用，启用其中之一即可。Start

  // 提供“http:”协议的服务，端口9100，基于HTTP/1.1。
  // @ts-ignore
  // import('servers/HTTPServerForPort9100.mts'),
  // 提供“https:”协议的服务，端口9100，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/HTTPSServerForPort9100.mts' ),

  // 这两类服务不可同时启用，启用其中之一即可。End

  // 首选，提供“https:”和“wss:”协议的服务，端口都是9200，基于HTTP/2，Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
  // @ts-ignore
  import( 'servers/HTTPV2AndWebSocketSServerForPort9200.mts' ),

  // 这两类服务不可同时启用，启用其中之一即可。Start

  // 提供“ws:”协议的服务，端口9300，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/WebSocketServerForPort9300.mts' ),
  // 提供“wss:”协议的服务，端口9300，基于HTTP/1.1。
  // @ts-ignore
  // import( 'servers/WebSocketSServerForPort9300.mts' ),

  // 这两类服务不可同时启用，启用其中之一即可。End
] )
.then(
  ( resolve: Array<PromiseSettledResult<unknown>> ): void => {
    // resolve ---> [ { status: "fulfilled", value: Module {} } ]
    logWriteStream.write( `
来自：simulation_servers/deno/src/App.mts
resolve--->Start

${ JSON.stringify( resolve ) }

resolve--->End
` );
  },
  ( reject: Array<PromiseSettledResult<unknown>> ): void => {
    MyConsole.Red( `
来自：simulation_servers/deno/src/App.mts
reject--->Start
` );
    console.dir( reject );
    MyConsole.Red( `
reject--->End
` );

    errorWriteStream.write( `
来自：simulation_servers/deno/src/App.mts
reject--->Start

${ JSON.stringify( reject ) }

reject--->End
` );
  }
)
.catch( ( error: unknown ): void => {
  MyConsole.Red( `
来自：simulation_servers/deno/src/App.mts
catch error--->Start

${ ( error as Error ).message }

catch error--->End
` );

  errorWriteStream.write( `
来自：simulation_servers/deno/src/App.mts
catch error--->Start

${ ( error as Error ).message }

catch error--->End
` );
} );
