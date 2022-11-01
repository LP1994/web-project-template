/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Get.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:06 星期二
 */

'use strict';

type ResponseType001 = Response | Promise<Response>;

function Get( request: Request ): ResponseType001{
  /*
   {
   href: "http://127.0.0.1:9999/",
   origin: "http://127.0.0.1:9999",
   protocol: "http:",
   username: "",
   password: "",
   host: "127.0.0.1:9999",
   hostname: "127.0.0.1",
   port: "9999",
   pathname: "/",
   hash: "",
   search: ""
   }
   */
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  if( pathName === '/' ){
    // @ts-ignore
    return new Response( Deno.readTextFileSync( new URL( import.meta.resolve( '../../static/html/Index.html' ) ) ), {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    } );
  }
  else if( pathName === '/favicon.ico' ){
    // @ts-ignore
    return new Response( Deno.readFileSync( new URL( import.meta.resolve( '../../static/ico/favicon.ico' ) ) ), {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'image/x-icon',
      },
    } );
  }
  else if( pathName === '/SimServer/GET' ){
    return new Response( JSON.stringify( {
      'type': 'json',
      'info': '帝子降兮北渚，目渺渺兮愁予。'
    } ), {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    } );
  }

  return new Response( `未找到“${ request.method.toLowerCase() }”请求方法的“${ url.pathname }”资源。` );
}

export {
  Get,
};

export default Get;
