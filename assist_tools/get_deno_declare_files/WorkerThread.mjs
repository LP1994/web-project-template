/**
 * Project: web-project-template
 * FileDirPath: get_deno_declare_files/WorkerThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 子线程，专门用于读取文件、拷贝文件。
 */

'use strict';

import {
  readFile,
  writeFile,
} from 'node:fs/promises';

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
  fileFileStream = null,
  resultFilePath = '',
  resultFilePathParseObj = null;

parentPort.on( 'close', () => {
  MyConsole.Cyan( `\nclose event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
该端口已关闭。
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'messageerror', errorObject => {
  MyConsole.Red( `\n反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
typeof errorObject--->${ typeof errorObject }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'message', async ( {
  filePath,
} ) => {
  startTimer001 = performance.now();

  // fileFileStream--->Uint8Array   fileFileStream.buffer--->ArrayBuffer
  fileFileStream = await readFile( filePath );

  resultFilePath = filePath.replace( join( workerData.initPath, '/' ), join( workerData.savePath, '/' ) );

  if( !workerData.isNest ){
    resultFilePathParseObj = parse( resultFilePath );

    resultFilePath = join( workerData.savePath, `/${ resultFilePathParseObj.name }${ resultFilePathParseObj.ext }` );
  }

  await writeFile( resultFilePath, fileFileStream );

  parentPort.postMessage( {
    filePath,
    takeUpTime: ( performance.now() - startTimer001 ) / 1000,
  } );
} );
