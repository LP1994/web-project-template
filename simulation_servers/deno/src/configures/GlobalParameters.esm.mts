/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/GlobalParameters.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 19:53:39 星期二
 */

/**
 * 用于存放特定于这个项目的各种全局参数、变量、配置等等。
 * 1、尽量在这里写供全局用的属性、变量等等，方便一处修改自动作用到任何使用它们的地方。
 */

'use strict';

// 自定义的type（命名以“Type”开头，如：type TypeMyString = string;）、interface Start

export type TypeResponse001 = Response | Promise<Response>;

export type TypeFun001 = ( request: Request ) => TypeResponse001;

export type TypeFun002 = ( request: Request ) => Promise<TypeResponse001>;

export type TypeFilePath001 = string | URL;

export type TypeResult001 = boolean | TypeFun001;

// 自定义的type（命名以“Type”开头，如：type TypeMyString = string;）、interface End

// 自定义的路径别名aliasConfig Start

const logDir: string = import.meta.resolve( '../../log' );

const opensslDir: string = import.meta.resolve( '../../openssl' );

const srcDir: string = import.meta.resolve( '../../src' );

const configuresDir: string = import.meta.resolve( '../configures' );
const route_map_configDir: string = import.meta.resolve( '../configures/route_map_config' );

const databaseDir: string = import.meta.resolve( '../database' );
const deno_dbDir: string = import.meta.resolve( '../database/deno_db' );
const firebaseDir: string = import.meta.resolve( '../database/firebase' );
const graphqlDir: string = import.meta.resolve( '../database/graphql' );
const mongoDir: string = import.meta.resolve( '../database/mongo' );
const mysqlDir: string = import.meta.resolve( '../database/mysql' );
const postgresDir: string = import.meta.resolve( '../database/postgres' );
const sqliteDir: string = import.meta.resolve( '../database/sqlite' );
const supabaseDir: string = import.meta.resolve( '../database/supabase' );

const publicDir: string = import.meta.resolve( '../public' );
const routersDir: string = import.meta.resolve( '../routers' );
const serversDir: string = import.meta.resolve( '../servers' );
const servicesDir: string = import.meta.resolve( '../services' );
const ssrDir: string = import.meta.resolve( '../ssr' );

const templateDir: string = import.meta.resolve( '../template' );
const ejsDir: string = import.meta.resolve( '../template/ejs' );
const handlebarsDir: string = import.meta.resolve( '../template/handlebars' );
const htmlDir: string = import.meta.resolve( '../template/html' );
const markdownDir: string = import.meta.resolve( '../template/markdown' );
const mustacheDir: string = import.meta.resolve( '../template/mustache' );
const pug_jadeDir: string = import.meta.resolve( '../template/pug_jade' );

const toolsDir: string = import.meta.resolve( '../tools' );
const third_party_modulesDir: string = import.meta.resolve( '../tools/third_party_modules' );
const universal_tool_for_denoDir: string = import.meta.resolve( '../tools/universal_tool_for_deno' );

const staticDir: string = import.meta.resolve( '../../static' );
const testDir: string = import.meta.resolve( '../../test' );
const uploadDir: string = import.meta.resolve( '../../upload' );
const webDir: string = import.meta.resolve( '../../web' );

// 自定义的路径别名aliasConfig End

/**
 * @type {{ [ key: string ]: string | number | boolean; }} 自定义的响应头。
 * 1、关于跨域请求头。<br />
 *   1)当Access-Control-Allow-Origin:*时，不允许使用凭证（即withCredentials:true）。<br />
 *   2)当Access-Control-Allow-Origin:*时，只需确保客户端在发出CORS请求时凭据标志的值为false就可以了：<br />
 *     如果请求使用XMLHttpRequest发出，请确保withCredentials为false。<br />
 *     如果使用服务器发送事件，确保EventSource.withCredentials是false（这是默认值）。<br />
 *     如果使用Fetch API，请确保Request.credentials是"omit"。<br />
 */
