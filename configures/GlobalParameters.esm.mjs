/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: configures/GlobalParameters.esm.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 用于存放项目中全局的配置属性、变量等等。
 * 1、尽量在这里写供全局用的属性、变量等等，方便一处修改自动作用到任何使用它们的地方。
 */

'use strict';

/**
 * 给浏览器调试用的主机名，不是给“devServer.host”用的。<br />
 * 1、实测注意一点，当用'0.0.0.0'这个值设置给“devServer.host”时，会让服务器可以从外部访问，包括：本地（localhost）、局域网（192.168.1.6）、IPV6等等，但是不能用'0.0.0.0'来访问（访问不了！！！），还是得通过：本地（localhost）、局域网（192.168.1.6）来访问的。<br />
 */
const localHost = '192.168.1.3';

/**
 * 远端调试工具(weinre)的本地服务的端口值，值类型只能是string。<br />
 * 1、在package.json中的scripts.weinre里头默认也是用'8300'的。<br />
 */
const weinreLocalPort = '8300',
  /**
   * 映射到公网的IP地址，一般是配合远端调试工具(weinre)的远端调试需要，值类型只能是string。<br />
   * 1、为空字符串表示还没设置。<br />
   */
  weinrePublicNetworkHost = '',
  /**
   * 映射到公网的端口，一般是配合远端调试工具(weinre)的远端调试需要，值类型只能是string。<br />
   * 1、为空字符串表示还没设置。<br />
   */
  weinrePublicNetworkPort = '';

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
   * 简版的动态计算“rem”的JS代码，一般被用来注入到.ejs模板中。<br />
   * 1、全局可用的dynamicREM函数接受一个number类型的参数，默认值是375，表示以iPhone 6为基准设计稿的尺寸。<br />
   */
  dynamicREM = `<script>
!function(i,e){'undefined'!==typeof module&&'object'===typeof module&&'object'===typeof exports?module.exports=e:'function'===typeof define&&(define.amd||define.cmd)?define([],e):i.deviceInfo=e}('undefined'!==typeof window?window:this,function(){'use strict';String.prototype.includes||(String.prototype.includes=function(i,e){return'number'!==typeof e&&(e=0),!(e+i.length>this.length)&&-1!==this.indexOf(i,e)});var i=navigator.platform,e=navigator.userAgent,s=window.devicePixelRatio,n=i.includes('MacIntel')||e.includes('Macintosh')||e.includes('Intel Mac OS'),d=i.includes('Win32')||i.includes('Win64')||e.includes('Windows NT')||e.includes('WOW64'),l=i.includes('iPad')||e.includes('iPad'),u=i.includes('iPhone')||e.includes('iPhone'),c=e.includes('Windows Phone'),o=e.includes('(BB')||e.includes('BB10')||e.includes('RIM'),r=e.includes('MeeGo'),t=i.includes('Linux')||e.includes('Linux')||e.includes('Android'),a=n||d,_=e.includes('Mobile')||l||u||c||o||r||t,B=e.includes('MicroMessenger')||e.includes('WindowsWechat'),w=(e.includes(' UBrowser')||e.includes('UCBrowser'))&&!e.includes('tmall'),M=e.includes('BIDUBrowser')||e.includes('baidubrowser')||e.includes('FlyFlow'),f=e.includes('2345Explorer')||e.includes('Mb2345Browser'),P=e.includes('LBBROWSER')||e.includes('LieBaoFast'),p=e.includes('SogouMSE')||e.includes('SogouMobileBrowser')||e.includes('MetaSr')||e.includes(' SE '),S=e.includes('Maxthon')||e.includes('MXiOS')||e.includes('MxBrowser'),h=(e.includes('QQBrowser')||e.includes('MQQBrowser')||e.includes('QQBrowserLite'))&&!B,Q=e.includes('QHBrowser')||e.includes('QihooBrowser'),b=e.includes('YaBrowser')||e.includes('Yowser'),g=e.includes('OPR')||e.includes('OPT'),m=e.includes('Edge/')||e.includes('EdgA/')||e.includes('EdgiOS/'),W=e.includes('Firefox/')||e.includes('FxiOS'),C=e.includes('baiduboxapp'),x=e.includes('MiuiBrowser'),A=e.includes('SogouSearch'),O=e.includes('QQ/'),y=e.includes('Weibo')||e.includes('weibo'),E=e.includes('tmall')||e.includes('TM/'),I=e.includes('AlipayClient'),F=e.includes('Trident')||e.includes('MSIE')||e.includes('compatible'),T=e.includes('TaoBrowser'),L=e.includes('CriOS'),v=B||w||M||f||P||p||S||h||Q||b||g||m||W||C||x||A||O||y||E||I||F||T,R={pf:i,ua:e,dpr:s,is_PC:a,is_Mobile:_,is_PCMac:n,is_iPad:l,is_iPhone:u,is_PCWin:d,is_WP:c,is_BB:o,is_MeeGo:r,is_Android:t,is_WX:B,is_UC:w,is_BDB:M,is_2345:f,is_LB:P,is_SGB:p,is_AY:S,is_QQB:h,is_360:Q,is_YB:b,is_OperaB:g,is_Edge:m,is_FF:W,is_QQAPP:C,is_MIB:x,is_SGAPP:A,is_QQ:O,is_WBAPP:y,is_TMAPP:E,is_AlipayC:I,is_IE:F,is_TaoB:T,is_iOSChrome:L,is_Safari:(n||l||u)&&e.includes('Safari/')&&!e.includes('Chrome')&&!(v||L),is_Chrome:L||e.includes('Chrome/')&&e.includes('Safari/')&&!v};return n||d||l||u||c||o||r||t?R.other=!1:(R.other=!0,R.is_Android=!0,a||_||(R.is_PC=!0,R.is_Mobile=!1)),R});
!function(e,n){'undefined'!==typeof module&&'object'===typeof module&&'object'===typeof exports?module.exports=n():'function'===typeof define&&(define.amd||define.cmd)?define([],n()):e.dynamicREM=n()}('undefined'!==typeof window?window:this,function(){'use strict';return function(e){e||(e=375);var n=document.documentElement,t=function(t){n.style.fontSize=n.clientWidth/e*16+'px'};document.addEventListener('DOMContentLoaded',t,!1),window.addEventListener('resize',t,!1)}});
deviceInfo().is_Mobile&&dynamicREM();
</script>`,
  /**
   * 1、关于跨域请求头。<br />
   *   1)当Access-Control-Allow-Origin:*时，不允许使用凭证（即withCredentials:true）。<br />
   *   2)当Access-Control-Allow-Origin:*时，只需确保客户端在发出CORS请求时凭据标志的值为false就可以了：<br />
   *     如果请求使用XMLHttpRequest发出，请确保withCredentials为false。<br />
   *     如果使用服务器发送事件，确保EventSource.withCredentials是false（这是默认值）。<br />
   *     如果使用Fetch API，请确保Request.credentials是"omit"。<br />
   */
  httpHeaders = {
    'Service-Worker-Allowed': '/',
    // 'Content-Security-Policy': 'require-sri-for script style',
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
  postcssViewportHeightCorrectionJS = `var customViewportCorrectionVariable='${ postcssViewportHeightCorrectionCustomViewportCorrectionVariable }';function setViewportProperty(doc){var prevClientHeight,customVar='--'+(customViewportCorrectionVariable||'vh');function handleResize(){var clientHeight=doc.clientHeight;if(clientHeight===prevClientHeight){return;}requestAnimationFrame(function updateViewportHeight(){doc.style.setProperty(customVar,(clientHeight*0.01)+'px');prevClientHeight=clientHeight;});}handleResize();return handleResize;}window.addEventListener('resize',setViewportProperty(document.documentElement));`,
  /**
   * 动态插入到页面的远端调式工具(weinre)的JS代码。<br />
   */
  weinreDevTool = `<script>var weinreDevTool_elem=document.createElement('script'),hostName_str=location.hostname;if(hostName_str==='${ localHost }'){weinreDevTool_elem.src='http://'+hostName_str+':${ weinreLocalPort }/target/target-script-min.js#iOS001';}else if(hostName_str==='${ weinrePublicNetworkHost }'){weinreDevTool_elem.src='http://'+hostName_str+':${ weinrePublicNetworkPort }/target/target-script-min.js#iOS001';}document.body.appendChild(weinreDevTool_elem);</script>`;

export {
  devServerGlobalParameters,
  dynamicREM,
  httpHeaders,
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
  postcssViewportHeightCorrectionJS,
  weinreDevTool,
};

export default {
  devServerGlobalParameters,
  dynamicREM,
  httpHeaders,
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
  postcssViewportHeightCorrectionJS,
  weinreDevTool,
};
