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
  type T_Fun001,
  type T_Result001,

  HttpResponseHeadersFun,
  HTTPStatus,
  route_map_configDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  methodByOptionsForRouteHandle,
  methodByOptionsForRouteMapConfig,
} from 'configures/route_map_config/RouteMapConfig.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
  IterateToNestForPromise,
} from 'public/PublicTools.esm.mts';

import {
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

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

  const routeHandle: T_Result001 = await methodByOptionsForRouteHandle( request );

  if( ( pathName in methodByOptionsForRouteMapConfig ) && routeHandle ){
    MyConsole.Red( `
Options请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Options请求“${ pathName }”配置了多个“路由逻辑”！！！
` );

    errorWriteStream.write( `
Options请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Options请求“${ pathName }”配置了多个“路由逻辑”！！！
` );

    throw new Error( `
Options请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Options请求“${ pathName }”配置了多个“路由逻辑”！！！
` );
  }

  let result: Response;

  if( pathName in methodByOptionsForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( methodByOptionsForRouteMapConfig[ pathName ] as T_Fun001 )( request ) ) ) as Response;
  }
  else if( routeHandle ){
    result = ( await IterateToNestForPromise( ( routeHandle as T_Fun001 )( request ) ) ) as Response;
  }
  // 默认允许所有的options请求通过，因为目前没设置其他处理，后面可以根据需要编写对应响应不成功的逻辑。
  else{
    result = new Response( null, {
      status: HTTPStatus[ 200 ].status,
      statusText: HTTPStatus[ 200 ].statusText,
      headers: HttpResponseHeadersFun( request ),
    } );
  }

  return result;
}

export {
  Options,
};

export default Options;
