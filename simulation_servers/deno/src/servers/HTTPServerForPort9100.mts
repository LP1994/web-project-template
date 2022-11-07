/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPServerForPort9100.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 提供“http:”协议的服务，端口9100。
 */

'use strict';

import {
  type ConnInfo,

  serve,
  // @ts-ignore
} from 'https://deno.land/std/http/server.ts';

import {
  type TypeResponse001,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

import {
  Routers,
  // @ts-ignore
} from '../routers/Routers.esm.mts';

serve(
  (
    request: Request,
    connInfo: ConnInfo,
  ): TypeResponse001 => {
    console.log( `\nHTTP Server request--->Start` );
    /*
     {
     bodyUsed: false,
     headers: Headers {
     accept: "image/avif,image/webp,image/apng,image/svg+xml,image/!*,*!/!*;q=0.8",
     "accept-encoding": "gzip, deflate, br",
     "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
     connection: "keep-alive",
     dnt: "1",
     host: "127.0.0.1:9100",
     referer: "http://127.0.0.1:9100/",
     "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
     "sec-ch-ua-mobile": "?0",
     "sec-ch-ua-platform": '"Windows"',
     "sec-fetch-dest": "image",
     "sec-fetch-mode": "no-cors",
     "sec-fetch-site": "same-origin",
     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Sa..."
     },
     method: "GET",
     redirect: "follow",
     url: "http://127.0.0.1:9100/favicon.ico"
     }
     */
    console.dir( request );
    console.log( `HTTP Server request--->End\n` );

    console.log( `\nHTTP Server connInfo--->Start` );
    /*
     {
     localAddr: { hostname: "127.0.0.1", port: 9100, transport: "tcp" },
     remoteAddr: { hostname: "127.0.0.1", port: 64071, transport: "tcp" }
     }
     */
    console.dir( connInfo );
    console.log( `HTTP Server connInfo--->End\n` );

    return Routers( request );
  },
  {
    port: 9100,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9100”能连接上（http、https、ws、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9100”、“https://localhost:9100”能连接上（http、https、ws、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9100”、“https://127.0.0.1:9100”、“https://192.168.10.101:9100”能连接上（http、https、ws、wss皆是如此）。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9100”能连接上（http、https、ws、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9100”、“https://localhost:9100”能连接上（http、https、ws、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9100”、“https://127.0.0.1:9100”、“https://192.168.10.101:9100”能连接上（http、https、ws、wss皆是如此）。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9100”）跟其中的websocket服务地址（如“wss://localhost:9300”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9300”。<br />
     * 3、然后才能让页面（如“https://localhost:9100”）成功访问其中的websocket服务地址（如“wss://localhost:9300”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9100。<br />
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
      console.log( `\nHTTP Server已启动：http://${ hostname }:${ port }/。\n` );
    },
    onError: ( error: unknown ): TypeResponse001 => {
      console.error( `\nHTTP Server onError--->Start` );
      console.error( error );
      console.error( `HTTP Server onError--->End\n` );

      return InterceptorError.ResError( {
        title: `HTTP Server服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  }
);
