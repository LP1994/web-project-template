/*
 Project: web-project-template
 FileDirPath: configures/EntryConfig.esm.mjs
 Author: 12278
 Email: 1227839175@qq.com
 IDE: WebStorm
 CreateDate: 2022-07-23 09:34:09 星期六
 */

'use strict';

import {
  argv,
} from 'node:process';

/**
 * isProduction的值为true时表示生成环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值。<br />
 * 1、有效的“--mode”参数设置是：--mode development（用于开发）、--mode production（用于生产）。<br />
 */
const isProduction = ( argv => {
  const num1 = argv.findIndex( c => c === '--mode' );

  if( num1 !== -1 ){
    const str1 = argv.at( num1 + 1 );

    if( String( str1 ) === 'development' ){
      return false;
    }
    else if( String( str1 ) === 'production' ){
      return true;
    }
    else{
      console.dir( argv );

      throw new Error( 'CLI参数中紧跟在“--mode”之后的，只能是development（用于开发）、production（用于生产）。有效的“--mode”参数设置是：--mode development、--mode production。' );
    }
  }
  else{
    console.dir( argv );

    throw new Error( 'CLI参数中没找到“--mode”参数。' );
  }
} )( argv );

/**
 * 注意！这个函数算是一个修复工具，用来修复启用experiments.buildHttp时，出现开发环境下HRM不生效的问题。<br />
 * 1、如果启用了experiments.buildHttp，才能把isHMR选项的默认值设置为true，以及调用该函数时，第2个参数传入true，否则还是要设置成false（默认值和调用该函数时的第2个参数都要设置成false）。
 * 2、开发模式下会引入HMR相关的1个JS文件，生产模式不会引入：<br />
 * webpack-dev-server/client/index.js?logging=info&progress=true&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=Infinity&hot=true&live-reload=true
 *
 * @param entryImport string|string[]
 *
 * @param isHMR boolean 默认值为true。
 *
 * @returns {string|string[]}
 */
function Fix_HMR_Experiments_BuildHttp_Webpack5( entryImport, isHMR = true ){
  if( isProduction || ( !isProduction && !isHMR ) ){
    return entryImport;
  }
  else{
    return [
      'webpack-dev-server/client/index.js?logging=info&progress=true&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=Infinity&hot=true&live-reload=true',
    ].concat( entryImport );
  }
}

/**
 * 开始应用程序捆绑过程的一个或多个点。如果传递了一个数组，则将处理所有项目，强烈要求以Object的配置来配置入口点！<br />
 * 1、动态加载的模块不是入口点。<br />
 * 2、需要考虑的规则：每个HTML页面有一个入口点。SPA：一个入口点，MPA：多个入口点。<br />
 * 3、允许为每个入口点设置不同类型的文件，如：entry: { a: [ './a.js', './a.css', ], }，这种设置，会在输出目录下生成对应的JS、CSS文件。<br />
 * 4、确保runtime选项不能指向现有的入口点名称。<br />
 * 5、runtime选项和dependOn选项不应在单个条目上一起使用。<br />
 * 6、不要为vendor或其他不是执行起点的东西创建条目。optimization.splitChunks选项负责分离vendor和应用程序模块并创建一个单独的文件。<br />
 * 7、可扩展的选项：<br />
 * {<br />
 * asyncChunks：boolean，启用或禁用创建按需加载的异步块。<br />
 * 
 * baseUri：string，设置入口的基本URL。<br />
 * 
 * chunkLoading：同output.chunkLoading。<br />
 * 
 * dependOn：string、[ string ]，当前入口点所依赖的入口点。加载此入口点时，必须加载它们。<br />
 * 
 * filename：同output.filename。<br />
 * 
 * import：string、[ string ]，启动时加载的模块。<br />
 * 
 * layer：string，指定放置此入口点模块的层。<br />
 * 
 * library：同output.library。<br />
 * 
 * publicPath：同output.publicPath。<br />
 * 
 * runtime：false、string，运行时块的名称。设置后，将创建一个新的运行时块。它可以设置为false以避免从webpack 5.43.0开始出现新的运行时块。<br />
 * 
 * wasmLoading：同output.wasmLoading。<br />
 * }<br />
 */
const entryConfig = {
  HelloWorld: {
    import: Fix_HMR_Experiments_BuildHttp_Webpack5( [
      './src/pages/hello_world/HelloWorld.css',
      './src/pages/hello_world/HelloWorld.js',
    ] ),
  },
  Home: {
    import: Fix_HMR_Experiments_BuildHttp_Webpack5( [
      './src/pages/home/Home.css',
      './src/pages/home/Home.js',
    ] ),
  },
};

export {
  entryConfig,
};

export default entryConfig;
