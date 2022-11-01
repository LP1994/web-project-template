/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/GlobalParameters.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 19:53:39 星期二
 */

'use strict';

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
  httpHeaders,
};

export default {
  httpHeaders,
};
