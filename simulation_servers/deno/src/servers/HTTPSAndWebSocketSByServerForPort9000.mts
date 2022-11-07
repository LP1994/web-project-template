/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPSAndWebSocketSByServerForPort9000.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 同时提供“https:”和“wss:”协议的服务，端口都是9000。
 */

'use strict';

import {
  type ConnInfo,

  serveTls,
  // @ts-ignore
} from 'https://deno.land/std/http/server.ts';

import {
  type TypeResponse001,

  opensslDir,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

import {
  Routers,
  // @ts-ignore
} from '../routers/Routers.esm.mts';

serveTls(
  (
    request: Request,
    connInfo: ConnInfo,
  ): TypeResponse001 => {
    console.log( `\nHTTPS and WebSocket Server request--->Start` );
    /*
     {
     bodyUsed: false,
     headers: Headers {
     accept: "image/avif,image/webp,image/apng,image/svg+xml,image/!*,*!/!*;q=0.8",
     "accept-encoding": "gzip, deflate, br",
     "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
     connection: "keep-alive",
     dnt: "1",
     host: "127.0.0.1:9000",
     referer: "http://127.0.0.1:9000/",
     "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
     "sec-ch-ua-mobile": "?0",
     "sec-ch-ua-platform": '"Windows"',
     "sec-fetch-dest": "image",
     "sec-fetch-mode": "no-cors",
     "sec-fetch-site": "same-origin",
     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Sa..."
     },
     method: "GET",
     redirect: "follow",
     url: "http://127.0.0.1:9000/favicon.ico"
     }
     */
    console.dir( request );
    console.log( `HTTPS and WebSocket Server request--->End\n` );

    console.log( `\nHTTPS and WebSocket Server connInfo--->Start` );
    /*
     {
     localAddr: { hostname: "127.0.0.1", port: 9000, transport: "tcp" },
     remoteAddr: { hostname: "127.0.0.1", port: 64071, transport: "tcp" }
     }
     */
    console.dir( connInfo );
    console.log( `HTTPS and WebSocket Server connInfo--->End\n` );

    const upgrade: string = request.headers.get( 'upgrade' ) ?? '',
      // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
      connection: string = request.headers.get( 'connection' ) ?? '';

    console.log( `\n\n请求头中的connection值为：${ connection }。
请求头中的upgrade值为：${ upgrade }。\n\n` );

    if( upgrade.toLowerCase() === 'websocket' && ( connection.toLowerCase() === 'upgrade' || connection.toLowerCase() === 'keep-alive, Upgrade'.toLowerCase() ) ){
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
      }
      catch( error: unknown ){
        return InterceptorError.ResError( {
          title: `HTTPS and WebSocket Server服务器内部出现错误`,
          message: `HTTP请求没有尝试升级到websocket。
错误信息：
${ ( error as Error ).message }`,
        } );
      }

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

      return response;
    }
    else{
      return Routers( request );
    }
  },
  {
    port: 9000,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9000”能连接上（http、https、ws、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9000”、“https://localhost:9000”能连接上（http、https、ws、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9000”、“https://127.0.0.1:9000”、“https://192.168.10.101:9000”能连接上（http、https、ws、wss皆是如此）。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9000”能连接上（http、https、ws、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9000”、“https://localhost:9000”能连接上（http、https、ws、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9000”、“https://127.0.0.1:9000”、“https://192.168.10.101:9000”能连接上（http、https、ws、wss皆是如此）。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9000”）跟其中的websocket服务地址（如“wss://localhost:9300”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9300”。<br />
     * 3、然后才能让页面（如“https://localhost:9000”）成功访问其中的websocket服务地址（如“wss://localhost:9300”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9000。<br />
     */
    hostname: '0.0.0.0',
    // @ts-ignore
    key: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPS001/HTTPS001Key.pem` ) ),
    // @ts-ignore
    cert: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPS001/HTTPS001Server.crt` ) ),
    onListen: (
      {
        hostname,
        port,
      }: {
        hostname: string;
        port: number;
      }
    ): void => {
      console.log( `\nHTTPS and WebSocket Server已启动：https://${ hostname }:${ port }/、wss://${ hostname }:${ port }/。\n` );
    },
    onError: ( error: unknown ): TypeResponse001 => {
      console.error( `\nHTTPS and WebSocket Server onError--->Start` );
      console.error( error );
      console.error( `HTTPS and WebSocket Server onError--->End\n` );

      return InterceptorError.ResError( {
        title: `HTTPS and WebSocket Server服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  }
);
