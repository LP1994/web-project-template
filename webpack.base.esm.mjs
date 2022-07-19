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
  createReadStream,
  readFileSync,
} from 'node:fs';

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

import mime from 'mime';

import {
  devServerGlobalParameters,
  httpHeaders,
} from './configures/GlobalParameters.esm.mjs';

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
  node_env = env.NODE_ENV,
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
      index: true,
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
      publicPath: `/${ node_env }`,
      writeToDisk: false,
    },
    headers: httpHeaders,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: false,
    liveReload: true,
    open: [
      {
        target: [
          `http://${ devServerGlobalParameters[ node_env ]?.host }:${ devServerGlobalParameters[ node_env ]?.port }/${ node_env }/pages/HelloWorld.html`,
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
      {
        target: [
          `http://${ devServerGlobalParameters[ node_env ]?.host }:${ devServerGlobalParameters[ node_env ]?.port }/${ node_env }/pages/HelloWorld.html`,
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
      {
        target: [
          `http://${ devServerGlobalParameters[ node_env ]?.host }:${ devServerGlobalParameters[ node_env ]?.port }/${ node_env }/pages/HelloWorld.html`,
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
    port: devServerGlobalParameters[ node_env ]?.port,
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
        res.setHeader( 'x-dev-type', `${ node_env }` );

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
          res.setHeader( 'x-dev-type', `${ node_env }` );

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
          res.setHeader( 'x-dev-type', `${ node_env }` );

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
            res.set( 'x-dev-type', `${ node_env }` );

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
            res.set( 'x-dev-type', `${ node_env }` );

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
            res.set( 'x-dev-type', `${ node_env }` );

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
            res.set( 'x-dev-type', `${ node_env }` );

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
            res.set( 'x-dev-type', `${ node_env }` );

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
            res.set( 'x-dev-type', `${ node_env }` );

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
            res.set( 'x-dev-type', `${ node_env }` );

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
      'src/**/*',
    ],
    webSocketServer: 'ws',
  },
  entryConfig = {
    HelloWorld: {
      import: [
        './src/HelloWorld.js',
      ],
      filename: 'js/[name]_bundle_[contenthash:16].js',
      chunkLoading: 'jsonp',
    },
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
  outputConfig = {
    /**
     * 与output.filename相同，但用于资产模块。<br />
     */
    assetModuleFilename: 'assets/[name]_[sha512:contenthash:hex:16][ext]',
    charset: false,
    /**
     * 此选项确定非初始块文件的名称。如，那些动态导入的JS文件。<br />
     * 1、请注意，这些文件名需要在运行时生成以发送对块的请求。<br />
     */
    chunkFilename: 'js/[name]_chunk_[contenthash:16].js',
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
     * 在发出之前清理输出目录。<br />
     */
    clean: true,
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
      bigIntLiteral: false,
      /**
       * The environment supports const and let for variable declarations.<br />
       */
      const: true,
      /**
       * The environment supports destructuring ('{ a, b } = obj').<br />
       */
      destructuring: false,
      /**
       * The environment supports an async import() function to import EcmaScript modules.<br />
       */
      dynamicImport: false,
      /**
       * The environment supports 'for of' iteration ('for (const x of array) { ... }').<br />
       */
      forOf: true,
      /**
       * The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').<br />
       */
      module: false,
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
     */
    filename: 'js/[name]_bundle_[contenthash:16].js',
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
    path: resolve( __dirname, `./dist/${ node_env }/` ),
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
     */
    publicPath: '../',
    /**
     * 此选项允许加载具有自定义脚本类型的异步块，例如<script type="module" ...>。<br />
     * 1、如果output.module设置为true，则output.scriptType将默认为'module'而不是false。<br />
     */
    scriptType: 'text/javascript',
    sourceMapFilename: 'js/[name]_map_[contenthash:16].map',
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
  watchIgnoredArr,

  aliasConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  externalsConfig,
  nodeConfig,
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
  node_env,
  watchIgnoredArr,

  aliasConfig,
  devServerConfig,
  entryConfig,
  experimentsConfig,
  externalsConfig,
  nodeConfig,
  outputConfig,
  performanceConfig,
  providePluginConfig,
  recordsPathConfig,
  targetConfig,
  watchOptionsConfig,
};
