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
 */

'use strict';

import {
  dirname,
  join,
  resolve,
} from 'node:path';

import {
  argv,
  env,
} from 'node:process';

import {
  fileURLToPath,
} from 'node:url';

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
  /**
   * isProduction的值为true时表示生成环境，反之开发环境。<br />
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

        throw new Error( 'CLI参数中紧跟在“--mode”之后的，只能是development、production。' );
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
  isSPA = true,
  /**
   * node_env的值是字符串，有4个值：'dev_server'、'local_server'、'test'、'production'，来源是CLI参数。<br />
   */
  node_env = env.NODE_ENV;

/**
 * 设置路径别名。<br />
 * 1、resolve.alias优先于其他模块解析。<br />
 * 2、路径别名到底是路径别名，别用于直接指向具体的文件，尤其是JS文件，因为会导致无法根据导入语法的不同自行加载到相应的模块文件，致使报错；但是CSS一类的文件倒是可以直接指向到具体的文件。<br />
 * 3、为第三方包设置别名时，只能是以包名开始，其他任何都不行，因为webpack会自动从“node_modules”中查找，包括：“./”、“./node_modules/”、“node_modules/”等等都是不行的，当然如果是指向自己的模块文件夹，那还是要指定完整路径。<br />
 * 4、也可以指定完整路径：xxx: path.resolve(path.join(__dirname, 'src/module1'))。<br />
 */
const aliasConfig = {
    'element-ui_css': 'element-ui/lib/theme-chalk/index.css',
    'element-plus_css': 'element-plus/dist/index.css',
    swiper_css: 'swiper/swiper-bundle.min.css',
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
   * 1、有效值类型有2种：boolean（true表示启用，false表示禁用）、object。<br />
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
   *   webSocketURL：此选项允许指 Web套接字服务器的URL（当您代理开发服务器并且客户端脚本并不总是知道连接到哪里时很有用）。<br />
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
   * 
   * }<br />
   * 
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
   * ：。<br />
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
    devMiddleware:{
      
    },
    webSocketServer: 'ws',
  },
  entryConfig = {},
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
     * 开始可用版本：5.49.0+，启用后，webpack可以构建以http(s):协议开头的远程资源。<br />
     * 1、启用后的使用例子：import pMap1 from 'https://cdn.skypack.dev/p-map';<br />
     * 2、除了设置成Boolean值，还可以是更加详细的Object值：<br />
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
        new RegExp( /^http(s)?:\/\/([\w.]+\/?)\S*/ ),
      ],
      cacheLocation: join( __dirname, `./webpack_location/lockfile_cache/${ node_env }/` ),
      frozen: true,
      lockfileLocation: join( __dirname, `./webpack_location/lockfile_cache/${ node_env }/` ),
      upgrade: true,
    },
    /**
     * 启用未更改的模块的额外内存缓存，并且仅引用未更改的模块。<br />
     * 1、默认值同futureDefaults的值。<br />
     */
    cacheUnaffected: true,
    /**
     * 启用原生CSS支持。请注意，它是一个仍在开发中的实验性功能，将在webpack v6中默认启用，但是您可以在GitHub上跟踪进度。<br />
     */
    css: true,
    /**
     * 使用下一个主要webpack的默认值，并在任何有问题的地方显示警告。<br />
     */
    futureDefaults: true,
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
      recordsPath = `./webpack_location/records/${ folderName }/Records_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒(周${ day }).json5`;

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
  node_env,

  aliasConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  externalsConfig,
  nodeConfig,
  performanceConfig,
  providePluginConfig,
  recordsPathConfig,
  targetConfig,
  watchIgnoredArr,
  watchOptionsConfig,
};

export default {
  Get__dirname,
  Get__filename,

  __dirname,
  isProduction,
  isSPA,
  node_env,

  aliasConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  externalsConfig,
  nodeConfig,
  performanceConfig,
  providePluginConfig,
  recordsPathConfig,
  targetConfig,
  watchIgnoredArr,
  watchOptionsConfig,
};
