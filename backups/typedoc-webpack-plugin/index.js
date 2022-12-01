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

var path = require( 'path' );

function TypedocWebpackPlugin( options ){
  this.startTime = Date.now();

  this.prevTimestamps = {};

  this.defaultTypedocOptions = {
    'name': 'TypeScript的API文档',
    'sort': [
      'source-order'
    ],
    'validation': {
      'notExported': true,
      'invalidLink': true,
      'notDocumented': true
    },
    'visibilityFilters': {
      'protected': true,
      'private': true,
      'inherited': true,
      'external': true,
      '@alpha': true,
      '@beta': true,
      '@experimental': true,
      '@deprecated': true,
      '@enum': true,
      '@hidden': true,
      '@internal': true
    },
    'categorizeByGroup': true,
    'cleanOutputDir': true,
    'commentStyle': 'jsdoc',
    'darkHighlightTheme': 'dark-plus',
    'defaultCategory': 'Other',
    'disableSources': false,
    'emit': 'docs',
    'entryPointStrategy': 'resolve',
    'excludeExternals': false,
    'excludeInternal': false,
    'excludeNotDocumented': false,
    'excludePrivate': false,
    'excludeProtected': false,
    'hideGenerator': false,
    'htmlLang': 'zh-CN',
    'includeVersion': true,
    'lightHighlightTheme': 'light-plus',
    'logLevel': 1,
    'preserveWatchOutput': true,
    'pretty': true,
    'readme': 'none',
    'showConfig': false,
    'skipErrorChecking': false,
    'theme': 'default',
    'treatWarningsAsErrors': false,
    'watch': false,
    'externalPattern': [
      '**/node_modules/**'
    ],
    'exclude': [
      '**/node_modules/**'
    ]
  };

  // merge user options into default options and assign
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

      var typedocApp = new typedoc.Application();

      typedocApp.options.addReader( new typedoc.TypeDocReader() );
      typedocApp.options.addReader( new typedoc.TSConfigReader() );

      // 使用给定的选项对象初始化 TypeDoc。
      typedocApp.bootstrap( typedocOptions );

      // 为给定的文件集运行转换器并返回生成的反射。
      // 成功时的 ProjectReflection 实例，否则未定义。
      var project = typedocApp.convert();

      if( project ){
        typedocApp.validate( project );
      }

      if( project ){
        var outPath = typedocApp.options.getValue( 'out' );
        var jsonPath = typedocApp.options.getValue( 'json' );

        if( outPath ){
          console.log( 'Generating updated typedocs.' );

          // generateDocs(project: ProjectReflection, out: string): Promise<void>
          await typedocApp.generateDocs( project, outPath );
        }

        if( jsonPath ){
          console.log( 'Generating typedoc json.' );

          // generateJson(project: ProjectReflection, out: string): Promise<void>
          typedocApp.generateJson( project, jsonPath );
        }
      }
    }
    else{
      console.warn( 'No ts filed changed. Not recompling typedocs.' );
    }

    this.prevTimestamps = compilation.fileSystemInfo._fileTimestamps.map;

    callback();
  } );

  compiler.hooks.done.tap( 'typedoc-webpack-plugin', function ( stats ){
    console.log( 'Typedoc finished generating.' );
  } );
};

module.exports = TypedocWebpackPlugin;
