/**
 * Project: upload-for-multiple
 * FileDirPath: webpack.base.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 该文件里的配置都是webpack中公共部分的配置，供webpack.dev.mjs、webpack.local.mjs、webpack.production.mjs、webpack.test.mjs使用。
 */

/**
 * 可能需要修改的地方！
 *
 * 1、当需要将代码转换成兼容比较旧的平台时，需要修改：
 * 变量browserslist。
 * 变量esbuildMinify_target。
 * 变量vue_loader_options_transpileOptions_target。
 * package.json中的browserslist字段，值同变量browserslist。
 * tsconfig.json中的compilerOptions.module、compilerOptions.target。
 * tsconfig.webpack.json中的compilerOptions.module、compilerOptions.target。
 * webpack的配置项：experiments、target、output.environment。
 * 变量babel_targets中的esmodules选项、browsers选项。
 * @babel/preset-env中的forceAllTransforms选项。
 * vue-loader:options.transpileOptions.transforms。
 * 变量esbuildMinifyConfig.format。
 *
 * 变量isUseESBuildLoader、变量isSPA、webpack的配置项：output.chunkLoadingGlobal、变量assetsWebpackPluginConfig中的配置、文件夹configures下的文件GlobalParameters.esm.mjs中的配置、变量cleanWebpackPluginConfig.cleanOnceBeforeBuildPatterns。
 * 变量assetsWebpackPluginConfig.metadata：display、version。
 * 变量moduleConfig里的cssLoader_url_import_IgnoreArr变量。
 * 变量experimentsConfig.buildHttp中的allowedCondition变量。
 *
 * 2、如果本机总物理内存较小，记得改小jsWorkerPoolConfig.workerNodeArgs、forkTsCheckerWebpackPluginConfig.typescript.memoryLimit中设置的值。
 * PS：本来想通过代码来动态的根据本机空闲内存来设置，但是不知为何会报错，只能写死设置。
 *
 * 3、本配置中的路径字符都是以Windows平台为主，没做其他系统平台的兼容，如果需要在其他系统平台使用，注意针对性修改如“./”、“//”、“\\”、“/”、“\”之类的路径。
 */

/**
 * 关于webpack、babel的注意事项，可能导致编译后的代码报错或输出的代码非期望代码！！！
 * 1、当babel启用removeConsole、removeDebugger这两个插件选项后，某些情况下会有意外的编译输出，详见如下：
 * 说明：
 * 如果在诸如console.log()中编写某些跟项目逻辑业务有关的代码，那么当启用removeConsole、removeDebugger时，会导致最后输出的代码中因删除了诸如console.log()，从而导致其中的某些跟项目逻辑业务有关的代码也被删除，最终使生产的代码出现非所愿期望的代码输出，从而报错。
 * 所以，诸如console.log()中不要做任何逻辑处理（哪怕是：++index这种最简单的逻辑），只作为纯日志输出。
 * 例如：
 * let index = 0, arr001 = [ 'qqq', 'www', ], str001 = '';
 *
 * for( const item of arr001 ){
 *   str001 + = item;
 *
 *   console.log( `index--->${ ++index }` );
 * }
 * 当没有启用removeConsole、removeDebugger时，执行上述代码后，index的值为3，但是如果启用removeConsole、removeDebugger，则index的值为0，那么显然这不是期望的。
 *
 * 对于上述的两个选项，当前配置是这样的，“webpack.test.mjs”中是false，webpack.production.mjs是true。
 */

/**
 * 关于在“Webpack 5.97.1”中的模块类型（Module Type）
 * 1、详细见：node_modules/webpack/lib/ModuleTypeConstants.js，都有：
 * 'javascript/auto'、'javascript/dynamic'、'javascript/esm'、'json'、
 * 'webassembly/async'、'webassembly/sync'、
 * 'css'、'css/global'、'css/module'、'css/auto'、
 * 'asset'、'asset/inline'、'asset/resource'、'asset/source'、'asset/raw-data-url'、
 * 'runtime'、
 * 'fallback-module'、'remote-module'、'provide-module'、'consume-shared-module'、
 * 'lazy-compilation-proxy'
 * 2、在插件“mini-css-extract-plugin”中，还有该插件特有的模块类型（Module Type）：'css/mini-extract'。
 */

'use strict';

import {
  createReadStream,
  readFileSync,
} from 'node:fs';

import {
  cpus,
} from 'node:os';

import {
  basename,
  dirname,
  join,
  posix,
  resolve,
} from 'node:path';

import {
  argv,
} from 'node:process';

import {
  fileURLToPath,
} from 'node:url';

import chalk from 'chalk';

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import {
  // 该函数的函数参数详细见：node_modules/dotenv/lib/main.d.ts:21
  config as DotenvConfig,
} from 'dotenv';

import ESBuild from 'esbuild';

import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

import JSON5 from 'json5';

import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';

import less from 'less';

import Mime from 'mime';

import package_json from './package.json' with { type: 'json', };

import postcss from 'postcss';

import * as SassEmbedded from 'sass-embedded';

import Stylus from 'stylus';

import TerserPlugin from 'terser-webpack-plugin';

// import ThreadLoader from 'thread-loader';

import Toml from 'toml';

import tsconfig_webpack_json from './tsconfig.webpack.json' with { type: 'json', };

import webpack from 'webpack';

import Yaml from 'yamljs';

import DefinePluginConfig from './configures/DefinePluginConfig.esm.mjs';

import entryConfig from './configures/EntryConfig.esm.mjs';

import {
  devServerGlobalParameters,
  httpRequestHeaders,
  HttpResponseHeadersFun,
} from './configures/GlobalParameters.esm.mjs';

import HTMLWebpackPluginConfig from './configures/HTMLWebpackPluginConfig.esm.mjs';

import {
  CreateLogger,
} from './configures/Logger.esm.mjs';

import proxyConfig from './configures/ProxyConfig.esm.mjs';

import {
  ModuleFederation_v2_Config_Fun,
} from './ModuleFederation_v2_Config.esm.mjs';

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

/**
 * 表示项目文件夹根目录，不是磁盘根目录。<br />
 *
 * @type {string}
 */
const __dirname = Get__dirname( import.meta.url ),
  /**
   * env_platform的值是字符串，有4个值：'dev_server'、'local_server'、'test'、'production'，来源是CLI参数中的“--env”参数值，注意“--env”参数是允许多个的哦。<br />
   * 1、但是必须有这么一个“--env”参数设置，这4个之中的其中一个即可：--env platform=dev_server、--env platform=local_server、--env platform=test、--env platform=production。<br />
   *
   * @type {string|undefined}
   */
  env_platform = ( argv => {
    const envArr = [];

    argv.forEach( ( item, index ) => {
      if( item === '--env' ){
        envArr.push( argv.at( index + 1 ) );
      }
    } );

    if( envArr.length === 0 ){
      console.log( chalk.cyan( `\n${ JSON.stringify( argv ) }\n` ) );

      throw new Error( 'CLI参数中没找到“--env”参数。注意“--env”参数是允许多个的哦。' );
    }

    const platformArr = [];

    envArr.forEach( item => {
      if( item.startsWith( 'platform=' ) ){
        platformArr.push( item );
      }
    } );

    if( platformArr.length === 0 ){
      console.log( chalk.cyan( `\n${ JSON.stringify( argv ) }\n` ) );

      throw new Error( 'CLI参数中必须有这么一个“--env”参数设置，这4个之中的其中一个即可：--env platform=dev_server、--env platform=local_server、--env platform=test、--env platform=production。注意“--env”参数是允许多个的哦。' );
    }
    else if( platformArr.length > 1 ){
      console.log( chalk.cyan( `\n${ JSON.stringify( argv ) }\n` ) );

      throw new Error( 'CLI参数中的“--env”参数设置，以“platform=”开头的值有且只能有一个，该值一般是这4个中的一个：platform=dev_server、platform=local_server、platform=test、platform=production。注意“--env”参数是允许多个的哦。' );
    }

    const str = platformArr.at( 0 ).replace( 'platform=', '' ).trim();

    if( [
      'dev_server',
      'local_server',
      'test',
      'production',
    ].includes( str ) ){
      return str;
    }
    else{
      console.log( chalk.cyan( `\n${ JSON.stringify( argv ) }\n` ) );

      throw new Error( 'CLI参数中的“--env”参数设置，以“platform=”开头的值，在“platform=”之后紧跟的只能是这4个中的一个：dev_server、local_server、test、production。注意“--env”参数是允许多个的哦。' );
    }
  } )( argv );

switch( env_platform ){
  case 'dev_server':
    /**
     * @type {import('node_modules/dotenv/lib/main.d.ts').config} config
     */
    DotenvConfig( {
      path: `./.env.dev`,
    } );
    console.log( chalk.cyan( `当前使用的“.env”文件是“.env.dev”。\n` ) );

    break;
  case 'local_server':
    /**
     * @type {import('node_modules/dotenv/lib/main.d.ts').config} config
     */
    DotenvConfig( {
      path: `./.env.local`,
    } );
    console.log( chalk.cyan( `当前使用的“.env”文件是“.env.local”。\n` ) );

    break;
  case 'test':
    /**
     * @type {import('node_modules/dotenv/lib/main.d.ts').config} config
     */
    DotenvConfig( {
      path: `./.env.test`,
    } );
    console.log( chalk.cyan( `当前使用的“.env”文件是“.env.test”。\n` ) );

    break;
  case 'production':
    /**
     * @type {import('node_modules/dotenv/lib/main.d.ts').config} config
     */
    DotenvConfig( {
      path: `./.env.production`,
    } );
    console.log( chalk.cyan( `当前使用的“.env”文件是“.env.production”。\n` ) );

    break;
  default:
    throw new Error( 'CLI参数中的“--env”参数设置，以“platform=”开头的值，在“platform=”之后紧跟的只能是这4个中的一个：dev_server、local_server、test、production。注意“--env”参数是允许多个的哦。' );
}

/**
 * isProduction的值为true时表示生产环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值。<br />
 * 1、有效的“--mode”参数设置是：--mode development（用于开发）、--mode production（用于生产）。<br />
 *
 * @type {boolean}
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
        console.log( chalk.cyan( `\n${ JSON.stringify( argv ) }\n` ) );

        throw new Error( 'CLI参数中紧跟在“--mode”之后的，只能是development（用于开发）、production（用于生产）。有效的“--mode”参数设置是：--mode development、--mode production。' );
      }
    }
    else{
      console.log( chalk.cyan( `\n${ JSON.stringify( argv ) }\n` ) );

      throw new Error( 'CLI参数中没找到“--mode”参数。' );
    }
  } )( argv ),
  /**
   * 是否将项目设置成单页面应用程序(SPA)，true表示单页面应用程序(SPA)，false表示多页面应用程序(MPA)。<br />
   *
   * @type {boolean}
   */
  isSPA = false,
  /**
   * true表示启用esbuild-loader来转译js、ts，false表示用babel来转译js、ts，esbuild-loader是不需要thread-loader来加速的！它自己已经是很快很快很快了。<br />
   * 1、如果需要兼容到低端平台，即转译到ES5、ES3的话，还是使用babel来转译，将isUseESBuildLoader设置成false。<br />
   * 2、如果是兼容到新的现代浏览器，也就是支持ES6的平台，那么还是用esbuild吧，它有这方面的优越性，但就是对ES5不是很友好。<br />
   * 3、目前esbuild对有些处于提案阶段的实验性语法还不能支持，所以，如果需要兼顾前面两点，那还是要继续使用babel来转译的。<br />
   * 4、截至2022年11月08日，基于最新的esbuild版本做测试，其只能支持对静态的导入、导出的代码做“Tree Shaking”，动态的还不支持，而webpack在“Tree Shaking”做的会比它好，希望其未来能做到跟webpack一样的“Tree Shaking”功能吧。<br />
   *
   * @type {boolean}
   */
  isUseESBuildLoader = false,
  /**
   * 是否在控制台输出Babel的插件调试日志。<br />
   * 1、会使用“console.log”输出由preset-env启用的polyfill和转换插件，并且会输出哪些目标需要它。<br />
   * 2、比如输出日志中有：proposal-class-static-block { chrome < 94, firefox < 93, opera < 80, safari }。<br />
   * 说明：表示当编译目标为chrome < 94, firefox < 93, opera < 80, safari这些时，会启用“proposal-class-static-block”。<br />
   *
   * @type {boolean}
   */
  isBabelDebug = false,
  /**
   * 当启用实验性选项experiments.buildHttp时，是否要处理CSS文件中的远程资源URL。true表示处理，false表示不处理，将其原样保留在代码中。<br />
   * 1、远程资源的加载是需要耗时下载的，所以，webpack的编译时间也受其影响。<br />
   *
   * @type {boolean}
   */
  isHandle_experiments_buildHttp_in_CSSLoader = true,
  /**
   * 不通过webpack处理css中以如下设置的值开头的url。
   *
   * @returns {string[]}
   */
  cssLoader_url_import_IgnoreHandle = ( experimentsConfig, isHandle_experiments_buildHttp_in_CSSLoader ) => {
    return [
      '../static/',
      '//',
      ...( () => {
        return ( ( 'buildHttp' in experimentsConfig ) && isHandle_experiments_buildHttp_in_CSSLoader )
               ? []
               : [
            'http',
          ];
      } )(),
    ];
  },
  /**
   * 允许以哪些开头的远程链接。<br />
   *
   * @type {string[]}
   */
  allowedCondition = [
    'http',
    // 'https://www.xxx.com/',
  ];

console.log( chalk.cyan( `当前使用“${ isUseESBuildLoader
                                      ? 'ESBuild'
                                      : 'Babel' }”处理“JS”、“TS”等等脚本！！！\n` ) );

/**
 * 目标浏览器版本。
 *
 * @type {string[]}
 */
const browserslist = [
    // PC端完全支持ES 5的主流浏览器 Start
    // 'Chrome >= 23',
    // 'Firefox >= 21',
    // ie 9不支持ECMAScript 5的"use strict"，但是ie 10真正的完全支持ECMAScript 5了。
    // 'ie >= 9',
    // 'Safari >= 6',
    // Opera 15开始改用基于Chromium 28的，也是从15开始其内核跟Chrome一致了。
    // 'Opera >= 15',
    // PC端完全支持ES 5的主流浏览器 End

    // PC端完全支持ES 6（ECMAScript 2015）的主流浏览器 Start
    // 'Chrome >= 58',
    // 'Firefox >= 54',
    // 这里的Edge是指旧版的微软Edge（版本从12到18），它是用微软的浏览器引擎EdgeHTML和他们的Chakra JavaScript引擎构建的。
    // 'Edge >= 14',
    // 'Safari >= 10',
    // 'Opera >= 55',
    // PC端完全支持ES 6（ECMAScript 2015）的主流浏览器 End

    // PC端各主流浏览器的最新版本，至20241128。Start
    'Chrome >= 131',
    // 这里的Edge是指新版的微软Edge，其基于Chromium，带有Blink和V8引擎，后来其最新的版本号，也基本跟Chrome版本号保持一致了。
    'Edge >= 131',
    'Firefox >= 133',
    'Safari >= 18',
    'Opera >= 115',
    // PC端各主流浏览器的最新版本，至20241128。End

    // 移动端各主流浏览器的最新版本，至20241128。Start
    'ChromeAndroid >= 131',
    // 从Android 4.4后Android WebView直接跟Chrome同步。
    'Android >= 131',
    'FirefoxAndroid >= 133',
    'iOS >= 18',
    // 移动端各主流浏览器的最新版本，至20241128。End
  ],
  /**
   * 每个目标环境都是一个环境名称，后跟一个版本号。当前支持以下环境名称：<br />
   * 1、chrome、edge、firefox、hermes、ie、ios、node、deno、opera、rhino、safari。<br />
   * 2、还可以是这样的：es2020、esnext、node12、node12.19.0、es5、es6、deno1.0。<br />
   *
   * @type {string[]}
   */
  esbuildMinify_target = [
    // PC端完全支持ES 5的主流浏览器 Start
    // 'chrome23',
    // 'firefox21',
    // ie 9不支持ECMAScript 5的"use strict"，但是ie 10真正的完全支持ECMAScript 5了。
    // 'ie9',
    // 'safari6',
    // Opera 15开始改用基于Chromium 28的，也是从15开始其内核跟Chrome一致了。
    // 'opera15',
    // PC端完全支持ES 5的主流浏览器 End

    // PC端完全支持ES 6（ECMAScript 2015）的主流浏览器 Start
    // 'chrome58',
    // 'firefox54',
    // 这里的Edge是指旧版的微软Edge（版本从12到18），它是用微软的浏览器引擎EdgeHTML和他们的Chakra JavaScript引擎构建的。
    // 'edge14',
    // 'safari10',
    // 'opera55',
    // PC端完全支持ES 6（ECMAScript 2015）的主流浏览器 End

    'es2024',

    // PC端各主流浏览器的最新版本，至20241128。Start
    'chrome131',
    'edge131',
    'firefox133',
    'safari18',
    'opera115',
    // PC端各主流浏览器的最新版本，至20241128。End

    // 移动端各主流浏览器的最新版本，至20241128。Start
    'ios18',
    // 移动端各主流浏览器的最新版本，至20241128。End
  ],
  /**
   * 目标浏览器版本。<br />
   * 1、支持的标识符有：<br />
   * android、chrome、deno（支持的最低版本为'1.0'）、edge、electron、firefox、ie、ios、node、opera、rhino、safari、samsung，其他的会报错。<br />
   * 具体见：node_modules/@babel/helper-compilation-targets/lib/options.js。<br />
   * 2、也支持其他的别名标识符，但是不建议用别名标识符，因为如果设置了这些别名会报错（因为相关代码貌似并没使用这个别名映射）：<br />
   * and_chr（对应：chrome）、and_ff（对应：firefox）、ios_saf（对应：ios）、ie_mob（对应：ie）、op_mob（对应：opera）。<br />
   * 其他的别名会报错。<br />
   * 具体见：node_modules/@babel/core/lib/config/validation/option-assertions.js。<br />
   *
   * @type {object}
   */
  vue_loader_options_transpileOptions_target = {
    // PC端完全支持ES 5的主流浏览器 Start
    // chrome: 23,
    // firefox: 21,
    // ie 9不支持ECMAScript 5的"use strict"，但是ie 10真正的完全支持ECMAScript 5了。
    // ie: 9,
    // safari: 6,
    // Opera 15开始改用基于Chromium 28的，也是从15开始其内核跟Chrome一致了。
    // opera: 15,
    // PC端完全支持ES 5的主流浏览器 End

    // PC端完全支持ES 6（ECMAScript 2015）的主流浏览器 Start
    // chrome: 58,
    // firefox: 54,
    // 这里的Edge是指旧版的微软Edge（版本从12到18），它是用微软的浏览器引擎EdgeHTML和他们的Chakra JavaScript引擎构建的。
    // edge: 14,
    // safari: 10,
    // opera: 55,
    // PC端完全支持ES 6（ECMAScript 2015）的主流浏览器 End

    // PC端各主流浏览器的最新版本，至20241128。Start
    chrome: 131,
    edge: 131,
    firefox: 133,
    safari: 18,
    opera: 115,
    // PC端各主流浏览器的最新版本，至20241128。End

    // 移动端各主流浏览器的最新版本，至20241128。Start
    /*从Android 4.4后Android WebView直接跟Chrome同步。*/
    android: 131,
    ios: 18,
    // 移动端各主流浏览器的最新版本，至20241128。End
  },
  /**
   * 编译目标配置。
   *
   * @type {object}
   */
  babel_targets = {
    ...vue_loader_options_transpileOptions_target,
    /**
     * 您还可以针对支持ES模块的浏览器，当指定esmodules目标时，它将与browsers目标和browserslist的目标相交。您可以将此方法与<script type="module"></script>结合使用，以有条件地向用户提供较小的脚本。<br />
     * 1、值类型：boolean，true表示输出支持ES的模块化的代码。<br />
     * 2、当esmodules选项为true时，下面的browsers选项将会被忽略。<br />
     */
    // esmodules: true,

    // 如果要针对Safari的技术预览版进行编译，可以指定safari: 'tp'，当前先使用vue_loader_options_transpileOptions_target中的safari版本。
    // safari: 'tp',

    /**
     * 1、值类型：string、Array<string>。使用browserslist选择浏览器的查询：last 2 versions, > 5%, safari tp。<br />
     * 2、当上面的esmodules选项为true时，下面的browsers选项将会被忽略。<br />
     */
    browsers: browserslist,

    // 注意：uglify选项已被弃用，并将在下一个主要版本中删除。
    // uglify: null，其实我也不知道这个选项的值类型。
  };

// autoprefixer共有三种类型的控制注释：
// /* autoprefixer: (on|off) */：在注释前后“启用/禁用”整个块的所有Autoprefixer翻译。
// /* autoprefixer: ignore next */：仅为下一个属性或下一个规则选择器或规则参数（但不规则/规则正文）禁用自动前缀。
// /* autoprefixer grid: (autoplace|no-autoplace|off) */：控制Autoprefixer如何处理整个块的网格转换：
// autoplace：启用带有自动放置支持的网格翻译。
// no-autoplace：在禁用自动放置支持的情况下启用网格转换，但不支持自动放置（该值是值on的别名，但是值on是一个已弃用的值）。
// off：禁用所有网格翻译。
/**
 * @type {object}
 */
const autoprefixerConfig = {
    // 如果CSS未压缩，Autoprefixer应该使用Visual Cascade。默认值：true。
    cascade: true,
    // Autoprefixer应该添加前缀。默认为true。
    add: true,
    // 应该Autoprefixer[删除过时的]前缀。默认为true。
    remove: false,
    // Autoprefixer应该为@supports参数添加前缀。默认为true。
    supports: true,
    // 值类型：boolean、string，Autoprefixer应该为flexbox属性添加前缀。使用“no-2009”值，Autoprefixer将只为规范的最终版本和IE 10版本添加前缀。默认为true。
    flexbox: true,
    /**
     * 处理grid布局，有效值为：false、'autoplace'、'no-autoplace'。
     * 1、默认值为false，防止Autoprefixer输出CSS Grid翻译。<br />
     * 2、在您的项目根目录中运行npx autoprefixer --info以检查选择了哪些浏览器以及将为哪些属性添加前缀。<br />
     */
    // autoplace：启用Autoprefixer网格翻译并包括自动放置支持。您还可以在CSS中使用魔术注释：/* autoprefixer grid: autoplace */。
    // no-autoplace：该选项值是已弃用的选项值true的别名，启用Autoprefixer网格翻译，但不支持自动放置。您还可以在CSS中使用/* autoprefixer grid: no-autoplace */。
    // 将自动放置集成到现有项目中的绝对最佳方法是默认关闭自动放置，然后在需要时使用控制注释启用它。这种方法不太可能导致网站上的某些东西损坏。
    // 也就是在CSS文件的最顶部使用/* autoprefixer grid: no-autoplace */来关闭自动放置，但是在需要的地方使用/* autoprefixer grid: autoplace */来开启自动放置。
    grid: 'autoplace',
    // 不要在Browserslist配置中引发未知浏览器版本的错误。默认为false。
    ignoreUnknownVersions: false,
  },
  /**
   * @type {object}
   */
  esbuildMinifyConfig = {
    // 有效值有：'js'、'jsx'、'ts'、'tsx'、'css'、'json'、'text'、'base64'、'file'、'dataurl'、'binary'、'copy'、'default'。
    loader: 'js',
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    /**
     * “法律注释（legal comment）”被认为是JS中的任何语句级注释或CSS中包含@license或@preserve或以//!或者/*!开头的任何规则级注释。<br />
     * 1、默认情况下，这些注释保留在输出文件中，因为这遵循了代码原作者的意图。<br />
     * 2、有效值说明：<br />
     * 'none'：不要保留任何法律评论。<br />
     * 'inline'：保留所有法律评论。<br />
     * 'eof'：将所有法律注释移至文件末尾。<br />
     * 'linked'：将所有法律评论移至.LEGAL.txt文件并使用评论链接到它们。<br />
     * 'external'：将所有法律评论移至.LEGAL.txt文件，但不要链接到它们。<br />
     */
    legalComments: 'none',
    // 值有：'ascii'、'utf8'。
    charset: 'utf8',
    color: true,
    // 这将设置生成的JavaScript文件的输出格式。当前可以配置三个可能的值：iife、cjs、esm。
    format: 'esm',
    /**
     * 1、esbuild的“tree shaking”只能删除声明级别的死代码。<br />
     * 2、请注意，esbuild的“tree shaking”实现依赖于ECMAScript模块导入和导出语句的使用，它不适用于CommonJS模块。<br />
     * 3、用于“tree shaking”的“side effects（副作用）”检测是保守的，这意味着esbuild仅在能够确保没有隐藏的副作用时才将可移除的代码视为死代码。<br />
     */
    // 4、可以使用/* @__PURE__ */注释，明确表示该表达式是无副作用的，由于注释的原因，这被认为是无副作用的，如果未使用，将被删除。
    /*
     // 例子：
     let gammaTable = 无副作用的注释 (() => {
     // 此处跳过副作用检测。
     let table = new Uint8Array(256);
     for (let i = 0; i < 256; i++)
     table[i] = Math.pow(i / 255, 2.2) * 255;
     return table;
     })();
     */
    treeShaking: isProduction,
    /**
     * 代码拆分仍然是一项正在进行的工作。
     * 它目前只适用于esm输出格式，也就是说当选项“format”的值为'esm'时，该选项有效。
     * 还有一个已知的跨代码拆分块的导入语句的排序问题。你可以关注跟踪问题，以了解关于这个功能的更新。
     * 详细见：https://esbuild.github.io/api/#splitting
     */
    splitting: true,
    // 详细见：https://esbuild.github.io/api/#ignore-annotations
    ignoreAnnotations: false,
    // 有效值有：browser、node、neutral。
    platform: 'browser',
    keepNames: true,
    mangleQuoted: false,
    // 日志限制可以更改为另一个值，也可以通过将其设置为0来完全禁用。这将显示所有日志消息。
    logLimit: 0,
    /**
     * 当使用babel转换JS语法时，drop选项（相当于babel的removeConsole、removeDebugger）不使用，其同样的功能交给babel预设处理，这里就不用重复设置了。但是如果使用esbuild转换JS时，还是要启用drop选项的。<br />
     *
     * 注意：<br />
     * 如果在诸如console.log()中编写某些跟项目逻辑业务有关的代码，那么当启用removeConsole、removeDebugger时，会导致最后输出的代码中因为删除了诸如console.log()，从而导致其中的某些跟项目逻辑业务有关的代码也被删除，最终使生产的代码出现非所愿期望的代码输出，从而报错。<br />
     * 所以，诸如console.log()中不要做任何逻辑处理（哪怕是：++index这种最简单的逻辑），只作为纯日志输出。<br />
     * 例如：<br />
     * let index = 0, arr001 = [ 'qqq', 'www', ], str001 = '';
     *
     * for( const item of arr001 ){
     *   str001 + = item;
     *
     *   console.log( `index--->${ ++index }` );
     * }
     * 当没有启用removeConsole、removeDebugger时，执行上述代码后，index的值为3，但是如果启用removeConsole、removeDebugger，则index的值为0，那么显然这不是期望的。<br />
     *
     * 对于drop选项，当前配置是这样的，“webpack.test.mjs”中不设置drop选项（对应的是不删除操作），webpack.production.mjs中设置drop选项（对应的是删除操作）。<br />
     */
    ...( () => {
      return isUseESBuildLoader
             ? {
          ...( () => {
            if( env_platform === 'dev_server' ){
              return {};
            }
            else if( env_platform === 'local_server' ){
              return {};
            }
            else if( env_platform === 'test' ){
              return {};
            }
            else if( env_platform === 'production' ){
              return {
                drop: [
                  'debugger',
                  'console',
                ],
              };
            }
            else{
              return {};
            }
          } )(),
        }
             : {};
    } )(),
    target: esbuildMinify_target,
    // 有效值有：silent、error、warning、info、debug、verbose。
    logLevel: 'error',
    logOverride: {
      'assign-to-constant': 'error',
      'assign-to-import': 'error',
      'call-import-namespace': 'error',
      'commonjs-variable-in-esm': 'error',
      'delete-super-property': 'error',
      'duplicate-case': 'error',
      'duplicate-object-key': 'error',
      'empty-import-meta': 'error',
      // 浮点相等的定义使得NaN永远不等于任何东西，所以"x === NaN"总是返回假。您需要使用“isNaN(x)”来测试NaN。
      'equals-nan': 'error',
      // 浮点相等定义为0和-0相等，因此"x === -0"返回true。您需要使用“Object.is(x, -0)”来测试-0。
      'equals-negative-zero': 'error',
      'equals-new-object': 'error',
      'html-comment-in-js': 'error',
      // 表达式“typeof x”实际上在JavaScript中计算为“object”，而不是“null”。你需要使用“x === null”来测试null。
      'impossible-typeof': 'error',
      'indirect-require': 'error',
      'private-name-will-throw': 'error',
      'semicolon-after-return': 'warning',
      // 代码“!x in y”被解析为“(!x) in y”。您需要插入括号才能获得“!(x in y)”。
      'suspicious-boolean-not': 'error',
      // 当文件是ECMAScript模块[this-is-undefined-in-esm]，因此顶级“this”将被替换为undefined。
      'this-is-undefined-in-esm': 'warning',
      // 此“import”表达式不会被捆绑（import(foo)），因为参数不是字符串文字。
      'unsupported-dynamic-import': 'warning',
      'unsupported-jsx-comment': 'error',
      // 正则表达式标志“d”在配置的目标环境（“chrome50”）中不可用。此正则表达式文字已转换为“new RegExp()”构造函数以避免生成带有语法错误的代码。但是，您需要为“RegExp”包含一个polyfill您的代码在运行时具有正确的行为。
      'unsupported-regexp': 'warning',
      'unsupported-require-call': 'warning',

      'css-syntax-error': 'error',
      'invalid-@charset': 'error',
      'invalid-@import': 'warning',
      'invalid-@layer': 'warning',
      'invalid-calc': 'error',
      'js-comment-in-css': 'warning',
      'unsupported-@charset': 'error',
      'unsupported-@namespace': 'error',
      'unsupported-css-property': 'warning',
      'unsupported-css-nesting': 'error',

      'ambiguous-reexport': 'warning',
      'different-path-case': 'silent',
      'ignored-bare-import': 'error',
      'ignored-dynamic-import': 'silent',
      'import-is-undefined': 'error',
      'require-resolve-not-external': 'error',

      'package.json': 'error',
      'tsconfig.json': 'error',
    },
  },
  /**
   * 详细见：
   * node_modules/@types/html-minifier-terser/index.d.ts:15
   *
   * @type {object}
   */
  HTMLMinifyConfig = {
    // 以区分大小写的方式处理属性（对自定义HTML标签有用）。
    caseSensitive: false,
    // 从布尔属性中省略属性值。
    collapseBooleanAttributes: false,
    // 不要在display:inline;之间留下任何空格。折叠时的元素。必须与collapseWhitespace=true结合使用。
    collapseInlineTagWhitespace: true,
    // 折叠有助于文档树中文本节点的空白。
    collapseWhitespace: true,
    // 总是折叠到1个空格（永远不要完全删除它）。必须collapseWhitespace=true结合使用。
    conservativeCollapse: false,
    // 处理解析错误而不是中止。
    continueOnParseError: false,
    // 尽可能使用直接Unicode字符。
    decodeEntities: false,
    // 根据HTML5规范解析输入。
    html5: true,
    // 插入HTML解析器生成的标签。
    includeAutoGeneratedTags: true,
    // 在单例元素上保留斜杠。
    keepClosingSlash: true,
    // 缩小样式元素和样式属性中的CSS（使用clean-css）。
    minifyCSS: isProduction,
    // 缩小脚本元素和事件属性中的JavaScript（使用Terser）。
    minifyJS: isProduction,
    // 缩小各种属性中的URL（使用relateurl来处理的）。
    minifyURLs: false,
    // 切勿在关闭元素的标记之前添加换行符。
    noNewlinesBeforeTagClose: false,
    // 当标签之间的空格包含换行符时，总是折叠到1个换行符（永远不要完全删除它）。必须与collapseWhitespace=true结合使用。
    preserveLineBreaks: false,
    // 防止属性值的转义。
    preventAttributesEscaping: false,
    // 通过minifier处理条件注释的内容。
    processConditionalComments: false,
    // 尽可能删除属性周围的引号。
    removeAttributeQuotes: false,
    // 去除HTML注释。
    removeComments: true,
    // 删除所有具有纯空格值的属性。
    removeEmptyAttributes: false,
    // 删除所有内容为空的元素。
    removeEmptyElements: false,
    // 删除可选标签。
    removeOptionalTags: false,
    // 当值与默认值匹配时删除属性。
    removeRedundantAttributes: false,
    // 从脚本标签中删除type="text/javascript"其他类型属性值保持不变。
    removeScriptTypeAttributes: false,
    // 从样式和链接标签中删除type="text/css"其他类型属性值保持不变。
    removeStyleLinkTypeAttributes: false,
    // 尽可能删除属性之间的空格。请注意，这将导致HTML无效！
    removeTagWhitespace: false,
    // 按频率排序属性。
    sortAttributes: false,
    // 按频率对样式类进行排序。
    sortClassName: false,
    // 修剪ignoreCustomFragments周围的空白。
    trimCustomFragments: false,
    // 用短 (HTML5) 文档类型替换文档类型。
    useShortDoctype: false,
  },
  /**
   * @type {object}
   */
  postcssCalcConfig = {
    // 默认值为5，允许您定义十进制数的精度。
    precision: 6,
    // 默认值为false，允许您在输出中保留calc() 用法，以便浏览器自己处理小数精度。
    preserve: true,
    // 默认值为false，当calc()未减少为单个值时添加警告。
    warnWhenCannotResolve: false,
    // 默认值为false，允许将calc()用作媒体查询声明的一部分。
    mediaQueries: true,
    // 默认值为false，允许将calc()用作选择器的一部分。
    selectors: true,
  },
  /**
   * @type {array}
   */
  watchIgnoredArr = [
    posix.resolve( __dirname, './.git/' ),
    posix.resolve( __dirname, './.idea/' ),
    posix.resolve( __dirname, './assist_tools/' ),
    posix.resolve( __dirname, './backups/' ),
    posix.resolve( __dirname, './bats/' ),
    posix.resolve( __dirname, './configures/' ),
    posix.resolve( __dirname, './dist/' ),
    posix.resolve( __dirname, './log/' ),
    posix.resolve( __dirname, './node_modules/' ),
    posix.resolve( __dirname, './notes/' ),
    posix.resolve( __dirname, './read_me/' ),
    posix.resolve( __dirname, './simulation_servers/' ),
    posix.resolve( __dirname, './test/' ),
    posix.resolve( __dirname, './ts_compiled/' ),
    posix.resolve( __dirname, './webpack_location/' ),
    posix.resolve( __dirname, './webpack_records/' ),
    '**/@mf-types/**',
  ],
  /**
   * 默认情况下，它只影响按需块，因为更改初始块会影响HTML文件应包含以运行项目的脚本标记。<br />
   * 1、Webpack将根据这些条件自动拆分块：<br />
   * 可以共享新块或模块来自node_modules文件夹。<br />
   * 新块将大于20kb（在min+gz 之前）。<br />
   * 按需加载块（Async块）时的最大并行请求数将低于或等于30。<br />
   * 初始页面加载时的最大并行请求数将低于或等于30。<br />
   * 2、当试图满足上述最后2个条件时，首选更大的块。<br />
   * 3、选择默认配置以适应Web性能最佳实践，但您的项目的最佳策略可能会有所不同。如果您要更改配置，您应该衡量更改的效果，以确保有真正的好处。<br />
   * 4、从webpack 5开始，不再允许将条目名称传递给{cacheGroup}.test并将现有块的名称用于{cacheGroup}.name。<br />
   *
   * @type {object}
   */
  splitChunksConfig = {
    /**
     * 默认情况下，webpack将使用块的来源和名称生成名称（例如：vendor~main.js）。此选项允许您指定用于生成名称的分隔符。<br />
     * 1、值类型：string，默认值：'~'。<br />
     */
    automaticNameDelimiter: '__',
    /**
     * 这表明将选择对哪些块进行优化。<br />
     * 1、值类型：string（只有3个有效值：'all'、'async'、'initial'）、chunk => boolean，默认值：'all'。<br />
     * <code>
     * chunks( chunk ){
     *     // exclude `my-excluded-chunk`，返回true就表示要优化、拆分这个块！
     *     return chunk.name !== 'my-excluded-chunk';
     * },
     * </code>
     * 2、当提供值为'all'，可能特别强大，因为这意味着即使在异步和非异步块之间也可以共享块。<br />
     * 3、该选项也可以在splitChunks.fallbackCacheGroup中使用。<br />
     * 4、如果使用的是“webpack 5.86.0”或更高版本的webpack，还可以传递正则表达式。<br />
     * <code>
     * chunks: /foo/,
     * </code>
     */
    chunks: 'all',
    /**
     * 按需加载（Async块）时的最大并行请求数。值类型：number，默认值：30。<br />
     * 1、当实际生成的数量大于这个选项设置的值的时候，会将多余的小块进行合并。<br />
     */
    maxAsyncRequests: 50,
    /**
     * 入口点的最大并行请求数。值类型：number，默认值：30。<br />
     * 1、它影响的是入口文件加载时的资源请求数量。<br />
     * 2、如果生成的 chunk数量超过限制，Webpack会尝试合并较小的chunk。<br />
     */
    maxInitialRequests: 50,
    /**
     * 使用数字限制文件大小时，有哪些类型的文件可以受数字限制文件大小。<br />
     * 1、值类型：[string]，默认值：[ 'javascript', 'unknown', ]。<br />
     */
    defaultSizeTypes: [
      /**
       * '...'值大概是表示扩展吧！
       */
      // '...',
      'javascript',
      'unknown',
      // 'css',
      /**
       * 'css/mini-extract'值来自node_modules/mini-css-extract-plugin/types/utils.d.ts:37。
       */
      // 'css/mini-extract',
      // 'wasm',
      // 'webassembly',
    ],
    /**
     * 控制一个模块至少需要被多少次引用，才会被拆分到公共chunk中。可以通过增加该值减少公共chunk的数量。<br />
     * 1、值类型：number，默认值：1。<br />
     * 2、较大的值：如果希望只在模块“非常多的被共享使用”的情况下才提取它到公共chunk中，可以设置一个较大的minChunks值（例如：2、3）。这可以减少公共chunk的数量。<br />
     * 3、较小的值：如果你希望更积极地拆分出公共模块，可以将minChunks设置得较小，比如：1。<br />
     */
    minChunks: 1,
    /**
     * 在为按maxSize分割的部分创建名称时防止暴露路径信息。<br />
     * 1、值类型：boolean，默认值：false。<br />
     */
    hidePathInfo: isProduction,
    /**
     * 要生成新的拆分块的最小大小（以字节为单位）。例如：1 * 1024，就表示：1KB。<br />
     * 1、值类型：number（默认值：20000）、{ [index: string]: number }。<br />
     * <code>
     * minSize: {
     *   // '...': 1 * 1024,
     *   javascript: 1 * 1024,
     *   unknown: 1 * 1024,
     *   // css: 1 * 1024,
     *   // 'css/mini-extract': 1 * 1024,
     *   // wasm: 1 * 1024,
     *   // webassembly: 1 * 1024,
     * },
     * </code>
     * 2、控制拆分出的代码块的最小尺寸。如果拆分出的代码块小于指定的minSize，Webpack将不会拆分该块。<br />
     * 3、较大的值：如果你希望避免生成过多的小文件，或者你不希望拆分太小的代码块，可以设置较大的minSize。这会迫使Webpack合并一些小的模块，从而减少HTTP请求的数量，但可能会导致某些块过大。<br />
     * 4、较小的值：如果你希望拆分更多的代码块（比如，拆分出更多的小模块，以减少单个模块的大小），可以设置较小的minSize，但要注意不要拆分得太小。<br />
     */
    minSize: 1 * 1024,
    /**
     * 用于控制一个代码块在被拆分后，相较于原始大小需要缩小多少才能被认为是有益的并因此生成新的代码块。如果减少量小于这个值，则不会进行拆分。即使它满足splitChunks.minSize值，它也不会被拆分。<br />
     * 1、值类型：number（默认值：0）、{ [index: string]: number }。<br />
     * <code>
     * minSizeReduction: {
     *   // '...': 0,
     *   javascript: 0,
     *   unknown: 0,
     *   // css: 0,
     *   // 'css/mini-extract': 0,
     *   // wasm: 0,
     *   // webassembly: 0,
     * },
     * </code>
     * 2、splitChunks.minSizeReduction和splitChunks.minSize都需要满足才能生成新的拆分块。<br />
     */
    minSizeReduction: 0,
    /**
     * 用于指定在进行代码分割时强制应用的大小阈值。当代码块的大小超过这个阈值时，即使它不符合splitChunks.minSize或其他限制（minRemainingSize、maxAsyncRequests、maxInitialRequests），Webpack也会强制将其分割，以字节为单位。<br />
     * 1、值类型：number、{ [index: string]: number }，默认值：50000。<br />
     * <code>
     * enforceSizeThreshold: {
     *   // '...': 1 * 1024 * 1024,
     *   javascript: 1 * 1024 * 1024,
     *   unknown: 1 * 1024 * 1024,
     *   // css: 1 * 1024 * 1024,
     *   // 'css/mini-extract': 1 * 1024 * 1024,
     *   // wasm: 1 * 1024 * 1024,
     *   // webassembly: 1 * 1024 * 1024,
     * },
     * </code>
     * 2、该选项也可以用于splitChunks.cacheGroups.{cacheGroup}.enforceSizeThreshold。<br />
     */
    enforceSizeThreshold: 1 * 1024 * 1024,
    /**
     * 在webpack 5中引入了splitChunks.minRemainingSize选项，通过确保拆分后剩余的块的最小大小高于“该选项设置的值”来避免零大小的模块。<br />
     * 1、值类型：number、{ [index: string]: number }，默认值：0。<br />
     * <code>
     * minRemainingSize: {
     *   // '...': isProduction ? 1 * 1024 : 0,
     *   javascript: isProduction ? 1 * 1024 : 0,
     *   unknown: isProduction ? 1 * 1024 : 0,
     *   // css: isProduction ? 1 * 1024 : 0,
     *   // 'css/mini-extract': isProduction ? 1 * 1024 : 0,
     *   // wasm: isProduction ? 1 * 1024 : 0,
     *   // webassembly: isProduction ? 1 * 1024 : 0,
     * },
     * </code>
     * 2、在“开发”模式下默认为0。对于其他情况，splitChunks.minRemainingSize默认为splitChunks.minSize的值，因此除了需要深度控制的极少数情况外，不需要手动指定。<br />
     * 3、该选项也可以用于splitChunks.cacheGroups.{cacheGroup}.minRemainingSize。<br />
     * 4、splitChunks.minRemainingSize仅在剩余单个块时生效。<br />
     */
    minRemainingSize: isProduction
                      ? 1 * 1024
                      : 0,
    /**
     * 按模块层将模块分配给缓存组。<br />
     * 1、值类型：RegExp、string、function。<br />
     * 2、该选项也可以用于splitChunks.cacheGroups.{cacheGroup}.layer。<br />
     * 3、具体的使用例子见：notes/webpack笔记/splitChunks.layer使用说明.txt
     */
    // layer: null,
    /**
     * 控制生成的每个代码块的最大尺寸。如果某个代码块的大小超过了maxSize设置的值，Webpack会尝试进一步拆分这个代码块，直到每个代码块的大小都小于maxSize。单位是字节。<br />
     * 1、值类型：number、{ [index: string]: number }，默认值：0。<br />
     * <code>
     * maxSize: {
     *   // '...': 1 * 1024 * 1024,
     *   javascript: 1 * 1024 * 1024,
     *   unknown: 1 * 1024 * 1024,
     *   // css: 1 * 1024 * 1024,
     *   // 'css/mini-extract': 1 * 1024 * 1024,
     *   // wasm: 1 * 1024 * 1024,
     *   // webassembly: 1 * 1024 * 1024,
     * },
     * </code>
     * 2、该选项也可用于每个缓存组optimization.splitChunks.cacheGroups[x].maxSize或后备缓存组optimization.splitChunks.fallbackCacheGroup.maxSize 。<br />
     * 3、零件的大小至少为minSize，该算法是确定性的，对模块的更改只会产生局部影响。<br />
     * 4、这样它在使用长期缓存时可用并且不需要记录。maxSize只是一个提示，当模块大于maxSize或拆分会违反minSize时可能会违反。<br />
     * 5、当块已经有名称时，每个部分都会从该名称中获得一个新名称。根据optimization.splitChunks.hidePathInfo的值，它将添加从第一个模块名称或它的哈希派生的键。<br />
     * 6、maxSize选项旨在与HTTP/2和长期缓存一起使用。它增加了请求计数以获得更好的缓存。它还可以用于减小文件大小以加快重建速度。<br />
     * 7、maxInitialRequest/maxAsyncRequests的优先级高于maxSize。实际优先级是：maxSize < maxInitialRequest/maxAsyncRequests < minSize。<br />
     * 8、设置maxSize的值会同时设置maxAsyncSize和maxInitialSize的值。<br />
     * 9、较大的值：如果你希望生成较大的代码块（减少拆分的次数），可以设置一个较大的maxSize。但需要注意，生成的文件过大会影响浏览器缓存和加载性能。<br />
     * 10、较小的值：如果你希望每个代码块都相对较小，可以设置一个较小的maxSize。但要平衡拆分的数量，避免生成过多的小文件。<br />
     */
    maxSize: 1 * 1024 * 1024,
    /**
     * maxAsyncSize和maxSize之间的区别在于maxAsyncSize只会影响按需加载块。<br />
     * 1、值类型：number、{ [index: string]: number }，默认值：0。<br />
     * <code>
     * maxAsyncSize: {
     *   // '...': 1 * 1024 * 1024,
     *   javascript: 1 * 1024 * 1024,
     *   unknown: 1 * 1024 * 1024,
     *   // css: 1 * 1024 * 1024,
     *   // 'css/mini-extract': 1 * 1024 * 1024,
     *   // wasm: 1 * 1024 * 1024,
     *   // webassembly: 1 * 1024 * 1024,
     * },
     * </code>
     * 2、该选项也可以用于：splitChunks.cacheGroups.{cacheGroup}.maxAsyncSize、splitChunks.fallbackCacheGroup.maxAsyncSize。<br />
     */
    // maxAsyncSize: 1 * 1024 * 1024,
    /**
     * maxInitialSize和maxSize的区别在于maxInitialSize只会影响初始加载块。<br />
     * 1、值类型：number、{ [index: string]: number }，默认值：0。<br />
     * <code>
     * maxInitialSize: {
     *   // '...': 1 * 1024 * 1024,
     *   javascript: 1 * 1024 * 1024,
     *   unknown: 1 * 1024 * 1024,
     *   // css: 1 * 1024 * 1024,
     *   // 'css/mini-extract': 1 * 1024 * 1024,
     *   // wasm: 1 * 1024 * 1024,
     *   // webassembly: 1 * 1024 * 1024,
     * },
     * </code>
     * 2、该选项也可以用于：splitChunks.cacheGroups.{cacheGroup}.maxInitialSize、splitChunks.fallbackCacheGroup.maxInitialSize。<br />
     */
    // maxInitialSize: 1 * 1024 * 1024,
    /**
     * 拆分块的名称。提供false将保持块的相同名称，因此它不会不必要地更改名称。这是生产构建的推荐值。<br />
     * 1、提供字符串或函数允许您使用自定义名称。指定一个字符串或一个总是返回相同字符串的函数会将所有常见的模块和供应商合并到一个块中。<br />
     * 2、动态生成名称时，注意不要引入复杂的计算逻辑，否则可能增加打包时间。这可能会导致更大的初始下载并减慢页面加载速度。<br />
     * 3、如果您选择指定一个函数，您可能会发现chunk.name和chunk.hash属性（其中chunk是chunks数组的一个元素）在为您的块选择名称时特别有用。<br />
     * 4、如果splitChunks.name与入口点名称相匹配，入口点chunk和缓存组将合并为一个chunk。<br />
     * 5、该选项也可以用于splitChunks.cacheGroups.{cacheGroup}.name。<br />
     * 6、警告，如果多个cacheGroups使用相同的name值，Webpack会将它们合并为一个代码块。但不建议这样做，因为这样会导致下载更多的代码。<br />
     * 7、值类型：boolean（有效值只有false，表示不指定名称，Webpack会使用默认的命名规则。）、string、Function，<br />
     * <code>
     * commons: {
     *   test: /[\\/]node_modules[\\/]/,
     *   // 这里的cacheGroupKey是作为cacheGroup关键字的“commons”。
     *   // module：当前正在处理的模块对象。chunks：使用该代码的所有代码块的数组。cacheGroupKey：当前缓存组的名称。
     *   name(module, chunks, cacheGroupKey){
     *     const moduleFileName = module.identifier().split('/').reduceRight((item) => item);
     *
     *     const allChunksNames = chunks.map((item) => item.name).join('~');
     *
     *     // 返回类似这样的文件名：commons-main-lodash.js.e7519d2bb8777058fa27.js
     *     return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
     *   },
     *   chunks: 'all',
     * }
     * </code>
     * 8、splitChunks.name仅影响拆分后的chunk名称，与主入口文件的命名规则（由output.filename控制）无关。<br />
     */
    // name: false,
    /**
     * 找出模块使用哪些导出来破坏导出名称，省略未使用的导出并生成更高效的代码。当它为true时：分析每个运行时使用的导出，当它是“global”时：全局分析所有运行时组合的导出。<br />
     * 1、值类型：boolean，默认值：true。<br />
     * 2、该选项也可以用在：splitChunks.cacheGroups{cacheGroup}.usedExports。<br />
     */
    usedExports: true,
    /**
     * 缓存组可以继承和/或覆盖splitChunks.*的任何选项；但是test、priority和reuseExistingChunk只能在缓存组级别进行配置。要禁用任何默认缓存组，请将它们设置为false。<br />
     */
    cacheGroups: ( () => {
      /**
       * 单页模式下的代码拆分策略。
       */
      const SPACacheGroups = {
        VendorsCSS: {
          /**
           * 控制此缓存组选择哪些模块。省略它会选择所有模块。它可以匹配绝对模块资源路径或块名称。当块名称匹配时，块中的所有模块都会被选中。<br />
           * 1、值类型：( module, { chunkGraph, moduleGraph, } ) => boolean、RegExp、string。<br />
           * 2、当选择使用函数作为test选项的值时，函数的第1个参数module有如下参数：<br />
           * module.resource：1个描述模块所在文件在磁盘上的绝对路径字符串。<br />
           * module.type：1个描述模块类型的字符串，如：'javascript/auto'。<br />
           * 3、请注意使用`[\\/]`作为跨平台兼容性的路径分隔符。<br />
           */
          test: /node_modules[\\/].*\.css$/i,
          // 值类型：function、RegExp、string，允许按模块类型将模块分配给缓存组。
          ...( () => {
            return isProduction
                   ? {
                type: 'css/mini-extract',
              }
                   : {};
          } )(),
          name: 'VendorsCSS',
        },

        VendorsJS: ( arr => {
          return {
            test: new RegExp( `node_modules[\\\\/](?!${ arr.join( '|' ) }).*\\.(js)$`, 'i' ),
            name: 'VendorsJS',
          };
        } )( [
          'axios[\\\\/]',
          'echarts[\\\\/]',
          'jquery[\\\\/]',
          'swiper[\\\\/]',
          // 表示所有以“@vue”开头的包名，例如：@vue/reactivity、@vue/runtime-dom、@vue/shared等等。
          '@vue',
          // 表示所有以“vue”开头的包名，例如：vue、vue-router、vuex等等。
          'vue',
          'pinia[\\\\/]',
          'element-ui[\\\\/]',
          'element-plus[\\\\/]',
        ] ),

        VueFamilyJS: ( arr => {
          return {
            test: new RegExp( `node_modules[\\\\/](${ arr.join( '|' ) }).*\\.(js)$`, 'i' ),
            name: 'VueFamilyJS',
          };
        } )( [
          // 表示所有以“@vue”开头的包名，例如：@vue/reactivity、@vue/runtime-dom、@vue/shared等等。
          '@vue',
          // 表示所有以“vue”开头的包名，例如：vue、vue-router、vuex等等。
          'vue',
          'pinia[\\\\/]',
        ] ),

        ElementUIJS: ( arr => {
          return {
            test: new RegExp( `node_modules[\\\\/](${ arr.map( item => item + '[\\\\/]' ).join( '|' ) }).*\\.(js)$`, 'i' ),
            name: 'ElementUIJS',
          };
        } )( [
          'element-ui',
        ] ),

        ElementPlusJS: ( arr => {
          return {
            test: new RegExp( `node_modules[\\\\/](${ arr.map( item => item + '[\\\\/]' ).join( '|' ) }).*\\.(js)$`, 'i' ),
            name: 'ElementPlusJS',
          };
        } )( [
          'element-plus',
        ] ),

        Vendors001JS: ( arr => {
          return {
            test: new RegExp( `node_modules[\\\\/](${ arr.map( item => item + '[\\\\/]' ).join( '|' ) }).*\\.(js)$`, 'i' ),
            name: 'Vendors001JS',
          };
        } )( [
          'axios',
          'jquery',
          'swiper',
        ] ),

        EchartsJS: {
          test: /node_modules[\\/]echarts[\\/].*\.(js)$/i,
          name: 'EchartsJS',
        },
      };

      /**
       * 多页模式下的代码拆分策略。
       */
      const MPACacheGroups = {
        VendorsCSS: ( arr => {
          return {
            /**
             * 控制此缓存组选择哪些模块。省略它会选择所有模块。它可以匹配绝对模块资源路径或块名称。当块名称匹配时，块中的所有模块都会被选中。<br />
             * 1、值类型：( module, { chunkGraph, moduleGraph, } ) => boolean、RegExp、string。<br />
             * 2、当选择使用函数作为test选项的值时，函数的第1个参数module有如下参数：<br />
             * module.resource：1个描述模块所在文件在磁盘上的绝对路径字符串。<br />
             * module.type：1个描述模块类型的字符串，如：'javascript/auto'。<br />
             * 3、请注意使用`[\\/]`作为跨平台兼容性的路径分隔符。<br />
             */
            test: new RegExp( `node_modules[\\\\/](?!${ arr.map( item => item + '[\\\\/]' ).join( '|' ) }).*\\.css$`, 'i' ),
            // 值类型：function、RegExp、string，允许按模块类型将模块分配给缓存组。
            ...( () => {
              return isProduction
                     ? {
                  type: 'css/mini-extract',
                }
                     : {};
            } )(),
            name: 'VendorsCSS',
          };
        } )( [
          'swiper',
          'element-ui',
          'element-plus',
        ] ),

        SwiperCSS: {
          test: /node_modules[\\/]swiper[\\/].*\.css$/i,
          ...( () => {
            return isProduction
                   ? {
                type: 'css/mini-extract',
              }
                   : {};
          } )(),
          name: 'SwiperCSS',
        },
        ELEMENTCSS: {
          test: /node_modules[\\/]element-ui[\\/].*\.css$/i,
          ...( () => {
            return isProduction
                   ? {
                type: 'css/mini-extract',
              }
                   : {};
          } )(),
          name: 'ELEMENTCSS',
        },
        ElementPlusCSS: {
          test: /node_modules[\\/]element-plus[\\/].*\.css$/i,
          ...( () => {
            return isProduction
                   ? {
                type: 'css/mini-extract',
              }
                   : {};
          } )(),
          name: 'ElementPlusCSS',
        },

        VendorsJS: ( arr => {
          return {
            test: new RegExp( `node_modules[\\\\/](?!${ arr.join( '|' ) }).*\\.(js)$`, 'i' ),
            name: 'VendorsJS',
          };
        } )( [
          'axios[\\\\/]',
          'echarts[\\\\/]',
          'jquery[\\\\/]',
          'swiper[\\\\/]',
          // 表示所有以“@vue”开头的包名，例如：@vue/reactivity、@vue/runtime-dom、@vue/shared等等。
          '@vue',
          // 表示所有以“vue”开头的包名，例如：vue、vue-router、vuex等等。
          'vue',
          'pinia[\\\\/]',
          'element-ui[\\\\/]',
          'element-plus[\\\\/]',
        ] ),

        VueFamilyJS: ( arr => {
          return {
            test: new RegExp( `node_modules[\\\\/](${ arr.join( '|' ) }).*\\.(js)$`, 'i' ),
            name: 'VueFamilyJS',
          };
        } )( [
          // 表示所有以“@vue”开头的包名，例如：@vue/reactivity、@vue/runtime-dom、@vue/shared等等。
          '@vue',
          // 表示所有以“vue”开头的包名，例如：vue、vue-router、vuex等等。
          'vue',
          'pinia[\\\\/]',
        ] ),

        ELEMENTJS: {
          test: /node_modules[\\/]element-ui[\\/].*\.(js)$/i,
          name: 'ELEMENTJS',
        },
        ElementPlusJS: {
          test: /node_modules[\\/]element-plus[\\/].*\.(js)$/i,
          name: 'ElementPlusJS',
        },

        AxiosJS: {
          test: /node_modules[\\/]axios[\\/].*\.(js)$/i,
          name: 'AxiosJS',
        },
        jQueryJS: {
          test: /node_modules[\\/]jquery[\\/].*\.(js)$/i,
          name: 'jQueryJS',
        },
        SwiperJS: {
          test: /node_modules[\\/]swiper[\\/].*\.(js)$/i,
          name: 'SwiperJS',
        },

        EchartsJS: {
          test: /node_modules[\\/]echarts[\\/].*\.(js)$/i,
          name: 'EchartsJS',
        },
      };

      Object.entries( SPACacheGroups ).forEach( ( item, i, ) => {
        // 选项决定了哪些缓存组应该优先拆分，尤其在多个缓存组都匹配到同一个模块时，可以指定哪个缓存组更优先处理该模块。自定义缓存组中该值默认值为0，默认缓存组该值为-20。
        item[ 1 ].priority = 100000000 - i;
        // 告诉webpack忽略splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项，并始终为此缓存组创建块。并且使enforceSizeThreshold设置生效。
        item[ 1 ].enforce = true;
        /**
         * 1、如果设置为true，Webpack会尝试复用已经存在的chunk，而不是重新创建一个新的chunk。这样可以减少冗余的chunk文件，优化最终的输出。<br />
         * 2、设置为false（默认值），Webpack会为每个匹配的模块生成一个新的chunk，而不是复用现有的chunk。<br />
         *
         * @type {boolean}
         */
        item[ 1 ].reuseExistingChunk = true;
      } );
      Object.entries( MPACacheGroups ).forEach( ( item, i, ) => {
        // 选项决定了哪些缓存组应该优先拆分，尤其在多个缓存组都匹配到同一个模块时，可以指定哪个缓存组更优先处理该模块。自定义缓存组中该值默认值为0，默认缓存组该值为-20。
        item[ 1 ].priority = 100000000 - i;
        // 告诉webpack忽略splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项，并始终为此缓存组创建块。并且使enforceSizeThreshold设置生效。
        item[ 1 ].enforce = true;
        /**
         * 1、如果设置为true，Webpack会尝试复用已经存在的chunk，而不是重新创建一个新的chunk。这样可以减少冗余的chunk文件，优化最终的输出。<br />
         * 2、设置为false（默认值），Webpack会为每个匹配的模块生成一个新的chunk，而不是复用现有的chunk。<br />
         *
         * @type {boolean}
         */
        item[ 1 ].reuseExistingChunk = true;
      } );

      return isSPA
             ? SPACacheGroups
             : MPACacheGroups;
    } )(),
  };

// 以下一共会生成34个node子进程。
/**
 * 1、将此装载机放在其他装载机的前面，use: [ 'thread-loader', 'babel-loader' ]。<br />
 * 2、在工作池中运行的加载程序是有限的：<br />
 * 加载器不能发出文件。<br />
 * 加载器不能使用自定义加载器API（即通过插件）。<br />
 * 加载器无法访问webpack选项。<br />
 * 3、每个工作人员都是一个单独的node.js进程，其开销约为600毫秒。还有进程间通信的开销。<br />
 * 4、仅将此装载机用于昂贵的操作！<br />
 */
/*
 const jsWorkerPoolConfig = {
 // 生成的工作人员的数量。
 workers: 4,
 // 工作人员并行处理的作业数。
 workerParallelJobs: 20,
 // 其他的node.js参数
 /!*
 workerNodeArgs: [
 // 单位为MB，本来想通过代码来动态的根据本机空闲内存来设置，但是不知为何会报错，只能写死设置。
 `--max-old-space-size=${ 1 * 1024 }`,
 ],
 *!/
 // 允许重新启动一个已死亡的工作线程池。重新启动会减慢整个编译过程，在开发时应设置为false。
 poolRespawn: isProduction,
 // 空闲默认值为500（ms）时终止工作进程的超时，可以设置为Infinity无穷大，以便监视生成以保持工作进程的活动性。Infinity：可用于开发模式，600000ms也就是10分钟。
 poolTimeout: isProduction
 ? 1000
 : Infinity,
 // 调查分配给工人的工作数量默认为200个，减少了效率较低但更公平的分配。
 poolParallelJobs: 200,
 // 池的名称可用于创建具有其他相同选项的不同池。
 name: 'jsWorkerPoolConfig',
 },
 jsxWorkerPoolConfig = Object.assign( {}, jsWorkerPoolConfig, {
 workers: 6,
 name: 'jsxWorkerPoolConfig',
 } ),
 tsWorkerPoolConfig = Object.assign( {}, jsWorkerPoolConfig, {
 workers: 6,
 name: 'tsWorkerPoolConfig',
 } ),
 cssWorkerPoolConfig = Object.assign( {}, jsWorkerPoolConfig, {
 workers: 3,
 name: 'cssWorkerPoolConfig',
 } ),
 lessWorkerPoolConfig = Object.assign( {}, jsWorkerPoolConfig, {
 workers: 4,
 name: 'lessWorkerPoolConfig',
 } ),
 sassWorkerPoolConfig = Object.assign( {}, jsWorkerPoolConfig, {
 workers: 4,
 name: 'sassWorkerPoolConfig',
 } ),
 stylusWorkerPoolConfig = Object.assign( {}, jsWorkerPoolConfig, {
 workers: 4,
 name: 'stylusWorkerPoolConfig',
 } ),
 vueWorkerPoolConfig = Object.assign( {}, jsWorkerPoolConfig, {
 workers: 3,
 name: 'vueWorkerPoolConfig',
 } );
 */

/**
 * 预热：<br />
 * 1、为了防止启动工作程序时的高延迟，可以预热工作程序池。<br />
 * 2、这会启动池中最大数量的工作人员并将指定的模块加载到node.js模块缓存中。<br />
 * 3、池选项（如传递给加载程序选项）必须与加载程序选项匹配才能引导正确的池。<br />
 * 4、当使用esbuild-loader来处理脚本文件时，就不要预热这3个配置。<br />
 */
/*
 if( !isUseESBuildLoader ){
 ThreadLoader.warmup( jsWorkerPoolConfig, [
 'babel-loader',
 '@babel/preset-env',
 ] );
 ThreadLoader.warmup( jsxWorkerPoolConfig, [
 'babel-loader',
 '@babel/preset-env',
 '@babel/preset-react',
 ] );
 ThreadLoader.warmup( tsWorkerPoolConfig, [
 'ts-loader',
 'babel-loader',
 '@babel/preset-env',
 ] );
 }
 */

/**
 * 预热：<br />
 * 1、为了防止启动工作程序时的高延迟，可以预热工作程序池。<br />
 * 2、这会启动池中最大数量的工作人员并将指定的模块加载到node.js模块缓存中。<br />
 * 3、池选项（如传递给加载程序选项）必须与加载程序选项匹配才能引导正确的池。<br />
 */

/*
 ThreadLoader.warmup( cssWorkerPoolConfig, [
 'postcss-loader',
 'css-loader',
 'style-loader',
 ] );
 ThreadLoader.warmup( lessWorkerPoolConfig, [
 'less-loader',
 'postcss-loader',
 'css-loader',
 'style-loader',
 ] );
 ThreadLoader.warmup( sassWorkerPoolConfig, [
 'sass-loader',
 'postcss-loader',
 'css-loader',
 'style-loader',
 ] );
 ThreadLoader.warmup( stylusWorkerPoolConfig, [
 'stylus-loader',
 'postcss-loader',
 'css-loader',
 'style-loader',
 ] );
 ThreadLoader.warmup( vueWorkerPoolConfig, [
 'vue-loader',
 ] );
 */

/**
 * 返回传入时间对象的年、月、日、时、分、秒、周几（当为周日的时候返回的是字符串“日”，其他星期则是数字）。<br />
 *
 * @param {Date} nowDate 一个时间对象，默认值（当前时间）：new Date( Date.now() )，可选。<br />
 *
 * @returns {{year: string, month: string, date: string, hours: string, minutes: string, seconds: string, day: string}} year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周几（当为周日的时候返回的是字符串“日”，其他星期则是数字）。
 */
function DateHandle( nowDate = new Date( Date.now() ) ){
  const year = String( nowDate.getFullYear() ),
    month = String( nowDate.getMonth() + 1 ).padStart( 2, '0' ),
    date = String( nowDate.getDate() ).padStart( 2, '0' ),
    hours = String( nowDate.getHours() ).padStart( 2, '0' ),
    minutes = String( nowDate.getMinutes() ).padStart( 2, '0' ),
    seconds = String( nowDate.getSeconds() ).padStart( 2, '0' ),
    day0 = Number( nowDate.getDay() ),
    day = String( day0 === 0
                  ? '日'
                  : day0 );

  return {
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    day,
  };
}

let logWriteStream = null;

if( !isProduction ){
  const {
      year,
      month,
      date,
      hours,
      minutes,
      seconds,
      day,
    } = DateHandle(),
    logFileName = `webpack_dev_server_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒(周${ day }).log`;

  logWriteStream = await CreateLogger( join( __dirname, `./log/${ env_platform }/${ logFileName }` ) );
}

/**
 * 设置路径别名。<br />
 * 1、resolve.alias优先于其他模块解析。<br />
 * 2、路径别名到底是路径别名，别用于直接指向具体的文件，尤其是JS文件，因为会导致无法根据导入语法的不同自行加载到相应的模块文件，致使报错；但是CSS一类的文件倒是可以直接指向到具体的文件。<br />
 * 3、为第三方包设置别名时，只能是以包名开始，其他任何都不行，因为webpack会自动从“node_modules”中查找，包括：“./”、“./node_modules/”、“node_modules/”等等都是不行的，当然如果是指向自己的模块文件夹，那还是要指定完整路径。<br />
 * 4、也可以指定完整路径：xxx: path.resolve(path.join(__dirname, 'src/module1'))。<br />
 * 5、path.resolve和path.join的区别在于：<br />
 * 例如：<br />
 * path.resolve( __dirname, './src/assets/' )，最后解析成：G:\WebStormWS\upload-for-multiple\src\assets
 * path.join( __dirname, './src/assets/' )，最后解析成：G:\WebStormWS\upload-for-multiple\src\assets\
 * 有或是没有最后的“\”在具体应用时很重要！不然容易出现不如你所愿的现象。<br />
 * 6、当设置文件夹的路径别名时，用path.resolve设置时，其值包不包含最后的“/”都没关系，因为最后生成的路径（如：G:\WebStormWS\upload-for-multiple\src\assets）最尾部都不会包含“\”。<br />
 * 7、当设置文件夹的路径别名时，用path.join设置时，其值如果包含最后的“/”，则最后生成的路径（如：G:\WebStormWS\upload-for-multiple\src\assets\）最尾部就会包含“\”，反之不会。<br />
 * 8、设置文件夹的路径别名时，建议使用path.resolve，这样在后续使用路径别名时，就可以按正常的习惯使用：import JSONDemo001 from 'jsonDir/Demo001.json';<br />
 *
 * @type {object}
 */
const aliasConfig = {
    'element-ui-css$': 'element-ui/lib/theme-chalk/index.css',
    'element-plus-css$': 'element-plus/dist/index.css',
    'swiper-css$': 'swiper/swiper-bundle.min.css',

    // assets文件夹 Start
    assetsDir: resolve( __dirname, './src/assets/' ),

    docDir: resolve( __dirname, './src/assets/doc/' ),

    csonDir: resolve( __dirname, './src/assets/doc/cson/' ),
    csvDir: resolve( __dirname, './src/assets/doc/csv/' ),
    jsonDir: resolve( __dirname, './src/assets/doc/json/' ),
    json5Dir: resolve( __dirname, './src/assets/doc/json5/' ),
    tomlDir: resolve( __dirname, './src/assets/doc/toml/' ),
    tsvDir: resolve( __dirname, './src/assets/doc/tsv/' ),
    txtDir: resolve( __dirname, './src/assets/doc/txt/' ),
    xmlDir: resolve( __dirname, './src/assets/doc/xml/' ),
    yamlDir: resolve( __dirname, './src/assets/doc/yaml/' ),

    fontsDir: resolve( __dirname, './src/assets/fonts/' ),
    imgDir: resolve( __dirname, './src/assets/img/' ),
    musicDir: resolve( __dirname, './src/assets/music/' ),
    videosDir: resolve( __dirname, './src/assets/videos/' ),
    // assets文件夹 End

    componentsDir: resolve( __dirname, './src/components/' ),

    gQLAPIDir: resolve( __dirname, './src/graphQL/api/' ),

    nativeComponentsDir: resolve( __dirname, './src/native_components/' ),

    pagesDir: resolve( __dirname, './src/pages/' ),

    pwaManifestDir: resolve( __dirname, './src/pwa_manifest/' ),

    // styles文件夹 Start
    stylesDir: resolve( __dirname, './src/styles/' ),

    cssDir: resolve( __dirname, './src/styles/css/' ),
    lessDir: resolve( __dirname, './src/styles/less/' ),
    postcssDir: resolve( __dirname, './src/styles/postcss/' ),
    sassDir: resolve( __dirname, './src/styles/sass/' ),
    scssDir: resolve( __dirname, './src/styles/scss/' ),
    stylusDir: resolve( __dirname, './src/styles/stylus/' ),
    // styles文件夹 End

    // template文件夹 Start
    templateDir: resolve( __dirname, './src/template/' ),

    ejsDir: resolve( __dirname, './src/template/ejs/' ),
    handlebarsDir: resolve( __dirname, './src/template/handlebars/' ),
    htmlDir: resolve( __dirname, './src/template/html/' ),
    markdownDir: resolve( __dirname, './src/template/markdown/' ),
    mustacheDir: resolve( __dirname, './src/template/mustache/' ),
    pug_jadeDir: resolve( __dirname, './src/template/pug_jade/' ),
    // template文件夹 End

    // tools文件夹 Start
    toolsDir: resolve( __dirname, './src/tools/' ),

    jsDir: resolve( __dirname, './src/tools/js/' ),
    tsDir: resolve( __dirname, './src/tools/ts/' ),

    currency_toolsDir: resolve( __dirname, './src/tools/js/currency_tools/' ),
    universal_toolsDir: resolve( __dirname, './src/tools/ts/universal_tools/' ),
    // tools文件夹 End

    wasmDir: resolve( __dirname, './src/wasm/build/' ),

    webComponentsDir: resolve( __dirname, './src/web_components/' ),

    // workers文件夹 Start
    workersDir: resolve( __dirname, './src/workers/' ),

    serviceWorkersDir: resolve( __dirname, './src/workers/service_workers/' ),
    sharedWorkersDir: resolve( __dirname, './src/workers/shared_workers/' ),
    workersToolsDir: resolve( __dirname, './src/workers/tools/' ),
    webWorkersDir: resolve( __dirname, './src/workers/web_workers/' ),
    // workers文件夹 End

    'GSD2TSTD$': resolve( __dirname, './src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts' ),
    'MF_v2_RuntimeAPI$': resolve( __dirname, './src/ModuleFederation_v2_RuntimeAPI.esm.mts' ),
  },
  /**
   * @type {object}
   */
  assetsWebpackPluginConfig = {
    filename: 'webpack_assets_manifest.json',
    processOutput( assets ){
      return JSON.stringify( assets );
    },
    includeManifest: false,
    fullPath: true,
    /**
     * 如果为true，则完整路径将自动去除webpack生成的/auto/前缀。默认值是false。<br />
     * 1、因为output.publicPath设置的值为'auto'，所以该选项设置为false时，生成的ProjectAllAssetsByWebpack.json文件里的各个文件路径会打头带auto。<br />
     */
    removeFullPathAutoPrefix: true,
    // 对资产输出进行排序，以便清单是第一个条目。这对于从资产json输出生成脚本标签的情况很有用，并且导入顺序很重要。
    manifestFirst: true,
    path: join( __dirname, `./dist/${ env_platform }/` ),
    useCompilerPath: false,
    prettyPrint: !isProduction,
    update: false,
    includeAllFileTypes: true,
    keepInMemory: !isProduction,
    integrity: isProduction,
    entrypoints: true,
    // 启用该选项需要依赖entrypoints选项的值为true才能生效，否则会报错！
    includeFilesWithoutChunk: true,
    // 启用该选项需要依赖entrypoints选项的值为true才能生效，否则会报错！
    includeAuxiliaryAssets: true,
    // 启用该选项需要依赖entrypoints选项的值为true才能生效，否则会报错！
    includeDynamicImportedAssets: true,
    metadata: {
      display: 'webpack_assets_manifest',
      version: '8.0.0',
      date: ( () => {
        const {
          year,
          month,
          date,
          hours,
          minutes,
          seconds,
        } = DateHandle();

        return `${ year }_${ month }_${ date }_${ hours }_${ minutes }_${ seconds }`;
      } )(),
    },
  },
  /**
   * 缓存生成的webpack模块和块以提高构建速度，开发启用，生产禁用。<br />
   * 1、true：启用内存缓存（等同于cache: { type: 'memory' }）；false：禁用内存缓存。<br />
   * 2、将cache.type设置为'filesystem'会打开更多配置选项。<br />
   * 3、将cache.type设置为'memory'，它告诉webpack将缓存存储在内存中，并且只允许几个其他配置！<br />
   * 4、cache.type设置为'memory'时，可以配合使用的部分选项说明：<br />
   * cacheUnaffected：启用版本5.54.0+，缓存未更改的模块的计算并仅引用未更改的模块。它只能与cache.type设置为'memory'一起使用，此外，必须启用experiments.cacheUnaffected才能使用它。<br />
   * maxGenerations：启用版本5.30.0+，定义内存缓存中未使用的缓存条目的寿命，它只能与cache.type设置为'memory'一起使用，cache.maxGenerations: 1，缓存条目在未用于单个编译后被删除；cache.maxGenerations: Infinity，缓存条目被永久保存。<br />
   *
   * @type {{cacheUnaffected: boolean, maxGenerations: number, type: string}}
   */
  cacheConfig = {
    type: 'memory',
    cacheUnaffected: false,
    maxGenerations: Infinity,
  },
  /**
   * 默认情况下，此插件将在每次成功重建后删除webpack的output.path目录中的所有文件，以及所有未使用的webpack资产。<br />
   *
   * @type {object}
   */
  cleanWebpackPluginConfig = {
    // 模拟删除文件的操作，true开启，开启后，不会真的删除硬盘上的文件。<br />
    dry: false,
    // 将日志写入控制台，true开启，当dry开启时，这个选项总是开启的。<br />
    verbose: false,
    /**
     * 在重建时自动删除所有未使用的webpack资产，true开启，默认值是true。<br />
     * 1、告诉CleanWebpackPlugin我们不想在watch触发增量构建后删除index.html文件，我们使用cleanStaleWebpackAssets选项执行此操作：cleanStaleWebpackAssets: false。<br />
     */
    cleanStaleWebpackAssets: isProduction,
    // 不允许删除当前的webpack资产，true开启。<br />
    protectWebpackAssets: false,
    /**
     * 在Webpack编译之前删除一次未包含在重建中的文件（观看模式）。<br />
     * 1、值为空数组时，表示禁用“cleanOnceBeforeBuildPatterns”的功能。<br />
     * 2、!test，表示排除test文件。<br />
     * 3、如果在webpack的output.path目录之外，请使用完整路径：path.join。<br />
     * 4、相对于webpack的output.path目录。<br />
     */
    // 如：'**/*', '!static-files*'。<br />
    cleanOnceBeforeBuildPatterns: [
      '**/*',
      '!webpack_assets_manifest.js',
      '!webpack_assets_manifest.json',
      '!webpack_assets_manifest.json5',
    ],
    /**
     * 在每次构建（包括监视模式）后删除与此模式匹配的文件，用于不是由Webpack直接创建的文件。<br />
     * 1、如：'static*.*', '!static1.js'。<br />
     * 2、空数组表示什么都不干。<br />
     */
    cleanAfterEveryBuildPatterns: [],
    // 允许process.cwd()之外的干净模式，需要明确设置干选项，true表示开启，开启后会删除匹配到的项目之外的文件，这个千万谨慎！<br />
    dangerouslyAllowCleanPatternsOutsideProject: false,
  },
  /**
   * copy-webpack-plugin并非旨在复制从构建过程中生成的文件；相反，它是复制源树中已经存在的文件，作为构建过程的一部分。<br />
   * 1、如果啥都没有复制到，会报错，所以至少得复制到一个，当然被排除的不算。<br />
   *
   * @type {object}
   */
  copyPluginConfig = ( patternsArr => {
    const arr1 = [],
      ignoreArr = [
        '**/.gitignore',
        '**/*.gitignore',
        '**/该文件夹说明.txt',
      ];

    patternsArr.forEach( item => {
      arr1.push( Object.assign( {}, {
        context: './src/',
        globOptions: {
          expandDirectories: true,
          gitignore: true,
          // 设置了这个，会奇怪的导致被排除文件的同层文件也被过滤。
          // ignoreFiles: ignoreArr,
          concurrency: cpus().length - 1,
          cwd: resolve( __dirname, './' ),
          deep: Infinity,
          followSymbolicLinks: true,
          ignore: ignoreArr,
          suppressErrors: false,
          throwErrorOnBrokenSymbolicLink: true,
          caseSensitiveMatch: false,
          dot: true,
        },
        toType: 'dir',
        force: true,
        transform: {
          cache: true,
        },
        noErrorOnMissing: false,
      }, item ) );
    } );

    return {
      patterns: arr1,
      options: {
        // 限制对fs的同时请求数，默认100。
        concurrency: 10000,
      },
    };
  } )( [
    {
      // 复制src文件夹下的static文件夹。
      from: 'static/**/*',
      // 将上面复制的文件夹复制到output.path下。
      to: './',
    },
    {
      // 从项目的根目录下复制favicon.ico。
      from: 'favicon.ico',
      // 将上面复制的文件夹复制到output.path下。
      to: './favicon.ico',
      context: './',
      toType: 'file',
    },
  ] ),
  /**
   * DefinePlugin在编译时用其他值或表达式替换代码中的变量。这对于允许开发构建和生产构建之间的不同行为很有用。<br />
   * 1、传递给DefinePlugin的每个键都是一个标识符或多个用.连接的标识符：'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)。<br />
   * 2、如果该值是一个字符串，它将被用作代码片段：TWO: '1+1'。<br />
   * 3、如果值不是字符串，它将被字符串化（包括函数）。<br />
   * 4、如果你在key前加上typeof前缀，它只为typeof调用定义：'typeof window': JSON.stringify('object111')。<br />
   * 5、如果需要定义一个值是字符串值，得单引号内部嵌套双引号，如：'"例子"'（或者JSON.stringify('例子')），否则没法真正输出这个字符串。<br />
   * 6、如果值不是字符串，它将被字符串化，相当于使用JSON.stringify处理，但是如果是函数，直接这么设置就行，别用JSON.stringify：'fun1': () => {}。<br />
   *
   * @type {object}
   */
  definePluginConfig = DefinePluginConfig( {
    env_platform,
    isProduction,
  } ),
  /**
   * @type {{maxLength: number}}
   */
  deterministicChunkIdsPluginConfig = {
    maxLength: 12,
  },
  /**
   * @type {{maxLength: number}}
   */
  deterministicModuleIdsPluginConfig = {
    maxLength: 12,
  },
  /**
   * 这组选项由webpack-dev-server获取，可用于以各种方式更改其行为。<br />
   * 1、如果您通过Node.js API使用dev-server，则devServer中的选项将被忽略。<br />
   * 2、使用WebpackDevServer时不能使用第2个编译器参数（系一个回调函数）。<br />
   * 3、请注意，在导出多个配置时，只会考虑第一个配置的devServer选项并将其用于阵列中的所有配置。<br />
   * 4、如果您遇到问题，导航到/webpack-dev-server路由将显示文件的提供位置。例如，http://localhost:9000/webpack-dev-server。<br />
   * 5、如果你想手动重新编译包，导航到/invalidate路由将使包的当前编译无效，并通过webpack-dev-middleware为你重新编译它。根据您的配置，该URL可能类似于http://localhost:9000/invalidate。<br />
   * 6、提供捆绑包需要“HTML模板”，通常是index.html文件。确保将脚本引用添加到HTML中，webpack-dev-server不会自动注入它们。<br />
   * 7、选项说明：<br />
   * {<br />
   * allowedHosts：此选项允许您将允许访问开发服务器的服务列入白名单。<br />
   * 1、有效值类型有2种：string、[ string ]。<br />
   *   1)当为string时，只有2个有效值："auto"（默认值）、"all"。<br />
   *   当设置为“all”时，此选项会绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到DNS重新绑定攻击。<br />
   *   当设置为'auto'时，此选项始终允许localhost、host和client.webSocketURL.hostname。<br />
   *   2)当为[ string ]时，值例子：[ 'host.com', 'subdomain.host.com', 'subdomain2.host.com', 'host2.com', ]。<br />
   *   模仿Django的ALLOWED_HOSTS，一个以.开头的值。可以用作子域通配符。.host.com将匹配host.com、www.host.com和host.com的任何其他子域。 <br />
   *
   * bonjour：此选项在启动时通过ZeroConf网络广播服务器。<br />
   * 1、有效值类型有2种：boolean（true表示启用，false表示禁用）、object。<br />
   *
   * client：允许在浏览器中为客户端脚本指定选项或禁用客户端脚本。<br />
   * 1、有效值类型有2种：boolean（只有一个有效可用的false用来表示禁用，true会报错！）、object。<br />
   * 2、当为object时，其选项如下：<br />
   *   {<br />
   *   logging：允许在浏览器中设置日志级别，例如在重新加载之前、发生错误之前或启用热模块更换时。<br />
   *   有效值：'log'、'info'、'warn'、'error'、'none'、'verbose'。<br />
   *
   *   overlay：当出现编译器错误或警告时，在浏览器中显示全屏覆盖。<br />
   *     1)值类型有：boolean（true表示启用，false表示禁用）、object。<br />
   *     2)当为object时，选项如下：<br />
   *     {<br />
   *     errors：boolean，当出现编译器错误时，在浏览器中启用全屏覆盖。<br />
   *
   *     warnings：boolean，当出现编译器警告时，在浏览器中启用全屏覆盖。<br />
   *
   *     trustedTypesPolicyName：string，覆盖的受信任类型策略的名称。默认为“webpack-dev-server#overlay”。<br />
   *     }<br />
   *
   *   progress：在浏览器中以百分比形式打印编译进度。<br />
   *
   *   reconnect：告诉dev-server它应该尝试重新连接客户端的次数。如果为true，它将尝试无限次重新连接。<br />
   *   值类型有：boolean（true，它将尝试无限次重新连接，false表示告诉开发人员服务器不要尝试重新连接客户端），number（指定尝试重新连接客户端的次数，最小值为0）。<br />
   *
   *   webSocketTransport：此选项允许我们为客户端单独选择当前的devServer传输模式或提供自定义客户端实现。这允许指定浏览器或其他客户端如何与devServer通信。<br />
   *     1）允许设置自定义web socket传输以与开发人员服务器通信。<br />
   *     2）值类型为string，其中有2个预设值：sockjs、ws。<br />
   *     3）为devServer.webSocketServer提供'ws'、'sockjs'是将devServer.client.webSocketTransport和devServer.webSocketServer设置为给定值的快捷方式。<br />
   *     4）在提供自定义客户端和服务器实现时，请确保它们相互兼容以成功通信。<br />
   *     5）要创建自定义客户端实现，请创建一个扩展BaseClient的类。<br />
   *     6）使用CustomClient.js的路径，自定义WebSocket客户端实现，以及兼容的“ws”服务器：<br />
   *     devServer: {
   *     client: {
   *       webSocketTransport: require.resolve('./CustomClient'),
   *     },
   *     webSocketServer: 'ws',
   *     }
   *     7）使用自定义、兼容的WebSocket客户端和服务器实现：<br />
   *     devServer: {
   *     client: {
   *       webSocketTransport: require.resolve('./CustomClient'),
   *     },
   *     webSocketServer: require.resolve('./CustomServer'),
   *     }
   *
   *   webSocketURL：此选项允许指Web套接字服务器的URL（当您代理开发服务器并且客户端脚本并不总是知道连接到哪里时很有用）。<br />
   *     1)有效值类型有2种：string（如：'ws://0.0.0.0:8080/ws'）、object。<br />
   *     2)为object时，有如下选项：<br />
   *     {<br />
   *     hostname: string（值如：'0.0.0.0'），告诉连接到devServer的客户端使用提供的主机名。<br />
   *     pathname: string（值如：'/ws'），告诉连接到devServer的客户端使用提供的path进行连接。<br />
   *     password: string，告诉连接到devServer的客户端使用提供的密码进行身份验证。<br />
   *     port: number（值如：8080）、string，告诉连接到devServer的客户端使用提供的端口。<br />
   *     protocol: string（有一个预设值：'auto'，其他值如：'ws'），告诉连接到devServer的客户端使用提供的协议。<br />
   *     username: string，告诉连接到devServer的客户端使用提供的用户名进行身份验证。<br />
   *     }<br />
   *     3)要从浏览器获取“protocol/hostname/port”，请使用 webSocketURL：'auto://0.0.0.0:0/ws'。
   *   }<br />
   *
   * compress：为服务启用gzip压缩（true表示为所有服务启用gzip压缩，false表示禁用所有服务的gzip压缩）。<br />
   *
   * devMiddleware：为处理webpack资产的webpack-dev-middleware提供选项。<br />
   * 其中的选项有：<br />
   * {<br />
   * headers：允许在每个请求上传递自定义HTTP标头。<br />
   * 1、有效值类型：Array[ Object ]、Object、Function，默认值系undefined：<br />
   *   1)当值类型为：Array[ Object ]时，形如：<br />
   *   headers: [ { key: "X-custom-header", value: "foo" }, ]
   *   2)当值类型为：Object时，形如：<br />
   *   { "X-Custom-Header": "yes", }
   *   3)当值类型为：Function时，形如：<br />
   *   第1种：headers: () => ( { "Last-Modified": new Date(), } )
   *   第2种：headers: (req, res, context) => {
   *     res.setHeader( "Last-Modified", new Date() );
   *   }
   *   第3种：headers: () => [ { key: "X-custom-header", value: "foo" }, ]
   *
   * index：允许提供目录索引。<br />
   * 1、如果为false（但不是undefined），服务器将不会响应对根URL的请求。<br />
   * 2、有效值类型：Boolean、String，默认值系index.html：<br />
   *
   * methods：允许传递中间件接受的HTTP请求方法列表。<br />
   * 1、有效值类型：Array，默认值：[ 'GET', 'HEAD' ]。<br />
   * 2、到目前为止的9种HTTP请求方法：<br />
   * GET：GET方法请求指定资源的表示。使用GET的请求应该只检索数据。<br />
   * HEAD：HEAD方法请求与GET请求相同的响应，但没有响应主体。<br />
   * POST：POST方法将实体提交到指定的资源，通常会导致状态更改或对服务器产生副作用。<br />
   * PUT：PUT方法将目标资源的所有当前表示替换为请求有效负载。<br />
   * DELETE：DELETE方法删除指定的资源。<br />
   * CONNECT：CONNECT方法建立到由目标资源标识的服务器的隧道。<br />
   * OPTIONS：OPTIONS方法描述了目标资源的通信选项。<br />
   * TRACE：TRACE方法沿到目标资源的路径执行消息环回测试。<br />
   * PATCH：PATCH方法将部分修改应用于资源。<br />
   *
   * mimeTypes：允许注册自定义mime类型或扩展映射。<br />
   * 1、有效值类型：Object，默认值为undefined，值形如：mimeTypes: { phtml: 'text/html' }。<br />
   *
   * outputFileSystem：设置webpack将使用的默认文件系统作为生成文件的主要目标。<br />
   * 1、有效值类型：Object，默认值为memfs。<br />
   * 2、设置webpack将使用的默认文件系统作为生成文件的主要目标。此选项不受writeToDisk选项的影响。<br />
   * 3、您必须手动为outputFileSystem实例提供.join()和mkdirp方法，以便与webpack@4兼容。<br />
   *
   * publicPath：中间件绑定的公共路径，指定在浏览器中引用时输出文件的公共URL地址。<br />
   * 1、有效值类型：String、Function，默认值取webpack配置中的output.publicPath。<br />
   * 2、当值类型为String时，有1个预置值：auto。<br />
   * 3、当设置值为如'/XXX1'时，浏览器请求的资源URL就得如：http://localhost:8100/XXX1/js/a.js、http://localhost:8100/XXX1/html/a.html。<br />
   * 4、这个值设置需要注意，'./'、'../'这种尤其注意！并不会都如期望的那样。<br />
   *
   * serverSideRender：指示模块启用或禁用服务器端渲染模式。<br />
   * 1、有效值类型：Boolean，默认值为undefined。<br />
   *
   * stats：stats选项对象或预设名称，默认值取webpack配置中的stats选项的值。<br />
   *
   * writeToDisk：指示模块将文件写入webpack配置中指定的磁盘上配置的位置。<br />
   * 1、有效值类型：Boolean、Function，默认值为false。<br />
   * 2、如果为true，该选项将指示模块将文件写入磁盘上的配置位置，如webpack配置文件中指定的那样。<br />
   * 3、设置writeToDisk: true不会改变webpack-dev-middleware的行为，并且通过浏览器访问的捆绑文件仍然会从内存中提供。此选项提供与WriteFilePlugin相同的功能。<br />
   * 4、此选项还接受一个Function值，该值可用于过滤哪些文件写入磁盘。该函数遵循与Array.filter相同的前提，其中返回值为false时不会写入文件，返回值为true时会将文件写入磁盘，例如：<br />
   * writeToDisk: filePath => /superman\.css$/.test(filePath)
   * }<br />
   *
   * headers：为所有响应添加标头，同devMiddleware.headers。<br />
   *
   * historyApiFallback：使用HTML5 History API时，可能必须提供index.html页面来代替任何404响应。通过将devServer.historyApiFallback设置为true来启用它。<br />
   * 1、允许通过指定的索引页（默认为“index.html”）代理请求，这对于使用HTML5历史API的单页应用程序很有用。
   * 2、有效值：boolean（false表示不允许通过指定的索引页代理请求）、object。<br />
   * 3、通过提供对象，可以使用重写等选项进一步控制此行为，如：<br />
   * historyApiFallback: {
   *   rewrites: [
   *     { from: /^\/$/, to: '/views/landing.html' },
   *     { from: /^\/subpage/, to: '/views/subpage.html' },
   *     { from: /./, to: '/views/404.html' },
   *   ],
   * }
   * 4、在路径中使用点时（在Angular中很常见），您可能需要使用historyApiFallback: { disableDotRule: true, }。<br />
   * 5、当值类型为Object时，有如下选项（更加具体可见https://github.com/bripkens/connect-history-api-fallback#options）：<br />
   * {<br />
   * index：覆盖索引（默认/index.html），这是中间件识别请求路径需要重写时将使用的请求路径。<br />
   *   1)这不是磁盘上文件的路径。相反它是HTTP请求路径。下游connect/express中间件负责将这个重写的HTTP请求路径转换为实际响应，例如通过从磁盘读取文件。<br />
   *   2)有效值类型：string，默认值'/index.html'。<br />
   *
   * rewrites：当请求url匹配正则表达式模式时覆盖索引，您可以重写为“静态字符串”或使用“函数”来转换传入请求。<br />
   *   1)下面会将匹配/\/soccer/模式的请求重写为/soccer.html：<br />
   *   rewrites: [ { from: /\/soccer/, to: '/soccer.html' }, ]
   *   2)或者可以使用函数来更好地控制重写过程。例如，以下清单显示了对/libs/jquery/jquery.1.12.0.min.js等的请求如何路由到./bower_components/libs/jquery/jquery.1.12.0.min.js。如果URL路径中有API版本也可以使用它：<br />
   *   rewrites:
   *   [
   *   {
   *     from: /^\/libs\/.*$/,
   *     to: function(context) {
   *       return '/bower_components' + context.parsedUrl.pathname;
   *     }
   *   },
   *   ]
   *   3)该函数将始终使用具有以下属性的上下文对象调用：<br />
   *   context.parsedUrl：URL模块的url.parse提供的有关URL的信息。<br />
   *   context.match：由String.match()提供的匹配结果数组。<br />
   *   context.request：HTTP请求对象。<br />
   *
   * verbose：该中间件默认不记录任何信息。如果您希望激活日志记录，则可以通过详细选项或指定记录器函数来执行此操作。<br />
   *   1)为true表示启用。<br />
   *
   * htmlAcceptHeaders：覆盖默认的Accepts:，匹配HTML内容请求时查询的标头，如：['text/html', 'application/xhtml+xml']。<br />
   *
   * disableDotRule：在路径中使用点时（在Angular中很常见），禁用点规则disableDotRule: true。<br />
   * }<br />
   *
   * host：允许指定要使用的主机名。<br />
   * 1、有效值类型：string，其中有3个预设值：'local-ip'、'local-ipv4'、'local-ipv6'。<br />
   * 2、如果您希望您的服务器可以从外部访问，可以将值设置为'0.0.0.0'。<br />
   * 3、'local-ip'：指定为主机将尝试将主机选项解析为您的本地IPv4地址（如果可用），如果IPv4不可用，它将尝试解析您的本地IPv6地址。<br />
   * 4、实测注意一点，当用'0.0.0.0'这个值设置给“devServer.host”时，会让服务器可以从外部访问，包括：本地（localhost）、局域网（如：192.168.1.3）、IPV6等等，但是不能用'0.0.0.0'来访问（访问不了！），还是得通过：本地（localhost）、局域网（如：192.168.1.3）来访问的。<br />
   *
   * hot：是否启用webpack的热模块替换功能。<br />
   * 1、有效值类型：boolean、string（只有一个有效值'only'）。<br />
   * 2、为了在构建失败的情况下启用热模块替换而不刷新页面作为后备，请使用hot: 'only'。<br />
   * 3、从webpack-dev-server v4开始，默认启用HMR。它会自动应用启用HMR所需的webpack.HotModuleReplacementPlugin。因此，当hot在config中或通过CLI选项--hot设置为true时，您不必将此插件添加到webpack.config.js中。<br />
   *
   * http2：允许使用SPDY通过HTTP2提供服务。已弃用，请使用devServer.server。<br />
   * 1、有效值类型：boolean，true表示启用带有自签名证书的HTTP/2。<br />
   * 2、使用spdy通过HTTP/2服务。对于Node 15.0.0及更高版本，此选项将被忽略，因为这些版本的spdy已损坏。一旦Express支持，开发服务器将迁移到Node的内置HTTP/2。<br />
   * 3、也可以使用devServer.https选项提供您自己的证书。<br />
   *
   * https：默认情况下，dev-server将通过HTTP提供服务。它可以选择通过HTTPS提供服务。此选项已弃用，取而代之的是devServer.server选项。<br />
   * 1、允许为TLS配置服务器的侦听套接字（默认情况下，dev-server将通过HTTP提供服务）。已弃用，请使用“devServer.server”选项。<br />
   * 2、有效值类型：boolean、object，此对象直接传递给Node.js HTTPS模块，因此请参阅HTTPS文档（https://nodejs.org/api/https.html）了解更多信息。<br />
   * 3、webpack-dev-server >= v4.2.0允许你设置额外的TLS选项，比如minVersion。此外，您可以直接传递各个文件的内容：<br />
   * devServer: {
   *   https: {
   *     minVersion: 'TLSv1.1',
   *
   *     // string、Buffer、[ string、Buffer ]，SSL密钥的路径或SSL密钥的内容。已弃用，请使用“devServer.devServer.server.options.key”选项。
   *     key: fs.readFileSync(path.join(__dirname, './server.key')),
   *
   *     // string、Buffer、[ string、Buffer ]，SSL pfx文件的路径或SSL pfx文件的内容。已弃用，请使用“devServer.devServer.server.options.pfx”选项。
   *     pfx: fs.readFileSync(path.join(__dirname, './server.pfx')),
   *
   *     // string、Buffer、[ string、Buffer ]，SSL证书的路径或SSL证书的内容。已弃用，请使用“devServer.server.options.cert”选项。
   *     cert: fs.readFileSync(path.join(__dirname, './server.crt')),
   *
   *     // string、Buffer、[ string、Buffer ]，SSL CA证书的路径或SSL CA证书的内容。已弃用，请使用“devServer.server.options.ca”选项。
   *     ca: fs.readFileSync(path.join(__dirname, './ca.pem')),
   *
   *     // string、Buffer、[ string、Buffer ]，SSL CA证书的路径或SSL CA证书的内容。已弃用，请使用“devServer.server.options.ca”选项。
   *     cacert,
   *
   *     // string、Buffer、[ string、Buffer ]，PEM格式CRL（证书吊销列表）的路径或PEM格式CRL（证书吊销列表）的内容。已弃用，请使用“devServer.server.options.crl”选项。
   *     crl,
   *
   *     // string，pfx文件的密码短语。已弃用，请使用“devServer.server.options.passphrase”选项。
   *     passphrase: 'webpack-dev-server',
   *
   *     // boolean，请求SSL证书。已弃用，请使用“devServer.server.options.requestCert”选项。
   *     requestCert: true,
   *   },
   * }
   * 4、不要同时指定https.ca和https.cacert选项，如果指定了https.ca将被使用。https.cacert已弃用，将在下一个主要版本中删除。<br />
   *
   * ipc：是否收听unix套接字（而不是devServer.host）。<br />
   * 1、有效值类型：boolean（只有一个有效值true，将其设置为true将监听/your-os-temp-dir/webpack-dev-server.sock中的套接字）、string。<br />
   * 2、还可以使用以下命令监听不同的套接字：ipc: path.join(__dirname, 'my-socket.sock')。<br />
   *
   * liveReload：启用重新加载检测到文件更改时重新加载/刷新页面（默认情况下启用）。<br />
   * 1、有效值类型：boolean。<br />
   * 2、必须禁用devServer.hot选项或启用devServer.watchFiles选项才能使liveReload生效。通过将devServer.liveReload设置为false来禁用它。<br />
   * 3、实时重新加载仅适用于与web相关的target，例如将target选项设置为：web、webworker、electron-renderer、node-webkit。<br />
   *
   * magicHtml：从v4.1.0+开始启用，告诉dev-server是否启用魔法HTML路由（与webpack输出相对应的路由，例如：/main for main.js，“main”代表“main.js”）。<br />
   * 1、有效值类型：boolean。<br />
   * 2、从webpack-dev-server v5.0开始，删除了，但是没有替代选项。<br />
   *
   * onAfterSetupMiddleware：提供在服务器内部的所有其他中间件之后执行自定义中间件的能力。<br />
   * 1、有效值类型：Function，形如：function(devServer){}。<br />
   * 2、此选项已弃用，取而代之的是devServer.setupMiddlewares选项。<br />
   *
   * onBeforeSetupMiddleware：提供在服务器内部的所有其他中间件之前执行自定义中间件的能力。这可用于定义自定义处理程序。<br />
   * 1、有效值类型：Function，形如：function(devServer){}。<br />
   * 2、此选项已弃用，取而代之的是devServer.setupMiddlewares选项。<br />
   *
   * onListening：当webpack-dev-server开始侦听端口上的连接时，提供执行自定义函数的能力。<br />
   * 1、有效值类型：Function，形如：function(devServer){}。<br />
   *
   * open：告诉dev-server在服务器启动后打开浏览器。将其设置为true以打开默认浏览器。详细见：https://github.com/sindresorhus/open
   * 1、有效值类型：boolean、string（指的是要打开的页面）、object、[ string、object ]。<br />
   * 2、浏览器应用程序名称取决于平台。不要在可重用的模块中对其进行硬编码。例如，“Chrome”在macOS上是“Google Chrome”、“google chrome”，在Linux上是“google-chrome”，在Windows上是“chrome”。<br />
   * 3、当值类型为object时有如下选项：<br />
   * {<br />
   * target：在浏览器中打开指定页面。<br />
   *   1)有效值类型有：string、[ string ]，例如：'/index.html'、'http://localhost:8080/index.html'。<br />
   *
   * app：打开指定的浏览器。<br />
   *   1)有效值类型有：string（该值类型已经弃用，请用值类型为object时，其中的name选项）、object。<br />
   *   2)当值类型为object时有如下选项：<br />
   *   {<br />
   *   name：string、[ string ]，打开指定浏览器的名，例如：[ 'Google Chrome', 'google-chrome', 'chrome', ]。<br />
   *   浏览器应用程序名称取决于平台。不要在可重用的模块中对其进行硬编码。例如，“Chrome”在macOS上是“Google Chrome”、“google chrome”，在Linux上是“google-chrome”，在Windows上是“chrome”。<br />
   *   实际测试，当name的值为数组时，只能对数组里第一个应用生效。<br />
   *   在Windows上测试出能打开的Windows平台上这些浏览器应用名（不同系统应用名可能会不一样）：chrome、msedge、firefox、opera。<br />
   *
   *   arguments：[ string ]，[ '--incognito', '--new-window', ]，打开浏览器应用时所传给它的参数，这些参数取决于浏览器应用。检查浏览器应用的文档以了解它接受哪些参数。<br />
   *   --incognito：以隐私模式打开浏览器。<br />
   *   }<br />
   * }<br />
   *
   * port：指定一个端口号来监听请求。<br />
   * 1、有效值类型有：string（有一个预设值'auto'，表示自动使用空闲端口）、number。<br />
   * 2、该选项值不能为null或空字符串，要自动使用空闲端口，请使用port: 'auto'。<br />
   *
   * proxy：当你有一个单独的API后端开发服务器并且你想在同一个域上发送API请求时，代理一些URL会很有用。<br />
   * 1、有效值类型有：[ object、function ]，从webpack-dev-server v5.0开始，只接受数组类型的值。<br />
   * 2、默认情况下，不接受在HTTPS上运行且证书无效的后端服务器。如果您愿意，请像这样修改您的配置secure: false。<br />
   * 3、默认情况下，代理时会保留主机头的来源，您可以将changeOrigin设置为true以覆盖此行为。它在某些情况下很有用，例如使用基于名称的虚拟托管站点。<br />
   * 4、请注意，http-proxy-middleware的某些功能不需要“target”选项，例如它的“router”选项，但是您仍然需要在此处的配置中包含“target”选项，否则webpack-dev-server不会将其传递给http-proxy-middleware。<br />
   * 5、注意，当前文件编写的配置是遵循“http-proxy-middleware v3”的，因为“webpack 5”也是引用“http-proxy-middleware”的。<br />
   *
   * server：从v4.4.0+开始启用，允许设置服务器和选项（默认为“http”）。<br />
   * 1、有效值类型：string（其中预设的有：http、https、spdy）、object。<br />
   * 2、关于值“spdy”的注意事项，对于Node 15.0.0及更高版本，此选项值将被忽略，因为这些版本的spdy已损坏。一旦Express支持，开发服务器将迁移到Node的内置HTTP/2。<br />
   * 3、使用对象语法提供您自己的证书：<br />
   * {<br />
   * type：可选http、https、spdy三者其中之一。<br />
   *
   * options：有8个属性，它还允许您设置其他TLS选项，例如：minVersion: 'TLSv1.1'。<br />
   *   {<br />
   *   passphrase：有效值类型为string，pfx文件的密码短语，就是生成数字证书时设置的密码。<br />
   *   requestCert：有效值类型为boolean，是否请求SSL证书。<br />
   *   ca：有效值类型为string（文件路径）、buffer（文件流），SSL CA证书的路径或SSL CA证书的内容。<br />
   *   cacert：有效值类型为string（文件路径）、buffer（文件流），SSL CA证书的路径或SSL CA证书的内容。已弃用，请使用“server.options.ca”选项。<br />
   *   cert：有效值类型为string（文件路径）、buffer（文件流），SSL证书的路径或SSL证书的内容。<br />
   *   crl：有效值类型为string（文件路径）、buffer（文件流），PEM格式CRL（证书吊销列表）的路径或PEM格式CRL（证书吊销列表）的内容。<br />
   *   key：有效值类型为string（文件路径）、buffer（文件流），SSL密钥的路径或SSL密钥的内容。<br />
   *   pfx：有效值类型为string（文件路径）、buffer（文件流），SSL pfx文件的路径或SSL pfx文件的内容。<br />
   *   }<br />
   * 如果将使用指定的server.options.ca，请不要同时指定server.options.ca和server.options.cacert选项。server.options.cacert已弃用，将在下一个主要版本中删除。<br />
   * }<br />
   *
   * setupExitSignals：允许关闭开发服务器并在SIGINT和SIGTERM信号上退出进程。<br />
   * 1、有效值类型为boolean。<br />
   *
   * setupMiddlewares：从v4.7.0+开始启用，提供执行自定义函数和应用自定义中间件的能力。<br />
   * 1、有效值类型为一个函数（有两个函数参数：middlewares、devServer），返回值必须将第一个函数参数middlewares返回。<br />
   * 2、middlewares.unshift方法对标之前的onBeforeSetupMiddleware方法。<br />
   * 3、middlewares.push方法对标之前的onAfterSetupMiddleware方法。<br />
   *
   * static：此选项允许配置用于从目录（默认为“public”目录）提供静态文件的选项。<br />
   * 1、有效值类型有：boolean、string、object、[string, object]，值为false表示禁用该项。<br />
   * 2、值类型为string时，一般表示文件夹名、路径名之类的。<br />
   * 3、值类型为object时，有如下属性：<br />
   * {<br />
   * directory：string，告诉服务器从哪里提供内容。仅当您要提供静态文件时才需要这样做，建议使用绝对路径。<br />
   *
   * staticOptions：object，可以配置用于从static.directory提供静态文件的高级选项。有关可能的选项，请参阅Express文档（http://expressjs.com/en/4x/api.html#express.static、http://expressjs.com/en/starter/static-files.html）。<br />
   *   {<br />
   *   dotfiles：string，默认值：ignore，确定如何处理点文件（以点“.”开头的文件或目录）。<br />
   *   1、有效值为：allow（点文件没有特殊处理）、deny（拒绝对点文件的请求，以403响应，然后调用next()）、ignore（就当点文件不存在，响应404，然后调用next()）。<br />
   *   2、注意：使用默认值ignore，它不会忽略以点开头的目录中的文件。<br />
   *
   *   etag：boolean，默认值true，启用或禁用etag生成。<br />
   *   1、注意：express.static总是发送弱ETag。<br />
   *
   *   extensions：[ string ]，默认值false，设置文件扩展名后备：如果找不到文件，则搜索具有指定扩展名的文件并提供找到的第一个文件。<br />
   *
   *   fallthrough：boolean，默认值true，让客户端错误作为未处理的请求通过，否则转发客户端错误。<br />
   *   1、当此选项为true时，客户端错误（例如错误请求或对不存在文件的请求）将导致此中间件简单地调用next()来调用堆栈中的下一个中间件，当为false时，这些错误（甚至是404）将调用next(err)。<br />
   *   2、将此选项设置为true，这样您就可以将多个物理目录映射到同一个Web地址或路由以填充不存在的文件。<br />
   *   3、如果您已将此中间件安装在严格设计为单个文件系统目录的路径上，请使用false，这允许短路404以减少开销。这个中间件也会回复所有的方法。<br />
   *
   *   immutable：boolean，默认值false，在Cache-Control响应标头中启用或禁用不可变指令。如果启用，还应指定maxAge选项以启用缓存。<br />
   *   1、immutable指令将阻止受支持的客户端在maxAge选项的生命周期内发出条件请求以检查文件是否已更改。<br />
   *
   *   index：发送指定的目录索引文件。设置为false以禁用目录索引。<br />
   *
   *   lastModified：boolean，默认值true，将Last-Modified标头设置为操作系统上文件的最后修改日期。<br />
   *
   *   maxAge：number、string（如：'1d'表示1天），默认值为0，设置Cache-Control标头的max-age属性（以毫秒为单位）或ms格式的字符串。<br />
   *
   *   redirect：boolean，默认值true，当路径名是目录时，重定向到结尾的“/”。<br />
   *
   *   setHeaders：function，用于设置HTTP标头以与文件一起服务的功能。<br />
   *   1、对于此选项，指定一个函数来设置自定义响应标头。对标头的更改必须同步发生。<br />
   *   2、fn(res, path, stat)，res：响应对象，path：正在发送的文件路径，stat：正在发送的文件的stat对象。<br />
   *   }<br />
   *
   * publicPath：告诉服务器在哪个URL上提供static.directory内容。<br />
   * 1、有效值类型：string。<br />
   * 2、publicPath: '/dev-server-static-public-path'，效果示意为浏览器将发起这样的请求：http://localhost:3000/dev-server-static-public-path/css/style.css，而该中间件将从directory选项指定的目录下查找层级为“css/style.css”的文件。<br />
   * 3、这个值设置需要注意，'./'、'../'这种尤其注意！并不会都如期望的那样。<br />
   *
   * serveIndex：告诉dev-server在启用时使用serveIndex中间件，serveIndex选项为该中间件在查看没有index.html文件的目录时生成目录列表。<br />
   * 1、有效值类型：boolean、object。<br />
   * 2、值类型为object时，可查看文档（https://github.com/expressjs/serve-index#options）。<br />
   *
   * watch：告诉dev-server监视由static.directory选项提供的文件。它默认启用，文件更改将触发整个页面重新加载。这可以通过将watch选项设置为false来禁用。<br />
   * 1、有效值类型：boolean、object。<br />
   * 2、可以配置用于从static.directory观看静态文件的高级选项。有关可能的选项，请参阅chokidar文档（https://github.com/paulmillr/chokidar）。<br />
   * }<br />
   *
   * watchFiles：此选项允许您配置“globs/directories/files”以监视文件更改。一般情况下不需要设置该选项。<br />
   * 1、有效值类型：string、object、[string, object]。<br />
   * 2、当值类型为object时，有关可能的选项（paths、options），请参阅chokidar文档（https://github.com/paulmillr/chokidar）。<br />
   *
   * webSocketServer：此选项允许我们选择当前的web-socket服务器或提供自定义web-socket服务器实现。<br />
   * 1、有效值类型：boolean（false）、string（'sockjs'、'ws'）、function、object。<br />
   * 2、当模式是“ws”时。此模式使用ws作为服务器，在客户端使用原生WebSocket。<br />
   * 3、要创建自定义服务器实现，请创建一个扩展BaseServer的类。<br />
   * }<br />
   *
   * @type {object}
   */
  devServerConfig = {
    allowedHosts: 'all',
    bonjour: true,
    client: {
      logging: 'info',
      overlay: {
        runtimeErrors: true,
        errors: true,
        warnings: false,
      },
      progress: true,
      reconnect: true,
      webSocketTransport: 'ws',
    },
    compress: true,
    devMiddleware: {
      // 这个选项是给请求设置请求头的。
      headers: httpRequestHeaders,
      index: 'index.html',
      methods: ( methods => methods.split( ',' ).map( item => item.trim() ) )( httpRequestHeaders[ 'Access-Control-Request-Method' ] ),
      publicPath: `/${ env_platform }`,
      writeToDisk: false,
      /**
       * 该选项可让您精确控制显示的捆绑信息。<br />
       * 1、值类型有3种：string、boolean、object。<br />
       * 2、值类型为string时表示webpack带有一些可用于统计输出的预设：<br />
       * errors-only：仅在发生错误时输出。<br />
       * errors-warnings：仅输出错误和警告。<br />
       * minimal：仅在发生错误或新编译时输出。<br />
       * none：无输出，等同于stats: false。<br />
       * normal：标准输出，等同于stats: true。<br />
       * verbose：输出一切。<br />
       * detailed：输出除了chunkModules和chunkRootModules之外的所有内容。<br />
       * summary：输出webpack版本、警告计数和错误计数。<br />
       */
      stats: 'normal',
      /**
       * 允许设置一个回调以改变响应数据。<br />
       * 1、如果响应的响应头中有“Range”，将有一个数据类型为“ReadStream”的data参数。<br />
       * 关于响应头“Range”见：<br />
       * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range
       * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range
       * 2、data的数据类型也可以是string、Buffer。<br />
       * 3、逻辑里不可以使用res.end()、res.send()。<br />
       *
       * @param {Request} req
       *
       * @param {Response} res
       *
       * @param {ReadStream | string | Buffer} data 响应数据。<br />
       * 1、如果响应的响应头中有“Range”，将有一个数据类型为“ReadStream”的data参数。<br />
       * 关于响应头“Range”见：<br />
       * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range
       * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range
       *
       * @param {number} byteLength
       *
       * @returns {{data, byteLength}}
       */
      /*
       modifyResponseData( req, res, data, byteLength ){
       // 注意！！！这里不可以使用res.end()、res.send()。

       return {
       data,
       byteLength,
       };
       },
       */
    },
    // 为响应添加响应头。
    headers: HttpResponseHeadersFun,
    historyApiFallback: {
      index: '/index.html',
    },
    host: '0.0.0.0',
    hot: true,
    liveReload: false,
    onListening( devServer ){
      if( !devServer ){
        throw new Error( 'webpack-dev-server is not defined!' );
      }

      console.log( chalk.cyan( `\nwebpack-dev-server开始监听端口：${ devServer.server.address().port }！！！\n` ) );

      const arr = [];

      devServer.options.static.forEach( ( {
        directory,
        publicPath: [ current, ],
      } ) => {
        arr.push( `https://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }${ current }/\n其内容来自：${ directory }\n` );
      } );

      console.log( chalk.cyan( `可用的静态服务器：\n${ arr.join( '\n' ) }` ) );
    },
    open: [
      // Windows平台上的Edge浏览器。
      {
        target: [
          `https://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/${ devServerGlobalParameters[ env_platform ]?.openPage }`,
        ],
        app: {
          name: [
            'msedge',
          ],
          arguments: [
            '--new-window',
          ],
        },
      },
      // Windows平台上的Chrome浏览器。
      /*
       {
       target: [
       `https://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/${ devServerGlobalParameters[ env_platform ]?.openPage }`,
       ],
       app: {
       name: [
       'chrome',
       ],
       arguments: [
       '--new-window',
       ],
       },
       },
       */
      // Windows平台上的Firefox浏览器。
      /*
       {
       target: [
       `https://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/${ devServerGlobalParameters[ env_platform ]?.openPage }`,
       ],
       app: {
       name: [
       'firefox',
       ],
       arguments: [
       '--new-window',
       ],
       },
       },
       */
      // Windows平台上的Opera浏览器。
      /*
       {
       target: [
       `https://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/${ devServerGlobalParameters[ env_platform ]?.openPage }`,
       ],
       app: {
       name: [
       'opera',
       ],
       arguments: [
       '--new-window',
       ],
       },
       },
       */
      // MacOS平台上的Chrome浏览器。
      {
        target: [
          `https://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/${ devServerGlobalParameters[ env_platform ]?.openPage }`,
        ],
        app: {
          name: [
            'Google Chrome',
          ],
          arguments: [
            '--new-window',
          ],
        },
      },
      // Linux平台上的Chrome浏览器。
      {
        target: [
          `https://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/${ devServerGlobalParameters[ env_platform ]?.openPage }`,
        ],
        app: {
          name: [
            'google-chrome',
          ],
          arguments: [
            '--new-window',
          ],
        },
      },
    ],
    port: devServerGlobalParameters[ env_platform ]?.port,
    proxy: proxyConfig,
    /**
     * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。<br />
     * 2、安装证书如下：<br />
     * “configures/openssl/HTTPSSL001”文件夹下的3个：<br />
     * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。<br />
     * 002服务端CA证书：HTTPSSL001_Servers_CA.crt，安装到“受信任的根证书颁发机构”。<br />
     * 003客户端CA证书：HTTPSSL001_Clients_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。<br />
     * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。<br />
     * 4、当前发现一个小问题！使用'spdy'（使用HTTP/2）时，在自动更新代码并自动刷新浏览器页面的时候，会出现某些文件的请求错误：<br />
     * GET https://localhost:8100/dev_server/js/VendorsJS_Bundle_b722f600ea72cf9a.js net::ERR_HTTP2_PROTOCOL_ERROR 200
     * 只能再次手动刷新页面才能正常加载资源。所以，还是用回'https'（使用HTTP/1.1）。<br />
     */
    server: {
      /**
       * 'http'（使用HTTP/1.1）、'https'（使用HTTP/1.1）、'spdy'（使用HTTP/2）
       * PS：当前发现一个小问题！使用'spdy'（使用HTTP/2）时，在自动更新代码并自动刷新浏览器页面的时候，会出现某些文件的请求错误：<br />
       * GET https://localhost:8100/dev_server/js/VendorsJS_Bundle_b722f600ea72cf9a.js net::ERR_HTTP2_PROTOCOL_ERROR 200
       * 只能再次手动刷新页面才能正常加载资源。所以，还是用回'https'（使用HTTP/1.1）。<br />
       */
      type: 'https',
      // 具体的选项说明可见：https://nodejs.org/dist/latest/docs/api/tls.html#tlscreatesecurecontextoptions
      options: {
        /**
         * 使用一个不安全的HTTP解析器，在真实时接受无效的HTTP头。应该避免使用不安全的解析器。参见--insecure-http-parser获取更多信息。默认值：false。
         */
        insecureHTTPParser: true,

        /**
         * 可选择覆盖该服务器收到的请求的--max-http-header-size的值，即请求头的最大长度（字节）。默认值：16384（16 KiB）。
         */
        maxHeaderSize: 1024000,

        /**
         * 覆盖受信任的CA证书。<br />
         * 默认情况是信任Mozilla策划的知名CA。<br />
         * 当使用此选项显式指定CA时，Mozilla的CA将被完全替换。<br />
         *
         * PS：<br />
         * 1、一般指的是“根CA证书，HTTPSSL001_Root_CA.crt”，“根CA证书，HTTPSSL001_Root_CA.crt”用于安装到系统、浏览器（尤其是火狐浏览器，它有自己的证书列表，也要给它安装）的证书列表中，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。<br />
         */
        ca: [
          readFileSync( join( __dirname, './configures/openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA.crt' ), 'utf8' ),
        ],

        /**
         * PEM格式的私钥（“HTTPSSL001_Root_CA_Key.key”）。<br />
         * PEM允许选择加密私钥，加密密钥将使用“options.passphrase”（用于单个私钥或PFX的共享密码）解密。<br />
         *
         * 注意：<br />
         * 1、在生成“服务端CA证书，HTTPSSL001_Servers_CA.crt”的“HTTPSSL001_Root_CA_Key.key”文件时，除了用.key作为文件的扩展后缀，也可以用.pem做后缀，一般首选.key。<br />
         * 2、当前“HTTPSSL001_Root_CA_Key.key”没使用加密。<br />
         */
        key: readFileSync( join( __dirname, './configures/openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA_Key.key' ), 'utf8' ),

        /**
         * PEM格式的证书链（服务端CA证书，HTTPSSL001_Servers_CA.crt）。<br />
         */
        cert: readFileSync( join( __dirname, './configures/openssl/HTTPSSL001/002服务端CA证书/HTTPSSL001_Servers_CA.crt' ), 'utf8' ),

        /**
         * 如果SSL/TLS握手未在指定的毫秒数内完成，则中止连接。只要握手超时，就会在tls.Server对象上发出“tlsClientError”。默认值：120000（120000毫秒 = 120秒）。<br />
         */
        handshakeTimeout: 120000,

        /**
         * 如果为true，服务器将从连接的客户端请求证书并尝试验证该证书。默认值：false。<br />
         *
         * PS：<br />
         * 启用该项会导致浏览器无法从https加载，因为服务器将从连接的客户端请求证书并尝试验证该证书，如果客户端没能提供“证书”，那么就会报错，这通常出现在浏览器端。<br />
         */
        requestCert: false,

        /**
         * （可选）设置允许的最低TLS版本。“TLSv1.3”、“TLSv1.2”、“TLSv1.1”或“TLSv1”之一。不能与“secureProtocol”选项一起指定。<br />
         * 使用一个或另一个。避免设置为低于TLSv1.2，但互操作性可能需要它。默认值：tls.DEFAULT_MIN_VERSION（也就是：TLSv1.2）。<br />
         */
        minVersion: 'TLSv1.2',

        /**
         * （可选）设置允许的最大TLS版本。“TLSv1.3”、“TLSv1.2”、“TLSv1.1”或“TLSv1”之一。不能与“secureProtocol”选项一起指定。<br />
         * 使用一个或另一个。默认值：tls.DEFAULT_MAX_VERSION（也就是：TLSv1.3）。<br />
         */
        maxVersion: 'TLSv1.3',

        /**
         * 用于单个私钥和/或PFX的共享密码。<br />
         */
        passphrase: '@HTTPSSL001.2024#',

        /**
         * PEM格式的CRL（证书吊销列表）。<br />
         */
        // crl: readFileSync( join( __dirname, './configures/openssl/HTTPSSL001/证书吊销列表/证书吊销列表.pem' ), 'utf8' ),

        /**
         * PFX或PKCS12编码的私钥和证书链。<br />
         * pfx是单独提供密钥和证书的替代方案。<br />
         * PFX通常是加密的，如果是，将使用“options.passphrase”（用于单个私钥或PFX的共享密码）解密。<br />
         *
         * 该选项跟上面的“key”、“cert”选项是互斥的，也就是不要同时设置该选项跟“key”、“cert”选项，否则会报错，说什么太长了。<br />
         */
        // pfx: readFileSync( join( __dirname, './configures/openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA.p12' ), 'utf8' ),
      },
    },
    setupExitSignals: true,
    setupMiddlewares: ( middlewares, devServer ) => {
      if( !devServer ){
        throw new Error( 'webpack-dev-server is not defined!' );
      }

      const ResFaviconIco = ( req, res, url = resolve( __dirname, './favicon.ico' ) ) => {
          logWriteStream.write( `--->${ req.url }<---Start
请求头：
${ JSON.stringify( req.headers, null, 4 ) }
--->${ req.url }<---End
\n` );

          res.setHeader( 'Content-Type', Mime.getType( req.url ) );
          res.setHeader( 'x-from', 'devServer.setupMiddlewares' );
          res.setHeader( 'x-dev-type', `${ env_platform }` );

          Object.entries( HttpResponseHeadersFun( req, res, ) ).forEach( ( [ keyName, keyValue ], ) => {
            res.setHeader( keyName, keyValue );
          } );

          res.statusCode = 200;
          res.statusMessage = 'OK';

          createReadStream( url ).pipe( res, {
            end: true,
          } );
        },
        ResRoot = ( req, response ) => {
          logWriteStream.write( `--->${ req.originalUrl }<---Start
请求头：
${ JSON.stringify( req.headers, null, 4 ) }
--->${ req.originalUrl }<---End
\n` );

          response.setHeader( 'Content-Type', 'text/html;charset=utf-8' );
          response.setHeader( 'x-from', 'devServer.setupMiddlewares' );
          response.setHeader( 'x-dev-type', `${ env_platform }` );

          Object.entries( HttpResponseHeadersFun( req, response ) ).forEach( ( [ keyName, keyValue ], ) => {
            response.setHeader( keyName, keyValue );
          } );

          response.statusCode = 200;
          response.statusMessage = 'OK';

          response.end( `
                   <!DOCTYPE html>
                   <html lang = 'zh-CN'>
                   <head>
                     <meta charset = 'UTF-8' />
                     <title>index</title>
                   </head>
                   <body>
                     <p>This is a index page(${ req.originalUrl }) for webpack-dev-server config.</p>
                   </body>
                   </html>
                   `, 'utf8' );
        };

      devServer.app.all( '*', ( req, res, next ) => {
        logWriteStream.write( `--->${ req.url }<---Start
请求头：
${ JSON.stringify( req.headers, null, 4 ) }
--->${ req.url }<---End
\n` );

        next();
      } );

      devServer.app.get( '/', ( req, response ) => {
        ResRoot( req, response );
      } );
      devServer.app.get( '/index.html', ( req, response ) => {
        ResRoot( req, response );
      } );

      devServer.app.get( '/favicon.ico', ( req, response ) => {
        ResFaviconIco( req, response );
      } );
      devServer.app.get( '/favicon.png', ( req, response ) => {
        ResFaviconIco( req, response, resolve( __dirname, './src/static/ico/favicon.png' ) );
      } );
      devServer.app.get( '/apple-touch-icon.png', ( req, response ) => {
        ResFaviconIco( req, response, resolve( __dirname, './src/static/ico/favicon.png' ) );
      } );
      devServer.app.get( '/apple-touch-icon-precomposed.png', ( req, response ) => {
        ResFaviconIco( req, response, resolve( __dirname, './src/static/ico/favicon.png' ) );
      } );
      devServer.app.get( '/apple-touch-icon-120x120.png', ( req, response ) => {
        ResFaviconIco( req, response, resolve( __dirname, './src/static/ico/favicon.png' ) );
      } );
      devServer.app.get( '/apple-touch-icon-120x120-precomposed.png', ( req, response ) => {
        ResFaviconIco( req, response, resolve( __dirname, './src/static/ico/favicon.png' ) );
      } );

      /**
       * unshift方法对标之前的onBeforeSetupMiddleware方法。<br />
       * PS：<br />
       * 1、实测，启动后，可以访问到！<br />
       */
      middlewares.unshift( {
        name: 'test001-first',
        /**
         * path选项是可选的，但是最好还是要有。
         */
        path: '/test001/first/',
        middleware: ( req, res ) => {
          logWriteStream.write( `--->${ req.url }<---Start
请求头：
${ JSON.stringify( req.headers, null, 4 ) }
--->${ req.url }<---End
\n` );

          res.setHeader( 'Content-Type', 'text/html;charset=utf-8' );
          res.setHeader( 'x-from', 'devServer.setupMiddlewares.onBeforeSetupMiddleware' );
          res.setHeader( 'x-dev-type', `${ env_platform }` );

          Object.entries( HttpResponseHeadersFun( req, res ) ).forEach( ( [ keyName, keyValue ], ) => {
            res.setHeader( keyName, keyValue );
          } );

          res.statusCode = 200;
          res.statusMessage = 'OK';

          res.end( `
                   <!DOCTYPE html>
                   <html lang = 'zh-CN'>
                   <head>
                     <meta charset = 'UTF-8' />
                     <title>test001-first</title>
                   </head>
                   <body>
                     <p>/test001/first/</p>
                   </body>
                   </html>
                   `, 'utf8' );
        },
      } );

      /**
       * push方法对标之前的onAfterSetupMiddleware方法。<br />
       * PS：<br />
       * 1、实测，启动后，无法访问到！<br />
       */
      middlewares.push( {
        name: 'test001-last',
        /**
         * path选项是可选的，但是最好还是要有。
         */
        path: '/test001/last/',
        middleware: ( req, res ) => {
          logWriteStream.write( `--->${ req.url }<---Start
请求头：
${ JSON.stringify( req.headers, null, 4 ) }
--->${ req.url }<---End
\n` );

          res.setHeader( 'Content-Type', 'text/html;charset=utf-8' );
          res.setHeader( 'x-from', 'devServer.setupMiddlewares.onAfterSetupMiddleware' );
          res.setHeader( 'x-dev-type', `${ env_platform }` );

          Object.entries( HttpResponseHeadersFun( req, res ) ).forEach( ( [ keyName, keyValue ], ) => {
            res.setHeader( keyName, keyValue );
          } );

          res.statusCode = 200;
          res.statusMessage = 'OK';

          res.end( `
                   <!DOCTYPE html>
                   <html lang = 'zh-CN'>
                   <head>
                     <meta charset = 'UTF-8' />
                     <title>test001-last</title>
                   </head>
                   <body>
                     <p>/test001/last/</p>
                   </body>
                   </html>
                   `, 'utf8' );
        },
      } );

      return middlewares;
    },
    static: ( arr => {
      const obj1 = {
        staticOptions: {
          dotfiles: 'deny',
          etag: true,
          extensions: [
            'html',
            'htm',
          ],
          fallthrough: true,
          immutable: false,
          index: false,
          lastModified: true,
          maxAge: 0,
          redirect: true,
          setHeaders: ( res, path, stat ) => {
            res.set( 'x-env-platform', `${ env_platform }` );
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );

            Object.entries( HttpResponseHeadersFun( null, res ) ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      };

      return arr.map( item => {
        return {
          ...obj1,
          ...item,
        };
      } );
    } )( [
      {
        directory: join( __dirname, './dist/' ),
        publicPath: '/dev-server-static/dist',
      },
      {
        directory: join( __dirname, './simulation_servers/' ),
        publicPath: '/dev-server-static/simulation_servers',
      },
      {
        directory: join( __dirname, './src/' ),
        publicPath: '/dev-server-static/src',
      },
      {
        directory: join( __dirname, './subsystems/' ),
        publicPath: '/dev-server-static/subsystems',
      },
      {
        directory: join( __dirname, './test/' ),
        publicPath: '/dev-server-static/test',
      },
      {
        directory: join( __dirname, './ts_compiled/' ),
        publicPath: '/dev-server-static/ts_compiled',
      },
      {
        directory: join( __dirname, './webpack_location/' ),
        publicPath: '/dev-server-static/webpack_location',
      },
      {
        directory: join( __dirname, './webpack_records/' ),
        publicPath: '/dev-server-static/webpack_records',
      },
    ] ),
    // 该选项“watchFiles”不需要设置。
    /*
     watchFiles: {
     paths: [
     'src/!**!/!*',
     ],
     options: {
     usePolling: false,
     },
     },
     */
    webSocketServer: 'ws',
  },
  /**
   * 在webpack 5中引入了实验选项，以使用户能够激活和试用实验性功能。<br />
   * 1、由于实验性功能具有宽松的语义版本控制并且可能包含重大更改，因此请确保将webpack的版本修复为次要版本，例如webpack: ~5.4.3而不是webpack: ^5.4.3或者在使用实验时使用锁定文件。<br />
   * 2、禁用所有实验性功能：experiments: false。<br />
   *
   * @type {object}
   */
  experimentsConfig = {
    /**
     * 根据更新的规范支持新的WebAssembly，它使WebAssembly模块成为异步模块。当experiments.futureDefaults设置为true时默认启用。<br />
     * 1、这是推荐的在webpack 5中的最新的WASM集成规范。<br />
     */
    asyncWebAssembly: true,
    /**
     * 为许多webpack 4 API启用带有弃用警告的向后兼容层。<br />
     */
    backCompat: true,
    /**
     * 开始可用版本：5.49.0+，启用后，webpack可以构建以http(s):协议开头的远程资源，切记远程资源的url一定得是带明确的文件扩展后缀名，不然没法被各自的loader处理，从而webpack报处理错误。<br />
     * 1、启用后的使用例子：import pMap1 from 'https://cdn.skypack.dev/p-map.js';<br />
     * 2、远程资源的加载是需要耗时下载的，所以，webpack的编译时间也受其影响。<br />
     * 3、当使用以'//'开头的远程链接时，会报错！尤其是在js文件中使用，所以要使用以http:、https:协议头为开头的远程链接才能正确编译输出。<br />
     * 4、该实验性选项启用会导致HMR无效！但是在“webpack-dev-server”的“4.12.0 (2023-03-14)”版本中被修复了。<br />
     * 5、除了设置成Boolean值，还可以是更加详细的Object值：<br />
     * {<br />
     * allowedUris：[ string，例如：http://localhost:9990/ ]、[ RegExp，例如：^https?:// ]、[ Function，例如：(uri: string) => boolean ]，允许的URI列表（分别是它们的开头）。<br />
     *
     * cacheLocation：string、false，定义缓存远程资源的位置。也可以通过传递false来禁用存储。<br />
     * 1、默认情况下，webpack会使用<compiler-name.>webpack.lock.data/进行缓存。<br />
     * 2、请注意，您应该将experiments.buildHttp.cacheLocation下的文件提交到版本控制系统中，因为在生产构建期间不会发出任何网络请求。<br />
     *
     * frozen：boolean，冻结远程资源和lockfile。对lockfile或资源内容的任何修改都将导致错误。<br />
     *
     * lockfileLocation：string，定义存储lockfile的位置。<br />
     * 1、默认情况下，webpack会生成一个<compiler-name.>webpack.lock>文件，您需要确保将其提交到版本控制系统中。<br />
     * 2、因为在生产构建期间，webpack将从experiments.buildHttp.cacheLocation下的lockfile和缓存提取资源来构建以http(s):开头的模块。<br />
     *
     * proxy：string，指定用于获取远程资源的代理服务器。<br />
     * 1、默认情况下，webpack会暗示使用代理服务器从http_proxy（不区分大小写）环境变量中获取远程资源。但是，您也可以通过代理选项指定一个。<br />
     *
     * upgrade：boolean，检测远程资源的更改并自动升级它们。<br />
     * 1、设置后，将获取现有lockfile条目的资源，并在资源内容发生更改时升级条目。<br />
     * }<br />
     */
    buildHttp: {
      allowedUris: [
        // new RegExp( /^http(s)?:\/\// ),
        // new RegExp( /^http(s)?:\/\/([\w.]+\/?)\S*/ ),

        /**
         * 处理哪些远程链接要被处理，哪些不需要被处理。<br />
         *
         * @param {string} uri 远程链接，值如：https://www.xxx.com/1.jpg，必需。
         *
         * @returns {boolean} true表示会处理该远程链接，反之不处理。
         */
          uri => {
          const boo = allowedCondition.some( item => String( uri ).trim().startsWith( item ) );

          return allowedCondition.length === 0
                 ? true
                 : boo;
        },
      ],
      cacheLocation: resolve( __dirname, `./webpack_location/cache_lockfile/` ),
      frozen: isProduction,
      lockfileLocation: resolve( __dirname, `./webpack_location/lockfile.lock` ),
      upgrade: !isProduction,
    },
    /**
     * 启用未更改的模块的额外内存缓存，并且仅引用未更改的模块。<br />
     * 1、默认值同futureDefaults的值。<br />
     * 2、“optimization.usedExports”不能与cacheUnaffected一起使用，因为导出使用是一种全局影响。<br />
     */
    cacheUnaffected: false,
    /**
     * 该项设置为true后，会出现不如所愿的CSS处理！还是老老实实的设置为false。启用原生CSS支持。请注意，它是一个仍在开发中的实验性功能，将在webpack v6中默认启用，但是您可以在GitHub上跟踪进度。<br />
     */
    css: false,
    /**
     * 该项设置为true后，会出现不如所愿的CSS处理！还是老老实实的设置为false，而且还不知会不会导致其他处理不如所愿。使用下一个主要webpack的默认值，并在任何有问题的地方显示警告。<br />
     */
    futureDefaults: false,
    /**
     * 启用模块和块层。<br />
     */
    layers: true,
    /**
     * 设置成false即可，生产环境不要设置成true，会报错！这个貌似是给开发环境用的！仅在使用“entrypoints”和“动态import”时才编译它们。它可用于Web或Node.js。<br />
     * 1、除了设置成Boolean值，还可以是更加详细的Object值：<br />
     * 2、开始可用版本：5.17.0+。<br />
     * {<br />
     * backend：自定义后端。<br />
     * 1、有效值有3中：<br />
     *   (1)、Function<br />
     *   ( compiler: Compiler, callback: (err?: Error, api?: BackendApi) => void ) => void
     *   参数说明：<br />
     *   Compiler：import('../lib/Compiler')
     *   BackendApi：import('../lib/hmr/LazyCompilationPlugin').BackendApi
     *
     *   (2)、Function<br />
     *   (compiler: Compiler) => Promise<BackendApi>
     *   参数说明：<br />
     *   Compiler：import('../lib/Compiler')
     *   BackendApi：import('../lib/hmr/LazyCompilationPlugin').BackendApi
     *
     *   (3)、Object<br />
     *   {<br />
     *   client：string，自定义客户端。<br />
     *
     *   listen：指定从服务器收听的位置。<br />
     *   1、有效值类型有3种：<br />
     *     1)number：表示一个端口。<br />
     *
     *     2)ListenOptions：import('net').ListenOptions
     *     参数说明：<br />
     *     {<br />
     *     host：string，表示一个主机。<br />
     *     port：number，表示一个端口。<br />
     *     }<br />
     *
     *     3)Function：(server: Server) => void
     *     参数说明：<br />
     *     Server：import('net').Server
     *
     *   protocol：指定客户端用于连接服务器的协议。<br />
     *   1、有效值："http"、"https"。<br />
     *
     *   server：指定如何创建处理EventSource请求的服务器。<br />
     *   1、有效值类型有3种：<br />
     *     1)ServerOptionsImport：import('http').ServerOptions
     *
     *     2)ServerOptionsHttps：import('https').ServerOptions
     *
     *     3)Function：() => Server
     *     参数说明：<br />
     *     Server：import('net').Server
     *   }<br />
     *
     * entries：boolean，为“entries”启用延迟编译。<br />
     *
     * imports：boolean，为“动态import”启用延迟编译。<br />
     * 1、开始可用版本：5.20.0+。<br />
     *
     * test：string、RegExp、( module: import( '../lib/Module' ) ) => boolean，指定应该延迟编译哪些导入的模块。<br />
     * 1、开始可用版本：5.20.0+。<br />
     * 2、指定应延迟编译哪些“entrypoints”或“动态import”。这与导入的模块匹配，而不是入口点名称。<br />
     * 3、当使用函数作为该项的值时，函数参数“module”的数据类型为“Module”，值形如：import( '../lib/Module' )。<br />
     * }<br />
     */
    lazyCompilation: false,
    /**
     * 一旦启用，webpack将尽可能输出ECMAScript模块语法。例如，import()加载块，ESM导出以公开块数据等等。<br />
     */
    outputModule: false,
    /**
     * 像webpack 4一样支持旧的WebAssembly。<br />
     * 1、这是不推荐的在webpack 4中的实验性选项。<br />
     */
    syncWebAssembly: false,
    /**
     * 支持Top Level Await Stage 3提案，当在顶层使用await时，它使模块成为异步模块。当experiments.futureDefaults设置为true时默认启用。<br />
     */
    topLevelAwait: true,
  },
  /**
   * 注意，在解析匹配扩展时，是从数组的开头开始匹配的！
   * 1、'...'表示默认扩展。
   *
   * @type {array}
   */
  extensionsConfig = [
    '.js',
    '.cjs',
    '.mjs',
    '.ts',
    '.cts',
    '.mts',

    '.jsx',
    '.tsx',

    '.json',
    '.json5',

    '.wasm',

    '.vue',

    '...',
  ],
  /**
   * 之所以设置该选项，系为了配合ts-loader的使用。
   * PS：
   * 1、注意，在解析匹配时，是从数组的末尾开始匹配的！
   *
   * @type {object}
   */
  extensionAliasConfig = {
    '.js': [
      '.ts',
      '.js',
    ],
    '.cjs': [
      '.cts',
      '.cjs',
    ],
    '.mjs': [
      '.mts',
      '.mjs',
    ],
  },
  /**
   * externals配置选项提供了一种从输出包中排除依赖项的方法。此功能通常对库开发人员最有用，但它有多种应用程序。<br />
   * 1、防止捆绑某些导入的包，而是在运行时检索这些外部依赖项。<br />
   * 2、有效值类型：string、object、function、RegExp、[ string ]、[ object ]、[ function ]、[ RegExp ]。<br />
   * 3、使用说明及其例子：<br />
   * 假定webpack.config.js中externals选项有这样的配置：<br />
   * externals: {
   *   jquery: '$',
   *   或这样写
   *   jquery: 'window.$',
   *   或这样写
   *   jquery: 'jQuery',
   *   或这样写，先假定用这个写法
   *   jquery: 'window.jQuery',
   * }
   *
   * 假定index.js有这样的使用jquery：<br />
   * import $ from 'jquery';
   * $( 'h1' ).text( 'hello world!' );
   *
   * 假定index.html有这样的引入CDN上的jquery：<br />
   * <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
   *
   * 以上的示例，最终的结果就是原本要被打包进代码里的jquery包代码系不会被打包进结果里的，而“index.js”中的$( 'h1' )被转为window.jQuery( 'h1' )。<br />
   * webpack.config.js中externals配置里的key（如：jquery）对应index.js中from关键字右边的字符串'jquery'，这两个一一对应的单词都要一样哦，区分大小写的。<br />
   * index.js中from关键字左边的$，当在后续的代码中使用这个$时，会被替换成webpack.config.js中externals配置里key（如：jquery）对应的value值（如：window.jQuery）。<br />
   * 为什么可以在window上能点到这个jQuery呢，因为，在index.html中引入了jquery，且它有在全局暴露出jQuery、$这两个变量名，所以不仅可以使用window.jQuery，还可以使用window.$、jQuery、$。<br />
   *
   * 要想externals选项的设置生效，得满足3步设置：<br />
   * 第1步得在externals选项中有所设置；<br />
   * 第2步得在代码中import了第1步中设置的包名；<br />
   * 第3步得在全局环境中存在一个可以供全局都能访问到的变量名，可以是在HTML中引入外部链接脚本，也可以是在代码中明确写了挂载在window上的全局变量，例如：window.xxx = () => {}。<br />
   *
   * @type {object}
   */
  externalsConfig = {
    // axios: 'window.axios',
    // echarts: 'window.echarts',
    // jquery: 'window.$',
    // swiper: 'window.Swiper',
  },
  /**
   * 在单独的进程上运行typescript类型检查器的Webpack插件。该插件我们最好只做语法检查，不做其他事情，其他事情交由ts-loader之类的工具去做。<br />
   * 1、如果您使用ts-loader < 9.3.0，请为“ts-loader”的配置添加transpileOnly: true。<br />
   * 2、请务必注意，此插件使用TypeScript，而不是webpack的模块解析。这意味着您必须正确设置tsconfig.json、tsconfig.webpack.json。<br />
   * 3、这是因为性能——使用TypeScript的模块解析，我们不必等待webpack编译文件。<br />
   * 4、要调试TypeScript的模块解析，可以使用tsc --traceResolution命令（会打印出详细的模块解析信息）。<br />
   * 5、这个插件使用cosmiconfig。这意味着除了插件构造函数之外，您还可以将配置放在：<br />
   * package.json 中的“fork-ts-checker”字段。<br />
   * JSON或YAML格式的.fork-ts-checkerrc文件。<br />
   * 导出JS对象的fork-ts-checker.config.js文件。<br />
   * 6、传递给插件构造函数的选项将覆盖cosmiconfig中的选项（使用deepmerge）。<br />
   * 7、如果你需要Vue.js的支持，请使用该插件的第6版，该插件最新系第8版（直到20230429）。<br />
   * 8、该插件的第8版删除了对Vue.js的支持，也就是说选项typescript.extensions被删除了。<br />
   *
   * @type {object}
   */
  forkTsCheckerWebpackPluginConfig = {
    // 如果为true，则在完成webpack的编译后报告问题。因此，它不会阻止编译。仅在"watch"模式下使用。
    async: !isProduction,
    typescript: {
      // 检查器进程的内存限制（以MB为单位）。如果进程退出并出现分配失败错误，请尝试增加此数字。
      memoryLimit: 10 * 1024,
      // tsconfig.json的路径。默认情况下，插件使用上下文或process.cwd()来本地化tsconfig.json文件。
      configFile: resolve( __dirname, './tsconfig.webpack.json' ),
      /**
       * 该配置将覆盖tsconfig.webpack.json文件中的配置。支持的字段有：extends、compilerOptions、include、exclude、files和references。
       */
      /*
       configOverwrite: ( () => {
       return {
       include: tsconfig_webpack_json.include.filter( item => !item.includes( '/simulation_servers/' ) || !item.includes( 'simulation_servers/' ) || !item.includes( '/simulation_servers' ) ),
       };
       } )(),
       */
      context: resolve( __dirname, './' ),
      // 相当于tsc命令的--build标志。该插件我们最好只做语法检查，不做其他事情，其他事情交由ts-loader之类的工具去做。
      build: false,
      /**
       * 该插件我们最好只做语法检查，不做其他事情，其他事情交由ts-loader之类的工具去做。有4个内置字符串值："readonly"、"write-dts"、"write-tsbuildinfo"、"write-references"。<br />
       * 1、如果您不想在磁盘上写入任何内容，请使用readonly。<br />
       * 2、write-dts仅写入.d.ts文件。<br />
       * 3、write-tsbuildinfo仅写入.tsbuildinfo文件。<br />
       * 4、write-references用于编写项目引用的.js和.d.ts文件（最后2种模式需要build:true）。<br />
       * 5、如果使用“babel-loader”，建议使用"write-references"模式来提高初始编译时间。如果使用“ts-loader”，建议使用"write-tsbuildinfo"模式，以不覆盖“ts-loader”发出的文件。<br />
       * 6、默认值：build === true ? 'write-tsbuildinfo' : 'readonly'。<br />
       * 7、由于在“ts-loader”的配置中将配置项transpileOnly设置为true，会导致“ts-loader”不发出声明文件，如果需要发出声明文件可以将插件“fork-ts-checker-webpack-plugin”的typescript.mode选项设置为“write-dts”。<br />
       */
      mode: 'write-dts',
      // 用于选择我们要执行哪些诊断的设置。
      diagnosticOptions: {
        // 句法。
        syntactic: true,
        // 语义。
        semantic: true,
        // 声明。
        declaration: true,
        // 全局。
        global: true,
      },
      /**
       * TypeScript检查器扩展的选项（typescript.extensions选项对象）。且保留着吧！<br />
       * PS：<br />
       * 1、如果你需要Vue.js的支持，请使用该插件的第6版，该插件最新系第8版（直到20230429）。<br />
       * 2、该插件的第8版删除了对Vue.js的支持，也就是说选项typescript.extensions被删除了。<br />
       */
      extensions: {
        vue: {
          enabled: true,
          /**
           * 将用于解析.vue文件的编译器的包名。如果您使用nativescript-vue，则可以使用“nativescript-vue-template-compiler”。<br />
           * 1、vue 2.x使用的模板编译器是vue-template-compiler，但是vue 3.x用的是@vue/compiler-sfc。<br />
           */
          compiler: '@vue/compiler-sfc',
        },
      },
      /*
       测量并打印与TypeScript性能相关的计时，启用后会输出如下信息：
       ┌───────────────┬────────────────────┐
       │    (index)    │       Values       │
       ├───────────────┼────────────────────┤
       │    Tracing    │ 46.75679999217391  │
       │   I/O Read    │ 55.00110001116991  │
       │     Parse     │ 999.4141999967396  │
       │ ResolveModule │ 47.86929999664426  │
       │    Program    │ 1573.2212000004947 │
       │     Bind      │ 318.62649999558926 │
       │     Check     │ 55.84309998527169  │
       │ transformTime │ 16.43519999831915  │
       │  Dump types   │ 76.64220000058413  │
       └───────────────┴────────────────────┘
       */
      profile: false,
      // 如果提供，这是可以在其中找到TypeScript的自定义路径。必须指向到“typescript.js”这个文件的路径，也就是值为: resolve( __dirname, './node_modules/typescript/lib/typescript.js' )。
      typescriptPath: resolve( __dirname, './node_modules/typescript/lib/typescript.js' ),
    },
    issue: {
      include: [
        {
          file: '**/src/**/*.ts',
        },
        {
          file: '**/src/**/*.cts',
        },
        {
          file: '**/src/**/*.mts',
        },
        {
          file: '**/src/**/*.tsx',
        },
        {
          file: '**/src/**/*.ts.vue',
        },
        {
          file: '**/src/**/*.cts.vue',
        },
        {
          file: '**/src/**/*.mts.vue',
        },
        {
          file: '**/src/**/*.tsx.vue',
        },
      ],
      exclude: [
        {
          file: '**/*.test.ts',
        },
        {
          file: '**/*.test.cts',
        },
        {
          file: '**/*.test.mts',
        },
        {
          file: '**/*.test.esm.ts',
        },
        {
          file: '**/*.test.commonjs.cts',
        },
        {
          file: '**/*.test.esm.mts',
        },
        {
          file: '**/*.spec.ts',
        },
        {
          file: '**/*.spec.cts',
        },
        {
          file: '**/*.spec.mts',
        },
        {
          file: '**/*.spec.tsx',
        },
        {
          file: '**/*.spec.d.ts',
        },
        {
          file: '**/*.spec.d.cts',
        },
        {
          file: '**/*.spec.d.mts',
        },
        {
          file: '**/*.spec.ts.vue',
        },
        {
          file: '**/*.spec.cts.vue',
        },
        {
          file: '**/*.spec.mts.vue',
        },
        {
          file: '**/*.spec.tsx.vue',
        },
      ],
    },
    formatter: {
      type: 'codeframe',
      // 详细见：node_modules/fork-ts-checker-webpack-plugin/lib/formatter/types/babel__code-frame.d.ts:1
      options: {
        // boolean, defaults to false。切换语法，将代码突出显示为终端的JavaScript。
        highlightCode: true,
        //  number, defaults to 2。调整行数以显示在错误上方。
        linesAbove: 2,
        // number, defaults to 3。调整行数以显示在错误下方。
        linesBelow: 3,
        // boolean, defaults to false。启用此选项以强制将代码语法高亮为JavaScript（对于非终端）；覆盖highlightCode选项。
        forceColor: true,
        // string。传入要在代码中突出显示的位置旁边内联显示的字符串（如果可能）。如果它不能内联定位，它将被放置在代码框的上方。
        message: '关键错误(Caused by)',
      },
      pathType: 'absolute',
    },
    logger: 'webpack-infrastructure',
    // 如果设置为false，则不会向Webpack Dev Server报告错误。
    devServer: !isProduction,
  },
  /**
   * 该插件将通知您第一次运行（成功/失败）、所有失败的运行以及从构建失败中恢复后的第一次成功运行。换句话说：如果您的构建一切正常，它将保持沉默。<br />
   * 1、带插件必须依赖forkTsCheckerWebpackPlugin，在forkTsCheckerWebpackPlugin之后执行。<br />
   *
   * @type {object}
   */
  forkTsCheckerNotifierWebpackPluginConfig = {
    // 通知中显示的标题前缀。
    title: 'TS构建出错！',
    // 如果设置为true，警告将不会导致通知。
    excludeWarnings: true,
    // 每次触发通知。称之为“嘈杂模式”。
    alwaysNotify: false,
    // 不要在第一次构建时通知。这允许您接收后续增量构建的通知，而不会收到初始构建的通知。
    skipFirstNotification: false,
    // 跳过成功构建的通知。
    skipSuccessful: true,
  },
  /**
   * 如果您有使用它的插件，则应在任何集成插件之前先订购html-webpack-plugin。
   *
   * @type {array}
   */
  htmlWebpackPluginConfig = HTMLWebpackPluginConfig( {
    isProduction,
    isSPA,
    HTMLMinifyConfig,
  } ),
  /**
   * 限制生成的代码块（chunk）数量。值类型为：number，无默认值。<br />
   * 1、如果生成的chunk数量超过maxChunks设置的值，Webpack会尝试合并某些chunk以满足该数量限制。<br />
   * 2、较大的值：如果你希望生成的chunk文件较多，可以设置一个较大的maxChunks。这会增加生成的文件数量，但会增加HTTP请求的数量。<br />
   * 3、较小的值：如果你希望Webpack自动优化拆分文件数目（通过合并一些文件），可以设置较小的maxChunks值。尽量少的文件数量，会减少HTTP请求的数量。<br />
   *
   * @type {{maxChunks: number}}
   */
  limitChunkCountPluginConfig = {
    maxChunks: 100,
  },
  /**
   * 确保拆分出的代码块达到一定的最小尺寸。单位是：字节。无默认值。例如：1 * 1024，就表示：1KB。<br />
   * 1、确保拆分出来的每个chunk至少达到指定的最小大小。如果某个chunk的大小小于minChunkSize配置的值，Webpack会尝试将其合并到其他chunk中。<br />
   * 2、较大的值：如果你希望避免生成过小的文件，可以设置较大的minChunkSize。这会迫使Webpack合并那些过小的chunk。<br />
   * 3、较小的值：如果你希望拆分出更多的小文件（例如为了优化缓存策略或其他原因），可以设置较小的minChunkSize。<br />
   * 4、注意，如果设置的值大于某个动态加载文件的大小，且其会用作“预取”，那么会导致其被合并到其他文件中，从而使“预取”不生效，此时，只要更改该设置值成小于那个预取文件的大小就行。<br />
   *
   * @type {{minChunkSize: number}}
   */
  minChunkSizePluginConfig = {
    minChunkSize: 1 * 1024,
  },
  /**
   * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
   * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
   * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
   * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
   * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
   *
   * @type {object}
   */
  miniCssExtractPluginConfig = {
    /**
     * 此选项确定每个输出CSS文件的名称。<br />
     * 1、你必须不在这里指定一个绝对路径，但路径可以包含由'/'分隔的文件夹。<br />
     * 2、指定的路径与'output.path'选项的值联合起来，以确定磁盘上的位置。<br />
     */
    filename( pathData, assetInfo ){
      return 'styles/[name]_Bundle_[contenthash].css';
    },
    /**
     * 此选项确定非入口块文件的名称。<br />
     * 1、你必须不在这里指定一个绝对路径，但路径可以包含由'/'分隔的文件夹。<br />
     * 2、指定的路径与'output.path'选项的值联合起来，以确定磁盘上的位置。<br />
     * 3、将chunkFilename指定为函数仅在webpack@5中可用。<br />
     */
    chunkFilename( pathData, assetInfo ){
      return 'styles/[name]_Chunk_[contenthash].css';
    },
    // 启用以删除有关顺序冲突的警告。对于通过一致使用范围或命名约定来减轻css排序的项目，可以通过将插件的ignoreOrder标志设置为true来禁用css顺序警告。
    ignoreOrder: false,
    attributes: {
      'data-is-production': `${ isProduction }`,
    },
  },
  /**
   * 以下选项表示是否填充或模拟某些Node.js的全局变量。<br />
   * 1、此功能由webpack内部的NodeStuffPlugin插件提供。<br />
   * 2、从webpack 5开始，只能在node选项下配置global、__filename、__dirname。<br />
   * 3、如果正在寻找如何在webpack 5下的Node.js中以类似方式填充fs等等node模块，请查看resolve.fallback以获取帮助。<br />
   * 4、从webpack 3.0.0开始，可以将node选项直接设置为false以完全关闭NodeStuffPlugin插件。<br />
   *
   * @type {object}
   */
  nodeConfig = {
    global: false,
    __filename: false,
    __dirname: false,
  },
  /**
   * moduleConfig必须在nodeConfig之后，因为有引用。<br />
   * 这些选项决定了如何处理项目中不同类型的模块。<br />
   * 1、module.generator，5.12.0+开始支持，可以使用module.generator在一个地方配置所有生成器的选项，目前有效的就下述3个顶级选项：<br />
   * {<br />
   * asset：资产模块的生成器选项。<br />
   *   {<br />
   *   dataUrl：dataUrl生成器选项。<br />
   *   1、有效值类型：object、function。<br />
   *   2、当值类型为function时，为模块执行并应返回DataUrl字符串的函数。它可以有一个字符串作为“ident”属性，该属性有助于模块哈希：<br />
   *   ( source: string | Buffer, context: { filename: string, module: import('../lib/Module') } ) => string <br />
   *   3、当值类型为object时：<br />
   *   {<br />
   *   encoding：false、string，默认为base64，当设置为“base64”时，模块源将使用Base64算法进行编码。将encoding设置为false将禁用编码。<br />
   *
   *   mimetype：string，数据URI的mimetype（默认情况下从文件扩展名获取）。<br />
   *   }<br />
   *
   *   emit：boolean，5.25.0+开始支持，从此资源模块发出输出资源。这可以设置为false，以忽略发射，例如SSR（服务器端渲染）。<br />
   *
   *   filename：与output.assetModuleFilename相同，但针对特定规则。覆盖output.assetModuleFilename并且仅适用于“asset”和“asset/resource”模块类型。<br />
   *
   *   outputPath：5.67.0+开始支持，相对于“output.path”发出指定文件夹中的资产。只有在指定自定义“publicPath”以匹配那里的文件夹结构时，才需要此选项。<br />
   *
   *   publicPath：5.28.0+开始支持，为特定资产模块定制publicPath，同output.publicPath。<br />
   *   }<br />
   *
   * asset/inline：内联资产模块的生成器选项。<br />
   *   {<br />
   *   dataUrl：同asset.dataUrl。<br />
   *   }<br />
   *
   * asset/resource：asset/resource模块的生成器选项。<br />
   *   {<br />
   *   emit：同asset.emit。<br />
   *
   *   filename：同asset.filename。<br />
   *
   *   outputPath：同asset.outputPath。<br />
   *
   *   publicPath：同asset.publicPath。<br />
   *   }<br />
   * }<br />
   *
   * 2、module.parser，5.12.0+开始支持，与module.generator类似，您可以使用module.parser在一个地方配置所有解析器的选项，目前有效的就下述5个顶级选项以及其他（其实就是某些解析器的选项）：<br />
   * {<br />
   * asset：资产模块的解析器选项。<br />
   *   {<br />
   *   dataUrlCondition：object，将资产内联为DataUrl的条件，其属性同module.generator.asset.dataUrl。<br />
   *   }<br />
   *
   * 'javascript/auto'：同上述的“javascript”。<br />
   *
   * 'javascript/dynamic'：同上述的“javascript”。<br />
   *
   * 'javascript/esm'：同上述的“javascript”。<br />
   *
   * javascript：object，javascript模块的解析器选项，下述选项不是全部的，太多了，我没全部记录。<br />
   *   {<br />
   *   commonjs：boolean，分析CommonJS语法。<br />
   *
   *   commonjsMagicComments：boolean，5.17.0+开始支持，分析CommonJS语法中的魔术注释，请注意，目前仅支持webpackIgnore注释。<br />
   *   1、如：const x = require(/星号 webpackIgnore: true 星号/ 'x');<br />
   *
   *   dynamicImportFetchPriority：'low' | 'high' | 'auto' | false，5.87.0+开始支持，为动态导入指定全局fetchPriority（详见：https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority）。
   *
   *   dynamicImportMode：string（只有4个内置值：'eager'、'weak'、'lazy'、'lazy-once'），5.73.0+开始支持，指定动态导入的全局模式。<br />
   *
   *   dynamicImportPrefetch：boolean、number（支持负数，估计是表示加载的优先顺序），5.73.0+开始支持，指定动态导入的全局预取。<br />
   *
   *   dynamicImportPreload：boolean、number（支持负数，估计是表示加载的优先顺序），5.73.0+开始支持，指定动态导入的全局预加载。<br />
   *
   *   exportsPresence：false、string（只有3个内置值：'error'、'warn'、'auto'），5.62.0+开始支持，指定“import ... from ...”和“export ... from ...”中无效导出名称的行为。<br />
   *
   *   exprContextCritical：boolean，为完全动态依赖项启用警告。<br />
   *
   *   exprContextRecursive：boolean，启用递归目录查找以获得完整的动态依赖项。<br />
   *
   *   exprContextRegExp：RegExp、boolean，为完全动态依赖项设置默认正则表达式。<br />
   *
   *   exprContextRequest：string，为完全动态依赖项设置默认请求。<br />
   *
   *   harmony：boolean，解析ECMAScript的模块语法。<br />
   *
   *   import：boolean，解析import()语法。<br />
   *
   *   importExportsPresence：false、string（只有3个内置值：'error'、'warn'、'auto'），5.62.0+开始支持，指定“import ... from ...”中无效导出名称的行为。<br />
   *
   *   importMeta：boolean，5.68.0+开始其支持，评估import.meta。<br />
   *
   *   importMetaContext：boolean，5.70.0+开始其支持，评估import.meta.webpackContext。<br />
   *
   *   node：同webpack的顶级选项node。<br />
   *
   *   reexportExportsPresence：false、string（只有3个内置值：'error'、'warn'、'auto'），5.62.0+开始支持，指定“export ... from ...”中无效导出名称的行为。在TypeScript中重新导出类型时，在从“export ... from ...”迁移到“export type ... from ...”期间禁用此功能可能很有用。<br />
   *
   *   requireContext：boolean，解析require.context语法。<br />
   *
   *   requireEnsure：boolean，解析require.ensure语法。<br />
   *
   *   requireInclude：boolean，解析require.include语法。<br />
   *
   *   requireJs：boolean，解析require.js的特殊语法，如：require.config、requirejs.config、require.version、requirejs.onError。<br />
   *
   *   strictExportPresence：boolean，同上述的exportsPresence选项，已弃用，推荐使用exportsPresence选项代替该选项。<br />
   *
   *   strictThisContextOnImports：boolean，根据命名空间对象的规范正确处理此上下文。<br />
   *
   *   system：boolean，解析System.js的特殊语法，如：System.import、System.get、System.set、System.register。<br />
   *
   *   url：boolean、string（仅有一个内置值'relative'），解析new URL()语法。<br />
   *   1、'relative'值在webpack 5.23.0及其以上版本启用，使用时，webpack将为 new URL()语法生成相对URL，结果URL中不包含基本URL。<br />
   *   如：<br />
   *   使用'relative'时，<img src='c43188443804f1b1f534.svg' /> <br />
   *   不用'relative'时，<img src='file:///path/to/project/dist/c43188443804f1b1f534.svg' /> <br />
   *   2、当服务器不知道基本URL时，这对于SSR（服务器端渲染）很有用（并且它节省了几个字节）。为了相同，它还必须用于客户端构建。<br />
   *   3、也适用于通常需要服务器端渲染的静态站点生成器、mini-css-plugin和html-plugin等等。<br />
   *   }<br />
   * }<br />
   *
   * 3、module.unsafeCache，缓存模块请求的解析，有效值类型：boolean、function（function (module)）。<br />
   *
   * 4、为include、exclude选项设置值时，需要注意：<br />
   * path.resolve(__dirname, 'app/styles')，没加'/'将匹配`app/styles.css`、`app/styles/styles.css`、`app/stylesheet.css`。<br />
   * path.resolve(__dirname, 'vendor/styles/')，加'/'将仅包含目录`vendor/styles/`的内容。<br />
   *
   * @type {function}
   */
  moduleConfig = ( {
    MiniCssExtractPlugin = null,
  } = {} ) => {
    // 不通过webpack处理css中以如下设置的值开头的url。
    const cssLoader_url_import_IgnoreArr = cssLoader_url_import_IgnoreHandle( experimentsConfig, isHandle_experiments_buildHttp_in_CSSLoader );

    const exclude001 = [
      join( __dirname, './.git/' ),
      join( __dirname, './.idea/' ),
      join( __dirname, './assist_tools/' ),
      join( __dirname, './backups/' ),
      join( __dirname, './bats/' ),
      join( __dirname, './configures/' ),
      join( __dirname, './dist/' ),
      join( __dirname, './log/' ),
      join( __dirname, './notes/' ),
      join( __dirname, './read_me/' ),
      join( __dirname, './simulation_servers/' ),
      // join( __dirname, './subsystems/' ),
      join( __dirname, './test/' ),
      join( __dirname, './ts_compiled/' ),
      join( __dirname, './webpack_records/' ),
    ];

    const babelParserPlugins = [
        // Language extensions Start

        /**
         * 1、["pipelineOperator", { proposal: "hack" }]跟插件“placeholders”有冲突，二者只能取其一。
         * 2、placeholders跟v8intrinsic不能同时使用。
         */
        // 'placeholders',
        /**
         * 1、["pipelineOperator", { proposal: "hack" }]跟插件“v8intrinsic”有冲突，二者只能取其一。
         * 2、placeholders跟v8intrinsic不能同时使用。
         */
        // 'v8intrinsic',
        // flow跟typescript不能同时使用。
        /*
         [
         'flow',
         {
         // 默认值为：false。
         all: false,
         enums: true,
         },
         ],
         */
        // flow跟typescript不能同时使用。
        [
          'typescript',
          {
            // 默认值为：false。
            dts: false,
            // 默认值为：false。
            disallowAmbiguousJSXLike: false,
          },
        ],
        'flowComments',
        'jsx',

        // Language extensions End

        // ECMAScript proposals Start

        'doExpressions',
        'explicitResourceManagement',
        // asyncDoExpressions依赖上面的doExpressions。
        'asyncDoExpressions',
        'decimal',
        // decorators和decorators-legacy不能同时使用，建议使用decorators。
        // 'decorators-legacy',
        // decorators和decorators-legacy不能同时使用，建议使用decorators。
        [
          'decorators',
          {
            // 在2022年3月的TC39会议上就Stage 3达成共识的提案版本要求decoratorsBeforeExport为false，allowCallParenthesized也为false。
            decoratorsBeforeExport: false,
            // 在2022年3月的TC39会议上就Stage 3达成共识的提案版本要求decoratorsBeforeExport为false，allowCallParenthesized也为false。
            allowCallParenthesized: false,
          },
        ],
        'decoratorAutoAccessors',
        /**
         * 提案见：https://github.com/tc39/proposal-defer-import-eval
         * 例子：import defer * as ns from "dep";
         */
        'deferredImportEvaluation',
        'destructuringPrivate',
        'exportDefaultFrom',
        'functionBind',
        'importReflection',
        // importAssertions跟moduleAttributes不能同时使用，且importAssertions已经取代了moduleAttributes。
        /*
         [
         'moduleAttributes',
         {
         version: 'may-2020',
         },
         ],
         */
        'moduleBlocks',
        /**
         * 提案：https://github.com/tc39/proposal-optional-chaining-assignment
         * 例子：x?.prop = 2
         */
        [
          'optionalChainingAssign',
          {
            version: '2023-07',
          },
        ],
        'partialApplication',
        [
          'pipelineOperator',
          {
            /**
             * 1、["pipelineOperator", { proposal: "smart" }]跟["recordAndtuple", { syntaxType: "hash"}]有冲突，二者只能取其一。
             * 2、["pipelineOperator", { proposal: "hack" }]跟插件“placeholders”有冲突，二者只能取其一。
             * 3、["pipelineOperator", { proposal: "hack" }]跟插件“v8intrinsic”有冲突，二者只能取其一。
             * 4、["pipelineOperator", { proposal: "hack", topicToken: "#" }]跟["recordAndtuple", { syntaxType: "hash"}]有冲突，二者只能取其一。
             */
            proposal: 'hack',
            /**
             * 1、["pipelineOperator", { proposal: "hack", topicToken: "#" }]跟["recordAndtuple", { syntaxType: "hash"}]有冲突，二者只能取其一。
             */
            topicToken: '^^',
          },
        ],
        [
          'recordAndTuple',
          {
            /**
             * 1、["pipelineOperator", { proposal: "hack", topicToken: "#" }]跟["recordAndtuple", { syntaxType: "hash"}]有冲突，二者只能取其一。
             * 2、["pipelineOperator", { proposal: "smart" }]跟["recordAndtuple", { syntaxType: "hash"}]有冲突，二者只能取其一。
             */
            syntaxType: 'hash',
          },
        ],
        /**
         * 提案：https://github.com/tc39/proposal-source-phase-imports
         * 例子：import source x from "./x"
         */
        'sourcePhaseImports',
        'throwExpressions',
        'importMeta',
        [
          'estree',
          {
            classFeatures: true,
          },
        ],
        // importAssertions跟moduleAttributes不能同时使用，且importAssertions已经取代了moduleAttributes。
        // 'importAssertions',
        // deprecatedImportAssert同importAssertions。
        // 'deprecatedImportAssert',

        // ECMAScript proposals End

        // Latest ECMAScript features Start

        'asyncGenerators',
        'bigInt',
        'classPrivateMethods',
        'classPrivateProperties',
        'classProperties',
        // Enabled by default
        'classStaticBlock',
        'dynamicImport',
        // deprecated
        'exportNamespaceFrom',
        'functionSent',
        'logicalAssignment',
        'moduleStringNames',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        // Enabled by default
        'privateIn',
        'regexpUnicodeSets',
        'topLevelAwait',
        // importAttributes已经取代了importAssertions。
        [
          'importAttributes',
          {
            deprecatedAssertSyntax: true,
          },
        ],

        // Latest ECMAScript features End
      ],
      // 注意插件之间的顺序！插件的执行是从上往下。
      babelPlugins = [
        /**
         * 关于插件的注意事项：<br />
         * 1、@babel/plugin-transform-runtime已经包含了@babel/plugin-external-helpers的功能了，用@babel/plugin-transform-runtime就好，不需要再手动明确使用@babel/plugin-external-helpers。<br />
         * 2、注意：@babel/preset-env不会包含任何低于第3阶段的JavaScript语法提案，因为在TC39流程的那个阶段，无论如何它都不会被任何浏览器实现。如果需要它，需要手动包含在内。<br />
         */

        /**
         * @babel/plugin-transform-runtime：https://babeljs.io/docs/en/babel-plugin-transform-runtime
         * 1、一个插件，可以重用Babel的注入帮助代码以节省代码大小。<br />
         * 2、转换插件通常仅在开发中使用，但运行时本身将取决于您部署的代码。<br />
         * 3、Babel使用非常小的助手来处理常见的功能，例如_extend。默认情况下，这将添加到需要它的每个文件中。这种重复有时是不必要的，尤其是当您的应用程序分布在多个文件中时。<br />
         * 4、这就是@babel/plugin-transform-runtime插件的用武之地：所有的助手都将引用模块@babel/runtime以避免编译输出的重复。运行时将编译到您的构建中。<br />
         * 5、这个转换器的另一个目的是为您的代码创建一个沙盒环境。如果直接导入core-js或@babel/polyfill以及它提供的Promise、Set和Map等内置函数，会污染全局作用域。<br />
         */
        [
          '@babel/plugin-transform-runtime',
          {
            // 这个选项在v7中被删除，只是将其设为默认值。
            // polyfill: null,其实我也不知道它的值类型。
            // 这个选项在v7中被删除，只是将其设为默认值。
            // useBuiltIns: null,其实我也不知道它的值类型。
            // 值类型：boolean，默认值：false，从v 7.13.0版本开始此选项已被弃用。
            // useESModules: false,

            corejs: {
              version: 3,
              proposals: true,
            },
            version: ( () => {
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
            } )() || '7.26.0',
            helpers: true,
            // 切换生成器函数是否转换为使用不污染全局范围的再生器运行时。
            regenerator: true,
            absoluteRuntime: false,
          },
        ],

        /**
         * babel-plugin-transform-jsbi-to-bigint：https://github.com/GoogleChromeLabs/babel-plugin-transform-jsbi-to-bigint
         * 1、将在当今环境中工作的JSBI代码编译为本机BigInt代码。<br />
         * 2、除非明确目标浏览器支持bigint语法，否则不要使用该插件。<br />
         * 3、如果未来babel支持对bigint进行语法转译，则可以启用该插件，当前babel只支持bigint语法上的识别，不进行bigint转译。<br />
         * 4、该插件要在@babel/plugin-syntax-bigint之前，如果未来babel出了bigint语法转译插件，也要保证该插件在其之前。<br />
         */
        ...( isEnable => {
          return isEnable
                 ? [
              [
                'babel-plugin-transform-jsbi-to-bigint',
              ],
            ]
                 : [];
        } )( false ),

        // Bugfix Start

        /**
         * @babel/plugin-bugfix-firefox-class-in-computed-class-key：https://babeljs.io/docs/babel-plugin-bugfix-firefox-class-in-computed-class-key
         * 1、此错误修复插件可转换其他类的计算键内的类，以解决 SpiderMonkey 在私有类元素方面的一个错误。<br />
         * 2、该插件包含在 @babel/preset-env 中，当目标受浏览器 bug 影响时，Babel 会自动为您启用该插件。<br />
         * 3、版本早于 5.30.2 的 Terser 会取消此插件所做的转换。 请确保至少使用 5.30.2 版，或将 Terser 的 compress.inline 选项设为 false。<br />
         */
        ...( isEnable => {
          return isEnable
                 ? [
              [
                '@babel/plugin-bugfix-firefox-class-in-computed-class-key',
              ],
            ]
                 : [];
        } )( false ),

        /**
         * @babel/plugin-bugfix-safari-class-field-initializer-scope：https://babeljs.io/docs/babel-plugin-bugfix-safari-class-field-initializer-scope
         * 1、此错误修复插件用 IIFE 封装了一些类字段初始化程序，以解决影响 Safari 15 的 WebKit 错误。<br />
         * 2、该插件包含在 @babel/preset-env 中，当目标受浏览器 bug 影响时，Babel 会自动为您启用该插件。<br />
         * 3、版本早于 5.30.2 的 Terser 会取消此插件所做的转换。 请确保至少使用 5.30.2 版，或将 Terser 的 compress.inline 选项设为 false。<br />
         */
        ...( isEnable => {
          return isEnable
                 ? [
              [
                '@babel/plugin-bugfix-safari-class-field-initializer-scope',
              ],
            ]
                 : [];
        } )( false ),

        /**
         * @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression：https://babeljs.io/docs/babel-plugin-bugfix-safari-id-destructuring-collision-in-function-expression
         * 1、这个错误修复插件重新命名了结构化参数，以解决影响10至16.2版本的Safari浏览器的一个错误。该插件所要解决的BUG描述见：https://bugs.webkit.org/show_bug.cgi?id=220517。<br />
         * 2、主要描述：<br />
         * 可以正常工作的写法：
         * function a({ test: a }) { console.log(a); }
         * let b = a;
         *
         * 不可以正常工作，且会报语法错误的写法：Duplicate parameter <name> not allowed in function with destructuring parameters.
         * let b = function a({ test: a }) { console.log(a); };
         * 3、这个插件包含在@babel/preset-env中。将bugfixes选项设置为true，这样当你的目标受到浏览器bug影响时，Babel会自动为你启用这个插件。
         */
        ...( isEnable => {
          return isEnable
                 ? [
              [
                '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression',
              ],
            ]
                 : [];
        } )( false ),

        /**
         * @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining：https://babeljs.io/docs/babel-plugin-bugfix-v8-spread-parameters-in-optional-chaining
         * 1、这个bugfix插件转换了可选的链式运算符, 以解决一个影响8.0至9.0版本的V8 bug。该插件所要解决的BUG描述见：https://bugs.chromium.org/p/v8/issues/detail?id=11558。<br />
         * 2、主要描述：TypeError: Function.prototype.apply was called on undefined, which is a undefined and not a function.<br />
         * Input: undefined?.(...[], 1)
         * Output（报错）:
         * undefined?.(...[], 1)
         * 3、这个插件包含在@babel/preset-env中。将bugfixes选项设置为true，这样当你的目标受到浏览器bug影响时，Babel会自动为你启用这个插件。
         */
        ...( isEnable => {
          return isEnable
                 ? [
              [
                '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining',
              ],
            ]
                 : [];
        } )( false ),

        // Bugfix End

        // TC39 Proposals（除非以后这些插件被列入正式语法，否则都还是要显示手动启用这些，因为@babel/preset-env不处理这些较前沿的提案语法） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-syntax-import-reflection：https://babeljs.io/docs/babel-plugin-syntax-import-reflection
               * 1、此插件仅使Babel能够解析这种语法。Babel不支持转换这种语法。
               * 2、此插件使Babel能够解析导入反射：
               * import module foo from "./foo.wasm";
               */
              [
                '@babel/plugin-syntax-import-reflection',
              ],

              // 处于提案第1阶段！
              /**
               * @babel/plugin-syntax-decimal：https://github.com/tc39/proposal-decimal
               * 1、目前该提案处于第1阶段，且目前babel只有识别它的语法插件，还没有转换它的插件。<br />
               */
              [
                '@babel/plugin-syntax-decimal',
              ],
              /**
               * @babel/plugin-proposal-do-expressions：https://babeljs.io/docs/babel-plugin-proposal-do-expressions、https://github.com/tc39/proposal-do-expressions
               * 1、目前该提案处于第1阶段，需要手动包含该插件才会转译该提案的代码。<br />
               * 2、它可以看作是三元运算符的复杂版本。<br />
               */
              [
                '@babel/plugin-proposal-do-expressions',
              ],
              /**
               * @babel/plugin-proposal-async-do-expressions：https://babeljs.io/docs/babel-plugin-proposal-async-do-expressions、https://github.com/tc39/proposal-async-do-expressions
               * 1、目前该提案处于第1阶段，需要手动包含该插件才会转译该提案的代码。<br />
               * 2、该插件需要在@babel/plugin-transform-async-to-generator之前。<br />
               */
              [
                '@babel/plugin-proposal-async-do-expressions',
              ],
              /**
               * @babel/plugin-proposal-export-default-from：https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from、https://github.com/leebyron/ecmascript-export-default-from
               * 1、目前该提案处于第1阶段，需要手动包含该插件才会转译该提案的代码。<br />
               */
              [
                '@babel/plugin-proposal-export-default-from',
              ],
              /**
               * @babel/plugin-proposal-partial-application：https://babeljs.io/docs/en/babel-plugin-proposal-partial-application、https://github.com/tc39/proposal-partial-application
               * 1、目前该提案处于第1阶段，需要手动包含该插件才会转译该提案的代码。<br />
               */
              [
                '@babel/plugin-proposal-partial-application',
              ],
              /**
               * @babel/plugin-proposal-optional-chaining-assign：https://babeljs.io/docs/babel-plugin-proposal-optional-chaining-assign、https://github.com/tc39/proposal-optional-chaining-assignment
               * 1、目前该提案处于第1阶段，需要手动包含该插件才会转译该提案的代码。<br />
               */
              [
                '@babel/plugin-proposal-optional-chaining-assign',
                {
                  /**
                   * “2023-07”：第 1 阶段提案，定义在 tc39/proposal-optional-chaining-assignment@49d055c44b，于 2023 年 7 月 TC39 会议上提出。见：https://github.com/tc39/proposal-optional-chaining-assignment/commit/e7b48795b66a8196b1abcab2e52e2049d055c44b
                   */
                  version: '2023-07',
                },
              ],

              // 处于提案第2阶段！
              /**
               * @babel/plugin-proposal-import-defer：https://babeljs.io/docs/babel-plugin-proposal-import-defer、https://github.com/tc39/proposal-defer-import-eval/
               * 1、目前该提案处于第2.7阶段。<br />
               * 2、将导入延迟声明转换为延迟的 require() 调用。<br />
               * 3、此插件仅在将模块编译为 CommonJS 时才可使用。<br />
               * 4、该插件需要保证在“@babel/plugin-transform-modules-commonjs”之前被引用，如：
               * [ '@babel/plugin-proposal-import-defer', '@babel/plugin-transform-modules-commonjs', ]
               */
              /*
               [
               '@babel/plugin-proposal-import-defer',
               ],
               */
              /**
               * @babel/plugin-proposal-function-sent：https://babeljs.io/docs/en/babel-plugin-proposal-function-sent、https://github.com/tc39/proposal-function.sent
               * 1、目前该提案处于第2阶段，需要手动包含该插件才会转译该提案的代码。<br />
               */
              [
                '@babel/plugin-proposal-function-sent',
              ],
              /**
               * @babel/plugin-proposal-pipeline-operator：https://babeljs.io/docs/en/babel-plugin-proposal-pipeline-operator、https://github.com/tc39/proposal-pipeline-operator
               * 1、“pipeline operator”有几个相互竞争的提议。使用所需的“proposal”选项配置要使用的提案。默认情况下，它的值是'hack'。<br />
               * 2、如果proposal选项被省略，或者如果proposal: 'hack'，还必须包含："topicToken": "^^"、"topicToken": "^"、"topicToken": "#"、"topicToken": "%"、"topicToken": "@@"。<br />
               * 3、"proposal": "minimal"、"fsharp"、"smart"这3个选项值已被弃用，并可能在未来的主要版本中被删除。<br />
               * 4、目前该提案处于第2阶段，需要手动包含该插件才会转译该提案的代码。<br />
               */
              [
                '@babel/plugin-proposal-pipeline-operator',
                {
                  proposal: 'hack',
                  topicToken: '^^',
                },
              ],
              /**
               * @babel/plugin-proposal-record-and-tuple：https://babeljs.io/docs/en/babel-plugin-proposal-record-and-tuple、https://github.com/tc39/proposal-record-tuple
               * 1、目前该提案处于第2阶段，需要手动包含该插件才会转译该提案的代码。<br />
               */
              [
                '@babel/plugin-proposal-record-and-tuple',
                {
                  /**
                   * 默认情况下，此插件仅使用Record和Tuple全局变量转换提案语法。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、您需要加载一个polyfill，或者您可以传递"importPolyfill": true选项以将导入注入到由提案作者维护的@bloomberg/record-tuple-polyfill。<br />
                   */
                  importPolyfill: true,
                  /**
                   * 如果您希望将导入注入到不同于@bloomberg/record-tuple-polyfill的polyfill，您可以使用此选项指定其名称。<br />
                   * 1、值类型：string，默认值："@bloomberg/record-tuple-polyfill"。<br />
                   */
                  polyfillModuleName: '@bloomberg/record-tuple-polyfill',

                  // 该选项貌似不再被使用了。目前先注释掉吧！
                  // syntaxType: 'hash',
                },
              ],
              /**
               * @babel/plugin-proposal-throw-expressions：https://babeljs.io/docs/en/babel-plugin-proposal-throw-expressions、https://github.com/tc39/proposal-throw-expressions
               * 1、目前该提案处于第2阶段，需要手动包含该插件才会转译该提案的代码。<br />
               */
              [
                '@babel/plugin-proposal-throw-expressions',
              ],
              /**
               * @babel/plugin-proposal-destructuring-private：https://babeljs.io/docs/babel-plugin-proposal-destructuring-private、https://github.com/tc39/proposal-destructuring-private
               * 1、目前该提案处于第2阶段，需要手动包含该插件才会转译该提案的代码。<br />
               * 2、该插件需要在@babel/plugin-proposal-class-properties之前。<br />
               */
              [
                '@babel/plugin-proposal-destructuring-private',
              ],
              /**
               * @babel/plugin-proposal-import-attributes-to-assertions：https://babeljs.io/docs/babel-plugin-proposal-import-attributes-to-assertions
               * 1、该插件生成的代码将与当前的ECMAScript规范或任何当前提议的新增规范不兼容。<br />
               * 2、只有当您正在发布本地ES模块，
               * 并且只需要与不支持导入属性语法(import pkg from "./package.json" with { type: "json" })，
               * 但支持旧的导入断言语法(import pkg from "./package.json" assert { type: "json" })的工具兼容时，才会使用该插件，
               * 例如：Chrome 91 - 122、Node.js ^16.14 || ^18 || ^20 < 20.10。<br />
               * 3、该插件会将最新的规范<br />
               * import pkg from "./package.json" with { type: "json" }
               * 转为旧的规范<br />
               * import pkg from "./package.json" assert { type: "json" }
               * 4、目前，个人建议不启用该插件。<br />
               * 5、关于废弃旧的“assert”提案详细见：<br />
               * https://tc39.es/proposal-import-attributes/#sec-deprecated-assert-keyword-for-import-attributes
               */
              /*
               [
               '@babel/plugin-proposal-import-attributes-to-assertions',
               ],
               */

              // 处于提案第3阶段！
              /**
               * @babel/plugin-proposal-decorators：https://babeljs.io/docs/babel-plugin-proposal-decorators、https://github.com/tc39/proposal-decorators
               * 1、如果您手动包含插件并使用@babel/plugin-proposal-class-properties，请确保@babel/plugin-proposal-decorators位于@babel/plugin-proposal-class-properties之前。<br />
               * 2、目前该提案处于第3阶段。<br />
               */
              [
                '@babel/plugin-proposal-decorators',
                {
                  /**
                   * 从v7.17.0开始添加这个新的version选项，有效值有：'2023-11'、'2023-05'、'2023-01'、'2022-03'、'2021-12'、'2018-09'（为默认值）、'legacy'。<br />
                   * 1、'legacy'：是最初的Stage 1提案，见：https://github.com/wycats/javascript-decorators/blob/e1bf8d41bfa2591d949dd3bbf013514c8904b913/README.md、https://github.com/babel/babel/issues/8864#issuecomment-688535867。<br />
                   * 2、'2018-09'：是最初提升到第2阶段的提案版本，于2018年9月提交给TC39，见：https://github.com/tc39/proposal-decorators/tree/7fa580b40f2c19c561511ea2c978e307ae689a1b。<br />
                   * 3、'2021-12'：是2021年12月提交给TC39的提案版本，见：https://github.com/tc39/proposal-decorators/tree/d6c056fa061646178c34f361bad33d583316dc85。<br />
                   * 4、'2022-03'：是在2022年3月的TC39会议上就Stage 3达成共识的提案版本，见：https://github.com/tc39/proposal-decorators/tree/8ca65c046dd5e9aa3846a1fe5df343a6f7efd9f8。<br />
                   * 5、'2023-01'：是在2023年1月TC39会议上达成共识的更新后的建议版本，见：https://github.com/pzuraq/ecma262/pull/4。<br />
                   * 6、'2023-05'：是在2023年3月和5月TC39会议上达成共识的更新后的提案版本，见：https://github.com/pzuraq/ecma262/compare/e86128e13b63a3c2efc3728f76c8332756752b02...c4465e44d514c6c1dba810487ec2721ccd6b08f9。<br />
                   * 7、'2023-11'：是在2023年11月TC30会议上达成共识的更新后的提案版本，其中纳入了这一变更，见：https://github.com/pzuraq/ecma262/pull/12。<br />
                   * 8、当取'legacy'值时，要保证该插件在@babel/plugin-proposal-class-properties之前。<br />
                   * 9、Babel 8仅支持'2023-11'和'legacy'，如果您正在使用不同的装饰器版本，建议迁移到'2023-11'。<br />
                   */
                  version: '2023-11',
                  /**
                   * 添加此选项是为了帮助tc39通过允许对两种可能的语法进行试验来收集来自社区的反馈。<br />
                   * 1、当上面的version选项值为"legacy"时，该选项被禁用，也就是说该选项不能设置。<br />
                   * 2、当上面的version选项值为"2018-09"时，该选项被启用，设置成true或false都行。<br />
                   * 3、当上面的version选项值为"2021-12"时，该选项是可选的，设置成true或false都行，且默认值为false。<br />
                   * 4、当上面的version选项值为"2022-03"、"2023-01"、'2023-05'时，该选项被禁用，也就是说该选项不能设置。<br />
                   * 5、从最新的源码中可知当该选项值为undefined时，上面的version选项值为"2021-12"和"2022-03"时，会被设置为false。<br />
                   * 6、从最新的源码中可知当该选项值为undefined时，上面的version为"2018-09"或未指定时，会通过抛出异常错误来提示该选项值类型必须为布尔类型，也就是设置为true或false。<br />
                   * 7、从最新的源码中可知当该选项值不为undefined时，上面的version选项值为"legacy"和"2022-03"、"2023-01"时，会抛出异常错误。<br />
                   */
                  // decoratorsBeforeExport: true,

                  // 已弃用：改用version: "legacy"。此选项是旧别名。
                  // legacy: false,
                },
              ],
              /**
               * @babel/plugin-proposal-explicit-resource-management：https://babeljs.io/docs/babel-plugin-proposal-explicit-resource-management
               * 1、目前该提案处于第3阶段。<br />
               * 2、详细提案见：<br />
               * https://github.com/tc39/proposal-explicit-resource-management
               * 异步的提案：https://github.com/tc39/proposal-async-explicit-resource-management
               */
              [
                '@babel/plugin-proposal-explicit-resource-management',
              ],
              /**
               * @babel/plugin-proposal-import-wasm-source：https://babeljs.io/docs/babel-plugin-proposal-import-wasm-source、https://github.com/tc39/proposal-source-phase-imports/
               * 1、目前该提案处于第3阶段。<br />
               * 2、将模块编译为AMD、SystemJS或UMD时，不能使用此插件。<br />
               * 3、使用例子：<br />
               * import source libMod from "./lib.wasm";
               * 注意，前面的新的关键字“source”，“import source”才是完整的导入语法。<br />
               */
              [
                '@babel/plugin-proposal-import-wasm-source',
              ],
              /**
               * @babel/plugin-syntax-module-blocks：https://github.com/tc39/proposal-module-expressions
               * 1、目前该提案处于第3阶段，且目前babel只有识别它的语法插件，还没有转换它的插件。<br />
               */
              [
                '@babel/plugin-syntax-module-blocks',
              ],

              // 处于无效提案，但是有新的替代提案处于讨论中！
              /**
               * @babel/plugin-proposal-function-bind：https://babeljs.io/docs/babel-plugin-proposal-function-bind、https://github.com/zenparsing/es-function-bind、https://babeljs.io/blog/2015/05/14/function-bind
               * 1、该提案目前已无效，但是有3个包含该提案的新提案。<br />
               * 2、详细见：<br />
               * https://github.com/tc39/proposal-bind-operator
               * https://babeljs.io/blog/2015/05/14/function-bind
               */
              [
                '@babel/plugin-proposal-function-bind',
              ],
            ]
                 : [];
        } )( true ),
        // TC39 Proposals（除非以后这些插件被列入正式语法，否则都还是要显示手动启用这些，因为@babel/preset-env不处理这些较前沿的提案语法） End

        // ES2025（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-duplicate-named-capturing-groups-regex：https://babeljs.io/docs/babel-plugin-transform-duplicate-named-capturing-groups-regex、https://github.com/tc39/proposal-duplicate-named-capturing-groups
               * 1、注意：这个插件生成需要ES6正则表达式功能的代码。<br />
               * 2、如果您需要支持旧版浏览器，请使用runtime: false选项或导入适当的polyfill（例如：core-js）。<br />
               */
              [
                '@babel/plugin-transform-duplicate-named-capturing-groups-regex',
                {
                  /**
                   * 当这个选项被禁用时，Babel不会使用_wrapRegExp帮助器包装RegExps。输出仅支持内部组引用，不支持运行时属性。<br />
                   * 1、值类型：boolean，默认值：true。<br />
                   */
                  runtime: true,
                },
              ],
              /**
               * @babel/plugin-transform-json-modules：https://babeljs.io/docs/babel-plugin-transform-json-modules
               * 1、详细提案见：<br />
               * https://github.com/tc39/proposal-json-modules/
               * 2、将“import ... with { type: "json" }”声明转换为特定平台的API，以读取并“JSON.parse”导入的文件。<br />
               * 3、将模块编译为AMD、SystemJS或UMD时，不能使用此插件。<br />
               * 4、该插件只转换“import”标记，不转换动态“import()”调用。<br />
               * 5、使用例子：<br />
               * 输入：
               * import data from "./data.json" with { type: "json" };
               * 将转换为：
               * Browsers：
               * const data = await fetch(import.meta.resolve("./data.json")).then(r => r.json());
               * Node.js (ESM)：
               * import { readFileSync as _readFileSync } from "fs";
               * const data = JSON.parse(_readFileSync(new URL(import.meta.resolve("./data.json"))));
               * Node.js (CommonJS)：
               * "use strict";
               * const data = JSON.parse(require("fs").readFileSync(require.resolve("./data.json")));
               * Browsers and Node.js (ESM)：
               * const data = await (
               *   typeof process === "object" && process.versions?.node
               *     ? import("fs").then(fs => fs.promises.readFile(new URL(import.meta.resolve("./data.json")))).then(JSON.parse)
               *     : fetch(import.meta.resolve("./data.json")).then(r => r.json())
               * );
               */
              [
                '@babel/plugin-transform-json-modules',
                {
                  /**
                   * 1、默认值为：false，值类型为：boolean。<br />
                   * 2、babel v7.25.0时，增加的该选项。<br />
                   * 3、设置为"true"时，插件将直接使用require来导入JSON文件，从而生成更简单的输出。
                   * 在以CommonJS为目标时，该选项会导致输出更易于分析捆绑程序，但不会检查导入的模块是否真的是JSON。<br />
                   * 例子：
                   * 输入：
                   * import data from "./data.json" with { type: "json" };
                   * 输出(没有uncheckedRequire: true)：
                   * const data = JSON.parse(require("fs").readFileSync(require.resolve("./data.json")));
                   * 输出(有uncheckedRequire: true)：
                   * const data = require("./data.json");
                   */
                  uncheckedRequire: false,
                },
              ],
              /**
               * @babel/plugin-transform-regexp-modifiers：https://github.com/tc39/transform-regexp-modifiers
               */
              [
                '@babel/plugin-transform-regexp-modifiers',
              ],
              /**
               * @babel/plugin-syntax-import-attributes：https://babeljs.io/docs/babel-plugin-syntax-import-attributes
               * 1、此插件仅使Babel能够解析这种语法，Babel不支持转换这种语法。<br />
               * import pkg from "./package.json" with { type: "json" }，很强大的提案，可以前往提案的文档详细了解！<br />
               * 虽然，Babel自7.25.0版起默认支持解析导入属性，但仍需要该插件才能让Babel在生成代码时选择正确的语法。
               * 作为该插件的替代，您可以使用@babel/generator的importAttributesKeyword选项：{ generatorOpts: { importAttributesKeyword: 'with', }, }
               * 2、详细提案见：<br />
               * https://github.com/tc39/proposal-import-attributes（https://github.com/tc39/proposal-import-assertions也会指向https://github.com/tc39/proposal-import-attributes这个网址）。<br />
               * https://github.com/tc39/proposal-json-modules，该提案是从https://github.com/tc39/proposal-import-attributes提案单独分出来的。<br />
               * 3、关于废弃旧的“assert”提案详细见：<br />
               * https://tc39.es/proposal-import-attributes/#sec-deprecated-assert-keyword-for-import-attributes
               */
              [
                '@babel/plugin-syntax-import-attributes',
                {
                  /**
                   * 1、默认值为：false。<br />
                   * 2、如果启用，支持使用废弃的assert关键字解析导入属性：<br />
                   * import foo from "./foo.json" assert { type: "json" };
                   * “assert”这种语法只在基于V8的引擎中支持，目前正在调查将其从WEB中移除，使用更为规范的“with”提案，其很强大的提案，可以前往“with”提案（https://github.com/tc39/proposal-import-attributes）的文档详细了解！<br />
                   */
                  deprecatedAssertSyntax: true,
                },
              ],
            ]
                 : [];
        } )( false ),
        // ES2025（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2024（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-unicode-sets-regex：https://babeljs.io/docs/babel-plugin-transform-unicode-sets-regex
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2024中。<br />
               * 2、这个插件将使用v标志的正则表达式（由RegExp set notation + properties of strings提案引入）转换为使用u标志的正则表达式。<br />
               */
              [
                '@babel/plugin-transform-unicode-sets-regex',
              ],
            ]
                 : [];
        } )( false ),
        // ES2024（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2022、ES2023（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-class-static-block：https://babeljs.io/docs/babel-plugin-transform-class-static-block
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2022。<br />
               * 2、具有静态块的类将被转换为静态私有属性，其初始化程序是包装在IIAFE（立即调用箭头函数表达式）中的静态块。<br />
               * 3、因为输出代码包含私有类属性，如果你已经在使用其他类特性插件（例如`@babel/plugin-proposal-class-properties），一定要把它放在其他的前面。<br />
               */
              [
                '@babel/plugin-transform-class-static-block',
              ],
              /**
               * @babel/plugin-transform-private-methods：https://babeljs.io/docs/babel-plugin-transform-private-methods
               */
              [
                '@babel/plugin-transform-private-methods',
                {
                  /**
                   * 1、注意：松散模式的配置设置必须与@babel/plugin-transform-class-properties相同。
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-transform-class-properties：https://babeljs.io/docs/babel-plugin-transform-class-properties
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2022。<br />
               * 2、该插件已经包含了语法：<br />
               * https://github.com/tc39/proposal-private-methods<br />
               * https://github.com/tc39/proposal-class-fields<br />
               * https://github.com/tc39/proposal-static-class-features<br />
               * 3、插件@babel/plugin-proposal-private-methods（https://babeljs.io/docs/en/babel-plugin-proposal-private-methods）也合并到该插件中。<br />
               */
              [
                '@babel/plugin-transform-class-properties',
                {
                  /**
                   * 如果为true，则编译类属性以使用赋值表达式而不是Object.defineProperty。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的setPublicClassFields选项。<br />
                   * 3、loose: true等同于"setPublicClassFields": true。<br />
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-transform-private-property-in-object：https://babeljs.io/docs/babel-plugin-transform-private-property-in-object
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2022。<br />
               */
              [
                '@babel/plugin-transform-private-property-in-object',
                {
                  /**
                   * 当为true时，表达式中的私有属性将检查对象上自己的属性（而不是继承的属性），而不是检查WeakSet中是否存在。这会提高性能和调试（普通属性访问与.get()），但代价是可能通过Object.getOwnPropertyNames等方式泄漏“私有”。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的privateFieldsAsProperties选项。<br />
                   * 3、loose: true等同于"privateFieldsAsProperties": true且"setPublicClassFields": true。<br />
                   * 4、注意：松散模式配置设置必须与@babel/proposal-class-properties相同。
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-syntax-top-level-await：https://babeljs.io/docs/babel-plugin-syntax-top-level-await
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2022。<br />
               * 2、此插件仅启用对此功能的语法解析。Babel目前还不支持转换顶层await，但是你可以使用Rollup的experimentalTopLevelAwait或webpack@5的experiments.topLevelAwait选项。<br />
               */
              [
                '@babel/plugin-syntax-top-level-await',
              ],
            ]
                 : [];
        } )( false ),
        // ES2022、ES2023（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2021（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-logical-assignment-operators：https://babeljs.io/docs/babel-plugin-transform-logical-assignment-operators
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2021。<br />
               */
              [
                '@babel/plugin-transform-logical-assignment-operators',
              ],
              /**
               * @babel/plugin-transform-numeric-separator：https://babeljs.io/docs/babel-plugin-transform-numeric-separator
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2021。<br />
               * 2、八进制非常适合权限，但以0o0000形式表示时也更好看。这里的分隔符没有真正的好处。<br />
               * 3、如果您需要进一步将ES2015十进制、二进制、十六进制和八进制数字表示编译为ES2015之前的数字文字形式，请添加“@babel/plugin-transform-literals”插件。<br />
               * 4、@babel/plugin-transform-literals已经包含在@babel/preset-env和@babel/preset-es2015中。<br />
               * 5、@babel/plugin-transform-literals得在@babel/plugin-proposal-numeric-separator之后。<br />
               */
              [
                '@babel/plugin-transform-numeric-separator',
              ],
            ]
                 : [];
        } )( false ),
        // ES2021（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2020（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-export-namespace-from：https://babeljs.io/docs/babel-plugin-transform-export-namespace-from、https://github.com/leebyron/ecmascript-export-ns-from
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2020。<br />
               */
              [
                '@babel/plugin-transform-export-namespace-from',
              ],
              /**
               * @babel/plugin-transform-nullish-coalescing-operator：https://babeljs.io/docs/babel-plugin-transform-nullish-coalescing-operator、https://github.com/tc39-transfer/proposal-nullish-coalescing
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2020。<br />
               * 2、注意：我们不能在这里使用!=null因为document.all==null并且document.all被认为不是“nullish（无效的）”。<br />
               */
              [
                '@babel/plugin-transform-nullish-coalescing-operator',
                {
                  /**
                   * 如果为true，此转换将假装document.all不存在，并使用null执行松散的相等检查，而不是针对null和undefined的严格相等检查。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的noDocumentAll选项。<br />
                   * 3、loose: true等同于"noDocumentAll": true。<br />
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-transform-optional-chaining：https://babeljs.io/docs/babel-plugin-transform-optional-chaining、https://github.com/tc39/proposal-optional-chaining
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2020。<br />
               * 2、访问深度嵌套的属性、调用深度嵌套的函数、构建深度嵌套的类、删除深度嵌套的属性（在v 7.8.0添加的）。<br />
               */
              [
                '@babel/plugin-transform-optional-chaining',
                {
                  /**
                   * 如果为true，此转换将假装document.all不存在，并使用null执行松散的相等检查，而不是针对null和undefined的严格相等检查。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的noDocumentAll选项。<br />
                   * 3、loose: true等同于"noDocumentAll": true。<br />
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-syntax-bigint：https://babeljs.io/docs/babel-plugin-syntax-bigint
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2020。<br />
               * 2、此插件仅启用对此功能的语法解析。Babel不支持转换bigint。一个建议是使用JSBI库并最终运行babel-plugin-transform-jsbi-to-bigint以在将来将其代码修改为BigInt。<br />
               */
              [
                '@babel/plugin-syntax-bigint',
              ],
              /**
               * @babel/plugin-syntax-dynamic-import：https://babeljs.io/docs/babel-plugin-syntax-dynamic-import
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2020。<br />
               * 2、如果使用@babel/core 7.8.0或以上版本，您可以安全地从您的Babel配置中删除这个插件。<br />
               */
              [
                '@babel/plugin-syntax-dynamic-import',
              ],
              /**
               * @babel/plugin-transform-dynamic-import：https://babeljs.io/docs/babel-plugin-transform-dynamic-import、https://github.com/tc39/proposal-dynamic-import
               * 1、将import()表达式转换为非ESM模块格式。
               * 2、如果使用 Webpack、Rollup 或 Parcel 等捆绑程序，则不应使用此插件，而应让捆绑程序处理 import() 表达式。
               * 3、你应该使用这个插件，如果：
               * 你正在ESM中编写一个Node.js库，但想在CommonJS(CJS)中发布它：安装这个插件和 @babel/plugin-transform-modules-commonjs
               * 你使用RequireJS在浏览器中加载模块：安装这个插件和 @babel/plugin-transform-modules-amd
               * 你使用SystemJS在浏览器中加载模块：安装此插件和 @babel/plugin-transform-modules-systemjs
               * PS：该插件必须与上述3种模块转换插件之一配合使用。
               * 例子：
               * [ '@babel/plugin-transform-dynamic-import', '@babel/plugin-transform-modules-commonjs', ]
               */
              /*
               [
               '@babel/plugin-transform-dynamic-import',
               ],
               */
              /**
               * @babel/plugin-syntax-import-meta：https://babeljs.io/docs/babel-plugin-syntax-import-meta
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2020。<br />
               * 2、如果使用@babel/core 7.10.0或以上版本，您可以安全地从您的Babel配置中删除这个插件。<br />
               */
              [
                '@babel/plugin-syntax-import-meta',
              ],
            ]
                 : [];
        } )( false ),
        // ES2020（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2019（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-json-strings：https://babeljs.io/docs/babel-plugin-transform-json-strings、https://github.com/babel/proposals/issues/43
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2019。<br />
               */
              [
                '@babel/plugin-transform-json-strings',
              ],
              /**
               * @babel/plugin-transform-optional-catch-binding：https://babeljs.io/docs/babel-plugin-transform-optional-catch-binding、https://github.com/babel/proposals/issues/7
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2019。<br />
               */
              [
                '@babel/plugin-transform-optional-catch-binding',
              ],
            ]
                 : [];
        } )( false ),
        // ES2019（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2018（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-async-generator-functions：https://babeljs.io/docs/babel-plugin-transform-async-generator-functions、https://github.com/tc39/proposal-async-iteration
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2018。<br />
               */
              [
                '@babel/plugin-transform-async-generator-functions',
              ],
              /**
               * @babel/plugin-transform-dotall-regex：https://babeljs.io/docs/babel-plugin-transform-dotall-regex
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2018。<br />
               */
              [
                '@babel/plugin-transform-dotall-regex',
              ],
              /**
               * @babel/plugin-transform-named-capturing-groups-regex：https://babeljs.io/docs/babel-plugin-transform-named-capturing-groups-regex
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2018。<br />
               * 2、注意：这个插件生成需要ES6正则表达式功能的代码。<br />
               * 3、如果您需要支持旧版浏览器，请使用runtime: false选项或导入适当的polyfill（例如：core-js）。<br />
               */
              [
                '@babel/plugin-transform-named-capturing-groups-regex',
                {
                  /**
                   * 当这个选项被禁用时，Babel不会使用_wrapRegExp帮助器包装RegExps。输出仅支持内部组引用，不支持运行时属性。<br />
                   * 1、值类型：boolean，默认值：true。<br />
                   */
                  runtime: true,
                },
              ],
              /**
               * @babel/plugin-transform-object-rest-spread：https://babeljs.io/docs/babel-plugin-transform-object-rest-spread
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2018。<br />
               * 2、默认情况下，此插件将使用Babel的objectSpread帮助器生成符合规范的代码。<br />
               */
              [
                '@babel/plugin-transform-object-rest-spread',
                {
                  /**
                   * 启用此选项将使用Babel的extends帮助器，它与Object.assign基本相同（请参阅下面的useBuiltIns直接使用它）。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的setSpreadProperties选项。<br />
                   * 3、loose: true等同于"setSpreadProperties": true且下面的useBuiltIns选项也要设置成true。<br />
                   * 4、请记住，即使它们几乎等价，spread和Object.assign之间也有一个重要区别：spread定义新属性，而Object.assign()设置它们。因此在某些情况下使用此模式可能会产生意想不到的结果。<br />
                   */
                  loose: false,
                  /**
                   * 启用此选项将直接使用Object.assign而不是Babel的扩展助手。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   */
                  useBuiltIns: false,
                },
              ],
              /**
               * @babel/plugin-transform-unicode-property-regex：https://babeljs.io/docs/babel-plugin-transform-unicode-property-regex
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2018。<br />
               */
              [
                '@babel/plugin-transform-unicode-property-regex',
                {
                  /**
                   * 当使用false禁用时，转换会将Unicode正则表达式转换为非Unicode正则表达式以获得更广泛的支持，并删除u标志。<br />
                   * 1、值类型：boolean，默认值：true。<br />
                   * 2、转译为ES6（ES2015）代码时，需要将useUnicodeFlag设置成false。<br />
                   */
                  useUnicodeFlag: true,
                },
              ],
            ]
                 : [];
        } )( false ),
        // ES2018（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2017（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-async-to-generator：https://babeljs.io/docs/babel-plugin-transform-async-to-generator、https://github.com/tc39/ecmascript-asyncawait
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2017 Babel 7中，transform-async-to-module-method被合并到这个插件中。<br />
               * 2、当使用带有非承诺值的等待时，Bluebird将抛出“Error: A value was yielded that could not be treated as a promise（错误：产生的值不能被视为承诺）”。由于Babel无法自动处理此运行时错误，因此您应该手动将其转换为Promise：<br />
               * 如：<br />
               * async function foo() {
               * 删掉，因为会报错：await 42;
               * 添加：await Promise.resolve(42);
               * }
               */
              [
                '@babel/plugin-transform-async-to-generator',
                {
                  module: 'bluebird',
                  method: 'coroutine',
                },
              ],
            ]
                 : [];
        } )( false ),
        // ES2017（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2016（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-exponentiation-operator：https://babeljs.io/docs/babel-plugin-transform-exponentiation-operator
               * 1、注意：这个插件包含在@babel/preset-env中，在ES2016。<br />
               */
              [
                '@babel/plugin-transform-exponentiation-operator',
              ],
            ]
                 : [];
        } )( false ),
        // ES2016（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES2015（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-block-scoped-functions：https://babeljs.io/docs/en/babel-plugin-transform-block-scoped-functions
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-block-scoped-functions',
              ],
              /**
               * @babel/plugin-transform-arrow-functions：https://babeljs.io/docs/en/babel-plugin-transform-arrow-functions
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-arrow-functions',
                {
                  /**
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、此选项启用以下功能：<br />
                   * 将生成的函数包装在.bind(this)中，并按原样在函数内部使用this，而不是使用重命名的this。<br />
                   * 添加运行时检查以确保函数未实例化。<br />
                   * 为箭头函数添加名称。<br />
                   */
                  spec: true,
                },
              ],
              /**
               * @babel/plugin-transform-block-scoping：https://babeljs.io/docs/en/babel-plugin-transform-block-scoping
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、此插件还验证所有const变量。常量的重新分配是一个运行时错误，它会插入必要的错误代码。<br />
               */
              [
                '@babel/plugin-transform-block-scoping',
                {
                  /**
                   * 在以下情况下，如果在转换时不添加额外的函数和闭包，就不可能重写let/const：<br />
                   * for (let i = 0; i < 5; i++) {
                   *   setTimeout(() => console.log(i), 1);
                   * }
                   * 1、在对性能极为敏感的代码中，这可能是不可取的。如果设置了"throwIfClosureRequired":true，Babel在转换这些模式时会抛出异常，而不是自动添加额外的函数。<br />
                   * 2、值类型：boolean，默认值：false。<br />
                   */
                  throwIfClosureRequired: false,
                  /**
                   * 默认情况下，此插件将忽略块范围变量的时间死区(TDZ)。以下代码在使用不符合规范的Babel转译时不会抛出错误：<br />
                   * i;
                   * let i;
                   * 1、如果你需要这些错误，你可以告诉Babel通过设置"tdz": true这个插件来尝试找到它们。但是，当前的实现可能无法正确处理所有边缘情况，最好一开始就避免使用这样的代码。<br />
                   * 2、值类型：boolean，默认值：false。<br />
                   * 3、在以前版本的使用中出现，tdz: true会报错TypeError: this.addHelper is not a function。<br />
                   */
                  tdz: true,
                },
              ],
              /**
               * @babel/plugin-transform-classes：https://babeljs.io/docs/en/babel-plugin-transform-classes
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、注意事项：<br />
               * 当扩展原生类（例如，class extends Array {}）时，需要包装超类。这是解决两个问题所必须的：<br />
               * Babel使用SuperClass.apply(...)转译类，但本机类不可调用，因此在这种情况下抛出。<br />
               * 一些内置函数（如：Array）总是返回一个新对象。Babel应该将其视为新的this，而不是返回它。<br />
               * 3、包装器适用于IE 11和所有其他使用Object.setPrototypeOf或__proto__作为后备的浏览器。没有IE <= 10支持。如果您需要IE <= 10，建议您不要扩展本机。<br />
               * 4、Babel需要静态知道您是否正在扩展内置类。因此，“mixin 模式”不起作用：<br />
               * class Foo extends mixin(Array) {}
               * function mixin(Super) {
               *   return class extends Super {
               *     mix() {}
               *   };
               * }
               * 5、要解决此限制，您可以在继承链中添加另一个类，以便Babel可以包装本机类：<br />
               * const ExtensibleArray = class extends Array {};
               * class Foo extends mixin(ExtensibleArray) {}
               */
              [
                '@babel/plugin-transform-classes',
                {
                  /**
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项，该假设提供对Babel应用的各种松散模式推导的精细控制，loose: true等同于：<br />
                   * "constantSuper": true,
                   * "noClassCalls": true,
                   * "setClassMethods": true,
                   * "superIsCallableConstructor": true
                   * 3、请注意，在松散模式下，类方法是可枚举的。这不符合规范，您可能会遇到问题。<br />
                   * 4、在松散模式下，方法是通过简单的赋值在类原型上定义的，而不是被定义的。这可能导致以下内容不起作用：<br />
                   * class Foo {
                   *   set bar() {
                   *     throw new Error('foo!');
                   *   }
                   * }
                   *
                   * class Bar extends Foo {
                   *   bar() {
                   *     // will throw an error when this method is defined
                   *   }
                   * }
                   * 5、当Bar.prototype.foo被定义时，它会触发Foo的setter。这种情况不太可能出现在生产代码中，但需要牢记。<br />
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-transform-computed-properties：https://babeljs.io/docs/en/babel-plugin-transform-computed-properties
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-computed-properties',
                {
                  /**
                   * 就像类中的方法分配一样，在松散模式下，计算属性名称使用简单的分配而不是被定义。这不太可能成为生产代码中的问题。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的setComputedProperties选项。<br />
                   * 3、loose: true等同于"setComputedProperties": true。<br />
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-transform-destructuring：https://babeljs.io/docs/en/babel-plugin-transform-destructuring
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-destructuring',
                {
                  /**
                   * 启用此选项将假定您要解构的是一个数组，并且不会在其他可迭代对象上使用Array.from。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的iterableIsArray选项。<br />
                   * 3、loose: true等同于"iterableIsArray": true。<br />
                   */
                  loose: false,
                  /**
                   * 启用此选项将直接使用Object.assign而不是Babel的扩展助手。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   */
                  useBuiltIns: false,
                  /**
                   * 此选项允许使用数组解构语法来解构类似数组的对象。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、v7.10.0开始添加了该选项。<br />
                   * 3、考虑迁移到顶层assumptions选项里的arrayLikeIsIterable选项。<br />
                   * 4、allowArrayLike: true等同于"arrayLikeIsIterable": true。<br />
                   * 5、请注意，即使禁用此选项，Babel也允许在旧引擎中解构参数，因为它在ECMAScript规范中被定义为可迭代的。<br />
                   */
                  allowArrayLike: false,
                },
              ],
              /**
               * @babel/plugin-transform-duplicate-keys：https://babeljs.io/docs/en/babel-plugin-transform-duplicate-keys
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、这个插件实际上将对象中的重复键转换为计算属性，然后必须由@babel/plugin-transform-computed-properties插件处理。最终结果将不包含任何具有重复键的对象文字。<br />
               */
              [
                '@babel/plugin-transform-duplicate-keys',
              ],
              /**
               * @babel/plugin-transform-for-of：https://babeljs.io/docs/en/babel-plugin-transform-for-of
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-for-of',
                {
                  /**
                   * 在松散模式下，阵列被置于快速路径中，从而大大提高了性能。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的skipForOfIteratorClosing选项。<br />
                   * 3、loose: true等同于"skipForOfIteratorClosing": true。<br />
                   */
                  loose: false,
                  /**
                   * 此选项允许将for-of与类似数组的对象一起使用。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、v7.10.0开始添加了该选项。<br />
                   * 3、考虑迁移到顶层assumptions选项里的arrayLikeIsIterable选项。<br />
                   * 4、allowArrayLike: true等同于"arrayLikeIsIterable": true。<br />
                   * 5、请注意，即使禁用此选项，Babel也允许在旧引擎中解构参数，因为它在ECMAScript规范中被定义为可迭代的。<br />
                   */
                  allowArrayLike: false,
                  /**
                   * 通过假设所有循环都是数组，这将把下面显示的优化应用于所有for-of循环。当您只想要一个for-of循环来表示一个数组上的基本for循环时，它会很有用。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、如果使用基本数组，Babel会将for-of循环编译为常规的for循环。<br />
                   */
                  assumeArray: false,
                },
              ],
              /**
               * @babel/plugin-transform-function-name：https://babeljs.io/docs/en/babel-plugin-transform-function-name
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-function-name',
              ],
              /**
               * @babel/plugin-transform-instanceof：https://babeljs.io/docs/en/babel-plugin-transform-instanceof
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-instanceof',
              ],
              /**
               * @babel/plugin-transform-literals：https://babeljs.io/docs/en/babel-plugin-transform-literals
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、@babel/plugin-transform-literals得在@babel/plugin-proposal-numeric-separator之后。<br />
               */
              [
                '@babel/plugin-transform-literals',
              ],
              /**
               * @babel/plugin-transform-new-target：https://babeljs.io/docs/en/babel-plugin-transform-new-target
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、注意事项：这个插件依赖于this.constructor，这意味着在使用未转换的类时必须已经调用了super：<br />
               * class Foo {}
               * class Bar extends Foo {
               *   constructor() {
               *     // 如果类不转换为ES5，这将是一个问题。
               *     new.target;
               *     super();
               *   }
               * }
               * 3、此外，当将newTarget与ES5函数类（转换的ES6类）一起使用时，此插件无法转换所有Reflect.construct案例。<br />
               * 4、。<br />
               */
              [
                '@babel/plugin-transform-new-target',
              ],
              /**
               * @babel/plugin-transform-object-super：https://babeljs.io/docs/en/babel-plugin-transform-object-super
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-object-super',
              ],
              /**
               * @babel/plugin-transform-parameters：https://babeljs.io/docs/en/babel-plugin-transform-parameters
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、该插件将ES2015参数转换为ES5，包括：解构参数、默认参数、rest参数。<br />
               * 3、注意事项：默认参数“脱糖”到let声明中以保留正确的语义。如果您的环境不支持此功能，那么您将需要@babel/plugin-transform-block-scoping插件。<br />
               */
              [
                '@babel/plugin-transform-parameters',
                {
                  /**
                   * 在松散模式下，具有默认值的参数将计入函数的arity（稀有度）。这不是这些参数不添加到函数的规范行为。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的ignoreFunctionLength选项。<br />
                   * 3、loose: true等同于"ignoreFunctionLength": true。<br />
                   * 4、在ignoreFunctionLength假设下，Babel将生成一个性能更高的解决方案，因为JavaScript引擎将完全优化不引用参数的函数。请进行您自己的基准测试并确定此选项是否适合您的应用程序。<br />
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-transform-shorthand-properties：https://babeljs.io/docs/en/babel-plugin-transform-shorthand-properties
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-shorthand-properties',
              ],
              /**
               * @babel/plugin-transform-spread：https://babeljs.io/docs/en/babel-plugin-transform-spread
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-spread',
                {
                  /**
                   * 在松散模式下，所有可迭代对象都被假定为数组。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的iterableIsArray选项。<br />
                   * 3、loose: true等同于"iterableIsArray": true。<br />
                   * 4、。<br />
                   */
                  loose: false,
                  /**
                   * 此选项允许像数组一样传播类似数组的对象。<br />
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、v7.10.0开始添加了该选项。<br />
                   * 3、考虑迁移到顶层assumptions选项里的arrayLikeIsIterable选项。<br />
                   * 4、allowArrayLike: true等同于"arrayLikeIsIterable": true。<br />
                   * 5、请注意，即使禁用此选项，Babel也允许在旧引擎中传播参数，因为它在ECMAScript规范中被定义为可迭代的。<br />
                   */
                  allowArrayLike: false,
                },
              ],
              /**
               * @babel/plugin-transform-sticky-regex：https://babeljs.io/docs/en/babel-plugin-transform-sticky-regex
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-sticky-regex',
              ],
              /**
               * @babel/plugin-transform-template-literals：https://babeljs.io/docs/en/babel-plugin-transform-template-literals
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-template-literals',
                {
                  /**
                   * 1、值类型：boolean，默认值：false。<br />
                   * 2、考虑迁移到顶层assumptions选项里的mutableTemplateObject选项。<br />
                   * 3、loose: true等同于"mutableTemplateObject": true。<br />
                   * 4、当mutableTemplateObject为true时，标记的模板文字对象不会被冻结。所有模板字面量表达式和准词都与+运算符组合，而不是与String.prototype.concat组合。<br />
                   * 5、当false或未设置时，所有模板字面量表达式和quasis都与String.prototype.concat组合。如果模板文字表达式是Symbol()，它将正确处理Symbol.toPrimitive的情况并正确抛出。<br />
                   */
                  loose: false,
                },
              ],
              /**
               * @babel/plugin-transform-typeof-symbol：https://babeljs.io/docs/en/babel-plugin-transform-typeof-symbol
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-typeof-symbol',
              ],
              /**
               * @babel/plugin-transform-unicode-escapes：https://babeljs.io/docs/en/babel-plugin-transform-unicode-escapes
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、编译ES2015 Unicode转义到ES5。<br />
               */
              [
                '@babel/plugin-transform-unicode-escapes',
              ],
              /**
               * @babel/plugin-transform-unicode-regex：https://babeljs.io/docs/en/babel-plugin-transform-unicode-regex
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-unicode-regex',
              ],
            ]
                 : [];
        } )( false ),
        // ES2015（@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES5（除非是需要兼容到低端平台，否则不要启用这些，@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-property-mutators：https://babeljs.io/docs/babel-plugin-transform-property-mutators
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-property-mutators',
              ],
            ]
                 : [];
        } )( false ),
        // ES5（除非是需要兼容到低端平台，否则不要启用这些，@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // ES3（除非是需要兼容到低端平台，否则不要启用这些，@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-member-expression-literals：https://babeljs.io/docs/babel-plugin-transform-member-expression-literals
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-member-expression-literals',
              ],
              /**
               * @babel/plugin-transform-property-literals：https://babeljs.io/docs/babel-plugin-transform-property-literals
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               */
              [
                '@babel/plugin-transform-property-literals',
              ],
              /**
               * @babel/plugin-transform-reserved-words：https://babeljs.io/docs/babel-plugin-transform-reserved-words
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、有些词在ES3中保留为潜在的未来关键字，但在ES5及更高版本中没有保留。此插件在针对ES3环境时使用，可重命名该组单词中的变量。<br />
               */
              [
                '@babel/plugin-transform-reserved-words',
              ],
            ]
                 : [];
        } )( false ),
        // ES3（除非是需要兼容到低端平台，否则不要启用这些，@babel/preset-env已经包括这些，除非想特定设置某些插件的个性化设置，否则不用特意启动这些，交由@babel/preset-env处理即可） End

        // 其他插件（除非是需要兼容到低端平台，否则不要启用这些） Start
        ...( isEnable => {
          return isEnable
                 ? [
              /**
               * @babel/plugin-transform-object-assign：https://babeljs.io/docs/en/babel-plugin-transform-object-assign
               * 1、用于转译Object.assign。<br />
               * 2、注意事项，仅适用于Object.assign或Object['assign']形式的代码。不支持以下模式：<br />
               * var { assign } = Object;
               * var assign = Object.assign;
               */
              [
                '@babel/plugin-transform-object-assign',
              ],
              /**
               * @babel/plugin-transform-object-set-prototype-of-to-assign：https://babeljs.io/docs/en/babel-plugin-transform-object-set-prototype-of-to-assign
               * 1、用于转译Object.setPrototypeOf。<br />
               * 2、注意：使用此插件时有一些注意事项，请参阅@babel/plugin-transform-proto-to-assign文档了解更多信息：https://babeljs.io/docs/en/babel-plugin-transform-proto-to-assign。<br />
               * 3、要注意这个插件的使用需要上头那个插件的配合使用！没用这2个插件，就无法转译Object.setPrototypeOf，也就无法兼容IE 9。<br />
               */
              [
                '@babel/plugin-transform-object-set-prototype-of-to-assign',
              ],
              /**
               * @babel/plugin-transform-proto-to-assign：https://babeljs.io/docs/en/babel-plugin-transform-proto-to-assign
               * 1、这意味着以下将起作用：<br />
               * var foo = { a: 1 };
               * var bar = { b: 2 };
               * bar.__proto__ = foo;
               * bar.a; // 1
               * bar.b; // 2
               * 2、但是以下内容不会，如果您打算使用此插件，则必须注意这种情况：<br />
               * var foo = { a: 1 };
               * var bar = { b: 2 };
               * bar.__proto__ = foo;
               * bar.a; // 1
               * foo.a = 2;
               * bar.a; // 1 - 应该是2但请记住，没有任何东西是绑定的，它是一个直接的副本。没用这个2个插件，会输出2（本来也应该输出2的），用了会输出1。
               */
              [
                '@babel/plugin-transform-proto-to-assign',
              ],
              /**
               * @babel/plugin-transform-regenerator：https://babeljs.io/docs/en/babel-plugin-transform-regenerator
               * 1、注意：这个插件包含在@babel/preset-env。<br />
               * 2、用于转译generators语法。<br />
               */
              [
                '@babel/plugin-transform-regenerator',
                {
                  asyncGenerators: true,
                  generators: true,
                  async: true,
                },
              ],
            ]
                 : [];
        } )( false ),
        // 其他插件（除非是需要兼容到低端平台，否则不要启用这些） End
      ],
      // 预设的执行是从下往上。
      babelPresets = [
        /**
         * 用于压缩JS的预设。开发阶段不启用，生产启用。建议只做压缩，不做语法转译，转译应该交给@babel/preset-env和其他语法转译插件。<br />
         * 1、生产环境且为测试环境用的话，如果为了方便在测试环境调试BUG，可以禁用这2个选项（removeConsole、removeDebugger，设置成false即可）。但是一般情况下强烈建议始终启用这2个选项。这样才能让测试环境跟正式环境保持正真实际上的一模一样的代码。<br />
         * 2、当为生产环境且为正式环境（最终给用户用的）用的话，就启用这2个选项（removeConsole、removeDebugger，设置成true即可），它们用于移除JS代码中的console、debugger。正式环境强烈建议始终启用这2个选项。<br />
         *
         * 注意：<br />
         * 如果在诸如console.log()中编写某些跟项目逻辑业务有关的代码，那么当启用removeConsole、removeDebugger时，会导致最后输出的代码中因为删除了诸如console.log()，从而导致其中的某些跟项目逻辑业务有关的代码也被删除，最终使生产的代码出现非所愿期望的代码输出，从而报错。<br />
         * 所以，诸如console.log()中不要做任何逻辑处理（哪怕是：++index这种最简单的逻辑），只作为纯日志输出。<br />
         * 例如：<br />
         * let index = 0, arr001 = [ 'qqq', 'www', ], str001 = '';
         *
         * for( const item of arr001 ){
         *   str001 + = item;
         *
         *   console.log( `index--->${ ++index }` );
         * }
         * 当没有启用removeConsole、removeDebugger时，执行上述代码后，index的值为3，但是如果启用removeConsole、removeDebugger，则index的值为0，那么显然这不是期望的。<br />
         */
        ...( isProduction => {
          return isProduction
                 ? [
              [
                'minify',
                {
                  /**
                   * babel-plugin-transform-minify-booleans：https://babeljs.io/docs/en/babel-plugin-transform-minify-booleans
                   * 1、默认值：true。<br />
                   */
                  booleans: true,
                  /**
                   * babel-plugin-minify-builtins：https://babeljs.io/docs/en/babel-plugin-minify-builtins
                   * 1、默认值：true。<br />
                   * 2、有参数：<br />
                   * tdz：值类型：boolean，TDZ。<br />
                   */
                  builtIns: false,
                  /**
                   * babel-plugin-transform-inline-consecutive-adds：https://babeljs.io/docs/en/babel-plugin-transform-inline-consecutive-adds
                   * 1、默认值：true。<br />
                   */
                  consecutiveAdds: true,
                  /**
                   * babel-plugin-minify-dead-code-elimination：https://babeljs.io/docs/en/babel-plugin-minify-dead-code-elimination
                   * 1、默认值：true。<br />
                   * 2、有参数：<br />
                   * optimizeRawSize：值类型：boolean。<br />
                   * keepFnName：值类型：boolean，防止插件删除函数名。对取决于fn.name的代码很有用。<br />
                   * keepFnArgs：值类型：boolean，防止插件删除函数参数。对取决于fn.length的代码很有用。<br />
                   * keepClassName：值类型：boolean，防止插件删除类名。对取决于cls.name的代码很有用。<br />
                   * tdz：值类型：boolean，TDZ。<br />
                   */
                  deadcode: {
                    optimizeRawSize: true,
                    keepFnName: true,
                    keepFnArgs: true,
                    keepClassName: true,
                    tdz: true,
                  },
                  /**
                   * babel-plugin-minify-constant-folding：https://babeljs.io/docs/en/babel-plugin-minify-constant-folding
                   * 1、默认值：true。<br />
                   * 2、有参数：<br />
                   * tdz：值类型：boolean，TDZ。<br />
                   */
                  evaluate: {
                    tdz: true,
                  },
                  /**
                   * babel-plugin-minify-flip-comparisons：https://babeljs.io/docs/en/babel-plugin-minify-flip-comparisons
                   * 1、默认值：true。<br />
                   */
                  flipComparisons: false,
                  /**
                   * babel-plugin-minify-guarded-expressions：https://babeljs.io/docs/en/babel-plugin-minify-guarded-expressions
                   * 1、默认值：true。<br />
                   */
                  guards: false,
                  /**
                   * babel-plugin-minify-infinity：https://babeljs.io/docs/en/babel-plugin-minify-infinity
                   * 1、默认值：true。<br />
                   */
                  infinity: false,
                  /**
                   * babel-plugin-minify-mangle-names：https://babeljs.io/docs/en/babel-plugin-minify-mangle-names
                   * 1、默认值：true。<br />
                   * 2、有参数：<br />
                   * exclude：值类型：object，一个普通的JS对象，其键作为标识符名称和值指示是否排除（默认值：{}）。<br />
                   * eval：值类型：boolean，在eval可访问的范围内修改标识符（默认值：false）。<br />
                   * keepFnName：值类型：boolean，防止破坏更改函数名称。对取决于fn.name的代码很有用（默认值：false）。<br />
                   * topLevel：值类型：boolean，破坏顶级标识符（默认值：false）。<br />
                   * keepClassName：值类型：boolean，防止破坏更改类名（默认值：false）。<br />
                   * 3、以前的版本中，当函数、类的方法的默认参数设置为常量或私有变量时，该插件会报错：Cannot read property 'add' of undefined，解决方案是直接禁用该选项：mangle: false。<br />
                   * 4、当babel的各个生态系列包更新到“v7.26.1 (2024-10-25)”、“v7.26.0 (2024-10-25)”、“v7.25.9 (2024-10-22)”时，启用这个选项会出现错误！
                   * 目前的解决方案只能是直接设置为false来禁用该选项了。
                   * 一时半会儿也搞不懂到底是哪个插件导致原本可以，但是更新后就不行了：
                   * ERROR in ./src/pages/index/Index.mts
                   * Module build failed (from ./node_modules/babel-loader/lib/index.js):
                   * TypeError: G:\WebStormWS\upload-for-multiple\src\pages\index\Index.mts: Cannot read properties of undefined (reading 'getCode')
                   *     at NodePath.getSource (G:\WebStormWS\upload-for-multiple\node_modules\@babel\traverse\lib\path\introspection.js:137:27)
                   *     at PluginPass.exit (G:\WebStormWS\upload-for-multiple\node_modules\babel-plugin-minify-mangle-names\lib\index.js:543:45)
                   *     at newFn (G:\WebStormWS\upload-for-multiple\node_modules\@babel\traverse\lib\visitors.js:172:14)
                   */
                  /*
                   mangle: {
                   exclude: {},
                   eval: false,
                   keepFnName: true,
                   topLevel: false,
                   keepClassName: true,
                   },
                   */
                  mangle: false,
                  /**
                   * @babel/plugin-transform-member-expression-literals：https://babeljs.io/docs/en/babel-plugin-transform-member-expression-literals
                   * 1、默认值：true。<br />
                   * 2、该选项就是使用ES 3的语法转译插件@babel/plugin-transform-member-expression-literals来设置的，这里就不启用了，交由插件@babel/plugin-transform-member-expression-literals来设置。<br />
                   */
                  memberExpressions: false,
                  /**
                   * babel-plugin-transform-merge-sibling-variables：https://babeljs.io/docs/en/babel-plugin-transform-merge-sibling-variables
                   * 1、默认值：true。<br />
                   */
                  mergeVars: true,
                  /**
                   * babel-plugin-minify-numeric-literals：https://babeljs.io/docs/en/babel-plugin-minify-numeric-literals
                   * 1、默认值：true。<br />
                   */
                  numericLiterals: true,
                  /**
                   * @babel/plugin-transform-property-literals：https://babeljs.io/docs/en/babel-plugin-transform-property-literals
                   * 1、默认值：true。<br />
                   * 2、该选项就是使用ES 3的语法转译插件@babel/plugin-transform-property-literals来设置的，这里就不启用了，交由插件@babel/plugin-transform-property-literals来设置。<br />
                   */
                  propertyLiterals: false,
                  /**
                   * babel-plugin-transform-regexp-constructors：https://babeljs.io/docs/en/babel-plugin-transform-regexp-constructors
                   * 1、默认值：true。<br />
                   */
                  regexpConstructors: true,
                  /**
                   * babel-plugin-transform-remove-console：https://babeljs.io/docs/en/babel-plugin-transform-remove-console
                   * 1、默认值：false。<br />
                   * 2、有参数：<br />
                   * exclude：值类型：array，要从删除中排除的一组控制台方法。<br />
                   * 3、生产环境且为测试环境用的话，如果为了方便在测试环境调试BUG，可以禁用这2个选项（removeConsole、removeDebugger，设置成false即可）。但是一般情况下强烈建议始终启用这2个选项。这样才能让测试环境跟正式环境保持正真实际上的一模一样的代码。<br />
                   * 4、当为生产环境且为正式环境（最终给用户用的）用的话，就启用这2个选项（removeConsole、removeDebugger，设置成true即可），它们用于移除JS代码中的console、debugger。正式环境强烈建议始终启用这2个选项。<br />
                   *
                   * 这里有个注意事项！！！<br />
                   * 1、当babel启用removeConsole、removeDebugger这两个插件选项后，某些情况下会有意外的编译输出，详见如下：<br />
                   * 说明：<br />
                   * 如果在诸如console.log()中编写某些跟项目逻辑业务有关的代码，那么当启用removeConsole、removeDebugger时，会导致最后输出的代码中因删除了诸如console.log()，从而导致其中的某些跟项目逻辑业务有关的代码也被删除，最终使生产的代码出现非所愿期望的代码输出，从而报错。<br />
                   * 所以，诸如console.log()中不要做任何逻辑处理（哪怕是：++index这种最简单的逻辑），只作为纯日志输出。<br />
                   * 例如：<br />
                   * let index = 0, arr001 = [ 'qqq', 'www', ], str001 = '';
                   *
                   * for( const item of arr001 ){
                   *   str001 + = item;
                   *
                   *   console.log( `index--->${ ++index }` );
                   * }
                   * 当没有启用removeConsole、removeDebugger时，执行上述代码后，index的值为3，但是如果启用removeConsole、removeDebugger，则index的值为0，那么显然这不是期望的。<br />
                   *
                   * 对于上述的两个选项，当前配置是这样的，“webpack.test.mjs”中是false，webpack.production.mjs是true。<br />
                   */
                  removeConsole: ( () => {
                    if( env_platform === 'dev_server' ){
                      return false;
                    }
                    else if( env_platform === 'local_server' ){
                      return false;

                    }
                    else if( env_platform === 'test' ){
                      return false;

                    }
                    else if( env_platform === 'production' ){
                      return true;

                    }
                    else{
                      return false;
                    }
                  } )(),
                  /**
                   * babel-plugin-transform-remove-debugger：https://babeljs.io/docs/en/babel-plugin-transform-remove-debugger
                   * 1、默认值：false。<br />
                   * 2、生产环境且为测试环境用的话，如果为了方便在测试环境调试BUG，可以禁用这2个选项（removeConsole、removeDebugger，设置成false即可）。但是一般情况下强烈建议始终启用这2个选项。这样才能让测试环境跟正式环境保持正真实际上的一模一样的代码。<br />
                   * 3、当为生产环境且为正式环境（最终给用户用的）用的话，就启用这2个选项（removeConsole、removeDebugger，设置成true即可），它们用于移除JS代码中的console、debugger。正式环境强烈建议始终启用这2个选项。<br />
                   * 4、当为生产环境且为正式环境（最终给用户用的）用的话，就启用这2个选项（removeConsole、removeDebugger，设置成true即可），它们用于移除JS代码中的console、debugger。正式环境强烈建议始终启用这2个选项。<br />
                   *
                   * 这里有个注意事项！！！<br />
                   * 1、当babel启用removeConsole、removeDebugger这两个插件选项后，某些情况下会有意外的编译输出，详见如下：<br />
                   * 说明：<br />
                   * 如果在诸如console.log()中编写某些跟项目逻辑业务有关的代码，那么当启用removeConsole、removeDebugger时，会导致最后输出的代码中因删除了诸如console.log()，从而导致其中的某些跟项目逻辑业务有关的代码也被删除，最终使生产的代码出现非所愿期望的代码输出，从而报错。<br />
                   * 所以，诸如console.log()中不要做任何逻辑处理（哪怕是：++index这种最简单的逻辑），只作为纯日志输出。<br />
                   * 例如：<br />
                   * let index = 0, arr001 = [ 'qqq', 'www', ], str001 = '';
                   *
                   * for( const item of arr001 ){
                   *   str001 + = item;
                   *
                   *   console.log( `index--->${ ++index }` );
                   * }
                   * 当没有启用removeConsole、removeDebugger时，执行上述代码后，index的值为3，但是如果启用removeConsole、removeDebugger，则index的值为0，那么显然这不是期望的。<br />
                   *
                   * 对于上述的两个选项，当前配置是这样的，“webpack.test.mjs”中是false，webpack.production.mjs是true。<br />
                   */
                  removeDebugger: ( () => {
                    if( env_platform === 'dev_server' ){
                      return false;
                    }
                    else if( env_platform === 'local_server' ){
                      return false;

                    }
                    else if( env_platform === 'test' ){
                      return false;

                    }
                    else if( env_platform === 'production' ){
                      return true;

                    }
                    else{
                      return false;
                    }
                  } )(),
                  /**
                   * babel-plugin-transform-remove-undefined：https://babeljs.io/docs/en/babel-plugin-transform-remove-undefined
                   * 1、默认值：true。<br />
                   * 2、对于函数，这将删除评估为未定义的返回参数。<br />
                   */
                  removeUndefined: {
                    tdz: true,
                  },
                  /**
                   * babel-plugin-minify-replace：https://babeljs.io/docs/en/babel-plugin-minify-replace
                   * 1、默认值：true。<br />
                   * 2、有参数：<br />
                   * replacements：值类型：array[ { identifierName: string, replacement: { type: string, value: boolean }, } ]。<br />
                   */
                  replace: false,
                  /**
                   * babel-plugin-minify-simplify：https://babeljs.io/docs/en/babel-plugin-minify-simplify
                   * 1、默认值：true。<br />
                   * 2、将语句简化为表达式，使表达尽可能统一以获得更好的可压缩性。<br />
                   */
                  simplify: false,
                  /**
                   * babel-plugin-transform-simplify-comparison-operators：https://babeljs.io/docs/en/babel-plugin-transform-simplify-comparison-operators
                   * 1、默认值：true。<br />
                   */
                  simplifyComparisons: false,
                  /**
                   * babel-plugin-minify-type-constructors：https://babeljs.io/docs/en/babel-plugin-minify-type-constructors
                   * 1、默认值：true。<br />
                   * 2、有参数：<br />
                   * array：值类型：boolean，防止插件缩小数组。<br />
                   * boolean：值类型：boolean，防止插件缩小布尔值。<br />
                   * number：值类型：boolean，防止插件缩小数字。<br />
                   * object：值类型：boolean，防止插件缩小对象。<br />
                   * string：值类型：boolean，防止插件缩小字符串。<br />
                   */
                  typeConstructors: false,
                  /**
                   * babel-plugin-transform-undefined-to-void：https://babeljs.io/docs/en/babel-plugin-transform-undefined-to-void
                   * 1、默认值：true。<br />
                   * 2、这个插件将undefined转换为void 0，无论它是否被重新分配，它都会返回undefined。<br />
                   */
                  undefinedToVoid: true,
                },
              ],
            ]
                 : [];
        } )( isProduction ),
        /**
         * @babel/preset-env。<br />
         * 1、注意：@babel/preset-env不会包含任何低于第3阶段的JavaScript语法提案，因为在TC39流程的那个阶段，无论如何它都不会被任何浏览器实现。如果需要它，需要手动包含在内。<br />
         * 2、shippingProposals选项将包括一些浏览器已经实现的第3阶段提案。<br />
         * 3、@babel/preset-env获取您指定的任何目标环境，并根据其映射检查它们以编译插件列表并将其传递给Babel。<br />
         * 4、默认情况下，@babel/preset-env将使用browserslist配置源，除非设置了targets或ignoreBrowserslistConfig选项。<br />
         */
        [
          '@babel/preset-env',
          {
            /**
             * 1、会使用“console.log”输出由preset-env启用的polyfill和转换插件，并且会输出哪些目标需要它。<br />
             * 2、比如输出日志中有：proposal-class-static-block { chrome < 94, firefox < 93, opera < 80, safari }。<br />
             * 说明：表示当编译目标为chrome < 94, firefox < 93, opera < 80, safari这些时，会启用“proposal-class-static-block”。<br />
             */
            debug: isBabelDebug,
            targets: babel_targets,
            /**
             * 注意：这些优化将在Babel 8中默认启用。<br />
             * 1、值类型：boolean，默认值：false。<br />
             * 2、v7.9.0开始添加的。<br />
             */
            bugfixes: true,
            /**
             * 为此预设中支持它们的任何插件启用更符合规范但可能更慢的转换。<br />
             * 1、值类型：boolean，默认值：false。<br />
             */
            spec: true,
            /**
             * 为此预设中允许它们的任何插件启用“松散”转换。<br />
             * 1、值类型：boolean，默认值：false。<br />
             * 2、考虑迁移到自Babel 7.13以来可用的顶层assumptions选项（在babel-loader的options选项下的assumptions选项），见：https://babeljs.io/docs/en/assumptions。
             */
            loose: false,
            /**
             * 启用将ES模块语法转换为另一种模块类型。<br />
             * 1、有效值："amd"、"umd"、"systemjs"、"commonjs"、"cjs"、"auto"、false，请注意，'cjs'只是'commonjs'的别名，默认值为：'auto'。<br />
             * 2、将此设置为false将保留ES模块。仅当您打算将本机ES模块发送到浏览器时才使用此选项。<br />
             * 3、如果你使用Babel打包器，默认的modules: "auto"总是首选。<br />
             * 4、默认情况下，@babel/preset-env使用调用者数据来确定是否应该转换ES模块和模块特性，例如：import()。<br />
             * 5、关于modules设置为false时的重点：<br />
             * 所有可需要tree-shaking的代码必须以ES模块方式编译。<br />
             * 因此，如果你有要导入的库，则必须将这些库编译为ES模块以便进行tree-shaking。<br />
             * 如果它们被编译为commonjs，那么它们就不能做tree-shaking，并且将会被打包进你的应用程序中。<br />
             * 许多库支持部分导入，lodash就是一个很好的例子，它本身是commonjs模块，但是它有一个lodash-es版本，用的是ES模块。<br />
             * 此外，如果你在应用程序中使用内部库，也必须使用ES模块编译。为了减少应用程序包的大小，必须将所有这些内部库修改为以这种方式编译。<br />
             */
            modules: 'auto',
            /**
             * 此选项配置@babel/preset-env如何处理polyfill。<br />
             * 1、有效值："usage"、"entry"、false，默认值为false。<br />
             * 2、当使用'usage'或'entry'时，@babel/preset-env将添加对core-js模块的直接引用作为裸imports或requires。这意味着core-js将相对于文件本身进行解析，并且需要可访问。<br />
             * 3、由于@babel/polyfill在7.4.0中已弃用，我们建议直接添加core-js并通过corejs选项设置版本。<br />
             * 4、'entry'表示在入口处显示的导入core-js，如：import "core-js";，这样的代码在项目中只能存在1次，如果出现第2次会报错，个人不建议用这个值，'usage'这个值最好了。<br />
             * 5、'usage'在每个文件中使用polyfill时为它们添加特定的import。我们利用了捆绑器只会加载相同的polyfill一次这一事实。这个值最好了。<br />
             * 6、关于3个值的说明：<br />
             * false：无视target.browsers将所有Polyfill加载进来。<br />
             * entry：根据target.browsers将部分Polyfill加载进来(仅引入有浏览器不支持的Polyfill，需在入口文件import 'core-js/stable')。<br />
             * usage：根据target.browsers和检测代码里ES6的使用情况将部分Polyfill加载进来(无需在入口文件import 'core-js/stable')。<br />
             */
            useBuiltIns: 'usage',
            /**
             * 7.4版本的插件写法发生巨变！该选项在v 7.4.0开始添加的。<br />
             * 1、值类型：string、object（{ version: string, proposals: boolean }），默认值："2.0"。<br />
             * 2、version选项的值是一个字符串，其可以是任何受支持的core-js版本号。例如，“3.8”或“2.0”。<br />
             * 3、此选项仅在与useBuiltIns的值为'usage'、'entry'一起使用时有效。<br />
             * 4、建议指定次要版本，否则“3”将被解释为“3.0”，其中可能不包括最新功能的polyfill。<br />
             * 5、默认情况下，只注入稳定的ECMAScript特性的polyfill：如果你想polyfill提案，你有三个不同的选项：<br />
             * 使用useBuiltIns: "entry"时，可以直接导入一个提案polyfill：import "core-js/proposals/string-replace-all"。<br />
             * 使用useBuiltIns: "usage"时，您有2种不同的选择：<br />
             * 将shippingProposals选项设置为true。这将为已经在浏览器中提供一段时间的提案启用polyfill和转换。<br />
             * 使用corejs: { version: '3.8', proposals: true }。这将启用core-js@3.8支持的每个提案的polyfill。<br />
             */
            corejs: {
              version: ( () => {
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
              } )() || '3.39.0',
              proposals: true,
            },
            /**
             * 1、值类型：boolean，默认值：false。<br />
             * 2、借助Babel 7的JavaScript配置文件支持，如果env设置为production，您可以强制运行所有转换。<br />
             * 3、注意：targets.uglify选项已被弃用，并将在下一个主要版本中删除。<br />
             * 4、默认情况下，此预设将运行目标环境所需的所有转换。<br />
             * 5、如果您想强制运行所有转换，请启用此选项，如果输出将通过UglifyJS或仅支持ES5的环境运行这很有用。<br />
             */
            forceAllTransforms: false,
            shippedProposals: true,
          },
        ],
      ],
      babelPresetsJSX = [
        ...babelPresets,
        /**
         * 1、此预设始终包含以下插件：<br />
         * @babel/plugin-syntax-jsx <br />
         * @babel/plugin-transform-react-jsx <br />
         * @babel/plugin-transform-react-display-name <br />
         * 2、当启用development选项时，并且设定runtime选项值为：classic，还支持下述2个插件：<br />
         * @babel/plugin-transform-react-jsx-self <br />
         * @babel/plugin-transform-react-jsx-source <br />
         * 3、启用development选项时，并且设定runtime选项值为：automatic，自v7.9.0起，会自动添加上面2个插件。但是，如果你设定runtime选项值为：automatic，又手动添加上述2个插件就会出报错。<br />
         */
        [
          '@babel/preset-react',
          {
            /**
             * 自v 7.9.0开始添加该选项，决定使用哪个运行时。<br />
             * 1、值类型：string（只有2个有效值：'automatic'、'classic'），默认值：'classic'。<br />
             * 2、值'automatic'会自动导入JSX转译成的函数，值'classic'不会自动导入任何东西。<br />
             */
            runtime: 'automatic',
            /**
             * 这会切换特定于开发的行为，例如添加__source和__self。<br />
             * 1、值类型：boolean，默认值：false。<br />
             */
            development: !isProduction,
            /**
             * 如果使用XML命名空间标记名称，则切换是否引发错误。<br />
             * 1、值类型：boolean，默认值：true。<br />
             * 2、尽管JSX规范允许这样做，但默认情况下它是禁用的，因为React的JSX目前不支持它：<br />
             * <f: image />
             */
            throwIfNamespace: true,
            /**
             * 启用@babel/plugin-transform-react-pure-annotations，它将顶级React方法调用标记为tree shaking。<br />
             * 1、值类型：boolean，默认值：true。<br />
             */
            pure: true,
          },
        ],
      ],
      babelLoaderConfig = {
        /**
         * 如果选项中的值设置为true，加载器将使用node_modules/.cache/babel-loader中的默认缓存目录，或者如果在任何根目录中都找不到node_modules文件夹，则回退到默认的操作系统临时文件目录。<br />
         * 1、值类型：boolean，默认值：false。<br />
         */
        cacheDirectory: !isProduction,
        /**
         * 设置后，每个Babel转换输出都将使用Gzip进行压缩。如果您想退出缓存压缩，请将其设置为false，如果您的项目转译了数千个文件，您的项目可能会从中受益。<br />
         * 1、值类型：boolean，默认值：true。<br />
         */
        cacheCompression: isProduction,
        plugins: babelPlugins,
        presets: babelPresets,
        targets: babel_targets,
        /**
         * 1、值类型：string，默认值：'module'，有效值有：'script'、'module'、'unambiguous'。<br />
         * 2、script：使用ECMAScript脚本语法解析文件。不允许导入/导出语句，并且文件不是严格模式。<br />
         * 3、module：使用ECMAScript模块语法解析文件。文件是自动严格的，并且允许import、export语句。<br />
         * 4、unambiguous：如果存在import、export语句，则将文件视为'module'，否则将其视为'script'。<br />
         * 5、unambiguous在类型未知的上下文中非常有用，但它可能导致错误匹配，因为拥有不使用import、export语句的模块文件是完全有效的。<br />
         * 6、此选项很重要，因为当前文件的类型会影响输入文件的解析，以及可能希望将import、require用法添加到当前文件的某些转换。<br />
         * 7、例如，@babel/plugin-transform-runtime依赖于当前文档的类型来决定是插入一个import声明，还是一个require()调用。<br />
         * 8、@babel/preset-env也对自己的“useBuiltIns”选项做同样的事情。<br />
         * 9、由于Babel默认将文件处理为ES模块，因此这些plugins、presets通常会插入import语句。<br />
         * 10、设置正确的sourceType可能很重要，因为错误的类型会导致Babel将import语句插入到本来应该是CommonJS文件的文件中。<br />
         * 11、这在正在执行node_modules依赖项编译的项目中尤其重要，因为插入import语句可能会导致Webpack和其他工具将文件视为ES模块。破坏原本可以正常工作的CommonJS文件。<br />
         * 12、注意：此选项不会影响.mjs文件的解析，因为它们目前被硬编码为始终解析为'module'文件。<br />
         */
        sourceType: 'unambiguous',
        // 在Babel的错误消息中突出显示代码片段中的标记，使其更易于阅读。
        highlightCode: true,
        // 一个不透明的对象，包含传递给正在使用的解析器的选项。
        parserOpts: {
          // 默认情况下，解析器在表达式节点上设置extra.parenthesized。当此选项设置为true时，将创建ParenthesizedExpression AST节点。
          // createParenthesizedExpressions: true,
          /**
           * 默认情况下，Babel在发现一些无效代码时总是会抛出错误。当此选项设置为true时，它将存储解析错误并尝试继续解析无效的输入文件。<br />
           * 1、生成的AST将有一个errors属性，表示所有解析错误的数组。请注意，即使启用此选项，@babel/parser也可能抛出不可恢复的错误。<br />
           */
          // errorRecovery: true,
          // 将输出AST节点与其源文件名相关联。从多个输入文件的AST生成代码和源映射时很有用。
          // sourceFilename: true,
          // 默认情况下，解析的代码被视为从第1行第0列开始。您可以提供一个列号以替代开始。对于与其他源工具的集成很有用。
          // startColumn: 0,
          // 默认情况下，解析的代码被视为从第1行第0列开始。您可以提供一个行号以替代开始。对于与其他源工具的集成很有用。
          // startLine: 1,
          // 默认情况下，导入和导出声明只能出现在程序的顶层。将此选项设置为true允许它们在任何允许声明的地方出现。
          allowImportExportEverywhere: false,
          // 默认情况下，await只允许在异步函数内部使用，或者在启用topLevelAwait插件时，在模块的顶级范围内使用。将此设置为true以在脚本的顶级范围内也接受它。不鼓励使用此选项以支持topLevelAwait插件。
          allowAwaitOutsideFunction: true,
          // 默认情况下，new.target的使用在函数或类之外是不允许的。将此设置为 "true "以接受此类代码。
          allowNewTargetOutsideFunction: false,
          // 默认情况下，顶层的return语句会引发错误。将此设置为true以接受此类代码。
          allowReturnOutsideFunction: true,
          // 默认情况下，不允许在类和对象方法之外使用super。将此设置为true以接受此类代码。
          allowSuperOutsideMethod: true,
          /**
           * 默认情况下，导出未在当前模块范围内声明的标识符将引发错误。<br />
           * 1、虽然这种行为是ECMAScript模块规范所要求的，但Babel的解析器无法预测插件管道中稍后可能插入适当声明的转换。<br />
           * 2、所以有时将此选项设置为true以防止解析器过早地抱怨稍后将添加的未声明的导出很重要。<br />
           */
          allowUndeclaredExports: true,
          /**
           * 默认情况下，Babel将注释附加到相邻的AST节点。当此选项设置为false时，不会附加注释。当输入代码有很多注释时，它可以提供高达30%的性能提升。<br />
           */
          // 1、@babel/eslint-parser会为你设置。不建议将attachComment: false与Babel转换一起使用，因为这样做会删除输出代码中的所有注释，并呈现/* istanbul ignore next */等注释。
          attachComment: true,
          // 默认情况下，Babel根据ECMAScript的附件B "网络浏览器的附加ECMAScript功能 "语法来解析JavaScript。当这个选项设置为false时，Babel将解析没有附件B特定扩展的语法。
          // annexB: true,
          /**
           * 默认情况下，解析器将动态导入 import() 解析为调用表达式节点。
           * 当此选项设置为 true 时，将改为创建 ImportExpression AST 节点。
           * 在 Babel 8 中，此选项将默认为 true。
           */
          createImportExpressions: true,
          // 同上面的sourceType选项。
          sourceType: 'unambiguous',
          // 默认情况下，仅当存在'use strict'指令或解析的文件是ECMAScript模块时，ECMAScript代码才会解析为严格。将此选项设置为true以始终以严格模式解析文件。
          strictMode: true,
          ...( isEnable => {
            return isEnable
                   ? {
                plugins: babelParserPlugins,
              }
                   : {};
          } )( false ),
        },
        /**
         * 1、一个不透明的对象，包含传递给正在使用的代码生成器的选项。<br />
         * 2、minified、comments、shouldPrintComment这3个选项会影响魔术注解！当它们为如下时才能正常使魔术注解生效，尤其是动态导入的代码切割等等能力：<br />
         * minified: true,
         * comments: true,
         * shouldPrintComment: () => true,
         */
        generatorOpts: {
          /**
           * Babel将努力生成代码，以便将项目打印在与原始文件中相同的行上。<br />
           * 1、值类型：boolean，默认值：false。<br />
           * 2、存在此选项是为了让无法使用源映射的用户可以获得模糊有用的错误行号，但这只是尽力而为，并不保证在所有情况下都适用于所有插件。<br />
           */
          retainLines: !isProduction,
          /**
           * 在紧凑模式下生成代码时，将省略所有可选的换行符和空格。<br />
           * 1、值类型：boolean、string（只有一个有效值：'auto'），默认值：'auto'。<br />
           * 2、“auto”将通过评估来设置值：code.length > 500_000。<br />
           */
          compact: isProduction,
          // 设置为true以减少空格，但不如上面的compact选项减少的那么多。
          concise: isProduction,
          // 保留函数表达式周围的括号，可用于更改引擎解析行为。
          retainFunctionParens: true,
          /**
           * 当compact: true时，省略块尾分号，在可能的情况下从new Foo()中省略 ()，并且可能输出较短版本的文字。<br />
           * 1、值类型：boolean，默认值：false。<br />
           */
          minified: isProduction,
          /**
           * 如果没有给出函数，则为下面shouldPrintComment选项提供默认的评论状态。有关详细信息，请参阅下面的shouldPrintComment该选项的默认值。<br />
           * 1、值类型：boolean，默认值：true。<br />
           */
          comments: true,
          /**
           * 一个函数，可以决定给定的注释是否应该包含在Babel的输出代码中。<br />
           * 1、值类型：function（ ( value: string ) => boolean ），默认值：<br />
           * 没有上面的minified选项（如果有但是值为false）时，默认值为：( val ) => opts.comments || /@license|@preserve/.test( val ) 。<br />
           * 有上面的minified选项（且值为true）时，默认值为：() => opts.comments 。<br />
           */
          shouldPrintComment: () => true,
          // 设置为true以在输出中“export”之前打印装饰符。在2022年3月的TC39会议上就Stage 3达成共识的提案版本要求decoratorsBeforeExport为false，allowCallParenthesized也为false。
          decoratorsBeforeExport: false,
          recordAndTupleSyntaxType: 'hash',
          topicToken: '^^',
          importAttributesKeyword: 'with',
        },
        /**
         * assumptions选项，默认情况下，Babel会尝试编译您的代码，以使其尽可能地匹配本机行为。然而，这有时意味着生成更多的输出代码，或者更慢的输出代码，只是为了支持一些你不关心的边缘情况。<br />
         * 1、详细文档见：https://babeljs.io/docs/en/assumptions。<br />
         * 2、从Babel 7.13.0开始，您可以在配置中指定一个假设选项来告诉Babel它可以对您的代码做出哪些假设，从而更好地优化编译结果。注意：这取代了插件中的各种松散选项，取而代之的是可以应用于多个插件的顶级选项（RFC链接）。<br />
         * 3、这是高级功能。启用假设时请小心，因为它们不符合规范，并且可能会以意想不到的方式破坏您的代码。<br />
         * 4、当前下面的配置全被我设置成false，以使用非宽松的规范语法去转译它们。<br />
         */
        ...( isEnable => {
          return isEnable
                 ? {
              assumptions: {
                /**
                 * 当传播或迭代类似数组的对象时，假设它实现了一个与原生Array.prototype[Symbol.iterator]具有相同行为的[Symbol.iterator]方法，因此直接按索引对其元素进行迭代。<br />
                 * 1、这可能很有用，例如，在旧浏览器中迭代DOM集合。<br />
                 */
                arrayLikeIsIterable: false,
                /**
                 * 从模块重新导出绑定时，假设它没有更改，因此直接导出它是安全的。<br />
                 * 1、注意：这也会影响transform-modules-umd和transform-modules-amd插件。<br />
                 */
                constantReexports: false,
                /**
                 * 使用Object.setPrototypeOf可以随时更改类的超类，使Babel无法静态知道它。启用此选项后，Babel假定它从未更改过，因此它始终是放置在类声明中的extends子句中的值。<br />
                 */
                constantSuper: false,
                /**
                 * 在将ESM编译为CJS时，Babel在module.exports对象上定义了一个__esModule属性。假设您从未使用for..in或Object.keys遍历module.exports或require("your-module")的键，因此将__esModule定义为可枚举是安全的。<br />
                 */
                enumerableModuleMeta: false,
                /**
                 * 函数有一个.length属性，它反映了参数的数量，直到最后一个非默认参数。启用此选项后，假定编译后的代码不依赖此.length属性。
                 */
                ignoreFunctionLength: false,
                /**
                 * 当使用可能调用对象的[Symbol.toPrimitive]方法的语言功能时，假设它们不会根据提示参数改变其行为。
                 */
                ignoreToPrimitiveHint: false,
                /**
                 * 使用可迭代对象时（在数组解构、for-of 或...扩展中），假设它是一个数组。
                 */
                iterableIsArray: false,
                /**
                 * 不要将Object.freeze用于为标记模板文字创建的模板对象。这实际上意味着使用taggedTemplateLiteralLoose助手而不是taggedTemplateLiteral。
                 */
                mutableTemplateObject: false,
                /**
                 * 转换类时，假设它们总是用new实例化并且它们从不被称为函数。
                 */
                noClassCalls: false,
                /**
                 * 使用检查null或undefined的运算符时，假定它们从未与特殊值document.all一起使用。
                 */
                noDocumentAll: false,
                /**
                 * 假设在初始化之前没有观察到模块导出对象的自身属性。例如，当尝试访问ns.foo时，无论打开还是关闭此假设，它都会返回undefined。<br />
                 * 1、不同之处在于Object.prototype.hasOwnProperty.call(ns, "foo")在noIncompleteNsImportDetection: true时会返回false。<br />
                 */
                noIncompleteNsImportDetection: false,
                /**
                 * 假设代码从不尝试使用new实例化箭头函数，根据规范这是不允许的。<br />
                 * 1、注意：此默认为true。从Babel 8开始，它将默认为false。<br />
                 */
                noNewArrows: false,
                /**
                 * 假设在类初始化之前，代码从未尝试访问过类的私有字段。
                 */
                noUninitializedPrivateFieldAccess: false,
                /**
                 * 在对象解构中使用休息模式时，假设解构对象没有符号键，或者如果不复制它们就没有问题。
                 */
                objectRestNoSymbols: false,
                /**
                 * 假设“软隐私”对于私有字段就足够了，因此它们可以存储为具有唯一名称的公共不可枚举属性（而不是使用外部WeakMap）。这使得调试编译的私有字段更容易。
                 */
                privateFieldsAsProperties: false,
                /**
                 * 假设 "软隐私 "对私有字段来说就足够了，因此可以将它们存储为带有符号键的公共属性（而不是使用外部 WeakMap）。 这使得调试已编译的私有字段变得更容易。
                 */
                privateFieldsAsSymbols: false,
                /**
                 * 假设getter（如果存在）没有副作用并且可以多次访问。
                 */
                pureGetters: false,
                /**
                 * 声明类时，假设方法不会影响超类上的getter，并且程序不依赖于不可枚举的方法。因此，分配方法而不是使用Object.defineProperty是安全的。
                 */
                setClassMethods: false,
                /**
                 * 使用计算对象属性时，假设对象不包含覆盖同一对象中定义的setter 的属性，因此分配它们而不是使用Object.defineProperty定义它们是安全的。
                 */
                setComputedProperties: false,
                /**
                 * 使用公共类字段时，假设它们不会影响当前类、其子类或超类中的任何getter。因此，分配它们而不是使用Object.defineProperty是安全的。
                 */
                setPublicClassFields: false,
                /**
                 * 使用对象扩展时，假设扩展的属性不会触发目标对象上的getter，因此分配它们而不是使用Object.defineProperty定义它们是安全的。
                 */
                setSpreadProperties: false,
                /**
                 * 将for-of与迭代器一起使用时，应始终使用.return()和.throw()将其关闭以防出错。当调用此选项时，Babel假定这些方法未定义或为空，并避免调用它们。
                 */
                skipForOfIteratorClosing: false,
                /**
                 * 扩展类时，假设超类是可调用的。这意味着无法扩展原生类或内置函数，只能扩展已编译的类或ES5函数构造函数。
                 */
                superIsCallableConstructor: false,
              },
            }
                 : {};
        } )( false ),
      },
      babelLoaderJSXConfig = Object.assign( {}, babelLoaderConfig, {
        presets: babelPresetsJSX,
      } );

    /**
     * 1、请注意，虽然支持包含顶级等待的转换代码，但仅当format选项设置为esm时，才支持包含顶级等待的捆绑代码。<br />
     * 2、对ES5支持不好，尚不支持将ES6+语法转换为ES5。但是，如果您使用esbuild转换ES5代码，您仍应将目标设置为es5。<br />
     */
    const esbuildLoaderConfigForJS = ( () => {
        const obj1 = JSON.parse( JSON.stringify( esbuildMinifyConfig ) );

        if( !isProduction ){
          delete obj1.minifyWhitespace;
          delete obj1.minifyIdentifiers;
          delete obj1.minifySyntax;
          delete obj1.legalComments;
          /**
           * 当使用babel转换JS语法时，drop选项（相当于babel的removeConsole、removeDebugger）不使用，其同样的功能交给babel预设处理，这里就不用重复设置了。但是如果使用esbuild转换JS时，还是要启用drop选项的。<br />
           *
           * 注意：<br />
           * 如果在诸如console.log()中编写某些跟项目逻辑业务有关的代码，那么当启用removeConsole、removeDebugger时，会导致最后输出的代码中因为删除了诸如console.log()，从而导致其中的某些跟项目逻辑业务有关的代码也被删除，最终使生产的代码出现非所愿期望的代码输出，从而报错。<br />
           * 所以，诸如console.log()中不要做任何逻辑处理（哪怕是：++index这种最简单的逻辑），只作为纯日志输出。<br />
           * 例如：<br />
           * let index = 0, arr001 = [ 'qqq', 'www', ], str001 = '';
           *
           * for( const item of arr001 ){
           *   str001 + = item;
           *
           *   console.log( `index--->${ ++index }` );
           * }
           * 当没有启用removeConsole、removeDebugger时，执行上述代码后，index的值为3，但是如果启用removeConsole、removeDebugger，则index的值为0，那么显然这不是期望的。<br />
           *
           * 对于drop选项，当前配置是这样的，“webpack.test.mjs”中不设置drop选项（对应的是不删除操作），webpack.production.mjs中设置drop选项（对应的是删除操作）。<br />
           */
          'drop' in obj1 && ( delete obj1.drop );
          obj1.minify = false;
        }

        return Object.assign( {}, obj1, {
          // 一旦esbuild达到稳定版本，implementation选项将被删除。相反，esbuild将成为peerDependency，因此您始终提供自己的。
          implementation: ESBuild,
          // Invalid option in transform() call: "incremental".
          // incremental: !isProduction,
          /**
           * 1、通常这是在您使用target选项设置时为您自动配置的，您通常应该使用target选项设置而不是supported选项设置。如果除此supported选项设置之外还指定了target选项，则此supported选项设置将覆盖target选项指定的任何内容。<br />
           * 2、例如，您可以使用它来告诉esbuild BigInts不受支持，以便esbuild在您尝试使用BigInts时生成错误。<br />
           * 3、此设置允许您在单个语法功能级别自定义esbuild的一组不受支持的语法功能。<br />
           * 4、JavaScript运行时通常会快速实现较旧的JavaScript较慢的较新语法功能，您可以通过告诉esbuild假装不支持此语法功能来获得加速。<br />
           * 5、如果想告知esbuild不支持某个语法，就这么设置：'bigint': false，如果是支持就将值设置成true。<br />
           */
          ...( isEnable => {
            return isEnable
                   ? {
                supported: {
                  // ES2015语法 Start
                  'arrow': true,
                  'class': true,
                  'array-spread': true,
                  'const-and-let': true,
                  'default-argument': true,
                  'destructuring': true,
                  'for-of': true,
                  'generator': true,
                  'new-target': true,
                  'rest-argument': true,
                  'template-literal': true,
                  'unicode-escapes': true,
                  'regexp-sticky-and-unicode-flags': true,
                  'regexp-match-indices': true,
                  // ES2015语法 End

                  // ES2016 Start
                  'exponent-operator': true,
                  // ES2016 End

                  // ES2017语法 Start
                  'async-await': true,
                  // ES2017语法 End

                  // ES2018语法 Start
                  'async-generator': true,
                  'for-await': true,
                  'object-rest-spread': true,
                  'object-accessors': true,
                  'object-extensions': true,
                  'regexp-named-capture-groups': true,
                  'regexp-dot-all-flag': true,
                  'regexp-unicode-property-escapes': true,
                  'regexp-lookbehind-assertions': true,
                  // ES2018语法 End

                  // ES2019语法 Start
                  'optional-catch-binding': true,
                  // ES2019语法 End

                  // ES2020语法 Start
                  'bigint': true,
                  'dynamic-import': true,
                  'export-star-as': true,
                  'import-meta': true,
                  'nullish-coalescing': true,
                  'optional-chain': true,
                  // ES2020语法 End

                  // ES2021语法 Start
                  'logical-assignment': true,
                  // ES2021语法 End

                  // ES2022语法 Start
                  'class-field': true,
                  'class-private-accessor': true,
                  'class-private-brand-check': true,
                  'class-private-field': true,
                  'class-private-method': true,
                  'class-private-static-accessor': true,
                  'class-private-static-field': true,
                  'class-private-static-method': true,
                  'class-static-blocks': true,
                  'class-static-field': true,
                  'arbitrary-module-namespace-names': true,
                  'top-level-await': true,
                  'typeof-exotic-object-is-object': true,
                  // ES2022语法 End

                  // ESNext语法 Start
                  'decorators': true,
                  'hashbang': true,
                  'import-assertions': true,
                  'nested-rest-binding': true,
                  'function-or-class-property-access': true,
                  'regexp-set-notation': true,
                  'using': true,
                  // ESNext语法 End

                  // node（node:module） Start
                  'node-colon-prefix-import': false,
                  'node-colon-prefix-require': false,
                  // node（node:module） End
                },
              }
                   : {};
          } )( false ),
        } );
      } )(),
      esbuildLoaderConfigForJSX = Object.assign( {}, esbuildLoaderConfigForJS, {
        loader: 'jsx',
        // 有效值有：'transform'、'preserve'、'automatic'。
        jsx: 'automatic',
        jsxDev: !isProduction,
        // 有效值有：'React.createElement'（默认值）、'h'，当jsx转换设置为'automatic'时，此设置不适用。
        jsxFactory: 'React.createElement',
        // 有效值有：'React.Fragment'（默认值）、'Fragment'，当jsx转换设置为'automatic'时，此设置不适用。
        jsxFragment: 'React.Fragment',
        // 默认情况下，esbuild假定JSX表达式是无副作用的，这意味着它们被注释为/* @__PURE__ */，并且在捆绑过程中，当它们未被使用时被删除。
        // 这遵循了JSX在虚拟DOM中的普遍使用，适用于绝大多数的JSX库。
        // 然而，有些人编写的JSX库没有这个属性（特别是JSX表达式可以有任意的副作用，在未使用时不能被删除）。
        // 如果你正在使用这样的库，你可以使用这个设置来告诉esbuild，JSX表达式有副作用：jsxSideEffects: true。
        jsxSideEffects: true,
      } ),
      esbuildLoaderConfigForTS = Object.assign( {}, esbuildLoaderConfigForJS, {
        loader: 'ts',
        /**
         * 1、从esbuild-loader包的代码中可知，其会自动判断有没有设置tsconfigRaw选项，没有的话，会自动从项目根目录尝试加载tsconfig.json文件。<br />
         * 2、tsconfigRaw的值类型得是字符串文本，而不是object，但它不会解析extends属性。<br />
         * 3、但是从esbuild包的代码中可知，它会自动判断，如果是字符串文本，它就直接使用，如果不是字符串文本，会直接使用JSON.stringify()转成字符串文本。<br />
         * 4、esbuild仅支持tsconfig选项的子集（请参阅TransformOptions接口，也就是只支持tsconfig.json文件中的compilerOptions选项）并且不进行类型检查。<br />
         * 5、esbuild文档还建议在您的tsconfig中启用isolatedModules和esModuleInterop选项。<br />
         * 6、如：tsconfigRaw: string | { compilerOptions: {} }。<br />
         * 7、必须在项目根目录存在一个有效的tsconfig.json、tsconfig.webpack.json文件。<br />
         */
        tsconfigRaw: ( tsconfigPath => {
          let obj1 = JSON.parse( JSON.stringify( tsconfig_webpack_json ) ),
            resultCompilerOptionsObj = Object.prototype.toString.call( obj1.compilerOptions ) === '[object Object]'
                                       ? JSON.parse( JSON.stringify( obj1.compilerOptions ) )
                                       : {},
            path1 = '',
            dirNamePath1 = dirname( resolve( __dirname, tsconfigPath ) );

          while( 'extends' in obj1 && obj1.extends.length !== 0 ){
            path1 = resolve( dirNamePath1, obj1.extends );

            dirNamePath1 = dirname( path1 );

            obj1 = JSON5.parse( String( readFileSync( path1 ) ) );

            resultCompilerOptionsObj = Object.assign( {}, Object.prototype.toString.call( obj1.compilerOptions ) === '[object Object]'
                                                          ? JSON.parse( JSON.stringify( obj1.compilerOptions ) )
                                                          : {}, JSON.parse( JSON.stringify( resultCompilerOptionsObj ) ) );
          }

          return JSON.stringify( {
            compilerOptions: {
              ...JSON.parse( JSON.stringify( resultCompilerOptionsObj ) ),
              esModuleInterop: true,
              // 选项'isolatedModules'是多余的，不能与选项'verbatimModuleSyntax'一起指定，优先使用verbatimModuleSyntax。
              // isolatedModules: true,
            },
          } );
        } )( './tsconfig.webpack.json' ),
      } ),
      esbuildLoaderConfigForTSX = Object.assign( {}, esbuildLoaderConfigForTS, {
        loader: 'tsx',
        // 有效值有：'transform'、'preserve'、'automatic'。
        jsx: 'automatic',
        jsxDev: !isProduction,
        // 有效值有：'React.createElement'（默认值）、'h'，当jsx转换设置为'automatic'时，此设置不适用。
        jsxFactory: 'React.createElement',
        // 有效值有：'React.Fragment'（默认值）、'Fragment'，当jsx转换设置为'automatic'时，此设置不适用。
        jsxFragment: 'React.Fragment',
      } );

    const MiniCssExtractPluginLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
          /**
           * 1、默认值：false。
           * 2、只有在 css-loader 中将 namedExport 设置为 true 时，该选项才会起作用。
           * 3、默认情况下，mini-css-extract-plugin 会根据 css-loader 中的 esModule 和 namedExport 选项生成 JS 模块。
           * 使用 esModule 和 namedExport 选项可以更好地优化代码。
           * 如果在 css-loader 中设置 esModule: true 和 namedExport: true，mini-css-extract-plugin 将只生成命名导出。
           * 我们的官方建议是只使用命名导出，以提高未来的兼容性。
           * 但对于某些应用程序，要快速将代码从默认导出重写为已命名导出并不容易。
           * 4、如果同时需要默认导出和命名导出，可以启用此选项。
           */
          defaultExport: true,
          // 如果为真，则发出一个文件（将文件写入文件系统）。如果为false，插件将提取CSS，但不会发出文件。对服务器端包禁用此选项通常很有用。
          emit: true,
          // 该loader的该选项默认值是true。
          // esModule: true,
        },
      },
      styleLoader = {
        loader: 'style-loader',
        options: {
          // 工作方式与styleTag相同，但如果代码在IE6-9中执行，则打开singletonStyleTag模式。
          injectType: 'autoStyleTag',
          attributes: {
            'data-is-production': `${ isProduction }`,
          },
          insert: 'head',
          // 该loader的该选项默认值是true。
          // esModule: true,
        },
      },
      cssLoader = {
        loader: 'css-loader',
        options: {
          /**
           * 1、允许过滤url()。所有过滤的url()都不会被解析（在编写时留在代码中）。<br />
           * 2、函数里返回true表示处理，返回false就是不处理，其原样留在代码里。<br />
           * 3、可以在此url()函数中使用相对地址。相对地址相对于CSS样式表的URL（而不是网页的URL）。<br />
           * 4、注意，目前无法识别到那些无http:、https:协议头的远程链接，也就是无法识别那些以'//'开头的远程链接，会直接原样将其保留在源码中。<br />
           */
          // 使用，/* webpackIgnore: true */，魔术注释来开启禁用url()解析。
          url: {
            /**
             * 允许过滤url()。所有过滤的url()都不会被解析（在编写时留在代码中）。<br />
             * 1、函数里返回true表示处理，返回false就是不处理，其原样留在代码里。<br />
             * 2、可以在此url()函数中使用相对地址。相对地址相对于CSS样式表的URL（而不是网页的URL）。<br />
             * 3、注意，目前无法识别到那些无http:、https:协议头的远程链接，也就是无法识别那些以'//'开头的远程链接，会直接原样将其保留在源码中。<br />
             *
             * @param {string} url 资源的url，值形如：../static/ico/favicon.ico、http://www.xxx.com/1.jpg、~imgDir/ico_48_48.png。<br />
             *
             * @param {string} resourcePath css文件的路径，值形如：G:\WebStormWS\upload-for-multiple\src\pages\index\Index.css。<br />
             *
             * @returns {boolean} 函数里返回true表示处理，返回false就是不处理，其原样留在代码里。
             */
            filter: ( url, resourcePath ) => {
              const boo = cssLoader_url_import_IgnoreArr.some( item => String( url ).trim().startsWith( item ) );

              return !boo;
            },
          },
          /**
           * 参见上面的url选项。<br />
           */
          // 使用，/* webpackIgnore: true */，魔术注释来开启禁用@import解析。
          import: {
            filter: ( url, media, resourcePath, supports, layer ) => {
              const boo = cssLoader_url_import_IgnoreArr.some( item => String( url ).trim().startsWith( item ) );

              return !boo;
            },
          },
          importLoaders: 1,
          sourceMap: false,
          // 该loader的这个选项默认值是true，并且，在启用experiments.buildHttp后，要想CSS文件里的远程资源能自动被各自对应的loader处理，就必须将该选项设置为true。
          // esModule: true,
        },
      },
      cssLoaderModules = {
        auto: (
          // G:\WebStormWS\upload-for-multiple\src\pages\index\css_modules\example.module.css
          resourcePath,
          // ?vue&type=style&index=1&module=exampleMCSS&lang=css&external
          resourceQuery,
          resourceFragment
        ) => basename( resourcePath ).includes( '.module.' ) || basename( resourcePath ).includes( '.modules.' ) || /module/.test( resourceQuery ),
        mode: (
          // G:\WebStormWS\upload-for-multiple\src\pages\index\css_modules\example.module.css
          resourcePath,
          // ?vue&type=style&index=1&module=exampleMCSS&lang=css&external
          resourceQuery,
          resourceFragment
        ) => {
          const fileName = basename( resourcePath );

          if( fileName.includes( '.global.' ) ){
            return 'global';
          }
          else if( fileName.includes( '.pure.' ) ){
            return 'pure';
          }
          else if( fileName.includes( '.icss.' ) ){
            return 'icss';
          }
          else{
            return 'local';
          }
        },
        localIdentName: isProduction
          // example-module-css_Black_e2a1315f
                        ? '[name][ext]_[local]_[sha512:contenthash:hex:8]'
          // src-pages-index-css_modules-example-module-css_Black
                        : '[file]_[local]',
        localIdentHashFunction: 'sha512',
        localIdentHashDigest: 'hex',
        localIdentHashDigestLength: 20,
        hashStrategy: 'resource-path-and-local-name',
        /**
         * 注意：<br />
         * 1、因为对于Vue的SFC来说，只有内部模块部署了default属性并且其上有各个样式值，才能成功注入并处于可使用状态，诸如useCssModule( 'examplePcss' )。<br />
         * 2、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。因为，namedExport为true时，需要mini-css-extract-plugin的选项defaultExport为true一起配合，才能正常使用（也就是可以同时使用具名导出、默认导出、全部导出）。<br />
         */
        namedExport: true,
        // 允许css-loader从全局的类或id导出名称，这样就可以将其用作本地名称。
        exportGlobals: true,
        /**
         * 1、如果"namedExport"为"false"，即"exportLocalsConvention"选项的默认值为"camel-case-only"，则本地程序的名称会转换为驼峰小写。
         * 2、你可以将其设置为任何其他有效选项，但如果选择器不是有效的 JavaScript 标识符，可能会遇到无法执行整个模块规范的问题。
         * 3、'as-is'：类名将按原样导出。
         * 4、'camel-case'：类名将被骆驼化，原类名不会从本地语言中删除。
         * 5、'camel-case-only'：类名将被骆驼化，原始类名将从本地语言中删除。
         * 6、'dashes'：只有类名中的破折号会被驼峰化。
         * 7、'dashes-only'：类名中的破折号将被驼峰化，原始类名将从本地语言中删除。
         */
        exportLocalsConvention: 'dashes',
        exportOnlyLocals: false,
      },
      postCSSLoader = {
        loader: 'postcss-loader',
        options: {
          implementation: postcss,
          // 在CSS-in-JS中启用PostCSS Parser支持。如果您使用JS样式的postcss-js解析器，请添加执行选项为true。
          execute: false,
          sourceMap: false,
          postcssOptions: {
            config: resolve( __dirname, './postcss.config.mjs' ),
          },
        },
      },
      /**
       * 1、不推荐使用~并且可以从您的代码中删除（我们推荐它），但由于历史原因我们仍然支持它。为什么可以去掉？加载器将首先尝试将@import解析为相对，如果无法解析，加载器将尝试在node_modules中解析@import。<br />
       * 2、首先我们尝试使用内置的less解析逻辑，然后是webpack解析逻辑。<br />
       * 3、webpack提供了一种高级机制来解析文件。less-loader应用了一个Less插件，如果less无法解析@import，它将所有查询传递给webpack解析器。因此，您可以从node_modules导入您的Less模块。<br />
       */
      lessLoader = {
        loader: 'less-loader',
        options: {
          implementation: less,
          sourceMap: false,
          // 在某些情况下，这可以提高性能。谨慎使用它，因为来自node_modules的别名和@import将不起作用。
          webpackImporter: true,
          lessOptions: {
            // 该选项不建议使用，已弃用，它已由math选项代替，该选项为true时，会将math选项设置为2。
            // strictMath: true,
            // 已弃用。该选项为true时，rewriteUrls选项会被设置为2，2对应'all'。
            // relativeUrls: true,
            // 兼容IE 8，不推荐使用，已废弃，从v3.0.0开始默认为false。当前仅用于data-uri函数，以确保不会创建太大的图像，以至于浏览器无法处理。
            // ieCompat: false,
            // 已废弃，从v3.0.0开始默认为false。替换为@plugin选项。
            // javascriptEnabled: false,
            // 已废弃，生成内联源映射。这是浏览器开始支持源地图之前的唯一选择，有效值：'comments'、'mediaquery'、'all'。
            // dumpLineNumbers: 'comments',
            // 已废弃，
            // compress: false,

            /**
             * math选项的4个有效值，具体设置时，设置成字符串值也行，设置成number也行（优先用number设置吧），它们是一一对应的，less包的代码里会进行自动判断：<br />
             * 1、always（对应：0）：less 3.x版本的默认值，总是执行数学运算。<br />
             * 2、parens-division（对应：1）：less 4.0版本的默认值，对使用“/”且两边的操作数没有被括号括起来的不进行计算（不计算：2px / 2），其他都进行数学计算（做计算：(2px / 2)）。<br />
             * 3、parens、strict（对应：2）：这两个都表示同一个，只对被括号包裹的进行计算，其他都不计算。<br />
             * 4、strict-legacy（对应：3）：该值在less 4.0版本中被删除了，都不做计算，原样保留。<br />
             */
            math: 2,
            /**
             * 1、启用严格单位后，我们假设这是计算中的错误并引发错误：.class { property: 1px * 2px; }，因为在这种情况下，事情显然不对，长度乘以长度得到一个区域，但css不支持指定区域。<br />
             * 2、如果没有此选项，Less在进行数学运算时会尝试猜测输出单元。所以我们假设用户希望其中一个值是一个值，而不是一个长度单位，我们输出2px。<br />
             */
            strictUnits: true,
            // 只报告错误，没有任何输出，设置成false表示不会启用。
            lint: false,
            // 允许从不安全的HTTPS主机导入。
            insecure: true,
            // 将生成文件导入依赖项列表输出到标准输出。
            depends: false,
            // 终端中的颜色输出。
            color: true,
            // strictImports选项控制编译器是否允许在@media块或（稍后添加的）其他选择器块内进行@import。
            strictImports: false,
          },
          // 如果将 lessLogAsWarnOrErr 设置为 false，它将只是一个日志，Webpack 会编译成功，但如果将该选项设置为 true，Webpack 编译失败时会发出警告。
          lessLogAsWarnOrErr: true,
        },
      },
      /**
       * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
       * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
       * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
       * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
       * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
       * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
       * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
       * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
       * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
       * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
       * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
       * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
       * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
       */
      sassLoader = {
        loader: 'sass-loader',
        options: {
          /**
           * 选择使用哪种sass实现，有sass(dart-sass)、node-sass、sass-embedded。导入sass这个包名就行，它已经等同于dart-sass包。
           * 注意：sass-loader从开始15.0.0，默认使用“sass-embedded”作为默认实现！
           */
          implementation: SassEmbedded,
          // 如果为true，sassOptions中的sourceMap、sourceMapRoot、sourceMapEmbed、sourceMapContents和omitSourceMapUrl将被忽略。
          sourceMap: false,
          /**
           * 启用、禁用默认的Webpack导入器。<br />
           * 1、值类型：boolean，默认值：true。<br />
           * 2、在某些情况下，这可以提高性能。请谨慎使用，因为以~开头的别名和@import规则将不起作用。<br />
           */
          webpackImporter: true,
          /**
           * 将@warn规则视为webpack警告。<br />
           * 1、默认值：false，值类型：boolean，在下一个主要版本中默认值将为true。<br />
           * 2、该值设置为true时，呈现的代码将抛出webpack警告而不是日志记录，要忽略不必要的警告，您可以使用ignoreWarnings选项。<br />
           */
          warnRuleAsWarning: true,
          /**
           * 允许您在旧API和现代API之间切换。您可以在这里找到更多信息：https://sass-lang.com/documentation/js-api。<br />
           * 1、默认值：'legacy'，值类型：string，有效值有：'legacy'、'modern'、'modern-compiler'。<br />
           * 2、“modern”API是实验性的，因此某些功能可能无法正常工作（已知：内置importer不工作，并且在初始运行时未观察有错误的文件），您可以查阅此链接来了解详情：https://github.com/webpack-contrib/sass-loader/issues/774。<br />
           * 3、'modern'API和旧API（legacy）的sass选项是不同的。请查看文档如何迁移新选项：https://sass-lang.com/documentation/js-api。<br />
           * 4、同时使用 modern-compiler 和 sass-embedded 可显著提高性能并缩短构建时间。 我们强烈推荐使用它们。 我们将在未来的主要版本中默认启用它们。<br />
           */
          api: 'modern-compiler',
          /**
           * 1、data、file这两个选项是不可用的，会被忽略。<br />
           * 2、我们强烈建议不要更改outFile、sourceMapContents、sourceMapEmbed、sourceMapRoot选项，因为当sourceMap选项为true时，sass-loader会自动设置这些选项。<br />
           * 3、sass(dart-sass)和node-sass选项之间存在细微差别。<br />
           * 4、sass(dart-sass)的'modern'API和旧API（legacy）的sass选项是不同的。请查看文档如何迁移新选项：https://sass-lang.com/documentation/js-api。<br />
           * 5、使用Dart Sass实现和sass-embedded实现则sassOptions选项里面不支持以下选项：precision、sourceComments。<br />
           * 6、使用sass-embedded实现则sassOptions选项里面不支持以下选项，但是Dart Sass实现还是支持的：indentWidth、indentType、linefeed。<br />
           * 7、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
           * 8、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
           * 9、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
           * 10、上面的api选项的值也会影响sassOptions选项里的各个选项。'modern'API和旧API（legacy）的sass选项是不同的。请查看文档如何迁移新选项：https://sass-lang.com/documentation/js-api。<br />
           */
          sassOptions: {
            // 作者自己说这个库已经过时了，不建议再使用它了！设置成false就可以禁用它，而不是不设置，因为默认是启用它的。
            fiber: false,
            /**
             * dart-sass的charset选项默认值为true，我们强烈建议不要将值更改为false，因为webpack不支持utf-8以外的文件。<br />
             * 1、值类型：boolean，默认值：true。<br />
             * 2、如果为true，编译器可能会在前面加上@charset "UTF-8";如果输出非ASCII CSS，则为U+FEFF（字节顺序标记）。<br />
             * 3、如果为false，编译器永远不会发出这些字节序列。这在连接或嵌入HTML <style>标记时非常理想（输出仍然是UTF-8）。<br />
             */
            // charset: true,
            quietDeps: false,
            verbose: false,

            // 以下分别列出新旧选项，个人觉得最好就这么全留着两者，按理会根据上面的api选项来使用对应的选项，应该不会有冲突的，毕竟它们之间没有选项覆盖。

            // 旧版选项。
            ...{
              /**
               * 处理.scss文件时，该选项值设置为false即可，但是如果是处理.sass文件，则还是要设置成true的。<br />
               * 1、值类型：boolean，默认值：false。<br />
               */
              indentedSyntax: true,
              /**
               * 生成的CSS是否应该使用空格或制表符进行缩进。<br />
               * 1、值类型：string，默认值：space，有效值：'space'、'tab'。<br />
               * 2、sass-embedded实现不支持该选项，但是Dart Sass实现还是支持的。<br />
               */
              // indentType: 'space',
              /**
               * 每个应使用多少空格或制表符（二者到底哪个取决于indentType选项）生成的CSS中的缩进级别。它必须介于0和10之间（包括0和10）。<br />
               * 1、值类型：number，默认值：2。<br />
               * 2、sass-embedded实现不支持该选项，但是Dart Sass实现还是支持的。<br />
               */
              // indentWidth: 4,
              /**
               * 在生成的CSS中每个行的末尾使用哪个字符序列，它可以具有以下值：<br />
               * 1、'lf'使用U+000A换行。<br />
               * 2、'lfcr'使用U+000A换行符，后跟U+000D回车符。<br />
               * 3、'cr'使用U+000D回车。<br />
               * 4、'crlf'使用U+000D回车符，后跟U+000A换行符。<br />
               * 5、值类型：string，默认值：'lf'，有效值有：'lf'、'lfcr'、'cr'、'crlf'。<br />
               * 6、sass-embedded实现不支持该选项，但是Dart Sass实现还是支持的。<br />
               */
              // linefeed: 'lf',
              /**
               * 已编译CSS的输出样式。有4种可能的输出样式：<br />
               * 1、'expanded'：Dart Sass的默认值，写入每个选择器并声明自己的路线。<br />
               * 2、'compressed'：尽可能多的删除额外字符，并将整个样式表放在一行上。<br />
               * 3、'nested'：Node Sass的默认值，Dart Sass和sass-embedded实现不支持，缩进CSS规则以匹配Sass源的嵌套。<br />
               * 4、'compact'：Dart Sass和sass-embedded实现不支持，将每个CSS规则放在自己的单行上。<br />
               */
              outputStyle: isProduction
                           ? 'compressed'
                           : 'expanded',
            },

            // 新版选项。
            ...{
              /**
               * .scss文件用'scss'，.sass文件用'indented'，.css文件用'css'。<br />
               * 1、默认值：'scss'，值类型：string。<br />
               */
              syntax: 'indented',
              // 设置成false会使用非ASCII码以支持更多的字符编码，设置成true会使用ASCII码（ASCII码只有128个字符编码）。
              alertAscii: false,
              alertColor: true,
              /**
               * 已编译CSS的输出样式。有4种可能的输出样式：<br />
               * 1、'expanded'：Dart Sass的默认值，写入每个选择器并声明自己的路线。<br />
               * 2、'compressed'：尽可能多的删除额外字符，并将整个样式表放在一行上。<br />
               * 3、'nested'：Node Sass的默认值，Dart Sass和sass-embedded实现不支持，缩进CSS规则以匹配Sass源的嵌套。<br />
               * 4、'compact'：Dart Sass和sass-embedded实现不支持，将每个CSS规则放在自己的单行上。<br />
               */
              style: isProduction
                     ? 'compressed'
                     : 'expanded',
            },
          },
        },
      },
      /**
       * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
       * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
       * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
       * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
       * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
       * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
       * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
       * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
       * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
       * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
       * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
       * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
       * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
       */
      scssLoader = {
        loader: 'sass-loader',
        options: {
          /**
           * 选择使用哪种sass实现，有sass(dart-sass)、node-sass、sass-embedded。导入sass这个包名就行，它已经等同于dart-sass包。
           * 注意：sass-loader从开始15.0.0，默认使用“sass-embedded”作为默认实现！
           */
          implementation: SassEmbedded,
          // 如果为true，sassOptions中的sourceMap、sourceMapRoot、sourceMapEmbed、sourceMapContents和omitSourceMapUrl将被忽略。
          sourceMap: false,
          /**
           * 启用、禁用默认的Webpack导入器。<br />
           * 1、值类型：boolean，默认值：true。<br />
           * 2、在某些情况下，这可以提高性能。请谨慎使用，因为以~开头的别名和@import规则将不起作用。<br />
           */
          webpackImporter: true,
          /**
           * 将@warn规则视为webpack警告。<br />
           * 1、默认值：false，值类型：boolean，在下一个主要版本中默认值将为true。<br />
           * 2、该值设置为true时，呈现的代码将抛出webpack警告而不是日志记录，要忽略不必要的警告，您可以使用ignoreWarnings选项。<br />
           */
          warnRuleAsWarning: true,
          /**
           * 允许您在旧API和现代API之间切换。您可以在这里找到更多信息：https://sass-lang.com/documentation/js-api。<br />
           * 1、默认值：'legacy'，值类型：string，有效值有：'legacy'、'modern'、'modern-compiler'。<br />
           * 2、“modern”API是实验性的，因此某些功能可能无法正常工作（已知：内置importer不工作，并且在初始运行时未观察有错误的文件），您可以查阅此链接来了解详情：https://github.com/webpack-contrib/sass-loader/issues/774。<br />
           * 3、'modern'API和旧API（legacy）的sass选项是不同的。请查看文档如何迁移新选项：https://sass-lang.com/documentation/js-api。<br />
           * 4、同时使用 modern-compiler 和 sass-embedded 可显著提高性能并缩短构建时间。 我们强烈推荐使用它们。 我们将在未来的主要版本中默认启用它们。<br />
           */
          api: 'modern-compiler',
          /**
           * 1、data、file这两个选项是不可用的，会被忽略。<br />
           * 2、我们强烈建议不要更改outFile、sourceMapContents、sourceMapEmbed、sourceMapRoot选项，因为当sourceMap选项为true时，sass-loader会自动设置这些选项。<br />
           * 3、sass(dart-sass)和node-sass选项之间存在细微差别。<br />
           * 4、sass(dart-sass)的'modern'API和旧API（legacy）的sass选项是不同的。请查看文档如何迁移新选项：https://sass-lang.com/documentation/js-api。<br />
           * 5、使用Dart Sass实现和sass-embedded实现则sassOptions选项里面不支持以下选项：precision、sourceComments。<br />
           * 6、使用sass-embedded实现则sassOptions选项里面不支持以下选项，但是Dart Sass实现还是支持的：indentWidth、indentType、linefeed。<br />
           * 7、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
           * 8、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
           * 9、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
           * 10、上面的api选项的值也会影响sassOptions选项里的各个选项。'modern'API和旧API（legacy）的sass选项是不同的。请查看文档如何迁移新选项：https://sass-lang.com/documentation/js-api。<br />
           */
          sassOptions: {
            // 作者自己说这个库已经过时了，不建议再使用它了！设置成false就可以禁用它，而不是不设置，因为默认是启用它的。
            fiber: false,
            /**
             * dart-sass的charset选项默认值为true，我们强烈建议不要将值更改为false，因为webpack不支持utf-8以外的文件。<br />
             * 1、值类型：boolean，默认值：true。<br />
             * 2、如果为true，编译器可能会在前面加上@charset "UTF-8";如果输出非ASCII CSS，则为U+FEFF（字节顺序标记）。<br />
             * 3、如果为false，编译器永远不会发出这些字节序列。这在连接或嵌入HTML <style>标记时非常理想（输出仍然是UTF-8）。<br />
             */
            // charset: true,
            quietDeps: false,
            verbose: false,

            // 以下分别列出新旧选项，个人觉得最好就这么全留着两者，按理会根据上面的api选项来使用对应的选项，应该不会有冲突的，毕竟它们之间没有选项覆盖。

            // 旧版选项。
            ...{
              /**
               * 处理.scss文件时，该选项值设置为false即可，但是如果是处理.sass文件，则还是要设置成true的。<br />
               * 1、值类型：boolean，默认值：false。<br />
               */
              indentedSyntax: false,
              /**
               * 生成的CSS是否应该使用空格或制表符进行缩进。<br />
               * 1、值类型：string，默认值：space，有效值：'space'、'tab'。<br />
               * 2、sass-embedded实现不支持该选项，但是Dart Sass实现还是支持的。<br />
               */
              // indentType: 'space',
              /**
               * 每个应使用多少空格或制表符（二者到底哪个取决于indentType选项）生成的CSS中的缩进级别。它必须介于0和10之间（包括0和10）。<br />
               * 1、值类型：number，默认值：2。<br />
               * 2、sass-embedded实现不支持该选项，但是Dart Sass实现还是支持的。<br />
               */
              // indentWidth: 2,
              /**
               * 在生成的CSS中每个行的末尾使用哪个字符序列，它可以具有以下值：<br />
               * 1、'lf'使用U+000A换行。<br />
               * 2、'lfcr'使用U+000A换行符，后跟U+000D回车符。<br />
               * 3、'cr'使用U+000D回车。<br />
               * 4、'crlf'使用U+000D回车符，后跟U+000A换行符。<br />
               * 5、值类型：string，默认值：'lf'，有效值有：'lf'、'lfcr'、'cr'、'crlf'。<br />
               * 6、sass-embedded实现不支持该选项，但是Dart Sass实现还是支持的。<br />
               */
              // linefeed: 'lf',
              /**
               * 已编译CSS的输出样式。有4种可能的输出样式：<br />
               * 1、'expanded'：Dart Sass的默认值，写入每个选择器并声明自己的路线。<br />
               * 2、'compressed'：尽可能多的删除额外字符，并将整个样式表放在一行上。<br />
               * 3、'nested'：Node Sass的默认值，Dart Sass和sass-embedded实现不支持，缩进CSS规则以匹配Sass源的嵌套。<br />
               * 4、'compact'：Dart Sass和sass-embedded实现不支持，将每个CSS规则放在自己的单行上。<br />
               */
              outputStyle: isProduction
                           ? 'compressed'
                           : 'expanded',
            },

            // 新版选项。
            ...{
              /**
               * .scss文件用'scss'，.sass文件用'indented'，.css文件用'css'。<br />
               * 1、默认值：'scss'，值类型：string。<br />
               */
              syntax: 'scss',
              // 设置成false会使用非ASCII码以支持更多的字符编码，设置成true会使用ASCII码（ASCII码只有128个字符编码）。
              alertAscii: false,
              alertColor: true,
              /**
               * 已编译CSS的输出样式。有4种可能的输出样式：<br />
               * 1、'expanded'：Dart Sass的默认值，写入每个选择器并声明自己的路线。<br />
               * 2、'compressed'：尽可能多的删除额外字符，并将整个样式表放在一行上。<br />
               * 3、'nested'：Node Sass的默认值，Dart Sass和sass-embedded实现不支持，缩进CSS规则以匹配Sass源的嵌套。<br />
               * 4、'compact'：Dart Sass和sass-embedded实现不支持，将每个CSS规则放在自己的单行上。<br />
               */
              style: isProduction
                     ? 'compressed'
                     : 'expanded',
            },
          },
        },
      },
      stylusLoader = {
        loader: 'stylus-loader',
        options: {
          implementation: Stylus,
          // 在某些情况下，这可以提高性能。请谨慎使用，因为以~开头的别名和@import规则将不起作用。
          webpackImporter: true,
          sourceMap: false,
          stylusOptions: {
            // 值类型：boolean，默认值是：false，在@import上包含常规CSS。
            includeCSS: true,
            // 值类型：boolean、Object，默认值：{ nocheck: true }，resolveURL: true等价于默认值，解析导入文件中的相对url()。
            resolveURL: {
              // 其他解析路径。
              // paths: '',
              // 不要检查文件是否存在。
              nocheck: true,
            },
            // 值类型：boolean，默认值是：false，在生成的CSS中发出注释，指示相应的Stylus行。
            lineNumbers: !isProduction,
            // 值类型：boolean，默认值是：false，将@import和@charset移到顶部。
            hoistAtrules: true,
            // 值类型：boolean，默认值是：false，压缩CSS输出。
            compress: isProduction,
          },
        },
      },
      tsLoaderConfig = {
        loader: 'ts-loader',
        options: {
          /**
           * 1、true表示禁用类型检查器-我们将在"fork-ts-checker-webpack-plugin"插件中使用类型检查。如果你使用ts-loader < 9.3.0，添加transpileOnly选项。<br />
           * 2、transpileOnly: true会使你没有类型检查，也不会输出声明文件，如果需要输出声明文件，你将需要配置fork-ts-checker-webpack-plugin来输出定义文件。<br />
           */
          transpileOnly: true,
          // 如果您使用HappyPack或thread-loader来并行化您的构建，那么您需要将其设置为true。这隐含地将*transpileOnly*设置为true和警告！停止向webpack注册所有错误。
          happyPackMode: true,
          logInfoToStdOut: false,
          logLevel: 'error',
          // 默认值：false，如果为true，则不会发出console.log消息。请注意，大多数错误消息都是通过webpack发出的，不受此标志的影响。
          silent: true,
          // 仅报告与这些glob模式匹配的文件的错误。
          reportFiles: [
            'src/**/*.{ts,cts,mts,tsx}',
            'src/**/*.ts.vue',
            'src/**/*.cts.vue',
            'src/**/*.mts.vue',
            'src/**/*.tsx.vue',
            '!src/**/*.test.ts',
            '!src/**/*.test.cts',
            '!src/**/*.test.mts',
            '!src/**/*.test.esm.ts',
            '!src/**/*.test.commonjs.cts',
            '!src/**/*.test.esm.mts',
          ],
          // 允许使用非官方的TypeScript编译器。应该设置为编译器的NPM名称，例如：ntypescript（已死！）。
          compiler: 'typescript',
          // 允许您指定在哪里可以找到TypeScript配置文件。
          // configFile: resolve( __dirname, './tsconfig.webpack.json' ),
          compilerOptions: ( tsconfigPath => {
            let obj1 = JSON.parse( JSON.stringify( tsconfig_webpack_json ) ),
              resultCompilerOptionsObj = Object.prototype.toString.call( obj1.compilerOptions ) === '[object Object]'
                                         ? JSON.parse( JSON.stringify( obj1.compilerOptions ) )
                                         : {},
              path1 = '',
              dirNamePath1 = dirname( resolve( __dirname, tsconfigPath ) );

            while( 'extends' in obj1 && obj1.extends.length !== 0 ){
              path1 = resolve( dirNamePath1, obj1.extends );

              dirNamePath1 = dirname( path1 );

              obj1 = JSON5.parse( String( readFileSync( path1 ) ) );

              resultCompilerOptionsObj = Object.assign( {}, Object.prototype.toString.call( obj1.compilerOptions ) === '[object Object]'
                                                            ? JSON.parse( JSON.stringify( obj1.compilerOptions ) )
                                                            : {}, JSON.parse( JSON.stringify( resultCompilerOptionsObj ) ) );
            }

            return {
              ...JSON.parse( JSON.stringify( resultCompilerOptionsObj ) ),
            };
          } )( './tsconfig.webpack.json' ),
          colors: true,
          /**
           * 一个与文件名匹配的正则表达式的列表。<br />
           * 如果文件名匹配其中一个正则表达式，一个.ts或.tsx后缀将被附加到该文件名上。<br />
           * 如果你使用HappyPack或者带有ts-loader的thread-loader，你需要为正则表达式使用字符串类型，而不是RegExp对象。<br />
           */
          appendTsSuffixTo: [
            // '\\.ts\\.vue$',
          ],
          /**
           * 一个与文件名匹配的正则表达式的列表。<br />
           * 如果文件名匹配其中一个正则表达式，一个.ts或.tsx后缀将被附加到该文件名上。<br />
           * 如果你使用HappyPack或者带有ts-loader的thread-loader，你需要为正则表达式使用字符串类型，而不是RegExp对象。<br />
           */
          appendTsxSuffixTo: [
            // '\\.tsx\\.vue$',
          ],
          onlyCompileBundledFiles: true,
          useCaseSensitiveFileNames: true,
          allowTsInNodeModules: false,
          context: resolve( __dirname, './' ),
          experimentalFileCaching: true,
          projectReferences: true,
        },
      };

    /**
     * 将资产内联为DataUrl的条件，其属性同module.generator.asset.dataUrl，单位字节。<br />
     *
     * @type {{maxSize: number}}
     */
    const dataUrlCondition = {
        // 单位字节，设置为10KB。
        maxSize: 10 * 1024,
      },
      parserJavascriptConfig = {
        amd: false,
        requireJs: true,
        system: true,
        commonjs: true,
        browserify: true,
        commonjsMagicComments: true,
        dynamicImportFetchPriority: 'auto',
        dynamicImportMode: 'lazy',
        dynamicImportPrefetch: true,
        dynamicImportPreload: true,
        exportsPresence: 'error',
        exprContextCritical: true,
        exprContextRecursive: true,
        harmony: true,
        import: true,
        importExportsPresence: 'error',
        importMeta: true,
        importMetaContext: true,
        node: nodeConfig,
        reexportExportsPresence: 'error',
        requireContext: true,
        requireEnsure: true,
        requireInclude: true,
        strictThisContextOnImports: true,
        url: 'relative',
        unknownContextCritical: true,
        unknownContextRecursive: true,
        wrappedContextCritical: true,
        wrappedContextRecursive: true,
        /**
         * 自定义WebWorker对javascript文件的处理，'...'是指默认值。
         * 值类型有：string[]、布尔值（true，表示使用默认值，也就是[ '...' ]，false表示禁用该选项）。
         */
        /*
         worker: [
         '...',
         ],
         */
      };

    return {
      generator: {
        /**
         * 该选项有一个验证配置类的BUG：<br />
         * 1、该选项会在'asset/inline'、'asset/resource'这2个之间进行自动切换，但是该选项的配置（该选项下一共有5个配置项）却无法通过验证。<br />
         * 2、因为当命中'asset/inline'时，其有效配置项只有dataUrl选项，而命中'asset/resource'时，其有效配置为：emit、filename、outputPath、publicPath这4个。<br />
         * 3、所以，无论为'asset'选项配置任何选项，都无法同时满足'asset/inline'、'asset/resource'的配置验证，从而导致webpack在编译时报出配置验证错误。<br />
         * 4、建议，不使用该'asset'选项，而是直接配置'asset/inline'、'asset/resource'这2个，而且这样也不会影响后面的type: 'asset'的使用。<br />
         *
         * 注意：<br />
         * 1、当从第3方包（如：npm包）中导入文件时，如果该文件还包含其他类型的文件，如果在已有loader配置中能找到该其他类型文件对应的loader，那么就会使用该loader来加载这个其他类型文件，否则会报错，提示需要对应的loader来处理。<br />
         * 2、对上述第1点列出1个案例来进一步说明该注意事项：在某个js文件中引入element-ui的css文件，而且该css文件中还引用了字体文件，但是在处理字体的loader中没有包含该字体文件所在的文件夹。<br />
         * 然而依然还是能处理该字体文件的，但是对其所有的处理后的输出路径等配置都不是由对应loader下的配置决定的，而是由全局配置中的module.generator、module.parser、output.assetModuleFilename决定的。<br />
         * 而且应用配置的优先级为：module.generator[ 'asset/resource' ]的配置 > module.generator[ 'asset' ]的配置 > output.assetModuleFilename的配置 > 具体loader中设置的generator选项里的各个选项。<br />
         * 要想避免这种情况的出现，可以手动将对应文件夹加入到对应loader的处理文件夹中，这样那些文件都会应用loader里的配置，如：输出配置等等。<br />
         */
        /*
         asset: {
         dataUrl: {
         encoding: 'base64',
         },
         emit: true,
         filename( pathData, assetInfo ){
         return '[name]_[contenthash][ext]';
         },
         outputPath( pathData, assetInfo ){
         return './assets/';
         },
         publicPath( pathData, assetInfo ){
         return '../assets/';
         },
         },
         */
        /**
         * 注意：
         * 1、当从第3方包（如：npm包）中导入文件时，如果该文件还包含其他类型的文件，如果在已有loader配置中能找到该其他类型文件对应的loader，那么就会使用该loader来加载这个其他类型文件，否则会报错，提示需要对应的loader来处理。<br />
         * 2、对上述第1点列出1个案例来进一步说明该注意事项：在某个js文件中引入element-ui的css文件，而且该css文件中还引用了字体文件，但是在处理字体的loader中没有包含该字体文件所在的文件夹。<br />
         * 然而依然还是能处理该字体文件的，但是对其所有的处理后的输出路径等配置都不是由对应loader下的配置决定的，而是由全局配置中的module.generator、module.parser、output.assetModuleFilename决定的。<br />
         * 而且应用配置的优先级为：module.generator[ 'asset/inline' ]的配置 > module.generator[ 'asset' ]的配置。<br />
         * 要想避免这种情况的出现，可以手动将对应文件夹加入到对应loader的处理文件夹中，这样那些文件都会应用loader里的配置，如：输出配置等等。<br />
         */
        'asset/inline': {
          dataUrl: {
            encoding: 'base64',
          },
        },
        /**
         * 注意：
         * 1、当从第3方包（如：npm包）中导入文件时，如果该文件还包含其他类型的文件，如果在已有loader配置中能找到该其他类型文件对应的loader，那么就会使用该loader来加载这个其他类型文件，否则会报错，提示需要对应的loader来处理。<br />
         * 2、对上述第1点列出1个案例来进一步说明该注意事项：在某个js文件中引入element-ui的css文件，而且该css文件中还引用了字体文件，但是在处理字体的loader中没有包含该字体文件所在的文件夹。<br />
         * 然而依然还是能处理该字体文件的，但是对其所有的处理后的输出路径等配置都不是由对应loader下的配置决定的，而是由全局配置中的module.generator、module.parser、output.assetModuleFilename决定的。<br />
         * 而且应用配置的优先级为：module.generator[ 'asset/resource' ]的配置 > module.generator[ 'asset' ]的配置 > output.assetModuleFilename的配置 > 具体loader中设置的generator选项里的各个选项。<br />
         * 要想避免这种情况的出现，可以手动将对应文件夹加入到对应loader的处理文件夹中，这样那些文件都会应用loader里的配置，如：输出配置等等。<br />
         */
        'asset/resource': {
          emit: true,
          filename( pathData, assetInfo ){
            return '[name]_[contenthash][ext]';
          },
          outputPath( pathData, assetInfo ){
            return './assets/';
          },
          publicPath( pathData, assetInfo ){
            return '../assets/';
          },
        },
      },
      parser: {
        asset: {
          dataUrlCondition,
        },
        javascript: parserJavascriptConfig,
        'javascript/auto': parserJavascriptConfig,
        'javascript/dynamic': parserJavascriptConfig,
        // 注意，如果设置成“javascript/esm”，会导致在编译后的代码中直接使用require导入辅助代码，从而导致报错，无论是开发环境还是生产环境都是如此。
        'javascript/esm': parserJavascriptConfig,
      },
      unsafeCache: false,
      /**
       * 注意。<br />
       * 1、path.resolve和path.join的区别在于：<br />
       * 例如：<br />
       * path.resolve( __dirname, './src/assets/' )，最后解析成：G:\WebStormWS\upload-for-multiple\src\assets
       * path.join( __dirname, './src/assets/' )，最后解析成：G:\WebStormWS\upload-for-multiple\src\assets\
       * 有或是没有最后的“\”在具体应用时很重要！不然容易出现不如你所愿的现象。<br />
       * 2、当设置文件夹的路径别名时，用path.resolve设置时，其值包不包含最后的“/”都没关系，因为最后生成的路径（如：G:\WebStormWS\upload-for-multiple\src\assets）都不会包含“\”。<br />
       * 3、当设置文件夹的路径别名时，用path.join设置时，其值如果包含最后的“/”，则最后生成的路径（如：G:\WebStormWS\upload-for-multiple\src\assets\）就会包含“\”，反之不会。<br />
       * 4、设置文件夹的路径别名时，建议使用path.resolve，这样在后续使用路径别名时，就可以按正常的习惯使用：import JSONDemo001 from 'jsonDir/Demo001.json';<br />
       * 5、设置各个loader的include、exclude选项时，最好用path.join，因为webpack在处理exclude选项的值时，会用字符串的“startsWith”方法进行匹配，此时，最后生成的路径（如：G:\WebStormWS\upload-for-multiple\src\assets\）最尾部包不包含“\”会起到很大的区别。<br />
       * 6、webpack处理exclude选项的源代码在，node_modules/webpack/lib/rules/RuleSetCompiler.js:228：<br />
       * 源码：fn: str => typeof str === "string" && str.startsWith(condition)<br />
       * str：G:\WebStormWS\upload-for-multiple\src\assets\doc\json5\Demo001.json5<br />
       * condition：G:\WebStormWS\upload-for-multiple\src\assets\doc\json5\<br />
       */
      rules: [
        // 处理.cson文件。
        {
          test: /\.cson$/i,
          type: 'javascript/auto',
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'cson-loader',
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/doc/csv/' ),
            join( __dirname, './src/assets/doc/json/' ),
            join( __dirname, './src/assets/doc/json5/' ),
            join( __dirname, './src/assets/doc/toml/' ),
            join( __dirname, './src/assets/doc/tsv/' ),
            join( __dirname, './src/assets/doc/txt/' ),
            join( __dirname, './src/assets/doc/xml/' ),
            join( __dirname, './src/assets/doc/yaml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        /**
         * 处理.module.css文件，也就是CSS Modules的处理。<br />
         * 1、关于Vue中如何使用CSS Modules，详细见：https://vue-loader.vuejs.org/guide/css-modules.html#css-modules
         */
        {
          test: /\.(module|modules)\.css$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /**
             * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
             * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
             * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
             * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
             * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
             */
            ...( ( isBoolean ) => {
              return isBoolean
                     ? [
                  MiniCssExtractPluginLoader,
                ]
                     : [
                  /*
                   {
                   loader: 'thread-loader',
                   options: cssWorkerPoolConfig,
                   },
                   */
                  ( styleLoader => {
                    const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                    obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                    obj1.options.attributes[ 'data-is-css' ] = `true`;

                    return obj1;
                  } )( styleLoader ),
                ];
            } )( true ),
            ( cssLoader => {
              const options = Object.assign( {}, cssLoader.options );

              options.modules = cssLoaderModules;

              return Object.assign( {}, cssLoader, { options, } );
            } )( cssLoader ),
            postCSSLoader,
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/less/' ),
            join( __dirname, './src/styles/postcss/' ),
            join( __dirname, './src/styles/sass/' ),
            join( __dirname, './src/styles/scss/' ),
            join( __dirname, './src/styles/stylus/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
          sideEffects: true,
        },
        // 处理.css文件。
        {
          test: /\.css$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( ( isBoolean ) => {
                  return isBoolean
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: cssWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                        obj1.options.attributes[ 'data-is-css' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )( true ),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.modules = cssLoaderModules;

                  return Object.assign( {}, cssLoader, { options, } );
                } )( cssLoader ),
                postCSSLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.css$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
            {
              resourceQuery: {
                not: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( () => {
                  return isProduction
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: cssWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-css' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )(),
                cssLoader,
                postCSSLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.css$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
          ],
        },

        // 处理.csv文件、.tsv文件。
        {
          test: /\.(csv|tsv)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'csv-loader',
              options: {
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/doc/cson/' ),
            join( __dirname, './src/assets/doc/json/' ),
            join( __dirname, './src/assets/doc/json5/' ),
            join( __dirname, './src/assets/doc/toml/' ),
            join( __dirname, './src/assets/doc/txt/' ),
            join( __dirname, './src/assets/doc/xml/' ),
            join( __dirname, './src/assets/doc/yaml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.ejs文件。
        {
          test: /\.ejs$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'ejs-loader',
              options: {
                /**
                 * 这个loader的这个esModule选项必须是false，不然会报错！<br />
                 * 1、默认情况下，ejs-loader生成使用ES模块语法的JS模块。在某些情况下，使用ES模块是有益的，例如在模块连接和摇树的情况下。<br />
                 * 2、将EJS模板编译成ES兼容模块需要variable选项。如果变量选项未作为加载器或查询选项提供，则会引发错误。有关更多详细信息，请参阅：https://github.com/lodash/lodash/issues/3709#issuecomment-375898111。<br />
                 * 3、当该选项设置为false时，就会启用CommonJS模块语法。<br />
                 * 4、该loader的该选项默认值是true。<br />
                 */
                esModule: false,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/template/handlebars/' ),
            join( __dirname, './src/template/html/' ),
            join( __dirname, './src/template/markdown/' ),
            join( __dirname, './src/template/mustache/' ),
            join( __dirname, './src/template/pug_jade/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理字体文件。
        {
          test: /\.(eot|otf|fon|font|ttf|ttc|woff|woff2)$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /url/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/resource',
              generator: {
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './fonts/';
                },
                publicPath( pathData, assetInfo ){
                  return '../fonts/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                and: [
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/inline',
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: false,
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                not: [
                  /url/,
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset',
              parser: {
                dataUrlCondition,
              },
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './fonts/';
                },
                publicPath( pathData, assetInfo ){
                  return '../fonts/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
          ],
        },

        // 处理.graphql文件、.graphqls文件、.gql文件，区分结尾带“?raw”和不带“?raw”的2种处理，注意事项去看：notes/关于在JS和TS文件中导入和使用graphql文件时出现的BUG以及注意事项说明.txt。
        {
          test: /\.(graphql|graphqls|gql)$/i,
          oneOf: [
            /**
             * 处理以.graphql、.graphqls、.gql结尾的带“?raw”的文件导入，会返回字符串。
             */
            {
              resourceQuery: {
                and: [
                  /raw/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                {
                  loader: 'webpack-graphql-loader',
                  options: {
                    // graphql自省查询架构JSON文件的位置。如果与validate选项一起使用，它将用于验证导入的查询和片段。
                    schema: './src/graphQL/GraphQL.Schema.json',
                    // 如果为true，则加载程序将根据您指定的模式文件验证导入的文档。
                    validate: true,
                    // 'string'、'document'
                    output: 'string',
                    // 如果为true且输出选项为字符串，则加载程序将从graphql文档字符串中删除注释和空格。这有助于减小捆绑的代码大小。
                    minify: isProduction,
                    /**
                     * 如果为true，则加载程序将从导入的文档中删除未使用的碎片。<br />
                     * 1、如果查询要从文件导入片段，但未使用该文件中的所有片段，则这可能很有用。<br />
                     * 2、另请参阅此问题https://github.com/apollographql/graphql-tag/issues/102。<br />
                     */
                    removeUnusedFragments: false,
                  },
                },
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/doc/' ),
                join( __dirname, './src/graphQL/test/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            /**
             * 处理以.graphql、.graphqls、.gql结尾的不带“?raw”的文件导入，会返回对象。
             * 1、如果想将对象转为字符串，可以这么干，而且这种方法还能按需导入：
             * import {
             *   print,
             * } from 'graphql';
             *
             * import {
             *   AlertQuery,
             * } from './gql/Query.graphql';
             *
             * // 会是完整的、包括各种嵌套导入的片段的字符串。
             * print( AlertQuery );
             */
            {
              resourceQuery: {
                not: [
                  /raw/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                {
                  loader: 'graphql-tag/loader',
                },
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/doc/' ),
                join( __dirname, './src/graphQL/test/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
          ],
        },

        // handlebars-loader，处理.handlebars文件、.hbs文件。
        {
          test: /\.(handlebars|hbs)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'handlebars-loader',
              options: {
                debug: !isProduction,
                noEscape: false,
                strict: true,
                preventIndent: true,
                extensions: [
                  '.handlebars',
                  '.hbs',
                ],
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/template/ejs/' ),
            join( __dirname, './src/template/html/' ),
            join( __dirname, './src/template/markdown/' ),
            join( __dirname, './src/template/mustache/' ),
            join( __dirname, './src/template/pug_jade/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // html-loader，处理.htm文件、.html文件、.xhtml文件。
        {
          test: /\.(htm|html|xhtml)$/i,
          /**
           * 当使用“webpack 5”时，需要这个属性，否则后面的“vue-loader”会报错！<br />
           * 1、对于“vue-loader”而言，只要这个值不会被转换成“假值”就能成功使用“vue-loader”。<br />
           */
          enforce: 'post',
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: true,
                minimize: isProduction
                          ? HTMLMinifyConfig
                          : false,
                // 该loader的该选项默认值是true。
                // esModule: true,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/template/ejs/' ),
            join( __dirname, './src/template/handlebars/' ),
            join( __dirname, './src/template/markdown/' ),
            join( __dirname, './src/template/mustache/' ),
            join( __dirname, './src/template/pug_jade/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        /**
         * 处理图片。<br />
         * 1、当启用实验性选项experiments.buildHttp时，远程图片资源竟然不由该loader处理，而是被上面配置的module.generator.'asset/resource'处理了。<br />
         */
        {
          test: /\.(apng|arw|avif|bmp|bpg|cr2|cur|dcx|dng|flif|gif|heic|heif|icns|ico|j2c|j2k|jbig2|jng|jp2|jpe|jfif|pjpeg|pjp|jpeg|jpg|jpm|jpx|jxl|jxr|ktx|mj2|nef|orf|pam|pbm|pcx|pgm|png|pnm|ppm|psd|raf|raw|rgbe|rw2|svg|svgz|tga|tif|tiff|wbmp|webp|wp2|xbm|xpm)$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /url/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/resource',
              generator: {
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './img/';
                },
                publicPath( pathData, assetInfo ){
                  return '../img/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                and: [
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/inline',
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: false,
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                not: [
                  /url/,
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset',
              parser: {
                dataUrlCondition,
              },
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './img/';
                },
                publicPath( pathData, assetInfo ){
                  return '../img/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
          ],
        },

        // 处理.js文件。
        {
          test: /\.js$/i,
          /**
           * 1、有这么几种：'javascript/auto'、'javascript/dynamic'、'javascript/esm'、'json'、'webassembly/sync'、'webassembly/async'、'asset'、'asset/source'、'asset/resource'、'asset/inline'。<br />
           * 2、注意，如果设置成“javascript/esm”，会导致在编译后的代码中直接使用require导入辅助代码，从而导致报错，无论是开发环境还是生产环境都是如此。<br />
           */
          type: 'javascript/auto',
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: isUseESBuildLoader
               ? [
              {
                loader: 'esbuild-loader',
                options: esbuildLoaderConfigForJS,
              },
            ]
               : [
              /*
               {
               loader: 'thread-loader',
               options: jsWorkerPoolConfig,
               },
               */
              {
                loader: 'babel-loader',
                options: babelLoaderConfig,
              },
            ],
          include: [
            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },
        // 处理.cjs、.mjs文件。
        {
          test: /\.(cjs|mjs)$/i,
          /**
           * 1、有这么几种：'javascript/auto'、'javascript/dynamic'、'javascript/esm'、'json'、'webassembly/sync'、'webassembly/async'、'asset'、'asset/source'、'asset/resource'、'asset/inline'。<br />
           * 2、注意，如果设置成“javascript/esm”，会导致在编译后的代码中直接使用require导入辅助代码，从而导致报错，无论是开发环境还是生产环境都是如此。<br />
           */
          type: 'javascript/auto',
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: isUseESBuildLoader
               ? [
              {
                loader: 'esbuild-loader',
                options: esbuildLoaderConfigForJS,
              },
            ]
               : [
              /*
               {
               loader: 'thread-loader',
               options: jsWorkerPoolConfig,
               },
               */
              {
                loader: 'babel-loader',
                options: babelLoaderConfig,
              },
            ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.jsx文件。
        {
          test: /\.jsx$/i,
          // 有这么几种：'javascript/auto'、'javascript/dynamic'、'javascript/esm'、'json'、'webassembly/sync'、'webassembly/async'、'asset'、'asset/source'、'asset/resource'、'asset/inline'。
          type: 'javascript/auto',
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: isUseESBuildLoader
               ? [
              {
                loader: 'esbuild-loader',
                options: esbuildLoaderConfigForJSX,
              },
            ]
               : [
              /*
               {
               loader: 'thread-loader',
               options: jsxWorkerPoolConfig,
               },
               */
              {
                loader: 'babel-loader',
                options: babelLoaderJSXConfig,
              },
            ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.json5文件。
        {
          test: /\.json5$/i,
          type: 'json',
          parser: {
            parse: JSON5.parse,
          },
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),
            join( __dirname, './src/assets/doc/json5/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/doc/cson/' ),
            join( __dirname, './src/assets/doc/csv/' ),
            join( __dirname, './src/assets/doc/json/' ),
            join( __dirname, './src/assets/doc/toml/' ),
            join( __dirname, './src/assets/doc/tsv/' ),
            join( __dirname, './src/assets/doc/txt/' ),
            join( __dirname, './src/assets/doc/xml/' ),
            join( __dirname, './src/assets/doc/yaml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        /**
         * 处理.module.less文件，也就是CSS Modules的处理。<br />
         * 1、关于Vue中如何使用CSS Modules，详细见：https://vue-loader.vuejs.org/guide/css-modules.html#css-modules
         */
        {
          test: /\.(module|modules)\.less$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /**
             * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
             * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
             * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
             * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
             * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
             */
            ...( ( isBoolean ) => {
              return isBoolean
                     ? [
                  MiniCssExtractPluginLoader,
                ]
                     : [
                  /*
                   {
                   loader: 'thread-loader',
                   options: lessWorkerPoolConfig,
                   },
                   */
                  ( styleLoader => {
                    const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                    obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                    obj1.options.attributes[ 'data-is-less' ] = `true`;

                    return obj1;
                  } )( styleLoader ),
                ];
            } )( true ),
            ( cssLoader => {
              const options = Object.assign( {}, cssLoader.options );

              options.importLoaders = 2;
              options.modules = cssLoaderModules;

              return Object.assign( {}, cssLoader, {
                options,
              } );
            } )( cssLoader ),
            postCSSLoader,
            /**
             * 1、不推荐使用~并且可以从您的代码中删除（我们推荐它），但由于历史原因我们仍然支持它。为什么可以去掉？加载器将首先尝试将@import解析为相对，如果无法解析，加载器将尝试在node_modules中解析@import。<br />
             * 2、首先我们尝试使用内置的less解析逻辑，然后是webpack解析逻辑。<br />
             * 3、webpack提供了一种高级机制来解析文件。less-loader应用了一个Less插件，如果less无法解析@import，它将所有查询传递给webpack解析器。因此，您可以从node_modules导入您的Less模块。<br />
             */
            lessLoader,
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/css/' ),
            join( __dirname, './src/styles/postcss/' ),
            join( __dirname, './src/styles/sass/' ),
            join( __dirname, './src/styles/scss/' ),
            join( __dirname, './src/styles/stylus/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
          sideEffects: true,
        },
        // 处理.less文件。
        {
          test: /\.less$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( ( isBoolean ) => {
                  return isBoolean
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: lessWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                        obj1.options.attributes[ 'data-is-less' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )( true ),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;
                  options.modules = cssLoaderModules;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                /**
                 * 1、不推荐使用~并且可以从您的代码中删除（我们推荐它），但由于历史原因我们仍然支持它。为什么可以去掉？加载器将首先尝试将@import解析为相对，如果无法解析，加载器将尝试在node_modules中解析@import。<br />
                 * 2、首先我们尝试使用内置的less解析逻辑，然后是webpack解析逻辑。<br />
                 * 3、webpack提供了一种高级机制来解析文件。less-loader应用了一个Less插件，如果less无法解析@import，它将所有查询传递给webpack解析器。因此，您可以从node_modules导入您的Less模块。<br />
                 */
                lessLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.less$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
            {
              resourceQuery: {
                not: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( () => {
                  return isProduction
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: lessWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-less' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )(),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                /**
                 * 1、不推荐使用~并且可以从您的代码中删除（我们推荐它），但由于历史原因我们仍然支持它。为什么可以去掉？加载器将首先尝试将@import解析为相对，如果无法解析，加载器将尝试在node_modules中解析@import。<br />
                 * 2、首先我们尝试使用内置的less解析逻辑，然后是webpack解析逻辑。<br />
                 * 3、webpack提供了一种高级机制来解析文件。less-loader应用了一个Less插件，如果less无法解析@import，它将所有查询传递给webpack解析器。因此，您可以从node_modules导入您的Less模块。<br />
                 */
                lessLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.less$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
          ],
        },

        // 处理.toml文件。
        {
          test: /\.toml$/i,
          type: 'json',
          parser: {
            parse: Toml.parse,
          },
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/doc/cson/' ),
            join( __dirname, './src/assets/doc/csv/' ),
            join( __dirname, './src/assets/doc/json/' ),
            join( __dirname, './src/assets/doc/json5/' ),
            join( __dirname, './src/assets/doc/tsv/' ),
            join( __dirname, './src/assets/doc/txt/' ),
            join( __dirname, './src/assets/doc/xml/' ),
            join( __dirname, './src/assets/doc/yaml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.txt文件。
        {
          test: /\.txt$/i,
          type: 'asset/source',
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/doc/cson/' ),
            join( __dirname, './src/assets/doc/csv/' ),
            join( __dirname, './src/assets/doc/json/' ),
            join( __dirname, './src/assets/doc/json5/' ),
            join( __dirname, './src/assets/doc/toml/' ),
            join( __dirname, './src/assets/doc/tsv/' ),
            join( __dirname, './src/assets/doc/xml/' ),
            join( __dirname, './src/assets/doc/yaml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.manifest.json、.webmanifest文件，给PWA用的manifest文件。
        {
          test: /\.manifest\.json$/i,
          /**
           * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
           * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
           * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
           * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
           */
          type: 'asset/resource',
          generator: {
            emit: true,
            filename( pathData, assetInfo ){
              return '[name]_[contenthash].manifest[ext]';
            },
            outputPath( pathData, assetInfo ){
              return './pwa_manifest/';
            },
            publicPath( pathData, assetInfo ){
              return '../pwa_manifest/';
            },
          },
          include: [
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/template/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/native_components/' ),
            join( __dirname, './src/pages/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/tools/' ),
            join( __dirname, './src/wasm/' ),
            join( __dirname, './src/web_components/' ),
            join( __dirname, './src/workers/' ),
          ].concat( exclude001 ),
        },
        {
          test: /\.webmanifest$/i,
          /**
           * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
           * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
           * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
           * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
           */
          type: 'asset/resource',
          generator: {
            emit: true,
            filename( pathData, assetInfo ){
              return '[name]_[contenthash].manifest[ext]';
            },
            outputPath( pathData, assetInfo ){
              return './pwa_manifest/';
            },
            publicPath( pathData, assetInfo ){
              return '../pwa_manifest/';
            },
          },
          include: [
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/template/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/native_components/' ),
            join( __dirname, './src/pages/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/tools/' ),
            join( __dirname, './src/wasm/' ),
            join( __dirname, './src/web_components/' ),
            join( __dirname, './src/workers/' ),
          ].concat( exclude001 ),
        },

        // 自定义处理.json文件，以免.manifest.json文件被当成.json文件处理，而且该自定义必须得在.manifest.json处理之后。
        {
          test: /\.json$/i,
          type: 'javascript/auto',
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'json5-loader',
              options: {
                // 该loader的该选项默认值是true。
                // esModule: true,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),
            join( __dirname, './src/assets/doc/json/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            /\.manifest\.json$/i,

            join( __dirname, './src/assets/doc/cson/' ),
            join( __dirname, './src/assets/doc/csv/' ),
            join( __dirname, './src/assets/doc/json5/' ),
            join( __dirname, './src/assets/doc/toml/' ),
            join( __dirname, './src/assets/doc/tsv/' ),
            join( __dirname, './src/assets/doc/txt/' ),
            join( __dirname, './src/assets/doc/xml/' ),
            join( __dirname, './src/assets/doc/yaml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // markdown-loader，处理.markdown文件、.md文件，由于markdown的输出是HTML，因此最好与html-loader一起使用。
        {
          test: /\.(markdown|md)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: true,
                minimize: isProduction
                          ? HTMLMinifyConfig
                          : false,
                // 该loader的该选项默认值是true。
                // esModule: true,
              },
            },
            {
              loader: 'markdown-loader',
              options: {
                // 默认值为null，值类型string。任何相对链接的前缀url。
                // baseUrl: null,
                // 默认值为false，值类型boolean，如果为true，则在单个换行符上添加<br>（在评论上复制GitHub行为，但不在渲染的降价文件上）。要求gfm为true。
                breaks: false,
                // 默认值为true，值类型boolean，如果为真，请使用经批准的GitHub风味Markdown(GFM)规范。
                gfm: true,
                // 默认值为true，值类型boolean，如果为true，则在发出标题（h1、h2、h3等）时包含一个id属性。
                headerIds: true,
                // 默认值为''，值类型string。发出标题（h1、h2、h3 等）时作为id属性前缀的字符串。
                headerPrefix: 'markdown-',
                // 默认值为null，值类型function。高亮代码块的功能，请参阅https://marked.js.org/using_advanced#highlight。
                // highlight:null,
                // 默认值为'language-'，值类型string。在<code>块中作为className前缀的字符串。对语法高亮很有用。
                langPrefix: 'language-',
                // 默认值为true，值类型boolean。如果为true，自动链接的电子邮件地址将使用HTML字符引用进行转义。
                mangle: true,
                // 默认值为false，值类型boolean。如果为真，则尽可能符合原markdown.pl。不要修复原始的降价错误或行为。关闭并覆盖gfm。
                pedantic: false,
                // 默认值为new Renderer()，值类型object。包含将标记呈现为HTML的函数的对象。有关更多详细信息，请参阅https://marked.js.org/using_pro。
                // renderer: new Renderer(),
                // 已弃用，默认值为false，值类型boolean。如果为true，则使用sanitizer函数清理传递给markdownString的HTML。警告：此功能已弃用，不应使用，因为它不能被视为安全。而是在输出HTML上使用sanitize库，如DOMPurify（推荐）、sanitize-html或insane！
                // sanitize: false,
                // 默认值为null，值类型function。清理传递给markdownString的HTML的函数。
                // sanitizer: null,
                // 默认值为false，值类型boolean。如果为真，解析器不会抛出任何异常。
                silent: false,
                // 默认值为false，值类型boolean。如果为true，则使用比markdown.pl中更智能的列表行为。
                smartLists: false,
                // 默认值为false，值类型boolean。如果为真，请对引号和破折号等内容使用“smart”印刷标点符号。
                smartypants: false,
                // 默认值为new Tokenizer()，值类型object。一个对象，包含从markdown创建标记的函数。有关更多详细信息，请参阅https://marked.js.org/using_pro
                // tokenizer: new Tokenizer(),
                // 默认值为null，值类型function。为每个令牌调用的函数。有关更多详细信息，请参阅https://marked.js.org/using_pro
                // walkTokens: null,
                // 默认值为false，值类型boolean。如果为true，则为void元素（<br/>、<img/> 等）发出自闭合HTML标记，并按照XHTML的要求使用“/”。
                xhtml: true,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/template/ejs/' ),
            join( __dirname, './src/template/handlebars/' ),
            join( __dirname, './src/template/html/' ),
            join( __dirname, './src/template/mustache/' ),
            join( __dirname, './src/template/pug_jade/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理音频。
        {
          test: /\.(m4a|kar|ape|wav|wave|flac|wma|cda|aiff|au|mpeg|mpeg-1|mpeg-2|mpeg-layer3|mpeg-4|opus|mp3|mp2|mp1|mid|midi|ra|rm|rmx|vqf|amr|aac|vorbis)$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /url/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/resource',
              generator: {
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './music/';
                },
                publicPath( pathData, assetInfo ){
                  return '../music/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                and: [
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/inline',
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: false,
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                not: [
                  /url/,
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset',
              parser: {
                dataUrlCondition,
              },
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './music/';
                },
                publicPath( pathData, assetInfo ){
                  return '../music/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/videos/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
          ],
        },

        // mustache-loader，处理.mustache文件。
        {
          test: /\.mustache$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'mustache-loader',
              options: {
                // 如果传入tiny ，则不会发出模板的源代码，从而创建更小的输出。如果在mustache-loader之后链接了另一个加载器，则将忽略minify、clientSide和tiny选项。
                tiny: true,
                minify: isProduction
                        ? HTMLMinifyConfig
                        : false,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/template/ejs/' ),
            join( __dirname, './src/template/handlebars/' ),
            join( __dirname, './src/template/html/' ),
            join( __dirname, './src/template/markdown/' ),
            join( __dirname, './src/template/pug_jade/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        /**
         * 处理.module.postcss文件、.module.pcss文件，也就是CSS Modules的处理。<br />
         * 1、关于Vue中如何使用CSS Modules，详细见：https://vue-loader.vuejs.org/guide/css-modules.html#css-modules
         */
        {
          test: /\.(module|modules)\.(pcss|postcss)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /**
             * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
             * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
             * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
             * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
             * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
             */
            ...( ( isBoolean ) => {
              return isBoolean
                     ? [
                  MiniCssExtractPluginLoader,
                ]
                     : [
                  /*
                   {
                   loader: 'thread-loader',
                   options: cssWorkerPoolConfig,
                   },
                   */
                  ( styleLoader => {
                    const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                    obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                    obj1.options.attributes[ 'data-is-postcss' ] = `true`;

                    return obj1;
                  } )( styleLoader ),
                ];
            } )( true ),
            ( cssLoader => {
              const options = Object.assign( {}, cssLoader.options );

              options.modules = cssLoaderModules;

              return Object.assign( {}, cssLoader, { options, } );
            } )( cssLoader ),
            postCSSLoader,
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/css/' ),
            join( __dirname, './src/styles/less/' ),
            join( __dirname, './src/styles/sass/' ),
            join( __dirname, './src/styles/scss/' ),
            join( __dirname, './src/styles/stylus/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
          sideEffects: true,
        },
        // 处理.postcss文件、.pcss文件。
        {
          test: /\.(pcss|postcss)$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( ( isBoolean ) => {
                  return isBoolean
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: cssWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                        obj1.options.attributes[ 'data-is-postcss' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )( true ),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.modules = cssLoaderModules;

                  return Object.assign( {}, cssLoader, { options, } );
                } )( cssLoader ),
                postCSSLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.(pcss|postcss)$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
            {
              resourceQuery: {
                not: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( () => {
                  return isProduction
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: cssWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-postcss' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )(),
                cssLoader,
                postCSSLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.(pcss|postcss)$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
          ],
        },

        // pug-loader，处理.pug文件、.jade文件。
        {
          test: /\.(pug|jade)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'pug-loader',
              options: {
                // 与Pug不同，如果未设置，则默认为“html”。
                doctype: 'html',
                pretty: !isProduction,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/template/ejs/' ),
            join( __dirname, './src/template/handlebars/' ),
            join( __dirname, './src/template/html/' ),
            join( __dirname, './src/template/markdown/' ),
            join( __dirname, './src/template/mustache/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        /**
         * 处理.module.sass文件，也就是CSS Modules的处理。<br />
         * 1、关于Vue中如何使用CSS Modules，详细见：https://vue-loader.vuejs.org/guide/css-modules.html#css-modules
         */
        {
          test: /\.(module|modules)\.sass$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /**
             * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
             * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
             * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
             * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
             * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
             */
            ...( ( isBoolean ) => {
              return isBoolean
                     ? [
                  MiniCssExtractPluginLoader,
                ]
                     : [
                  /*
                   {
                   loader: 'thread-loader',
                   options: sassWorkerPoolConfig,
                   },
                   */
                  ( styleLoader => {
                    const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                    obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                    obj1.options.attributes[ 'data-is-sass' ] = `true`;

                    return obj1;
                  } )( styleLoader ),
                ];
            } )( true ),
            ( cssLoader => {
              const options = Object.assign( {}, cssLoader.options );

              options.importLoaders = 2;
              options.modules = cssLoaderModules;

              return Object.assign( {}, cssLoader, {
                options,
              } );
            } )( cssLoader ),
            postCSSLoader,
            /**
             * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
             * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
             * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
             * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
             * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
             * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
             * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
             * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
             * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
             * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
             * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
             * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
             * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
             */
            sassLoader,
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/css/' ),
            join( __dirname, './src/styles/less/' ),
            join( __dirname, './src/styles/postcss/' ),
            join( __dirname, './src/styles/scss/' ),
            join( __dirname, './src/styles/stylus/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
          sideEffects: true,
        },
        // 处理.sass文件。
        {
          test: /\.sass$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( ( isBoolean ) => {
                  return isBoolean
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: sassWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                        obj1.options.attributes[ 'data-is-sass' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )( true ),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;
                  options.modules = cssLoaderModules;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                /**
                 * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
                 * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
                 * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
                 * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
                 * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
                 * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
                 * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
                 * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
                 * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
                 * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
                 * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
                 * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
                 * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
                 */
                sassLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.sass$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
            {
              resourceQuery: {
                not: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( () => {
                  return isProduction
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: sassWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-sass' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )(),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                /**
                 * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
                 * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
                 * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
                 * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
                 * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
                 * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
                 * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
                 * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
                 * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
                 * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
                 * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
                 * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
                 * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
                 */
                sassLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.sass$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
          ],
        },

        /**
         * 处理.module.scss文件，也就是CSS Modules的处理。<br />
         * 1、关于Vue中如何使用CSS Modules，详细见：https://vue-loader.vuejs.org/guide/css-modules.html#css-modules
         */
        {
          test: /\.(module|modules)\.scss$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /**
             * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
             * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
             * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
             * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
             * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
             */
            ...( ( isBoolean ) => {
              return isBoolean
                     ? [
                  MiniCssExtractPluginLoader,
                ]
                     : [
                  /*
                   {
                   loader: 'thread-loader',
                   options: sassWorkerPoolConfig,
                   },
                   */
                  ( styleLoader => {
                    const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                    obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                    obj1.options.attributes[ 'data-is-scss' ] = `true`;

                    return obj1;
                  } )( styleLoader ),
                ];
            } )( true ),
            ( cssLoader => {
              const options = Object.assign( {}, cssLoader.options );

              options.importLoaders = 2;
              options.modules = cssLoaderModules;

              return Object.assign( {}, cssLoader, {
                options,
              } );
            } )( cssLoader ),
            postCSSLoader,
            /**
             * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
             * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
             * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
             * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
             * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
             * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
             * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
             * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
             * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
             * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
             * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
             * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
             * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
             */
            scssLoader,
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/css/' ),
            join( __dirname, './src/styles/less/' ),
            join( __dirname, './src/styles/postcss/' ),
            join( __dirname, './src/styles/sass/' ),
            join( __dirname, './src/styles/stylus/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
          sideEffects: true,
        },
        // 处理.scss文件。
        {
          test: /\.scss$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( ( isBoolean ) => {
                  return isBoolean
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: sassWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                        obj1.options.attributes[ 'data-is-scss' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )( true ),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;
                  options.modules = cssLoaderModules;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                /**
                 * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
                 * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
                 * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
                 * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
                 * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
                 * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
                 * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
                 * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
                 * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
                 * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
                 * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
                 * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
                 * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
                 */
                scssLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.scss$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
            {
              resourceQuery: {
                not: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( () => {
                  return isProduction
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: sassWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-scss' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )(),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                /**
                 * 1、不推荐使用~（如：@import "~xxx";）并且可以从您的代码中删除（我们推荐它）。但出于历史原因，我们仍然支持它。在模块路径前加上~告诉webpack搜索node_modules。仅在前面加上~很重要，因为“~/”解析为主目录。<br />
                 * 2、sass包还支持较旧的API。尽管此API已被弃用，但在sass包（截至20220802还是1.54.0）的2.0.0版本发布之前，它将继续受到支持。<br />
                 * 3、node-sass包也支持旧版API，它是已弃用的LibSass实现的原生扩展包装器。<br />
                 * 4、旧版API有两个用于将Sass编译为CSS的入口点。每个人都可以通过传入LegacyFileOptions来编译Sass文件，或者通过传入LegacyStringOptions来编译一串Sass代码。<br />
                 * 5、renderSync同步运行。它是迄今为止使用Dart Sass时最快的选择，但代价是仅支持同步导入器和函数插件。<br />
                 * 6、render异步运行并在完成时调用回调。使用Dart Sass时速度要慢得多，但它支持异步导入器和函数插件。<br />
                 * 7、sass-loader要求您自行安装sass(dart-sass)、node-sass、sass-embedded。这允许您控制所有依赖项的版本，并选择要使用的Sass实现。<br />
                 * 8、官方文档上强烈推荐使用Dart Sass来作为sass的实现。<br />
                 * 9、Node Sass不适用于Yarn PnP功能，也不支持@use规则。<br />
                 * 10、Sass Embedded处于试验阶段，处于测试阶段，因此某些功能可能无法使用。<br />
                 * 11、注意！sass(dart-sass)、sass-embedded实现在2.0.0之前还是支持旧版的API及其选项，但是2.0.0之后，就会被删除，到时升级了还是要注意下述sassOptions选项中的选项差异。<br />
                 * 12、新版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/options.d.ts。<br />
                 * 13、旧版API对应的sassOptions选项里的各个可用选项见：node_modules/sass/types/legacy/options.d.ts。<br />
                 */
                scssLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.scss$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/stylus/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
          ],
        },

        /**
         * 处理.module.styl文件、.module.stylus文件，也就是CSS Modules的处理。<br />
         * 1、关于Vue中如何使用CSS Modules，详细见：https://vue-loader.vuejs.org/guide/css-modules.html#css-modules
         */
        {
          test: /\.(module|modules)\.(styl|stylus)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /**
             * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
             * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
             * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
             * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
             * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
             */
            ...( ( isBoolean ) => {
              return isBoolean
                     ? [
                  MiniCssExtractPluginLoader,
                ]
                     : [
                  /*
                   {
                   loader: 'thread-loader',
                   options: stylusWorkerPoolConfig,
                   },
                   */
                  ( styleLoader => {
                    const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                    obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                    obj1.options.attributes[ 'data-is-stylus' ] = `true`;

                    return obj1;
                  } )( styleLoader ),
                ];
            } )( true ),
            ( cssLoader => {
              const options = Object.assign( {}, cssLoader.options );

              options.importLoaders = 2;
              options.modules = cssLoaderModules;

              return Object.assign( {}, cssLoader, {
                options,
              } );
            } )( cssLoader ),
            postCSSLoader,
            stylusLoader,
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/css/' ),
            join( __dirname, './src/styles/less/' ),
            join( __dirname, './src/styles/postcss/' ),
            join( __dirname, './src/styles/sass/' ),
            join( __dirname, './src/styles/scss/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
          sideEffects: true,
        },
        // 处理.styl文件、.stylus文件。
        {
          test: /\.(styl|stylus)$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( ( isBoolean ) => {
                  return isBoolean
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: stylusWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-css-modules' ] = `true`;
                        obj1.options.attributes[ 'data-is-stylus' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )( true ),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;
                  options.modules = cssLoaderModules;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                stylusLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.(styl|stylus)$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
            {
              resourceQuery: {
                not: [
                  /module/,
                ],
              },
              // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
              use: [
                /**
                 * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
                 * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
                 * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
                 * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
                 * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
                 */
                ...( () => {
                  return isProduction
                         ? [
                      MiniCssExtractPluginLoader,
                    ]
                         : [
                      /*
                       {
                       loader: 'thread-loader',
                       options: stylusWorkerPoolConfig,
                       },
                       */
                      ( styleLoader => {
                        const obj1 = JSON.parse( JSON.stringify( styleLoader ) );

                        obj1.options.attributes[ 'data-is-stylus' ] = `true`;

                        return obj1;
                      } )( styleLoader ),
                    ];
                } )(),
                ( cssLoader => {
                  const options = Object.assign( {}, cssLoader.options );

                  options.importLoaders = 2;

                  return Object.assign( {}, cssLoader, {
                    options,
                  } );
                } )( cssLoader ),
                postCSSLoader,
                stylusLoader,
              ],
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                /\.(module|modules)\.(styl|stylus)$/i,

                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/css/' ),
                join( __dirname, './src/styles/less/' ),
                join( __dirname, './src/styles/postcss/' ),
                join( __dirname, './src/styles/sass/' ),
                join( __dirname, './src/styles/scss/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
              sideEffects: true,
            },
          ],
        },

        // 处理.ts文件、.mts文件、.cts文件。
        {
          test: /\.(ts|mts|cts)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: isUseESBuildLoader
               ? [
              {
                loader: 'esbuild-loader',
                options: esbuildLoaderConfigForTS,
              },
            ]
               : [
              /*
               {
               loader: 'thread-loader',
               options: tsWorkerPoolConfig,
               },
               */
              {
                loader: 'babel-loader',
                options: babelLoaderConfig,
              },
              tsLoaderConfig,
            ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.tsx文件。
        {
          test: /\.tsx$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: isUseESBuildLoader
               ? [
              {
                loader: 'esbuild-loader',
                options: esbuildLoaderConfigForTSX,
              },
            ]
               : [
              /*
               {
               loader: 'thread-loader',
               options: tsWorkerPoolConfig,
               },
               */
              {
                loader: 'babel-loader',
                options: babelLoaderConfig,
              },
              tsLoaderConfig,
            ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理视频。
        {
          test: /\.(wmv|asf|asx|rmvb|mp4|3gp|mov|m4v|avi|dat|mkv|flv|vob|mod|mng|mpg|3gpp|ogg|webm)$/i,
          oneOf: [
            {
              resourceQuery: {
                and: [
                  /url/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/resource',
              generator: {
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './videos/';
                },
                publicPath( pathData, assetInfo ){
                  return '../videos/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                and: [
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/inline',
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: false,
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
            {
              resourceQuery: {
                not: [
                  /url/,
                  /raw/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset',
              parser: {
                dataUrlCondition,
              },
              generator: {
                dataUrl: {
                  encoding: 'base64',
                },
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './videos/';
                },
                publicPath( pathData, assetInfo ){
                  return '../videos/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/doc/' ),
                join( __dirname, './src/assets/fonts/' ),
                join( __dirname, './src/assets/img/' ),
                join( __dirname, './src/assets/music/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
                join( __dirname, './src/wasm/' ),
              ].concat( exclude001 ),
            },
          ],
        },

        // 处理.vue文件，该loader一定得在html-loader之后。
        {
          test: /\.vue$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /*
             {
             loader: 'thread-loader',
             options: vueWorkerPoolConfig,
             },
             */
            {
              loader: 'vue-loader',
              options: {
                /**
                 * 设置该选项后会报错！因为内部代码有BUG！
                 * 详细见：
                 * TypeError: Cannot read properties of undefined (reading 'name')
                 *     at registerBinding (G:\WebStormWS\upload-for-multiple\node_modules\@vue\compiler-sfc\dist\compiler-sfc.cjs.js:4653:19)
                 *     at walkObjectPattern (G:\WebStormWS\upload-for-multiple\node_modules\@vue\compiler-sfc\dist\compiler-sfc.cjs.js:4734:13)
                 *     at walkDeclaration (G:\WebStormWS\upload-for-multiple\node_modules\@vue\compiler-sfc\dist\compiler-sfc.cjs.js:4698:21)
                 *     at Object.compileScript (G:\WebStormWS\upload-for-multiple\node_modules\@vue\compiler-sfc\dist\compiler-sfc.cjs.js:4263:13)
                 *     at resolveScript (file:///G:/WebStormWS/upload-for-multiple/node_modules/@vitejs/plugin-vue/dist/index.mjs:283:31)
                 *     at genScriptCode (file:///G:/WebStormWS/upload-for-multiple/node_modules/@vitejs/plugin-vue/dist/index.mjs:2469:18)
                 *     at transformMain (file:///G:/WebStormWS/upload-for-multiple/node_modules/@vitejs/plugin-vue/dist/index.mjs:2282:54)
                 *     at Object.transform (file:///G:/WebStormWS/upload-for-multiple/node_modules/@vitejs/plugin-vue/dist/index.mjs:2785:16)
                 *     at file:///G:/WebStormWS/upload-for-multiple/node_modules/rollup/dist/es/shared/node-entry.js:24551:40
                 */
                ...( isEnabled => {
                  return isEnabled
                         ? {
                      babelParserPlugins,
                    }
                         : {};
                } )( false ),
                transformAssetUrls: {
                  video: [
                    'src',
                    'poster',
                  ],
                  source: 'src',
                  img: 'src',
                  image: [
                    'xlink:href',
                    'href',
                  ],
                  use: [
                    'xlink:href',
                    'href',
                  ],
                  audio: 'src',
                },
                /**
                 * 设置编译器，用于编译单文件组件中的<template>块。<br />
                 * 1、对于Vue 2.X使用“vue-template-compiler”，对于Vue 3.X使用“@vue/compiler-sfc”。<br />
                 * 2、该选项值可以是字符串的包名，如：'@vue/compiler-sfc'、'vue-template-compiler'。<br />
                 * 3、也可以是上面两个包导出的对象（该对象必需包含2个函数实现：compile、parse），详细见：node_modules/@vue/compiler-sfc/dist/compiler-sfc.d.ts:304<br />
                 * 该选项详细见：<br />
                 * node_modules/vue-loader/dist/index.d.ts:8
                 * node_modules/@vue/compiler-sfc/dist/compiler-sfc.d.ts:304
                 *
                 * PS：<br />
                 * 1、实际测试了一下，当该选项设置值为'@vue/compiler-sfc'时，会报错！因为没有找到“compile”函数！<br />
                 * 在'@vue/compiler-sfc'源码中发现，有“parse”函数的实现（见：node_modules/@vue/compiler-sfc/dist/compiler-sfc.d.ts:95）。<br />
                 * 但是没有“compile”函数的实现，貌似是被命名为“compileTemplate”（见：node_modules/@vue/compiler-sfc/dist/compiler-sfc.d.ts:61），<br />
                 * 但是该“compileTemplate”函数的声明不是符合规定的“compile”函数的声明（见：node_modules/@vue/compiler-sfc/dist/compiler-sfc.d.ts:305）。<br />
                 *
                 * 2、顺便查看了“vue-template-compiler”源码，发现了“compile”函数的实现，见：<br />
                 * node_modules/vue-template-compiler/types/index.d.ts:214
                 * node_modules/vue-template-compiler/types/index.d.ts:219
                 * 而“parse”函数的实现，貌似被重命名为“parseComponent”函数，见：node_modules/vue-template-compiler/types/index.d.ts:238
                 *
                 * 因此，该选项不用设置，貌似内部自动处理设置了。<br />
                 *
                 * @type {TemplateCompiler | string}
                 */
                // compiler: '@vue/compiler-sfc',
                compilerOptions: {
                  /**
                   * 值有："module"、"function"（默认值）。<br />
                   * `module`模式将为帮助器生成ES模块导入语句 并将渲染函数作为默认导出。<br />
                   * `function`模式将产生一个单一的“const { helpers... } = Vue”语句并返回渲染函数。它希望`Vue`是全局可用的（或者通过用IIFE包装代码来传递）。它是用来与`new Function(code)()`一起使用，在运行时生成一个渲染函数。<br />
                   *
                   * 当mode: 'function'时，会报“scopeId”错误，说是“scopeId”只能跟“mode: 'module'”一起使用，见：node_modules/@vue/compiler-core/dist/compiler-core.d.ts:1151
                   * 当在Vue的SFC里书写“<script type = 'module'>”时，就会使用“mode: 'module'”了。<br />
                   * 该选项一般不用设置，内部会自动设置。<br />
                   *
                   * 详细见：<br />
                   * node_modules/@vue/compiler-core/dist/compiler-core.d.ts:170
                   */
                  // mode: 'module',
                  /**
                   * 将表达式（如 {{ foo }} 转换为 _ctx.foo）。如果此选项为 false，则生成的代码将被包装在一个 with (this) { ... } 块中。<br />
                   * 这在mode === 'module'是强制启用的，因为模块默认是严格的，不能使用with。<br />
                   * 一般不要设置这个选项，交由内部自行处理。<br />
                   */
                  // prefixIdentifiers: true,
                  /**
                   * 缓存v-on处理程序以避免在每次渲染时创建新的内联函数，也避免了通过包装动态修补处理程序的需要。<br />
                   * 例如`@click="foo"`默认编译为`{onClick: foo }`。<br />
                   * 有了这个选项，它就被编译成：<br />
                   * { onClick: _cache[0] || (_cache[0] = e => _ctx.foo(e)) }
                   * 需要启用 "prefixIdentifiers"，因为它依靠范围分析来确定处理程序是否可以安全缓存。<br />
                   * 分析来确定一个处理程序是否可以安全地进行缓存。<br />
                   * 一般不要设置这个选项，交由内部自行处理。<br />
                   * 详细见：<br />
                   * node_modules/@vue/compiler-core/dist/compiler-core.d.ts:1141
                   */
                  // cacheHandlers: true,
                  /**
                   * 通过变量赋值优化帮助程序导入绑定的选项（仅用于webpack代码拆分），默认值为：false。<br />
                   * 一般不要设置这个选项，交由内部自行处理。<br />
                   * 详细见：node_modules/@vue/compiler-core/dist/compiler-core.d.ts:185
                   */
                  // optimizeImports: isProduction,
                  comments: !isProduction,
                  whitespace: !isProduction
                              ? 'preserve'
                              : 'condense',
                },
                transpileOptions: {
                  target: vue_loader_options_transpileOptions_target,
                  /**
                   * transforms里的选项值，true表示转换特性，false表示直接使用该特性。<br />
                   * PS：<br />
                   * 1、该选项会覆盖来自上面选项“target”中的特性！故该选项要慎重使用！一般交给选项“target”控制即可。<br />
                   */
                  /*
                   transforms: {
                   arrow: false,
                   classes: false,
                   collections: false,
                   computedProperty: false,
                   conciseMethodProperty: false,
                   constLoop: false,
                   // 危险的转换！设置成false会直接使用该特性！
                   dangerousForOf: false,
                   // 危险的转换！设置成false会直接使用该特性！
                   dangerousTaggedTemplateString: false,
                   defaultParameter: false,
                   destructuring: false,
                   forOf: false,
                   generator: false,
                   letConst: false,
                   modules: false,
                   numericLiteral: false,
                   parameterDestructuring: false,
                   reservedProperties: false,
                   spreadRest: false,
                   stickyRegExp: false,
                   templateString: false,
                   unicodeRegExp: false,
                   exponentiation: false,
                   },
                   */
                  jsx: 'React.createElement',
                  // 对于IE 8需要将它设置成namedFunctionExpressions: false。
                  namedFunctionExpressions: true,
                },
                hotReload: !isProduction,
                productionMode: isProduction,
                prettify: !isProduction,
                exposeFilename: !isProduction,
                /**
                 * 该选项不设置时，内部都为false处理，见：node_modules/vue-loader/dist/index.js:90
                 * 详细见：<br />
                 * node_modules/vue-loader/dist/index.d.ts:14
                 *
                 * @type {boolean}
                 */
                // appendExtension: false,
                // vue-loader v16+才有的选项。Start
                /**
                 * 在使用Vue的反应性API时，引入一组编译器转换来改善人体工程学，特别是能够使用没有.value的refs。<br />
                 * 1、具体可阅https://github.com/vuejs/rfcs/discussions/369 <br />
                 * 2、仅在SFC中生效。<br />
                 * 3、该选项会在3.4版本中被删除！反应性转换提案已被删除。如果你打算继续使用它，请禁用它并切换到[Vue Macros implementation](https://vue-macros.sxzz.moe/features/reactivity-transform.html)。<br />
                 */
                // reactivityTransform: true,
                /**
                 * 启用自定义元素模式。在自定义元素模式下加载的SFC将其<style>标记内联为组件样式选项下的字符串。<br />
                 * 1、当与Vue核心的defineCustomElement一起使用时，样式将被注入到自定义元素的阴影根中。<br />
                 * 2、默认值为：/\.ce\.vue$/。<br />
                 * 3、该选项的值类型为：boolean、RegExp。<br />
                 * 4、设置为true将以“自定义元素模式”处理所有.vue文件。<br />
                 */
                // customElement: /\.ce\.vue$/,
                /**
                 * vue-loader v16.8+启用，当<script>有lang="ts"时，允许模板中的TS表达式。默认为真。<br />
                 * 1、当与ts-loader一起使用时，由于ts-loader的缓存失效行为，它有时会阻止模板被单独热重新加载，从而导致组件重新加载，尽管只编辑了模板。<br />
                 * 2、如果这很烦人，您可以将此选项设置为false（并避免在模板中使用TS表达式）。<br />
                 * 3、或者，保留此选项（默认情况下）并使用esbuild-loader转译TS，这样就不会遇到这个问题（它也快得多）。<br />
                 * 4、但是，请注意您将需要依赖其他来源（例如IDE或vue-tsc）的TS类型检查。<br />
                 */
                enableTsInTemplate: true,
                // vue-loader v16+才有的选项。End

                /**
                 * 实验性选项。true表示启用宏“defineModel”。
                 */
                defineModel: true,
                /**
                 * 实验性选项。true表示为“defineProps”启用反应式解构。
                 */
                propsDestructure: true,
              },
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.wasm文件，区分结尾带“?url”和不带“?url”的2种处理。
        {
          test: /\.wasm$/i,
          oneOf: [
            /**
             * 处理以“.wasm?url”结尾的文件导入。会返回一个URL连接。
             */
            {
              resourceQuery: {
                and: [
                  /url/,
                ],
              },
              /**
               * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
               * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
               * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
               * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
               */
              type: 'asset/resource',
              generator: {
                emit: true,
                filename( pathData, assetInfo ){
                  return '[name]_[contenthash][ext]';
                },
                outputPath( pathData, assetInfo ){
                  return './wasm/';
                },
                publicPath( pathData, assetInfo ){
                  return '../wasm/';
                },
              },
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
              ].concat( exclude001 ),
            },
            /**
             * 处理.wasm文件，但是不带“?url”查询参数的。使用webpack 5新增的type: 'webassembly/async'，需要开启实验性选项experiments.asyncWebAssembly。<br />
             * 1、使用案例：<br />
             * import { sum, } from './program.wasm';
             * console.log( sum( 1,2 ) );
             * 2、当前设置下，不支持默认导出，既不支持这样的写法：<br />
             * import MathTool from 'wasmDir/c++/math_tool/MathTool.wasm';
             * console.dir( MathTool );
             * 会报错：<br />
             * export 'default' (imported as 'MathTool') was not found in 'wasmDir/c++/math_tool/MathTool.wasm' (possible exports: Add, Div, Fib, Mod, Mul, Sub, __wasm_apply_data_relocs, __wasm_call_ctors)
             * 3、但是可以按需导出，就像上面第1点的使用案例那样。<br />
             * 4、或者全部导出：<br />
             * import * as MathTool from 'wasmDir/c++/math_tool/MathTool.wasm';
             * console.dir( MathTool );
             * MathTool的值形如：{ Add, Div, Fib, Mod, Mul, Sub, __wasm_apply_data_relocs, __wasm_call_ctors }。<br />
             */
            {
              resourceQuery: {
                not: [
                  /url/,
                ],
              },
              type: 'webassembly/async',
              include: [
                join( __dirname, './node_modules/' ),

                join( __dirname, './src/' ),

                join( __dirname, './webpack_location/' ),
              ],
              exclude: [
                join( __dirname, './src/assets/' ),
                join( __dirname, './src/custom_declare_types/' ),
                join( __dirname, './src/graphQL/' ),
                join( __dirname, './src/pwa_manifest/' ),
                join( __dirname, './src/static/' ),
                join( __dirname, './src/styles/' ),
              ].concat( exclude001 ),
            },
          ],
        },

        // 处理.xml文件。
        {
          test: /\.xml$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'xml-loader',
            },
          ],
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/doc/cson/' ),
            join( __dirname, './src/assets/doc/csv/' ),
            join( __dirname, './src/assets/doc/json/' ),
            join( __dirname, './src/assets/doc/json5/' ),
            join( __dirname, './src/assets/doc/toml/' ),
            join( __dirname, './src/assets/doc/tsv/' ),
            join( __dirname, './src/assets/doc/txt/' ),
            join( __dirname, './src/assets/doc/yaml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },

        // 处理.yaml文件、.yml文件。
        {
          test: /\.(yaml|yml)$/i,
          type: 'json',
          parser: {
            parse: Yaml.parse,
          },
          include: [
            join( __dirname, './node_modules/' ),

            join( __dirname, './src/' ),

            join( __dirname, './webpack_location/' ),
          ],
          exclude: [
            join( __dirname, './src/assets/doc/cson/' ),
            join( __dirname, './src/assets/doc/csv/' ),
            join( __dirname, './src/assets/doc/json/' ),
            join( __dirname, './src/assets/doc/json5/' ),
            join( __dirname, './src/assets/doc/toml/' ),
            join( __dirname, './src/assets/doc/tsv/' ),
            join( __dirname, './src/assets/doc/txt/' ),
            join( __dirname, './src/assets/doc/xml/' ),
            join( __dirname, './src/assets/fonts/' ),
            join( __dirname, './src/assets/img/' ),
            join( __dirname, './src/assets/music/' ),
            join( __dirname, './src/assets/videos/' ),
            join( __dirname, './src/custom_declare_types/' ),
            join( __dirname, './src/graphQL/' ),
            join( __dirname, './src/pwa_manifest/' ),
            join( __dirname, './src/static/' ),
            join( __dirname, './src/styles/' ),
            join( __dirname, './src/wasm/' ),
          ].concat( exclude001 ),
        },
      ],
    };
  },
  /**
   * @type {import('node_modules/@module-federation/sdk/dist/src/types/plugins/ModuleFederationPlugin.d.ts').ModuleFederationPluginOptions} ModuleFederationPluginOptions
   */
  moduleFederationPluginConfig = ModuleFederation_v2_Config_Fun( {
    __dirname,
  } ),
  /**
   * @type {object}
   */
  optimizationConfig = isProduction
                       ? {
      /**
       * 1、生产环境，默认值为：'deterministic'。<br />
       * 2、当optimization.chunkIds设置为'deterministic'时，使用的最小长度为3位。要覆盖默认行为，请将optimization.chunkIds设置为false并使用webpack.ids.DeterministicChunkIdsPlugin。<br />
       */
      chunkIds: false,
      // 生产模式下启用，否则禁用。也依赖optimization.providedExports和optimization.usedExports。
      // concatenateModules: true,
      /**
       * 1、编译时出现错误时，使用optimization.emitOnErrors发出资产。这可确保发出错误资产。严重错误会发送到生成的代码中，并会在运行时导致错误。<br />
       * 2、如果您使用的是webpack CLI，则启用此插件时webpack进程将不会退出并显示错误代码。如果您希望webpack在使用CLI时“失败”，请查看bail选项。<br />
       */
      emitOnErrors: false,
      // 默认情况下optimization.flagIncludedChunks在生产模式下启用，否则禁用。
      // flagIncludedChunks: true,
      // 默认情况下optimization.mangleExports: 'deterministic'在生产模式下启用，否则禁用。
      // mangleExports: 'deterministic',
      // 当设置为true时，告诉webpack通过将导入更改为更短的字符串来减小WASM的大小。它破坏了模块和导出名称。
      mangleWasmImports: false,
      // 告诉webpack合并包含相同模块的块。将optimization.mergeDuplicateChunks设置为false将禁用此优化。
      mergeDuplicateChunks: true,
      minimize: true,
      minimizer: [
        // 对于webpack@5，您可以使用`...`语法来扩展现有的最小化程序（即 `terser-webpack-plugin`）。
        '...',
        /**
         * 1、这个插件，个人将其配置成用来压缩JS，但是不做语法转译。<br />
         * 2、TerserPlugin比EsbuildPlugin更好地支持esbuild，即TerserPlugin支持缓存和多线程。<br />
         */
        new TerserPlugin( {
          test: /\.(js|cjs|mjs)$/i,
          parallel: cpus().length - 1,
          extractComments: false,
          // 使用esbuildMinify时，不支持上面的extractComments选项，所有法律评论（即版权、许可证等）将被保留，但是esbuildMinify自己的配置选项是可以有选项来删除注释的。
          minify: TerserPlugin.esbuildMinify,
          // 当使用babel转换JS语法时，drop选项不使用，其同样的功能交给babel预设处理，这里就不用重复设置了。但是如果使用esbuild转换JS时，还是要启用drop选项的。
          terserOptions: esbuildMinifyConfig,
        } ),
        /**
         * 这个插件使用cssnano来优化和缩小你的CSS。就像optimize-css-assets-webpack-plugin但使用查询字符串对源映射和资产更准确，允许缓存并在并行模式下工作。<br />
         * 1、最好只在生产环境下使用该插件。<br />
         */
        new CssMinimizerPlugin( {
          test: /\.css$/i,
          // 如果启用了并行化，则必须通过字符串（packageName或require.resolve(packageName)）来要求minimizerOptions中的包。
          parallel: cpus().length - 1,
          /**
           * 启用并行选项时，始终在minify函数中使用require。<br />
           * 1、该选项支持异步函数作为值。<br />
           * 2、minify跟minimizerOptions是一对一的关系，具体要看文档。<br />
           * 3、CssMinimizerPlugin.esbuildMinify对应的minimizerOptions选项的配置见https://esbuild.github.io/api/#transform-api。<br />
           */
          minify: CssMinimizerPlugin.cssnanoMinify,
          /**
           * 如果启用了并行化，则必须通过字符串（packageName或require.resolve(packageName)）来要求minimizerOptions中的包。在这种情况下，我们不应该使用require/import。<br />
           * 1、minify跟minimizerOptions是一对一的关系，具体要看文档。<br />
           */
          minimizerOptions: {
            preset: [
              // 有效值有：default、advanced、lite、cssnano-preset-default（要安装）、cssnano-preset-advanced（要安装）、cssnano-preset-lite（要安装）。
              'advanced',
              {
                // autoprefixer共有三种类型的控制注释：
                // /* autoprefixer: (on|off) */：在注释前后“启用/禁用”整个块的所有Autoprefixer翻译。
                // /* autoprefixer: ignore next */：仅为下一个属性或下一个规则选择器或规则参数（但不规则/规则正文）禁用自动前缀。
                // /* autoprefixer grid: (autoplace|no-autoplace|off) */：控制Autoprefixer如何处理整个块的网格转换：
                // autoplace：启用带有自动放置支持的网格翻译。
                // no-autoplace：在禁用自动放置支持的情况下启用网格转换，但不支持自动放置（该值是值on的别名，但是值on是一个已弃用的值）。
                // off：禁用所有网格翻译。
                // 根据浏览器选项删除不必要的前缀。请注意，默认情况下，它不会向CSS文件添加新前缀。
                autoprefixer: autoprefixerConfig,
                // 根据属性名称对CSS声明进行排序，gzip压缩时排序后的CSS会更小，因为会有更多相似的字符串。
                cssDeclarationSorter: false,
                // 尽可能减少CSS计算表达式，确保浏览器兼容性和压缩。
                calc: postcssCalcConfig,
                // 在hex、hsl、rgb和CSS关键字之间转换，以产生最小的等效颜色值。
                colormin: true,
                // 在等效长度、时间和角度值之间转换。请注意，默认情况下，不会转换长度值。
                convertValues: {
                  // 值类型：boolean，默认值：true，传递false以禁用从px到其他绝对长度单位的转换，例如pc&pt反之亦然。
                  length: false,
                  // 值类型：boolean，默认值：true，传递false以禁用从ms到s的转换，反之亦然。
                  time: true,
                  // 值类型：boolean，默认值：true，传递false以禁用从deg到turn的转换，反之亦然。
                  angle: true,
                  // 值类型：boolean、number，默认值：false，在此处指定任何数值以将px值四舍五入到那么多小数位；例如，使用{precision: 2}会将6.66667px舍入为6.67px，而{precision: 0}会将其舍入为7px。传递false将使这些值保持原样。对于大多数用例，建议将此选项设置为2。
                  precision: 6,
                },
                // 删除规则、选择器和声明中和周围的注释。请注意标有!的任何特殊注释。默认情况下保留。
                discardComments: {
                  // 值类型：boolean，默认值：false，删除所有标记为重要的评论。
                  removeAll: true,
                  // 值类型：boolean，默认值：false，删除所有标记为重要的评论，但保留第一个。
                  removeAllButFirst: false,
                },
                // 删除重复的规则、规则和声明。请注意，这仅适用于精确重复。
                discardDuplicates: true,
                // 删除空规则、媒体查询和带有空选择器的规则，因为它们不会影响输出。
                discardEmpty: true,
                // 删除与另一个具有相同标识符的at规则；例如@keyframes的两个实例之一。由于浏览器只会计算这些声明中的最后一个，因此可以安全地删除所有其他声明。
                discardOverridden: true,
                // 删除与CSS文件没有任何关系的at规则。如果您有其他符合这些规则的样式表，这是不安全的。
                discardUnused: false,
                // 这会将命名可能略有不同但执行相同操作的规则合并在一起。请注意，仅当您依赖JavaScript中的这些动画名称时，这才是不安全的。
                mergeIdents: false,
                // 将速记属性折叠为速记表示，并在可能的情况下折叠顶部/右侧/底部/左侧值。支持边距、内边距和边框。
                mergeLonghand: true,
                // 通过选择器和重叠的属性/值对合并相邻的规则。
                mergeRules: true,
                // 规范字体和字体系列声明，并可以将字体粗细关键字转换为数值。
                minifyFontValues: false,
                // 标准化线性和径向梯度参数。
                minifyGradients: false,
                // 修剪空白并规范化规则参数。
                minifyParams: true,
                // 删除不必要的合格通用选择器，取消引用属性选择器，修剪和规范化选择器字符串。
                minifySelectors: true,
                // 确保CSS文件中只存在一个@charset，并将其移动到文档的顶部。这可以防止通过简单的CSS连接发生多个无效声明。请注意，默认情况下，不会将新的@charset规则添加到CSS中。
                normalizeCharset: false,
                // 尽可能将用于显示的两个值语法规范化为单值语法。
                normalizeDisplayValues: false,
                // 在background、background-position、-webkit-perspective-origin和perspective-origin属性中规范化位置值。
                normalizePositions: true,
                // 在可能的情况下，在属性本身和背景速记中，将background-repeat的双值语法减少为单值语法。也适用于掩码重复。
                normalizeRepeatStyle: true,
                // 标准化双引号（默认情况下）或单引号字符串的使用，以实现更好的gzip压缩。还可以删除出于美观目的而插入的换行符。如果你喜欢单引号，你可以设置preferredQuote: 'single' 。
                normalizeString: {
                  // 值类型：string，默认值：'double'，设置首选的报价类型。可能的值是'single'或'double'。
                  preferredQuote: 'single',
                },
                // 在动画、animation-timing-function、transition和transition-timing-function属性中规范化过渡时间。
                normalizeTimingFunctions: true,
                // 当特定值满足通配符标准时，此优化可以转换unicode范围描述符以使用较短的通配符范围。当代码在范围两侧的相同位置匹配0和f时，将转换值。因此，u+2000-2fff可以转换为u+2???，但u+2100-2fff将保持原样。
                normalizeUnicode: true,
                // 规范化URL字符串。它可以删除默认端口，解决不必要的目录遍历和取消引用值。
                normalizeUrl: {
                  // 值类型：string，默认值：'http:'，有效值：'https:'、'http:'。
                  defaultProtocol: 'http',
                  // 值类型：boolean，默认值：true，设置成false，不会将defaultProtocol选项的值设置给无HTTP协议头的URL。
                  normalizeProtocol: false,
                  // 值类型：boolean，默认值：false，将'https:'转为'http:'，设置成false，则不会转换。
                  forceHttp: false,
                  // 值类型：boolean，默认值：false，将'http:'转为'https:'，设置成false，则不会转换。此选项不能与forceHttp选项同时使用，也就是说这两个选项不能同时设置成true，会报错。
                  forceHttps: false,
                  // 值类型：boolean，默认值：true，剥离URL的身份验证部分，设置成false则不会剥离。
                  stripAuthentication: false,
                  // 值类型：boolean，默认值：false，去除URL的哈希部分，设置成false，就不会去除。
                  stripHash: false,
                  // 值类型：boolean，默认值：false，从URL中删除协议，设置成false，就不会去除。
                  stripProtocol: false,
                  // 值类型：boolean，默认值：true，剥离URL的文本片段部分，设置成false，就不会去除。注意：如果stripHash选项设置为true，文本片段将始终被删除，因为哈希包含文本片段。
                  stripTextFragment: false,
                  // 值类型：boolean，默认值：true，从URL中删除'wwww'，设置成false，就不会删除。
                  stripWWW: false,
                  // 值类型：Array<RegExp | string>、boolean，默认值：[/^utm_\w+/i]，删除URL中的查询参数，设置成false，就不会去除。
                  removeQueryParameters: false,
                  // 值类型：boolean，默认值：true，删除尾部斜杠，设置成false，就不会删除。
                  removeTrailingSlash: false,
                  // 值类型：boolean，默认值：true，删除输出中的唯一“/”路径名，设置成false，就不会删除。此选项独立于removeTrailingSlash选项，两者可以共存。
                  removeSingleSlash: false,
                  // 值类型：boolean、Array<RegExp | string>，默认值：false，从与任何提供的字符串或正则表达式匹配的路径中删除默认目录索引文件。如果为true，则使用正则表达式/^index\.[a-z]+$/，设置成false，就不会删除。
                  removeDirectoryIndex: false,
                  // 值类型：boolean，默认值：true，按字母顺序对查询参数进行排序。设置成false，就不会进行排序。
                  sortQueryParameters: false,
                },
                // 修剪规则、选择器和声明内部和周围的空格，并删除每个选择器内的最后一个分号。
                normalizeWhitespace: true,
                // 受此变换影响的属性可以以任意顺序接受其参数。该模块规范了该顺序，便于更轻松地进行重复数据删除。
                orderedValues: true,
                // 重命名@keyframes等规则。如果其他JS/CSS文件需要读取此定义，这可能是不安全的。
                reduceIdents: false,
                // 当结果输出较小时，将CSS初始关键字替换为实际值。
                reduceInitial: false,
                // 当存在等效的速记时，在变换函数之间进行转换。
                reduceTransforms: false,
                // 使用SVGO压缩内联SVG定义。
                svgo: false,
                // 自然地对每个规则的选择器进行排序，并删除重复项。
                uniqueSelectors: false,
                // 重新设置z-index值。这是不安全的，因为它可能与其他样式表或JavaScript注入样式发生冲突。但是，如果您的堆叠上下文已完全提取到CSS中，则它是安全的。
                zindex: false,
              },
            ],
          },
        } ),
        new JsonMinimizerPlugin( {
          test: /\.(json|json5)$/i,
          minimizerOptions: {
            replacer: null,
            space: null,
          },
        } ),
        /**
         * 1、image-minimizer-webpack-plugin插件用于压缩图片，所以会吃性能、增加编译时间。<br />
         * 2、支持通过函数过滤图片，以便选择性的压缩图片，例如，通过图片名中带有指定名字来跳过对这些图片的压缩。<br />
         * 3、目前有4个实现：sharpMinify（首选使用该实现，使用高性能Node.js图像处理）、svgoMinify（只用于处理svg）、imageminMinify（已经不维护了，不要用了）、squooshMinify（用它会报错，因为它不支持Node v18.X，而且“@squoosh/lib”这个npm也没人维护了，都被弃用了）。<br />
         * 4、不要重复对同一类图片做多次处理。<br />
         */
        ...( isEnable => {
          const imageMinimizerPluginConfig = {
            /**
             * 1、改选项设置为false时，generator选项将不起作用。<br />
             * 2、该选项要启用！不然在单独插件模式下，在.ejs中require( 'imgDir/1.png' )时，出现生成的最终图片名跟.html中的图片名不一致，但是跟css文件中的图片名确实一样的。<br />
             */
            loader: true,
            severityError: 'error',
            concurrency: cpus().length - 1,
            deleteOriginalAssets: true,
            include: [
              join( __dirname, './node_modules/' ),

              join( __dirname, './src/' ),

              join( __dirname, './webpack_location/' ),
            ],
            exclude: [
              join( __dirname, './src/static/' ),
              join( __dirname, './src/custom_declare_types/' ),
            ],
          };

          const configs = {
            /**
             * svgoMinify只用于处理svg。<br />
             * 1、imagemin-svgo可以配置为无损和有损模式。<br />
             * 2、推荐用于无损优化的imagemin插件：imagemin-svgo（对于imagemin-svgo v9.0.0+需要使用svgo配置）。<br />
             * 3、推荐用于有损优化的imagemin插件：imagemin-svgo（对于imagemin-svgo v9.0.0+需要使用svgo配置）。<br />
             * 4、对于imagemin-svgo v9.0.0+需要使用svgo配置：https://github.com/svg/svgo#configuration <br />
             * 5、“width/w”、“height/h”、“as”这三个查询参数目前只在“squoosh”、“sharp”中支持。<br />
             */
            svgoMinify: new ImageMinimizerPlugin( {
              test: /\.(svg)$/i,
              ...imageMinimizerPluginConfig,
              minimizer: {
                implementation: ImageMinimizerPlugin.svgoMinify,
                // 该项支持的值见webpack模板字符串，文件级部分，不支持contenthash一类的模板字符串，当前只有sharp、squoosh支持[width]、[height]。
                filename: 'img/[name]_optimize_svgo[ext]',
                /**
                 * 允许过滤图像以进行优化/生成。返回true以优化图像，否则返回false则不优化。<br />
                 *
                 * @param {Buffer} source source.byteLength表示图片的大小，单位为字节。<br />
                 *
                 * @param {string} sourcePath 图片路径，如：img/1_1920_1080_fd32eda928ed7872.webp。<br />
                 *
                 * @returns {boolean|undefined} 返回true以优化图像，否则返回false则不优化。
                 */
                filter( source, sourcePath ){
                  if( Number( source.byteLength ) > 10 * 1024 ){
                    return true;
                  }
                  else{
                    return false;
                  }
                },
                options: {
                  encodeOptions: {
                    /**
                     * 1、是否启用多次传递SVG以确保应用所有优化，true表示启用。<br />
                     * 2、值类型：boolean，默认值：false。<br />
                     */
                    multipass: false,
                    /**
                     * 1、精度。<br />
                     * 2、值类型：number，默认值：3。<br />
                     */
                    floatPrecision: 3,
                    /**
                     * 1、输出为数据URI字符串的编码，预设值有：'base64'、'enc'（URI编码）、unenc（未编码）。<br />
                     * 2、值类型：string，默认值：'base64'。<br />
                     */
                    datauri: 'base64',
                    js2svg: {
                      /**
                       * 1、使用多少个空格进行缩进。<br />
                       * 2、值类型：number，默认值为：4。<br />
                       */
                      indent: 2,
                      /**
                       * 1、是否美化输出。<br />
                       * 2、值类型：boolean，默认值为：false。<br />
                       */
                      pretty: false,
                    },
                    plugins: [
                      // 启用预设的默认插件。
                      'preset-default',
                    ],
                  },
                },
              },
            } ),
            /**
             * 1、只支持对avif、gif、jp2、jpe、jpeg、jpg、png、raw、tif、tiff、webp的处理。<br />
             * 2、直到20220818，sharp v0.30.7、vips-dev-w64-all-8.12.2，转换heic、heif还是会报错。<br />
             * 3、“width/w”、“height/h”、“as”这三个查询参数目前只在“squoosh”、“sharp”中支持。<br />
             */
            sharpMinify: new ImageMinimizerPlugin( {
              test: /\.(avif|gif|jp2|jpe|jpeg|jpg|png|raw|tif|tiff|webp)$/i,
              ...imageMinimizerPluginConfig,
              minimizer: {
                implementation: ImageMinimizerPlugin.sharpMinify,
                // 该项支持的值见webpack模板字符串，文件级部分，不支持contenthash一类的模板字符串，当前只有sharp、squoosh支持[width]、[height]。
                filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                /**
                 * 允许过滤图像以进行优化/生成。返回true以优化图像，否则返回false则不优化。<br />
                 *
                 * @param {Buffer} source source.byteLength表示图片的大小，单位为字节。<br />
                 *
                 * @param {string} sourcePath 图片路径，如：img/1_1920_1080_fd32eda928ed7872.webp。<br />
                 *
                 * @returns {boolean|undefined} 返回true以优化图像，否则返回false则不优化。
                 */
                filter( source, sourcePath ){
                  if( Number( source.byteLength ) > 10 * 1024 ){
                    return true;
                  }
                  else{
                    return false;
                  }
                },
                // 如下的sharpMinify实现的配置参数都是从源代码中获取的：node_modules/image-minimizer-webpack-plugin/dist/utils.js:927，都在异步函数sharpTransform中。
                options: {
                  /**
                   * 1、旋转图片的角度。<br />
                   * 2、值类型：number、string（只有1个预设值：'auto'）。<br />
                   * 3、比如设置值为：90表示顺时针旋转90度、-90表示逆时针旋转90度，支持任何角度的旋转：45、35、1、0等等。<br />
                   */
                  // rotate: null,
                  /**
                   * 1、重置图片的大小。<br />
                   * 2、值类型：<br />
                   * {<br />
                   * enabled: boolean<br />
                   * width: number（必须是正整数），如果只设置了宽度，那么高度会自动等比缩放。<br />
                   * height: number（必须是正整数），如果只设置了高度，那么宽度会自动等比缩放。<br />
                   *
                   * 说明：<br />
                   * 例如，原图片大小为宽度1920px，高度1080px。设置{ enabled: true, width: 500, height: 500 }，以下其他选项都不设置，保持其各自默认值即可，那么重置的具体步骤（这些步骤涉及的操作都可以通过以下的选项来改变的）如下：<br />
                   * 有2种重置方案：<br />
                   * 第1种，将图片等比缩放成宽度500px的，这时会缩放成宽度500px，高度281px，显然高度达不到设置的500，所以这个方案废弃。<br />
                   * 第2种，将图片等比缩放成高度500px的，这时会缩放成宽度890px，高度500px，显然宽度、高度都能达到设置的，所以采用这种方案。<br />
                   * 1、将图片等比缩放到高度为500px的大小，宽度随高度等比缩放。<br />
                   * 2、然后从中心开始裁剪出高度为500px、宽度为500px的图片。<br />
                   * 3、“等比缩放”、“中心”（position）、“裁剪”（fit）、“黑色填充背景色”（background）等等操作都是以下选项设置的。<br />
                   *
                   * 以上是常用选项。下面的选项是从“sharp”的源代码中找到的，它们一般都有默认值，除非特殊需要，否则不用设置。<br />
                   *
                   * fit: string，如何调整图像大小以适应上面提供的width、height，默认值是'cover'（修剪）。<br />
                   * 其有效值有：<br />
                   * 'contain'，对应表示'embed'（填充，其他区域会用背景色填充）。<br />
                   * 'cover'，对应表示'crop'（修剪）。<br />
                   * 'fill'，对应表示'ignore_aspect'（估计是强制缩放到上面提供的width、height）。<br />
                   * 'inside'，对应表示'max'。<br />
                   * 'outside'，对应表示'min'。<br />
                   *
                   * position: string、number（必须是正整数，大于等于0且小于等于8，或为16、17），当上面fit选项值为'cover'、'contain'时偏移量的设置，默认值是'center'（对应表示0）。<br />
                   * 有效的字符串值有：<br />
                   * 'entropy'，对应表示16。<br />
                   * 'attention'，对应表示17。<br />
                   * 'top'，对应表示1。<br />
                   * 'right'，对应表示2。<br />
                   * 'bottom'，对应表示3。<br />
                   * 'left'，对应表示4。<br />
                   * 'right top'，对应表示5。<br />
                   * 'right bottom'，对应表示6。<br />
                   * 'left bottom'，对应表示7。<br />
                   * 'left top'，对应表示8。<br />
                   * 'center'，对应表示0。<br />
                   * 'centre'，对应表示0。<br />
                   * 'north'，对应表示1。<br />
                   * 'east'，对应表示2。<br />
                   * 'south'，对应表示3。<br />
                   * 'west'，对应表示4。<br />
                   * 'northeast'，对应表示5。<br />
                   * 'southeast'，对应表示6。<br />
                   * 'southwest'，对应表示7。<br />
                   * 'northwest'，对应表示8。<br />
                   *
                   * background: object，当上面fit选项值为'contain'时的背景颜色，默认值是{ r: 0, g: 0, b: 0, alpha: 1 }（对应黑色不透明[ 0, 0, 0, 255 ]）。<br />
                   *
                   * kernel: string，用于图像缩减的内核，默认值是'lanczos3'（对应'lanczos3'）。<br />
                   * 有效的字符串值有：<br />
                   * 'nearest'，对应表示'nearest'。<br />
                   * 'cubic'，对应表示'cubic'。<br />
                   * 'mitchell'，对应表示'mitchell'。<br />
                   * 'lanczos2'，对应表示'lanczos2'。<br />
                   * 'lanczos3'，对应表示'lanczos3'。<br />
                   *
                   * withoutEnlargement: boolean，如果图片的宽度或高度已经小于上面提供的width、height，是否不放大，默认值是false。<br />
                   * false表示放大。<br />
                   * true表示不放大。<br />
                   *
                   * withoutReduction: boolean，如果图片的宽度或高度已经大于上面提供的width、height，是否不缩小，默认值是false。<br />
                   * false表示缩小。<br />
                   * true表示不缩小。<br />
                   *
                   * fastShrinkOnLoad: boolean，是否充分利用JPEG和WebP的“shrink-on-load”特性，这可能会导致某些图像上出现轻微的波纹图案，默认值是true。<br />
                   * }<br />
                   * 3、上面的enabled选项为true时，才会启用重置图片大小的操作。<br />
                   */
                  // resize: null,
                  /**
                   * 该函数用于为图片名添加一个可以DIY的字符串，最终图片名为:`${图片原名}${该函数返回的字符串}.${图片后缀}`。<br />
                   *
                   * @param {number} width 最终结果图片的宽度值。<br />
                   *
                   * @param {number} height 最终结果图片的高度值。<br />
                   *
                   * @returns {string} 该函数用于为图片名添加一个可以DIY的字符串，最终图片名为:`${图片原名}${该函数返回的字符串}.${图片后缀}`。
                   */
                  sizeSuffix( width, height ){
                    return ``;
                  },
                  /**
                   * 1、详细选项可见：https://sharp.pixelplumbing.com/api-output，里面有：9种配置（jpeg、png、webp、gif、jp2、tiff、avif、heif、raw）。<br />
                   * 2、直到20220818，sharp v0.30.7、vips-dev-w64-all-8.12.2，转换heic、heif还是会报错。<br />
                   */
                  encodeOptions: {
                    // jpeg
                    ...( () => {
                      const config = {
                        // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                        quality: 80,
                        // 使用逐行（隔行）扫描，值类型：boolean，默认值：false，可选。
                        progressive: false,
                        // 色度二次采样，值类型：string，默认值：'4:2:0'（色度二次采样），设置为'4:4:4'以防止色度二次采样，可选。
                        chromaSubsampling: '4:4:4',
                        // 优化霍夫曼编码表，值类型：boolean，默认值：true，可选。
                        optimiseCoding: true,
                        // optimiseCoding的替代拼写，值类型：boolean，默认值：true，可选。
                        optimizeCoding: true,
                        /**
                         * 1、是否使用mozjpeg压缩优化。
                         * 2、值类型：boolean，默认值：false，可选。<br />
                         * 3、设置为true（相当于使用mozjpeg默认值，相当于{ trellisQuantisation: true, overshootDeringing: true, optimiseScans: true, quantisationTable: 3 }），表示使用mozjpeg压缩优化JPEG文件大小，会耗时，较慢。<br />
                         * 4、设置为false，表示禁用mozjpeg压缩优化，不耗时。<br />
                         */
                        mozjpeg: true,
                        // 应用网格量化，值类型：boolean，默认值：false，可选。
                        trellisQuantisation: false,
                        // 应用过冲去环，值类型：boolean，默认值：false，可选。
                        overshootDeringing: false,
                        // 优化逐行扫描，强制逐行扫描，值类型：boolean，默认值：false，可选。
                        optimiseScans: false,
                        // optimiseScans的替代拼写，值类型：boolean，默认值：false，可选。
                        optimizeScans: false,
                        // 要使用的量化表，值类型：number，默认值：0，值范围：0-8，可选。
                        quantisationTable: 0,
                        // quantisationTable的替代拼写，值类型：number，默认值：0，值范围：0-8，可选。
                        quantizationTable: 0,
                        // 强制JPEG输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                        force: true,
                      };

                      return {
                        jpe: config,
                        jpeg: config,
                        jpg: config,
                      };
                    } )(),
                    png: {
                      // 使用逐行（隔行）扫描，值类型：boolean，默认值：false，可选。
                      progressive: false,
                      // zlib压缩级别，值类型：number，默认值：6，值范围：0（压缩速度最快，图片大小最大）-9（压缩速度最慢，图片大小最小），可选。
                      compressionLevel: 6,
                      // 使用自适应行过滤，值类型：boolean，默认值：false，可选。
                      adaptiveFiltering: false,
                      // 量化为具有Alpha透明度支持的基于调色板的图像，值类型：boolean，默认值：false，启用后压缩优化会较慢，可选。
                      palette: true,
                      // 使用达到给定质量所需的最少颜色数量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：100，可选。
                      quality: 100,
                      // CPU工作量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：7，值范围：1（最快）-10（最慢），可选。
                      effort: 7,
                      // 调色板条目的最大数量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：256，可选。
                      colours: 256,
                      // colours的替代拼写，需要将palette设置为true才可以应用该选项，值类型：number，默认值：256，可选。
                      colors: 256,
                      // Floyd-Steinberg误差扩散级别，需要将palette设置为true才可以应用该选项，值类型：number，默认值：1.0，可选。
                      dither: 1.0,
                      // 强制PNG输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                      force: true,
                    },
                    webp: {
                      // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                      quality: 80,
                      // alpha层的质量，值类型：number，默认值：100，值范围：0-100，可选。
                      alphaQuality: 100,
                      // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                      lossless: false,
                      // 使用near_lossless（接近无损的）压缩模式，值类型：boolean，默认值：false，可选。
                      nearLossless: false,
                      // 使用高质量的色度二次采样，值类型：boolean，默认值：false，可选。
                      smartSubsample: false,
                      // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-6（最慢），可选。
                      effort: 4,
                      // 动画迭代次数，使用0表示无限动画，值类型：number，默认值：0，可选。
                      loop: 0,
                      // 动画帧之间的延迟（以毫秒为单位），值类型：number、[ number ]，无默认值，可选。
                      // delay: 1,
                      // 强制WebP输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                      force: true,
                    },
                    gif: {
                      // 调色板条目的最大数量，包括透明度，值类型：number，默认值：256，值范围：2-256，可选。
                      colours: 256,
                      // colours的替代拼写，值类型：number，默认值：256，值范围：2-256，可选。
                      colors: 256,
                      // CPU工作量，值类型：number，默认值：7，值范围：1（最快）-10（最慢），可选。
                      effort: 7,
                      // Floyd-Steinberg误差扩散级别，值类型：number，默认值：1.0，值范围：0（最小）-1（最大），可选。
                      dither: 1.0,
                      // 动画迭代次数，使用0表示无限动画，值类型：number，默认值：0，可选。
                      loop: 0,
                      // 动画帧之间的延迟（以毫秒为单位），值类型：number、[ number ]，无默认值，可选。
                      // delay: 1,
                      // 强制GIF输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                      force: true,
                    },
                    jp2: {
                      // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                      quality: 80,
                      // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                      lossless: false,
                      // 水平tile尺寸，值类型：number，默认值：512，可选。
                      tileWidth: 512,
                      // 垂直tile尺寸，值类型：number，默认值：512，可选。
                      tileHeight: 512,
                      // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。
                      chromaSubsampling: '4:4:4',
                    },
                    // tif
                    ...( () => {
                      const config = {
                        // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                        quality: 80,
                        // 强制TIFF输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                        force: true,
                        // 压缩选项，值类型：string，默认值：'jpeg'，有效值：'lzw'、'deflate'、'jpeg'、'ccittfax4'，可选。
                        compression: 'jpeg',
                        // 压缩预测器选项，值类型：string，默认值：'horizontal'，有效值：'none'、'horizontal'、'float'，可选。
                        predictor: 'horizontal',
                        // 写一个图像pyramid，值类型：boolean，默认值：false，可选。
                        pyramid: false,
                        // 写一个tiled tiff，值类型：boolean，默认值：false，可选。
                        tile: false,
                        // 水平tile尺寸，值类型：number，默认值：256，可选。
                        tileWidth: 256,
                        // 垂直tile尺寸，值类型：number，默认值：256，可选。
                        tileHeight: 256,
                        // 水平分辨率，像素（pixels）/毫米（mm），值类型：number，默认值：1.0，可选。
                        xres: 1.0,
                        // 垂直分辨率，像素（pixels）/毫米（mm），值类型：number，默认值：1.0，可选。
                        yres: 1.0,
                        // 分辨率单位选项，值类型：string，默认值：'inch'，有效值：'inch'、'cm'，可选。
                        resolutionUnit: 'inch',
                        // 将位深度减少到1、2、4bit，值类型：number，默认值：8，可选。
                        bitdepth: 8,
                      };

                      return {
                        tif: config,
                        tiff: config,
                      };
                    } )(),
                    // 使用这些AVIF选项输出图像。虽然可以创建小于16x16像素的AVIF图像，但大多数Web浏览器（火狐浏览器支持的）无法正确显示这些图像。不支持AVIF图像序列。
                    avif: {
                      // 质量，值类型：number，默认值：50，值范围：1-100，可选。
                      quality: 50,
                      // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                      lossless: false,
                      // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-9（最慢），可选。
                      effort: 4,
                      // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。
                      chromaSubsampling: '4:4:4',
                    },
                    // heic，直到20220818，sharp v0.30.7、vips-dev-w64-all-8.12.2，转换heic、heif还是会报错。
                    ...( () => {
                      const config = {
                        // 质量，值类型：number，默认值：50，值范围：1-100，可选。
                        quality: 50,
                        // 压缩格式，值类型：string，默认值：'av1'，有效值：'av1'、'hevc'，可选。
                        compression: 'av1',
                        // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                        lossless: false,
                        // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-9（最慢），可选。
                        effort: 4,
                        // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。
                        chromaSubsampling: '4:4:4',
                      };

                      return {
                        heic: config,
                        heif: config,
                      };
                    } )(),
                    // 强制输出为原始的、未压缩的像素数据。像素排序是从左到右，从上到下，没有填充。对于非灰度色彩空间，通道排序将是RGB或RGBA。
                    raw: {
                      // bit（位）深，值类型：string，默认值：'uchar'，有效值：'char'、'uchar'（默认值）、'short'、'ushort'、'int'、'uint'、'float'、'complex'、'double'、'dpcomplex'，可选。
                      depth: 'uchar',
                    },
                  },
                },
              },
              /**
               * 目前支持从其他格式生成avif、gif、jp2、jpe、jpeg、jpg、png、raw、tif、tiff、webp格式的图片。<br />
               * 1、如果要处理的图片地址中没有这样的查询参数：“?as=webp”、“?as=avif”等等，就会使用上面的“minimizer”选项进行图片优化。<br />
               * 2、当“loader”选项被设置为false时，该选项也不工作了。<br />
               */
              generator: [
                // jpe、jpeg、jpg
                ...( arr => {
                  return arr.map( item => {
                    return {
                      implementation: ImageMinimizerPlugin.sharpGenerate,
                      filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                      filter( source, sourcePath ){
                        if( Number( source.byteLength ) > 10 * 1024 ){
                          return true;
                        }
                        else{
                          return false;
                        }
                      },
                      /**
                       * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                       */
                      preset: item,
                      /**
                       * 1、该选项有效值有：<br />
                       * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                       * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                       */
                      type: 'import',
                      /**
                       * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                       */
                      options: {
                        encodeOptions: {
                          [ item ]: {
                            // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                            quality: 80,
                            // 使用逐行（隔行）扫描，值类型：boolean，默认值：false，可选。
                            progressive: false,
                            // 色度二次采样，值类型：string，默认值：'4:2:0'（色度二次采样），设置为'4:4:4'以防止色度二次采样，可选。
                            chromaSubsampling: '4:4:4',
                            // 优化霍夫曼编码表，值类型：boolean，默认值：true，可选。
                            optimiseCoding: true,
                            // optimiseCoding的替代拼写，值类型：boolean，默认值：true，可选。
                            optimizeCoding: true,
                            /**
                             * 1、是否使用mozjpeg压缩优化。
                             * 2、值类型：boolean，默认值：false，可选。<br />
                             * 3、设置为true（相当于使用mozjpeg默认值，相当于{ trellisQuantisation: true, overshootDeringing: true, optimiseScans: true, quantisationTable: 3 }），表示使用mozjpeg压缩优化JPEG文件大小，会耗时，较慢。<br />
                             * 4、设置为false，表示禁用mozjpeg压缩优化，不耗时。<br />
                             */
                            mozjpeg: true,
                            // 应用网格量化，值类型：boolean，默认值：false，可选。
                            trellisQuantisation: false,
                            // 应用过冲去环，值类型：boolean，默认值：false，可选。
                            overshootDeringing: false,
                            // 优化逐行扫描，强制逐行扫描，值类型：boolean，默认值：false，可选。
                            optimiseScans: false,
                            // optimiseScans的替代拼写，值类型：boolean，默认值：false，可选。
                            optimizeScans: false,
                            // 要使用的量化表，值类型：number，默认值：0，值范围：0-8，可选。
                            quantisationTable: 0,
                            // quantisationTable的替代拼写，值类型：number，默认值：0，值范围：0-8，可选。
                            quantizationTable: 0,
                            // 强制JPEG输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                            force: true,
                          },
                        },
                      },
                    };
                  } );
                } )( [
                  'jpe',
                  'jpeg',
                  'jpg',
                ] ),
                // png
                {
                  implementation: ImageMinimizerPlugin.sharpGenerate,
                  filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                  filter( source, sourcePath ){
                    if( Number( source.byteLength ) > 10 * 1024 ){
                      return true;
                    }
                    else{
                      return false;
                    }
                  },
                  /**
                   * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                   */
                  preset: 'png',
                  /**
                   * 1、该选项有效值有：<br />
                   * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                   * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                   */
                  type: 'import',
                  /**
                   * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                   */
                  options: {
                    encodeOptions: {
                      png: {
                        // 使用逐行（隔行）扫描，值类型：boolean，默认值：false，可选。
                        progressive: false,
                        // zlib压缩级别，值类型：number，默认值：6，值范围：0（压缩速度最快，图片大小最大）-9（压缩速度最慢，图片大小最小），可选。
                        compressionLevel: 6,
                        // 使用自适应行过滤，值类型：boolean，默认值：false，可选。
                        adaptiveFiltering: false,
                        // 量化为具有Alpha透明度支持的基于调色板的图像，值类型：boolean，默认值：false，启用后压缩优化会较慢，可选。
                        palette: true,
                        // 使用达到给定质量所需的最少颜色数量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：100，可选。
                        quality: 100,
                        // CPU工作量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：7，值范围：1（最快）-10（最慢），可选。
                        effort: 7,
                        // 调色板条目的最大数量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：256，可选。
                        colours: 256,
                        // colours的替代拼写，需要将palette设置为true才可以应用该选项，值类型：number，默认值：256，可选。
                        colors: 256,
                        // Floyd-Steinberg误差扩散级别，需要将palette设置为true才可以应用该选项，值类型：number，默认值：1.0，可选。
                        dither: 1.0,
                        // 强制PNG输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                        force: true,
                      },
                    },
                  },
                },
                // webp
                {
                  implementation: ImageMinimizerPlugin.sharpGenerate,
                  filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                  filter( source, sourcePath ){
                    if( Number( source.byteLength ) > 10 * 1024 ){
                      return true;
                    }
                    else{
                      return false;
                    }
                  },
                  /**
                   * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                   */
                  preset: 'webp',
                  /**
                   * 1、该选项有效值有：<br />
                   * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                   * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                   */
                  type: 'import',
                  /**
                   * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                   */
                  options: {
                    encodeOptions: {
                      webp: {
                        // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                        quality: 80,
                        // alpha层的质量，值类型：number，默认值：100，值范围：0-100，可选。
                        alphaQuality: 100,
                        // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                        lossless: false,
                        // 使用near_lossless（接近无损的）压缩模式，值类型：boolean，默认值：false，可选。
                        nearLossless: false,
                        // 使用高质量的色度二次采样，值类型：boolean，默认值：false，可选。
                        smartSubsample: false,
                        // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-6（最慢），可选。
                        effort: 4,
                        // 动画迭代次数，使用0表示无限动画，值类型：number，默认值：0，可选。
                        loop: 0,
                        // 动画帧之间的延迟（以毫秒为单位），值类型：number、[ number ]，无默认值，可选。
                        // delay: 1,
                        // 强制WebP输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                        force: true,
                      },
                    },
                  },
                },
                // gif
                {
                  implementation: ImageMinimizerPlugin.sharpGenerate,
                  filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                  filter( source, sourcePath ){
                    if( Number( source.byteLength ) > 10 * 1024 ){
                      return true;
                    }
                    else{
                      return false;
                    }
                  },
                  /**
                   * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                   */
                  preset: 'gif',
                  /**
                   * 1、该选项有效值有：<br />
                   * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                   * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                   */
                  type: 'import',
                  /**
                   * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                   */
                  options: {
                    encodeOptions: {
                      gif: {
                        // 调色板条目的最大数量，包括透明度，值类型：number，默认值：256，值范围：2-256，可选。
                        colours: 256,
                        // colours的替代拼写，值类型：number，默认值：256，值范围：2-256，可选。
                        colors: 256,
                        // CPU工作量，值类型：number，默认值：7，值范围：1（最快）-10（最慢），可选。
                        effort: 7,
                        // Floyd-Steinberg误差扩散级别，值类型：number，默认值：1.0，值范围：0（最小）-1（最大），可选。
                        dither: 1.0,
                        // 动画迭代次数，使用0表示无限动画，值类型：number，默认值：0，可选。
                        loop: 0,
                        // 动画帧之间的延迟（以毫秒为单位），值类型：number、[ number ]，无默认值，可选。
                        // delay: 1,
                        // 强制GIF输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                        force: true,
                      },
                    },
                  },
                },
                // jp2
                {
                  implementation: ImageMinimizerPlugin.sharpGenerate,
                  filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                  filter( source, sourcePath ){
                    if( Number( source.byteLength ) > 10 * 1024 ){
                      return true;
                    }
                    else{
                      return false;
                    }
                  },
                  /**
                   * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                   */
                  preset: 'jp2',
                  /**
                   * 1、该选项有效值有：<br />
                   * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                   * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                   */
                  type: 'import',
                  /**
                   * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                   */
                  options: {
                    encodeOptions: {
                      jp2: {
                        // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                        quality: 80,
                        // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                        lossless: false,
                        // 水平tile尺寸，值类型：number，默认值：512，可选。
                        tileWidth: 512,
                        // 垂直tile尺寸，值类型：number，默认值：512，可选。
                        tileHeight: 512,
                        // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。
                        chromaSubsampling: '4:4:4',
                      },
                    },
                  },
                },
                // tif、tiff
                ...( arr => {
                  return arr.map( item => {
                    return {
                      implementation: ImageMinimizerPlugin.sharpGenerate,
                      filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                      filter( source, sourcePath ){
                        if( Number( source.byteLength ) > 10 * 1024 ){
                          return true;
                        }
                        else{
                          return false;
                        }
                      },
                      /**
                       * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                       */
                      preset: item,
                      /**
                       * 1、该选项有效值有：<br />
                       * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                       * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                       */
                      type: 'import',
                      /**
                       * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                       */
                      options: {
                        encodeOptions: {
                          [ item ]: {
                            // 质量，值类型：number，默认值：80，值范围：1-100，可选。
                            quality: 80,
                            // 强制TIFF输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
                            force: true,
                            // 压缩选项，值类型：string，默认值：'jpeg'，有效值：'lzw'、'deflate'、'jpeg'、'ccittfax4'，可选。
                            compression: 'jpeg',
                            // 压缩预测器选项，值类型：string，默认值：'horizontal'，有效值：'none'、'horizontal'、'float'，可选。
                            predictor: 'horizontal',
                            // 写一个图像pyramid，值类型：boolean，默认值：false，可选。
                            pyramid: false,
                            // 写一个tiled tiff，值类型：boolean，默认值：false，可选。
                            tile: false,
                            // 水平tile尺寸，值类型：number，默认值：256，可选。
                            tileWidth: 256,
                            // 垂直tile尺寸，值类型：number，默认值：256，可选。
                            tileHeight: 256,
                            // 水平分辨率，像素（pixels）/毫米（mm），值类型：number，默认值：1.0，可选。
                            xres: 1.0,
                            // 垂直分辨率，像素（pixels）/毫米（mm），值类型：number，默认值：1.0，可选。
                            yres: 1.0,
                            // 分辨率单位选项，值类型：string，默认值：'inch'，有效值：'inch'、'cm'，可选。
                            resolutionUnit: 'inch',
                            // 将位深度减少到1、2、4bit，值类型：number，默认值：8，可选。
                            bitdepth: 8,
                          },
                        },
                      },
                    };
                  } );
                } )( [
                  'tif',
                  'tiff',
                ] ),
                // avif
                {
                  implementation: ImageMinimizerPlugin.sharpGenerate,
                  filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                  filter( source, sourcePath ){
                    if( Number( source.byteLength ) > 10 * 1024 ){
                      return true;
                    }
                    else{
                      return false;
                    }
                  },
                  /**
                   * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                   */
                  preset: 'avif',
                  /**
                   * 1、该选项有效值有：<br />
                   * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                   * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                   */
                  type: 'import',
                  /**
                   * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                   */
                  options: {
                    encodeOptions: {
                      avif: {
                        // 质量，值类型：number，默认值：50，值范围：1-100，可选。
                        quality: 50,
                        // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                        lossless: false,
                        // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-9（最慢），可选。
                        effort: 4,
                        // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。
                        chromaSubsampling: '4:4:4',
                      },
                    },
                  },
                },
                // heic、heif
                ...( arr => {
                  return arr.map( item => {
                    return {
                      implementation: ImageMinimizerPlugin.sharpGenerate,
                      filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                      filter( source, sourcePath ){
                        if( Number( source.byteLength ) > 10 * 1024 ){
                          return true;
                        }
                        else{
                          return false;
                        }
                      },
                      /**
                       * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                       */
                      preset: item,
                      /**
                       * 1、该选项有效值有：<br />
                       * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                       * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                       */
                      type: 'import',
                      /**
                       * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                       */
                      options: {
                        encodeOptions: {
                          [ item ]: {
                            // 质量，值类型：number，默认值：50，值范围：1-100，可选。
                            quality: 50,
                            // 压缩格式，值类型：string，默认值：'av1'，有效值：'av1'、'hevc'，可选。
                            compression: 'av1',
                            // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
                            lossless: false,
                            // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-9（最慢），可选。
                            effort: 4,
                            // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。
                            chromaSubsampling: '4:4:4',
                          },
                        },
                      },
                    };
                  } );
                } )( [
                  'heic',
                  'heif',
                ] ),
                // raw
                {
                  implementation: ImageMinimizerPlugin.sharpGenerate,
                  filename: 'img/[name]_optimize_sharp_[width]_[height][ext]',
                  filter( source, sourcePath ){
                    if( Number( source.byteLength ) > 10 * 1024 ){
                      return true;
                    }
                    else{
                      return false;
                    }
                  },
                  /**
                   * 1、若值为'webp-100-100'，那么在查询参数中的使用方法为'?as=webp-100-100'。<br />
                   */
                  preset: 'raw',
                  /**
                   * 1、该选项有效值有：<br />
                   * import：表示生成器在“import”、“require”语法中使用，也是默认值。<br />
                   * asset：表示生成器在其他资源编译中也可用，比如，拷贝插件等等。<br />
                   */
                  type: 'import',
                  /**
                   * 这里的“options”选项同上面“minimizer”选项里的“options”选项，那里有的选项都可以在这里用。<br />
                   */
                  options: {
                    encodeOptions: {
                      raw: {
                        // bit（位）深，值类型：string，默认值：'uchar'，有效值：'char'、'uchar'（默认值）、'short'、'ushort'、'int'、'uint'、'float'、'complex'、'double'、'dpcomplex'，可选。
                        depth: 'uchar',
                      },
                    },
                  },
                },
              ],
            } ),
          };

          return isEnable
                 ? [
              // svgoMinify只用于处理svg。
              configs[ 'svgoMinify' ],
              // sharpMinify只用于处理avif、gif、jp2、jpe、jpeg、jpg、png、raw、tif、tiff、webp。
              configs[ 'sharpMinify' ],
            ]
                 : [];
        } )( true ),
      ],
      /**
       * 1、生产环境，默认值为：'deterministic'。<br />
       * 2、当optimization.moduleIds设置为'deterministic'时，使用的最小长度为3位。要覆盖默认行为，请将optimization.moduleIds设置为false并使用webpack.ids.DeterministicModuleIdsPlugin。<br />
       */
      moduleIds: false,
      nodeEnv: 'production',
      /**
       * 1、optimization.portableRecords告诉webpack生成具有相对路径的记录，以便能够移动上下文文件夹。<br />
       * 2、默认情况下optimization.portableRecords被禁用。如果向webpack配置提供了至少一个记录选项，则自动启用：recordsPath、recordsInputPath、recordsOutputPath。<br />
       */
      portableRecords: true,
      // 告诉webpack找出模块提供了哪些导出，以便为export * from ...生成更有效的代码。默认情况下optimization.providedExports是启用的。
      providedExports: true,
      // 在处理资产后添加额外的哈希编译通道以获得正确的资产内容哈希。如果realContentHash设置为false，则内部数据用于计算哈希，并且当资产相同时它可以更改。
      realContentHash: true,
      /**
       * 1、当这些模块已经包含在所有父级中时，告诉webpack从块中检测和删除模块。将optimization.removeAvailableModules设置为true将启用此优化。在生产模式下默认启用。<br />
       * 2、optimization.removeAvailableModules会降低webpack的性能，并且在下一个主要版本中默认在生产模式下禁用。如果您想要额外的构建性能，请在生产模式下禁用它。<br />
       */
      removeAvailableModules: true,
      // 告诉webpack检测并删除空的块。将optimization.removeEmptyChunks设置为false将禁用此优化。
      removeEmptyChunks: true,
      runtimeChunk: {
        name: ( { name } ) => `RuntimeChunk_${ name }`,
      },
      // optimization.sideEffects依赖optimization.providedExports。前者的启用依赖后者的启用。
      sideEffects: true,
      /**
       * optimization.usedExports依赖optimization.providedExports。前者的启用依赖后者的启用。
       * 1、“optimization.usedExports”不能与cacheUnaffected一起使用，因为导出使用是一种全局影响。<br />
       */
      usedExports: true,
      splitChunks: splitChunksConfig,
    }
                       : {
      // 开发环境，默认值为：'named'。
      chunkIds: 'named',
      // 生产模式下启用，否则禁用。也依赖optimization.providedExports和optimization.usedExports。
      // concatenateModules: false,
      /**
       * 1、编译时出现错误时，使用optimization.emitOnErrors发出资产。这可确保发出错误资产。严重错误会发送到生成的代码中，并会在运行时导致错误。<br />
       * 2、如果您使用的是webpack CLI，则启用此插件时webpack进程将不会退出并显示错误代码。如果您希望webpack在使用CLI时“失败”，请查看bail选项。<br />
       */
      emitOnErrors: true,
      // 默认情况下optimization.flagIncludedChunks在生产模式下启用，否则禁用。
      // flagIncludedChunks: false,
      // 默认情况下optimization.mangleExports: 'deterministic'在生产模式下启用，否则禁用。
      // mangleExports: false,
      // 当设置为true时，告诉webpack通过将导入更改为更短的字符串来减小WASM的大小。它破坏了模块和导出名称。
      mangleWasmImports: false,
      // 告诉webpack合并包含相同模块的块。将optimization.mergeDuplicateChunks设置为false将禁用此优化。
      mergeDuplicateChunks: true,
      minimize: false,
      // 开发环境，默认值为：'named'。
      moduleIds: 'named',
      nodeEnv: 'development',
      /**
       * 1、optimization.portableRecords告诉webpack生成具有相对路径的记录，以便能够移动上下文文件夹。<br />
       * 2、默认情况下optimization.portableRecords被禁用。如果向webpack配置提供了至少一个记录选项，则自动启用：recordsPath、recordsInputPath、recordsOutputPath。<br />
       */
      portableRecords: true,
      // 告诉webpack找出模块提供了哪些导出，以便为export * from ...生成更有效的代码。默认情况下optimization.providedExports是启用的。
      providedExports: true,
      // 在处理资产后添加额外的哈希编译通道以获得正确的资产内容哈希。如果realContentHash设置为false，则内部数据用于计算哈希，并且当资产相同时它可以更改。
      realContentHash: true,
      /**
       * 1、当这些模块已经包含在所有父级中时，告诉webpack从块中检测和删除模块。将optimization.removeAvailableModules设置为true将启用此优化。在生产模式下默认启用。<br />
       * 2、optimization.removeAvailableModules会降低webpack的性能，并且在下一个主要版本中默认在生产模式下禁用。如果您想要额外的构建性能，请在生产模式下禁用它。<br />
       */
      removeAvailableModules: false,
      // 告诉webpack检测并删除空的块。将optimization.removeEmptyChunks设置为false将禁用此优化。
      removeEmptyChunks: true,
      runtimeChunk: {
        name: ( { name } ) => `RuntimeChunk_${ name }`,
      },
      // optimization.sideEffects依赖optimization.providedExports。前者的启用依赖后者的启用。
      sideEffects: true,
      /**
       * optimization.usedExports依赖optimization.providedExports。前者的启用依赖后者的启用。
       * 1、“optimization.usedExports”不能与cacheUnaffected一起使用，因为导出使用是一种全局影响。<br />
       */
      usedExports: true,
      splitChunks: splitChunksConfig,
    },
  /**
   * @type {object}
   */
  outputConfig = {
    /**
     * 与output.filename相同，但用于资产模块。<br />
     * 注意：<br />
     * 1、当从第3方包（如：npm包）中导入文件时，如果该文件还包含其他类型的文件，如果在已有loader配置中能找到该其他类型文件对应的loader，那么就会使用该loader来加载这个其他类型文件，否则会报错，提示需要对应的loader来处理。<br />
     * 2、对上述第1点列出1个案例来进一步说明该注意事项：在某个js文件中引入element-ui的css文件，而且该css文件中还引用了字体文件，但是在处理字体的loader中没有包含该字体文件所在的文件夹。<br />
     * 然而依然还是能处理该字体文件的，但是对其所有的处理后的输出路径等配置都不是由对应loader下的配置决定的，而是由全局配置中的module.generator、module.parser、output.assetModuleFilename决定的。<br />
     * 而且应用配置的优先级为：module.generator[ 'asset/resource' ]的配置 > module.generator[ 'asset' ]的配置 > output.assetModuleFilename的配置 > 具体loader中设置的generator选项里的各个选项。<br />
     * 要想避免这种情况的出现，可以手动将对应文件夹加入到对应loader的处理文件夹中，这样那些文件都会应用loader里的配置，如：输出配置等等。<br />
     */
    assetModuleFilename( pathData, assetInfo ){
      return 'assets/[name]_[contenthash][ext]';
    },
    /**
     * 创建异步块，按需加载。
     */
    // asyncChunks: true,
    /**
     * 告诉webpack将charset="utf-8"添加到HTML的<script>标签。<br />
     * 提示：<br />
     * 1、虽然<script>标签的charset属性已被废弃，但webpack仍然默认添加它，以兼容非现代的浏览器。<br />
     */
    charset: false,
    /**
     * 此选项确定非初始块文件的名称。如，那些动态导入的JS文件。<br />
     * 1、请注意，这些文件名需要在运行时生成以发送对块的请求。<br />
     * 2、关于该选项配合处理worker文件的说明：<br />
     * 强烈建议在new Worker()的时候，给构造函数的第二个参数设置这样的参数：{ name: 'Worker文件名.worker', }，这样设置之后，就可以把worker文件打包到“workers”这个文件夹内。<br />
     * 且打包后的完整文件名加扩展名为“Worker文件名_[contenthash].worker.js”。<br />
     */
    chunkFilename( pathData, assetInfo ){
      let name = pathData?.chunk?.name,
        id = pathData?.chunk?.id;

      if( name !== undefined && name !== null && String( name ).includes( '.worker' ) ){
        return `workers/${ String( name ).split( '.worker' )[ 0 ] }_[contenthash].worker.js`;
      }

      if(
        !isProduction
        && ( name === undefined || name === null )
        && id !== undefined
        && id !== null
        && ( String( id ).endsWith( '_worker_js' ) || String( id ).endsWith( '_worker_ts' ) )
      ){
        return `workers/[name]_[contenthash].worker.js`;
      }

      return `js/[name]_Chunk_[contenthash].js`;
    },
    /**
     * 指定磁盘上的初始输出css文件的文件名模板。<br />
     * 1、你必须不在这里指定一个绝对路径，但路径可以包含由'/'分隔的文件夹。<br />
     * 2、指定的路径与'output.path'选项的值联合起来，以确定磁盘上的位置。<br />
     */
    cssFilename( pathData, assetInfo ){
      return 'styles/[name]_Bundle_[contenthash].css';
    },
    /**
     * 指定磁盘上的非初始输出css文件的文件名模板。<br />
     * 1、你必须不在这里指定一个绝对路径，但路径可以包含由'/'分隔的文件夹。<br />
     * 2、指定的路径与'output.path'选项的值联合起来，以确定磁盘上的位置。<br />
     */
    cssChunkFilename( pathData, assetInfo ){
      return 'styles/[name]_Chunk_[contenthash].css';
    },
    /**
     * 块的格式，默认块的格式包括：'array-push'(web/WebWorker)、'commonjs'(node.js)、'module'(ESM)，但其他格式可能由插件添加。<br />
     * 1、这个选项的默认值取决于目标和output.module设置。<br />
     */
    chunkFormat: 'array-push',
    /**
     * 块请求过期前的毫秒数。从webpack 2.6.0开始支持此选项。<br />
     */
    chunkLoadTimeout: 120000,
    /**
     * 全局变量被webpack用于加载chunks。<br />
     */
    chunkLoadingGlobal: 'WebpackGlobal',
    /**
     * 加载块的方法，默认包括的方法：'jsonp'（web）、'import'（ESM）、'import-scripts'（WebWorker）、'require'（同步node.js）、'async-node'（异步node.js），但其他可能由插件添加。<br />
     * 1、这个选项的默认值取决于目标和chunkFormat设置。<br />
     */
    chunkLoading: 'jsonp',
    /**
     * 在发出之前清理输出目录，不要用这个选项，用clean-webpack-plugin插件，因为用这个选项，无法设置排除项（后来可以了，通过设置对象类型的值，就可以进一步细化该选项的配置了）。<br />
     * 1、5.20.0+新增的选项。<br />
     * 2、该选项除了有一个boolean类型的选项值，还有一个对象类型的选项值，详细见：node_modules/webpack/schemas/WebpackOptions.json:310<br />
     */
    clean: false,
    /**
     * 告诉webpack在写入输出文件系统之前检查要发出的文件是否已经存在并且具有相同的内容。<br />
     * 1、当磁盘上已经存在具有相同内容的文件时，webpack将不会写入输出文件。<br />
     * 2、设置成false可以强制替换同名的文件。<br />
     */
    compareBeforeEmit: false,
    /**
     * 告诉webpack启用块的跨域加载。仅在目标设置为“web”时生效，它使用JSONP通过添加脚本标签来加载按需块。<br />
     * 1、选项值有：<br />
     * false：表示禁用。<br />
     * 'anonymous'：启用跨源加载，不需要凭证。<br />
     * 'use-credentials'：启用有证书的跨源加载。<br />
     */
    crossOriginLoading: 'anonymous',
    /**
     * 启用入口点使用的wasm装载类型列表。
     * 该配置项有效值见：node_modules/webpack/lib/wasm/EnableWasmLoadingPlugin.js:78
     */
    enabledWasmLoadingTypes: [
      'fetch',
      'async-node',
      'universal',
    ],
    /**
     * 告诉webpack在生成的运行时代码中可以使用哪种ES特性。<br />
     */
    environment: {
      /**
       * The environment supports arrow functions ('() => { ... }').<br />
       */
      arrowFunction: true,
      /**
       * The environment supports async function and await ('async function () { await ... }').<br />
       */
      asyncFunction: false,
      /**
       * The environment supports BigInt as literal (123n).<br />
       */
      bigIntLiteral: false,
      /**
       * The environment supports const and let for variable declarations.<br />
       */
      const: true,
      /**
       * The environment supports destructuring ('{ a, b } = obj').<br />
       */
      destructuring: true,
      /**
       * The environment supports an async import() function to import EcmaScript modules.<br />
       */
      dynamicImport: true,
      /**
       * The environment supports an async import() is available when creating a worker.<br />
       */
      dynamicImportInWorker: true,
      /**
       * The environment supports 'for of' iteration ('for (const x of array) { ... }').<br />
       */
      forOf: true,
      /**
       * The environment supports 'globalThis'.<br />
       */
      globalThis: false,
      /**
       * The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').<br />
       */
      module: true,
      /**
       * The environment supports optional chaining ('obj?.a' or 'obj?.()').<br />
       */
      optionalChaining: false,
      /**
       * The environment supports template literals.<br />
       */
      templateLiteral: true,
    },
    /**
     * 此选项确定每个输出包的名称。捆绑包被写入output.path选项指定的目录。<br />
     * 1、对于单个入口点，这可以是静态名称。<br />
     * 2、请注意，此选项不会影响按需加载块的输出文件。它只影响最初加载的输出文件。<br />
     * 3、对于按需加载的块文件，使用output.chunkFilename选项。加载程序创建的文件也不受影响。在这种情况下，您必须尝试特定加载程序的可用选项。<br />
     * 4、关于该选项配合处理worker文件的说明：<br />
     * 强烈建议在new Worker()的时候，给构造函数的第二个参数设置这样的参数：{ name: 'Worker文件名.worker', }，这样设置之后，就可以把worker文件打包到“workers”这个文件夹内。<br />
     * 且打包后的完整文件名加扩展名为“Worker文件名_[contenthash].worker.js”。<br />
     */
    filename( pathData, assetInfo ){
      let name = pathData?.chunk?.name,
        id = pathData?.chunk?.id;

      if( name !== undefined && name !== null && String( name ).includes( '.worker' ) ){
        return `workers/${ String( name ).split( '.worker' )[ 0 ] }_[contenthash].worker.js`;
      }

      if(
        !isProduction
        && ( name === undefined || name === null )
        && id !== undefined
        && id !== null
        && ( String( id ).endsWith( '_worker_js' ) || String( id ).endsWith( '_worker_ts' ) )
      ){
        return `workers/[name]_[contenthash].worker.js`;
      }

      return 'js/[name]_Bundle_[contenthash].js';
    },
    hashDigest: 'hex',
    /**
     * 对于webpack v5.65.0+，当启用experiments.futureDefaults时，16将用作hashDigestLength选项的默认值。<br />
     */
    hashDigestLength: 16,
    /**
     * 从webpack v5.54.0+开始，hashFunction支持xxhash64作为一种更快的算法，在启用experiments.futureDefaults时将默认使用该算法。<br />
     */
    hashFunction: 'sha512',
    /**
     * 忽略浏览器中的警告。
     */
    ignoreBrowserWarnings: false,
    /**
     * 告诉webpack在发出的代码周围添加IIFE包装器。<br />
     */
    iife: true,
    /**
     * 将JavaScript文件输出为模块类型。默认情况下禁用，因为它是一项实验性功能。<br />
     * 1、启用后，webpack会在内部将output.iife设置为false，将output.scriptType设置为'module'，并将terserOptions.module设置为true。<br />
     * 2、如果您正在使用webpack编译一个库以供其他人使用，请确保在output.module为true时将output.libraryTarget设置为'module'。<br />
     * 3、output.module是一项实验性功能，只能通过将experiments.outputModule设置为true来启用。<br />
     */
    module: false,
    /**
     * 输出目录为绝对路径。<br />
     * 1、注意这个参数中的[fullhash]将被替换为编译的哈希值。有关详细信息，请参阅缓存指南（https://webpack.js.org/guides/caching/）。<br />
     */
    path: resolve( __dirname, `./dist/${ env_platform }/` ),
    /**
     * 告诉webpack在bundle中包含关于所包含模块的信息的注释。<br />
     * 1、此选项在开发模式下默认为true，在生产模式下默认为false。 “verbose”显示更多信息，如导出、运行时要求和救助。<br />
     * 2、虽然这些注释可以提供的数据在开发过程中阅读生成的代码时很有用，但不应在生产中使用。<br />
     * 3、它还向生成的包添加了一些关于摇树的信息。<br />
     */
    pathinfo: isProduction
              ? false
              : 'verbose',
    /**
     * 当使用按需加载或加载图像、文件等外部资源时，这是一个重要的选项。如果指定的值不正确，您将在加载这些资源时收到404错误。<br />
     * 1、如：编译的资源都输出在dist/production下的各种一级文件夹(里面没有其他文件夹了)下，所以'../'就是向上一级，也就是定位到了根目录(dist/production)下了。<br />
     * 2、也可以指定绝对路径：'http://localhost:8081/WebProTpl/dist/production/'，一般用于正式生产环境。<br />
     * 3、此选项指定在浏览器中引用时输出目录的公共URL。相对URL是相对于HTML页面（或<base>标记）解析的。服务器相对URL、协议相对URL或绝对URL也是可能的，有时是必须的，即，如，在CDN上托管资产时。<br />
     * 4、这个值设置需要注意！'./'、'../'这种尤其注意！并不会都如期望的那样。<br />
     * 5、当目标为web、web-worker时，其默认值为'auto'，它会自动从`import.meta.url`、`document.currentScript`、`<script />`或`self.location`确定公共路径。<br />
     * 6、该选项的值以运行时或加载程序创建的每个URL为前缀。因此，在大多数情况下，此选项的值以/结尾。<br />
     * 7、如果在编译时无法知道输出文件的publicPath，可以将其留空，并在运行时使用自由变量__webpack_public_path__在入口文件中动态设置。<br />
     * 8、当设置为publicPath:'/assets/'时，输出HTML的加载器可能会发出如下内容：<link href="/assets/spinner.gif" />。<br />
     */
    publicPath: 'auto',
    /**
     * 此选项允许加载具有自定义脚本类型的异步块，例如<script type="module" ...>。<br />
     * 1、如果output.module设置为true，则output.scriptType将默认为'module'而不是false。<br />
     */
    scriptType: 'text/javascript',
    sourceMapFilename: 'map/[name]_[contenthash:16].map',
    /**
     * 根据EcmaScript模块规范处理模块加载中的错误，但要付出性能代价。<br />
     * 1、5.25.0+新增的选项。<br />
     * 2、告诉webpack，如果一个模块在被要求时抛出了一个异常，就把它从模块实例缓存（require.cache）中删除。<br />
     * 由于性能原因，它默认为false。<br />
     * 当设置为false时，模块不会从缓存中移除，这将导致异常只在第一次调用require时被抛出（这与node.js不兼容）。<br />
     * 当设置为true时，这个模块的所有调用都会抛出一个异常。<br />
     */
    strictModuleErrorHandling: !isProduction,
    /**
     * 设置加载WebAssembly模块的方法的选项。默认包含的方法是'fetch' (web/WebWorker)、'async-node' (Node.js)、'universal'，但其他方法可能由插件添加。<br />
     * 1、默认值会受到不同目标的影响：
     * Defaults to 'fetch' if target is set to 'web', 'webworker', 'electron-renderer' or 'node-webkit'.<br />
     * Defaults to 'async-node' if target is set to 'node', 'async-node', 'electron-main' or 'electron-preload'.<br />
     */
    wasmLoading: 'fetch',
    /**
     * 该选项基本同上面的“wasmLoading”选项。<br />
     */
    workerWasmLoading: 'fetch',
    /**
     * 新选项workerChunkLoading控制worker的块加载。<br />
     * 1、有效值：'jsonp' (web)、'require'(sync node.js)、'import-scripts'(WebWorker)、'async-node'(async node.js)、'import'(ESM)、'universal'、false。<br />
     */
    workerChunkLoading: 'import-scripts',
    /**
     * 为Worker设置一个公共路径，默认为“output.publicPath”的值。只有当你的Worker脚本与你的其他脚本位于不同的路径时，才使用这个选项。<br />
     * 注意：<br />
     * 1、目前该选项有点鸡肋：<br />
     * 因为这个选项设置的值只是并到打包后的请求该worker文件的路径上，但是目前没有可以单独设置“worker文件”输出到某个文件夹的选项。<br />
     * 不过可以使用“output.filename”、“output.chunkFilename”这两个选项的函数值，做过滤输出，倒是可以指定输出到某个文件夹，目前个人已经这样做了些处理。<br />
     * 所以，强烈建议在new Worker()的时候，给构造函数的第二个参数设置这样的参数：{ name: 'Worker文件名.worker', }，这样设置之后，就可以把worker文件打包到“workers”这个文件夹内。<br />
     * 且打包后的完整文件名加扩展名为“Worker文件名_[contenthash].worker.js”。<br />
     * 2、当然也可以在new Worker()的时候在第二个参数里使用“魔术注解”来设置打包后的“worker”代码要存放的文件夹，比如放到“workers”这个文件夹内。关于worker中的更多“魔术注解”的使用，见：notes/webpack魔术注解.txt。<br />
     */
    // workerPublicPath: null,
    /**
     * WebAssembly模块的文件名作为'output.path'目录内的相对路径。<br />
     * 1、值类型为string。<br />
     * 2、值不是一个绝对路径，是相对路径，相对于'output.path'。<br />
     * 3、该选项值的占位参数目前只支持：[id]、[hash]。<br />
     */
    webassemblyModuleFilename: 'wasm/[id]_[hash].wasm',
  },
  /**
   * 这些选项允许您控制webpack如何通知您超出特定文件限制的资产和入口点。此功能的灵感来自webpack性能预算的想法。<br />
   * 1、配置性能提示的显示方式。例如，如果您的资产超过250kb，webpack将发出警告通知您。<br />
   * 2、设置为false时，直接关闭该功能。<br />
   *
   * @type {object}
   */
  performanceConfig = {
    // 要对哪类文件进行性能检测，返回true就表示对它进行性能检测。
    assetFilter( assetFilename ){
      const arr1 = Array.from( new Set( JSON.parse( '["3gp","3gpp","aac","aiff","amr","ape","apng","arw","asf","asx","au","avi","avif","bmp","bpg","cda","cjs","cr2","cson","css","csv","cts","cur","dat","dcx","dng","ejs","eot","flac","flif","flv","fon","font","gif","gql","graphql","graphqls","handlebars","hbs","heic","heif","htm","html","icns","ico","j2c","j2k","jade","jbig2","jng","jp2","jpe","jpeg","jpg","jpm","jpx","js","json","json5","jsx","jxl","jxr","kar","ktx","less","m4a","m4v","markdown","md","mid","midi","mj2","mjs","mkv","mng","mod","mov","mp1","mp2","opus","mp3","mp4","mpeg","mpeg-1","mpeg-2","mpeg-4","mpeg-layer3","mpg","mts","mustache","nef","ogg","orf","otf","pam","pbm","pcss","pcx","pgm","jfif","pjpeg","pjp","png","pnm","postcss","ppm","psd","pug","ra","raf","raw","rgbe","rm","rmvb","rmx","rw2","sass","scss","styl","stylus","svg","svgz","tga","tif","tiff","toml","ts","tsv","tsx","ttc","ttf","txt","vob","vorbis","vqf","vue","wasm","wav","wave","wbmp","webm","webp","wp2","wma","wmv","woff","woff2","xbm","xhtml","xml","xpm","yaml"]' ) ) );

      return new RegExp( `\\.(${ arr1.join( '|' ) })$`, 'i' ).test( assetFilename );
    },
    /**
     * 打开或关闭提示。此外，告诉webpack在找到提示时抛出错误或警告。<br />
     * 1、有效值类型：string、boolean。<br />
     * 2、当值类型为boolean时，只能设置为false，它表示不显示提示警告或错误。<br />
     * 3、当值类型为string时，有2个：'warning'、'error'。<br />
     * warning：将显示一条警告，通知您有大型资产。我们建议在“开发环境”中使用类似的东西。<br />
     * error：将显示一个错误，通知您有大型资产。我们建议在“生产构建”期间使用hints: "error"，以帮助防止部署太大的生产包，从而影响网页性能。<br />
     */
    hints: isProduction
           ? 'error'
           : 'warning',
    /**
     * 资产是从webpack发出的任何文件。此选项控制webpack何时根据单个资产大小（以bytes为单位）发出性能提示。<br />
     * 1、5 * 1024 * 1024 = 5242880，设置成5MB。<br />
     */
    maxAssetSize: 10 * 1024 * 1024,
    /**
     * 入口点表示将在特定条目的初始加载时间期间使用的所有资产。此选项控制webpack何时根据最大入口点大小（以bytes为单位）发出性能提示。<br />
     * 1、5 * 1024 * 1024 = 5242880，设置成5MB。<br />
     */
    maxEntrypointSize: 50 * 1024 * 1024,
  },
  /**
   * 用于设置预取将来可能需要一些导航资源（目前该插件只支持JS类的资源），会在页面上通过link标签设置一个预取资源。<br />
   * PS：<br />
   * 1、数组里的各个值只能以'./'开头的基于项目根目录的文件路径，值形如：'./src/pages/index/my_module001/MyModule001.esm.mjs'。<br />
   * 2、在浏览器中测试预取时，记得关闭“禁用缓存”。<br />
   * 3、不同浏览器（火狐、谷歌）对预取的表现有所不同，如：状态码之类，测的时候，记得多对比不同浏览器（火狐、谷歌）之间的表现。<br />
   *
   * @type {array}
   */
  prefetchPluginConfig = ( paths => {
    return paths.map( item => {
      return new webpack.PrefetchPlugin( resolve( __dirname, './', item ) );
    } );
  } )( [
    // 这个数组里的各个值只能以'./'开头的基于项目根目录的文件路径（目前该插件只支持JS类的资源），值形如：'./src/pages/index/my_module001/MyModule001.esm.mjs'。
  ] ),
  /**
   * 自动加载模块，而不必在任何地方“import”或“require”它们。<br />
   * 1、默认情况下，模块解析路径是从“当前文件夹”和“node_modules”中开始查找。<br />
   * 2、要导入ES2015模块的“默认导出”，必须指定模块的“默认属性”，也就是说模块必须指定“默认属性”。<br />
   * 3、每当在模块中遇到标识符作为自由变量时，模块会自动加载，并且标识符会填充加载模块的导出（或“属性”以支持“命名导出”）。<br />
   * 如：_map: ['lodash', 'map']、Vue: ['vue/dist/vue.esm.js', 'default']。<br />
   * 4、也可以指定完整路径：identifier: path.resolve(path.join(__dirname, 'src/module1'))。<br />
   * 5、为第三方包配置时，只要用包名作为value值即可，因为webpack会自动从“node_modules”中查找，并加载相应的模块文件。<br />
   * 6、为第三方包配置时，不要设置以“./”、“./node_modules/”、“node_modules/”等等开头的value值，当然如果是指向自己的模块文件，那还是要指定完整路径。<br />
   * 7、element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
   * 8、注意，不同的包，因为其package.json中"exports"字段值的不同，如下设置也会不同的，最好每次都要在代码中测试是否如期望一样达到目的效果。<br />
   * 9、鉴于某些低版本浏览器不支持ES6+的语法，而如下设置又直接使用了第三方包的ESM版本，那么最终的打包代码中会直接使用其ESM版本的代码，从而导致不支持某些低版本浏览器。<br />
   *
   * @type {object}
   */
  providePluginConfig = {
    axios: [
      resolve( join( __dirname, './node_modules/axios/dist/esm/axios.js' ) ),
      'default',
    ],

    Ckeditor5ClassicEditor: resolve( join( __dirname, './node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js' ) ),

    d3: 'd3',

    echarts: resolve( join( __dirname, './node_modules/echarts/dist/echarts.js' ) ),

    /**
     * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
     * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
     */
    ELEMENT: resolve( join( __dirname, './node_modules/element-ui/lib/element-ui.common.js' ) ),
    ElementPlus: 'element-plus',

    /**
     * JavaScript HTML 渲染器：<br />
     * 该脚本允许您直接在用户浏览器上截取网页或其部分内容的“屏幕截图”。屏幕截图基于 DOM，因此可能无法 100% 准确地反映真实情况，因为它不会制作实际的屏幕截图，而是根据页面上的可用信息构建屏幕截图。<br />
     * 详细见：https://github.com/niklasvh/html2canvas <br />
     * Options选项见：https://html2canvas.hertzen.com/configuration <br />
     */
    html2canvas: resolve( join( __dirname, './node_modules/html2canvas/dist/html2canvas.esm.js' ) ),

    $: resolve( join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),
    jQuery: resolve( join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),
    'window.$': resolve( join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),
    'window.jQuery': resolve( join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),

    /*
     官方文档：https://github.com/emn178/js-sha3

     导出的JSSHA3是一个对象，JSSHA3上部署有如下函数：
     cshake128、cshake256、cshake_128、cshake_256、
     keccak224、keccak256、keccak384、keccak512、keccak_224、keccak_256、keccak_384、keccak_512、
     kmac128、kmac256、kmac_128、kmac_256、
     sha3_224、sha3_256、sha3_384、sha3_512、
     shake128、shake256、shake_128、shake_256
     */
    JSSHA3: resolve( join( __dirname, './node_modules/js-sha3/build/sha3.min.js' ) ),
    /*
     https://github.com/emn178/js-sha512

     导出的JSSHA512是一个函数。
     */
    JSSHA512: resolve( join( __dirname, './node_modules/js-sha512/build/sha512.min.js' ) ),
    /*
     https://github.com/emn178/js-sha256

     导出的JSSHA256是一个函数。
     */
    JSSHA256: resolve( join( __dirname, './node_modules/js-sha256/build/sha256.min.js' ) ),
    /*
     https://github.com/emn178/js-sha1

     导出的JSSHA1是一个函数。
     */
    JSSHA1: resolve( join( __dirname, './node_modules/js-sha1/build/sha1.min.js' ) ),
    /*
     https://github.com/emn178/js-md5

     导出的JSMD5是一个函数。
     */
    JSMD5: resolve( join( __dirname, './node_modules/js-md5/build/md5.min.js' ) ),
    /*
     https://github.com/dankogai/js-base64

     导出的JSBase64是一个对象。
     */
    JSBase64: resolve( join( __dirname, './node_modules/js-base64/base64.js' ) ),

    localforage: resolve( join( __dirname, './node_modules/localforage/dist/localforage.js' ) ),

    lodash: resolve( join( __dirname, './node_modules/lodash/lodash.js' ) ),

    PIXI: 'pixi.js',

    Swiper: [
      resolve( join( __dirname, './node_modules/swiper/swiper.mjs' ) ),
      'default',
    ],

    THREE: 'three',

    underscore: 'underscore',

    /**
     * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
     * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
     */
    Vue: 'vue',
    VueRouter: 'vue-router',
    Vuex: [
      'vuex',
      'default',
    ],
    Pinia: 'pinia',

    CurrencyTools: resolve( join( __dirname, './src/tools/js/currency_tools/CurrencyTools.esm.mjs' ) ),
    UniversalTools: resolve( join( __dirname, './src/tools/ts/universal_tools/UniversalTools.esm.mts' ) ),
  },
  /**
   * 使用此选项生成一个JSON文件，其中包含webpack“记录”——用于跨多个构建存储模块标识符的数据片段。您可以使用此文件来跟踪模块在构建之间的变化。<br />
   * 1、如果您有一个利用代码拆分的复杂设置，则记录特别有用。该数据可用于确保拆分包实现您需要的缓存行为。<br />
   * 2、请注意，尽管此文件是由编译器生成的，但您可能仍希望在源代码管理中对其进行跟踪，以保留其随时间变化的历史记录。<br />
   * 3、设置recordsPath本质上会将recordsInputPath和recordsOutputPath设置为相同的位置。这通常是所有必要的，除非您决定更改包含记录的文件的名称。<br />
   *
   * @param {string} folderName 取上面的顶层变量env_platform即可。<br />
   *
   * @returns {string}
   */
  recordsPathConfig = ( folderName = env_platform ) => {
    const {
        year,
        month,
        date,
        hours,
        minutes,
        seconds,
        day,
      } = DateHandle(),
      recordsPath = `./webpack_records/${ folderName }/Records_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒(周${ day }).json5`;

    return join( __dirname, recordsPath );
  },
  /**
   * @type {{hashLoading: 'eager' | 'lazy', hashFuncNames: string[], enabled: 'auto' | true | false}}
   */
  subresourceIntegrityPluginConfig = {
    hashFuncNames: [
      'sha512',
    ],
    enabled: isProduction,
    hashLoading: 'eager',
  },
  /**
   * 指示webpack以特定环境为目标，当没有找到browserslist配置时，默认为“browserslist”或“web”。<br />
   * 1、值格式：string、[ string ]、false，如：[ 'web', 'es2022', ]。<br />
   * 2、当传递多个目标时，将使用公共特征子集：[ 'web', 'es2022', ]，目前，并非所有目标都可能是混合的。<br />
   * 3、当没有提供有关“target”或“environment features”的信息时，将使用“es2015”。<br />
   *
   * @type {array}
   */
  targetConfig = [
    'web',
    'es2024',
  ],
  /**
   * 供插件“typedoc-webpack-plugin”使用的配置参数。<br />
   * 说明：<br />
   * 1、该插件用于为使用TypeScript编写的代码生成其对应的文档，底层是基于“typedoc”的。<br />
   * 2、目前只建议该插件用于生产、测试环境下为指定的用TypeScript编写的文件生成其文档。<br />
   * 3、不要用于开发环境，因为在开发环境下在生成文档后会出现不停的出现webpack重编译的情况，而且，开发环境下也不需要实时生成文档，毕竟生成文档的过程也是耗时的。<br />
   * 4、关于使用该插件时需要的配置文件及其相关的，可参见“src/tools/ts/universal_tools/type_doc”文件夹下的“doc”文件夹、“README.md”文件、"typedoc.json"文件、“tsconfig.typedoc.json”文件，参照它们为其他需要生成文档的文件配置文件。<br />
   * 5、当前基于的“typedoc”版本为“0.23.21”。<br />
   * 6、如果需要为多个文件生成文档，只要配置多个诸如“{options: string}”这样的配置即可，所以变量“typedocWebpackPluginConfig”才是一个数组。<br />
   *
   * PS：<br />
   * 1、插件“typedoc-webpack-plugin”由于很久不更新了，依赖的“typedoc”版本也已经发生了很大的变动，所以个人直接修改了其源码，使其能配合webpack使用，修改后的代码见“backups/typedoc-webpack-plugin/index.js”。<br />
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
   * @type {[{options: string}]}
   */
  typedocWebpackPluginConfig = ( arr => {
    return arr.map( item => ( {
      options: item,
    } ) );
  } )( [
    // 如果需要在生产模式构建时，顺便生成你想要的某些代码的文档，可以在此设置。

    // 参照这个的写法即可。
    // resolve( __dirname, './src/tools/ts/universal_tools/type_doc/typedoc.json' ),
  ] ),
  /**
   * 一组用于自定义手表模式的选项。<br />
   * 1、值类型为object，结构如下：
   * {<br />
   * aggregateTimeout：number，第1个文件更改后，在重建之前添加延迟。这允许webpack将在此时间段内所做的任何其他更改聚合到一个重建中。以“毫秒”为单位传递一个值。<br />
   *
   * followSymlinks：boolean，在查找文件时遵循符号链接。这通常不需要，因为webpack已经使用resolve.symlinks解析了符号链接。<br />
   *
   * ignored：RegExp、string、[ string ]，对于某些系统，查看许多文件可能会导致大量CPU或内存使用。可以使用正则表达式排除像node_modules这样的巨大文件夹。<br />
   * 1、如果你使用require.context，webpack会监视你的整个目录。您将需要忽略文件和/或目录，以便不需要的更改不会触发重建。<br />
   *
   * poll：boolean、number，通过传递true或指定以“毫秒”为单位的轮询间隔来打开轮询。<br />
   * 1、如果观看对您不起作用，请尝试此选项。这可能有助于解决NFS和VirtualBox、WSL、Containers或Docker中的机器问题。<br />
   * 2、在这些情况下，请使用轮询间隔并忽略/node_modules/等大型文件夹，以将CPU使用率降至最低。<br />
   * 3、poll: 500，表示每500毫秒检查一次更改。<br />
   *
   * stdin：boolean，当标准输入流结束时停止watching。<br />
   * 1、stdin: false，表示当标准输入流结束时不停止watching。<br />
   * }<br />
   *
   * @type {object}
   */
    // ignored选项的例子：ignored: /node_modules/、'**/node_modules'、[ '**/files/**/*.js', '**/node_modules' ]、[ path.posix.resolve(__dirname, './ignored-dir') ]
  watchOptionsConfig = {
    aggregateTimeout: 500,
    followSymlinks: false,
    ignored: watchIgnoredArr,
  };

export {
  Get__dirname,
  Get__filename,

  __dirname,
  env_platform,
  isProduction,
  isSPA,

  browserslist,
  autoprefixerConfig,
  postcssCalcConfig,

  watchIgnoredArr,

  aliasConfig,
  assetsWebpackPluginConfig,
  cacheConfig,
  cleanWebpackPluginConfig,
  copyPluginConfig,
  definePluginConfig,
  deterministicChunkIdsPluginConfig,
  deterministicModuleIdsPluginConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  extensionsConfig,
  extensionAliasConfig,
  externalsConfig,
  forkTsCheckerWebpackPluginConfig,
  forkTsCheckerNotifierWebpackPluginConfig,
  htmlWebpackPluginConfig,
  limitChunkCountPluginConfig,
  minChunkSizePluginConfig,
  miniCssExtractPluginConfig,
  nodeConfig,
  moduleConfig,
  moduleFederationPluginConfig,
  optimizationConfig,
  outputConfig,
  performanceConfig,
  prefetchPluginConfig,
  providePluginConfig,
  recordsPathConfig,
  subresourceIntegrityPluginConfig,
  targetConfig,
  typedocWebpackPluginConfig,
  watchOptionsConfig,
};

export default {
  Get__dirname,
  Get__filename,

  __dirname,
  env_platform,
  isProduction,
  isSPA,

  browserslist,
  autoprefixerConfig,
  postcssCalcConfig,

  watchIgnoredArr,

  aliasConfig,
  assetsWebpackPluginConfig,
  cacheConfig,
  cleanWebpackPluginConfig,
  copyPluginConfig,
  definePluginConfig,
  deterministicChunkIdsPluginConfig,
  deterministicModuleIdsPluginConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  extensionsConfig,
  extensionAliasConfig,
  externalsConfig,
  forkTsCheckerWebpackPluginConfig,
  forkTsCheckerNotifierWebpackPluginConfig,
  htmlWebpackPluginConfig,
  limitChunkCountPluginConfig,
  minChunkSizePluginConfig,
  miniCssExtractPluginConfig,
  nodeConfig,
  moduleConfig,
  moduleFederationPluginConfig,
  optimizationConfig,
  outputConfig,
  performanceConfig,
  prefetchPluginConfig,
  providePluginConfig,
  recordsPathConfig,
  subresourceIntegrityPluginConfig,
  targetConfig,
  typedocWebpackPluginConfig,
  watchOptionsConfig,
};