const httpResponseHeaders: HeadersInit = {
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
  'Cache-Control': 'no-store',
  /**
   * Expires：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires
   */
  'Expires': '0',
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
   */
  'Access-Control-Allow-Credentials': 'true',
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
  'Access-Control-Allow-Headers': 'X-Custom-Header-File-SRI, Authorization, Accept, Content-Type, Content-Language, Accept-Language',
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
  'Access-Control-Expose-Headers': 'X-Custom-Header-File-SRI, Authorization, Content-Encoding, Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Last-Modified, Pragma',
  /**
   * Access-Control-Max-Age：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
   * 1、Access-Control-Max-Age响应标头指示预检请求的结果（即Access-Control-Allow-Methods和Access-Control-Allow-Headers标头中包含的信息）可以缓存多长时间（单位：秒）。默认值为5秒。
   * 2、可以缓存结果的最大秒数，作为无符号非负整数。Firefox的上限为24小时（86400秒）。
   * 3、Chromium（v76之前）的上限为10分钟（600秒）。Chromium（从v76开始）的上限为2小时（7200秒）。
   */
  'Access-Control-Max-Age': `${ 2 * 60 * 60 }`,
  /**
   * Access-Control-Request-Headers：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers
   * 1、浏览器在发出预检请求时使用Access-Control-Request-Headers请求标头，让服务器知道在发出实际请求时客户端可能发送哪些HTTP标头（例如使用setRequestHeader()）。
   * 2、Access-Control-Allow-Headers的补充服务器端标头将回答此浏览器端标头。
   * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
   */
  // 'Access-Control-Request-Headers': 'X-Custom-Header-File-SRI, Authorization, Accept, Content-Type, Content-Language, Accept-Language',
  /**
   * Access-Control-Request-Method：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method
   * 1、浏览器在发出预检请求时使用Access-Control-Request-Method请求标头，让服务器知道在发出实际请求时将使用哪种HTTP方法。
   * 2、这个标头是必需的，因为预检请求始终是一个选项，并且不使用与实际请求相同的方法。
   * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
   */
  // 'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
};

/**
 * @type {{ [ key: string | number ]: { status: number; statusText: string; }; }} 自定义的响应状态码映射对象。
 */
const resMessageStatus: {
  [ key: string | number ]: {
    status: number;
    statusText: string;
  };
} = {
  // 通用的表示服务端处理报错的错误状态码。
  9999: {
    status: 9999,
    statusText: 'server handle error',
  },

  // 通用的表示客户端请求成功，服务端也响应成功的成功状态码。
  200: {
    status: 200,
    statusText: 'OK',
  },

  // 请求体的body为空，这里的空是指null、undefined一类的，具体表示为请求体不携带任何东西给服务端。
  1000: {
    status: 1000,
    statusText: 'body empty',
  },
  // 请求头中的“content-type”的值不是服务端要求的类型。
  1001: {
    status: 1001,
    statusText: 'content-type error',
  },
  // 目标不是一个File或Blob类型。
  1002: {
    status: 1002,
    statusText: 'not a file/Blob type',
  },
  // 查询参数缺失。
  1003: {
    status: 1003,
    statusText: 'missing query parameter',
  },
  // 请求头中缺少“content-length属性”或其值为0。
  1004: {
    status: 1004,
    statusText: 'content-length error',
  },
  // 上传的文件大小超过限制。
  1005: {
    status: 1005,
    statusText: 'file is too large',
  },
};

