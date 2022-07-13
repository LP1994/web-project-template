/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: configures/ProxyConfig.esm.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * devServer启动时的“代理”配置。
 * 1、这些文件都有引入这个代理配置文件：webpack.base.esm.mjs。
 * 2、注意，当前文件编写的配置是遵循“http-proxy-middleware v2.0.6”的，因为“webpack 5”也是引用“http-proxy-middleware”的，而“http-proxy-middleware”有一个3.X的版本正在预备中，其配置写法有很大的变化。
 */

'use strict';

import {
  httpHeaders,
} from './GlobalParameters.esm.mjs';

/*
 使用例子：
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

const changeOrigin = true;

/**
 * devServer启动时的代理配置。<br />
 * 1、这些文件都有引入这个代理配置文件：webpack.base.esm.mjs。<br />
 * 2、有效值类型有：object、[ object、function ]。<br />
 * 其中function：( req, res, next ) => ProxyConfigArrayItem。<br />
 * 3、如果要将多个特定路径代理到同一个目标，可以使用一个或多个具有上下文属性的对象数组：<br />
 * proxy: [
 * {
 *   context: [ '/auth', '/api' ],
 *   target: 'http://localhost:3000',
 * },
 * ]<br />
 * 4、上面的context选项的有效值类型：string、[ string ]、( pathname: string, req: Request ) => boolean。<br />
 * 5、注意，当前文件编写的配置是遵循“http-proxy-middleware v2.0.6”的，因为“webpack 5”也是引用“http-proxy-middleware”的，而“http-proxy-middleware”有一个3.X的版本正在预备中，其配置写法有很大的变化。<br />
 */
