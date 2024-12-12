#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-shadow-realm --experimental-vm-modules --experimental-wasm-modules --experimental-websocket --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: upload-for-multiple
 * FileDirPath: IPHandle.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

'use strict';

// IP.2 =
let start = 2;

const arr001 = [
    [
      '192.168.1.1',
      200,
    ],
    [
      '192.168.2.1',
      200,
    ],
  ],
  result001 = [];

let arr002 = [],
  num001;

arr001.forEach( ( [ str001, num002 ], index001 ) => {
  arr002 = str001.split( '.' );

  num001 = Number( arr002.at( -1 ) );

  for(
    let index002 = 0;
    index002 <= num002;
    ++index002
  ){
    arr002[ arr002.length - 1 ] = num001 + index002;

    result001.push( `IP.${ start++ } = ${ arr002.join( '.' ) }` );
  }
} );

console.log( result001.join( `
` ) );
