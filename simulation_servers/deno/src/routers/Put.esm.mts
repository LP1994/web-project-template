/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Put.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:15:45 星期二
 */

/**
 * 处理put请求。
 */

'use strict';

import {
  type T_Awaitable,
  type T_FunRequest,
  type T_BooleanAndFunRequest,

  route_map_configDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  methodByPutForRouteHandle,
  methodByPutForRouteMapConfig,
} from 'configures/route_map_config/RouteMapConfig.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
  IterateToNestForPromise,
} from 'public/PublicTools.esm.mts';

import ResponseError from 'public/ResponseError.esm.mts';

import {
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 * 处理put请求。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
 */
async function Put( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  const routeHandle: T_BooleanAndFunRequest = await methodByPutForRouteHandle( request );

  if( ( pathName in methodByPutForRouteMapConfig ) && routeHandle ){
    MyConsole.Red( `
Put请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Put请求“${ pathName }”配置了多个“路由逻辑”！！！
` );

    errorWriteStream.write( `
Put请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Put请求“${ pathName }”配置了多个“路由逻辑”！！！
` );

    throw new Error( `
Put请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Put请求“${ pathName }”配置了多个“路由逻辑”！！！
` );
  }

  let result: Response;

  if( pathName in methodByPutForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( methodByPutForRouteMapConfig[ pathName ] as T_FunRequest<T_Awaitable<Response>> )( request ) ) ) as Response;
  }
  else if( routeHandle ){
    result = ( await IterateToNestForPromise( ( routeHandle as T_FunRequest<T_Awaitable<Response>> )( request ) ) ) as Response;
  }
  else{
    result = await new ResponseError( request ).resPage404();
  }

  return result;
}

export {
  Put,
};

export default Put;
