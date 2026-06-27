/**
 * Project: web-project-template
 * FileDirPath: webp_tool_by_multi_thread/image_to_webp/WorkerThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-01-01 00:00:00 星期六
 */

/**
 * 子线程，专门用于读取图片、转换图片、生成图片。
 */

'use strict';

import {
  execSync,
} from 'node:child_process';

import {
  readFile,
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

import FastEXIF from 'fast-exif';

import {
  MyConsole,
} from '../UniversalToolForNode.esm.mjs';

let startTimer001 = 0,
  photoFileStream = null,
  resultFilePath = '',
  resultFilePathParseObj = null,
  degree = 0;

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
  photoPath,
} ) => {
  startTimer001 = performance.now();

  resultFilePath = photoPath.replace( join( workerData.initPath, '/' ), join( workerData.savePath, '/' ) );

  if( !workerData.isNest ){
    resultFilePathParseObj = parse( resultFilePath );

    resultFilePath = join( workerData.savePath, `/${ resultFilePathParseObj.name }_${ Number.parseInt( String( Date.now() ) ) }${ resultFilePathParseObj.ext }` );
  }

  resultFilePath += '.webp';

  const {
    image: {
      Orientation,
    },
  } = ( await FastEXIF.read( photoPath ) ) ?? { image: { Orientation: null, }, };

  if( String( Orientation ) === 'null' ){
    degree = 0;
  }
  else{
    switch( String( Orientation ) ){
      case '1':
        degree = 0;

        break;
      case '3':
        degree = 180;

        break;
      case '6':
        degree = 90;

        break;
      case '8':
        degree = -90;

        break;
      default:
        degree = 0;

        MyConsole.Red( `
isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID }--->Start
Orientation属性值“${ Orientation }”不在处理的范畴！
isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID }--->End
` );

        break;
    }
  }

  // photoFileStream--->Uint8Array   photoFileStream.buffer--->ArrayBuffer
  photoFileStream = await readFile( photoPath );

  if( IsAPNG( photoFileStream ) ){
    MyConsole.Yellow( `\n\n“${ photoPath }”是一张apng图片，当前配置不对该类型图片进行压缩优化，仅原样输出。\n\n` );

    execSync( `copy "${ photoPath }" "${ parse( resultFilePath ).dir }"` );
  }
  else{
    execSync( `cwebp -mt -metadata icc -o ${ resultFilePath } -- ${ photoPath }`, {
      cwd: new URL( '../lib_webp/bin', import.meta.url ),
    } );
    // magick命令依赖本地安装ImageMagick，并将ImageMagick的安装目录添加到系统环境变量中。ImageMagick版本如：ImageMagick-7.1.2-18-Q16-HDRI-x64-dll，最新版本的ImageMagick下载可见：https://imagemagick.org/script/download.php#windows
    execSync( `magick ${ resultFilePath } -rotate ${ degree } ${ resultFilePath }` );
  }

  parentPort.postMessage( {
    photoPath,
    takeUpTime: ( performance.now() - startTimer001 ) / 1000,
  } );
} );
