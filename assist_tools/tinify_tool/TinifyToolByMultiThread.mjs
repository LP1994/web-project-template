/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: assist_tools/tinify_tool/TinifyToolByMultiThread.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 本工具用于图片压缩，原图片大小只能是小于5MB的，只支持后缀名为“.png”、“.jpe”、“.jpeg”、“.jpg”、“.webp”的图片。
 *
 * 说明：
 * 1、
 * 将需要压缩的图片放在“in”文件夹下，支持文件夹嵌套存放，压缩后的图片会出现在“out”文件夹下，默认文件夹层级跟原先的一致。
 * 2、
 * 支持通过执行时传参来指定是不是按原来的文件夹层级来输出，如果不需要按原来的层级，则会把输出的图片全都直接放在“out”文件夹下，没文件夹嵌套，但是会为照片名附加时间戳，以免同名覆盖。
 * 3、
 * 双击执行“TinifyToolByMultiThread.bat”即可开始压缩。
 *
 * PS：
 * 1、
 * 如果能看得懂代码，也可以在代码中切换参数，根据自己的需要改改参数什么的。
 *
 * 参数说明：
 * 1、
 * nest=true，表示输出的文件夹层级跟原先的一致；nest=false，不需要按原来的层级，会把输出的图片全都直接放在“out”文件夹下，没文件夹嵌套，但是会为照片名附加时间戳，以免同名覆盖。
 *
 * 参数使用示例：
 * 1、
 * “node TinifyToolByMultiThread.mjs”全等于“node TinifyToolByMultiThread.mjs nest=true”，也是默认的。
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
    type: 'PNG',
  },
  threadQuantity = cpus().length - 1,
  inDir = 'in',
  outDir = 'out',
  quality = 1,
  workerThreadFilePath = './WorkerThread.mjs',
  dirPathArr = [],
  photoPathArr = [];

const {
  nest: isNest,
  type: photoType,
} = ( argv => {
  if( argv.length <= 2 ){
    return defaultArgs;
  }
  else{
    argv.forEach( v => {
      if( v === 'nest=false' ){
        defaultArgs.nest = false;
      }
      else if( v === 'type=JPEG' ){
        defaultArgs.type = 'JPEG';
      }
    } );

    return defaultArgs;
  }
} )( argv );

const suffix = `.${ photoType.toLocaleLowerCase() }`;

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

      if( suffix001 === 'heic' || suffix001 === 'heif' ){
        photoPathArr.push( path001 );
      }
    }
  } );
}

do{
  RetrieveForDir( dirPathArr.shift() );
}
while( dirPathArr.length > 0 );

const photoQuantity = photoPathArr.length;

let toDoneNum = 0,
  startTimer = 0;

function CreateWorkerIns( photoPath, workerInsIndex ){
  const workerIns = new Worker( workerThreadFilePath, {
    workerData: {
      workerInsID: `workerInsID${ workerInsIndex }`,
      initPath,
      savePath,
      quality,
      suffix,
      isNest,
      photoType,
    },
  } );

  workerIns.on( 'error', errorEventData => {
    MyConsole.Red( `\nerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );
    MyConsole.Red( `typeof errorEventData--->${ typeof errorEventData }` );
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
    ++toDoneNum;

    MyConsole.Blue( `\n\nmessage event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );

    MyConsole.Blue( `\n${ messageData.photoPath }` );
    MyConsole.Green( '转换完成。' );
    MyConsole.Green( `耗时${ messageData.takeUpTime.toFixed( 3 ) }秒。\n` );

    MyConsole.Blue( `message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n\n` );

    if( toDoneNum === photoQuantity ){
      MyConsole.Green( `\n全部转换完成，总共耗时${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！！！\n` );

      // If the worker was terminated, the exitCode parameter is 1.
      workerIns.terminate().then( exitCode => {
        MyConsole.Yellow( `\n停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );

        exit( 0 );
      }, reject => {
      } );
    }

    if( photoPathArr.length > 0 ){
      workerIns.postMessage( {
        photoPath: photoPathArr.shift(),
      } );
    }
  } );

  workerIns.on( 'messageerror', errorObject => {
    MyConsole.Red( `\n反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );
    MyConsole.Red( `typeof errorObject--->${ typeof errorObject }` );
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
