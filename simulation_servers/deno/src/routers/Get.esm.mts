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
  type TypeResponse001,
  type TypeFun001,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

import {
  methodByGetForRouteMapConfig,
  methodByGetForRouteHandle,
  // @ts-ignore
} from '../configures/route_map_config/RouteMapConfig.esm.mts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

function Get( request: Request ): TypeResponse001{
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

  let routeHandle: boolean | TypeFun001;

  if( pathName in methodByGetForRouteMapConfig ){
    return methodByGetForRouteMapConfig[ pathName ]( request );
  }
  else if( routeHandle = methodByGetForRouteHandle( request ) ){
    return ( routeHandle as TypeFun001 )( request );
  }

  return new InterceptorError( request ).res404();
}

export {
  Get,
};

export default Get;
