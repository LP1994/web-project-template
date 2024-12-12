/**
 * Project: upload-for-multiple
 * FileDirPath: configures/ProxyConfig.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * devServer启动时的“代理”配置。
 * 1、这些文件都有引入这个代理配置文件：webpack.base.esm.mjs。
 * 2、注意，当前文件编写的配置是遵循“http-proxy-middleware v3”的，因为“webpack 5”也是引用“http-proxy-middleware”的。
 *
 * 当设置为'0.0.0.0'时的注意事项：<br />
 * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
 * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
 * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
 * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9000。<br />
 *
 * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：
 * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。
 * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。
 * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。
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
 '/m3u8/': {
 target: 'http://sjjx.qqplayerjx.com',
 changeOrigin: true,
 router: {
 'localhost:8082': 'http://sjjx.qqplayerjx.com'
 },
 }
 */

'use strict';

import {
  readFileSync,
} from 'node:fs';

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
  httpRequestHeaders,
} from './GlobalParameters.esm.mjs';

import {
  CreateLogger,
} from './Logger.esm.mjs';

import {
  MyConsole,
} from './UniversalToolForNode.esm.mjs';

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
        MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

        throw new Error( 'CLI参数中紧跟在“--mode”之后的，只能是development（用于开发）、production（用于生产）。有效的“--mode”参数设置是：--mode development、--mode production。' );
      }
    }
    else{
      MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

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
      MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

      throw new Error( 'CLI参数中没找到“--env”参数。注意“--env”参数是允许多个的哦。' );
    }

    const platformArr = [];

    envArr.forEach( item => {
      if( item.startsWith( 'platform=' ) ){
        platformArr.push( item );
      }
    } );

    if( platformArr.length === 0 ){
      MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

      throw new Error( 'CLI参数中必须有这么一个“--env”参数设置，这4个之中的其中一个即可：--env platform=dev_server、--env platform=local_server、--env platform=test、--env platform=production。注意“--env”参数是允许多个的哦。' );
    }
    else if( platformArr.length > 1 ){
      MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

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
      MyConsole.Cyan( `\n${ JSON.stringify( argv ) }\n` );

      throw new Error( 'CLI参数中的“--env”参数设置，以“platform=”开头的值，在“platform=”之后紧跟的只能是这4个中的一个：dev_server、local_server、test、production。注意“--env”参数是允许多个的哦。' );
    }
  } )( argv ),
  changeOrigin = true,
  /**
   * 要传递给https.createServer()的对象。<br />
   * 保证跟服务端（webpack-dev-server、Deno）设置的各个证书一样就行。<br />
   * 该选项里头的各个有效属性其实可以参考webpack的顶级配置项“devServer”中的“server.options”选项里的各个属性。<br />
   * 因为它们都是属于“tls.createSecureContext([options])”中的“options”选项，具体的选项说明可见：https://nodejs.org/dist/latest/docs/api/tls.html#tlscreatesecurecontextoptions。<br />
   */
  ssl = {
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
      readFileSync( join( __dirname, './openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA.crt' ), 'utf8' ),
    ],

    /**
     * PEM格式的私钥（“HTTPSSL001_Root_CA_Key.key”）。<br />
     * PEM允许选择加密私钥，加密密钥将使用“options.passphrase”（用于单个私钥或PFX的共享密码）解密。<br />
     *
     * 注意：<br />
     * 1、在生成“服务端CA证书，HTTPSSL001_Servers_CA.crt”的“HTTPSSL001_Root_CA_Key.key”文件时，除了用.key作为文件的扩展后缀，也可以用.pem做后缀，一般首选.key。<br />
     * 2、当前“HTTPSSL001_Root_CA_Key.key”没使用加密。<br />
     */
    key: readFileSync( join( __dirname, './openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA_Key.key' ), 'utf8' ),

    /**
     * PEM格式的证书链（服务端CA证书，HTTPSSL001_Servers_CA.crt）。<br />
     */
    cert: readFileSync( join( __dirname, './openssl/HTTPSSL001/002服务端CA证书/HTTPSSL001_Servers_CA.crt' ), 'utf8' ),

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
    // crl: readFileSync( join( __dirname, './openssl/HTTPSSL001/证书吊销列表/证书吊销列表.pem' ), 'utf8' ),

    /**
     * PFX或PKCS12编码的私钥和证书链。<br />
     * pfx是单独提供密钥和证书的替代方案。<br />
     * PFX通常是加密的，如果是，将使用“options.passphrase”（用于单个私钥或PFX的共享密码）解密。<br />
     *
     * 该选项跟上面的“key”、“cert”选项是互斥的，也就是不要同时设置该选项跟“key”、“cert”选项，否则会报错，说什么太长了。<br />
     */
    // pfx: readFileSync( join( __dirname, './openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA.p12' ), 'utf8' ),
  };

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
 * 2、有效值类型有：[ object、function ]，从webpack-dev-server v5.0开始，只接受数组类型的值。<br />
 * 其中function：( req, res, next ) => ProxyConfigArrayItem。<br />
 * 3、如果要将多个特定路径代理到同一个目标，可以使用一个或多个具有上下文属性的对象数组：<br />
 * proxy: [
 * {
 *   context: [ '/auth', '/api' ],
 *   target: 'http://localhost:3000',
 * },
 * ]<br />
 * 4、上面的context选项的有效值类型：string、[ string ]、( pathname: string, req: Request ) => boolean。<br />
 * 5、注意，当前文件编写的配置是遵循“http-proxy-middleware v3”的，因为“webpack 5”也是引用“http-proxy-middleware”的。<br />
 *
 * 当设置为'0.0.0.0'时的注意事项：<br />
 * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
 * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
 * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
 * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9000。<br />
 *
 * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：
 * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。
 * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。
 * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。
 * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。
 */
