/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/servers/WebSocketServerForPort9900.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import WebSocket from 'ws';

let i = 0;

const wsServer = new WebSocket.Server( {
  port: 9900,
} );

wsServer.on( 'connection', ws => {
  // 当收到客户端发送来的消息时，会触发这个事件。
  ws.on( 'message', data => {
    ++i;

    console.log( `\n\n${ i }message---Start` );
    console.dir( data );
    console.log( `${ i }message---End\n\n` );

    ws.send( `来自服务器的信息：这是WebSocket服务器发送来的数据${ i }。` );
  } );
} );
