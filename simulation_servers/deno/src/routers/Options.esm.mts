/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Options.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:01 星期二
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
  methodByOptionsForRouteMapConfig,
  methodByOptionsForRouteHandle,
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
async function Options( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  let routeHandle: TypeResult001;

  let result: Response;

  if( pathName in methodByOptionsForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( methodByOptionsForRouteMapConfig[ pathName ] as TypeFun001 )( request ) ) ) as Response;
  }
  else if( routeHandle = await methodByOptionsForRouteHandle( request ) ){
    result = ( await IterateToNestForPromise( ( routeHandle as TypeFun001 )( request ) ) ) as Response;
  }
  else{
    result = new Response( null, {
      status: 200,
      statusText: 'OK',
    } );
  }

  return result;
}

export {
  Options,
};

export default Options;
