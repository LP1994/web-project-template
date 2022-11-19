/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Put.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:15:45 星期二
 */

'use strict';

import {
  type TypeFun001,
  type TypeResult001,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  IterateToNestForPromise,
  // @ts-ignore
} from 'public/PublicTools.esm.mts';

import {
  methodByPutForRouteMapConfig,
  methodByPutForRouteHandle,
  // @ts-ignore
} from 'configures/route_map_config/RouteMapConfig.esm.mts';

// @ts-ignore
import InterceptorError from 'public/InterceptorError.esm.mts';

/**
 * 一定得保证该函数返回的值类型只能是：Promise<Response>。<br />
 *
 * @param {Request} request
 *
 * @returns {Promise<Response>}
 */
async function Put( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  let routeHandle: TypeResult001;

  let result: Response;

  if( pathName in methodByPutForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( methodByPutForRouteMapConfig[ pathName ] as TypeFun001 )( request ) ) ) as Response;
  }
  else if( routeHandle = await methodByPutForRouteHandle( request ) ){
    result = ( await IterateToNestForPromise( ( routeHandle as TypeFun001 )( request ) ) ) as Response;
  }
  else{
    result = await new InterceptorError( request ).res404();
  }

  return result;
}

export {
  Put,
};

export default Put;
