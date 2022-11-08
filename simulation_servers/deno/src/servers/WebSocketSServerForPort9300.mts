/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/WebSocketSServerForPort9300.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 提供“wss:”协议的服务，端口9300，基于HTTP/1.1。
 */

'use strict';

import {
  type ConnInfo,

  serveTls,
  // @ts-ignore
} from 'https://deno.land/std/http/server.ts';

import {
  type TypeResponse001,

  opensslDir,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

import {
  Routers,
  // @ts-ignore
} from '../routers/Routers.esm.mts';

serveTls(
  (
    request: Request,
    connInfo: ConnInfo,
  ): TypeResponse001 => {
    console.log( `\nWebSocketS Server request--->Start` );
    /*
     {
     bodyUsed: false,
     headers: Headers {
     accept: "image/avif,image/webp,image/apng,image/svg+xml,image/!*,*!/!*;q=0.8",
     "accept-encoding": "gzip, deflate, br",
     "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
     connection: "keep-alive",
     dnt: "1",
     host: "127.0.0.1:9300",
     referer: "https://127.0.0.1:9300/",
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
     url: "https://127.0.0.1:9300/favicon.ico"
     }
     */
    console.dir( request );
    console.log( `WebSocketS Server request--->End\n` );

    console.log( `\nWebSocketS Server connInfo--->Start` );
    /*
     {
     localAddr: { hostname: "127.0.0.1", port: 9300, transport: "tcp" },
     remoteAddr: { hostname: "127.0.0.1", port: 64071, transport: "tcp" }
     }
     */
    console.dir( connInfo );
    console.log( `WebSocketS Server connInfo--->End\n` );

    return Routers( request );
  },
  {
    port: 9300,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“wss://localhost:9300”能连接上。<br />
     * 2、当设置为'127.0.0.1'时，用如“wss://127.0.0.1:9300”、“wss://localhost:9300”能连接上。<br />
     * 3、当设置为'0.0.0.0'时，用如“wss://localhost:9300”、“wss://127.0.0.1:9300”、“wss://192.168.10.101:9300”能连接上。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“wss://localhost:9300”能连接上。<br />
     * 2、当设置为'127.0.0.1'时，用如“wss://127.0.0.1:9300”、“wss://localhost:9300”能连接上。<br />
     * 3、当设置为'0.0.0.0'时，用如“wss://localhost:9300”、“wss://127.0.0.1:9300”、“wss://192.168.10.101:9300”能连接上。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9000”）跟其中的websocket服务地址（如“wss://localhost:9200”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9200”。<br />
     * 3、然后才能让页面（如“https://localhost:9000”）成功访问其中的websocket服务地址（如“wss://localhost:9200”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：wss://0.0.0.0:9300。<br />
     */
    hostname: '0.0.0.0',
    // @ts-ignore
    key: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPS001/HTTPS001Key.pem` ) ),
    // @ts-ignore
    cert: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPS001/HTTPS001Server.crt` ) ),
    onListen: (
      {
        hostname,
        port,
      }: {
        hostname: string;
        port: number;
      }
    ): void => {
      console.log( `\nWebSocketS Server已启动：wss://${ hostname }:${ port }/。\n` );
    },
    onError: ( error: unknown ): TypeResponse001 => {
      console.error( `\nWebSocketS Server onError--->Start` );
      console.error( error );
      console.error( `WebSocketS Server onError--->End\n` );

      return InterceptorError.ResError( {
        title: `WebSocketS Server服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  }
);
