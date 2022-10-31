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
  let url: URL = new URL( request.url );

  if( url.pathname === '/' ){
    return new Response( `Deno（读音：/ˈdiːnoʊ/）将是Node的终结者。` );
  }
  else if( url.pathname === '/SimServer/GET' ){
    return new Response( JSON.stringify( {
      'type': 'json',
      'info': '帝子降兮北渚，目渺渺兮愁予。'
    } ), {
      status: 200,
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
