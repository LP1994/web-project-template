#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-quic --experimental-eventsource --experimental-vm-modules --experimental-webstorage --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: web-project-template
 * FileDirPath: tinify_tool_by_multi_thread/TinifyToolByMultiThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 本工具是集成tinify的图片压缩工具，支持压缩后缀为.png、.webp、.jpg、.jpeg、.jpe的图片，且图片大小只能小于等于5MB。
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

import Tinify from 'tinify';

import {
  Get__dirname,
  MyConsole,
} from './UniversalToolForNode.esm.mjs';

MyConsole.Yellow( `\n本工具使用期间要保证网络连接通畅，否则会出现压缩中断。\n` );

function TinifyValidate( TinifyKey ){
  Tinify.key = TinifyKey;

  return new Promise( ( resolve = () => {
  }, reject = () => {
  } ) => {
    MyConsole.Cyan( `\n当前验证的Key为：${ TinifyKey }` );

    Tinify.validate( error => {
      if( error instanceof Tinify.AccountError ){
        // AccountError：Error: Credentials are invalid. (HTTP 401/Unauthorized)
        MyConsole.Red( `AccountError：${ error }` );

        resolve( {
          error,
          key: TinifyKey,
          compressionCount: Tinify.compressionCount,
        } );
      }
      else if( error instanceof Tinify.ClientError ){
        MyConsole.Red( `ClientError：${ error }` );

        resolve( {
          error,
          key: TinifyKey,
          compressionCount: Tinify.compressionCount,
        } );
      }
      else if( error instanceof Tinify.ServerError ){
        MyConsole.Red( `ServerError：${ error }` );

        resolve( {
          error,
          key: TinifyKey,
          compressionCount: Tinify.compressionCount,
        } );
      }
      else if( error instanceof Tinify.ConnectionError ){
        // ConnectionError：Error: Error while connecting: getaddrinfo ENOTFOUND api.tinify.com
        MyConsole.Red( `ConnectionError：${ error }` );

        resolve( {
          error,
          key: TinifyKey,
          compressionCount: Tinify.compressionCount,
        } );
      }
      else if( error ){
        MyConsole.Red( `其他错误：${ error }` );

        resolve( {
          error,
          key: TinifyKey,
          compressionCount: Tinify.compressionCount,
        } );
      }
      else{
        MyConsole.Cyan( `当前Key可以正常使用。` );

        resolve( {
          error: null,
          key: TinifyKey,
          compressionCount: Tinify.compressionCount,
        } );
      }

      MyConsole.Cyan( `当前Key已经使用过的压缩数量（每月免费500）：${ Tinify.compressionCount }。\n` );
    } );
  } );
}

const defaultArgs = {
    nest: true,
  },
  threadQuantity = cpus().length - 1,
  inDir = 'in',
  outDir = 'out',
  workerThreadFilePath = './WorkerThread.mjs',
  dirPathArr = [],
  photoPathArr = [],
  compressionFailedForPhotoPathArr = [],
  TinifyKeys = await ( async arr => {
    const result = {};

    let obj1 = null;

    while( arr.length > 0 ){
      obj1 = await TinifyValidate( arr.shift() );

      if( obj1.error === null && Number( obj1.compressionCount ) < 500 ){
        result[ obj1.key ] = 500 - Number( obj1.compressionCount );
      }
    }

    return Object.entries( result );
  } )( [
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
  ] );

if( TinifyKeys.length === 0 ){
  MyConsole.Red( `\n没有可用的TinifyKey。\n` );

  throw new Error( '没有可用的TinifyKey。' );
}

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

      if( [
        'jpe',
        'jpeg',
        'jpg',
        'webp',
        'png',
      ].includes( suffix001 ) ){
        if( fsStats.size > 5 * 1024 * 1024 ){
          MyConsole.Yellow( `\ntinify目前只支持压缩图片大小小于等于5MB且大于0MB的图片（${ path001 }）。\n` );
        }
        else if( Number( fsStats.size ) === 0 ){
          MyConsole.Yellow( `
${ path001 }
不支持文件大小小于等于0的文件。
` );
        }
        else{
          photoPathArr.push( path001 );
        }
      }
      else{
        MyConsole.Yellow( `\ntinify目前只支持压缩后缀为.png、.webp、.jpg、.jpeg、.jpe的图片（${ path001 }）。\n` );
      }
    }
  } );
}

do{
  RetrieveForDir( dirPathArr.shift() );
}
while( dirPathArr.length > 0 );

const photoQuantity = photoPathArr.length;

MyConsole.Cyan( `
需要压缩的图片有${ photoQuantity }张。
可压缩次数有${ Object.values( Object.fromEntries( TinifyKeys ) )
  .reduce( ( accumulator, currentValue ) => accumulator + currentValue, 0 ) }次。
` );

let startTimer = 0,
  successTotal = 0,
  arr001 = null,
  arr002 = null,
  arr003 = null,
  boo001 = true;

