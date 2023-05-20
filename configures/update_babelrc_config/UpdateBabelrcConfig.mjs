/**
 * Project: web-project-template
 * FileDirPath: configures/update_babelrc_config/UpdateBabelrcConfig.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * UpdateBabelrcConfig.mjs用于更新文件夹“configures/babelrc”下的“.babelrc.bases.json”文件中：
 * “@babel/preset-env”的corejs.version、“@babel/plugin-transform-runtime”的corejs.version值。
 */

'use strict';

import {
  writeFileSync,
} from 'node:fs';

import {
  dirname,
  join,
} from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

import package_json from '../../package.json' assert { type: 'json', };

import BasesBabelrcConfig from '../babelrc/.babelrc.bases.json' assert { type: 'json', };

function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

const __dirname = Get__dirname( import.meta.url );

[
  BasesBabelrcConfig,
].forEach( item => {
  new Map( item[ 'plugins' ] ).get( '@babel/plugin-transform-runtime' ).version = ( () => {
    const runtimeCoreJS3VersionStr = package_json.devDependencies[ '@babel/runtime-corejs3' ];

    if( runtimeCoreJS3VersionStr ){
      const str1 = String( runtimeCoreJS3VersionStr ).trim();

      if( /^[0-9]/i.test( str1 ) ){
        return str1;
      }
      else{
        return str1.slice( 1 );
      }
    }
    else{
      throw new Error( '你需要安装该npm包：@babel/runtime-corejs3，请在项目根目录下执行该命令：npm --force install -D @babel/runtime-corejs3' );
    }
  } )() || '7.21.5';

  new Map( item[ 'presets' ] ).get( '@babel/preset-env' ).corejs.version = ( () => {
    const coreJSVersionStr = package_json.devDependencies[ 'core-js' ];

    if( coreJSVersionStr ){
      const str1 = String( coreJSVersionStr ).trim();

      if( /^[0-9]/i.test( str1 ) ){
        return str1;
      }
      else{
        return str1.slice( 1 );
      }
    }
    else{
      throw new Error( '你需要安装该npm包：core-js，请在项目根目录下执行该命令：npm --force install -D core-js' );
    }
  } )() || '3.30.2';
} );

writeFileSync( join( __dirname, '../babelrc/.babelrc.bases.json' ), JSON.stringify( BasesBabelrcConfig ) );
