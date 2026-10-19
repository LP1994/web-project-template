#!/usr/bin/env -S deno run -A --config=../deno.jsonc --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../.env.deno

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/App.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 命令行启动命令：
 * deno run -A --config=../deno.jsonc --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../.env.deno ./src/App.mts --color=16m
 */

/**
 * 这是程序的启动入口。一切从这里开始！
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

'use strict';

import 'esm_sh_corejs';

import {
  serversURLPrefix,
  webDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
  GetLogWriteStreamForSingleton,

  GetNetworkAddressForWLANByIPv4,
} from 'public/PublicTools.esm.mts';

import {
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

type T_ResultForHttpServer = {
  default: {
    isProvidedHTTPService: boolean;
    httpServer: Deno.HttpServer<Deno.NetAddr>;
    options: Deno.ServeTcpOptions | ( Deno.ServeTcpOptions & Deno.TlsCertifiedKeyPem );
  };
  isProvidedHTTPService: boolean;
  httpServer: Deno.HttpServer<Deno.NetAddr>;
  options: Deno.ServeTcpOptions | ( Deno.ServeTcpOptions & Deno.TlsCertifiedKeyPem );
};

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();
const logWriteStream: T_MyCusDenoFsFile = await GetLogWriteStreamForSingleton();

/**
 * 打印Deno环境变量。
 *
 * @returns {void}
 */
function PrintEnvironmentVariables(): void{
  MyConsole.Green( `\n${ JSON.stringify( Deno.version ) }` );

  [
    'DENO_AUTH_TOKENS',
    'DENO_TLS_CA_STORE',
    'DENO_CERT',
    'NODE_EXTRA_CA_CERTS',
    'DENO_COVERAGE_DIR',
    'DENO_DIR',
    'DENO_INSTALL',
    'DENO_INSTALL_ROOT',
    'DENO_REPL_HISTORY',
    'DENO_NO_PACKAGE_JSON',
    'DENO_CONDITIONS',
    'DENO_UNSTABLE_TSGO',
    'DENO_NO_PROMPT',
    'DENO_NO_UPDATE_CHECK',
    'DENO_V8_FLAGS',
    'DENO_JOBS',
    'DENO_KV_ACCESS_TOKEN',
    'DENO_AUDIT_PERMISSIONS',
    'DENO_TRACE_PERMISSIONS',
    'DENO_WEBGPU_TRACE',
    'DENO_WEBGPU_BACKEND',
    'HTTP_PROXY',
    'HTTPS_PROXY',
    'NPM_CONFIG_REGISTRY',
    'NO_COLOR',
    'NO_PROXY',
  ].forEach( ( item: string ): void => {
    if( Deno.env.has( item ) ){
      MyConsole.Green( `${ item }: ${ Deno.env.get( item ) }` );
    }
  } );
}

/**
 * 打印出静态文件服务器地址，内容都是来自“web”文件夹下的。
 *
 * @param {Array<PromiseSettledResult<unknown>>} resolve
 *
 * @returns {Promise<void>}
 */
async function PrintWebResourcesServiceInfo( resolve: Array<PromiseSettledResult<unknown>> ): Promise<void>{
  for(
    const {
      value: {
        default: {
          isProvidedHTTPService,
          httpServer,
          options,
        },
      },
    } of
    resolve as Array<PromiseFulfilledResult<T_ResultForHttpServer>>
    ){
    if( isProvidedHTTPService ){
      const arr: Array<string> = [],
        hostName: Array<string> = [];

      const {
        hostname,
        port,
      }: Deno.NetAddr = httpServer.addr;

      GetNetworkAddressForWLANByIPv4( hostname ).forEach( ( item: string ): void => {
        hostName.push( `http${
          'key' in options || 'cert' in options
          ? 's'
          : ''
        }://${ item }:${ port }` );
      } );

      for await (
        const {
          name,
          isDirectory,
        } of
        Deno.readDir( new URL( `${ webDir }/` ) )
        ){
        if( isDirectory ){
          arr.push( ...( serversURLPrefix.map( ( item: string ): string => `${ item }/web/${ name }/` ) ) );
        }
      }

      if( arr.length > 0 ){
        MyConsole.Green( `有如下静态文件服务器地址，内容都是来自“web”文件夹下的:` );

        hostName.forEach( ( item: string ): void => {
          arr.forEach( ( i: string ): void => {
            MyConsole.Green( `${ item }${ i }` );
          } );
        } );
      }
    }
  }
}

PrintEnvironmentVariables();

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
    // resolve ---> [ { status: "fulfilled", value: Module {} } ]
    ( resolve: Array<PromiseSettledResult<unknown>> ): void => {
      logWriteStream.write( `
来自：simulation_servers/deno/src/App.mts
resolve--->Start

${ JSON.stringify( resolve, null, 2 ) }

resolve--->End
` );

      PrintWebResourcesServiceInfo( resolve );
    },
    ( reject: Array<PromiseSettledResult<unknown>> ): void => {
      MyConsole.Red( `
来自：simulation_servers/deno/src/App.mts
reject--->Start

${ JSON.stringify( reject, null, 2 ) }

reject--->End
` );

      errorWriteStream.write( `
来自：simulation_servers/deno/src/App.mts
reject--->Start

${ JSON.stringify( reject, null, 2 ) }

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
