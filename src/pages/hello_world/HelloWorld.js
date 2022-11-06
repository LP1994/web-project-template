/**
 * Project: web-project-template
 * FileDirPath: src/pages/hello_world/HelloWorld.js
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

document.querySelector( 'main' ).textContent = `Hello World!`;

const webSocket = new WebSocket( `${ location.protocol === 'http:'
                                     ? 'ws:'
                                     : 'wss:' }//${ location.hostname }:9900/simulation_servers_deno/subscriptions`, 'simulation_servers_deno_WebSocket' );

webSocket.addEventListener( 'message', (
  {
    data,
  }
) => {
  console.log( `\n\n我是服务器发过来的消息。Start` );
  console.dir( data );
  console.log( `我是服务器发过来的消息。End\n\n` );
} );

document.querySelector( 'main' ).addEventListener( 'click', event => {
  webSocket.send( `\n\n我是客户端发过来的消息：7788。\n\n` );
} );
