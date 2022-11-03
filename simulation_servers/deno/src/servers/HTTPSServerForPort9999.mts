/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPSServerForPort9999.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
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
    console.log( `\nHTTPS Server request--->Start` );
    /*
     {
     bodyUsed: false,
     headers: Headers {
     accept: "image/avif,image/webp,image/apng,image/svg+xml,image/!*,*!/!*;q=0.8",
     "accept-encoding": "gzip, deflate, br",
     "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
     connection: "keep-alive",
     dnt: "1",
     host: "127.0.0.1:9999",
     referer: "http://127.0.0.1:9999/",
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
     url: "http://127.0.0.1:9999/favicon.ico"
     }
     */
    console.dir( request );
    console.log( `HTTPS Server request--->End\n` );

    console.log( `\nHTTPS Server connInfo--->Start` );
    /*
     {
     localAddr: { hostname: "127.0.0.1", port: 9999, transport: "tcp" },
     remoteAddr: { hostname: "127.0.0.1", port: 64071, transport: "tcp" }
     }
     */
    console.dir( connInfo );
    console.log( `HTTPS Server connInfo--->End\n` );

    return Routers( request );
  },
  {
    port: 9999,
    /**
     * 1、当设置为'localhost'时，用postman测试时，只能用“https://localhost:9999”才能连接上。<br />
     * 2、当设置为'127.0.0.1'时，用postman测试时，只能用“https://127.0.0.1:9999”、“https://localhost:9999”才能连接上。<br />
     * 3、当设置为'0.0.0.0'时，用postman测试时，只能用“https://localhost:9900”、“https://127.0.0.1:9900”、“https://192.168.10.101:9900”才能连接上。<br />
     */
    hostname: '0.0.0.0',
    // @ts-ignore
    cert: Deno.readTextFileSync( new URL( `${ opensslDir }/2022002/server2022002cert.pem` ) ),
    // @ts-ignore
    key: Deno.readTextFileSync( new URL( `${ opensslDir }/2022002/server2022002key.pem` ) ),
    onListen: (
      {
        hostname,
        port,
      }: {
        hostname: string;
        port: number;
      }
    ): void => {
      console.log( `\nHTTPS Server已启动：https://${ hostname }:${ port }/\n` );
    },
    onError: ( error: unknown ): TypeResponse001 => {
      console.error( `\nHTTPS Server onError--->Start` );
      console.error( error );
      console.error( `HTTPS Server onError--->End\n` );

      return InterceptorError.ResError( {
        title: `HTTPS Server服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  }
);
