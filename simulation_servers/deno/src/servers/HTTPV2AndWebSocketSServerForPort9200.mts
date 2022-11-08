/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 提供“https:”和“wss:”协议的服务，端口都是9200，基于HTTP/2，Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
 */

'use strict';

import {
  opensslDir,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

import {
  Routers,
  // @ts-ignore
} from '../routers/Routers.esm.mts';

// @ts-ignore
async function HandleConn( conn: Deno.TlsConn ): Promise<void>{
  console.log( `\nconnInfo--->Start` );
  /*
   {
   localAddr: { hostname: "192.168.10.101", port: 9200, transport: "tcp" },
   remoteAddr: { hostname: "192.168.10.101", port: 62180, transport: "tcp" }
   }
   */
  console.dir( {
    localAddr: conn.localAddr,
    remoteAddr: conn.remoteAddr,
  } );
  console.log( `connInfo--->End\n` );

  // @ts-ignore
  const httpConn: Deno.HttpConn = Deno.serveHttp( conn );

  try{
    for await ( const requestEvent of
      httpConn ){
      if( requestEvent ){
        const request: Request = requestEvent.request;

        console.log( `\nrequest--->Start` );
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
        console.dir( request );
        console.log( `request--->End\n` );

        const upgrade: string = ( request.headers.get( 'upgrade' ) ?? '' ).toLowerCase(),
          // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
          connection: string = ( request.headers.get( 'connection' ) ?? '' ).toLowerCase();

        console.log( `\n\n请求头中的connection值为：${ connection }。
请求头中的upgrade值为：${ upgrade }。\n\n` );

        if( upgrade === 'websocket' && ( connection === 'upgrade' || connection === 'keep-alive, Upgrade'.toLowerCase() || connection === 'keep-alive,Upgrade'.toLowerCase() ) ){
          let response: Response,
            socket: WebSocket;

          try{
            (
              {
                response,
                socket,
                // @ts-ignore
              } = Deno.upgradeWebSocket( request, {
                /**
                 * 1、将客户端Web套接字上的“protocol”属性设置为此处提供的值，该值应该是请求Web套接字时在协议参数中指定的字符串之一。<br />
                 * 2、这旨在让客户端和服务器指定用于相互通信的子协议。<br />
                 * 3、在客户端使用时，需要注意，客户端发出的请求会在请求头增加一个键值对：<br />
                 * "Sec-WebSocket-Protocol": "simulation_servers_deno_WebSocket"。<br />
                 * 如果客户端发出的请求的请求头没有该键值对，客户端就会连接不上。<br />
                 * 例如，在浏览器端的JS代码：<br />
                 * new WebSocket( 'wss://127.0.0.1:9000/', 'simulation_servers_deno_WebSocket' );<br />
                 * 发出的请求的请求头就会自动加一个键值对：<br />
                 * "Sec-WebSocket-Protocol": "simulation_servers_deno_WebSocket"。<br />
                 *
                 * @type string
                 */
                protocol: `simulation_servers_deno_WebSocket`,
                /**
                 * 1、如果客户端在指定的超时时间内没有用pong响应此帧，则连接被视为不健康并关闭。将发出关闭和错误事件。<br />
                 * 2、默认值为120秒。设置为0以禁用超时。<br />
                 *
                 * @type number
                 */
                idleTimeout: 0,
              } )
            );

            // @ts-ignore
            socket.addEventListener( 'open', ( ws: WebSocket, event: Event ): void => {
              console.log( '\n\nsocket open Start\n\n' );
              console.dir( ws );
              console.log( '\n' );
              console.dir( event );
              console.log( '\n\nsocket open End\n\n' );
            } );

            // @ts-ignore
            socket.addEventListener( 'message', ( ws: WebSocket, messageEvent: MessageEvent ): void => {
              console.log( '\n\nsocket message Start\n\n' );
              console.dir( ws );
              console.log( '\n' );
              console.dir( messageEvent );
              console.log( '\n\nsocket message End\n\n' );

              socket.send( new Date().toString() );
            } );

            // @ts-ignore
            socket.addEventListener( 'error', ( ws: WebSocket, errorEvent: Event | ErrorEvent ): void => {
              console.log( '\n\nsocket error Start\n\n' );
              console.dir( ws );
              console.log( '\n' );
              console.dir( errorEvent );
              console.log( '\n\nsocket error End\n\n' );
            } );

            // @ts-ignore
            socket.addEventListener( 'close', ( ws: WebSocket, closeEvent: CloseEvent ): void => {
              console.log( '\n\nsocket closed Start\n\n' );
              console.dir( ws );
              console.log( '\n' );
              console.dir( closeEvent );
              console.log( '\n\nsocket closed End\n\n' );
            } );

            requestEvent.respondWith( response );
          }
          catch( error: unknown ){
            requestEvent.respondWith( await InterceptorError.ResError( {
              title: `HTTP/2 Server服务器内部出现错误`,
              message: `HTTP请求没有尝试升级到websocket。
错误信息：
${ ( error as Error ).message }`,
            } ) );
          }
        }
        else{
          requestEvent.respondWith( await Routers( request ) );
        }
      }
    }
  }
  catch( error: unknown ){
    // 不要因为客户端的某一个连接出错而关闭本连接，因为这样会直接中断了其他所有连接。
    // httpConn.close();

    console.error( `\n\n因错误，连接已关闭--->Start` );
    console.error( ( error as Error ).message );
    console.error( `因错误，连接已关闭--->End\n\n` );
  }
}

try{
  // @ts-ignore
  const server: Deno.TlsListener = Deno.listenTls( {
    port: 9200,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9200”能连接上（http、https、ws、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9200”、“https://localhost:9200”能连接上（http、https、ws、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9200”、“https://127.0.0.1:9200”、“https://192.168.10.101:9200”能连接上（http、https、ws、wss皆是如此）。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9200”能连接上（http、https、ws、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9200”、“https://localhost:9200”能连接上（http、https、ws、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9200”、“https://127.0.0.1:9200”、“https://192.168.10.101:9200”能连接上（http、https、ws、wss皆是如此）。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9300”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9300”。<br />
     * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9300”）。<br />
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
      'http/1.1'
    ],
  } );

  // @ts-ignore
  const addr: Deno.NetAddr = server.addr as Deno.NetAddr;

  console.log( `\nHTTP/2 服务已开启：https://${ addr.hostname }:${ addr.port }/、wss://${ addr.hostname }:${ addr.port }/。
说明：Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。\n` );

  try{
    for await ( const conn of
      server ){
      HandleConn( conn );
    }
  }
  catch( error: unknown ){
    // 不要因为一个监听器报错，而关闭所有的监听器。
    // server.close();

    console.error( `\n\n监听器报错--->Start` );
    console.error( ( error as Error ).message );
    console.error( `监听器报错--->End\n\n` );
  }
}
catch( error: unknown ){
  console.error( `\n\n打开网络端口时出现问题--->Start` );
  console.error( ( error as Error ).message );
  console.error( `打开网络端口时出现问题--->End\n\n` );
}
