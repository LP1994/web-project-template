#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-quic --experimental-eventsource --experimental-vm-modules --experimental-webstorage --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: web-project-template
 * FileDirPath: get_deno_declare_files/GetDenoDeclareFilesByMultiThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 本工具用于从deno的源码包中关于提取关于deno的各个声明文件（.d.ts）。
 *
 * 说明：
 * 1、
 * 将需要提取的源码包解压到“in”文件夹下，支持文件夹嵌套存放，提取到的关于deno的各个声明文件（.d.ts）会出现在“out”文件夹下，默认文件夹层级为一级文件夹。
 * 2、
 * 支持通过执行时传参来指定是不是按原来的文件夹层级来输出，如果不需要按原来的层级，则会把输出的文件全都直接放在“out”文件夹下，没文件夹嵌套，但是会为文件名附加时间戳，以免同名覆盖。
 * 3、
 * 双击执行“GetDenoDeclareFilesByMultiThread.bat”即可开始提取。
 *
 * PS：
 * 1、
 * 如果能看得懂代码，也可以在代码中切换参数，根据自己的需要改改参数什么的。
 *
 * 参数说明：
 * 1、
 * nest=true，表示输出的文件夹层级跟原先的一致；nest=false，不需要按原来的层级，会把输出的文件全都直接放在“out”文件夹下，没文件夹嵌套，但是会为文件名附加时间戳，以免同名覆盖。
 *
 * 参数使用示例：
 * 1、
 * “node GetDenoDeclareFilesByMultiThread.mjs”全等于“node GetDenoDeclareFilesByMultiThread.mjs nest=false”，也是默认的。
 *
 * 需要更新的地方：
 * D:\Deno\App\Install\Bin\lib.deno.d.ts
 * D:\WebStorm\Config\system\plugins\deno\deno-service\node_modules\typescript-deno-plugin\lib\lib.deno.d.ts
 * D:\WebStorm\Config\system\javascript\deno\deno.d.ts
 *
 * D:\NodeJS\node_global\node_modules\typescript\lib
 *
 * WebStorm中deno插件的设置
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
  join,
  parse,
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
    nest: false,
  },
  threadQuantity = cpus().length - 1,
  inDir = 'in',
  outDir = 'out',
  workerThreadFilePath = './WorkerThread.mjs',
  dirPathArr = [],
  filePathArr = [];

const {
  nest: isNest,
} = ( argv => {
  if( argv.length <= 2 ){
    return defaultArgs;
  }
  else{
    argv.forEach( v => {
      if( v === 'nest=true' ){
        defaultArgs.nest = true;
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
    fileName = '';

  readdirSync( path ).forEach( v => {
    path001 = join( path, `/${ v }` );
    fsStats = statSync( path001 );
    fileName = parse( path001 ).name;

    if( fsStats.isDirectory() ){
      dirPathArr.push( path001 );

      if( isNest ){
        CreateDirectory( path001 );
      }
    }
    else if( fsStats.isFile() ){
      if( fileName.startsWith( 'lib.deno' ) && path001.endsWith( '.d.ts' ) ){
        filePathArr.push( path001 );
      }
    }
  } );
}

do{
  RetrieveForDir( dirPathArr.shift() );
}
while( dirPathArr.length > 0 );

const fileQuantity = filePathArr.length;

let toDoneNum = 0,
  startTimer = 0;

function CreateWorkerIns( filePath, workerInsIndex ){
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
typeof errorEventData--->${ typeof errorEventData }
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
    ++toDoneNum;

    if( filePathArr.length > 0 ){
      workerIns.postMessage( {
        filePath: filePathArr.shift(),
      } );
    }
    else if( toDoneNum === fileQuantity ){
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
typeof errorObject--->${ typeof errorObject }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );
  } );

  workerIns.on( 'online', () => {
    MyConsole.Cyan( `\n子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );
  } );

  workerIns.postMessage( {
    filePath,
  } );

  return workerIns;
}

if( fileQuantity > 0 ){
  startTimer = performance.now();

  let createWorkerThreadQuantity = threadQuantity,
    workerInsArr = [];

  if( fileQuantity <= threadQuantity ){
    createWorkerThreadQuantity = fileQuantity;
  }

  for(
    let i = 0;
    i < createWorkerThreadQuantity;
    ++i
  ){
    workerInsArr.push( CreateWorkerIns( filePathArr.shift(), i ) );
  }

  MyConsole.Cyan( `\n创建了${ createWorkerThreadQuantity }个Worker线程！\n` );
}
