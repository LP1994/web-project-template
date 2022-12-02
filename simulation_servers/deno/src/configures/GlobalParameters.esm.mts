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

// @ts-ignore
const opensslDir: string = import.meta.resolve( '../../openssl' );

// @ts-ignore
const srcDir: string = import.meta.resolve( '../../src' );

// @ts-ignore
const configuresDir: string = import.meta.resolve( '../configures' );
// @ts-ignore
const route_map_configDir: string = import.meta.resolve( '../configures/route_map_config' );

// @ts-ignore
const databaseDir: string = import.meta.resolve( '../database' );
// @ts-ignore
const deno_dbDir: string = import.meta.resolve( '../database/deno_db' );
// @ts-ignore
const firebaseDir: string = import.meta.resolve( '../database/firebase' );
// @ts-ignore
const graphqlDir: string = import.meta.resolve( '../database/graphql' );
// @ts-ignore
const mongoDir: string = import.meta.resolve( '../database/mongo' );
// @ts-ignore
const mysqlDir: string = import.meta.resolve( '../database/mysql' );
// @ts-ignore
const postgresDir: string = import.meta.resolve( '../database/postgres' );
// @ts-ignore
const sqliteDir: string = import.meta.resolve( '../database/sqlite' );
// @ts-ignore
const supabaseDir: string = import.meta.resolve( '../database/supabase' );

// @ts-ignore
const publicDir: string = import.meta.resolve( '../public' );
// @ts-ignore
const routersDir: string = import.meta.resolve( '../routers' );
// @ts-ignore
const serversDir: string = import.meta.resolve( '../servers' );
// @ts-ignore
const servicesDir: string = import.meta.resolve( '../services' );
// @ts-ignore
const ssrDir: string = import.meta.resolve( '../ssr' );

// @ts-ignore
const templateDir: string = import.meta.resolve( '../template' );
// @ts-ignore
const ejsDir: string = import.meta.resolve( '../template/ejs' );
// @ts-ignore
const handlebarsDir: string = import.meta.resolve( '../template/handlebars' );
// @ts-ignore
const htmlDir: string = import.meta.resolve( '../template/html' );
// @ts-ignore
const markdownDir: string = import.meta.resolve( '../template/markdown' );
// @ts-ignore
const mustacheDir: string = import.meta.resolve( '../template/mustache' );
// @ts-ignore
const pug_jadeDir: string = import.meta.resolve( '../template/pug_jade' );

// @ts-ignore
const toolsDir: string = import.meta.resolve( '../tools' );
// @ts-ignore
const third_party_modulesDir: string = import.meta.resolve( '../tools/third_party_modules' );
// @ts-ignore
const universal_tool_for_denoDir: string = import.meta.resolve( '../tools/universal_tool_for_deno' );

// @ts-ignore
const staticDir: string = import.meta.resolve( '../../static' );
// @ts-ignore
const testDir: string = import.meta.resolve( '../../test' );
// @ts-ignore
const uploadDir: string = import.meta.resolve( '../../upload' );
// @ts-ignore
const webDir: string = import.meta.resolve( '../../web' );

// 自定义的路径别名aliasConfig End

/**
 * 自定义的响应头。
 *
 * @type {object}
 */
const httpHeaders: {
  [ key: string ]: string | number | boolean;
} = {
  // 'Content-Security-Policy': 'require-sri-for script style',
  'Service-Worker-Allowed': '/',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Max-Age': 365 * 1 * 24 * 60 * 60,
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Expose-Headers': 'x-file-sri, Transfer-Encoding, Content-Encoding, Content-Length, Accept-Language, Accept-Encoding, Accept-Charset, Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma',
  'Access-Control-Allow-Headers': 'x-file-sri, application/x-www-form-urlencoded, multipart/form-data, text/plain, Content-Type, Content-Length, Accept, Accept-Language, X-Requested-With, Cache-Control',
  'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS, CONNECT, HEAD, PATCH, TRACE',
  'Access-Control-Request-Method': 'PUT, POST, GET, DELETE, OPTIONS, CONNECT, HEAD, PATCH, TRACE',
  'Cache-Control': 'no-siteApp, no-cache, must-revalidate, no-transform',
  'Pragma': 'no-cache',
  'Expires': 0,
};

/**
 * 自定义的响应状态码映射对象。
 *
 * @type {object}
 */
const resMessageStatus: { [ key: string | number ]: object } = {
  // 通用的表示服务端处理报错的错误状态码。
  9999: {
    status: 9999,
    text: 'server handle error',
  },

  // 通用的表示客户端请求成功，服务端也响应成功的成功状态码。
  200: {
    status: 200,
    text: 'OK',
  },

  // 请求体的body为空，这里的空是指null、undefined一类的，具体表示为请求体不携带任何东西给服务端。
  1000: {
    status: 1000,
    text: 'body empty',
  },
  // 请求头中的“content-type”的值不是服务端要求的类型。
  1001: {
    status: 1001,
    text: 'content-type error',
  },
  // 目标不是一个File或Blob类型。
  1002: {
    status: 1002,
    text: 'not a file/Blob type',
  },
  // 查询参数缺失。
  1003: {
    status: 1003,
    text: 'missing query parameter',
  },
  // 请求头中缺少“content-length属性”或其值为0。
  1004: {
    status: 1004,
    text: 'content-length error',
  },
  // 上传的文件大小超过限制。
  1005: {
    status: 1005,
    text: 'file is too large',
  },
};

export {
  // 自定义的路径别名aliasConfig Start
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

  httpHeaders,
  resMessageStatus,
};

export default {
  // 自定义的路径别名aliasConfig Start
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

  httpHeaders,
  resMessageStatus,
};