const proxyConfig = [
  /**
   * 这是一个标准Demo写法，不要删除！以供参考！假定后端提供一个HTTP服务API为：https://127.0.0.1:9200/simulation_servers_deno/GetJSON。<br />
   */
  {
    context: [
      '/https4deno/',
    ],

    /**
     * 有时您不想代理所有内容。可以根据函数的返回值绕过代理。在该函数中，您可以访问请求、响应和代理选项。<br />
     * PS：<br />
     * 1、从webpack-dev-server v5.0开始，bypass选项已被弃用，转而使用router和context选项。<br />
     *
     * @param {Request} req
     * @param {Response} res
     * @param {proxyConfig} proxyOptions
     *
     * @returns {void | null | undefined | false | string} 返回null或undefined以继续使用代理处理请求。返回false为请求生成404错误。返回一个提供服务的路径，而不是继续代理请求。
     */
    /*
     bypass: ( req, res, proxyOptions ) => {
     // 正在跳过浏览器请求的代理。
     if( ( req?.headers?.accept?.indexOf( 'xxx7788' ) ?? -1 ) !== -1 ){
     return '/xxx7788.html';
     }
     },
     */

    // http-proxy-middleware options Start

    /**
     * 缩小需要代理的请求范围。用于过滤的路径是 request.url 路径名。在 Express 中，这是相对于代理挂载点的路径。
     * 该选项的值类型是：string, []string, glob, []glob, function。
     * PS：
     * 1、该选项从“http-proxy-middleware V3.0”开始使用。
     */
    pathFilter: [
      '/https4deno/',
    ],

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
     * @param {string} path
     * @param {Request} req
     *
     * @returns {string} 新路径。
     */
    pathRewrite: {
      '^/https4deno/': '/',
    },

    /**
     * 为特定请求重新定位到option.target。<br />
     * PS：<br />
     * 1、有效值类型有3种：<br />
     * { [ hostOrPath: string ]: httpProxy.ServerOptions['target'] }、( req: Request ) => httpProxy.ServerOptions['target']、( req: Request ) => Promise<httpProxy.ServerOptions['target']>。<br />
     * 2、使用host、path来匹配请求时，将优先使用第一个匹配到的规则，所以配置的顺序很重要，具体使用例如：<br />
     * host only：<br />
     * 'localhost:3000': 'http://192.168.1.3:8087'
     * host + path：<br />
     * 'localhost:3000/api': 'http://192.168.1.3:8087'
     * path only：<br />
     * '/rest': 'http://192.168.1.3:8087'
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9000。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：
     * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。
     * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。
     */
    router: {
      '/https4deno': 'https://0.0.0.0:9200',

      'localhost:8101': 'https://0.0.0.0:9200',
      '127.0.0.1:8101': 'https://0.0.0.0:9200',
      '192.168.1.3:8101': 'https://0.0.0.0:9200',
      '192.168.2.10:8101': 'https://0.0.0.0:9200',

      'localhost:8201': 'https://0.0.0.0:9200',
      '127.0.0.1:8201': 'https://0.0.0.0:9200',
      '192.168.1.3:8201': 'https://0.0.0.0:9200',
      '192.168.2.10:8201': 'https://0.0.0.0:9200',
    },

    /**
     * 日志版本：'debug'、'info'、'warn'、'error'、'silent'，默认值为'info'。<br />
     * PS：<br />
     * 1、在“http-proxy-middleware V3.0”中，该选项被删除了，使用新的选项“logger”来代替。<br />
     */
    // logLevel: 'info',

    /**
     * 修改或替换日志提供程序，该选项默认值为console。<br />
     * PS：<br />
     * 1、在“http-proxy-middleware V3.0”中，该选项被删除了，使用新的选项“logger”来代替。<br />
     *
     * @param {LogProvider} provider
     *
     * @returns {myCustomProvider} 修改或替换日志提供程序。
     */
    // logProvider: provider => myCustomProvider,

    /**
     * 来自 http-proxy-middleware 的日志信息。内部只是'info'、'warn'、'error'级别的日志输出。
     * PS：
     * 1、该选项从“http-proxy-middleware V3.0”开始使用。
     */
    logger: console,

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
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9000。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：
     * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。
     * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。
     */
    target: 'https://0.0.0.0:9200',

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
     * 是否要验证SSL证书。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    secure: false,

    /**
     * 要传递给https.createServer()的对象。<br />
     * 保证跟服务端（webpack-dev-server、Deno）设置的各个证书一样就行。<br />
     * 该选项里头的各个有效属性其实可以参考webpack的顶级配置项“devServer”中的“server.options”选项里的各个属性。<br />
     * 因为它们都是属于“tls.createSecureContext([options])”中的“options”选项，具体的选项说明可见：https://nodejs.org/dist/latest/docs/api/tls.html#tlscreatesecurecontextoptions。<br />
     */
    ssl,

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
     * 带有要添加到目标请求的额外标头的对象，也就是该选项用来设置请求头的。<br />
     * 1、有效值类型：object（{ [ header: string ]: string }）、undefined。<br />
     */
    headers: httpRequestHeaders,

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
     * http-proxy各个事件监听配置。
     * PS：
     * 1、该选项从“http-proxy-middleware V3.0”开始使用。
     */
    on: {
      /**
       * 如果对目标的请求失败，则会发出错误事件。我们不对客户端和代理之间传递的消息以及代理和目标之间传递的消息进行任何错误处理，因此建议您侦听错误并进行处理。<br />
       *
       * @param {Error} err
       * @param {Request} req
       * @param {Response} res
       * @param {string|Partial<url.Url>} target 可选的参数，不一定都有存在。<br />
       *
       * @returns {void} 无返回值。
       */
      error: ( err, req, res, target ) => {
      },

      /**
       * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“web”连接。<br />
       *
       * @param {http.ClientRequest} proxyReq
       * @param {Request} req
       * @param {Response} res
       * @param {httpProxy.ServerOptions} options
       *
       * @returns {void} 无返回值。
       */
      proxyReq: ( proxyReq, req, res, options ) => {
        const arr001 = Reflect.ownKeys( proxyReq ).filter( item => typeof item === 'symbol' );

        logWriteStream.write( `HTTP代理--->${ req.originalUrl }<---Start
原请求方法：${ req.method }
原请求头：
${ JSON.stringify( req.headers, null, 4 ) }

代理请求方法：${ proxyReq.method }
代理请求的protocol：${ proxyReq.protocol }
代理请求的host：${ proxyReq.host }
代理请求的path：${ proxyReq.path }
代理的请求头：
${ JSON.stringify( Object.fromEntries( Object.values( proxyReq[ arr001[ arr001.findIndex( item => item.toString() === 'Symbol(kOutHeaders)' ) ] ] ) ), null, 4 ) }
HTTP代理--->${ req.originalUrl }<---End
\n\n` );
      },

      /**
       * 如果对目标的请求得到响应，则会发出此事件。<br />
       *
       * @param {http.IncomingMessage} proxyRes
       * @param {Request} req
       * @param {Response} res
       *
       * @returns {void} 无返回值。
       */
      proxyRes: ( proxyRes, req, res ) => {
      },

      /**
       * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“websocket”连接。<br />
       *
       * @param {http.ClientRequest} proxyReq
       * @param {Request} req
       * @param {net.Socket} socket
       * @param {httpProxy.ServerOptions} options
       * @param {any} head
       *
       * @returns {void} 无返回值。
       */
      proxyReqWs: ( proxyReq, req, socket, options, head ) => {
      },

      /**
       * 一旦创建代理websocket并将其通过管道传输到目标websocket，就会发出此事件。<br />
       * PS：<br />
       * 1、“proxySocket”事件已经被废弃了现在是用当前这个事件代替它了。<br />
       *
       * @param {net.Socket} proxySocket
       *
       * @returns {void} 无返回值。
       */
      open: proxySocket => {
      },

      /**
       * 一旦代理websocket关闭，就会发出此事件。<br />
       *
       * @param {Response} proxyRes
       * @param {net.Socket} proxySocket
       * @param {any} proxyHead
       *
       * @returns {void} 无返回值。
       */
      close: ( proxyRes, proxySocket, proxyHead ) => {
      },
    },

    // http-proxy events End
  },

  /**
   * 这是一个标准Demo写法，不要删除！以供参考！假定后端提供一个WebSocket服务API为：wss://127.0.0.1:9200/simulation_servers_deno/subscriptions。<br />
   */
  {
    context: [
      '/wss4deno/',
    ],

    /**
     * 有时您不想代理所有内容。可以根据函数的返回值绕过代理。在该函数中，您可以访问请求、响应和代理选项。<br />
     * PS：<br />
     * 1、从webpack-dev-server v5.0开始，bypass选项已被弃用，转而使用router和context选项。<br />
     *
     * @param {Request} req
     * @param {Response} res
     * @param {proxyConfig} proxyOptions
     *
     * @returns {void | null | undefined | false | string} 返回null或undefined以继续使用代理处理请求。返回false为请求生成404错误。返回一个提供服务的路径，而不是继续代理请求。
     */
    /*
     bypass: ( req, res, proxyOptions ) => {
     // 正在跳过浏览器请求的代理。
     if( ( req?.headers?.accept?.indexOf( 'xxx7788' ) ?? -1 ) !== -1 ){
     return '/xxx7788.html';
     }
     },
     */

    // http-proxy-middleware options Start

    /**
     * 缩小需要代理的请求范围。用于过滤的路径是 request.url 路径名。在 Express 中，这是相对于代理挂载点的路径。
     * 该选项的值类型是：string, []string, glob, []glob, function。
     * PS：
     * 1、该选项从“http-proxy-middleware V3.0”开始使用。
     */
    pathFilter: [
      '/wss4deno/',
    ],

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
     * @param {string} path
     * @param {Request} req
     *
     * @returns {string} 新路径。
     */
    pathRewrite: {
      '^/wss4deno/': '/',
    },

    /**
     * 为特定请求重新定位到option.target。<br />
     * PS：<br />
     * 1、有效值类型有3种：<br />
     * { [ hostOrPath: string ]: httpProxy.ServerOptions['target'] }、( req: Request ) => httpProxy.ServerOptions['target']、( req: Request ) => Promise<httpProxy.ServerOptions['target']>。<br />
     * 2、使用host、path来匹配请求时，将优先使用第一个匹配到的规则，所以配置的顺序很重要，具体使用例如：<br />
     * host only：<br />
     * 'localhost:3000': 'http://192.168.1.3:8087'
     * host + path：<br />
     * 'localhost:3000/api': 'http://192.168.1.3:8087'
     * path only：<br />
     * '/rest': 'http://192.168.1.3:8087'
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9000。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：
     * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。
     * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。
     */
    router: {
      '/wss4deno': 'wss://0.0.0.0:9200',

      'localhost:8101': 'wss://0.0.0.0:9200',
      '127.0.0.1:8101': 'wss://0.0.0.0:9200',
      '192.168.1.3:8101': 'wss://0.0.0.0:9200',
      '192.168.2.10:8101': 'wss://0.0.0.0:9200',

      'localhost:8201': 'wss://0.0.0.0:9200',
      '127.0.0.1:8201': 'wss://0.0.0.0:9200',
      '192.168.1.3:8201': 'wss://0.0.0.0:9200',
      '192.168.2.10:8201': 'wss://0.0.0.0:9200',
    },

    /**
     * 日志版本：'debug'、'info'、'warn'、'error'、'silent'，默认值为'info'。<br />
     * PS：<br />
     * 1、在“http-proxy-middleware V3.0”中，该选项被删除了，使用新的选项“logger”来代替。<br />
     */
    // logLevel: 'info',

    /**
     * 修改或替换日志提供程序，该选项默认值为console。<br />
     * PS：<br />
     * 1、在“http-proxy-middleware V3.0”中，该选项被删除了，使用新的选项“logger”来代替。<br />
     *
     * @param {LogProvider} provider
     *
     * @returns {myCustomProvider} 修改或替换日志提供程序。
     */
    // logProvider: provider => myCustomProvider,

    /**
     * 来自 http-proxy-middleware 的日志信息。内部只是'info'、'warn'、'error'级别的日志输出。
     * PS：
     * 1、该选项从“http-proxy-middleware V3.0”开始使用。
     */
    logger: console,

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
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9000。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：
     * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。
     * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。
     */
    target: 'wss://0.0.0.0:9200',

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
     * 是否要验证SSL证书。<br />
     * 1、有效值类型：boolean、undefined。<br />
     */
    secure: false,

    /**
     * 要传递给https.createServer()的对象。<br />
     * 保证跟服务端（webpack-dev-server、Deno）设置的各个证书一样就行。<br />
     * 该选项里头的各个有效属性其实可以参考webpack的顶级配置项“devServer”中的“server.options”选项里的各个属性。<br />
     * 因为它们都是属于“tls.createSecureContext([options])”中的“options”选项，具体的选项说明可见：https://nodejs.org/dist/latest/docs/api/tls.html#tlscreatesecurecontextoptions。<br />
     */
    ssl,

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
     * 带有要添加到目标请求的额外标头的对象，也就是该选项用来设置请求头的。<br />
     * 1、有效值类型：object（{ [ header: string ]: string }）、undefined。<br />
     */
    headers: httpRequestHeaders,

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
     * http-proxy各个事件监听配置。
     * PS：
     * 1、该选项从“http-proxy-middleware V3.0”开始使用。
     */
    on: {
      /**
       * 如果对目标的请求失败，则会发出错误事件。我们不对客户端和代理之间传递的消息以及代理和目标之间传递的消息进行任何错误处理，因此建议您侦听错误并进行处理。<br />
       *
       * @param {Error} err
       * @param {Request} req
       * @param {Response} res
       * @param {string|Partial<url.Url>} target 可选的参数，不一定都有存在。<br />
       *
       * @returns {void} 无返回值。
       */
      error: ( err, req, res, target ) => {
      },

      /**
       * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“web”连接。<br />
       *
       * @param {http.ClientRequest} proxyReq
       * @param {Request} req
       * @param {Response} res
       * @param {httpProxy.ServerOptions} options
       *
       * @returns {void} 无返回值。
       */
      proxyReq: ( proxyReq, req, res, options ) => {
      },

      /**
       * 如果对目标的请求得到响应，则会发出此事件。<br />
       *
       * @param {http.IncomingMessage} proxyRes
       * @param {Request} req
       * @param {Response} res
       *
       * @returns {void} 无返回值。
       */
      proxyRes: ( proxyRes, req, res ) => {
      },

      /**
       * 在发送数据之前发出此事件。它使您有机会更改proxyReq请求对象。适用于“websocket”连接。<br />
       *
       * @param {http.ClientRequest} proxyReq
       * @param {Request} req
       * @param {net.Socket} socket
       * @param {httpProxy.ServerOptions} options
       * @param {any} head
       *
       * @returns {void} 无返回值。
       */
      proxyReqWs: ( proxyReq, req, socket, options, head ) => {
        const arr001 = Reflect.ownKeys( proxyReq ).filter( item => typeof item === 'symbol' );

        logWriteStream.write( `WebSocket代理--->${ options.context }<---Start
原请求方法：${ req.method }
原请求头：
${ JSON.stringify( req.headers, null, 4 ) }

代理请求方法：${ proxyReq.method }
代理请求的protocol：${ proxyReq.protocol }
代理请求的host：${ proxyReq.host }
代理请求的path：${ proxyReq.path }
代理的请求头：
${ JSON.stringify( Object.fromEntries( Object.values( proxyReq[ arr001[ arr001.findIndex( item => item.toString() === 'Symbol(kOutHeaders)' ) ] ] ) ), null, 4 ) }
WebSocket代理--->${ options.context }<---End
\n\n` );
      },

      /**
       * 一旦创建代理websocket并将其通过管道传输到目标websocket，就会发出此事件。<br />
       * PS：<br />
       * 1、“proxySocket”事件已经被废弃了现在是用当前这个事件代替它了。<br />
       *
       * @param {net.Socket} proxySocket
       *
       * @returns {void} 无返回值。
       */
      open: proxySocket => {
      },

      /**
       * 一旦代理websocket关闭，就会发出此事件。<br />
       *
       * @param {Response} proxyRes
       * @param {net.Socket} proxySocket
       * @param {any} proxyHead
       *
       * @returns {void} 无返回值。
       */
      close: ( proxyRes, proxySocket, proxyHead ) => {
      },
    },

    // http-proxy events End
  },
];

export {
  proxyConfig,
};

export default proxyConfig;
