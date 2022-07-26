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
  env,
} from 'node:process';

const isProduction = ( NODE_ENV => {
  if( NODE_ENV === 'development' ){
    return false;
  }
  else if( NODE_ENV === 'production' ){
    return true;
  }
  else{
    console.log( `process.env.NODE_ENV--->${ NODE_ENV }` );

    throw new Error( 'isProduction该值依赖CLI参数中的“--node-env”参数，--node-env development（用于开发）、--node-env production（用于生产）。' );
  }
} )( env.NODE_ENV );

/**
 * 开发模式下会引入HMR相关的两个JS文件，生产模式不会引入它们。<br />
 * 1、webpack/hot/dev-server.js。<br />
 * 2、webpack-dev-server/client/index.js。<br />
 *
 * @param entryImport string|string[]
 *
 * @param isHMR boolean
 *
 * @returns {string|string[]}
 */
function HMR_Webpack5( entryImport, isHMR = true ){
  if( isProduction || ( !isProduction && !isHMR ) ){
    return entryImport;
  }
  else if( isHMR ){
    return [
      'webpack/hot/dev-server.js',
      'webpack-dev-server/client/index.js',
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
    import: HMR_Webpack5( [
      './src/pages/hello_world/HelloWorld.js',
    ], true ),
  },
  Home: {
    import: HMR_Webpack5( [
      './src/pages/home/Home.js',
    ], true ),
  },
};

export {
  entryConfig,
};

export default entryConfig;
