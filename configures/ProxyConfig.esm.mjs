/**
 * Project: web-project-template
 * FileDirPath: configures/ProxyConfig.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * devServer启动时的“代理”配置。
 * 1、这些文件都有引入这个代理配置文件：webpack.base.esm.mjs。
 * 2、注意，当前文件编写的配置是遵循“http-proxy-middleware v2.0.6”的，因为“webpack 5”也是引用“http-proxy-middleware”的，而“http-proxy-middleware”有一个3.X的版本正在预备中，其配置写法有很大的变化。
 *
 * 当设置为'0.0.0.0'时的注意事项：<br />
 * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
 * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
 * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
 * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9999。<br />
 *
 * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：
 * 1、当页面地址（如“https://localhost:9999”）跟其中的websocket服务地址（如“wss://localhost:9900”）不一样时，因为端口不一致，所以也算不同的服务地址。
 * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9900”。
 * 3、然后才能让页面（如“https://localhost:9999”）成功访问其中的websocket服务地址（如“wss://localhost:9900”）。
 * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。
 */

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

'use strict';

import {
  dirname,
  join,
} from 'node:path';

import {
  argv,
} from 'node:process';

import {
  fileURLToPath,
} from 'node:url';

import {
  httpHeaders,
} from './GlobalParameters.esm.mjs';

import {
  CreateLogger,
} from './Logger.esm.mjs';

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
 * 返回传入时间对象的年、月、日、时、分、秒、周几（当为周日的时候返回的是字符串“日”，其他星期则是数字）。<br />
 *
 * @param nowDate {Date} 一个时间对象，默认值（当前时间）：new Date( Date.now() )，可选。<br />
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

/**
 * 表示项目文件夹根目录，不是磁盘根目录。<br />
 *
 * @type {string}
 */
const __dirname = Get__dirname( import.meta.url ),
  /**
   * isProduction的值为true时表示生产环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值。<br />
   * 1、有效的“--mode”参数设置是：--mode development（用于开发）、--mode production（用于生产）。<br />
   *
   * @type {boolean}
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
  changeOrigin = true;

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
    logFileName = `proxy_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒(周${ day }).log`;

  logWriteStream = await CreateLogger( join( __dirname, `../log/${ env_platform }/${ logFileName }` ) );
}

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
 *
 * 当设置为'0.0.0.0'时的注意事项：<br />
 * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
 * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
 * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
 * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9999。<br />
 *
 * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
 * 1、当页面地址（如“https://localhost:9999”）跟其中的websocket服务地址（如“wss://localhost:9900”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
 * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9900”。<br />
 * 3、然后才能让页面（如“https://localhost:9999”）成功访问其中的websocket服务地址（如“wss://localhost:9900”）。<br />
 * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
 */
