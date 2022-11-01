/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Get.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:06 星期二
 */

'use strict';

import {
  mimetypes,
  // @ts-ignore
} from '../public/ThirdPartyTools.esm.mts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

type ResponseType001 = Response | Promise<Response>;

const {
  mime,
}: any = mimetypes;

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

  let filePath: URL;

  if( pathName === '/' ){
    // @ts-ignore
    filePath = new URL( import.meta.resolve( '../../static/html/Index.html' ) );

    // @ts-ignore
    return new Response( Deno.readTextFileSync( filePath ), {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': `${ mime.getType( filePath.href ) }; charset=utf-8`,
      },
    } );
  }
  else if( pathName === '/favicon.ico' ){
    // @ts-ignore
    filePath = new URL( import.meta.resolve( '../../static/ico/favicon.ico' ) );

    // @ts-ignore
    return new Response( Deno.readFileSync( filePath ), {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': mime.getType( filePath.href ),
      },
    } );
  }
  else if( pathName === '/SimServer/GETJSON' ){
    // @ts-ignore
    filePath = new URL( import.meta.resolve( '../../static/json/JSON001.json' ) );

    // @ts-ignore
    return new Response( Deno.readTextFileSync( filePath ), {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': `${ mime.getType( filePath.href ) }; charset=utf-8`,
      },
    } );
  }

  return new InterceptorError( request ).res404();
}

export {
  Get,
};

export default Get;
