/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

'use strict';

import {
  WebSocketServer,
} from 'ws';

// ws://localhost:9900/
const wss = new WebSocketServer( {
  port: 9900,
} );

let i = 0;

wss.on( 'connection', ws => {
  ws.on( 'message', data => {
    ws.send( `${ ++i }：这是服务器发送来的数据。` );

    console.log( `\n这是客户端发来的数据---Start` );
    console.dir( String( data ) );
    console.log( `这是客户端发来的数据---End\n\n` );
  } );
} );
