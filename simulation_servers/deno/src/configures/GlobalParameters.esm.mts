/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/GlobalParameters.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 19:53:39 星期二
 */

'use strict';

// custom type、interface Start

export type TypeResponse001 = Response | Promise<Response>;

export type TypeFun001 = ( request: Request ) => TypeResponse001;

export type TypeFun002 = ( request: Request ) => Promise<TypeResponse001>;

export type TypeFilePath001 = string | URL;

export type TypeResult001 = boolean | TypeFun001;

// custom type、interface End

// aliasConfig Start

// @ts-ignore
const opensslDir: string = import.meta.resolve( '../../openssl' );

// @ts-ignore
const srcDir: string = import.meta.resolve( '../../src' );
// @ts-ignore
const configuresDir: string = import.meta.resolve( '../configures' );
// @ts-ignore
const publicDir: string = import.meta.resolve( '../public' );
// @ts-ignore
const routersDir: string = import.meta.resolve( '../routers' );
// @ts-ignore
const serversDir: string = import.meta.resolve( '../servers' );
// @ts-ignore
const servicesDir: string = import.meta.resolve( '../services' );

// @ts-ignore
const templateDir: string = import.meta.resolve( '../template' );
// @ts-ignore
const ejsDir: string = import.meta.resolve( '../template/ejs' );

// @ts-ignore
const toolsDir: string = import.meta.resolve( '../tools' );
// @ts-ignore
const third_party_modulesDir: string = import.meta.resolve( '../tools/third_party_modules' );

// @ts-ignore
const staticDir: string = import.meta.resolve( '../../static' );
// @ts-ignore
const uploadDir: string = import.meta.resolve( '../../upload' );
// @ts-ignore
const webDir: string = import.meta.resolve( '../../web' );

// aliasConfig End

const httpHeaders: {
  [ key: string ]: string | number | boolean;
} = {
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
  // 请求体中的content-type值不是服务端要求的类型。
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
};

export {
  // aliasConfig Start
  opensslDir,

  srcDir,
  configuresDir,
  publicDir,
  routersDir,
  serversDir,
  servicesDir,

  templateDir,
  ejsDir,

  toolsDir,
  third_party_modulesDir,

  staticDir,
  uploadDir,
  webDir,
  // aliasConfig End

  httpHeaders,
  resMessageStatus,
};

export default {
  // aliasConfig Start
  opensslDir,

  srcDir,
  configuresDir,
  publicDir,
  routersDir,
  serversDir,
  servicesDir,

  templateDir,
  ejsDir,

  toolsDir,
  third_party_modulesDir,

  staticDir,
  uploadDir,
  webDir,
  // aliasConfig End

  httpHeaders,
  resMessageStatus,
};
