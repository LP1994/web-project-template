/*
 Project: web-project-template
 FileDirPath: src/pages/hello_world/HelloWorld.js
 Author: 12278
 Email: 1227839175@qq.com
 IDE: WebStorm
 CreateDate: 2022-07-30 14:06:30 星期六
 */

'use strict';

document.querySelector( 'h1' ).textContent = `Hello World!`;

document.querySelector( 'h1' ).addEventListener( 'click', event => {
  import(
    /* webpackMode: "lazy" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    /* webpackChunkName: "MyModule001" */
    /* webpackExports: [ "Test001" ] */
    './MyModule001.esm.mjs'
    ).then( ( {
    Test001,
  } ) => {
    Test001();
  } );
} );
