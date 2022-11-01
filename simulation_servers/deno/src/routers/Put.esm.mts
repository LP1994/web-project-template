/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Put.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:15:45 星期二
 */

'use strict';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

type ResponseType001 = Response | Promise<Response>;

function Put( request: Request ): ResponseType001{
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

  return new InterceptorError( request ).res404();
}

export {
  Put,
};

export default Put;
