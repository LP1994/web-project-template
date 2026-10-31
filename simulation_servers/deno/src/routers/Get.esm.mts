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
  type T_Awaitable,
  type T_FunRequest,
  type T_Result001,

  route_map_configDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  methodByGetForRouteHandle,
  methodByGetForRouteMapConfig,
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
 * 处理get请求。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
 */
async function Get( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  const routeHandle: T_Result001 = await methodByGetForRouteHandle( request );

  if( ( pathName in methodByGetForRouteMapConfig ) && routeHandle ){
    MyConsole.Red( `
Get请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Get请求“${ pathName }”配置了多个“路由逻辑”！！！
` );

    errorWriteStream.write( `
Get请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Get请求“${ pathName }”配置了多个“路由逻辑”！！！
` );

    throw new Error( `
Get请求“${ pathName }”被多个“路由逻辑”命中了！！！
请前往“${ route_map_configDir }/RouteMapConfig.esm.mts”，检查是否对Get请求“${ pathName }”配置了多个“路由逻辑”！！！
` );
  }

  let result: Response;

  if( pathName in methodByGetForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( methodByGetForRouteMapConfig[ pathName ] as T_FunRequest<T_Awaitable<Response>> )( request ) ) ) as Response;
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
  Get,
};

export default Get;
