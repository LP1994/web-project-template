/**
 * Project: web-project-template
 * FileDirPath: src/pages/home/Home.js
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

document.querySelector( 'main' ).textContent = 'Home Page!';

document.querySelector( 'main' ).addEventListener( 'click', event => {
  axios.get( `/simulation_servers_deno/GetJSON` ).then( res => {
    console.dir( res );
  } );

  axios.post( `/simulation_servers_deno/upload` ).then( res => {
    console.dir( res );
  } );
} );
