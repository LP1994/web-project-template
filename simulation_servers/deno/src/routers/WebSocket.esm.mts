/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/WebSocket.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:06 星期二
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
  websocketForRouteMapConfig,
  websocketForRouteHandle,
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
async function WebSocket( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname,
    upgrade: string = ( request.headers.get( 'upgrade' ) ?? '' ).toLowerCase(),
    // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
    connection: string = ( request.headers.get( 'connection' ) ?? '' ).toLowerCase();

  console.log( `\n\n请求头中的connection值为：${ connection }。
请求头中的upgrade值为：${ upgrade }。\n\n` );

  let routeHandle: TypeResult001;

  if( pathName in websocketForRouteMapConfig ){
    return ( await IterateToNestForPromise( ( websocketForRouteMapConfig[ pathName ] as TypeFun001 )( request ) ) ) as Response;
  }
  else if( routeHandle = await websocketForRouteHandle( request ) ){
    return ( await IterateToNestForPromise( ( routeHandle as TypeFun001 )( request ) ) ) as Response;
  }

  return await InterceptorError.ResError( {
    title: `404`,
    message: `本WebSocket服务未对“${ pathName }”提供服务。`,
  } );
}

export {
  WebSocket,
};

export default WebSocket;
