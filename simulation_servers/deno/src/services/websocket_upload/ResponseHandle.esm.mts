/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/websocket_upload/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:42 星期四
 */

'use strict';

import {
  type TypeResponse001,

  // uploadDir,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

// @ts-ignore
import InterceptorError from 'public/InterceptorError.esm.mts';

function ResponseHandle( request: Request ): TypeResponse001{
  let response: Response,
    wsForServer: WebSocket,
    url: URL,
    pathName: string;

  try{
    (
      {
        response,
        socket: wsForServer,
        // @ts-ignore
      } = Deno.upgradeWebSocket( request, {
        /**
         * 1、将客户端Web套接字上的“protocol”属性设置为此处提供的值，该值应该是请求Web套接字时在协议参数中指定的字符串之一。<br />
         * 2、这旨在让客户端和服务器指定用于相互通信的子协议。<br />
         * 3、在客户端使用时，需要注意，客户端发出的请求会在请求头增加一个键值对：<br />
         * "Sec-WebSocket-Protocol": "simulation_servers_deno_WebSocket"。<br />
         * 如果客户端发出的请求的请求头没有该键值对，客户端就会连接不上。<br />
         * 例如，在浏览器端的JS代码：<br />
         * new WebSocket( 'wss://127.0.0.1:9200/', 'simulation_servers_deno_WebSocket' );<br />
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

    url = new URL( request.url );
    pathName = url.pathname;

    // @ts-ignore
    wsForServer.addEventListener( 'open', ( event: Event ): void => {
      console.log( `\n\nWebSocket针对“${ pathName }”的服务已打开。\n\n` );
    } );

    // @ts-ignore
    wsForServer.addEventListener( 'close', ( closeEvent: CloseEvent ): void => {
      console.log( `\n\nWebSocket针对“${ pathName }”的服务已关闭。\n\n` );
    } );

    wsForServer.addEventListener( 'error', ( errorEvent: Event | ErrorEvent ): void => {
      console.error( `\n\nWebSocket针对“${ pathName }”的服务出现错误。Start` );
      console.error( ( errorEvent as ErrorEvent ).message );
      console.error( `WebSocket针对“${ pathName }”的服务出现错误。End\n\n` );
    } );

    wsForServer.addEventListener( 'message', ( messageEvent: MessageEvent ): void => {
      console.log( `\n\nWebSocket收到了来自客户端通过“${ pathName }”上传的文件。Start` );
      console.dir( messageEvent.data );
      console.log( `WebSocket收到了来自客户端通过“${ pathName }”上传的文件。End\n\n` );

      wsForServer.send( `${ new Date().toString() }：WebSocket服务端成功收到了客户端通过“${ pathName }”上传的文件。` );
    } );

    return response;
  }
  catch( error: unknown ){
    return InterceptorError.ResError( {
      title: `WebSocket服务器内部出现错误`,
      message: `WebSocket错误信息：
${ ( error as Error ).message }`,
    } );
  }
}

export default ResponseHandle;