let [
  tinifyKey,
  usableTotal,
] = TinifyKeys.shift();

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
    MyConsole.Red( `
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
Object.prototype.toString.call( errorEventData )--->${ Object.prototype.toString.call( errorEventData ) }
${ errorEventData }
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );
  } );

  workerIns.on( 'exit', exitCode => {
    MyConsole.Yellow( `
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
exitCode:${ exitCode }.
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );

    if( Number( exitCode ) !== 0 ){
      MyConsole.Yellow( `\nWorker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.\n` );
    }
  } );

  workerIns.on( 'message', messageData => {
    if( messageData.isSuccess ){
      ++successTotal;

      MyConsole.Green( `
message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start

${ messageData.photoPath }
本张图片压缩成功。
本张图片压缩耗时${ messageData.takeUpTime.toFixed( 3 ) }秒。
已有${ successTotal }张压缩完成。
还有${ photoQuantity - successTotal }张未进行压缩。

message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );
    }
    else{
      compressionFailedForPhotoPathArr.push( messageData.photoPath );

      MyConsole.Red( `
message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start

${ messageData.photoPath }
未成功压缩。
本张图片压缩耗时${ messageData.takeUpTime.toFixed( 3 ) }秒。
有${ compressionFailedForPhotoPathArr.length }张未成功压缩的图片等待再次压缩。
已有${ successTotal }张压缩完成。
还有${ photoQuantity - successTotal }张未进行压缩。

message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );
    }

    if( photoPathArr.length > 0 ){
      if( usableTotal < successTotal + 1 ){
        arr002 = TinifyKeys.shift();

        if( arr002 ){
          tinifyKey = arr002[ 0 ];
          usableTotal += arr002[ 1 ];

          workerIns.postMessage( {
            tinifyKey,
            photoPath: photoPathArr.shift(),
          } );
        }
        else{
          MyConsole.Red( `
所有key的免费压缩次数都用完了，只能等下个月重置免费次数了，每个月每个key有500次免费压缩次数。
未全部压缩，总共耗时${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！
` );

          MyConsole.Green( `
已有${ successTotal }张压缩完成。
有${ compressionFailedForPhotoPathArr.length }张未成功压缩的图片。
还有${ photoQuantity - successTotal }张未进行压缩。
` );

          // If the worker was terminated, the exitCode parameter is 1.
          workerIns.terminate().then(
            exitCode => {
              MyConsole.Yellow( `\n停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );
            },
            reject => {
              throw new Error( reject );
            }
          );
        }
      }
      else{
        workerIns.postMessage( {
          tinifyKey,
          photoPath: photoPathArr.shift(),
        } );
      }
    }
    else if( photoPathArr.length === 0 && compressionFailedForPhotoPathArr.length > 0 ){
      if( usableTotal < successTotal + 1 ){
        arr003 = TinifyKeys.shift();

        if( arr003 ){
          tinifyKey = arr003[ 0 ];
          usableTotal += arr003[ 1 ];

          workerIns.postMessage( {
            tinifyKey,
            photoPath: compressionFailedForPhotoPathArr.shift(),
          } );
        }
        else{
          MyConsole.Red( `
所有key的免费压缩次数都用完了，只能等下个月重置免费次数了，每个月每个key有500次免费压缩次数。
未全部压缩，总共耗时${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！
` );

          MyConsole.Green( `
已有${ successTotal }张压缩完成。
有${ compressionFailedForPhotoPathArr.length }张未成功压缩的图片。
还有${ photoQuantity - successTotal }张未进行压缩。
` );

          // If the worker was terminated, the exitCode parameter is 1.
          workerIns.terminate().then(
            exitCode => {
              MyConsole.Yellow( `\n停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );
            },
            reject => {
              throw new Error( reject );
            }
          );
        }
      }
      else{
        workerIns.postMessage( {
          tinifyKey,
          photoPath: compressionFailedForPhotoPathArr.shift(),
        } );
      }
    }
    else if( successTotal === photoQuantity ){
      MyConsole.Green( `\n全部压缩完成，总共耗时${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！\n` );

      // If the worker was terminated, the exitCode parameter is 1.
      workerIns.terminate().then(
        exitCode => {
          MyConsole.Yellow( `\n停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );

          // 会强制退成程序！！！
          // exit( 0 );
        },
        reject => {
          throw new Error( reject );
        }
      );
    }
  } );

  workerIns.on( 'messageerror', errorObject => {
    MyConsole.Red( `
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );
  } );

  workerIns.on( 'online', () => {
    MyConsole.Cyan( `\n子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );
  } );

  workerIns.postMessage( {
    tinifyKey,
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
    if( boo001 ){
      if( usableTotal < i + 1 ){
        arr001 = TinifyKeys.shift();

        if( arr001 ){
          tinifyKey = arr001[ 0 ];
          usableTotal += arr001[ 1 ];

          workerInsArr.push( CreateWorkerIns( photoPathArr.shift(), i ) );
        }
        else{
          boo001 = false;

          MyConsole.Yellow( `\n所有key的免费压缩次数都用完了，只能等下个月重置免费次数了，每个月每个key有500次免费压缩次数。\n` );
        }
      }
      else{
        workerInsArr.push( CreateWorkerIns( photoPathArr.shift(), i ) );
      }
    }
  }

  MyConsole.Cyan( `\n创建了${ workerInsArr.length }个Worker线程！\n` );
}
