/**
 * Project: upload-for-multiple
 * FileDirPath: configures/EntryConfig.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * webpack顶级配置项“entry”的配置。
 */

'use strict';

import {
  argv,
} from 'node:process';

import {
  MyConsole,
} from './UniversalToolForNode.esm.mjs';

/**
 * isProduction的值为true时表示生产环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值。<br />
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
      MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

      throw new Error( 'CLI参数中紧跟在“--mode”之后的，只能是development（用于开发）、production（用于生产）。有效的“--mode”参数设置是：--mode development、--mode production。' );
    }
  }
  else{
    MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

    throw new Error( 'CLI参数中没找到“--mode”参数。' );
  }
} )( argv );

/**
 * 注意！这个函数算是一个修复工具，用来修复启用experiments.buildHttp时，出现开发环境下HRM不生效的问题。但是官方在“webpack-dev-server”的“4.12.0 (2023-03-14)”版本中修复了这个BUG。<br />
 * 1、如果启用了experiments.buildHttp，才能把isHMR选项的默认值设置为true，以及调用该函数时，第2个参数传入true，否则还是要设置成false（默认值和调用该函数时的第2个参数都要设置成false）。<br />
 * 2、开发模式下会引入HMR相关的1个JS文件，生产模式不会引入：<br />
 * webpack-dev-server/client/index.js?logging=info&progress=true&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=Infinity&hot=true&live-reload=true
 * 目前它被注释掉，是因为个人直接修改了“webpack-dev-server/lib/Server.js”，从而暂时修复这个了BUG。<br />
 * 文件夹“backups”下的“webpack-dev-server/lib/Server_个人修复版.js”就是修改后的代码。<br />
 * “backups”下的“webpack-dev-server/lib/Server_原版.js”是“webpack-dev-server”的原来的带BUG的版本。<br />
 * 3、等这个BUG被webpack修复后，该工具就可以删掉不用了，已经提交了BUG修复申请：https://github.com/webpack/webpack/issues/16091。
 * 4、但是官方在“webpack-dev-server”的“4.12.0 (2023-03-14)”版本中修复了这个BUG。<br />
 *
 * @param {string|string[]} entryImport 入口要导入的模块，必需。<br />
 *
 * @param {boolean} isHMR 如果启用了experiments.buildHttp，才能把isHMR选项设置为true，否则还是要设置成false，默认值为true，必需。<br />
 *
 * @returns {string|string[]} 修复后的入口要导入的模块。
 */
function Fix_HMR_Experiments_BuildHttp_Webpack5( entryImport, isHMR = true ){
  if( isProduction || ( !isProduction && !isHMR ) ){
    return entryImport;
  }
  else{
    return [
      /**
       * 1、目前注释掉，是因为个人直接修改了“webpack-dev-server/lib/Server.js”，从而暂时修复这个BUG。<br />
       * 2、文件夹“backups”下的“webpack-dev-server/lib/Server_个人修复版.js”就是修改后的代码。<br />
       * 3、“backups”下的“webpack-dev-server/lib/Server_原版.js”是“webpack-dev-server”的原来的带BUG的版本。<br />
       * 4、但是官方在“webpack-dev-server”的“4.12.0 (2023-03-14)”版本中修复了这个BUG。<br />
       */
      // 'webpack-dev-server/client/index.js?logging=info&progress=true&overlay=%7B%22errors%22%3Atrue%2C%22warnings%22%3Afalse%7D&reconnect=Infinity&hot=true&live-reload=true',
    ].concat( entryImport );
  }
}

