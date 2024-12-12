#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-shadow-realm --experimental-vm-modules --experimental-wasm-modules --experimental-websocket --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: AutoUpdateLocalNPMPackages
 * FileDirPath: AutoUpdateLocalNPMPackages.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 自动拉取本地项目中最新的npm包版本信息并自动更新安装新版本的npm包到本地项目。
 * 完整过程如下：
 * 1、ncu -u --color --timeout 1800000
 * 2、npm --force install -D XXX XXX XXX ...
 */

'use strict';

import {
  execSync,
} from 'node:child_process';

/**
 * 将命令行中输出的需要更新的npm包列表转换成可以直接用于安装命令的字符串，如果是没有要更新的，会返回空字符串。
 *
 * @param {string} str 命令行中输出的需要更新的npm包列表，默认值是空字符串，必须。
 *
 * @returns {string} 返回可以直接用于安装命令的字符串，如果是没有要更新的，会返回空字符串。
 */
function Handle001( str = '' ){
  return str.trim().split( '\n' ).map( item => item.trim() ).filter( item => item.length !== 0 ).map( item => item.split( '^' )[ 0 ].trim() ).join( ' ' ).trim();
}

console.log( `开始执行自动拉取本地项目中已经安装的各个npm包的最新版本号信息的命令！
该过程不可见，请不要关闭、强行终止本命令窗口！` );

let num001 = 0,
  config = {
    // 进程允许运行的最长时间（毫秒），默认值：未定义。值类型：number。
    timeout: 1 * 60 * 60 * 1000,
    // stdout 或 stderr 上允许的最大数据量（以字节为单位）。如果超过，子进程将被终止，所有输出将被截断。请参阅 maxBuffer 和 Unicode 的注意事项。默认值：1024 * 1024。
    maxBuffer: 10 * 1024 * 1024 * 1024,
    // 用于所有 stdio 输入和输出的编码。默认值："buffer"。
    encoding: 'buffer',
    windowsHide: false,
  };

const timer001 = setInterval( () => {
  ++num001;

  console.log( `拉取已经耗时：${ num001 }秒。` );
}, 1000 );

const stdoutFromCommand001 = execSync( `ncu -u --color --timeout 1800000`, config ).toString( 'utf8', );

clearInterval( timer001 );

console.log( `拉取信息完成，结果如下：
------------------------------------------------------------
${ stdoutFromCommand001 }
------------------------------------------------------------
` );

if( stdoutFromCommand001.includes( `All dependencies match the latest package versions` ) ){
  console.log( `
没有要更新的npm包！
` );
}
else{
  let num002 = 10,
    num003 = 0,
    str001 = Handle001( stdoutFromCommand001.trim().split( '\n' ).map( item => item.trim() ).filter( item => item.length !== 0 && item.includes( '→' ) ).join( '\n' ) ).trim();

  if( str001.length !== 0 ){
    console.log( `
需要更新的npm包有：
${ str001 }

10秒后开始更新！

如果不想自动更新，请在倒计时10秒结束前，强行终止本命令窗口！
` );

    const timer002 = setInterval( () => {
      console.log( `
自动更新倒计时：${ num002 }秒。
` );

      --num002;
    }, 1000 );

    setTimeout( () => {
      clearInterval( timer002 );

      console.log( `
开始自动更新！
该过程不可见，请不要关闭、强行终止本命令窗口！
` );

      const timer003 = setInterval( () => {
        ++num003;

        console.log( `更新已经耗时：${ num003 }秒。` );
      }, 1000 );

      const stdoutFromCommand002 = execSync( `npm --force install -D ${ str001 }`, config ).toString( 'utf8', );

      clearInterval( timer003 );

      console.log( `更新结果如下：
------------------------------------------------------------
${ stdoutFromCommand002 }
------------------------------------------------------------
` );
    }, 11000 );
  }
}
