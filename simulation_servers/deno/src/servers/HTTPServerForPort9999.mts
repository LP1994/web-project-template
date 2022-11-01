/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPServerForPort9999.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

'use strict';

import {
  type ConnInfo,

  serve,
  // @ts-ignore
} from 'https://deno.land/std/http/server.ts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

import {
  Routers,
  // @ts-ignore
} from '../routers/Routers.esm.mts';

type ResponseType001 = Response | Promise<Response>;

serve(
  (
    request: Request,
    connInfo: ConnInfo,
  ): ResponseType001 => {
    console.log( `\nrequest--->Start` );
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
    console.log( `request--->End\n` );

    console.log( `\nconnInfo--->Start` );
    /*
     {
     localAddr: { hostname: "127.0.0.1", port: 9999, transport: "tcp" },
     remoteAddr: { hostname: "127.0.0.1", port: 64071, transport: "tcp" }
     }
     */
    console.dir( connInfo );
    console.log( `connInfo--->End\n` );

    return Routers( request );
  },
  {
    port: 9999,
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
      // 服务已启动：http://0.0.0.0:9999/
      console.log( `\n服务已启动：http://${ hostname }:${ port }/\n` );
    },
    onError: ( error: unknown ): ResponseType001 => {
      console.error( `\nonError--->Start` );
      console.error( error );
      console.error( `onError--->End\n` );

      return InterceptorError.ResError( {
        title: `服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  }
);