/**
 * @type {{ [ key: string | number ]: { status: number; statusText: string; }; }} 标准的HTTP响应状态码映射对象。
 * 详细见：https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
const HTTPStatus: {
  [ key: string | number ]: {
    status: number;
    statusText: string;
  };
} = {
  // 信息响应。
  100: {
    status: 100,
    statusText: 'Continue',
  },
  101: {
    status: 101,
    statusText: 'Switching Protocols',
  },
  102: {
    status: 102,
    statusText: 'Processing',
  },
  103: {
    status: 103,
    statusText: 'Early Hints',
  },

  // 成功响应。
  200: {
    status: 200,
    statusText: 'OK',
  },
  201: {
    status: 201,
    statusText: 'Created',
  },
  202: {
    status: 202,
    statusText: 'Accepted',
  },
  203: {
    status: 203,
    statusText: 'Non-Authoritative Information',
  },
  204: {
    status: 204,
    statusText: 'No Content',
  },
  205: {
    status: 205,
    statusText: 'Reset Content',
  },
  206: {
    status: 206,
    statusText: 'Partial Content',
  },
  207: {
    status: 207,
    statusText: 'Multi-Status',
  },
  208: {
    status: 208,
    statusText: 'Already Reported',
  },
  226: {
    status: 226,
    statusText: 'IM Used',
  },

  // 重定向消息。
  300: {
    status: 300,
    statusText: 'Multiple Choices',
  },
  301: {
    status: 301,
    statusText: 'Moved Permanently',
  },
  302: {
    status: 302,
    statusText: 'Found',
  },
  303: {
    status: 303,
    statusText: 'See Other',
  },
  304: {
    status: 304,
    statusText: 'Not Modified',
  },
  305: {
    status: 305,
    statusText: 'Use Proxy',
  },
  306: {
    status: 306,
    statusText: 'unused',
  },
  307: {
    status: 307,
    statusText: 'Temporary Redirect',
  },
  308: {
    status: 308,
    statusText: 'Permanent Redirect',
  },

  // 客户端错误响应。
  400: {
    status: 400,
    statusText: 'Bad Request',
  },
  401: {
    status: 401,
    statusText: 'Unauthorized',
  },
  402: {
    status: 402,
    statusText: 'Payment Required',
  },
  403: {
    status: 403,
    statusText: 'Forbidden',
  },
  404: {
    status: 404,
    statusText: 'Not Found',
  },
  405: {
    status: 405,
    statusText: 'Method Not Allowed',
  },
  406: {
    status: 406,
    statusText: 'Not Acceptable',
  },
  407: {
    status: 407,
    statusText: 'Proxy Authentication Required',
  },
  408: {
    status: 408,
    statusText: 'Request Timeout',
  },
  409: {
    status: 409,
    statusText: 'Conflict',
  },
  410: {
    status: 410,
    statusText: 'Gone',
  },
  411: {
    status: 411,
    statusText: 'Length Required',
  },
  412: {
    status: 412,
    statusText: 'Precondition Failed',
  },
  413: {
    status: 413,
    statusText: 'Payload Too Large',
  },
  414: {
    status: 414,
    statusText: 'URI Too Long',
  },
  415: {
    status: 415,
    statusText: 'Unsupported Media Type',
  },
  416: {
    status: 416,
    statusText: 'Range Not Satisfiable',
  },
  417: {
    status: 417,
    statusText: 'Expectation Failed',
  },
  418: {
    status: 418,
    statusText: `I'm a teapot`,
  },
  421: {
    status: 421,
    statusText: 'Misdirected Request',
  },
  422: {
    status: 422,
    statusText: 'Unprocessable Entity',
  },
  423: {
    status: 423,
    statusText: 'Locked',
  },
  424: {
    status: 424,
    statusText: 'Failed Dependency',
  },
  425: {
    status: 425,
    statusText: 'Too Early',
  },
  426: {
    status: 426,
    statusText: 'Upgrade Required',
  },
  428: {
    status: 428,
    statusText: 'Precondition Required',
  },
  429: {
    status: 429,
    statusText: 'Too Many Requests',
  },
  431: {
    status: 431,
    statusText: 'Request Header Fields Too Large',
  },
  451: {
    status: 451,
    statusText: 'Unavailable For Legal Reasons',
  },

  // 服务端错误响应。
  500: {
    status: 500,
    statusText: 'Internal Server Error',
  },
  501: {
    status: 501,
    statusText: 'Not Implemented',
  },
  502: {
    status: 502,
    statusText: 'Bad Gateway',
  },
  503: {
    status: 503,
    statusText: 'Service Unavailable',
  },
  504: {
    status: 504,
    statusText: 'Gateway Timeout',
  },
  505: {
    status: 505,
    statusText: 'HTTP Version Not Supported',
  },
  506: {
    status: 506,
    statusText: 'Variant Also Negotiates',
  },
  507: {
    status: 507,
    statusText: 'Insufficient Storage',
  },
  508: {
    status: 508,
    statusText: 'Loop Detected',
  },
  510: {
    status: 510,
    statusText: 'Not Extended',
  },
  511: {
    status: 511,
    statusText: 'Network Authentication Required',
  },
};

export {
  // 自定义的路径别名aliasConfig Start
  logDir,
  opensslDir,

  srcDir,

  configuresDir,
  route_map_configDir,

  databaseDir,
  deno_dbDir,
  firebaseDir,
  graphqlDir,
  mongoDir,
  mysqlDir,
  postgresDir,
  sqliteDir,
  supabaseDir,

  publicDir,
  routersDir,
  serversDir,
  servicesDir,
  ssrDir,

  templateDir,
  ejsDir,
  handlebarsDir,
  htmlDir,
  markdownDir,
  mustacheDir,
  pug_jadeDir,

  toolsDir,
  third_party_modulesDir,
  universal_tool_for_denoDir,

  staticDir,
  testDir,
  uploadDir,
  webDir,
  // 自定义的路径别名aliasConfig End

  httpResponseHeaders,
  resMessageStatus,
  HTTPStatus,
};

export default {
  // 自定义的路径别名aliasConfig Start
  logDir,
  opensslDir,

  srcDir,

  configuresDir,
  route_map_configDir,

  databaseDir,
  deno_dbDir,
  firebaseDir,
  graphqlDir,
  mongoDir,
  mysqlDir,
  postgresDir,
  sqliteDir,
  supabaseDir,

  publicDir,
  routersDir,
  serversDir,
  servicesDir,
  ssrDir,

  templateDir,
  ejsDir,
  handlebarsDir,
  htmlDir,
  markdownDir,
  mustacheDir,
  pug_jadeDir,

  toolsDir,
  third_party_modulesDir,
  universal_tool_for_denoDir,

  staticDir,
  testDir,
  uploadDir,
  webDir,
  // 自定义的路径别名aliasConfig End

  httpResponseHeaders,
  resMessageStatus,
  HTTPStatus,
};
