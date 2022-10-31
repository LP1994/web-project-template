/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/App.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  serve,
} from 'https://deno.land/std/http/server.ts';

const wasmCode = new Uint8Array( [
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    133,
    128,
    128,
    128,
    0,
    1,
    96,
    0,
    1,
    127,
    3,
    130,
    128,
    128,
    128,
    0,
    1,
    0,
    4,
    132,
    128,
    128,
    128,
    0,
    1,
    112,
    0,
    0,
    5,
    131,
    128,
    128,
    128,
    0,
    1,
    0,
    1,
    6,
    129,
    128,
    128,
    128,
    0,
    0,
    7,
    145,
    128,
    128,
    128,
    0,
    2,
    6,
    109,
    101,
    109,
    111,
    114,
    121,
    2,
    0,
    4,
    109,
    97,
    105,
    110,
    0,
    0,
    10,
    138,
    128,
    128,
    128,
    0,
    1,
    132,
    128,
    128,
    128,
    0,
    0,
    65,
    42,
    11,
  ] ),
  wasmModule = new WebAssembly.Module( wasmCode ),
  wasmInstance = new WebAssembly.Instance( wasmModule );

console.log( `\nwasmInstance.exports.main().toString()--->${ wasmInstance.exports.main().toString() }\n` );

await serve(
  // 该函数返回：Response、Promise<Response>
  // 请注意，如果用户在完全接收到正文之前挂断连接，则 req.text() 调用可能会失败。确保处理这种情况。
  // 请注意这可能发生在从请求正文中读取的所有方法中，例如 req.json()、req.formData()、req.arrayBuffer()、req.body.getReader().read()、req.body .pipeTo() 等
  (
    request,
    connInfo,
  ) => {
    console.log( `\n\nrequest--->Start` );
    console.dir( request );
    console.log( `request--->End\n\n` );

    console.log( `\n\n\nconnInfo--->Start` );
    console.dir( connInfo );
    console.log( `connInfo--->End\n\n\n` );

    return new Response( `Deno将是Node的终结者。
wasmInstance.exports.main().toString()--->${ wasmInstance.exports.main().toString() }` );
  },
  {
    port: 8520,
    hostname: '0.0.0.0',
    // 该函数返回：undefined
    onListen: ( {
      port,
      hostname,
    } ) => {
      console.log( `\n服务已启动：http://localhost:${ port }/\n` );
    },
    // 该函数返回：Response、Promise<Response>
    onError: error => {
      console.error( `\nonError--->Start` );
      console.error( error );
      console.error( `onError--->End\n` );

      return new Response( `onError--->
${ error }` );
    },
  }
);
