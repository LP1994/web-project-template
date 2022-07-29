/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: webpack.base.esm.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 该文件里的配置都是webpack中公共部分的配置，供webpack.dev.mjs、webpack.local.mjs、webpack.production.mjs、webpack.test.mjs使用。
 * 1、当需要将代码转换成兼容比较旧的平台时，需要修改：
 * 顶级配置项：experiments、target。
 * output.environment。
 * vue-loader:options.transpileOptions.target（改变量vue_loader_options_transpileOptions_target即可）。
 * vue-loader:options.transpileOptions.transforms。
 * tsconfig.json中的compilerOptions.module、compilerOptions.target。
 * 变量browserslist。
 * 变量esbuildMinify_target。
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
  dirname,
  join,
  resolve,
} from 'node:path';

import {
  argv,
} from 'node:process';

import {
  fileURLToPath,
} from 'node:url';

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';

import mime from 'mime';

import TerserPlugin from 'terser-webpack-plugin';

import entryConfig from './configures/EntryConfig.esm.mjs';

import {
  devServerGlobalParameters,
  httpHeaders,
} from './configures/GlobalParameters.esm.mjs';

import HTMLWebpackPluginConfig from './configures/HTMLWebpackPluginConfig.esm.mjs';

import proxyConfig from './configures/ProxyConfig.esm.mjs';

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

/**
 * 表示项目文件夹根目录，不是磁盘根目录。<br />
 */
const __dirname = Get__dirname( import.meta.url ),
  browserslist = [
    // 至20220724的各PC端主流浏览器的最新版本。Start
    'Chrome >= 103',
    'Edge >= 103',
    'Firefox >= 103',
    'Safari >= 15',
    'Opera >= 89',
    // 至20220724的各PC端主流浏览器的最新版本。End

    // 至20220724的各移动端主流浏览器的最新版本。Start
    'ChromeAndroid >= 103',
    'Android >= 103',
    'FirefoxAndroid >= 103',
    'iOS >= 15',
    // 至20220724的各移动端主流浏览器的最新版本。End
  ],
  /**
   * 每个目标环境都是一个环境名称，后跟一个版本号。当前支持以下环境名称：<br />
   * 1、chrome、edge、firefox、hermes、ie、ios、node、opera、rhino、safari。<br />
   * 2、还可以是这样的：es2020、esnext、node12、node12.19.0、es5、es6。<br />
   */
  esbuildMinify_target = [
    'es2022',

    // 至20220724的各PC端主流浏览器的最新版本。Start
    'chrome103',
    'edge103',
    'firefox103',
    'safari15',
    'opera89',
    // 至20220724的各PC端主流浏览器的最新版本。End

    // 至20220724的各移动端主流浏览器的最新版本。Start
    'ios15',
    // 至20220724的各移动端主流浏览器的最新版本。End
  ],
  vue_loader_options_transpileOptions_target = {
    // 至20220724的各PC端主流浏览器的最新版本。Start
    chrome: 103,
    edge: 103,
    firefox: 103,
    safari: 15,
    opera: 89,
    // 至20220724的各PC端主流浏览器的最新版本。End

    // 至20220724的各移动端主流浏览器的最新版本。Start
    and_chr: 103,
    android: 103,
    and_ff: 103,
    ios_saf: 15,
    // 至20220724的各PC端主流浏览器的最新版本。End
  },
  /**
   * 当启用实验性选项experiments.buildHttp时，是否要处理CSS文件中的远程资源URL。true表示处理，false表示不处理，将其原样保留在代码中。
   */
  isHandle_experiments_buildHttp_in_CSSLoader = false,
  /**
   * isProduction的值为true时表示生成环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值。<br />
   * 1、有效的“--mode”参数设置是：--mode development（用于开发）、--mode production（用于生产）。<br />
   */
  isProduction = ( argv => {
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
  } )( argv ),
  /**
   * 是否将项目设置成单页面应用程序(SPA)，默认true表示单页面应用程序(SPA)，false表示多页面应用程序(MPA)。<br />
   */
  isSPA = false,
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
   * env_platform的值是字符串，有4个值：'dev_server'、'local_server'、'test'、'production'，来源是CLI参数中的“--env”参数值，注意“--env”参数是允许多个的哦。<br />
   * 1、但是必须有这么一个“--env”参数设置，这4个之中的其中一个即可：--env platform=dev_server、--env platform=local_server、--env platform=test、--env platform=production。<br />
   */
  env_platform = ( argv => {
    const envArr = [];

    argv.forEach( ( item, index ) => {
      if( item === '--env' ){
        envArr.push( argv.at( index + 1 ) );
      }
    } );

    if( envArr.length === 0 ){
      console.dir( argv );

      throw new Error( 'CLI参数中没找到“--env”参数。注意“--env”参数是允许多个的哦。' );
    }

    const platformArr = [];

    envArr.forEach( item => {
      if( item.startsWith( 'platform=' ) ){
        platformArr.push( item );
      }
    } );

    if( platformArr.length === 0 ){
      console.dir( argv );

      throw new Error( 'CLI参数中必须有这么一个“--env”参数设置，这4个之中的其中一个即可：--env platform=dev_server、--env platform=local_server、--env platform=test、--env platform=production。注意“--env”参数是允许多个的哦。' );
    }
    else if( platformArr.length > 1 ){
      console.dir( argv );

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
      console.dir( argv );

      throw new Error( 'CLI参数中的“--env”参数设置，以“platform=”开头的值，在“platform=”之后紧跟的只能是这4个中的一个：dev_server、local_server、test、production。注意“--env”参数是允许多个的哦。' );
    }
  } )( argv ),
  watchIgnoredArr = [
    resolve( __dirname, './.git/' ),
    resolve( __dirname, './.idea/' ),
    resolve( __dirname, './assist_tools/' ),
    resolve( __dirname, './backups/' ),
    resolve( __dirname, './bats/' ),
    resolve( __dirname, './configures/' ),
    resolve( __dirname, './dist/' ),
    resolve( __dirname, './node_modules/' ),
    resolve( __dirname, './notes/' ),
    resolve( __dirname, './read_me/' ),
    resolve( __dirname, './simulation_servers/' ),
    resolve( __dirname, './test/' ),
    resolve( __dirname, './ts_compiled/' ),
    resolve( __dirname, './webpack_location/' ),
  ];

