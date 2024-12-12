#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-shadow-realm --experimental-vm-modules --experimental-wasm-modules --experimental-websocket --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: upload-for-multiple
 * FileDirPath: configures/update_tsconfig_lib/UpdateTSConfigLib.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 该工具用于从node_modules文件夹中获取typescript包里面lib文件夹下的各个.d.ts文件来更新tsconfig配置中的compilerOptions选项的lib选项值。
 */

'use strict';

import {
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';

import {
  dirname,
  join,
} from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

import tsConfig from '../../tsconfig.json' with { type: 'json', };

function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

const __dirname = Get__dirname( import.meta.url ),
  libs = readdirSync( join( __dirname, '../../node_modules/typescript/lib' ) )
    .filter( c => !statSync( join( __dirname, `../../node_modules/typescript/lib/${ c }` ) ).isDirectory() )
    .filter( c => c.startsWith( 'lib.' ) && c.endsWith( '.d.ts' ) && c !== 'lib.d.ts' && !c.includes( '.full' ) )
    .map( c => c.slice( 4, -5 ).toLowerCase() );

tsConfig[ 'compilerOptions' ][ 'lib' ] = Array.from( new Set( libs ) ).sort();

writeFileSync( join( __dirname, '../../tsconfig.json' ), JSON.stringify( tsConfig, null, 4 ) );
