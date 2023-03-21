/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Get.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:06 星期二
 */

/**
 * 处理get请求。
 */

'use strict';

import {
  type TypeFun001,
  type TypeResult001,
} from 'configures/GlobalParameters.esm.mts';

import {
  IterateToNestForPromise,
} from 'public/PublicTools.esm.mts';

import {
  methodByGetForRouteMapConfig,
  methodByGetForRouteHandle,
} from 'configures/route_map_config/RouteMapConfig.esm.mts';

import ResponseError from 'public/ResponseError.esm.mts';

/**
 * 处理get请求。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
 */
async function Get( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  let routeHandle: TypeResult001;

  let result: Response;

  if( pathName in methodByGetForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( methodByGetForRouteMapConfig[ pathName ] as TypeFun001 )( request ) ) ) as Response;
  }
  else if( routeHandle = await methodByGetForRouteHandle( request ) ){
    result = ( await IterateToNestForPromise( ( routeHandle as TypeFun001 )( request ) ) ) as Response;
  }
  else{
    result = await new ResponseError( request ).resPage404();
  }

  return result;
}

export {
  Get,
};

export default Get;
