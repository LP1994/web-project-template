var fs = require( 'fs' );

var clone = require( 'lodash.clone' );

var merge = require( 'lodash.merge' );

var typedoc = require( 'typedoc' );

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

  this.defaultTypedocOptions = {};

  merge( this.defaultTypedocOptions, options );

  this.typeDocOptions = this.defaultTypedocOptions;
}

TypedocWebpackPlugin.prototype.apply = function ( compiler ){
  var self = this;

  compiler.hooks.emit.tapAsync( 'typedoc-webpack-plugin', async function ( compilation, callback ){
    var typedocOptions = clone( self.typeDocOptions );

    var typedocApp = await typedoc.Application.bootstrapWithPlugins( typedocOptions );

    typedocApp.options.addReader( new typedoc.ArgumentsReader( 0 ) );
    typedocApp.options.addReader( new typedoc.TypeDocReader() );
    typedocApp.options.addReader( new typedoc.PackageJsonReader() );
    typedocApp.options.addReader( new typedoc.TSConfigReader() );
    typedocApp.options.addReader( new typedoc.ArgumentsReader( 300 ).ignoreErrors() );

    var project = await typedocApp.convert();

    if( project ){
      typedocApp.validate( project );
    }

    if( project ){
      var outPath = typedocApp.options.getValue( 'out' );
      var jsonPath = typedocApp.options.getValue( 'json' );

      if( outPath ){
        console.log( '\nGenerating updated typedocs.\n' );

        await typedocApp.generateDocs( project, outPath );
      }

      if( jsonPath ){
        console.log( '\nGenerating typedoc json.\n' );

        await typedocApp.generateJson( project, jsonPath );
      }
    }

    callback();
  } );

  compiler.hooks.done.tap( 'typedoc-webpack-plugin', function ( stats ){
    console.log( '\nTypedoc finished generating.\n' );
  } );
};

module.exports = TypedocWebpackPlugin;
