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
};