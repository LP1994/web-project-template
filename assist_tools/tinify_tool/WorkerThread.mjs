/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: assist_tools/tinify_tool/WorkerThread.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 子线程，专门用于读取图片、压缩图片、生成图片。
 */

'use strict';

import {
  join,
  parse,
} from 'node:path';

import {
  performance,
} from 'node:perf_hooks';

import {
  isMainThread,
  parentPort,
  threadId,
  workerData,
} from 'node:worker_threads';

import {
  MyConsole,
} from './UniversalToolForNode.esm.mjs';

let startTimer001 = 0,
  resultFilePath = '',
  resultFilePathParseObj = null;

parentPort.on( 'close', () => {
  MyConsole.Cyan( `\nclose event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start` );
  MyConsole.Cyan( '该端口已关闭。' );
  MyConsole.Cyan( `close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'messageerror', errorObject => {
  MyConsole.Red( `\n反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start` );
  MyConsole.Red( `typeof errorObject--->${ typeof errorObject }` );
  MyConsole.Red( errorObject );
  MyConsole.Red( `反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'message', async ( {
  photoPath,
} ) => {
  startTimer001 = performance.now();

  resultFilePath = photoPath.replace( join( workerData.initPath, '/' ), join( workerData.savePath, '/' ) );

  if( !workerData.isNest ){
    resultFilePathParseObj = parse( resultFilePath );

    resultFilePath = join( workerData.savePath, `/${ resultFilePathParseObj.name }_${ Number.parseInt( String( Date.now() ) ) }${ resultFilePathParseObj.ext }` );
  }

  parentPort.postMessage( {
    photoPath,
    takeUpTime: ( performance.now() - startTimer001 ) / 1000,
  } );
} );
