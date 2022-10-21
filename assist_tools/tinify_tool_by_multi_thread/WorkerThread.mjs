/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: tinify_tool_by_multi_thread/WorkerThread.mjs
 * IDE: WebStorm
 * Project: web-project-template
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

const TinifyKeys = [
  '0s9wNbBqccdXS2z9x45Z92MLy0t2J6ln',
  'kKYgs1yFdVgvtlmRzNjG3Wh38D20g386',
  'cGHCfjYhhs5BVwX2N2GpHb6m3wGhKYnC',
  'DLYB5cjQVRRS3Tdqfg0VD55Lkhn6J9B7',
  'gnbCS5fYTN5s2TPwRkXrZL3LctHBTnnQ',
  'Ht88MvDM3zx8cmx6hwCXxKDljZVkhW2k',
  'zFyCtt1KbCR1NFlLDmGCYd6spZwqbMPs',
  'yBQzXZ98BsMgxtKl88b5P27m6NDyzP3T',
  '6ZvY49BDj3S3VdgRZvrlvPnYQ124M3R1',
  'nwrqFLrb23MhVfzH5MWwY3d4TtYZzFGW',
  'FPwpSj4CxrgLRr8FNPvf0bH43F07RTc0',
  'jcGPsvJgFRXgd3yNXZgJFpsXRvsWFhdb',
];

Tinify.key = TinifyKeys.shift();

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
          reject( error );
        }
        else{
          resolve( resultData );
        }
      } );
    }
    catch( error ){
      reject( error );
    }
  } );
}

parentPort.on( 'close', () => {
  MyConsole.Cyan( `\nclose event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start` );
  MyConsole.Cyan( '该端口已关闭。' );
  MyConsole.Cyan( `close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'messageerror', errorObject => {
  MyConsole.Red( `\n反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start` );
  MyConsole.Red( `Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }` );
  MyConsole.Red( errorObject );
  MyConsole.Red( `反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'message', async ( {
  photoPath,
} ) => {
  startTimer001 = performance.now();

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

  await writeFile( resultFilePath, resultBuffer );

  parentPort.postMessage( {
    photoPath,
    takeUpTime: ( performance.now() - startTimer001 ) / 1000,
  } );
} );
