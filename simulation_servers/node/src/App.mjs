/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/App.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

Promise.allSettled( [
  import( './servers/HTTPServerForPort9999.mjs' ),
  import( './servers/WebSocketServerForPort9900.mjs' ),
] )
.then(
  resolve => {
    console.log( `\n\nresolve--->Start` );
    console.dir( resolve );
    console.log( `resolve--->End\n\n` );
  },
  reject => {
    console.log( `\n\nreject--->Start` );
    console.error( reject );
    console.log( `reject--->End\n\n` );
  }
)
.catch( error => {
  console.log( `\n\ncatch error--->Start` );
  console.error( error );
  console.log( `catch error--->End\n\n` );
} );
