/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/ResRoot.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:27:36 星期二
 */

/**
 * 用于响应HTTP服务的根GET请求，如：“https://127.0.0.1:9200/”。
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteMapConfig”中的配置。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  type TypeResponse001,

  staticDir,

  httpHeaders,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  mime,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

/**
 * 响应请求的处理函数。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {TypeResponse001} 返回值类型为Response、Promise<Response>。
 */
function Handle(
  // @ts-ignore
  request: Request
): TypeResponse001{
  // @ts-ignore
  let filePath: URL = new URL( import.meta.resolve( `${ staticDir }/html/Index.html` ) );

  // @ts-ignore
  return new Response( Deno.readTextFileSync( filePath ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': `${ mime.getType( filePath.href ) }; charset=utf-8`,
    },
  } );
}

// 必须部署这个默认的导出值。
export default Handle;
