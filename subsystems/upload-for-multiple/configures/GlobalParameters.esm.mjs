/**
 * Project: upload-for-multiple
 * FileDirPath: configures/GlobalParameters.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 用于存放项目中全局的配置属性、变量等等。
 * 1、尽量在这里写供全局用的属性、变量等等，方便一处修改自动作用到任何使用它们的地方。
 */

'use strict';

/**
 * 给浏览器调试用的主机名，不是给“devServer.host”用的。<br />
 * 1、实测注意一点，当用'0.0.0.0'这个值设置给“devServer.host”时，会让服务器可以从外部访问，包括：本地（localhost）、局域网（192.168.1.3）、IPV6等等，但是不能用'0.0.0.0'来访问（Windows系统上是访问不了'0.0.0.0'的！），还是得通过：本地（localhost）、局域网（192.168.1.3）来访问的。<br />
 */
const localHost = 'localhost';

/**
 * 远端调试工具(chii)的本地服务的端口值，值类型只能是number。<br />
 * 1、在package.json中的scripts.Chii4RemoteLikeWeinre里头默认也是用8300的。<br />
 * 2、具体见：notes/其他笔记/远程调试工具chii的使用.txt。<br />
 */
const Chii4RemoteLikeWeinreLocalPort = 8301,
  /**
   * 映射到公网的地址，一般是配合远端调试工具(chii)的远端调试需要，值类型只能是string。<br />
   * 1、null表示还没设置。<br />
   * 2、值形如：https://4238dv65-8300.usw3.devtunnels.ms、https://4238dv65-8300.usw3.devtunnels.ms:8300，切记值末尾不要再加“/”了！！！<br />
   * 3、如果有使用这个公网地址，记得也得在启动命令中添加参数“-d”，如：“-d https://4238dv65-8300.usw3.devtunnels.ms”！<br />
   * 4、具体见：notes/其他笔记/远程调试工具chii的使用.txt。<br />
   */
  Chii4RemoteLikeWeinreRemoteAddr = null;

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
       * 1、可以是：'localhost'、'192.168.1.3'等等。<br />
       */
      host: localHost,
      /**
       * 指定一个端口号来监听请求，给“devServer.port”用的。<br />
       * 1、有效值类型有：string（有一个预设值'auto'，表示自动使用空闲端口）、number。<br />
       * 2、该选项值不能为null或空字符串，要自动使用空闲端口，请使用port: 'auto'。<br />
       */
      port: 8101,
      /**
       * 用于指定开发模式下，构建完成后，自动打开浏览器时，要打开的页面路径。注意，该选项值不是指一个标准网址！
       * 1、该选项值指的是页面路径，是相对于输出文件夹的。如：'pages/Index.html'，表示要打开的页面是存在于输出文件夹“dist/production”下的，有一个“pages”文件夹，其下有一个"Index.html"文件。
       */
      openPage: `pages/Index.html`,
    },
    /**
     * 供webpack.local_server.esm.mjs的devServer用。<br />
     */
    local_server: {
      /**
       * 不是给“devServer.host”用的，是给“devServer.open”用的在浏览器打开页面的host。<br />
       * 1、可以是：'localhost'、'192.168.1.3'等等。<br />
       */
      host: localHost,
      /**
       * 指定一个端口号来监听请求，给“devServer.port”用的。<br />
       * 1、有效值类型有：string（有一个预设值'auto'，表示自动使用空闲端口）、number。<br />
       * 2、该选项值不能为null或空字符串，要自动使用空闲端口，请使用port: 'auto'。<br />
       */
      port: 8201,
      /**
       * 用于指定开发模式下，构建完成后，自动打开浏览器时，要打开的页面路径。注意，该选项值不是指一个标准网址！
       * 1、该选项值指的是页面路径，是相对于输出文件夹的。如：'pages/Index.html'，表示要打开的页面是存在于输出文件夹“dist/production”下的，有一个“pages”文件夹，其下有一个"Index.html"文件。
       */
      openPage: `pages/Index.html`,
    },
  },
  /**
   * 这个是给请求头用的，不是给响应头用的。<br />
   */
  httpRequestHeaders = {
    /**
     * Cache-Control：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
     */
    'Cache-Control': 'no-cache',
    /**
     * Access-Control-Request-Headers：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers
     * 1、浏览器在发出预检请求时使用Access-Control-Request-Headers请求标头，让服务器知道在发出实际请求时客户端可能发送哪些HTTP标头（例如使用setRequestHeader()）。
     * 2、Access-Control-Allow-Headers的补充服务器端标头将回答此浏览器端标头。
     * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
     */
    'Access-Control-Request-Headers': 'deno-custom-file-sri, Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
    /**
     * Access-Control-Request-Method：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method
     * 1、浏览器在发出预检请求时使用Access-Control-Request-Method请求标头，让服务器知道在发出实际请求时将使用哪种HTTP方法。
     * 2、这个标头是必需的，因为预检请求始终是一个选项，并且不使用与实际请求相同的方法。
     * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
     */
    'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
  },
  /**
   * 这个是给响应头用的，不是给请求头用的。<br />
   * 1、关于跨域请求头。<br />
   *   1)当Access-Control-Allow-Origin:*时，不允许使用凭证（即不能设置诸如withCredentials:true、credentials:"include"之类），即不能携带上诸如Cookie之类的凭证。<br />
   *   2)当Access-Control-Allow-Origin:*时，只需确保客户端在发出CORS请求时凭据标志的值为false就可以了：<br />
   *     如果请求使用XMLHttpRequest发出，请确保withCredentials为false。<br />
   *     如果使用服务器发送事件，确保EventSource.withCredentials是false（这是默认值）。<br />
   *     如果使用Fetch API，请确保Request.credentials是"omit"，"omit"表示忽略诸如Cookie之类的凭证。<br />
   *   3)要想客户端既能发起跨域请求，又想将客户端携带的凭证（诸如Cookie之类的凭证）附加到跨域请求上传给服务端，<br />
   *     那么服务端的响应头得如下设置：<br />
   *     'Access-Control-Allow-Credentials': true、<br />
   *     'Access-Control-Allow-Origin': '允许发起跨域请求的客户端的Origin（如：https://localhost:8100），就是不可以是通配符“*”'、<br />
   *     'Vary': 'Origin' <br />
   *     客户端也得如下设置：<br />
   *     确保客户端在发出CORS请求时凭据标志的值为true就可以了：<br />
   *     如果请求使用XMLHttpRequest发出，请确保withCredentials为true。<br />
   *     如果使用服务器发送事件，确保EventSource.withCredentials是true。<br />
   *     如果使用Fetch API，请确保Request.credentials是"include"。<br />
   */
  HttpResponseHeadersFun = ( request, response, context ) => {
    const result = {
      // 'Content-Security-Policy': 'require-sri-for script style',
      /**
       * Clear-Site-Data：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data
       * 1、该标头的值的格式比较特别，必需是用“双引号”括起来，这时就会出现字符串嵌套字符串的情况。
       */
      // 'Clear-Site-Data': '"cache", "cookies", "storage"',
      /**
       * 这是用于客户端发起“Service Worker”脚本文件请求后，服务端响应时，设置在响应头中的。
       * 详细见：https://w3c.github.io/ServiceWorker/#service-worker-allowed
       */
      'Service-Worker-Allowed': '/',
      /**
       * Cache-Control：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
       */
      'Cache-Control': 'no-cache',
      /**
       * Expires：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires
       */
      'Expires': `${ new Date( Date.now() + ( 2 * 60 * 60 * 1000 ) ).toUTCString() }`,
      /**
       * Allow：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow
       */
      'Allow': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
      /**
       * X-DNS-Prefetch-Control：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
       */
      'X-DNS-Prefetch-Control': 'on',
      /**
       * Access-Control-Allow-Credentials：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
       * 1、Access-Control-Allow-Credentials响应标头告诉浏览器是否在包含请求的凭据模式(Request.credentials)时将响应公开给前端JavaScript代码。
       * 2、当包含请求的凭据模式(Request.credentials)时，如果Access-Control-Allow-Credentials值为true，浏览器只会将响应公开给前端JavaScript代码。
       * 3、凭据是cookies、授权标头（authorization headers）或TLS客户端证书（TLS client certificates）。
       * 4、当用作对预检请求的响应的一部分时，这表明是否可以使用凭据进行实际请求。
       * 5、请注意，简单的GET请求不会进行预检。因此，如果对具有凭据的资源发出请求，并且如果此标头未随资源一起返回，则浏览器将忽略响应，并且不会将其返回到Web内容。
       * 6、Access-Control-Allow-Credentials标头与XMLHttpRequest.withCredentials属性或Fetch API的Request()构造函数中的credentials选项结合使用。
       * 7、对于带有证书的CORS请求，浏览器要将响应暴露给前端JavaScript代码，服务器（使用Access-Control-Allow-Credentials标头）和客户端（通过为XHR、Fetch或Ajax请求设置证书模式）都必须表明他们选择包括证书。
       * 8、此标头的唯一有效值为true（区分大小写）。如果您不需要凭据，请完全省略此标头（而不是将其值设置为 false）。
       * 9、当此标头设置为true时，客户端发起的请求，相应的也要设置：如果请求使用XMLHttpRequest发出，请确保withCredentials为true、如果使用Fetch API，请确保Request.credentials是"include"。
       * 10、Access-Control-Allow-Credentials 响应头告诉浏览器，服务器是否允许跨源 HTTP 请求包含凭证。
       * 凭证是 cookie、TLS 客户端证书或包含用户名和密码的验证头。默认情况下，这些凭证不会在跨源请求中发送，这样做会使网站容易受到 CSRF 攻击。
       *
       * 客户端可以通过以下两种方式之一，要求在跨站请求中包含凭证：
       * 使用 fetch()，将 Request() 构造函数中的凭证选项设置为 "include"。
       * 使用 XMLHttpRequest，将 XMLHttpRequest.withCredentials 属性设置为 true。
       *
       * 如果客户要求包含凭据：
       * 如果请求已预检，则预检请求不包含凭据。如果服务器对预检请求的响应将 Access-Control-Allow-Credentials 标头设为 true，则真实请求将包含凭证：否则，浏览器将报告网络错误。
       * 如果未对请求进行预检，则请求将包含凭证，如果服务器的响应未将 Access-Control-Allow-Credentials 标头设为 true，浏览器将报告网络错误。
       * 11、要想客户端既能发起跨域请求，又想将客户端携带的凭证（诸如Cookie之类的凭证）附加到跨域请求上传给服务端，<br />
       * 那么服务端的响应头得如下设置：<br />
       * 'Access-Control-Allow-Credentials': true、<br />
       * 'Access-Control-Allow-Origin': '允许发起跨域请求的客户端的Origin（如：https://localhost:8100），就是不可以是通配符“*”'、<br />
       * 'Vary': 'Origin' <br />
       * 客户端也得如下设置：<br />
       * 确保客户端在发出CORS请求时凭据标志的值为true就可以了：<br />
       * 如果请求使用XMLHttpRequest发出，请确保withCredentials为true。<br />
       * 如果使用服务器发送事件，确保EventSource.withCredentials是true。<br />
       * 如果使用Fetch API，请确保Request.credentials是"include"。<br />
       */
      'Access-Control-Allow-Credentials': true,
      /**
       * Access-Control-Allow-Headers：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
       * 1、Access-Control-Allow-Headers响应标头用于响应预检请求，其中包括Access-Control-Request-Headers以指示在实际请求期间可以使用哪些HTTP标头。
       * 2、如果请求具有Access-Control-Request-Headers标头，则此标头是必需的。
       * 3、注意：始终允许使用CORS安全列表请求标头，并且通常不会在Access-Control-Allow-Headers中列出（除非需要规避安全列表附加限制）。
       * 4、对于没有凭据的请求（没有HTTP cookie或HTTP身份验证信息的请求），值“*”仅算作一个特殊的通配符值。
       * 5、在带有凭据的请求中，它被视为没有特殊语义的文字标头名称“*”。请注意，授权标头（Authorization header）不能使用通配符，并且始终需要明确列出。
       * 6、CORS安全列表请求标头：Accept、Content-Type、Content-Language、Accept-Language。
       * 7、当仅包含CORS安全列表请求标头（以及满足下面列出的附加要求的值）时，请求不需要在CORS上下文中发送预检请求（OPTIONS请求）。
       * 8、您可以使用Access-Control-Allow-Headers标头将更多标头列入安全列表，并在那里列出上述标头以规避以下附加限制：
       *   附加限制，CORS安全列表标头还必须满足以下要求才能成为CORS安全列表请求标头：
       *   1）对于Accept-Language和Content-Language：只能有由0-9、A-Z、a-z、空格或*,-.;=组成的值。
       *   2）对于Accept和Content-Type：不能包含CORS不安全请求标头字节：0x00-0x1F（除了0x09 (HT)，它是允许的）、"():<>?@[\]{}、0x7F (DEL)。
       *   3）对于Content-Type：需要其解析值（忽略参数）的MIME类型为：application/x-www-form-urlencoded、multipart/form-data或text/plain。
       *   4）对于任何标头：值的长度不能大于128个字符。
       */
      'Access-Control-Allow-Headers': 'deno-custom-file-sri, Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
      /**
       * Access-Control-Allow-Methods：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
       * 1、Access-Control-Allow-Methods响应标头指定访问资源以响应预检请求时允许的一种或多种方法。
       * 2、对于没有凭据的请求（没有HTTP cookie或HTTP身份验证信息的请求），值“*”仅算作一个特殊的通配符值。
       * 3、在带有凭据的请求中，它被视为没有特殊语义的文字方法名称“*”。
       */
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
      /**
       * Access-Control-Allow-Origin：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
       * 1、Access-Control-Allow-Origin响应标头指示是否可以与来自给定来源的请求代码共享响应。
       * 2、对于没有凭据的请求，可以指定字面值“*”作为通配符；该值告诉浏览器允许来自任何来源的请求代码访问资源。但是尝试将通配符与凭据一起使用会导致错误。
       * 3、Access-Control-Allow-Origin: <origin>：只能指定一个来源。如果服务器支持来自多个来源的客户端，它必须返回发出请求的特定客户端的来源。
       * 4、关于跨域请求头。<br />
       *   1)当Access-Control-Allow-Origin:*时，不允许使用凭证（即不能设置诸如withCredentials:true、credentials:"include"之类），即不能携带上诸如Cookie之类的凭证。<br />
       *   2)当Access-Control-Allow-Origin:*时，只需确保客户端在发出CORS请求时凭据标志的值为false就可以了：<br />
       *     如果请求使用XMLHttpRequest发出，请确保withCredentials为false。<br />
       *     如果使用服务器发送事件，确保EventSource.withCredentials是false（这是默认值）。<br />
       *     如果使用Fetch API，请确保Request.credentials是"omit"，"omit"表示忽略诸如Cookie之类的凭证。<br />
       *   3)要想客户端既能发起跨域请求，又想将客户端携带的凭证（诸如Cookie之类的凭证）附加到跨域请求上传给服务端，<br />
       *   那么服务端的响应头得如下设置：<br />
       *   'Access-Control-Allow-Credentials': true、<br />
       *   'Access-Control-Allow-Origin': '允许发起跨域请求的客户端的Origin（如：https://localhost:8100），就是不可以是通配符“*”'、<br />
       *   'Vary': 'Origin' <br />
       *   客户端也得如下设置：<br />
       *   确保客户端在发出CORS请求时凭据标志的值为true就可以了：<br />
       *   如果请求使用XMLHttpRequest发出，请确保withCredentials为true。<br />
       *   如果使用服务器发送事件，确保EventSource.withCredentials是true。<br />
       *   如果使用Fetch API，请确保Request.credentials是"include"。<br />
       */
      'Access-Control-Allow-Origin': '*',
      /**
       * Access-Control-Expose-Headers：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
       * 1、CORS安全列表响应标头是CORS响应中的HTTP标头，它被认为可以安全地暴露给客户端脚本。只有列入安全列表的响应标头可用于网页。
       * 2、默认情况下，安全列表包含以下响应标头：Cache-Control、Content-Language、Content-Length、Content-Type、Expires、Last-Modified、Pragma。
       * 3、可以使用Access-Control-Expose-Headers将其他标头添加到安全列表。
       * 4、注意：Content-Length不是原始安全列表响应标头集的一部分。
       * 5、Access-Control-Expose-Headers 响应标头允许服务器指示哪些响应标头应提供给浏览器中运行的脚本，以响应跨域请求。
       * 6、对于没有凭据的请求（没有 HTTP cookie 或 HTTP 身份验证信息的请求），值“*”仅算作一个特殊的通配符值。
       * 7、在带有凭据的请求中，它被视为没有特殊语义的文字标头名称“*”。
       */
      'Access-Control-Expose-Headers': 'deno-custom-file-sri, Authorization, Content-Encoding, Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Last-Modified, Pragma',
      /**
       * Access-Control-Max-Age：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
       * 1、Access-Control-Max-Age响应标头指示预检请求的结果（即Access-Control-Allow-Methods和Access-Control-Allow-Headers标头中包含的信息）可以缓存多长时间（单位：秒）。默认值为5秒。
       * 2、可以缓存结果的最大秒数，作为无符号非负整数。Firefox的上限为24小时（86400秒）。
       * 3、Chromium（v76之前）的上限为10分钟（600秒）。Chromium（从v76开始）的上限为2小时（7200秒）。
       */
      'Access-Control-Max-Age': 2 * 60 * 60,
      /**
       * Access-Control-Request-Headers：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers
       * 1、浏览器在发出预检请求时使用Access-Control-Request-Headers请求标头，让服务器知道在发出实际请求时客户端可能发送哪些HTTP标头（例如使用setRequestHeader()）。
       * 2、Access-Control-Allow-Headers的补充服务器端标头将回答此浏览器端标头。
       * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
       */
      // 'Access-Control-Request-Headers': 'deno-custom-file-sri, Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
      /**
       * Access-Control-Request-Method：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method
       * 1、浏览器在发出预检请求时使用Access-Control-Request-Method请求标头，让服务器知道在发出实际请求时将使用哪种HTTP方法。
       * 2、这个标头是必需的，因为预检请求始终是一个选项，并且不使用与实际请求相同的方法。
       * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
       */
      // 'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
    };

    if( request ){
      // result[ 'Access-Control-Allow-Origin' ] = `${ request.protocol }://${ request.host }:${ request.socket.localPort }`;
      // result[ 'Vary' ] = 'Origin';
    }

    return result;
  },
  /**
   * 注意：仅使用纯字母字符作为自定义变量名称。我们正在使用正则表达式来修补视口值，任何带有特殊字符的变量都可能导致未知问题。<br />
   * 1、自定义属性名称区分大小写--my-color将被视为与--My-color不同的自定义属性。<br />
   */
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable = 'postcss-viewport-height-correction2023',
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
  httpRequestHeaders,
  HttpResponseHeadersFun,
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
  postcssViewportHeightCorrectionJS,
  Chii4RemoteLikeWeinreLocalPort,
  Chii4RemoteLikeWeinreRemoteAddr,
};

export default {
  devServerGlobalParameters,
  httpRequestHeaders,
  HttpResponseHeadersFun,
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
  postcssViewportHeightCorrectionJS,
  Chii4RemoteLikeWeinreLocalPort,
  Chii4RemoteLikeWeinreRemoteAddr,
};
