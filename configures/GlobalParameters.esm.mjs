/**
 * Project: web-project-template
 * FileDirPath: configures/GlobalParameters.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 用于存放项目中全局的配置属性、变量等等。
 * 1、尽量在这里写供全局用的属性、变量等等，方便一处修改自动作用到任何使用它们的地方。
 */

'use strict';

/**
 * 给浏览器调试用的主机名，不是给“devServer.host”用的。<br />
 * 1、实测注意一点，当用'0.0.0.0'这个值设置给“devServer.host”时，会让服务器可以从外部访问，包括：本地（localhost）、局域网（192.168.1.6）、IPV6等等，但是不能用'0.0.0.0'来访问（访问不了！），还是得通过：本地（localhost）、局域网（192.168.1.6）来访问的。<br />
 */
const localHost = 'localhost';

/**
 * 远端调试工具(weinre)的本地服务的端口值，值类型只能是number。<br />
 * 1、在package.json中的scripts.weinre里头默认也是用8300的。<br />
 */
const weinreLocalPort = 8300,
  /**
   * 映射到公网的IP地址，一般是配合远端调试工具(weinre)的远端调试需要，值类型只能是string。<br />
   * 1、null表示还没设置。<br />
   */
  weinrePublicNetworkHost = null,
  /**
   * 映射到公网的端口，一般是配合远端调试工具(weinre)的远端调试需要，值类型只能是string。<br />
   * 1、null表示还没设置。<br />
   */
  weinrePublicNetworkPort = null;

/**
 * 给devServer用的参数，分2种环境dev_server、local_server。<br />
 */
const devServerGlobalParameters = {
    /**
     * 供webpack.dev.esm.mjs的devServer用。<br />
     */
    dev_server: {
      /**
       * 不是给“devServer.host”用的，是给“devServer.open”用的在浏览器打开页面的host。<br />
       * 1、可以是：'localhost'、'192.168.1.6'等等。<br />
       */
      host: localHost,
      /**
       * 指定一个端口号来监听请求，给“devServer.port”用的。<br />
       * 1、有效值类型有：string（有一个预设值'auto'，表示自动使用空闲端口）、number。<br />
       * 2、该选项值不能为null或空字符串，要自动使用空闲端口，请使用port: 'auto'。<br />
       */
      port: 8100,
    },
    /**
     * 供webpack.local_server.esm.mjs的devServer用。<br />
     */
    local_server: {
      /**
       * 不是给“devServer.host”用的，是给“devServer.open”用的在浏览器打开页面的host。<br />
       * 1、可以是：'localhost'、'192.168.1.6'等等。<br />
       */
      host: localHost,
      /**
       * 指定一个端口号来监听请求，给“devServer.port”用的。<br />
       * 1、有效值类型有：string（有一个预设值'auto'，表示自动使用空闲端口）、number。<br />
       * 2、该选项值不能为null或空字符串，要自动使用空闲端口，请使用port: 'auto'。<br />
       */
      port: 8200,
    },
  },
  /**
   * 1、关于跨域请求头。<br />
   *   1)当Access-Control-Allow-Origin:*时，不允许使用凭证（即withCredentials:true）。<br />
   *   2)当Access-Control-Allow-Origin:*时，只需确保客户端在发出CORS请求时凭据标志的值为false就可以了：<br />
   *     如果请求使用XMLHttpRequest发出，请确保withCredentials为false。<br />
   *     如果使用服务器发送事件，确保EventSource.withCredentials是false（这是默认值）。<br />
   *     如果使用Fetch API，请确保Request.credentials是"omit"。<br />
   */
  httpHeaders = {
    // 'Content-Security-Policy': 'require-sri-for script style',
    'Service-Worker-Allowed': '/',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': 365 * 1 * 24 * 60 * 60,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Expose-Headers': 'Transfer-Encoding, Content-Encoding, Content-Length, Accept-Language, Accept-Encoding, Accept-Charset, Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma',
    'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded, multipart/form-data, text/plain, Content-Type, Content-Length, Accept, Accept-Language, X-Requested-With, Cache-Control',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS, CONNECT, HEAD, PATCH, TRACE',
    'Access-Control-Request-Method': 'PUT, POST, GET, DELETE, OPTIONS, CONNECT, HEAD, PATCH, TRACE',
    'Cache-Control': 'no-siteApp, no-cache, must-revalidate, no-transform',
    'Pragma': 'no-cache',
    'Expires': 0,
  },
  /**
   * 注意：仅使用纯字母字符作为自定义变量名称。我们正在使用正则表达式来修补视口值，任何带有特殊字符的变量都可能导致未知问题。<br />
   * 1、自定义属性名称区分大小写--my-color将被视为与--My-color不同的自定义属性。<br />
   */
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable = 'postcss-viewport-height-correction2022',
  /**
   * 使用postcss-viewport-height-correction插件时需要手动引入的JS，其是为了解决height: 100vh在移动端浏览器（尤其是iOS端的浏览器）上出现的“怪异”现象，哪怕不是100vh，如：50vh、75vh、-1vh也会出现怪异现象。
   * 1、相关文章可见：<br />
   * https://cloud.tencent.com/developer/article/2031944
   * https://www.jianshu.com/p/437fd5b603de
   * 2、该插件的使用需要手动引入部分JS，具体写法见：<br />
   * https://github.com/Faisal-Manzer/postcss-viewport-height-correction
   * 3、注意：仅使用纯字母字符作为自定义变量名称。我们正在使用正则表达式来修补视口值，任何带有特殊字符的变量都可能导致未知问题。<br />
   * 4、自定义属性名称区分大小写--my-color将被视为与--My-color不同的自定义属性。<br />
   * 5、默认值为：vh。<br />
   * 6、里面的变量customViewportCorrectionVariable的值要跟插件中的选项variable的值保持一致。<br />
   */
  postcssViewportHeightCorrectionJS = `var customViewportCorrectionVariable='${ postcssViewportHeightCorrectionCustomViewportCorrectionVariable }';function setViewportProperty(doc){var prevClientHeight,customVar='--'+(customViewportCorrectionVariable||'vh');function handleResize(){var clientHeight=doc.clientHeight;if(clientHeight===prevClientHeight){return;}requestAnimationFrame(function updateViewportHeight(){doc.style.setProperty(customVar,(clientHeight*0.01)+'px');prevClientHeight=clientHeight;});}handleResize();return handleResize;}window.addEventListener('resize',setViewportProperty(document.documentElement));`;

export {
  devServerGlobalParameters,
  httpHeaders,
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
  postcssViewportHeightCorrectionJS,
  weinreLocalPort,
  weinrePublicNetworkHost,
  weinrePublicNetworkPort,
};

export default {
  devServerGlobalParameters,
  httpHeaders,
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
  postcssViewportHeightCorrectionJS,
  weinreLocalPort,
  weinrePublicNetworkHost,
  weinrePublicNetworkPort,
};
