/**
 * Project: web-project-template
 * FileDirPath: configures/my_diy_plugin/typedoc_webpack_plugin/TypedocWebpackPlugin.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2025-11-08 18:20:20 星期六
 */

/**
 * 基于插件“typedoc-webpack-plugin v1.1.4”的源码，自己DIY修改的，适用于“webpack v5”和“typedoc v0.28.14”的插件。<br />
 * 说明：<br />
 * 1、该插件用于为使用TypeScript编写的代码生成其对应的文档，底层是基于“typedoc”的。<br />
 * 2、目前只建议该插件用于生产、测试环境下为指定的用TypeScript编写的文件生成其文档。<br />
 * 3、不要用于开发环境，因为在开发环境下在生成文档后会出现不停的出现webpack重编译的情况，而且，开发环境下也不需要实时生成文档，毕竟生成文档的过程也是耗时的。<br />
 * 4、关于使用该插件时需要的配置文件及其相关的，可参见“src/tools/ts/universal_tools/type_doc”文件夹下的“doc”文件夹、“README.md”文件、"typedoc.json"文件、“tsconfig.typedoc.json”文件，参照它们为其他需要生成文档的文件配置文件。<br />
 * 5、当前基于的“typedoc”版本为“0.28.14”。<br />
 * 6、如果需要为多个文件生成文档，只要配置多个诸如“{options: string}”这样的配置即可，所以变量“typedocWebpackPluginConfig”才是一个数组。<br />
 *
 * PS：<br />
 * 1、插件“typedoc-webpack-plugin”由于很久不更新了，依赖的“typedoc”版本也已经发生了很大的变动，所以个人直接修改了其源码，使其能配合webpack使用。<br />
 *
 * 配置参数说明：<br />
 * 1、一般只要配置参数“options”即可，它表示“typedoc”要使用的“typedoc.json”配置文件路径，里面的写法可参见“src/tools/ts/universal_tools/type_doc”文件夹下的"typedoc.json"文件及其他相关的配置文件。<br />
 * 2、当然也支持其他参数，详细见：<br />
 * https://typedoc.org/schema.json <br />
 * https://typedoc.org/guides/options/ <br />
 * 3、“typedoc”的官方文档见：<br />
 * https://typedoc.org/guides/overview/ <br />
 * 4、参数“options”是描述配置文件的路径，所以要使用绝对路径（其他参数如果也是表示路径什么的，也要如此），如：options: resolve( __dirname, './src/tools/ts/universal_tools/type_doc/typedoc.json' )。<br />
 */

'use strict';

import {
  statSync,
} from 'node:fs';

import clone from 'lodash/clone';

import merge from 'lodash/merge';

import typedoc from 'typedoc';

const pluginName = 'typedoc-webpack-plugin';

/**
 * 基于插件“typedoc-webpack-plugin v1.1.4”的源码，自己DIY修改的，适用于“webpack v5”和“typedoc v0.28.14”的插件。<br />
 * 说明：<br />
 * 1、该插件用于为使用TypeScript编写的代码生成其对应的文档，底层是基于“typedoc”的。<br />
 * 2、目前只建议该插件用于生产、测试环境下为指定的用TypeScript编写的文件生成其文档。<br />
 * 3、不要用于开发环境，因为在开发环境下在生成文档后会出现不停的出现webpack重编译的情况，而且，开发环境下也不需要实时生成文档，毕竟生成文档的过程也是耗时的。<br />
 * 4、关于使用该插件时需要的配置文件及其相关的，可参见“src/tools/ts/universal_tools/type_doc”文件夹下的“doc”文件夹、“README.md”文件、"typedoc.json"文件、“tsconfig.typedoc.json”文件，参照它们为其他需要生成文档的文件配置文件。<br />
 * 5、当前基于的“typedoc”版本为“0.28.14”。<br />
 * 6、如果需要为多个文件生成文档，只要配置多个诸如“{options: string}”这样的配置即可，所以变量“typedocWebpackPluginConfig”才是一个数组。<br />
 *
 * PS：<br />
 * 1、插件“typedoc-webpack-plugin”由于很久不更新了，依赖的“typedoc”版本也已经发生了很大的变动，所以个人直接修改了其源码，使其能配合webpack使用。<br />
 *
 * 配置参数说明：<br />
 * 1、一般只要配置参数“options”即可，它表示“typedoc”要使用的“typedoc.json”配置文件路径，里面的写法可参见“src/tools/ts/universal_tools/type_doc”文件夹下的"typedoc.json"文件及其他相关的配置文件。<br />
 * 2、当然也支持其他参数，详细见：<br />
 * https://typedoc.org/schema.json <br />
 * https://typedoc.org/guides/options/ <br />
 * 3、“typedoc”的官方文档见：<br />
 * https://typedoc.org/guides/overview/ <br />
 * 4、参数“options”是描述配置文件的路径，所以要使用绝对路径（其他参数如果也是表示路径什么的，也要如此），如：options: resolve( __dirname, './src/tools/ts/universal_tools/type_doc/typedoc.json' )。<br />
 *
 * @param options {{options: string}}
 *
 * @constructor
 */
