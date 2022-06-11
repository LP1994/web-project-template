/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: src/workers/web_workers/WebWorkerDemo001.js
 * IDE: WebStorm
 * Project: web-project-template
 */

'use strict';

globalThis.importScripts( './tools/WWorker4CT.compiler.js' );

let wWorker4CT_ins = new WebWorkerTool( globalThis ),
  wWorker4CT2Name_str = globalThis.name;

wWorker4CT_ins.onMessage( event => {
  console.log( `${ wWorker4CT2Name_str }--->Start` );
  console.dir( event );
  console.log( `${ wWorker4CT2Name_str }--->End` );

  wWorker4CT_ins.postMessage( {
    dataA: `${ wWorker4CT2Name_str }：${ new Date() }`,
  } );
} );