const proxyConfig = {
  /**
   * 这是一个标准Demo写法，不要删除！以供参考！假定后端提供一个HTTP服务API为：https://localhost:9999/simulation_servers_deno/GetJSON。<br />
   */
  '/devURLDemo001/simulation_servers_deno/': {
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
      // 正在跳过浏览器请求的代理。
      if( req.headers.accept.indexOf( 'xxx7788' ) !== -1 ){
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
    pathRewrite: {
      '^/devURLDemo001': '',
    },

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
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9999。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9999”）跟其中的websocket服务地址（如“wss://localhost:9900”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9900”。<br />
     * 3、然后才能让页面（如“https://localhost:9999”）成功访问其中的websocket服务地址（如“wss://localhost:9900”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     */
    router: {
      'localhost:8100': 'https://0.0.0.0:9999',
      '127.0.0.1:8100': 'https://0.0.0.0:9999',
      '192.168.10.101:8100': 'https://0.0.0.0:9999',
      '192.168.10.103:8100': 'https://0.0.0.0:9999',
      '192.168.1.106:8100': 'https://0.0.0.0:9999',
      '192.168.0.110:8100': 'https://0.0.0.0:9999',

      'localhost:8200': 'https://0.0.0.0:9999',
      '127.0.0.1:8200': 'https://0.0.0.0:9999',
      '192.168.10.101:8200': 'https://0.0.0.0:9999',
      '192.168.10.103:8200': 'https://0.0.0.0:9999',
      '192.168.1.106:8200': 'https://0.0.0.0:9999',
      '192.168.0.110:8200': 'https://0.0.0.0:9999',
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
     * host：string，必需。<br />
     * port：number，必需。<br />
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
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9999。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9999”）跟其中的websocket服务地址（如“wss://localhost:9900”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9900”。<br />
     * 3、然后才能让页面（如“https://localhost:9999”）成功访问其中的websocket服务地址（如“wss://localhost:9900”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     */
    target: 'https://0.0.0.0:9999',

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
      const arr001 = Reflect.ownKeys( proxyReq ).filter( item => typeof item === 'symbol' );

      logWriteStream.write( `HTTP代理--->${ req.originalUrl }<---Start
原请求方法：${ req.method }
原请求头：
${ JSON.stringify( req.headers, null, ' ' ) }

代理请求方法：${ proxyReq.method }
代理请求的protocol：${ proxyReq.protocol }
代理请求的host：${ proxyReq.host }
代理请求的path：${ proxyReq.path }
代理的请求头：
${ JSON.stringify( Object.fromEntries( Object.values( proxyReq[ arr001[ arr001.findIndex( item => item.toString() === 'Symbol(kOutHeaders)' ) ] ] ) ), null, ' ' ) }
HTTP代理--->${ req.originalUrl }<---End
\n\n\n` );
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
   * 这是一个标准Demo写法，不要删除！以供参考！假定后端提供一个WebSocket服务API为：wss://localhost:9900/simulation_servers_deno/subscriptions。<br />
   */
  '/ws4DevURLDemo001/simulation_servers_deno/': {
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
      // 正在跳过浏览器请求的代理。
      if( req.headers.accept.indexOf( 'xxx7788' ) !== -1 ){
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
    pathRewrite: {
      '^/ws4DevURLDemo001': '',
    },

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
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9999。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9999”）跟其中的websocket服务地址（如“wss://localhost:9900”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9900”。<br />
     * 3、然后才能让页面（如“https://localhost:9999”）成功访问其中的websocket服务地址（如“wss://localhost:9900”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     */
    router: {
      'localhost:8100': 'wss://0.0.0.0:9900',
      '127.0.0.1:8100': 'wss://0.0.0.0:9900',
      '192.168.10.101:8100': 'wss://0.0.0.0:9900',
      '192.168.10.103:8100': 'wss://0.0.0.0:9900',
      '192.168.1.106:8100': 'wss://0.0.0.0:9900',
      '192.168.0.110:8100': 'wss://0.0.0.0:9900',

      'localhost:8200': 'wss://0.0.0.0:9900',
      '127.0.0.1:8200': 'wss://0.0.0.0:9900',
      '192.168.10.101:8200': 'wss://0.0.0.0:9900',
      '192.168.10.103:8200': 'wss://0.0.0.0:9900',
      '192.168.1.106:8200': 'wss://0.0.0.0:9900',
      '192.168.0.110:8200': 'wss://0.0.0.0:9900',
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
     * host：string，必需。<br />
     * port：number，必需。<br />
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
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9999。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9999”）跟其中的websocket服务地址（如“wss://localhost:9900”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9900”。<br />
     * 3、然后才能让页面（如“https://localhost:9999”）成功访问其中的websocket服务地址（如“wss://localhost:9900”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     */
    target: 'wss://0.0.0.0:9900',

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
      const arr001 = Reflect.ownKeys( proxyReq ).filter( item => typeof item === 'symbol' );

      logWriteStream.write( `WebSocket代理--->${ options.context }<---Start
原请求方法：${ req.method }
原请求头：
${ JSON.stringify( req.headers, null, ' ' ) }

代理请求方法：${ proxyReq.method }
代理请求的protocol：${ proxyReq.protocol }
代理请求的host：${ proxyReq.host }
代理请求的path：${ proxyReq.path }
代理的请求头：
${ JSON.stringify( Object.fromEntries( Object.values( proxyReq[ arr001[ arr001.findIndex( item => item.toString() === 'Symbol(kOutHeaders)' ) ] ] ) ), null, ' ' ) }
WebSocket代理--->${ options.context }<---End
\n\n\n` );
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