const proxyConfig = {
  /**
   * 这是一个标准Demo写法，不要删除！以供参考！假定后端提供一个HTTP服务API为：http://192.168.1.196:8087/graphql。<br />
   */
  '/http_dev_server_demo001/graphql': {
    /**
     * 有时您不想代理所有内容。可以根据函数的返回值绕过代理。在该函数中，您可以访问请求、响应和代理选项。<br />
     *
     * @param req {Request}
     * @param res {Response}
     * @param proxyOptions {proxyConfig}
     *
     * @returns {*} 返回null或undefined以继续使用代理处理请求。返回false为请求生成404错误。返回一个提供服务的路径，而不是继续代理请求。
     */
    bypass: ( req, res, proxyOptions ) => {
      if( req.headers.accept.indexOf( 'xxx7788' ) !== -1 ){
        console.log( '正在跳过浏览器请求的代理。' );

        return '/xxx7788.html';
      }
    },

    // http-proxy-middleware options Start

    /**
     * 重写目标的url路径。对象键将用作正则表达式来匹配路径。<br />
     * PS：<br />
     * 1、该选项有3种值类型：<br />
     * { [ regexp: string ]: string }、( path: string, req: Request ) => string、( path: string, req: Request ) => Promise<string>。<br />
     * 2、当值类型为对象时，有几类例子：<br />
     * 重写路径：pathRewrite: {'^/old/api' : '/new/api'}，原来的http://localhost:3000/old/api，现在的http://localhost:3000/new/api。<br />
     * 删除路径：pathRewrite: {'^/remove' : ''}，原来的http://localhost:3000/remove/api，现在的http://localhost:3000/api。<br />
     * 添加基本路径：pathRewrite: {'^/' : '/basepath/'}，原来的http://localhost:3000/xxx，现在的http://localhost:3000/basepath/xxx。<br />
     *
     * @param path {string}
     * @param req {Request}
     *
     * @returns {string} 新路径。
     */
    pathRewrite: ( path, req ) => '/graphql',

    /**
     * 为特定请求重新定位到option.target。<br />
     * PS：<br />
     * 1、有效值类型有3种：<br />
     * { [ hostOrPath: string ]: httpProxy.ServerOptions['target'] }、( req: Request ) => httpProxy.ServerOptions['target']、( req: Request ) => Promise<httpProxy.ServerOptions['target']>。<br />
     * 2、使用host、path来匹配请求时，将优先使用第一个匹配到的规则，所以配置的顺序很重要，具体使用例如：<br />
     * host only：<br />
     * 'localhost:3000': 'http://192.168.1.196:8087'
     * host + path：<br />
     * 'localhost:3000/api': 'http://192.168.1.196:8087'
     * path only：<br />
     * '/rest': 'http://192.168.1.196:8087'
     */
    router: {
      'localhost:3000': 'http://192.168.1.196:8087',
    },

    /**
     * 日志版本：'debug'、'info'、'warn'、'error'、'silent'，默认值为'info'。<br />
     */
    logLevel: 'info',

    /**
     * 修改或替换日志提供程序，该选项默认值为console。<br />
     *
     * @param provider {LogProvider}
     *
     * @returns {myCustomProvider} 修改或替换日志提供程序。
     */
    // logProvider: provider => myCustomProvider,

    // http-proxy-middleware options End

    // http-proxy options Start

    /**
     * 要使用url模块解析的url字符串，target和forward两者必须存在至少一个。<br />
     * 1、有效值类型：string、Partial<url.Url>、ProxyTargetDetailed、undefined。<br />
     * 2、其中ProxyTargetDetailed的结构为：<br />
     * {<br />
     * host：string，必须。<br />
     * port：number，必须。<br />
     * protocol：string、undefined，可选。<br />
     * hostname：string、undefined，可选。<br />
     * socketPath：string、undefined，可选。<br />
     * key：string、undefined，可选。<br />
     * passphrase：string、undefined，可选。<br />
     * pfx：Buffer、string、undefined，可选。<br />
     * cert：string、undefined，可选。<br />
     * ca：string、undefined，可选。<br />
     * ciphers：string、undefined，可选。<br />
     * secureProtocol：string、undefined，可选。<br />
     * }<br />
     */
    target: 'http://192.168.1.196:8087',

    /**
     * 要使用url模块解析的url字符串，target和forward两者必须存在至少一个。<br />
     * 1、有效值类型：string、Partial<url.Url>、undefined。<br />
     */
    // forward,

    /**
     * 要传递给http(s).request的对象（参见Node的https代理和http代理对象）。<br />
     */
    // agent,

    /**
     * 要传递给https.createServer()的对象。<br />
     */
    // ssl,

    /**
     * 是否启用对websockets的代理。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    ws: false,

    /**
     * 添加x-forward标头。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // xfwd: false,

    /**
     * 是否要验证SSL证书。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    secure: false,

    /**
     * 显式指定是否代理到另一个代理。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // toProxy,

    /**
     * 指定是否要将目标路径添加到代理路径，默认值是true。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // prependPath,

    /**
     * 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须手动附加“/”），默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // ignorePath,

    /**
     * 为传出连接绑定的本地接口字符串。<br />
     * 1、有效值类型：string、undefined。<br />
     */
    // localAddress,

    /**
     * 将主机标头的来源更改为目标URL，默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    changeOrigin,

    /**
     * 指定是否要保留响应标头键的字母大小写，默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // preserveHeaderKeyCase,

    /**
     * 基本身份验证，即“user:password”来计算授权标头。<br />
     * 1、有效值类型：string、undefined。<br />
     */
    // auth,

    /**
     * 在 (201/301/302/307/308) 重定向上重写位置主机名，默认值为null。<br />
     * 1、有效值类型：string、undefined。<br />
     */
    // hostRewrite,

    /**
     * 根据请求的主机/端口重写 (201/301/302/307/308) 重定向上的位置主机/端口，默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // autoRewrite,

    /**
     * 重写 (201/301/302/307/308) 上的位置协议重定向到“http”或“https”，默认值为null。
     * 1、有效值类型：string、undefined。<br />
     */
    // protocolRewrite,

    /**
     * 重写set-cookie标头的域，默认值是false。<br />
     * 1、有效值类型：false、string、object（{ [ oldDomain: string ]: string }）、undefined。<br />
     * 2、当值为false时，表示禁用cookie重写。<br />
     * 3、当值类型为string时，表示设置新域名，例如：cookieDomainRewrite: "new.domain"，要删除域可使用：cookieDomainRewrite: ""。<br />
     * 4、当值类型为object时，表示域到新域的映射，使用“*”匹配所有域，例如保持一个域不变，重写一个域并删除其他域：<br />
     * cookieDomainRewrite: {
     *   "unchanged.domain": "unchanged.domain",
     *   "old.domain": "new.domain",
     *   "*": ""
     * }
     */
    // cookieDomainRewrite,

    /**
     * 重写set-cookie标头的路径，默认值是false。<br />
     * 1、有效值类型：false、string、object（{ [ oldPath: string ]: string }）、undefined。<br />
     * 2、当值为false时，表示禁用cookie重写。<br />
     * 3、当值类型为string时，表示设置新路径，例如：cookiePathRewrite: "/newPath/"，要删除路径可使用：cookiePathRewrite: ""，要将路径设置为根目录可使用cookiePathRewrite:"/"。<br />
     * 4、当值类型为object时，表示路径到新路径的映射，使用“*”匹配所有路径，例如要保持一个路径不变，重写一个路径并删除其他路径：<br />
     * cookiePathRewrite: {
     *   "/unchanged.path/": "/unchanged.path/",
     *   "/old.path/": "/new.path/",
     *   "*": ""
     * }
     */
    // cookiePathRewrite,

    /**
     * 带有要添加到目标请求的额外标头的对象。<br />
     * 1、有效值类型：object（{ [ header: string ]: string }）、undefined。<br />
     */
    headers: httpHeaders,

    /**
     * 传出代理请求的超时（以毫秒为单位），默认值为120000（等同2分钟）。<br />
     * 1、有效值类型：number、undefined。<br />
     */
    proxyTimeout: 120000,

    /**
     * 传入请求的超时（以毫秒为单位）。<br />
     * 1、有效值类型：number、undefined。<br />
     */
    timeout: 120000,

    /**
     * 指定是否要遵循重定向，默认值false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // followRedirects,

    /**
     * 如果设置为true，则不会调用任何webOutgoing传递，您有责任通过侦听和处理proxyRes事件来适当地返回响应。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // selfHandleResponse,

    /**
     * 作为请求正文发送的数据流。也许您有一些中间件在代理请求流之前使用它，例如，如果您将请求的正文读入名为“req.rawbody”的字段中，则可以在缓冲区选项中重新传输该字段，有效值类型：stream.Stream、undefined。<br />
     * const streamify = require('stream-array');
     * const HttpProxy = require('http-proxy');
     * const proxy = new HttpProxy();
     *
     * module.exports = (req, res, next) => {
     * 
     *   proxy.web(req, res, {
     *     target: 'http://localhost:4003/',
     *     buffer: streamify(req.rawBody)
     *   }, next);
     * 
     * };
     */
    // buffer,

    // http-proxy options End

    // http-proxy events Start

    /**
     * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“web”连接。<br />
     *
     * @param proxyReq {http.ClientRequest}
     * @param req {Request}
     * @param res {Response}
     * @param options {httpProxy.ServerOptions}
     *
     * @returns {void} 无返回值。
     */
    onProxyReq: ( proxyReq, req, res, options ) => {
      console.log( '\nonProxyReq------Start------\n' );

      console.log( `客户端的请求URL--->${ req.url }` );
      console.log( `客户端的请求方法--->${ req.method }` );

      console.log( '客户端的请求头--->Start' );
      console.dir( req.headers );
      console.log( '客户端的请求头--->End' );

      console.log( '代理的请求信息--->Start' );
      console.log( `代理的method--->${ proxyReq.method }` );
      console.log( `代理的protocol--->${ proxyReq.protocol }` );
      console.log( `代理的host--->${ proxyReq.host }` );
      console.log( `代理的path--->${ proxyReq.path }` );
      console.dir( proxyReq[ Reflect.ownKeys( proxyReq )[ Reflect.ownKeys( proxyReq ).length - 1 ] ] );
      console.log( '代理的请求信息--->End' );

      console.log( '\nonProxyReq------End------\n' );
    },

    /**
     * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“websocket”连接。<br />
     *
     * @param proxyReq {http.ClientRequest}
     * @param req {Request}
     * @param socket {net.Socket}
     * @param options {httpProxy.ServerOptions}
     * @param head {*}
     *
     * @returns {void} 无返回值。
     */
    onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
    },

    /**
     * 如果对目标的请求得到响应，则会发出此事件。<br />
     *
     * @param proxyRes {http.IncomingMessage}
     * @param req {Request}
     * @param res {Response}
     *
     * @returns {void} 无返回值。
     */
    onProxyRes: ( proxyRes, req, res ) => {
    },

    /**
     * 一旦创建代理websocket并将其通过管道传输到目标websocket，就会发出此事件。<br />
     * PS：<br />
     * 1、“proxySocket”事件已经被废弃了现在是用当前这个事件代替它了。<br />
     *
     * @param proxySocket {net.Socket}
     *
     * @returns {void} 无返回值。
     */
    onOpen: proxySocket => {
    },

    /**
     * 一旦代理websocket关闭，就会发出此事件。<br />
     *
     * @param proxyRes {Response}
     * @param proxySocket {net.Socket}
     * @param proxyHead {*}
     *
     * @returns {void} 无返回值。
     */
    onClose: ( proxyRes, proxySocket, proxyHead ) => {
    },

    /**
     * 如果对目标的请求失败，则会发出错误事件。我们不对客户端和代理之间传递的消息以及代理和目标之间传递的消息进行任何错误处理，因此建议您侦听错误并进行处理。<br />
     *
     * @param err {Error}
     * @param req {Request}
     * @param res {Response}
     * @param target {string|Partial<url.Url>} 可选的参数，不一定都有存在。<br />
     *
     * @returns {void} 无返回值。
     */
    onError: ( err, req, res, target ) => {
    },

    // http-proxy events End
  },

  /**
   * 这是一个标准Demo写法，不要删除！以供参考！假定后端提供一个WebSocket服务API为：ws://192.168.1.196:8087/subscriptions。<br />
   */
  '/ws_dev_server_demo001/subscriptions': {
    /**
     * 有时您不想代理所有内容。可以根据函数的返回值绕过代理。在该函数中，您可以访问请求、响应和代理选项。<br />
     *
     * @param req {Request}
     * @param res {Response}
     * @param proxyOptions {proxyConfig}
     *
     * @returns {*} 返回null或undefined以继续使用代理处理请求。返回false为请求生成404错误。返回一个提供服务的路径，而不是继续代理请求。
     */
    bypass: ( req, res, proxyOptions ) => {
      if( req.headers.accept.indexOf( 'xxx7788' ) !== -1 ){
        console.log( '正在跳过浏览器请求的代理。' );

        return '/xxx7788.html';
      }
    },

    // http-proxy-middleware options Start

    /**
     * 重写目标的url路径。对象键将用作正则表达式来匹配路径。<br />
     * PS：<br />
     * 1、该选项有3种值类型：<br />
     * { [ regexp: string ]: string }、( path: string, req: Request ) => string、( path: string, req: Request ) => Promise<string>。<br />
     * 2、当值类型为对象时，有几类例子：<br />
     * 重写路径：pathRewrite: {'^/old/api' : '/new/api'}，原来的http://localhost:3000/old/api，现在的http://localhost:3000/new/api。<br />
     * 删除路径：pathRewrite: {'^/remove' : ''}，原来的http://localhost:3000/remove/api，现在的http://localhost:3000/api。<br />
     * 添加基本路径：pathRewrite: {'^/' : '/basepath/'}，原来的http://localhost:3000/xxx，现在的http://localhost:3000/basepath/xxx。<br />
     *
     * @param path {string}
     * @param req {Request}
     *
     * @returns {string} 新路径。
     */
    pathRewrite: ( path, req ) => '/subscriptions',

    /**
     * 为特定请求重新定位到option.target。<br />
     * PS：<br />
     * 1、有效值类型有3种：<br />
     * { [ hostOrPath: string ]: httpProxy.ServerOptions['target'] }、( req: Request ) => httpProxy.ServerOptions['target']、( req: Request ) => Promise<httpProxy.ServerOptions['target']>。<br />
     * 2、使用host、path来匹配请求时，将优先使用第一个匹配到的规则，所以配置的顺序很重要，具体使用例如：<br />
     * host only：<br />
     * 'localhost:3000': 'http://192.168.1.196:8087'
     * host + path：<br />
     * 'localhost:3000/api': 'http://192.168.1.196:8087'
     * path only：<br />
     * '/rest': 'http://192.168.1.196:8087'
     */
    router: {
      'localhost:3000': 'http://192.168.1.196:8087',
    },

    /**
     * 日志版本：'debug'、'info'、'warn'、'error'、'silent'，默认值为'info'。<br />
     */
    logLevel: 'info',

    /**
     * 修改或替换日志提供程序，该选项默认值为console。<br />
     *
     * @param provider {LogProvider}
     *
     * @returns {myCustomProvider} 修改或替换日志提供程序。
     */
    // logProvider: provider => myCustomProvider,

    // http-proxy-middleware options End

    // http-proxy options Start

    /**
     * 要使用url模块解析的url字符串，target和forward两者必须存在至少一个。<br />
     * 1、有效值类型：string、Partial<url.Url>、ProxyTargetDetailed、undefined。<br />
     * 2、其中ProxyTargetDetailed的结构为：<br />
     * {<br />
     * host：string，必须。<br />
     * port：number，必须。<br />
     * protocol：string、undefined，可选。<br />
     * hostname：string、undefined，可选。<br />
     * socketPath：string、undefined，可选。<br />
     * key：string、undefined，可选。<br />
     * passphrase：string、undefined，可选。<br />
     * pfx：Buffer、string、undefined，可选。<br />
     * cert：string、undefined，可选。<br />
     * ca：string、undefined，可选。<br />
     * ciphers：string、undefined，可选。<br />
     * secureProtocol：string、undefined，可选。<br />
     * }<br />
     */
    target: 'ws://192.168.1.196:8087',

    /**
     * 要使用url模块解析的url字符串，target和forward两者必须存在至少一个。<br />
     * 1、有效值类型：string、Partial<url.Url>、undefined。<br />
     */
    // forward,

    /**
     * 要传递给http(s).request的对象（参见Node的https代理和http代理对象）。<br />
     */
    // agent,

    /**
     * 要传递给https.createServer()的对象。<br />
     */
    // ssl,

    /**
     * 是否启用对websockets的代理。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    ws: true,

    /**
     * 添加x-forward标头。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // xfwd: false,

    /**
     * 是否要验证SSL证书。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    secure: false,

    /**
     * 显式指定是否代理到另一个代理。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // toProxy,

    /**
     * 指定是否要将目标路径添加到代理路径，默认值是true。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // prependPath,

    /**
     * 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须手动附加“/”），默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // ignorePath,

    /**
     * 为传出连接绑定的本地接口字符串。<br />
     * 1、有效值类型：string、undefined。<br />
     */
    // localAddress,

    /**
     * 将主机标头的来源更改为目标URL，默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    changeOrigin,

    /**
     * 指定是否要保留响应标头键的字母大小写，默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // preserveHeaderKeyCase,

    /**
     * 基本身份验证，即“user:password”来计算授权标头。<br />
     * 1、有效值类型：string、undefined。<br />
     */
    // auth,

    /**
     * 在 (201/301/302/307/308) 重定向上重写位置主机名，默认值为null。<br />
     * 1、有效值类型：string、undefined。<br />
     */
    // hostRewrite,

    /**
     * 根据请求的主机/端口重写 (201/301/302/307/308) 重定向上的位置主机/端口，默认值是false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // autoRewrite,

    /**
     * 重写 (201/301/302/307/308) 上的位置协议重定向到“http”或“https”，默认值为null。
     * 1、有效值类型：string、undefined。<br />
     */
    // protocolRewrite,

    /**
     * 重写set-cookie标头的域，默认值是false。<br />
     * 1、有效值类型：false、string、object（{ [ oldDomain: string ]: string }）、undefined。<br />
     * 2、当值为false时，表示禁用cookie重写。<br />
     * 3、当值类型为string时，表示设置新域名，例如：cookieDomainRewrite: "new.domain"，要删除域可使用：cookieDomainRewrite: ""。<br />
     * 4、当值类型为object时，表示域到新域的映射，使用“*”匹配所有域，例如保持一个域不变，重写一个域并删除其他域：<br />
     * cookieDomainRewrite: {
     *   "unchanged.domain": "unchanged.domain",
     *   "old.domain": "new.domain",
     *   "*": ""
     * }
     */
    // cookieDomainRewrite,

    /**
     * 重写set-cookie标头的路径，默认值是false。<br />
     * 1、有效值类型：false、string、object（{ [ oldPath: string ]: string }）、undefined。<br />
     * 2、当值为false时，表示禁用cookie重写。<br />
     * 3、当值类型为string时，表示设置新路径，例如：cookiePathRewrite: "/newPath/"，要删除路径可使用：cookiePathRewrite: ""，要将路径设置为根目录可使用cookiePathRewrite:"/"。<br />
     * 4、当值类型为object时，表示路径到新路径的映射，使用“*”匹配所有路径，例如要保持一个路径不变，重写一个路径并删除其他路径：<br />
     * cookiePathRewrite: {
     *   "/unchanged.path/": "/unchanged.path/",
     *   "/old.path/": "/new.path/",
     *   "*": ""
     * }
     */
    // cookiePathRewrite,

    /**
     * 带有要添加到目标请求的额外标头的对象。<br />
     * 1、有效值类型：object（{ [ header: string ]: string }）、undefined。<br />
     */
    headers: httpHeaders,

    /**
     * 传出代理请求的超时（以毫秒为单位），默认值为120000（等同2分钟）。<br />
     * 1、有效值类型：number、undefined。<br />
     */
    proxyTimeout: 120000,

    /**
     * 传入请求的超时（以毫秒为单位）。<br />
     * 1、有效值类型：number、undefined。<br />
     */
    timeout: 120000,

    /**
     * 指定是否要遵循重定向，默认值false。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // followRedirects,

    /**
     * 如果设置为true，则不会调用任何webOutgoing传递，您有责任通过侦听和处理proxyRes事件来适当地返回响应。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    // selfHandleResponse,

    /**
     * 作为请求正文发送的数据流。也许您有一些中间件在代理请求流之前使用它，例如，如果您将请求的正文读入名为“req.rawbody”的字段中，则可以在缓冲区选项中重新传输该字段，有效值类型：stream.Stream、undefined。<br />
     * const streamify = require('stream-array');
     * const HttpProxy = require('http-proxy');
     * const proxy = new HttpProxy();
     *
     * module.exports = (req, res, next) => {
     * 
     *   proxy.web(req, res, {
     *     target: 'http://localhost:4003/',
     *     buffer: streamify(req.rawBody)
     *   }, next);
     * 
     * };
     */
    // buffer,

    // http-proxy options End

    // http-proxy events Start

    /**
     * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“web”连接。<br />
     *
     * @param proxyReq {http.ClientRequest}
     * @param req {Request}
     * @param res {Response}
     * @param options {httpProxy.ServerOptions}
     *
     * @returns {void} 无返回值。
     */
    onProxyReq: ( proxyReq, req, res, options ) => {
    },

    /**
     * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“websocket”连接。<br />
     *
     * @param proxyReq {http.ClientRequest}
     * @param req {Request}
     * @param socket {net.Socket}
     * @param options {httpProxy.ServerOptions}
     * @param head {*}
     *
     * @returns {void} 无返回值。
     */
    onProxyReqWs: ( proxyReq, req, socket, options, head ) => {
      console.log( '\nonProxyReqWs------Start------\n' );

      console.log( '\nproxyReq--->Start' );
      console.dir( proxyReq );
      console.log( 'proxyReq--->End\n' );

      console.log( '\nreq--->Start' );
      console.dir( req );
      console.log( 'req--->End\n' );

      console.log( '\nsocket--->Start' );
      console.dir( socket );
      console.log( 'socket--->End\n' );

      console.log( '\noptions--->Start' );
      console.dir( options );
      console.log( 'options--->End\n' );

      console.log( '\nhead--->Start' );
      console.dir( head );
      console.log( 'head--->End\n' );

      console.log( '\nonProxyReqWs------End------\n' );
    },

    /**
     * 如果对目标的请求得到响应，则会发出此事件。<br />
     *
     * @param proxyRes {http.IncomingMessage}
     * @param req {Request}
     * @param res {Response}
     *
     * @returns {void} 无返回值。
     */
    onProxyRes: ( proxyRes, req, res ) => {
    },

    /**
     * 一旦创建代理websocket并将其通过管道传输到目标websocket，就会发出此事件。<br />
     * PS：<br />
     * 1、“proxySocket”事件已经被废弃了现在是用当前这个事件代替它了。<br />
     *
     * @param proxySocket {net.Socket}
     *
     * @returns {void} 无返回值。
     */
    onOpen: proxySocket => {
    },

    /**
     * 一旦代理websocket关闭，就会发出此事件。<br />
     *
     * @param proxyRes {Response}
     * @param proxySocket {net.Socket}
     * @param proxyHead {*}
     *
     * @returns {void} 无返回值。
     */
    onClose: ( proxyRes, proxySocket, proxyHead ) => {
    },

    /**
     * 如果对目标的请求失败，则会发出错误事件。我们不对客户端和代理之间传递的消息以及代理和目标之间传递的消息进行任何错误处理，因此建议您侦听错误并进行处理。<br />
     *
     * @param err {Error}
     * @param req {Request}
     * @param res {Response}
     * @param target {string|Partial<url.Url>} 可选的参数，不一定都有存在。<br />
     *
     * @returns {void} 无返回值。
     */
    onError: ( err, req, res, target ) => {
    },

    // http-proxy events End
  },
};

export {
  proxyConfig,
};

export default proxyConfig;
