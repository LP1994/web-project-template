/**
 * Project: web-project-template
 * FileDirPath: file_sri_by_multi_thread/FileSRIByMultiThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 本工具是用于计算文件的SRI值。
 *
 * 说明：
 * 1、
 * 将需要计算的文件放在“in”文件夹下，支持文件夹嵌套存放，计算后的结果会汇总在文件FileSRI.json中，其会出现在“out”文件夹下。
 * 2、
 * 双击执行“FileSRIByMultiThread.bat”即可开始计算。
 *
 * PS：
 * 1、
 * 如果能看得懂代码，也可以在代码中切换参数，根据自己的需要改改参数什么的。
 */

'use strict';

import {
  readdirSync,
  statSync,
} from 'node:fs';

import {
  writeFile,
} from 'node:fs/promises';

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

const threadQuantity = cpus().length - 1,
  inDir = 'in',
  outFile = './out/FileSRI.json',
  workerThreadFilePath = './WorkerThread.mjs',
  dirPathArr = [],
  filePathArr = [];

function PathJoinForStart( path ){
  return join( Get__dirname( import.meta.url ), path );
}

const initPath = PathJoinForStart( inDir ),
  savePath = join( Get__dirname( import.meta.url ), outFile );

dirPathArr.push( initPath );

function RetrieveForDir( path ){
  let path001 = '',
    fsStats = null,
    suffix001 = '';

  readdirSync( path ).forEach( v => {
    path001 = join( path, `/${ v }` );
    fsStats = statSync( path001 );

    if( fsStats.isDirectory() ){
      dirPathArr.push( path001 );
    }
    else if( fsStats.isFile() ){
      suffix001 = extname( path001 ).slice( 1 ).toLocaleLowerCase().trim();

      if( suffix001 !== 'gitignore' ){
        if( Number( fsStats.size ) > 0 ){
          filePathArr.push( path001 );
        }
        else{
          MyConsole.Yellow( `\n${ path001 }
不支持文件大小小于等于0的文件。\n` );
        }
      }
    }
  } );
}

do{
  RetrieveForDir( dirPathArr.shift() );
}
while( dirPathArr.length > 0 );

const fileQuantity = filePathArr.length;

let startTimer = 0,
  successTotal = 0,
  saveResult = {};

function CreateWorkerIns( filePath, workerInsIndex ){
  const workerIns = new Worker( workerThreadFilePath, {
    workerData: {
      workerInsID: `workerInsID${ workerInsIndex }`,
    },
  } );

  workerIns.on( 'error', errorEventData => {
    MyConsole.Red( `\nerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
Object.prototype.toString.call( errorEventData )--->${ Object.prototype.toString.call( errorEventData ) }
${ errorEventData }
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n` );
  } );

  workerIns.on( 'exit', exitCode => {
    MyConsole.Yellow( `\nexit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
exitCode:${ exitCode }.
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n` );

    if( Number( exitCode ) !== 0 ){
      MyConsole.Yellow( `\nWorker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.` );
    }
  } );

  workerIns.on( 'message', async messageData => {
    ++successTotal;

    saveResult[ messageData.filePath ] = messageData.result;

    MyConsole.Blue( `\n\nmessage event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start` );

    MyConsole.Green( `\n${ messageData.filePath }
本文件的SRI值计算完成。
本文件计算耗时${ messageData.takeUpTime.toFixed( 3 ) }秒。
已有${ successTotal }个文件完成计算。
还有${ fileQuantity - successTotal }个文件未计算。\n` );

    MyConsole.Blue( `message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n\n` );

    if( filePathArr.length > 0 ){
      workerIns.postMessage( {
        filePath: filePathArr.shift(),
      } );
    }
    else if( successTotal === fileQuantity ){
      await writeFile( savePath, JSON.stringify( saveResult ), {
        flag: 'w+',
      } );

      MyConsole.Green( `\n全部计算完成，总共耗时${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！\n` );

      // If the worker was terminated, the exitCode parameter is 1.
      workerIns.terminate().then(
        exitCode => {
          MyConsole.Yellow( `\n停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );

          exit( 0 );
        },
        reject => {
          throw new Error( reject );
        }
      );
    }
  } );

  workerIns.on( 'messageerror', errorObject => {
    MyConsole.Red( `\n反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n` );
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

  MyConsole.Cyan( `\n创建了${ workerInsArr.length }个Worker线程！\n` );
}
