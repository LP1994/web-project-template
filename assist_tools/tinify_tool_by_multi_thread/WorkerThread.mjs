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

/**
 * 判断输入的图片是否是一张apng的png图片！返回true表示输入的图片是一张apng的png图片！反之不是apng。
 *
 * @param {Uint8Array} uint8Array 以数据类型Uint8Array表示的图片数据。
 *
 * @returns {boolean} 返回true表示输入的图片是一张apng的png图片！反之不是apng。
 */
function IsAPNG( uint8Array ){
  const readString = ( bytes, off, length ) => String.fromCharCode.apply( String, Array.prototype.slice.call( bytes.subarray( off, off + length ) ) ),
    eachChunk = ( bytes, callback ) => {
      const dv = new DataView( bytes.buffer );

      let off = 8,
        type = void 0,
        length = void 0,
        res = void 0;

      do{
        length = dv.getUint32( off );

        type = readString( bytes, off + 4, 4 );

        res = callback( type, bytes, off, length );

        off += 12 + length;
      }
      while( res !== false && type !== 'IEND' && off < bytes.length );
    },
    // '\x89PNG\x0d\x0a\x1a\x0a'
    PNGSignature = new Uint8Array( [
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a,
    ] );

  let isNotPNG = true,
    isNotAPNG = true;

  const bytes = uint8Array;

  if( Array.prototype.some.call( PNGSignature, ( b, i ) => b !== bytes[ i ] ) ){
    isNotPNG = true;
  }
  else{
    isNotPNG = false;
  }

  let isAnimated = false;

  eachChunk( bytes, type => !( isAnimated = type === 'acTL' ) );

  if( !isAnimated ){
    isNotAPNG = true;
  }
  else{
    isNotAPNG = false;
  }

  return !isNotPNG && !isNotAPNG;
}

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

  if( IsAPNG( photoFileStream ) ){
    MyConsole.Yellow( `\n\n“${ photoPath }”是一张apng图片，当前配置不对该类型图片进行压缩优化，仅原样输出。\n\n` );

    // resultBuffer--->Uint8Array
    resultBuffer = photoFileStream;
  }
  else{
    // resultBuffer--->Uint8Array
    resultBuffer = await StartCompression( photoFileStream );
  }

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
