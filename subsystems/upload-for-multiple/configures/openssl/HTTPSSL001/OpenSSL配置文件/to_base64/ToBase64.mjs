#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-shadow-realm --experimental-vm-modules --experimental-wasm-modules --experimental-websocket --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: upload-for-multiple
 * FileDirPath: to_base64/ToBase64.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 用于将“HTTPSSL001_Root_CA.p12”的内容转换为base64编码的内容。
 * HTTPSSL001_Root_CA.p12--->HTTPSSL001_Root_CA.p12.base64
 *
 * 注意：
 * 1、使用时记得修改下面代码中的“输入文件名”和“输出文件名”。
 * 2、记得将需要转换的文件放到“to_base64”文件夹下，生成的新文件也会出现在“to_base64”文件夹下。
 */

'use strict';

import {
  readFileSync,
  writeFileSync,
} from 'node:fs';

import {
  dirname,
  join,
} from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

/**
 * 表示项目文件夹根目录，不是磁盘根目录。<br />
 *
 * @type {string}
 */
const __dirname = Get__dirname( import.meta.url );

writeFileSync(
  join( __dirname, './HTTPSSL001_Root_CA.p12.base64' ),
  readFileSync( join( __dirname, './HTTPSSL001_Root_CA.p12' ) ).toString( 'base64' )
);