/**
 * 设置路径别名。<br />
 * 1、resolve.alias优先于其他模块解析。<br />
 * 2、路径别名到底是路径别名，别用于直接指向具体的文件，尤其是JS文件，因为会导致无法根据导入语法的不同自行加载到相应的模块文件，致使报错；但是CSS一类的文件倒是可以直接指向到具体的文件。<br />
 * 3、为第三方包设置别名时，只能是以包名开始，其他任何都不行，因为webpack会自动从“node_modules”中查找，包括：“./”、“./node_modules/”、“node_modules/”等等都是不行的，当然如果是指向自己的模块文件夹，那还是要指定完整路径。<br />
 * 4、也可以指定完整路径：xxx: path.resolve(path.join(__dirname, 'src/module1'))。<br />
 */
const aliasConfig = {
    'element-ui-css$': 'element-ui/lib/theme-chalk/index.css',
    'element-plus-css$': 'element-plus/dist/index.css',
    'swiper-css$': 'swiper/swiper-bundle.min.css',

    'imgDir': resolve( __dirname, './src/assets/img/' ),
  },
  assetsWebpackPluginConfig = {
    filename: 'ProjectAllAssetsByWebpack.json',
    fullPath: true,
    /**
     * 如果为true，则完整路径将自动去除webpack生成的/auto/前缀。默认值是false。<br />
     * 1、因为output.publicPath设置的值为'auto'，所以该选项设置为false时，生成的ProjectAllAssetsByWebpack.json文件里的各个文件路径会打头带auto。<br />
     */
    removeFullPathAutoPrefix: true,
    includeManifest: false,
    // 对资产输出进行排序，以便清单是第一个条目。这对于从资产json输出生成脚本标签的情况很有用，并且导入顺序很重要。
    manifestFirst: true,
    path: join( __dirname, `./dist/${ env_platform }/` ),
    useCompilerPath: false,
    prettyPrint: !isProduction,
    update: false,
    metadata: {
      version: 20220101,
    },
    includeAllFileTypes: true,
    keepInMemory: !isProduction,
    integrity: isProduction,
    entrypoints: false,
  },
  /**
   * 默认情况下，此插件将在每次成功重建后删除webpack的output.path目录中的所有文件，以及所有未使用的webpack资产。<br />
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
      '!ProjectAllAssetsByWebpack.json',
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
   */
  copyPluginConfig = ( patternsArr => {
    const arr1 = [],
      ignoreArr = [
        '**/*.gitignore',
        '**/该文件夹说明.txt',
      ];

    patternsArr.forEach( item => {
      arr1.push( Object.assign( {}, {
        context: './src/',
        globOptions: {
          expandDirectories: true,
          gitignore: true,
          ignoreFiles: ignoreArr,
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
        concurrency: 100,
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
      from: 'favicon.ico',
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
   */
  definePluginConfig = {
    isProduction: JSON.stringify( isProduction ),
    env_platform: JSON.stringify( env_platform ),
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
   *     warnings：boolean，当出现编译器警告时，在浏览器中启用全屏覆盖。。<br />
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
   * 4、实测注意一点，当用'0.0.0.0'这个值设置给“devServer.host”时，会让服务器可以从外部访问，包括：本地（localhost）、局域网（如：192.168.1.6）、IPV6等等，但是不能用'0.0.0.0'来访问（访问不了！！！），还是得通过：本地（localhost）、局域网（如：192.168.1.6）来访问的。<br />
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
   * open：告诉dev-server在服务器启动后打开浏览器。将其设置为true以打开默认浏览器。<br />
   * 1、有效值类型：boolean、string（指的是要打开的页面）、object、[ string、object ]。<br />
   * 2、浏览器应用程序名称取决于平台。不要在可重用的模块中对其进行硬编码。例如，“Chrome”在macOS上是“Google Chrome”，在Linux上是“google-chrome”，在Windows上是“chrome”。<br />
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
   *   浏览器应用程序名称取决于平台。不要在可重用的模块中对其进行硬编码。例如，“Chrome”在macOS上是“Google Chrome”，在Linux上是“google-chrome”，在Windows上是“chrome”。<br />
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
   * 1、有效值类型有：object、[ object、function ]。<br />
   * 2、默认情况下，不接受在HTTPS上运行且证书无效的后端服务器。如果您愿意，请像这样修改您的配置secure: false。<br />
   * 3、默认情况下，代理时会保留主机头的来源，您可以将changeOrigin设置为true以覆盖此行为。它在某些情况下很有用，例如使用基于名称的虚拟托管站点。<br />
   * 4、请注意，http-proxy-middleware的某些功能不需要“target”选项，例如它的“router”选项，但是您仍然需要在此处的配置中包含“target”选项，否则webpack-dev-server不会将其传递给http-proxy-middleware。<br />
   * 5、注意，当前文件编写的配置是遵循“http-proxy-middleware v2.0.6”的，因为“webpack 5”也是引用“http-proxy-middleware”的，而“http-proxy-middleware”有一个3.X的版本正在预备中，其配置写法有很大的变化。<br />
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
   * watchFiles：此选项允许您配置“globs/directories/files”以监视文件更改。<br />
   * 1、有效值类型：string、object、[string, object]。<br />
   * 2、当值类型为object时，有关可能的选项（paths、options），请参阅chokidar文档（https://github.com/paulmillr/chokidar）。<br />
   * 
   * webSocketServer：此选项允许我们选择当前的web-socket服务器或提供自定义web-socket服务器实现。<br />
   * 1、有效值类型：boolean（false）、string（'sockjs'、'ws'）、function、object。<br />
   * 2、当模式是“ws”时。此模式使用ws作为服务器，在客户端使用原生WebSocket。<br />
   * 3、要创建自定义服务器实现，请创建一个扩展BaseServer的类。<br />
   * }<br />
   */
  devServerConfig = {
    allowedHosts: 'all',
    bonjour: true,
    client: {
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
      reconnect: true,
      webSocketTransport: 'ws',
    },
    compress: true,
    devMiddleware: {
      headers: httpHeaders,
      index: false,
      methods: [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE',
        'CONNECT',
        'OPTIONS',
        'TRACE',
        'PATCH',
      ],
      publicPath: `/${ env_platform }`,
      writeToDisk: true,
    },
    headers: httpHeaders,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    liveReload: true,
    open: [
      // Windows平台上的Edge浏览器。
      {
        target: [
          `http://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/pages/HelloWorld.html`,
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
       `http://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/pages/HelloWorld.html`,
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
       `http://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/pages/HelloWorld.html`,
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
       `http://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/pages/HelloWorld.html`,
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
          `http://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/pages/HelloWorld.html`,
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
          `http://${ devServerGlobalParameters[ env_platform ]?.host }:${ devServerGlobalParameters[ env_platform ]?.port }/${ env_platform }/pages/HelloWorld.html`,
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
    server: {
      type: 'http',
      options: {
        passphrase: 'openssl2022002',
        requestCert: true,
        ca: readFileSync( join( __dirname, './configures/openssl/2022002/server2022002.crt' ) ),
        cert: readFileSync( join( __dirname, './configures/openssl/2022002/server2022002.crt' ) ),
        key: readFileSync( join( __dirname, './configures/openssl/2022002/server2022002.key' ) ),
        pfx: readFileSync( join( __dirname, './configures/openssl/2022002/server2022002.pfx' ) ),
      },
    },
    setupExitSignals: true,
    setupMiddlewares: ( middlewares, devServer ) => {
      if( !devServer ){
        throw new Error( 'webpack-dev-server is not defined!' );
      }

      const ResFaviconIco = ( req, res, url = resolve( __dirname, './favicon.ico' ) ) => {
        console.log( '------setupMiddlewares------Start' );
        console.log( `客户端的请求URL--->${ req.url }` );
        console.log( '------setupMiddlewares------End' );

        res.setHeader( 'Content-Type', mime.getType( req.url ) );
        res.setHeader( 'x-from', 'devServer.setupMiddlewares' );
        res.setHeader( 'x-dev-type', `${ env_platform }` );

        Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
          res.setHeader( keyName, keyValue );
        } );

        res.statusCode = 200;
        res.statusMessage = 'OK';

        createReadStream( url ).pipe( res, {
          end: true,
        } );
      };

      devServer.app.get( '/favicon.ico', ( req, response ) => {
        ResFaviconIco( req, response );
      } );
      devServer.app.get( '/favicon.png', ( req, response ) => {
        ResFaviconIco( req, response );
      } );
      devServer.app.get( '/apple-touch-icon.png', ( req, response ) => {
        ResFaviconIco( req, response );
      } );
      devServer.app.get( '/apple-touch-icon-precomposed.png', ( req, response ) => {
        ResFaviconIco( req, response );
      } );

      /**
       * unshift方法对标之前的onBeforeSetupMiddleware方法。<br />
       * PS：<br />
       * 1、实测，启动后，可以访问到！！！<br />
       */
      middlewares.unshift( {
        name: 'test001-first',
        /**
         * path选项是可选的，但是最好还是要有。
         */
        path: '/test001/first/',
        middleware: ( req, res ) => {
          res.setHeader( 'Content-Type', 'text/html;charset=utf-8' );
          res.setHeader( 'x-from', 'devServer.setupMiddlewares.onBeforeSetupMiddleware' );
          res.setHeader( 'x-dev-type', `${ env_platform }` );

          Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
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
       * 1、实测，启动后，无法访问到！！！<br />
       */
      middlewares.push( {
        name: 'test001-last',
        /**
         * path选项是可选的，但是最好还是要有。
         */
        path: '/test001/last/',
        middleware: ( req, res ) => {
          res.setHeader( 'Content-Type', 'text/html;charset=utf-8' );
          res.setHeader( 'x-from', 'devServer.setupMiddlewares.onAfterSetupMiddleware' );
          res.setHeader( 'x-dev-type', `${ env_platform }` );

          Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
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
    static: [
      {
        directory: join( __dirname, './dist/' ),
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
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );
            res.set( 'x-dev-type', `${ env_platform }` );

            Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        publicPath: '/dev-server-static/dist',
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      },
      {
        directory: join( __dirname, './simulation_servers/' ),
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
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );
            res.set( 'x-dev-type', `${ env_platform }` );

            Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        publicPath: '/dev-server-static/simulation_servers',
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      },
      {
        directory: join( __dirname, './src/' ),
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
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );
            res.set( 'x-dev-type', `${ env_platform }` );

            Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        publicPath: '/dev-server-static/src',
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      },
      {
        directory: join( __dirname, './subsystems/' ),
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
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );
            res.set( 'x-dev-type', `${ env_platform }` );

            Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        publicPath: '/dev-server-static/subsystems',
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      },
      {
        directory: join( __dirname, './test/' ),
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
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );
            res.set( 'x-dev-type', `${ env_platform }` );

            Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        publicPath: '/dev-server-static/test',
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      },
      {
        directory: join( __dirname, './ts_compiled/' ),
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
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );
            res.set( 'x-dev-type', `${ env_platform }` );

            Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        publicPath: '/dev-server-static/ts_compiled',
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      },
      {
        directory: join( __dirname, './webpack_location/' ),
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
            res.set( 'x-from', 'devServer.static.staticOptions.setHeaders' );
            res.set( 'x-dev-type', `${ env_platform }` );

            Object.entries( httpHeaders ).forEach( ( [ keyName, keyValue ], ) => {
              res.set( keyName, keyValue );
            } );
          },
        },
        publicPath: '/dev-server-static/webpack_location',
        serveIndex: {
          hidden: false,
          icons: true,
          view: 'details',
        },
        watch: true,
      },
    ],
    watchFiles: [
      'src/**/*.*',
    ],
    webSocketServer: 'ws',
  },
  /**
   * 在webpack 5中引入了实验选项，以使用户能够激活和试用实验性功能。<br />
   * 1、由于实验性功能具有宽松的语义版本控制并且可能包含重大更改，因此请确保将webpack的版本修复为次要版本，例如webpack: ~5.4.3而不是webpack: ^5.4.3或者在使用实验时使用锁定文件。<br />
   * 2、禁用所有实验性功能：experiments: false。<br />
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
     * 该实验性选项启用会导致HMR无效！！！开始可用版本：5.49.0+，启用后，webpack可以构建以http(s):协议开头的远程资源，切记远程资源的url一定得是带明确的文件扩展后缀名，不然没法被各自的loader处理，从而webpack报处理错误。<br />
     * 1、启用后的使用例子：import pMap1 from 'https://cdn.skypack.dev/p-map.js';<br />
     * 2、当前个人通过编码已经支持了可以在CSS文件中加载无文件扩展后缀名的图片类远程资源，但是其返回的响应头中必须准确设置该图片的content-type，这个由服务器设置的，一般都会准确的。<br />
     * 3、除了设置成Boolean值，还可以是更加详细的Object值：<br />
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
        uri => {
          // experiments.buildHttp.allowedUris.uri--->http://huyaimg.msstatic.com/avatar/1095/ea/540f76f690f002fde18957f5ac920f_180_135.jpg
          console.log( `experiments.buildHttp.allowedUris.uri--->${ uri }` );

          return true;
        },
      ],
      cacheLocation: resolve( __dirname, `./webpack_location/${ env_platform }/cache_lockfile/` ),
      frozen: isProduction,
      lockfileLocation: resolve( __dirname, `./webpack_location/${ env_platform }/lockfile.lock` ),
      upgrade: !isProduction,
    },
    /**
     * 启用未更改的模块的额外内存缓存，并且仅引用未更改的模块。<br />
     * 1、默认值同futureDefaults的值。<br />
     */
    cacheUnaffected: true,
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
   */
  externalsConfig = {
    // echarts: 'window.echarts',
  },
  /**
   * 在单独的进程上运行typescript类型检查器的Webpack插件。该插件我们最好只做语法检查，不做其他事情，其他事情交由ts-loader之类的工具去做。<br />
   * 1、如果您使用ts-loader < 9.3.0，请添加transpileOnly: true。<br />
   * 2、请务必注意，此插件使用TypeScript，而不是webpack的模块解析。这意味着您必须正确设置tsconfig.json。<br />
   * 3、这是因为性能——使用TypeScript的模块解析，我们不必等待webpack编译文件。<br />
   * 4、要调试TypeScript的模块解析，可以使用tsc --traceResolution命令（会打印出详细的模块解析信息）。<br />
   * 5、这个插件使用cosmiconfig。这意味着除了插件构造函数之外，您还可以将配置放在：<br />
   * package.json 中的“fork-ts-checker”字段。<br />
   * JSON或YAML格式的.fork-ts-checkerrc文件。<br />
   * 导出JS对象的fork-ts-checker.config.js文件。<br />
   * 6、传递给插件构造函数的选项将覆盖cosmiconfig中的选项（使用deepmerge）。<br />
   */
  forkTsCheckerWebpackPluginConfig = {
    // 如果为true，则在完成webpack的编译后报告问题。因此，它不会阻止编译。仅在"watch"模式下使用。
    async: !isProduction,
    typescript: {
      // 检查器进程的内存限制（以MB为单位）。如果进程退出并出现分配失败错误，请尝试增加此数字。
      memoryLimit: 10 * 1024,
      // tsconfig.json的路径。默认情况下，插件使用上下文或process.cwd()来本地化tsconfig.json文件。
      configFile: resolve( __dirname, './tsconfig.json' ),
      context: resolve( __dirname, './' ),
      // 相当于tsc命令的--build标志。该插件我们最好只做语法检查，不做其他事情，其他事情交由ts-loader之类的工具去做。
      build: false,
      /**
       * 该插件我们最好只做语法检查，不做其他事情，其他事情交由ts-loader之类的工具去做。有4个内置字符串值："readonly"、"write-tsbuildinfo"、"write-dts"、"write-references"。<br />
       * 1、如果您不想在磁盘上写入任何内容，请使用readonly。<br />
       * 2、write-dts仅写入.d.ts文件，write-tsbuildinfo仅写入.tsbuildinfo文件。<br />
       * 3、write-references用于编写项目引用的.js和.d.ts文件（最后2种模式需要build:true）。<br />
       * 4、如果使用“babel-loader”，建议使用"write-references"模式来提高初始编译时间。如果使用“ts-loader”，建议使用"write-tsbuildinfo"模式，以不覆盖“ts-loader”发出的文件。<br />
       * 5、默认值：build === true ? 'write-tsbuildinfo' ? 'readonly'。<br />
       */
      mode: 'readonly',
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
      // TypeScript检查器扩展的选项（typescript.extensions选项对象）。
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
      // 测量并打印与TypeScript性能相关的计时。
      profile: false,
      // 如果提供，这是可以在其中找到TypeScript的自定义路径。
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
        message: '来自forkTsCheckerWebpackPlugin.formatter.options.message',
      },
    },
    logger: 'webpack-infrastructure',
    // 如果设置为false，则不会向Webpack Dev Server报告错误。
    devServer: !isProduction,
  },
  /**
   * 该插件将通知您第一次运行（成功/失败）、所有失败的运行以及从构建失败中恢复后的第一次成功运行。换句话说：如果您的构建一切正常，它将保持沉默。<br />
   * 1、带插件必须依赖forkTsCheckerWebpackPlugin，在forkTsCheckerWebpackPlugin之后执行。<br />
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
   */
  htmlWebpackPluginConfig = HTMLWebpackPluginConfig( {
    isProduction,
    isSPA,
    HTMLMinifyConfig,
  } ),
  /**
   * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
   * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
   * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
   * 3、不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。。<br />
   */
  miniCssExtractPluginConfig = {
    // 此选项确定每个输出CSS文件的名称。
    filename: 'styles/[name]_[contenthash].css',
    /**
     * 此选项确定非入口块文件的名称。<br />
     * 1、将chunkFilename指定为函数仅在webpack@5中可用。<br />
     */
    chunkFilename: 'styles/[name]_Chunk_[contenthash].css',
    // 启用以删除有关顺序冲突的警告。对于通过一致使用范围或命名约定来减轻css排序的项目，可以通过将插件的ignoreOrder标志设置为true来禁用css顺序警告。
    ignoreOrder: false,
  },
  /**
   * 以下选项表示是否填充或模拟某些Node.js的全局变量。<br />
   * 1、此功能由webpack内部的NodeStuffPlugin插件提供。<br />
   * 2、从webpack 5开始，只能在node选项下配置global、__filename、__dirname。<br />
   * 3、如果正在寻找如何在webpack 5下的Node.js中以类似方式填充fs等等node模块，请查看resolve.fallback以获取帮助。<br />
   * 4、从webpack 3.0.0开始，可以将node选项直接设置为false以完全关闭NodeStuffPlugin插件。<br />
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
   *   dynamicImportMode：string（只有4个内置值：'eager'、'weak'、'lazy'、'lazy-once'），5.73.0+开始支持，指定动态导入的全局模式。<br />
   *   
   *   dynamicImportPrefetch：boolean、number，5.73.0+开始支持，指定动态导入的全局预取。<br />
   *   
   *   dynamicImportPreload：boolean、number，5.73.0+开始支持，指定动态导入的全局预加载。<br />
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
   */
  moduleConfig = ( {
    MiniCssExtractPlugin = null,
  } = {} ) => {
    const cssLoader_url_import_IgnoreArr1 = [
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

    return {
      generator: {
        asset: {
          filename: '[name]_[contenthash][ext]',
          outputPath: './assets/',
          publicPath: '../assets/',
        },
        'asset/resource': {
          filename: '[name]_[contenthash][ext]',
          outputPath: './assets/',
          publicPath: '../assets/',
        },
      },
      parser: {
        javascript: {
          commonjs: true,
          commonjsMagicComments: true,
          dynamicImportMode: 'lazy',
          dynamicImportPrefetch: true,
          dynamicImportPreload: true,
          exportsPresence: 'error',
          exprContextCritical: true,
          exprContextRecursive: true,
          exprContextRegExp: false,
          exprContextRequest: '.',
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
          requireJs: true,
          strictThisContextOnImports: true,
          system: true,
          url: 'relative',
        },
        'javascript/auto': {
          commonjs: true,
          commonjsMagicComments: true,
          dynamicImportMode: 'lazy',
          dynamicImportPrefetch: true,
          dynamicImportPreload: true,
          exportsPresence: 'error',
          exprContextCritical: true,
          exprContextRecursive: true,
          exprContextRegExp: false,
          exprContextRequest: '.',
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
          requireJs: true,
          strictThisContextOnImports: true,
          system: true,
          url: 'relative',
        },
        'javascript/dynamic': {
          commonjs: false,
          commonjsMagicComments: false,
          dynamicImportMode: 'lazy',
          dynamicImportPrefetch: true,
          dynamicImportPreload: true,
          exportsPresence: 'error',
          exprContextCritical: true,
          exprContextRecursive: true,
          exprContextRegExp: false,
          exprContextRequest: '.',
          harmony: true,
          import: true,
          importExportsPresence: 'error',
          importMeta: true,
          importMetaContext: true,
          node: nodeConfig,
          reexportExportsPresence: 'error',
          requireContext: false,
          requireEnsure: false,
          requireInclude: false,
          requireJs: false,
          strictThisContextOnImports: true,
          system: false,
          url: 'relative',
        },
        'javascript/esm': {
          commonjs: false,
          commonjsMagicComments: false,
          dynamicImportMode: 'lazy',
          dynamicImportPrefetch: true,
          dynamicImportPreload: true,
          exportsPresence: 'error',
          exprContextCritical: true,
          exprContextRecursive: true,
          exprContextRegExp: false,
          exprContextRequest: '.',
          harmony: true,
          import: true,
          importExportsPresence: 'error',
          importMeta: true,
          importMetaContext: true,
          node: nodeConfig,
          reexportExportsPresence: 'error',
          requireContext: false,
          requireEnsure: false,
          requireInclude: false,
          requireJs: false,
          strictThisContextOnImports: true,
          system: false,
          url: 'relative',
        },
      },
      unsafeCache: false,
      rules: [
        // html-loader，将HTML导出为字符串。当编译器需要时，HTML会被最小化。
        {
          test: /\.(htm|html|xhtml)$/i,
          /**
           * 当使用“webpack 5”时，需要这个属性，否则后面的“vue-loader”会报错！<br />
           * 1、对于“vue-loader”而言，只要这个值不会被转换成“假值”就能成功使用“vue-loader”。<br />
           */
          enforce: 'pre',
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: true,
                minimize: HTMLMinifyConfig,
                // 该loader的该选项默认值是true。
                // esModule: true,
              },
            },
          ],
          include: [
            resolve( __dirname, './src/' ),
          ],
          exclude: [
            resolve( __dirname, './src/assets/' ),
            resolve( __dirname, './src/graphQL/' ),
            resolve( __dirname, './src/pwa_manifest/' ),
            resolve( __dirname, './src/tools/' ),
            resolve( __dirname, './src/static/' ),
            resolve( __dirname, './src/styles/' ),
            resolve( __dirname, './src/template/ejs/' ),
            resolve( __dirname, './src/wasm/' ),
            resolve( __dirname, './src/workers/' ),
          ],
        },
        // ejs-loader。
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
            resolve( __dirname, './src/' ),
          ],
          exclude: [
            resolve( __dirname, './src/assets/' ),
            resolve( __dirname, './src/graphQL/' ),
            resolve( __dirname, './src/pwa_manifest/' ),
            resolve( __dirname, './src/tools/' ),
            resolve( __dirname, './src/static/' ),
            resolve( __dirname, './src/styles/' ),
            resolve( __dirname, './src/template/html/' ),
            resolve( __dirname, './src/wasm/' ),
            resolve( __dirname, './src/workers/' ),
          ],
        },
        // vue-loader。
        {
          test: /\.vue$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'vue-loader',
              options: {
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
                compilerOptions: {
                  whitespace: !isProduction
                              ? 'preserve'
                              : 'condense',
                },
                transpileOptions: {
                  target: vue_loader_options_transpileOptions_target,
                  // transforms里的选项值，true表示转换特性，false表示直接使用该特性。
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
                  // 对于IE 8需要将它设置成namedFunctionExpressions: false。
                  namedFunctionExpressions: true,
                },
                prettify: !isProduction,
                exposeFilename: !isProduction,
                // vue-loader v16+才有的选项。Start
                /**
                 * 在使用Vue的反应性API时，引入一组编译器转换来改善人体工程学，特别是能够使用没有.value的refs。<br />
                 * 1、具体可阅https://github.com/vuejs/rfcs/discussions/369 <br />
                 * 2、仅在SFC中生效。<br />
                 */
                reactivityTransform: true,
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
              },
            },
          ],
          include: [
            resolve( __dirname, './src/' ),
          ],
          exclude: [
            resolve( __dirname, './src/assets/' ),
            resolve( __dirname, './src/graphQL/' ),
            resolve( __dirname, './src/pwa_manifest/' ),
            resolve( __dirname, './src/tools/' ),
            resolve( __dirname, './src/static/' ),
            resolve( __dirname, './src/styles/' ),
            resolve( __dirname, './src/template/ejs/' ),
            resolve( __dirname, './src/template/html/' ),
            resolve( __dirname, './src/wasm/' ),
            resolve( __dirname, './src/workers/' ),
          ],
        },
        // 处理ts、tsx。
        {
          test: /\.ts(x?)$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            {
              loader: 'ts-loader',
              options: {
                // true表示禁用类型检查器-我们将在"fork-ts-checker-webpack-plugin"插件中使用类型检查。
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
                ],
                // 允许使用非官方的TypeScript编译器。应该设置为编译器的NPM名称，例如：ntypescript（已死！）。
                compiler: 'typescript',
                // 允许您指定在哪里可以找到TypeScript配置文件。
                configFile: resolve( __dirname, './tsconfig.json' ),
                colors: true,
                appendTsSuffixTo: [],
                appendTsxSuffixTo: [],
                onlyCompileBundledFiles: true,
                allowTsInNodeModules: false,
                context: resolve( __dirname, './' ),
                experimentalFileCaching: true,
                projectReferences: true,
              },
            },
          ],
          include: [
            resolve( __dirname, './src/' ),
          ],
          exclude: [
            resolve( __dirname, './src/assets/' ),
            resolve( __dirname, './src/graphQL/' ),
            resolve( __dirname, './src/pwa_manifest/' ),
            resolve( __dirname, './src/static/' ),
            resolve( __dirname, './src/styles/' ),
            resolve( __dirname, './src/template/ejs/' ),
            resolve( __dirname, './src/template/html/' ),
            resolve( __dirname, './src/wasm/' ),
          ],
        },
        // 处理css。
        {
          test: /\.css$/i,
          // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
          use: [
            /**
             * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
             * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
             * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
             * 3、不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。。<br />
             */
            isProduction
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // 如果为真，则发出一个文件（将文件写入文件系统）。如果为false，插件将提取CSS，但不会发出文件。对服务器端包禁用此选项通常很有用。
                  emit: true,
                  // 该loader的该选项默认值是true。
                  // esModule: true,
                },
              }
            : {
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
            {
              loader: 'css-loader',
              options: {
                /**
                 * 在css文件中使用webpack设置好的路径别名时，需要用~打头，然后才是webpack设置好的路径别名，如：url(~xxxAlias/image.png)。<br />
                 * 1、允许过滤url()。所有过滤的url()都不会被解析（在编写时留在代码中）。<br />
                 * 2、函数里返回true表示处理，返回false就是不处理，其原样留在代码里。<br />
                 * 3、可以在此url()函数中使用相对地址。相对地址相对于CSS样式表的URL（而不是网页的URL）。<br />
                 */
                // 使用，/* webpackIgnore: true */，魔术注释来开启禁用url()解析。
                url: {
                  /**
                   * 允许过滤url()。所有过滤的url()都不会被解析（在编写时留在代码中）。<br />
                   * 1、在css文件中使用webpack设置好的路径别名时，需要用~打头，然后才是webpack设置好的路径别名，如：url(~xxxAlias/image.png)。<br />
                   * 2、函数里返回true表示处理，返回false就是不处理，其原样留在代码里。<br />
                   * 3、可以在此url()函数中使用相对地址。相对地址相对于CSS样式表的URL（而不是网页的URL）。<br />
                   *
                   * @param url string 资源的url，值形如：../static/ico/favicon.ico、http://www.xxx.com/1.jpg、~imgDir/ico_48_48.png。<br />
                   *
                   * @param resourcePath string css文件的路径，值形如：G:\WebStormWS\web-project-template\src\pages\hello_world\HelloWorld.css。<br />
                   *
                   * @returns {boolean} 函数里返回true表示处理，返回false就是不处理，其原样留在代码里。
                   */
                  filter: ( url, resourcePath ) => {
                    const boo = cssLoader_url_import_IgnoreArr1.some( item => String( url ).trim().startsWith( item ) );

                    if( boo ){
                      console.log( `
                    \n\ncss-loader_url_filter_url--->${ url }
                    true表示处理，false表示不处理：false。
                    \n\n
                    ` );

                      return false;
                    }
                    else{
                      console.log( `
                    \n\ncss-loader_url_filter_url--->${ url }
                    true表示处理，false表示不处理：true。
                    \n\n
                    ` );

                      return true;
                    }
                  },
                },
                import: {
                  filter: ( url, media, resourcePath ) => {
                    const boo = cssLoader_url_import_IgnoreArr1.some( item => String( url ).trim().startsWith( item ) );

                    if( boo ){
                      console.log( `
                    \n\ncss-loader_import_filter_url--->${ url }
                    true表示处理，false表示不处理：false。
                    \n\n
                    ` );

                      return false;
                    }
                    else{
                      console.log( `
                    \n\ncss-loader_import_filter_url--->${ url }
                    true表示处理，false表示不处理：true。
                    \n\n
                    ` );

                      return true;
                    }
                  },
                },
                importLoaders: 0,
                sourceMap: false,
                // 该loader的这个选项默认值是true，并且，在启用experiments.buildHttp后，要想CSS文件里的远程资源能自动被各自对应的loader处理，就必须将该选项设置为true。
                // esModule: true,
              },
            },
          ],
          include: [
            resolve( __dirname, './src/' ),
          ],
          exclude: [
            resolve( __dirname, './src/assets/' ),
            resolve( __dirname, './src/graphQL/' ),
            resolve( __dirname, './src/pwa_manifest/' ),
            resolve( __dirname, './src/tools/' ),
            resolve( __dirname, './src/static/' ),
            resolve( __dirname, './src/styles/less/' ),
            resolve( __dirname, './src/styles/postcss/' ),
            resolve( __dirname, './src/styles/sass/' ),
            resolve( __dirname, './src/styles/scss/' ),
            resolve( __dirname, './src/styles/stylus/' ),
            resolve( __dirname, './src/wasm/' ),
            resolve( __dirname, './src/workers/' ),
          ],
          sideEffects: true,
        },
        // 处理image。
        {
          test: /\.(jng|bmp|dcx|gif|icns|ico|jbig2|jpe|jpeg|jpg|pam|pbm|pcx|pgm|png|pnm|ppm|psd|rgbe|tga|tif|tiff|wbmp|xbm|xpm|svg|svgz|webp|heif|heic)$/i,
          /**
           * asset/resource：发出一个单独的文件并导出URL。以前可以通过使用file-loader来实现。<br />
           * asset/inline：导出资产的data URI。以前可以通过使用url-loader来实现。<br />
           * asset/source：导出资产的源代码。以前可以通过使用raw-loader实现。<br />
           * asset：自动在导出data URI和发出单独文件之间进行选择。以前可以通过使用带有资产大小限制的url-loader来实现。<br />
           */
          type: 'asset',
          parser: {
            dataUrlCondition: {
              // 单位字节，设置为10KB。
              maxSize: 10 * 1024,
            },
          },
          generator: {
            dataUrl: {
              encoding: 'base64',
            },
            emit: true,
            filename: '[name]_[contenthash][ext]',
            outputPath: './img/',
            publicPath: '../img/',
          },
          include: [
            resolve( __dirname, './src/' ),
          ],
          exclude: [
            resolve( __dirname, './src/assets/doc/' ),
            resolve( __dirname, './src/assets/fonts/' ),
            resolve( __dirname, './src/assets/music/' ),
            resolve( __dirname, './src/assets/videos/' ),
            resolve( __dirname, './src/graphQL/' ),
            resolve( __dirname, './src/pwa_manifest/' ),
            resolve( __dirname, './src/static/' ),
            resolve( __dirname, './src/styles/' ),
            resolve( __dirname, './src/tools/' ),
            resolve( __dirname, './src/wasm/' ),
            resolve( __dirname, './src/workers/' ),
          ],
        },
      ],
    };
  },
  optimizationConfig = isProduction
                       ? {
      nodeEnv: 'production',
      minimize: true,
      minimizer: [
        // 对于webpack@5，您可以使用`...`语法来扩展现有的最小化程序（即 `terser-webpack-plugin`）。
        '...',
        /*
         new TerserPlugin( {
         test: /\.css$/i,
         parallel: cpus().length - 1,
         terserOptions: {
         format: {
         comments: false,
         },
         },
         extractComments: false,
         } ),
         */
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
          minify: CssMinimizerPlugin.esbuildMinify,
          /**
           * 如果启用了并行化，则必须通过字符串（packageName或require.resolve(packageName)）来要求minimizerOptions中的包。在这种情况下，我们不应该使用require/import。<br />
           * 1、minify跟minimizerOptions是一对一的关系，具体要看文档。<br />
           * 2、CssMinimizerPlugin.esbuildMinify对应的minimizerOptions选项的配置见https://esbuild.github.io/api/#transform-api。<br />
           */
          minimizerOptions: {
            loader: 'css',
            /**
             * minify: true等同于同时设置了：<br />
             * 1、minifyWhitespace: true、minifyIdentifiers: true、minifySyntax: true。<br />
             */
            minify: true,
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
            sourcemap: false,
            /**
             * 每个目标环境都是一个环境名称，后跟一个版本号。当前支持以下环境名称：<br />
             * 1、chrome、edge、firefox、hermes、ie、ios、node、opera、rhino、safari。<br />
             * 2、还可以是这样的：es2020、esnext、node12、node12.19.0、es5、es6。<br />
             */
            target: esbuildMinify_target,
            charset: 'utf8',
            color: true,
            logLevel: 'error',
            logOverride: {
              'css-syntax-error': 'error',
              'invalid-@charset': 'error',
              'invalid-@import': 'error',
              'invalid-@nest': 'error',
              'invalid-@layer': 'error',
              'invalid-calc': 'error',
              'js-comment-in-css': 'silent',
              'unsupported-@charset': 'error',
              'unsupported-@namespace': 'error',
              'unsupported-css-property': 'error',
            },
          },
        } ),
        new JsonMinimizerPlugin( {
          test: /\.json$/i,
          minimizerOptions: {
            replacer: null,
            space: null,
          },
        } ),
      ],
      runtimeChunk: {
        name: ( { name } ) => `RuntimeChunk_${ name }`,
      },
    }
                       : {
      nodeEnv: 'development',
      minimize: false,
      runtimeChunk: {
        name: ( { name } ) => `RuntimeChunk_${ name }`,
      },
    },
  outputConfig = {
    /**
     * 与output.filename相同，但用于资产模块。<br />
     */
    assetModuleFilename: 'assets/[name]_[contenthash][ext]',
    charset: false,
    /**
     * 此选项确定非初始块文件的名称。如，那些动态导入的JS文件。<br />
     * 1、请注意，这些文件名需要在运行时生成以发送对块的请求。<br />
     */
    chunkFilename: 'js/[name]_Chunk_[contenthash].js',
    /**
     * 块的格式，默认块的格式包括：'array-push'(web/WebWorker)、'commonjs'(node.js)，但其他格式可能由插件添加。<br />
     */
    chunkFormat: 'array-push',
    /**
     * 块请求过期前的毫秒数。从webpack 2.6.0开始支持此选项。<br />
     */
    chunkLoadTimeout: 120000,
    /**
     * 加载块的方法，默认包括的方法：'jsonp'（web）、'import'（ESM）、'importScripts'（WebWorker）、'require'（同步node.js）、'async-node'（异步node.js），但其他可能由插件添加。<br />
     */
    chunkLoading: 'jsonp',
    /**
     * 在发出之前清理输出目录，不要用这个选项，用clean-webpack-plugin插件，因为用这个选项，无法设置排除项。<br />
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
     */
    crossOriginLoading: 'anonymous',
    /**
     * 告诉webpack在生成的运行时代码中可以使用哪种ES特性。<br />
     */
    environment: {
      /**
       * The environment supports arrow functions ('() => { ... }').<br />
       */
      arrowFunction: true,
      /**
       * The environment supports BigInt as literal (123n).<br />
       */
      bigIntLiteral: true,
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
       * The environment supports 'for of' iteration ('for (const x of array) { ... }').<br />
       */
      forOf: true,
      /**
       * The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').<br />
       */
      module: true,
      /**
       * The environment supports optional chaining ('obj?.a' or 'obj?.()').<br />
       */
      optionalChaining: true,
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
     */
    filename: 'js/[name]_Bundle_[contenthash].js',
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
     * 3、此选项指定在浏览器中引用时输出目录的公共URL。相对URL是相对于HTML页面（或<base>标记）解析的。服务器相对URL、协议相对URL或绝对URL也是可能的，有时是必需的，即，如，在CDN上托管资产时。<br />
     * 4、这个值设置需要注意！'./'、'../'这种尤其注意！！！并不会都如期望的那样。<br />
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
    sourceMapFilename: 'js/[name]_Map_[sha512:contenthash:hex:16].map',
    /**
     * 设置加载WebAssembly模块的方法的选项。默认包含的方法是'fetch' (web/WebWorker)、'async-node' (Node.js)，但其他方法可能由插件添加。<br />
     * 1、默认值会受到不同目标的影响：
     * Defaults to 'fetch' if target is set to 'web', 'webworker', 'electron-renderer' or 'node-webkit'.<br />
     * Defaults to 'async-node' if target is set to 'node', 'async-node', 'electron-main' or 'electron-preload'.<br />
     */
    wasmLoading: 'fetch',
    /**
     * 新选项workerChunkLoading控制worker的块加载。<br />
     * 1、有效值：'require'、'import-scripts'、'async-node'、'import'、'universal'、false。<br />
     */
    workerChunkLoading: 'import-scripts',
  },
  /**
   * 这些选项允许您控制webpack如何通知您超出特定文件限制的资产和入口点。此功能的灵感来自webpack性能预算的想法。<br />
   * 1、配置性能提示的显示方式。例如，如果您的资产超过250kb，webpack将发出警告通知您。<br />
   * 2、设置为false时，直接关闭该功能。<br />
   */
  performanceConfig = {
    assetFilter( assetFilename ){
      const boo1 = /\.(jng|bmp|dcx|gif|icns|ico|jbig2|jpe|jpeg|jpg|pam|pbm|pcx|pgm|png|pnm|ppm|psd|rgbe|tga|tif|tiff|wbmp|xbm|xpm|svg|svgz|webp|heif|heic)$/i.test( assetFilename ),
        boo2 = /\.(eot|otf|fon|font|ttf|ttc|woff|woff2)$/i.test( assetFilename ),
        boo3 = /\.(js|ts|tsx|mjs|mts|cjs|cts|css|less|scss|sass|styl|stylus|pcss|postcss|html|htm|ejs|vue|json|json5|xml|txt|toml|yaml|csv|wasm|graphql|graphqls|gql)$/i.test( assetFilename );

      return boo1 || boo2 || boo3;
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
    maxAssetSize: 10485760,
    /**
     * 入口点表示将在特定条目的初始加载时间期间使用的所有资产。此选项控制webpack何时根据最大入口点大小（以bytes为单位）发出性能提示。<br />
     * 1、5 * 1024 * 1024 = 5242880，设置成5MB。<br />
     */
    maxEntrypointSize: 10485760,
  },
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
   */
  providePluginConfig = {
    axios: 'axios',
    echarts: 'echarts',
    /**
     * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
     * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
     */
    ELEMENT: 'element-ui',
    ElementPlus: 'element-plus',
    $: 'jquery',
    jQuery: 'jquery',
    'window.$': 'jquery',
    'window.jQuery': 'jquery',
    Swiper: 'swiper',
    /**
     * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
     * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
     */
    Vue: 'vue',
    VueRouter: 'vue-router',
    Vuex: 'vuex',
  },
  /**
   * 使用此选项生成一个JSON文件，其中包含webpack“记录”——用于跨多个构建存储模块标识符的数据片段。您可以使用此文件来跟踪模块在构建之间的变化。<br />
   * 1、如果您有一个利用代码拆分的复杂设置，则记录特别有用。该数据可用于确保拆分包实现您需要的缓存行为。<br />
   * 2、请注意，尽管此文件是由编译器生成的，但您可能仍希望在源代码管理中对其进行跟踪，以保留其随时间变化的历史记录。<br />
   * 3、设置recordsPath本质上会将recordsInputPath和recordsOutputPath设置为相同的位置。这通常是所有必要的，除非您决定更改包含记录的文件的名称。<br />
   */
  recordsPathConfig = folderName => {
    const nowDate = new Date( Date.now() ),
      year = nowDate.getFullYear(),
      month = String( nowDate.getMonth() + 1 ).padStart( 2, '0' ),
      date = String( nowDate.getDate() ).padStart( 2, '0' ),
      hours = String( nowDate.getHours() ).padStart( 2, '0' ),
      minutes = String( nowDate.getMinutes() ).padStart( 2, '0' ),
      seconds = String( nowDate.getSeconds() ).padStart( 2, '0' ),
      day0 = Number( nowDate.getDay() ),
      day = day0 === 0
            ? '日'
            : day0,
      recordsPath = `./webpack_records/${ folderName }/Records_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒(周${ day }).json5`;

    return join( __dirname, recordsPath );
  },
  /**
   * 指示webpack以特定环境为目标，当没有找到browserslist配置时，默认为“browserslist”或“web”。<br />
   * 1、值格式：string、[ string ]、false，如：[ 'web', 'es2022', ]。<br />
   * 2、当传递多个目标时，将使用公共特征子集：[ 'web', 'es2022', ]，目前，并非所有目标都可能是混合的。<br />
   * 3、当没有提供有关“target”或“environment features”的信息时，将使用“es2015”。<br />
   */
  targetConfig = [
    'web',
    'es2022',
  ],
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
  isProduction,
  isSPA,
  env_platform,
  watchIgnoredArr,

  aliasConfig,
  assetsWebpackPluginConfig,
  cleanWebpackPluginConfig,
  copyPluginConfig,
  definePluginConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  externalsConfig,
  forkTsCheckerWebpackPluginConfig,
  forkTsCheckerNotifierWebpackPluginConfig,
  htmlWebpackPluginConfig,
  miniCssExtractPluginConfig,
  moduleConfig,
  nodeConfig,
  optimizationConfig,
  outputConfig,
  performanceConfig,
  providePluginConfig,
  recordsPathConfig,
  targetConfig,
  watchOptionsConfig,
};

export default {
  Get__dirname,
  Get__filename,

  __dirname,
  isProduction,
  isSPA,
  env_platform,
  watchIgnoredArr,

  aliasConfig,
  assetsWebpackPluginConfig,
  cleanWebpackPluginConfig,
  copyPluginConfig,
  definePluginConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  externalsConfig,
  forkTsCheckerWebpackPluginConfig,
  forkTsCheckerNotifierWebpackPluginConfig,
  htmlWebpackPluginConfig,
  miniCssExtractPluginConfig,
  moduleConfig,
  nodeConfig,
  optimizationConfig,
  outputConfig,
  performanceConfig,
  providePluginConfig,
  recordsPathConfig,
  targetConfig,
  watchOptionsConfig,
};
