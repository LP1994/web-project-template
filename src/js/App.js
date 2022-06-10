/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

'use strict';

/*
 单页面路由管理、多页面路由管理
 每个页面对应着这个页面所拥有的.js文件
 */

/**
 * 是否是单页面应用程序(SPA)，默认true表示是单页面应用程序(SPA)，false表示是多页面应用程序(MPA)
 * 注：
 * 这个值决定webpack.BaseConfig.js中splitChunks_obj.cacheGroups如何拆分代码块，
 * 这个值决定HTMLConfig.js中的哪些htmlWebpackPlugin配置被使用，
 * true(表示单页应用)只会启用第一个配置的htmlWebpackPlugin，
 * false(表示多页应用)则会启用全部配置的htmlWebpackPlugin
 *
 * @type {boolean} boolean
 */
const isSPA_booC = true,
    /**
     * 页面路由管理对象，配置对象
     * 如：
     * { '编译完成后这个页面的文件名': [ '这个页面所拥有的.js文件路径' ] }
     *
     * 注：
     * 1、'编译完成后这个页面的文件名'：
     * 也就是configures/HTMLConfig.js中new htmlWebpackPlugin中filename属性对应的属性值'./pages/HelloWorld.html'字符串中的'HelloWorld'
     * 切记，这个文件名必须是唯一的！
     *
     * 2、'这个页面所拥有的.js文件路径'：
     * .js文件路径一般都是在WebProTpl文件夹下的src文件夹里的js文件夹下，所以是以'./src/js/'开头的。
     * 也由于使用这个App.js的webpack.BaseConfig.js在WebProTpl文件夹下，和src文件夹是同一级。
     */
    pageEntry_objC = {
        // webpack 5中新版本的写法！！！
        /*
         a: {
         import: './app/entry-a',
         library: {
         type: 'commonjs-module',
         },
         dependOn: [
         'vendors',
         ],
         filename: 'entries/a.js',
         runtime: 'dashboard',
         chunkLoading: 'jsonp',
         wasmLoading: 'fetch-streaming',

         // webpack v5.33.0新增的
         publicPath: '',
         },
         vendors: [
         'react',
         'react-dom',
         ],
         */

        HelloWorld: {
            // import: string | [ string ]
            import: [
                './src/js/pages/helloWorld/HelloWorld.js',
            ],

            // filename: string，跟使用output.filename一样，默认值用：output.filename
            filename: 'js/[name]_[contenthash:6].js',

            // dependOn: string | [ string ]
            // dependOn: [ '', ],

            // chunkLoading：加载块的方法
            // 使用跟“output.chunkLoading”一致，它的值的数据类型有两类：Boolean、String
            // 可用的Boolean类型的值只有一个：false
            // 可用的String类型的值有：'jsonp'(web)、'import-scripts'(WebWorker)、'require'(sync node.js)、'async-node'(async node.js)
            // 还有一类的String类型的值：由其他插件添加的其他方法
            chunkLoading: 'jsonp',
        },

        XMQAQ: {
            import: [
                './src/js/pages/xmQAQ/XMQAQ.js',
            ],
            filename: 'js/[name]_[contenthash:6].js',
            chunkLoading: 'jsonp',
        },
    };

module.exports = {
    isSPA_booC,
    pageRoutingManagement_obj: isSPA_booC
                               ? ( () => {
            let first_arr = Object.entries( pageEntry_objC )[ 0 ];

            return {
                [ first_arr[ 0 ] ]: first_arr[ 1 ],
            };
        } )()
                               : pageEntry_objC,
};
