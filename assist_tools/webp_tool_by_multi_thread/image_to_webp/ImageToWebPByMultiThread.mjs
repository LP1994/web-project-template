#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-quic --experimental-eventsource --experimental-vm-modules --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: web-project-template
 * FileDirPath: webp_tool_by_multi_thread/image_to_webp/ImageToWebPByMultiThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-01-01 00:00:00 星期六
 */

/**
 * 本工具用于将“.png”、“.jpe”、“.jpg”、“.jpeg”、“.tif”、“.tiff”、“原始Y'CbCr样本”等此些类型格式的图片转换为“.webp”格式的图片。
 *
 * 说明：
 * 1、
 * 将需要转换的图片放在“in”文件夹下，支持文件夹嵌套存放，转换后的图片会出现在“out”文件夹下，默认文件夹层级跟原先的一致。
 * 2、
 * 支持通过执行时传参来指定是不是按原来的文件夹层级来输出，如果不需要按原来的层级，则会把输出的图片全都直接放在“out”文件夹下，没文件夹嵌套，但是会为照片名附加时间戳，以免同名覆盖。
 * 3、
 * 双击执行“ImageToWebPByMultiThread.bat”即可开始转换。
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
 * “node ImageToWebPByMultiThread.mjs”全等于“node ImageToWebPByMultiThread.mjs nest=true”，也是默认的。
 *
 *
 *
 * 注意：
 * 在将大分辨率的jpg转换成webp时，转换后的webp会出现逆时针90度的旋转！
 * 解决方案是命令参数添加"-metadata all"。
 * 以上方案在iPhone X拍出的大分辨率的jpg无用！它包含ICC！哪怕是添加"-metadata icc"、"-alpha_filter best"也无用！
 * 安卓机上拍出的大分辨率的jpg，它不包含ICC！也没出现逆时针90度的旋转！
 * Windows 10 X64只能使用"-metadata icc"，使用"-metadata all"会报无效警告！
 *
 *
 *
 * 亲测已解决iOS的旋转BUG！！！
 *  “iPhoneX(兼容模式)顺时针180度”、“iPhoneX(兼容模式)逆时针180度”会出现顺时针旋转90度
 *  (处理方法：使用fast-exif.js读出Orientation属性为8，然后我们逆时针旋转90度就会使它变为原图的方向)
 *
 *  “iPhoneX(兼容模式)顺时针90度”、“iPhoneX(兼容模式)逆时针270度”会出现旋转180度
 *  (处理方法：使用fast-exif.js读出Orientation属性为3，然后我们旋转180度就会使它变为原图的方向)
 *
 *  “iPhoneX(兼容模式)顺时针270度”、“iPhoneX(兼容模式)逆时针90度”不会旋转
 *  (使用fast-exif.js读出Orientation属性为1，不需要转)
 *
 *  “iPhoneX(兼容模式)正竖”会出现逆时针旋转90度
 *  (处理方法：使用fast-exif.js读出Orientation属性为6，然后我们顺时针旋转90度就会使它变为原图的方向)
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
} from '../UniversalToolForNode.esm.mjs';

const defaultArgs = {
    nest: true,
  },
  threadQuantity = cpus().length - 1,
  inDir = 'in',
  outDir = 'out',
  workerThreadFilePath = './WorkerThread.mjs',
  dirPathArr = [],
  photoPathArr = [];

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
        'png',
        'jpe',
        'jpg',
        'jpeg',
        'tif',
        'tiff',
      ].includes( suffix001 ) ){
        if( Number( fsStats.size ) > 0 ){
          photoPathArr.push( path001 );
        }
        else{
          MyConsole.Yellow( `
${ path001 }
不支持文件大小小于等于0的文件。
` );
        }
      }
      else{
        MyConsole.Yellow( `
${ path001 }
目前只支持转换后缀为png、jpe、jpg、jpeg、tif、tiff的图片。
` );
      }
    }
  } );
}

do{
  RetrieveForDir( dirPathArr.shift() );
}
while( dirPathArr.length > 0 );

const photoQuantity = photoPathArr.length;

MyConsole.Cyan( `\n一共有${ photoQuantity }张图片需要转换。\n` );

let startTimer = 0,
  successTotal = 0;

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
    ++successTotal;

    MyConsole.Green( `
message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start

${ messageData.photoPath }
本张图片转换成功。
本张图片转换耗时${ messageData.takeUpTime.toFixed( 3 ) }秒。
已有${ successTotal }张转换完成。
还有${ photoQuantity - successTotal }张未进行转换。

message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );

    if( photoPathArr.length > 0 ){
      workerIns.postMessage( {
        photoPath: photoPathArr.shift(),
      } );
    }
    else if( successTotal === photoQuantity ){
      MyConsole.Green( `\n全部转换完成，总共耗时${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！\n` );

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

  MyConsole.Cyan( `\n创建了${ workerInsArr.length }个Worker线程！\n` );
}
