/*
 *  Typedoc Webpack Plugin
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

var typedoc = require( 'typedoc' );

var clone = require( 'lodash.clone' );

var merge = require( 'lodash.merge' );

var fs = require( 'fs' );

function TypedocWebpackPlugin( options ){
  if( !( options?.options ) || ( options.options.trim().length === 0 ) || !fs.statSync( options.options.trim() ).isFile() ){
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

/*
 *	@param compiler Webpack compiler object. @see <a href="https://webpack.github.io/docs/plugins.html#the-compiler-instance">label</a>
 * 	@return void
 */
TypedocWebpackPlugin.prototype.apply = function ( compiler ){
  var self = this;

  compiler.hooks.emit.tapAsync( 'typedoc-webpack-plugin', async function ( compilation, callback ){
    var arr002 = Array.from( compilation.fileSystemInfo._fileTimestamps.map.entries() )
      .filter( function ( [ keyName, keyValue ] ){
        return ( this.prevTimestamps?.get?.( keyName )?.safeTime || this.startTime ) < ( keyValue?.safeTime || Infinity );
      }.bind( this ) );

    var changedFiles = Array.from( new Map( arr002 ).keys() );

    // determine if any typescript files have been changed
    var tsFileEdited = false;

    for(
      var i = 0;
      i < changedFiles.length;
      i++
    ){
      if( changedFiles[ i ].endsWith( '.ts' ) || changedFiles[ i ].endsWith( '.mts' ) || changedFiles[ i ].endsWith( '.cts' ) ){
        tsFileEdited = true;

        break;
      }
    }

    // if typescript files have been changed or we cannot determine what files have been changed run typedoc build
    if( tsFileEdited || changedFiles.length === 0 ){
      // If an absolute path set in self.typeDocOptions.out or self.typeDocOptions.json, use that
      // else if the output path is specified in webpack config and out is relative, output typedocs relative to that path
      var typedocOptions = clone( self.typeDocOptions );

      // 使用给定的选项对象初始化 TypeDoc。
      var typedocApp = await typedoc.Application.bootstrapWithPlugins( typedocOptions );

      typedocApp.options.addReader( new typedoc.ArgumentsReader( 0 ) );
      typedocApp.options.addReader( new typedoc.TypeDocReader() );
      typedocApp.options.addReader( new typedoc.PackageJsonReader() );
      typedocApp.options.addReader( new typedoc.TSConfigReader() );
      typedocApp.options.addReader( new typedoc.ArgumentsReader( 300 ).ignoreErrors() );

      // 为给定的文件集运行转换器并返回生成的反射。
      // 成功时的 ProjectReflection 实例，否则未定义。
      var project = await typedocApp.convert();

      if( project ){
        typedocApp.validate( project );
      }

      if( project ){
        var outPath = typedocApp.options.getValue( 'out' );
        var jsonPath = typedocApp.options.getValue( 'json' );

        if( outPath ){
          console.log( '\nGenerating updated typedocs.\n' );

          // generateDocs(project: Models.ProjectReflection, out: string): Promise<void>
          await typedocApp.generateDocs( project, outPath );
        }

        if( jsonPath ){
          console.log( '\nGenerating typedoc json.\n' );

          // generateJson(project: Models.ProjectReflection, out: string): Promise<void>
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

  compiler.hooks.done.tap( 'typedoc-webpack-plugin', function ( stats ){
    console.log( '\nTypedoc finished generating.\n' );
  } );
};

module.exports = TypedocWebpackPlugin;
