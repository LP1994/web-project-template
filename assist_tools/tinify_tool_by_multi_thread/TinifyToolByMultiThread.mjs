/*
 Project: web-project-template
 FileDirPath: tinify_tool_by_multi_thread/TinifyToolByMultiThread.mjs
 Author: 12278
 Email: 1227839175@qq.com
 IDE: WebStorm
 CreateDate: 2022-10-14 23:04:21 星期五
 */

/*
 本工具是集成tinify的图片压缩工具，支持压缩后缀为.png、.webp、.jpg、.jpeg、.jpe的图片，且图片大小只能小于等于5MB。

 说明：
 1、
 将需要压缩的图片放在“in”文件夹下，支持文件夹嵌套存放，压缩后的图片会出现在“out”文件夹下，默认文件夹层级跟原先的一致。
 2、
 支持通过执行时传参来指定是不是按原来的文件夹层级来输出，如果不需要按原来的层级，则会把输出的图片全都直接放在“out”文件夹下，没文件夹嵌套，但是会为照片名附加时间戳，以免同名覆盖。
 3、
 双击执行“TinifyToolByMultiThread.bat”即可开始压缩。

 PS：
 1、
 如果能看得懂代码，也可以在代码中切换参数，根据自己的需要改改参数什么的。

 参数说明：
 1、
 nest=true，表示输出的文件夹层级跟原先的一致；nest=false，不需要按原来的层级，会把输出的图片全都直接放在“out”文件夹下，没文件夹嵌套，但是会为照片名附加时间戳，以免同名覆盖。

 参数使用示例：
 1、
 “node TinifyToolByMultiThread.mjs”全等于“node TinifyToolByMultiThread.mjs nest=true”，也是默认的。
 */

'use strict';

