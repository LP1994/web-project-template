/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: src/workers/shared_workers/SharedWorkerDemo001.js
 * IDE: WebStorm
 * Project: web-project-template
 */

'use strict';

globalThis.importScripts( './tools/SWorker4CT.compiler.js' );

let sWorker4CT_ins = new SharedWorkerTool( globalThis ),
  sWorker4CT2Name_str = globalThis.name,
  numA = 2020;

sWorker4CT_ins.onConnect( ( port, onConnectEvent ) => {
  console.log( `${ sWorker4CT2Name_str }---onConnectEvent--->Start` );
  console.dir( onConnectEvent );
  console.log( `${ sWorker4CT2Name_str }---onConnectEvent--->End` );

  Array.from( onConnectEvent.ports )
  .forEach( ( c, i, a ) => {
    c.onmessage = event => {
      console.log( `${ sWorker4CT2Name_str }---port${ i }---onmessage--->Start` );
      console.dir( c );
      console.dir( event );
      console.log( `${ sWorker4CT2Name_str }---port${ i }---onmessage--->End` );

      sWorker4CT_ins.portPostMessage( c, {
        dataA: `${ sWorker4CT2Name_str }---port${ i }：${ new Date() }`,
        numA: numA,
      } );
    };
    c.start();
  } );
} );
