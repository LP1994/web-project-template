/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

// process.cwd()输出G:\\WebStormWS\\WebProTpl

'use strict';

let path = require( 'path' ),
    webpack = require( 'webpack' ),
    copyWebpackPlugin = require( 'copy-webpack-plugin' ),
    VueLoaderPlugin = require( 'vue-loader/lib/plugin.js' ),
    AssetsWebpackPlugin = require( 'assets-webpack-plugin' ),
    MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' ),
    ForkTsCheckerNotifierWebpackPlugin = require( 'fork-ts-checker-notifier-webpack-plugin' ),
    ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' ),
    os = require( 'os' ),
    baseConfig = require( './webpack.BaseConfig.js' ),
    htmlConfig = require( './configures/HTMLConfig.js' );

let { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

/*
 process.argv输出就是如下的：
 [
 'D:\\NodeJS\\node.exe',
 'G:\\SNWS\\sn-micro-front-web-project-template\\node_modules\\webpack\\bin\\webpack.js',
 '--mode',
 'production',
 '--config',
 'webpack.Test.js',
 '--progress',
 '--color',
 '--bail',
 '--profile'
 ]
 */
let isPro = process.argv[ 3 ] === 'production',
    define_obj = baseConfig.defineObj_fun( isPro );

define_obj[ 'proCat' ] = '"test"';

module.exports = {
    /*
     针对指定的ECMAScript版本进行编译。示例：es5、es2020。
     string或[ string ]，如：[ 'web', 'es2020', ]
     */
    target: 'web',
    mode: 'production',
    context: path.resolve( __dirname, './' ),
    // devtool: 'source-map',
    entry: baseConfig.entry_obj,
    output: baseConfig.output_fun( {
        path,
        __dirname,
        proName_str: 'test',
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
        new webpack.DefinePlugin( define_obj ),
        new webpack.ProvidePlugin( baseConfig.provide_obj ),

        // 插件顺序很重要。错误的顺序将导致一些钩子未定义并且生成失败
        // new ForkTsCheckerWebpackPlugin( baseConfig.ForkTsCheckerWebpackPlugin_obj ),
        // new ForkTsCheckerNotifierWebpackPlugin( baseConfig.ForkTsCheckerNotifierWebpackPlugin_obj ),

        new VueLoaderPlugin(),
        new webpack.optimize.SplitChunksPlugin( baseConfig.splitChunks_obj ),
        new webpack.ids.DeterministicModuleIdsPlugin( {
            maxLength: 6,
        } ),
        new webpack.ids.DeterministicChunkIdsPlugin( {
            maxLength: 6,
        } ),
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
        new CleanWebpackPlugin( baseConfig.cleanWebpackPluginConfig_fun( 'test', isPro ) ),
        new copyWebpackPlugin( baseConfig.copyWebpackPluginConfig_obj ),
        new AssetsWebpackPlugin( Object.assign( {}, baseConfig.AssetsWebpackPluginOption_obj, {
            keepInMemory: false,
            path: path.resolve( __dirname, `./dist/test/others/` ),
        } ) ),
    ] ),
    optimization: baseConfig.optimization_fun( isPro, true ),
    bail: true,
    // 在webpack 5.0.0的时候，设置成“cache: false”都会报错！！！
    // cache: false,
    watch: false,
    parallelism: os.cpus().length,
    profile: false,
    performance: baseConfig.performance_obj,
    recordsPath: baseConfig.recordsPath_fun( 'test' ),
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
    // 对于webpack-dev-server，此属性必须位于devServer对象中。
    stats: 'errors-warnings',
};
