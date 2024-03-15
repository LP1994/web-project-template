#!/usr/bin/env -S deno run -A --config=../deno.json --lock-write --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-webgpu --unstable-broadcast-channel --unstable-worker-options --unstable-cron --unstable-kv --unstable-ffi --unstable-fs --unstable-net --unstable-http --unstable-temporal --unstable-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/App.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

// deno run -A --config=./deno.json --lock-write --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-webgpu --unstable-broadcast-channel --unstable-worker-options --unstable-cron --unstable-kv --unstable-ffi --unstable-fs --unstable-net --unstable-http --unstable-temporal --unstable-hmr ./src/App.mts --color=16m

/**
 * 这是程序的启动入口。
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

'use strict';

import 'deno_x_corejs';

import {
  MyConsole,
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetLogWriteStreamForSingleton,
  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

const logWriteStream: T_MyCusDenoFsFile = await GetLogWriteStreamForSingleton();
const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

Promise.allSettled( [
  // 这两类服务不可同时启用，启用其中之一即可。Start

  // 同时提供“http:”和“ws:”协议的服务，端口都是9000，基于HTTP/1.1。
  import( 'servers/HTTPAndWebSocketByServerForPort9000.mts' ),
  // 同时提供“https:”和“wss:”协议的服务，端口都是9000，基于HTTP/1.1。
  // import( 'servers/HTTPSAndWebSocketSByServerForPort9000.mts' ),

  // 这两类服务不可同时启用，启用其中之一即可。End

  // 这两类服务不可同时启用，启用其中之一即可。Start

  // 提供“http:”协议的服务，端口9100，基于HTTP/1.1。
  // import('servers/HTTPServerForPort9100.mts'),
  // 提供“https:”协议的服务，端口9100，基于HTTP/1.1。
  // import( 'servers/HTTPSServerForPort9100.mts' ),

  // 这两类服务不可同时启用，启用其中之一即可。End

  // 这两类服务不可同时启用，启用其中之一即可。Start

  // 首选，提供“https:”和“wss:”协议的服务，端口都是9200，基于HTTP/2（使用HTTP/2要必需使用HTTPS，这是强制的），Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
  import( 'servers/HTTPV2AndWebSocketSServerForPort9200.mts' ),

  // 这两类服务不可同时启用，启用其中之一即可。End

  // 这两类服务不可同时启用，启用其中之一即可。Start

  // 提供“ws:”协议的服务，端口9300，基于HTTP/1.1。
  // import( 'servers/WebSocketServerForPort9300.mts' ),
  // 提供“wss:”协议的服务，端口9300，基于HTTP/1.1。
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
