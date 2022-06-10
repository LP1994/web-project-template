/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

'use strict';

/**
 * devServer启动时的代理配置
 * 哪里使用：
 * webpack.DevServer.js、webpack.LocalServer.js
 */

// 使用例子：
/*
 JS代码中请求的写法，如：
 目标请求：
 http://sjjx.qqplayerjx.com/m3u8/index.php?url=https://cdn.letv-cdn.com/20181010/OKIYLmGF/index.m3u8
 JS运行的域名：
 http://localhost:8082

 CTO.getJSONAjax( '/m3u8/index.php?url=https://cdn.letv-cdn.com/20181010/OKIYLmGF/index.m3u8', {
 success: ( event, xhr, response ) => {
 console.dir( xhr );
 console.dir( response );
 }
 } );

 配置中对应的写法：
 '/m3u8/*': {
 target: 'http://sjjx.qqplayerjx.com',
 changeOrigin: true,
 router: {
 'http://localhost:8082': 'http://sjjx.qqplayerjx.com'
 },
 }
 */

let proxyConfig_obj = require( './GlobalProp.js' ).proxyConfig_obj,

    webStormPort_num = proxyConfig_obj.webStormPort_num,
    devServerPort_num = proxyConfig_obj.devServerPort_num,
    localServerPort_num = proxyConfig_obj.localServerPort_num,

    localHost_str = proxyConfig_obj.localHost_str,
    headers_obj = proxyConfig_obj.crossResHeader_obj,
    changeOrigin = true,

    webStormTarget_str = `http://${ localHost_str }:${ webStormPort_num }`,
    devServerTarget_str = `http://${ localHost_str }:${ devServerPort_num }`,
    localServerTarget_str = `http://${ localHost_str }:${ localServerPort_num }`,
    simServerTarget_str = `http://localhost:9999`,

    simServerRouter_obj = {
        [ webStormTarget_str ]: simServerTarget_str,
        [ devServerTarget_str ]: simServerTarget_str,
        [ localServerTarget_str ]: simServerTarget_str,
    };

