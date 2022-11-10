/**
 * Project: web-project-template
 * FileDirPath: tinify_tool_by_multi_thread/WorkerThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 子线程，专门用于读取图片、压缩图片、生成图片。
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

import Tinify from 'tinify';

import {
  MyConsole,
} from './UniversalToolForNode.esm.mjs';

let startTimer001 = 0,
  photoFileStream = null,
  resultBuffer = null,
  resultFilePath = '',
  resultFilePathParseObj = null,
  currentPhotoPath = '';

function StartCompression( sourceData ){
  return new Promise( ( resolve = () => {
  }, reject = () => {
  } ) => {
    let resultSource = null;

    try{
      resultSource = Tinify.fromBuffer( sourceData );

      resultSource.toBuffer( ( error, resultData ) => {
        if( error ){
          resolve( false );
        }
        else{
          resolve( resultData );
        }
      } );
    }
    catch( error ){
      resolve( false );
    }
  } );
}

parentPort.on( 'close', () => {
  MyConsole.Cyan( `
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
该端口已关闭。
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );
} );

parentPort.on( 'messageerror', errorObject => {
  MyConsole.Red( `
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );
} );

parentPort.on( 'message', async ( {
  tinifyKey,
  photoPath,
} ) => {
  startTimer001 = performance.now();

  Tinify.key = tinifyKey;

  currentPhotoPath = photoPath;

  resultFilePath = photoPath.replace( join( workerData.initPath, '/' ), join( workerData.savePath, '/' ) );

  if( !workerData.isNest ){
    resultFilePathParseObj = parse( resultFilePath );

    resultFilePath = join( workerData.savePath, `/${ resultFilePathParseObj.name }_${ Number.parseInt( String( Date.now() ) ) }${ resultFilePathParseObj.ext }` );
  }

  // photoFileStream--->Uint8Array   photoFileStream.buffer--->ArrayBuffer
  photoFileStream = await readFile( photoPath );

  // resultBuffer--->Uint8Array
  resultBuffer = await StartCompression( photoFileStream );

  if( resultBuffer ){
    await writeFile( resultFilePath, resultBuffer );

    parentPort.postMessage( {
      isSuccess: true,
      tinifyKey,
      photoPath,
      takeUpTime: ( performance.now() - startTimer001 ) / 1000,
    } );
  }
  else{
    parentPort.postMessage( {
      isSuccess: false,
      tinifyKey,
      photoPath,
      takeUpTime: ( performance.now() - startTimer001 ) / 1000,
    } );
  }
} );
