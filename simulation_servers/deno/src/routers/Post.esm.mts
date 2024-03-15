/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Post.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:15:54 星期二
 */

/**
 * 处理post请求。
 */

'use strict';

import {
  type T_Fun001,
  type T_Result001,
} from 'configures/GlobalParameters.esm.mts';

import {
  IterateToNestForPromise,
} from 'public/PublicTools.esm.mts';

import {
  methodByPostForRouteMapConfig,
  methodByPostForRouteHandle,

} from 'configures/route_map_config/RouteMapConfig.esm.mts';

import ResponseError from 'public/ResponseError.esm.mts';

/**
 * 处理post请求。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
 */
async function Post( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  let routeHandle: T_Result001;

  let result: Response;

  if( pathName in methodByPostForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( methodByPostForRouteMapConfig[ pathName ] as T_Fun001 )( request ) ) ) as Response;
  }
  else if( routeHandle = await methodByPostForRouteHandle( request ) ){
    result = ( await IterateToNestForPromise( ( routeHandle as T_Fun001 )( request ) ) ) as Response;
  }
  else{
    result = await new ResponseError( request ).resPage404();
  }

  return result;
}

export {
  Post,
};

export default Post;
