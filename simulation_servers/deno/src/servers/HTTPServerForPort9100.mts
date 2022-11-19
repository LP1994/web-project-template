/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPServerForPort9100.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 提供“http:”协议的服务，端口9100，基于HTTP/1.1。
 */

'use strict';

import {
  type ConnInfo,

  serve,
  // @ts-ignore
} from 'DenoStd/http/server.ts';

import {
  type TypeResponse001,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  MyConsole,
  // @ts-ignore
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mjs';

// @ts-ignore
import InterceptorError from 'public/InterceptorError.esm.mts';

import {
  Routers,
  // @ts-ignore
} from 'routers/Routers.esm.mts';

serve(
  (
    request: Request,
    connInfo: ConnInfo,
  ): TypeResponse001 => {
    MyConsole.Cyan( `\nHTTP Server request--->Start\n` );
    console.dir( request );
    MyConsole.Cyan( `\nHTTP Server request--->End\n` );

    MyConsole.Cyan( `
HTTP Server connInfo--->Start
${ JSON.stringify( connInfo, null, ' ' ) }
HTTP Server connInfo--->End
` );

    return Routers( request );
  },
  {
    port: 9100,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“http://localhost:9100”能连接上。<br />
     * 2、当设置为'127.0.0.1'时，用如“http://127.0.0.1:9100”、“http://localhost:9100”能连接上。<br />
     * 3、当设置为'0.0.0.0'时，用如“http://localhost:9100”、“http://127.0.0.1:9100”、“http://192.168.10.101:9100”能连接上。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“http://localhost:9100”能连接上。<br />
     * 2、当设置为'127.0.0.1'时，用如“http://127.0.0.1:9100”、“http://localhost:9100”能连接上。<br />
     * 3、当设置为'0.0.0.0'时，用如“http://localhost:9100”、“http://127.0.0.1:9100”、“http://192.168.10.101:9100”能连接上。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9100”）跟其中的websocket服务地址（如“wss://localhost:9200”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9200”。<br />
     * 3、然后才能让页面（如“https://localhost:9100”）成功访问其中的websocket服务地址（如“wss://localhost:9200”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：http://0.0.0.0:9100。<br />
     */
    hostname: '0.0.0.0',
    onListen: (
      {
        hostname,
        port,
      }: {
        hostname: string;
        port: number;
      }
    ): void => {
      MyConsole.Cyan( `\nHTTP Server已启动：http://${ hostname }:${ port }/。\n` );
    },
    onError: ( error: unknown ): TypeResponse001 => {
      MyConsole.Red( `
HTTP Server onError--->Start
${ ( error as Error ).message }
HTTP Server onError--->End
` );

      return InterceptorError.ResError( {
        title: `HTTP Server服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  }
);
