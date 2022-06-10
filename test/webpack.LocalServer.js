/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

// process.cwd()输出G:\\WebStormWS\\WebProTpl

'use strict';

let webpackLocalServer_obj = require( './configures/GlobalProp.js' ).webpackLocalServer_obj,
    webProName_str = webpackLocalServer_obj.proName_str,
    webProHost_str = webpackLocalServer_obj.localHost_str,
    webProPort_num = webpackLocalServer_obj.localServerPort_num,
    publicPath_str = '/dist/localServer/',
    openPage_str = publicPath_str + 'pages/' + webpackLocalServer_obj.openPage_str;

let fs = require( 'fs' ),
    path = require( 'path' ),
    webpack = require( 'webpack' ),
    copyWebpackPlugin = require( 'copy-webpack-plugin' ),
    VueLoaderPlugin = require( 'vue-loader/lib/plugin.js' ),
    AssetsWebpackPlugin = require( 'assets-webpack-plugin' ),
    MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' ),
    ForkTsCheckerNotifierWebpackPlugin = require( 'fork-ts-checker-notifier-webpack-plugin' ),
    ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' ),
    os = require( 'os' ),
    baseConfig = require( './webpack.BaseConfig.js' ),
    htmlConfig = require( './configures/HTMLConfig.js' ),
    proxyConfig = require( './configures/ProxyConfig.js' );

let { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

/*
 process.argv输出就是如下的：
 [
 'D:\\NodeJS\\node.exe',
 'G:\\SNWS\\sn-micro-front-web-project-template\\node_modules\\webpack\\bin\\webpack.js',
 'serve',
 '--mode',
 'development',
 '--config',
 'webpack.LocalServer.js',
 '--watch',
 '--progress',
 '--color',
 '--bail',
 '--profile'
 ]
 */
let isPro = process.argv[ 4 ] === 'production',
    watchIgnored_arr = baseConfig.watchIgnored_arr,
    watchOptions_obj = baseConfig.watchOptions_obj,
    define_obj = baseConfig.defineObj_fun( isPro );

define_obj[ 'proCat' ] = '"localServer"';

function ResIcon( req, res, url = path.resolve( __dirname, './simServer/staticResources/img/favicon.ico' ) ){
    console.log( '------devServer before------Start' );
    console.log( `客户端的请求URL--->${ req.url }` );
    console.log( '------devServer before------End' );

    res.setHeader( 'Content-Type', 'image/vnd.microsoft.icon' );
    fs.createReadStream( url )
      .pipe( res );
    res.statusCode = 200;
    res.statusMessage = 'OK';
}

module.exports = {
    /*
     针对指定的ECMAScript版本进行编译。示例：es5、es2020。
     string或[ string ]，如：[ 'web', 'es2020', ]
     */
    target: 'web',
    mode: 'development',
    context: path.resolve( __dirname, './' ),
    // devtool: 'eval-cheap-module-source-map',
    entry: baseConfig.entry_obj,
    output: baseConfig.output_fun( {
        path,
        __dirname,
        proName_str: 'localServer',
        // chunkhash hash contenthash
        hashName_str: 'contenthash',
    } ),
    module: {
        rules: baseConfig.moduleRules_fun( {
            path,
            __dirname,
            isPro,
            MiniCSSExtractPlugin,
            noTest_boo: false,
            isESM_boo: true,
        } ),
    },
    resolve: baseConfig.resolve_fun( path, __dirname, isPro ),
    externals: baseConfig.externals_obj,
    plugins: htmlConfig.concat( [
        new webpack.WatchIgnorePlugin( {
            paths: watchIgnored_arr,
            // resourceRegExp: /regExp/,
        } ),
        new webpack.DefinePlugin( define_obj ),
        new webpack.ProvidePlugin( baseConfig.provide_obj ),

        // 插件顺序很重要。错误的顺序将导致一些钩子未定义并且生成失败
        // new ForkTsCheckerWebpackPlugin( baseConfig.ForkTsCheckerWebpackPlugin_obj ),
        // new ForkTsCheckerNotifierWebpackPlugin( baseConfig.ForkTsCheckerNotifierWebpackPlugin_obj ),

        new VueLoaderPlugin(),
        new webpack.optimize.SplitChunksPlugin( baseConfig.splitChunks_obj ),
        /*
         在mini-css-extract-plugin v1.0.0中“reloadAll”、“hmr”、“moduleFilename”已被删除
         从“v1.3.0”中可知，作为插件使用时，只有如下几个有效的配置参数：filename、chunkFilename、ignoreOrder、insert、attributes、linkType。
         */
        new MiniCSSExtractPlugin( {
            // chunkhash hash contenthash
            filename: 'styles/[name]_[contenthash:6].css',
            chunkFilename: 'styles/[name]_chunk_[contenthash:6].css',
            // 启用以删除有关顺序冲突的警告
            ignoreOrder: false,
        } ),
        new CleanWebpackPlugin( baseConfig.cleanWebpackPluginConfig_fun( 'localServer', isPro ) ),
        new copyWebpackPlugin( baseConfig.copyWebpackPluginConfig_obj ),
        new AssetsWebpackPlugin( Object.assign( {}, baseConfig.AssetsWebpackPluginOption_obj, {
            keepInMemory: true,
            path: path.resolve( __dirname, `./dist/localServer/others/` ),
        } ) ),
    ] ),
    optimization: baseConfig.optimization_fun( isPro ),
    bail: true,
    cache: baseConfig.cache_fun( isPro ),
    watch: true,
    watchOptions: watchOptions_obj,
    parallelism: os.cpus().length,
    profile: true,
    performance: baseConfig.performance_obj,
    recordsPath: baseConfig.recordsPath_fun( 'localServer' ),
    experiments: baseConfig.experiments_obj,
    infrastructureLogging: {
        /*
         'none' - disable logging
         'error' - errors only
         'warn' - errors and warnings only
         'info' - errors, warnings, and info messages
         'log' - errors, warnings, info messages, log messages, groups, clears. Collapsed groups are displayed in a collapsed state.
         'verbose' - log everything except debug and trace. Collapsed groups are displayed in expanded state.
         */
        level: 'warn',
    },
    devServer: {
        contentBase: path.join( __dirname, './dist/localServer/' ),
        publicPath: `http://${ webProHost_str }:${ webProPort_num }/${ webProName_str }${ publicPath_str }`,
        host: webProHost_str,
        port: webProPort_num,
        disableHostCheck: true,
        compress: true,
        hot: false,
        hotOnly: false,
        /*
         'info'、'silent'(无声)、'trace(跟踪)'、'debug'、'warn'、'error'、'none'、'warning'
         'none'和'warning'将在下一个主要版本中被弃用。
         */
        clientLogLevel: 'error',
        https: false,
        useLocalIp: false,
        overlay: {
            warnings: true,
            errors: true,
        },
        // 告诉开发服务器禁止显示诸如Webpack捆绑包信息之类的消息。错误和警告仍将显示。
        noInfo: false,
        quiet: false,
        /*
         对于webpack-dev-server，此属性必须位于devServer对象中。
         'none'、'errors-only'、'minimal'(仅在发生错误或新编译时输出)、'normal'、'verbose'、object
         */
        stats: 'minimal',
        watchContentBase: true,
        watchOptions: watchOptions_obj,
        proxy: proxyConfig,
        headers: webpackLocalServer_obj.crossResHeader_obj,
        /*
         将其设置为true以打开默认浏览器。

         也可以提供要使用的浏览器名称，配置写法如: open: 'Google Chrome'

         如果您想在打开浏览器时使用标志，例如打开一个匿名窗口（--incognito标志），可以将“打开”设置为对象。
         对象接受所有打开的选项，应用程序属性必须是数组。
         数组中的第一个元素必须是浏览器名称，下面的其他元素是要使用的标志。
         例如：
         open: {
         app: ['Google Chrome', '--incognito', '--other-flag']
         }

         浏览器应用程序名称取决于平台。不要在可重用模块中对其进行硬编码。
         例如，“Chrome”在macOS上是“Google Chrome”，在Linux上是“google-chrome”，在Windows上是“chrome”。
         */
        open: true,
        // 其值可以是：string、[ string ]
        openPage: webProName_str + openPage_str,
        writeToDisk: false,
        before( app, server, compiler ){
            app.get( '/favicon.ico', ( req, res ) => {
                ResIcon( req, res );
            } );

            app.get( '/apple-touch-icon.png', ( req, res ) => {
                ResIcon( req, res );
            } );

            app.get( '/apple-touch-icon-precomposed.png', ( req, res ) => {
                ResIcon( req, res );
            } );
        },
        after( app, server, compiler ){
        },
        // 当webpack-dev-server开始侦听端口上的连接时，提供执行自定义功能的选项。
        onListening( server ){
            // const port = server.listeningApp.address().port;

            // console.log( `Listening on port: ${ port }` );
        },
    },
};