import {
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs';

import {
  cpus,
} from 'node:os';

import {
  extname,
  join,
} from 'node:path';

import {
  performance,
} from 'node:perf_hooks';

import {
  argv,
  exit,
} from 'node:process';

import {
  isMainThread,
  Worker,
} from 'node:worker_threads';

import {
  Get__dirname,
  MyConsole,
} from './UniversalToolForNode.esm.mjs';

const defaultArgs = {
    nest: true,
  },
  threadQuantity = cpus().length - 1,
  inDir = 'in',
  outDir = 'out',
  workerThreadFilePath = './WorkerThread.mjs',
  dirPathArr = [],
  photoPathArr = [],
  compressionFailedForPhotoPathArr = [];

const {
  nest: isNest,
} = ( argv => {
  if( argv.length <= 2 ){
    return defaultArgs;
  }
  else{
    argv.forEach( v => {
      if( v === 'nest=false' ){
        defaultArgs.nest = false;
      }
    } );

    return defaultArgs;
  }
} )( argv );

function PathJoinForStart( path ){
  return join( Get__dirname( import.meta.url ), path );
}

const initPath = PathJoinForStart( inDir ),
  savePath = PathJoinForStart( outDir );

dirPathArr.push( initPath );

function CreateDirectory( directoryPath ){
  mkdirSync( directoryPath.replace( join( initPath, '/' ), join( savePath, '/' ) ) );
}

function RetrieveForDir( path ){
  let path001 = '',
    fsStats = null,
    suffix001 = '';

  readdirSync( path ).forEach( v => {
    path001 = join( path, `/${ v }` );
    fsStats = statSync( path001 );

    if( fsStats.isDirectory() ){
      dirPathArr.push( path001 );

      if( isNest ){
        CreateDirectory( path001 );
      }
    }
    else if( fsStats.isFile() ){
      suffix001 = extname( path001 ).slice( 1 ).toLocaleLowerCase().trim();

      if( suffix001 === 'png' || suffix001 === 'webp' || suffix001 === 'jpg' || suffix001 === 'jpeg' || suffix001 === 'jpe' ){
        if( fsStats.size > 5 * 1024 * 1024 ){
          MyConsole.Yellow( `tinify目前只支持压缩图片大小小于等于5MB的图片（${ path001 }）。` );
        }
        else{
          photoPathArr.push( path001 );
        }
      }
      else{
        MyConsole.Yellow( `tinify目前只支持压缩后缀为.png、.webp、.jpg、.jpeg、.jpe的图片（${ path001 }）。` );
      }
    }
  } );
}

do{
  RetrieveForDir( dirPathArr.shift() );
}
while( dirPathArr.length > 0 );

const photoQuantity = photoPathArr.length;

let startTimer = 0;

function CreateWorkerIns( photoPath, workerInsIndex ){
  const workerIns = new Worker( workerThreadFilePath, {
    workerData: {
      workerInsID: `workerInsID${ workerInsIndex }`,
      initPath,
      savePath,
      isNest,
    },
  } );

  workerIns.on( 'error', errorEventData => {
    MyConsole.Red( `\nerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );
    MyConsole.Red( `Object.prototype.toString.call( errorEventData )--->${ Object.prototype.toString.call( errorEventData ) }` );
    MyConsole.Red( errorEventData );
    MyConsole.Red( `error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n` );
  } );

  workerIns.on( 'exit', exitCode => {
    MyConsole.Yellow( `\nexit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );
    MyConsole.Yellow( `exitCode:${ exitCode }.` );
    MyConsole.Yellow( `exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n` );

    if( Number( exitCode ) !== 0 ){
      MyConsole.Yellow( `\nWorker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.` );
    }
  } );

  workerIns.on( 'message', messageData => {
    if( messageData.isSuccess ){
      MyConsole.Blue( `\n\nmessage event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );

      MyConsole.Blue( `\n${ messageData.photoPath }` );
      MyConsole.Green( '压缩完成。' );
      MyConsole.Green( `耗时${ messageData.takeUpTime.toFixed( 3 ) }秒。\n` );

      MyConsole.Blue( `message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n\n` );
    }
    else{
      compressionFailedForPhotoPathArr.push( messageData.photoPath );

      MyConsole.Red( `\n\nmessage event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );

      MyConsole.Red( `\n${ messageData.photoPath }` );
      MyConsole.Red( '未压缩完成。' );

      MyConsole.Red( `message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n\n` );
    }

    if( photoPathArr.length > 0 ){
      workerIns.postMessage( {
        photoPath: photoPathArr.shift(),
      } );
    }
    else if( photoPathArr.length === 0 && compressionFailedForPhotoPathArr.length > 0 ){
      workerIns.postMessage( {
        photoPath: compressionFailedForPhotoPathArr.shift(),
      } );
    }
    else if( photoPathArr.length === 0 && compressionFailedForPhotoPathArr.length === 0 ){
      MyConsole.Green( `\n全部压缩完成，总共耗时${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！\n` );

      // If the worker was terminated, the exitCode parameter is 1.
      workerIns.terminate().then( exitCode => {
        MyConsole.Yellow( `\n停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );

        exit( 0 );
      }, reject => {
      } );
    }
  } );

  workerIns.on( 'messageerror', errorObject => {
    MyConsole.Red( `\n反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );
    MyConsole.Red( `Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }` );
    MyConsole.Red( errorObject );
    MyConsole.Red( `反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n` );
  } );

  workerIns.on( 'online', () => {
    MyConsole.Cyan( `\n子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );
  } );

  workerIns.postMessage( {
    photoPath,
  } );

  return workerIns;
}

if( photoQuantity > 0 ){
  startTimer = performance.now();

  let createWorkerThreadQuantity = threadQuantity,
    workerInsArr = [];

  if( photoQuantity <= threadQuantity ){
    createWorkerThreadQuantity = photoQuantity;
  }

  for(
    let i = 0;
    i < createWorkerThreadQuantity;
    ++i
  ){
    workerInsArr.push( CreateWorkerIns( photoPathArr.shift(), i ) );
  }

  MyConsole.Cyan( `创建了${ createWorkerThreadQuantity }个Worker线程！` );
}
