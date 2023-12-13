#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-network-imports --experimental-shadow-realm --experimental-vm-modules --experimental-wasm-modules --experimental-websocket --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: web-project-template
 * FileDirPath: notes/关于Node中事件循环机制在cjs和mjs的后缀文件中输出不一致的说明.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/*
 之所以会不一样，是因为.mjs走的是跟浏览器一致的“事件循环机制”，而.js、.cjs走的是Node原有的“事件循环机制”，它跟浏览器的“事件循环机制”有些差异。
Node从10.X开始，就正式支持ES6的ESM模块规范（Node 9.X是通过启用实验性选项进行支持的），并且开始在ESM模块规范中使用跟浏览器一样的事件循环机制，
但是为了兼容先前版本中Node自己原有的事件循环机制，于是就通过文件后缀名进行区分，以.mjs为文件后缀的就是跟浏览器一样的事件循环机制，而以.cjs、.js为文件后缀的就是遵循原有的Node自己的事件循环机制。

 输出：
 一、当以.js、.cjs为文件后缀时，Node 9.X、Node 10.X、Node 11.X、Node 12.X、Node 13.X、Node 14.X、Node 15.X、Node 16.X、Node 17.X、Node 18.X执行输出如下：
 Start1
 Start2
 Start3
 Start4
 Fun4
 Fun5
 Fun6
 Promise1
 Promise2
 Fun2
 Fun3
 Fun1

 二、当以.mjs为文件后缀时，Node 9.X、Node 10.X、Node 11.X、Node 12.X、Node 13.X、Node 14.X、Node 15.X、Node 16.X、Node 17.X、Node 18.X执行输出如下：
 Start1
 Start2
 Start3
 Start4
 Promise1
 Promise2
 Fun4
 Fun5
 Fun6
 Fun2
 Fun3
 Fun1

 说明：
 一、当以.mjs为文件后缀时的“事件循环机制”如下：
 1、最先执行同步代码
 --->
 2、然后循环清空“微任务”队列
 --->
 3、再然后循环清空“process.nextTick”队列
 --->
 4、最后循环清空“宏任务”队列
 PS：只比浏览器的事件循环机制多了一个“process.nextTick”队列，且在“微任务”队列之后，“宏任务”队列之前。

 二、当以.js、.cjs为文件后缀时的“事件循环机制”如下：
 1、最先执行同步代码
 --->
 2、接着循环清空由第1步产生的“process.nextTick”队列
 --->
 3、然后循环清空“微任务”队列
 --->
 4、再然后循环清空“process.nextTick”队列
 --->
 5、最后循环清空“宏任务”队列
 */

'use strict';

function Fun1(){
  console.log( 'Fun1' );
}

function Fun2(){
  console.log( 'Fun2' );
}

function Fun3(){
  console.log( 'Fun3' );
}

function Fun4(){
  console.log( 'Fun4' );
}

function Fun5(){
  console.log( 'Fun5' );
}

function Fun6(){
  console.log( 'Fun6' );
}

function Start(){
  console.log( 'Start1' );

  setImmediate( Fun1 );

  new Promise( ( resolve, reject ) => {
    resolve( 'Promise1' );
  } ).then( ( resolve ) => {
    console.log( resolve );

    process.nextTick( Fun2 );
  } );

  new Promise( ( resolve, reject ) => {
    resolve( 'Promise2' );
  } ).then( ( resolve ) => {
    console.log( resolve );

    process.nextTick( Fun3 );
  } );

  process.nextTick( Fun4 );

  console.log( 'Start2' );

  process.nextTick( Fun5 );

  console.log( 'Start3' );

  process.nextTick( Fun6 );

  console.log( 'Start4' );
}

Start();
