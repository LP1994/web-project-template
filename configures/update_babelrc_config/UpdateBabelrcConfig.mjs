/**
 * Project: web-project-template
 * FileDirPath: configures/update_babelrc_config/UpdateBabelrcConfig.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * UpdateBabelrcConfig.mjs用于更新文件夹“configures/babelrc”下的这4个文件：
 * .babelrc.dev.json、.babelrc.json、.babelrc.production.json、.babelrc.test.json
 * 中的“@babel/preset-env”的corejs.version、“@babel/plugin-transform-runtime”的corejs.version值。
 *
 * 默认（.babelrc.json，同生产）、开发（.babelrc.dev.json）、测试（.babelrc.test.json）、生产（.babelrc.production.json）。
 *
 * 测试（.babelrc.test.json）：removeConsole、removeDebugger皆为false。
 * 生产（.babelrc.production.json）：removeConsole、removeDebugger皆为true。
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

import babelrcDevConfig from '../babelrc/.babelrc.dev.json' assert { type: 'json', };
import babelrcConfig from '../babelrc/.babelrc.json' assert { type: 'json', };
import babelrcProductionConfig from '../babelrc/.babelrc.production.json' assert { type: 'json', };
import babelrcTestConfig from '../babelrc/.babelrc.test.json' assert { type: 'json', };

function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

const __dirname = Get__dirname( import.meta.url );

[
  babelrcDevConfig,
  babelrcConfig,
  babelrcProductionConfig,
  babelrcTestConfig,
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
  } )() || '7.20.13';

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
  } )() || '3.28.0';
} );

writeFileSync( join( __dirname, '../babelrc/.babelrc.dev.json' ), JSON.stringify( babelrcDevConfig ) );
writeFileSync( join( __dirname, '../babelrc/.babelrc.json' ), JSON.stringify( babelrcConfig ) );
writeFileSync( join( __dirname, '../babelrc/.babelrc.production.json' ), JSON.stringify( babelrcProductionConfig ) );
writeFileSync( join( __dirname, '../babelrc/.babelrc.test.json' ), JSON.stringify( babelrcTestConfig ) );
