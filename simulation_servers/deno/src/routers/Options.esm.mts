/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Options.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:01 星期二
 */

/**
 * 处理options请求。
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
  methodByOptionsForRouteMapConfig,
  methodByOptionsForRouteHandle,
} from 'configures/route_map_config/RouteMapConfig.esm.mts';

// @ts-expect-error
import ResponseError from 'public/ResponseError.esm.mts';

/**
 * 处理options请求。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
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
  // 默认允许所有的options请求通过，因为目前没设置其他处理，后面可以根据需要编写对应响应不成功的逻辑。
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
