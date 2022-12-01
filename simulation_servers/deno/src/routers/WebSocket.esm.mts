/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/WebSocket.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:06 星期二
 */

/**
 * 处理WebSocket请求。
 */

'use strict';

import {
  type TypeFun001,
  type TypeResult001,

  httpHeaders,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  MyConsole,

  // @ts-ignore
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  IterateToNestForPromise,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

import {
  websocketForRouteMapConfig,
  websocketForRouteHandle,

  // @ts-ignore
} from 'configures/route_map_config/RouteMapConfig.esm.mts';

/**
 * 处理WebSocket请求。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
 */
async function WebSocket( request: Request ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname,
    upgrade: string = request.headers.get( 'upgrade' ) ?? '',
    // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
    connection: string = request.headers.get( 'connection' ) ?? '';

  let result: Response;

  MyConsole.Blue( `
请求头中的upgrade值为：${ upgrade }。
请求头中的connection值为：${ connection }。
` );

  let routeHandle: TypeResult001;

  if( pathName in websocketForRouteMapConfig ){
    result = ( await IterateToNestForPromise( ( websocketForRouteMapConfig[ pathName ] as TypeFun001 )( request ) ) ) as Response;
  }
  else if( routeHandle = await websocketForRouteHandle( request ) ){
    result = ( await IterateToNestForPromise( ( routeHandle as TypeFun001 )( request ) ) ) as Response;
  }
  else{
    result = new Response( null, {
      status: 404,
      statusText: 'Not Found',
      // @ts-ignore
      headers: {
        ...httpHeaders,
      },
    } );
  }

  return result;
}

export {
  WebSocket,
};

export default WebSocket;
