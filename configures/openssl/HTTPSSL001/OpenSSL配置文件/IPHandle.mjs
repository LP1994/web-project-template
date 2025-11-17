#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-quic --experimental-eventsource --experimental-vm-modules --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: web-project-template
 * FileDirPath: IPHandle.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-13 19:16:44 星期日
 */

'use strict';

// IP.2 = 
let start = 2;

const arr001 = [
    [
      '192.168.0.1',
      200,
    ],
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
