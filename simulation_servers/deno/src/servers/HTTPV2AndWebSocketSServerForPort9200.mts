/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 首选，提供“https:”和“wss:”协议的服务，端口都是9200，基于HTTP/2，Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
 */

'use strict';

import {
  opensslDir,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  MyConsole,
  // @ts-ignore
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mjs';

// @ts-ignore
import InterceptorError from 'public/InterceptorError.esm.mts';

import {
  Routers,
  // @ts-ignore
} from 'routers/Routers.esm.mts';

// @ts-ignore
async function HandleConn( conn: Deno.TlsConn ): Promise<void>{
  /*
   {
   localAddr: { hostname: "192.168.10.101", port: 9200, transport: "tcp" },
   remoteAddr: { hostname: "192.168.10.101", port: 62180, transport: "tcp" }
   }
   */
  MyConsole.Cyan( `
HTTP/2 服务，connInfo--->Start
${ JSON.stringify( {
    localAddr: conn.localAddr,
    remoteAddr: conn.remoteAddr,
  } ) }
HTTP/2 服务，connInfo--->End
` );

  // @ts-ignore
  const httpConn: Deno.HttpConn = Deno.serveHttp( conn );

  try{
    for await ( const requestEvent of
      httpConn ){
      if( requestEvent ){
        const request: Request = requestEvent.request;

        /*
         {
         bodyUsed: false,
         headers: Headers {
         accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*!/!*;q=0.8,app...",
         "accept-encoding": "gzip, deflate, br",
         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
         dnt: "1",
         "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
         "sec-ch-ua-mobile": "?0",
         "sec-ch-ua-platform": '"Windows"',
         "sec-fetch-dest": "document",
         "sec-fetch-mode": "navigate",
         "sec-fetch-site": "none",
         "sec-fetch-user": "?1",
         "upgrade-insecure-requests": "1",
         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Sa..."
         },
         method: "GET",
         redirect: "follow",
         url: "https://192.168.10.101:9200/"
         }
         */
        MyConsole.Cyan( `
HTTP/2 服务，request--->Start
${ JSON.stringify( request ) }
HTTP/2 服务，request--->End
` );

        requestEvent.respondWith( await Routers( request ) );
      }
    }
  }
  catch( error: unknown ){
    // 不要因为客户端的某一个连接出错而关闭本连接，因为这样会直接中断了其他所有连接。
    // httpConn.close();

    MyConsole.Red( `
HTTP/2 服务，因错误，连接已关闭--->Start
${ ( error as Error ).message }
HTTP/2 服务，因错误，连接已关闭--->End
` );
  }
}

try{
  // @ts-ignore
  const server: Deno.TlsListener = Deno.listenTls( {
    port: 9200,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9200”、“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9200”、“https://127.0.0.1:9200”、“https://192.168.10.101:9200”能连接上（https、wss皆是如此）。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9200”、“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9200”、“https://127.0.0.1:9200”、“https://192.168.10.101:9200”能连接上（https、wss皆是如此）。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。<br />
     * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9200。<br />
     */
    hostname: '0.0.0.0',
    // @ts-ignore
    key: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPS001/HTTPS001Key.pem` ) ),
    // @ts-ignore
    cert: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPS001/HTTPS001Server.crt` ) ),
    transport: 'tcp',
    alpnProtocols: [
      'h2',
      'http/1.1',
    ],
  } );

  // @ts-ignore
  const addr: Deno.NetAddr = server.addr as Deno.NetAddr;

  MyConsole.Cyan( `
HTTP/2 服务已开启：https://${ addr.hostname }:${ addr.port }/、wss://${ addr.hostname }:${ addr.port }/。
说明：Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
` );

  try{
    for await ( const conn of
      server ){
      HandleConn( conn );
    }
  }
  catch( error: unknown ){
    // 不要因为一个监听器报错，而关闭所有的监听器。
    // server.close();

    MyConsole.Red( `
HTTP/2 服务，监听器报错--->Start
${ ( error as Error ).message }
HTTP/2 服务，监听器报错--->End
` );
  }
}
catch( error: unknown ){
  MyConsole.Red( `
HTTP/2 服务，打开网络端口时出现问题--->Start
${ ( error as Error ).message }
HTTP/2 服务，打开网络端口时出现问题--->End
` );
}