module.exports = {
    // 黄总监的开发服(连公司有线局域网，端口：8087) http://192.168.1.196:8087/graphql
    '/devURL4HZJDev8087A/graphql': {
        pathRewrite: ( path, req ) => '/graphql',
        /*
         pathRewrite: {
         // rewrite path
         // '^/old/api': '/new/api',
         // '^/devURL4HZJDev8087A/graphql': '/graphql',

         // remove path
         // '^/remove/api': '',

         // add base path
         // '^/': '/basepath/',
         },
         */
        /*
         pathRewrite: async ( path, req ) => {
         // const should_add_something = await httpRequestToDecideSomething( path );
         // if( should_add_something ){
         //     path += 'something';
         // }
         // return path;
         },
         */

        target: 'http://192.168.1.196:8087',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.196:8087' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
        /*
         onProxyRes: ( proxyRes, req, res ) => {
         // console.log( 'Proxy------onProxyRes Start------' );
         // console.log( 'Proxy------onProxyRes End------' );
         },
         */
        /*
         onError: ( err, req, res ) => {
         // console.error( 'Proxy------onError Start------' );
         // console.error( 'Proxy------onError End------' );
         },
         */
        /*
         onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
         // console.log( 'Proxy------onProxyReqWs Start------' );
         // console.log( 'Proxy------onProxyReqWs End------' );
         },
         */
        /*
         onOpen: proxySocket => {
         // console.log( 'Proxy------onOpen Start------' );
         // console.log( 'Proxy------onOpen End------' );
         },
         */
        /*
         onClose: ( res, socket, head ) => {
         // console.log( 'Proxy------onClose Start------' );
         // console.log( 'Proxy------onClose End------' );
         },
         */
    },
    // 黄总监的开发服(连刘家敏电脑的无线网络，端口：8087) http://192.168.137.137:8087/graphql
    '/devURL4HZJDev8087B/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.137.137:8087',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.137.137:8087' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket黄总监的开发服(连公司有线局域网，端口：8087) ws://192.168.1.196:8087
    '/ws4DevURL4HZJDev8087A/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.196:8087',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },
    // websocket黄总监的开发服(连刘家敏电脑的无线网络，端口：8087) ws://192.168.137.137:8087
    '/ws4DevURL4HZJDev8087B/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.137.137:8087',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 油罐，黄总监的开发服(连公司有线局域网，端口：8098) http://192.168.1.196:8098/graphql
    '/devURL4HZJDev8098A/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.1.196:8098',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.196:8098' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // 油罐，黄总监的开发服(连刘家敏电脑的无线网络，端口：8098) http://192.168.137.137:8098/graphql
    '/devURL4HZJDev8098B/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.137.137:8098',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.137.137:8098' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // 油罐，websocket黄总监的开发服(连公司有线局域网，端口：8098) ws://192.168.1.196:8098
    '/ws4DevURL4HZJDev8098A/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.196:8098',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },
    // 油罐，websocket黄总监的开发服(连刘家敏电脑的无线网络，端口：8098) ws://192.168.137.137:8098
    '/ws4DevURL4HZJDev8098B/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.137.137:8098',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 开发服务器(连公司有线局域网，端口：8081) http://192.168.1.168:8081/graphql
    '/devURL8081A/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.1.168:8081',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.168:8081' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket开发服务器(连公司有线局域网，端口：8081) ws://192.168.1.168:8081
    '/ws4DevURL8081A/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.168:8081',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 内网穿透 http://sn2020a.nat300.top/graphql
    '/devURL4Natapp/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://sn2020a.nat300.top',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://sn2020a.nat300.top' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket内网穿透 ws://sn2020a.nat300.top
    '/ws4DevURL4Natapp/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://sn2020a.nat300.top',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 测试服务器 http://192.168.1.168:8080/graphql
    '/testURL/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.1.168:8080',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.168:8080' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket测试服务器 ws://192.168.1.168:8080
    '/ws4TestURL/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.168:8080',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 邓龙光(连公司有线局域网，端口：8099) http://192.168.1.167:8099/graphql
    '/devURL4DLG8099A/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.1.167:8099',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.167:8099' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // 邓龙光(连刘家敏电脑的无线网络，端口：8099) http://192.168.137.123:8099/graphql
    '/devURL4DLG8099B/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.137.123:8099',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.137.123:8099' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // 邓龙光(连吴丹桦电脑的无线网络，端口：8099) http://192.168.137.236:8099/graphql
    '/devURL4DLG8099C/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.137.236:8099',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.137.236:8099' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket邓龙光(连公司有线局域网，端口：8099) ws://192.168.1.167:8099
    '/ws4DevURL4DLG8099A/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.167:8099',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },
    // websocket邓龙光(连刘家敏电脑的无线网络，端口：8099) ws://192.168.137.123:8099
    '/ws4DevURL4DLG8099B/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.137.123:8099',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },
    // websocket邓龙光(连吴丹桦电脑的无线网络，端口：8099) ws://192.168.137.236:8099
    '/ws4DevURL4DLG8099C/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.137.236:8099',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 许锦滨(连公司有线局域网，端口：8099) http://192.168.1.153:8099/graphql
    '/devURL4XJB8099A/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.1.153:8099',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.153:8099' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // 许锦滨(连刘家敏电脑的无线网络，端口：8099) http://192.168.137.217:8099/graphql
    '/devURL4XJB8099B/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.137.217:8099',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.137.217:8099' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // 许锦滨(连吴丹桦电脑的无线网络，端口：8099) http://192.168.137.73:8099/graphql
    '/devURL4XJB8099C/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.137.73:8099',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.137.73:8099' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket许锦滨(连公司有线局域网，端口：8099) ws://192.168.1.153:8099
    '/ws4DevURL4XJB8099A/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.153:8099',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },
    // websocket许锦滨(连刘家敏电脑的无线网络，端口：8099) ws://192.168.137.217:8099
    '/ws4DevURL4XJB8099B/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.137.217:8099',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },
    // websocket许锦滨(连吴丹桦电脑的无线网络，端口：8099) ws://192.168.137.73:8099
    '/ws4DevURL4XJB8099C/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.137.73:8099',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 李东明(连公司有线局域网，端口：8081) http://192.168.1.123:8081/graphql
    '/devURL4LDM8081A/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.1.123:8081',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.123:8081' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // 李东明(连吴丹桦电脑的无线网络，端口：8081) http://192.168.137.208:8081/graphql
    '/devURL4LDM8081B/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.137.208:8081',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.137.208:8081' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket李东明(连公司有线局域网，端口：8081) ws://192.168.1.123:8081
    '/ws4DevURL4LDM8081A/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.123:8081',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },
    // websocket李东明(连吴丹桦电脑的无线网络，端口：8081) ws://192.168.137.208:8081
    '/ws4DevURL4LDM8081B/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.137.208:8081',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    // 戴海涛(连公司有线局域网，端口：8081) http://192.168.1.147:8081/graphql
    '/devURL4DHT8081A/graphql': {
        pathRewrite: ( path, req ) => '/graphql',

        target: 'http://192.168.1.147:8081',
        secure: false,
        changeOrigin,
        router: ( ip_str => ( {
            [ webStormTarget_str ]: ip_str,
            [ devServerTarget_str ]: ip_str,
            [ localServerTarget_str ]: ip_str,
        } ) )( 'http://192.168.1.147:8081' ),

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    // websocket戴海涛(连公司有线局域网，端口：8081) ws://192.168.1.147:8081
    '/ws4DevURL4DHT8081A/subscriptions': {
        pathRewrite: ( path, req ) => '/subscriptions',

        target: 'ws://192.168.1.147:8081',
        ws: true,
        secure: false,
        changeOrigin,

        onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
            console.log( '\nProxy------onProxyReqWs Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReqWs End------\n' );
        },
    },

    '/favicon.ico': {
        target: simServerTarget_str,
        secure: false,
        changeOrigin,
        router: simServerRouter_obj,

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    '/apple-touch-icon.png': {
        target: simServerTarget_str,
        secure: false,
        changeOrigin,
        router: simServerRouter_obj,

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    '/apple-touch-icon-precomposed.png': {
        target: simServerTarget_str,
        secure: false,
        changeOrigin,
        router: simServerRouter_obj,

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
    '/SimServer/*': {
        target: simServerTarget_str,
        secure: false,
        changeOrigin,
        router: simServerRouter_obj,

        onProxyReq: ( proxyReq, req, res ) => {
            console.log( '\nProxy------onProxyReq Start------\n' );

            console.log( `客户端的请求URL--->${ req.url }` );
            console.log( `客户端的请求方法--->${ req.method }` );

            console.log( '客户端的请求头--->Start' );
            console.dir( req.headers );
            console.log( '客户端的请求头--->End' );

            console.log( '代理的请求信息--->Start' );
            console.log( `代理的method--->${ proxyReq.method }` );
            console.log( `代理的path--->${ proxyReq.path }` );
            console.log( `代理的host--->${ proxyReq.host }` );
            console.log( `代理的protocol--->${ proxyReq.protocol }` );
            console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
            console.log( '代理的请求信息--->End' );

            console.log( '\nProxy------onProxyReq End------\n' );
        },
    },
};