function TypedocWebpackPlugin( options ){
  if( !( options?.options ) || ( options.options.trim().length === 0 ) || !statSync( options.options.trim() ).isFile() ){
    console.error( `\n\n\noptions不是一个有效的值--->Start` );
    console.error( options );
    console.error( `options不是一个有效的值--->End` );

    throw new Error( `
“options.options”的值类型必须是一个字符串，表示一个文件路径，值一般形如：
resolve( __dirname, './src/tools/ts/universal_tools/type_doc/typedoc.json' )
\n\n\n` );
  }

  this.startTime = Date.now();

  this.prevTimestamps = {};

  this.defaultTypedocOptions = {};

  merge( this.defaultTypedocOptions, options );

  this.typeDocOptions = this.defaultTypedocOptions;
}

TypedocWebpackPlugin.prototype.apply = function ( compiler ){
  const self = this;

  compiler.hooks.emit.tapAsync( pluginName, async function ( compilation, callback ){
    const changedFiles = Array.from(
      new Map(
        Array.from( compilation.fileSystemInfo._fileTimestamps.map.entries() )
          .filter( function ( [ keyName, keyValue ] ){
            return ( this.prevTimestamps?.get?.( keyName )?.safeTime || this.startTime ) < ( keyValue?.safeTime || Infinity );
          }.bind( this ) )
      ).keys()
    );

    let tsFileEdited = false;

    for(
      let i = 0;
      i < changedFiles.length;
      i++
    ){
      if( changedFiles[ i ].endsWith( '.ts' ) || changedFiles[ i ].endsWith( '.mts' ) || changedFiles[ i ].endsWith( '.cts' ) ){
        tsFileEdited = true;

        break;
      }
    }

    if( tsFileEdited || changedFiles.length === 0 ){
      const typedocApp = await typedoc.Application.bootstrapWithPlugins( clone( self.typeDocOptions ) );

      typedocApp.options.addReader( new typedoc.ArgumentsReader( 0 ) );
      typedocApp.options.addReader( new typedoc.TypeDocReader() );
      typedocApp.options.addReader( new typedoc.PackageJsonReader() );
      typedocApp.options.addReader( new typedoc.TSConfigReader() );
      typedocApp.options.addReader( new typedoc.ArgumentsReader( 300 ).ignoreErrors() );

      const project = await typedocApp.convert();

      if( project ){
        typedocApp.validate( project );
      }

      if( project ){
        const outPath = typedocApp.options.getValue( 'out' ),
          jsonPath = typedocApp.options.getValue( 'json' );

        if( outPath ){
          console.log( '\nGenerating updated typedocs.\n' );

          await typedocApp.generateDocs( project, outPath );
        }

        if( jsonPath ){
          console.log( '\nGenerating typedoc json.\n' );

          await typedocApp.generateJson( project, jsonPath );
        }
      }
    }
    else{
      console.warn( '\nNo ts filed changed. Not recompling typedocs.\n' );
    }

    this.prevTimestamps = compilation.fileSystemInfo._fileTimestamps.map;

    callback();
  } );

  compiler.hooks.done.tap( pluginName, function ( stats ){
    console.log( '\nTypedoc finished generating.\n' );
  } );
};

export {
  TypedocWebpackPlugin,
};

export default TypedocWebpackPlugin;