/**
 * 开始应用程序捆绑过程的一个或多个点。如果传递了一个数组，则将处理所有项目。<br />
 * PS：<br />
 * 强烈要求以Object的配置来配置入口点！这样才能正确的配合“configures/HTMLWebpackPluginConfig.esm.mjs”文件中“ExcludeChunks函数”的使用。<br />
 *
 * 1、动态加载的模块不是入口点。<br />
 * 2、需要考虑的规则：每个HTML页面有一个入口点。SPA：一个入口点，MPA：多个入口点。<br />
 * 3、允许为每个入口点设置不同类型的文件，如：entry: { a: [ './a.js', './a.css', ], }，这种设置，会在输出目录下生成对应的JS、CSS文件。<br />
 * 4、确保runtime选项不能指向现有的入口点名称。<br />
 * 5、runtime选项和dependOn选项不应在单个条目上一起使用。<br />
 * 6、不要为vendor或其他不是执行起点的东西创建条目。optimization.splitChunks选项负责分离vendor和应用程序模块并创建一个单独的文件。<br />
 * 7、可扩展的选项（必须使用可扩展的选项进行设置，以便配合HTMLWebpackPluginConfig.esm.mjs中的其他处理，某则会报错）：<br />
 * {<br />
 * asyncChunks：boolean，启用或禁用创建按需加载的异步块。<br />
 *
 * baseUri：string，设置入口的基本URL。<br />
 *
 * chunkLoading：同output.chunkLoading。<br />
 *
 * dependOn：string、[ string ]（强烈建议优先使用这个值类型设置），当前入口点所依赖的入口点。加载此入口点时，必须加载它们。<br />
 * 注意：<br />
 * 1、该选项配置的不是文件地址（如：'./src/xxx.js'），而是入口点的key名。例如这样的配置：<br />
 * entry: {
 *   a: {
 *     import: [
 *     './a.js',
 *     './a.css',
 *     ],
 *     dependOn: [ 'bbb', ],
 *   },
 *   bbb: './b.js',
 * }
 *
 * filename：同output.filename。<br />
 *
 * import：string、[ string ]（强烈建议优先使用这个值类型设置），启动时加载的模块。<br />
 * 1、例如：设置成：[ './src/pages/index/Index.mts' ]，就表示说该入口点的位置是在这里。<br />
 * 2、注意，由于“configures/EntryConfig.esm.mjs”最后是被“webpack.base.esm.mjs”文件引入使用，所以，当设置为相对路径时，也应该是以“webpack.base.esm.mjs”文件所在的文件夹路径开始。<br />
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
 *
 * 某些会导致编译后出现非预期的情况！<br />
 * 1、当设置如下案例时，会导致编译打包后的页面在打开后，并没执行相关JS代码：<br />
 * {
 *   Index: {
 *     import: [
 *       './src/pages/index/Index.css',
 *       './src/pages/index/Index.mts',
 *     ],
 *     dependOn: [
 *       'UniversalTools',
 *     ],
 *   },
 *
 *   UniversalTools: {
 *     import: {
 *       './src/tools/ts/universal_tools/UniversalTools.esm.mts',
 *     },
 *   },
 * }
 * 这样的配置，在打包完成后，打开页面，会发现，JS代码没执行，导致页面上没有出现对应的效果。<br />
 * 分析原因是这样的：<br />
 * 虽然在配置的时候明确指定“Index”块依赖“UniversalTools”块，但是在“Index”块的代码内部没有明确的编码有使用“UniversalTools”块指定的文件'./src/tools/ts/universal_tools/UniversalTools.esm.mts'中的代码。<br />
 * 导致webpack在构建块之间的依赖关系时，发现“Index”块内部并没有建立跟“UniversalTools”块的依赖引用关系，自然也就不会如配置所愿，产生依赖效果。<br />
 * 从而导致打包出来的代码并不是正确的代码逻辑。<br />、
 * 切记！webpack是一个一切皆可为模块的，构建各个模块之间的相互依赖关系的模块打包神器！只有明确的、代码间有相互依赖、使用时，才能如期望的那样打包出我们期望的代码。<br />
 */
const entryConfig = {
  // 这个也将作为标准模板配置供参考，复制它后再改改某些具体的参数值即可。
  Index: {
    import: Fix_HMR_Experiments_BuildHttp_Webpack5( [
      './src/pages/index/Index.css',
      './src/pages/index/Index.mts',
    ] ),
  },
};

/**
 * 注意：校验上面的常量“entryConfig”的值类型是不是一个Object类型，并且该常量“entryConfig”里面的每一个“键”对应的值也必须都得是一个Object类型。这是一个强制检验！<br />
 * 如果在实际开发过程中出现某些原因，不得不取消这个强制校验，那么除了要改“configures/EntryConfig.esm.mjs”文件里的逻辑，也要改“configures/HTMLWebpackPluginConfig.esm.mjs”文件里的逻辑。<br />
 */
( function VerifyEntryConfig( entryConfig ){
  if( Object.prototype.toString.call( entryConfig ) === '[object Object]' ){
    Array.from( Object.values( entryConfig ) ).forEach( ( item, index ) => {
      if( Object.prototype.toString.call( item ) !== '[object Object]' ){
        throw new Error( `\n\n\n键“${ Array.from( Object.keys( entryConfig ) )[ index ] }”的值类型必须是一个Object类型！这是强制要求的！\n如果在实际开发过程中出现某些原因，不得不取消这个强制规定，那么除了要改“configures/EntryConfig.esm.mjs”文件里的逻辑，也要改“configures/HTMLWebpackPluginConfig.esm.mjs”文件里的逻辑。\n\n\n` );
      }
    } );
  }
  else{
    throw new Error( `\n\n\n常量“entryConfig”的值类型必须是一个Object类型！这是强制要求的！\n如果在实际开发过程中出现某些原因，不得不取消这个强制规定，那么除了要改“configures/EntryConfig.esm.mjs”文件里的逻辑，也要改“configures/HTMLWebpackPluginConfig.esm.mjs”文件里的逻辑。\n\n\n` );
  }
} )( entryConfig );

export {
  entryConfig,
};

export default entryConfig;
