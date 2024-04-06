/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/route_map_config/RouteMapConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:12:20 星期二
 */

/**
 * 配置客户端发起的请求的“路由映射”处理。
 *
 * 配置有2种：RouteMapConfig、RouteHandle。
 * 1、RouteMapConfig：“一对一”的路由映射处理，如：{ '/simulation_servers_deno/GetJSON/': `${ servicesDir }/GetJSON.esm.mts` }，“key”表示要处理的客户端发起的请求URL（值类型为string）。
 * 注意，末尾带不带“/”，表示的是两个不一样的URL，因为“处理函数”内部是用严格的“===”匹配的。
 * 如：客户端发起“/simulation_servers_deno/GetJSON”和“/simulation_servers_deno/GetJSON/”，那么服务端是要分别配置对应的“处理函数”。
 * “value”表示针对“key”的处理的文件路径（值类型可以是string、URL），它里面会有一个“处理函数”，用于处理逻辑，且必需部署一个默认导出，默认导出的就是这个“处理函数”，该函数会返回Response，它被执行时会传入一个Request参数给它。
 *
 * 2、RouteHandle：有“条件”的路由映射处理，如：[ `${ servicesDir }/websocket_upload/Condition.esm.mts`, `${ servicesDir }/websocket_upload/ResponseHandle.esm.mts` ]，数组的第1个成员（值是一个表示处理的文件路径，值类型可以是string、URL）是一个“条件函数”，它返回一个boolean，当客户端发起的请求能满足这个“条件函数”时，会返回true，反之为false，它被执行时会传入一个Request参数给它。
 * 当“条件函数”返回true时，就会执行数组的第2个成员（值是一个表示处理的文件路径，值类型可以是string、URL），它是一个“处理函数”，会返回Response，它被执行时会传入一个Request参数给它。
 * 数组的第1个、第2个成员都是要有一个默认导出，且默认导出的就是上面提到的“条件函数”、“处理函数”。
 */

'use strict';

import {
  type T_Fun001,
  type T_Result001,

  servicesDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  GeneratorRouteMap,
  GeneratorRouteHandle,
} from './Handle.esm.mts';

type T_RouteMapHandle = {
  [ key: string ]: T_Fun001;
};

type T_RouteHandle = ( request: Request ) => Promise<T_Result001>;

// RouteMapConfig Start

/**
 * @type {T_RouteMapHandle} 配置“PUT”请求的“一对一”的处理。<br />
 * 1、“key”表示要处理的客户端发起的请求URL（值类型为string），注意，末尾带不带“/”，表示的是两个不一样的URL，因为“处理函数”内部是用严格的“===”匹配的。<br />
 * 如：客户端发起“/simulation_servers_deno/GetJSON”和“/simulation_servers_deno/GetJSON/”，那么服务端是要分别配置对应的“处理函数”。<br />
 * 2、“value”表示针对“key”的处理的文件路径（值类型可以是string、URL），它里面会有一个“处理函数”，用于处理逻辑，且必需部署一个默认导出，默认导出的就是这个“处理函数”，该函数会返回Response，它被执行时会传入一个Request参数给它。<br />
 */
const methodByPutForRouteMapConfig: T_RouteMapHandle = await GeneratorRouteMap( {} );

/**
 * @type {T_RouteMapHandle} 配置“DELETE”请求的“一对一”的处理。<br />
 * 1、“key”表示要处理的客户端发起的请求URL（值类型为string），注意，末尾带不带“/”，表示的是两个不一样的URL，因为“处理函数”内部是用严格的“===”匹配的。<br />
 * 如：客户端发起“/simulation_servers_deno/GetJSON”和“/simulation_servers_deno/GetJSON/”，那么服务端是要分别配置对应的“处理函数”。<br />
 * 2、“value”表示针对“key”的处理的文件路径（值类型可以是string、URL），它里面会有一个“处理函数”，用于处理逻辑，且必需部署一个默认导出，默认导出的就是这个“处理函数”，该函数会返回Response，它被执行时会传入一个Request参数给它。<br />
 */
const methodByDeleteForRouteMapConfig: T_RouteMapHandle = await GeneratorRouteMap( {} );

/**
 * @type {T_RouteMapHandle} 配置“POST”请求的“一对一”的处理。<br />
 * 1、“key”表示要处理的客户端发起的请求URL（值类型为string），注意，末尾带不带“/”，表示的是两个不一样的URL，因为“处理函数”内部是用严格的“===”匹配的。<br />
 * 如：客户端发起“/simulation_servers_deno/GetJSON”和“/simulation_servers_deno/GetJSON/”，那么服务端是要分别配置对应的“处理函数”。<br />
 * 2、“value”表示针对“key”的处理的文件路径（值类型可以是string、URL），它里面会有一个“处理函数”，用于处理逻辑，且必需部署一个默认导出，默认导出的就是这个“处理函数”，该函数会返回Response，它被执行时会传入一个Request参数给它。<br />
 */
const methodByPostForRouteMapConfig: T_RouteMapHandle = await GeneratorRouteMap( {} );

/**
 * @type {T_RouteMapHandle} 配置“GET”请求的“一对一”的处理。<br />
 * 1、“key”表示要处理的客户端发起的请求URL（值类型为string），注意，末尾带不带“/”，表示的是两个不一样的URL，因为“处理函数”内部是用严格的“===”匹配的。<br />
 * 如：客户端发起“/simulation_servers_deno/GetJSON”和“/simulation_servers_deno/GetJSON/”，那么服务端是要分别配置对应的“处理函数”。<br />
 * 2、“value”表示针对“key”的处理的文件路径（值类型可以是string、URL），它里面会有一个“处理函数”，用于处理逻辑，且必需部署一个默认导出，默认导出的就是这个“处理函数”，该函数会返回Response，它被执行时会传入一个Request参数给它。<br />
 */
const methodByGetForRouteMapConfig: T_RouteMapHandle = await GeneratorRouteMap( {
  '/': new URL( import.meta.resolve( `${ servicesDir }/ResRoot.esm.mts` ) ),

  '/favicon.ico': `${ servicesDir }/ResRootFavicon.esm.mts`,
  '/favicon.png': `${ servicesDir }/ResRootFavicon.esm.mts`,
  '/apple-touch-icon.png': `${ servicesDir }/ResRootFavicon.esm.mts`,
  '/apple-touch-icon-precomposed.png': `${ servicesDir }/ResRootFavicon.esm.mts`,
  '/apple-touch-icon-120x120.png': `${ servicesDir }/ResRootFavicon.esm.mts`,
  '/apple-touch-icon-120x120-precomposed.png': `${ servicesDir }/ResRootFavicon.esm.mts`,

  '/simulation_servers_deno/GetJSON': `${ servicesDir }/GetJSON.esm.mts`,
  '/simulation_servers_deno/GetJSON/': `${ servicesDir }/GetJSON.esm.mts`,
} );

/**
 * @type {T_RouteMapHandle} 配置“OPTIONS”请求的“一对一”的处理。<br />
 * 1、“key”表示要处理的客户端发起的请求URL（值类型为string），注意，末尾带不带“/”，表示的是两个不一样的URL，因为“处理函数”内部是用严格的“===”匹配的。<br />
 * 如：客户端发起“/simulation_servers_deno/GetJSON”和“/simulation_servers_deno/GetJSON/”，那么服务端是要分别配置对应的“处理函数”。<br />
 * 2、“value”表示针对“key”的处理的文件路径（值类型可以是string、URL），它里面会有一个“处理函数”，用于处理逻辑，且必需部署一个默认导出，默认导出的就是这个“处理函数”，该函数会返回Response，它被执行时会传入一个Request参数给它。<br />
 */
const methodByOptionsForRouteMapConfig: T_RouteMapHandle = await GeneratorRouteMap( {} );

/**
 * @type {T_RouteMapHandle} 配置“websocket”请求的“一对一”的处理。<br />
 * 1、“key”表示要处理的客户端发起的请求URL（值类型为string），注意，末尾带不带“/”，表示的是两个不一样的URL，因为“处理函数”内部是用严格的“===”匹配的。<br />
 * 如：客户端发起“/simulation_servers_deno/GetJSON”和“/simulation_servers_deno/GetJSON/”，那么服务端是要分别配置对应的“处理函数”。<br />
 * 2、“value”表示针对“key”的处理的文件路径（值类型可以是string、URL），它里面会有一个“处理函数”，用于处理逻辑，且必需部署一个默认导出，默认导出的就是这个“处理函数”，该函数会返回Response，它被执行时会传入一个Request参数给它。<br />
 */
const websocketForRouteMapConfig: T_RouteMapHandle = await GeneratorRouteMap( {
  '/': `${ servicesDir }/WebSocketResRoot.esm.mts`,
  '/subscriptions': `${ servicesDir }/WebSocketResRoot.esm.mts`,
  '/subscriptions/': `${ servicesDir }/WebSocketResRoot.esm.mts`,
  '/simulation_servers_deno': `${ servicesDir }/WebSocketResRoot.esm.mts`,
  '/simulation_servers_deno/': `${ servicesDir }/WebSocketResRoot.esm.mts`,
  '/simulation_servers_deno/subscriptions': `${ servicesDir }/WebSocketResRoot.esm.mts`,
  '/simulation_servers_deno/subscriptions/': `${ servicesDir }/WebSocketResRoot.esm.mts`,
} );

// RouteMapConfig End

// RouteHandle Start

/**
 * @type {T_RouteHandle} 配置“PUT”请求的有“条件”的路由映射处理。<br />
 * 1、数组的第1个成员（值是一个表示处理的文件路径，值类型可以是string、URL）是一个“条件函数”，它返回一个boolean，当客户端发起的请求能满足这个“条件函数”时，会返回true，反之为false，它被执行时会传入一个Request参数给它。<br />
 * 2、当“条件函数”返回true时，就会执行数组的第2个成员（值是一个表示处理的文件路径，值类型可以是string、URL），它是一个“处理函数”，会返回Response，它被执行时会传入一个Request参数给它。<br />
 * 数组的第1个、第2个成员都是要有一个默认导出，且默认导出的就是上面提到的“条件函数”、“处理函数”。<br />
 */
const methodByPutForRouteHandle: T_RouteHandle = GeneratorRouteHandle( [
  /*
   [
   `${ servicesDir }/upload_resources_service/Condition.esm.mts`,
   `${ servicesDir }/upload_resources_service/ResponseHandle.esm.mts`,
   ],
   */

  [
    `${ servicesDir }/graphql_service/Condition.esm.mts`,
    `${ servicesDir }/graphql_service/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/cookie/Condition.esm.mts`,
    `${ servicesDir }/cookie/ResponseHandle.esm.mts`,
  ],
] );

/**
 * @type {T_RouteHandle} 配置“DELETE”请求的有“条件”的路由映射处理。<br />
 * 1、数组的第1个成员（值是一个表示处理的文件路径，值类型可以是string、URL）是一个“条件函数”，它返回一个boolean，当客户端发起的请求能满足这个“条件函数”时，会返回true，反之为false，它被执行时会传入一个Request参数给它。<br />
 * 2、当“条件函数”返回true时，就会执行数组的第2个成员（值是一个表示处理的文件路径，值类型可以是string、URL），它是一个“处理函数”，会返回Response，它被执行时会传入一个Request参数给它。<br />
 * 数组的第1个、第2个成员都是要有一个默认导出，且默认导出的就是上面提到的“条件函数”、“处理函数”。<br />
 */
const methodByDeleteForRouteHandle: T_RouteHandle = GeneratorRouteHandle( [
  [
    `${ servicesDir }/graphql_service/Condition.esm.mts`,
    `${ servicesDir }/graphql_service/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/cookie/Condition.esm.mts`,
    `${ servicesDir }/cookie/ResponseHandle.esm.mts`,
  ],
] );

/**
 * @type {T_RouteHandle} 配置“POST”请求的有“条件”的路由映射处理。<br />
 * 1、数组的第1个成员（值是一个表示处理的文件路径，值类型可以是string、URL）是一个“条件函数”，它返回一个boolean，当客户端发起的请求能满足这个“条件函数”时，会返回true，反之为false，它被执行时会传入一个Request参数给它。<br />
 * 2、当“条件函数”返回true时，就会执行数组的第2个成员（值是一个表示处理的文件路径，值类型可以是string、URL），它是一个“处理函数”，会返回Response，它被执行时会传入一个Request参数给它。<br />
 * 数组的第1个、第2个成员都是要有一个默认导出，且默认导出的就是上面提到的“条件函数”、“处理函数”。<br />
 */
const methodByPostForRouteHandle: T_RouteHandle = GeneratorRouteHandle( [
  /*
   [
   `${ servicesDir }/upload_resources_service/Condition.esm.mts`,
   `${ servicesDir }/upload_resources_service/ResponseHandle.esm.mts`,
   ],
   */

  [
    `${ servicesDir }/graphql_service/Condition.esm.mts`,
    `${ servicesDir }/graphql_service/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/cookie/Condition.esm.mts`,
    `${ servicesDir }/cookie/ResponseHandle.esm.mts`,
  ],
] );

/**
 * @type {T_RouteHandle} 配置“GET”请求的有“条件”的路由映射处理。<br />
 * 1、数组的第1个成员（值是一个表示处理的文件路径，值类型可以是string、URL）是一个“条件函数”，它返回一个boolean，当客户端发起的请求能满足这个“条件函数”时，会返回true，反之为false，它被执行时会传入一个Request参数给它。<br />
 * 2、当“条件函数”返回true时，就会执行数组的第2个成员（值是一个表示处理的文件路径，值类型可以是string、URL），它是一个“处理函数”，会返回Response，它被执行时会传入一个Request参数给它。<br />
 * 数组的第1个、第2个成员都是要有一个默认导出，且默认导出的就是上面提到的“条件函数”、“处理函数”。<br />
 */
const methodByGetForRouteHandle: T_RouteHandle = GeneratorRouteHandle( [
  [
    `${ servicesDir }/get_upload_file_service/Condition.esm.mts`,
    `${ servicesDir }/get_upload_file_service/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/static_resources_service/Condition.esm.mts`,
    `${ servicesDir }/static_resources_service/ResponseHandle.esm.mts`,
  ],
  [
    new URL( import.meta.resolve( `${ servicesDir }/web_resources_service/Condition.esm.mts` ) ),
    new URL( import.meta.resolve( `${ servicesDir }/web_resources_service/ResponseHandle.esm.mts` ) ),
  ],
  [
    `${ servicesDir }/jsonp_service/Condition.esm.mts`,
    `${ servicesDir }/jsonp_service/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/graphql_service/Condition.esm.mts`,
    `${ servicesDir }/graphql_service/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/cookie/Condition.esm.mts`,
    `${ servicesDir }/cookie/ResponseHandle.esm.mts`,
  ],
] );

/**
 * @type {T_RouteHandle} 配置“OPTIONS”请求的有“条件”的路由映射处理。<br />
 * 1、数组的第1个成员（值是一个表示处理的文件路径，值类型可以是string、URL）是一个“条件函数”，它返回一个boolean，当客户端发起的请求能满足这个“条件函数”时，会返回true，反之为false，它被执行时会传入一个Request参数给它。<br />
 * 2、当“条件函数”返回true时，就会执行数组的第2个成员（值是一个表示处理的文件路径，值类型可以是string、URL），它是一个“处理函数”，会返回Response，它被执行时会传入一个Request参数给它。<br />
 * 数组的第1个、第2个成员都是要有一个默认导出，且默认导出的就是上面提到的“条件函数”、“处理函数”。<br />
 */
const methodByOptionsForRouteHandle: T_RouteHandle = GeneratorRouteHandle( [] );

/**
 * @type {T_RouteHandle} 配置“websocket”请求的有“条件”的路由映射处理。<br />
 * 1、数组的第1个成员（值是一个表示处理的文件路径，值类型可以是string、URL）是一个“条件函数”，它返回一个boolean，当客户端发起的请求能满足这个“条件函数”时，会返回true，反之为false，它被执行时会传入一个Request参数给它。<br />
 * 2、当“条件函数”返回true时，就会执行数组的第2个成员（值是一个表示处理的文件路径，值类型可以是string、URL），它是一个“处理函数”，会返回Response，它被执行时会传入一个Request参数给它。<br />
 * 数组的第1个、第2个成员都是要有一个默认导出，且默认导出的就是上面提到的“条件函数”、“处理函数”。<br />
 */
const websocketForRouteHandle: T_RouteHandle = GeneratorRouteHandle( [
  [
    `${ servicesDir }/websocket_upload/Condition.esm.mts`,
    `${ servicesDir }/websocket_upload/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/graphql_service/Condition.esm.mts`,
    `${ servicesDir }/graphql_service/ResponseHandle.esm.mts`,
  ],
] );

// RouteHandle End

export {
  // RouteMapConfig Start
  methodByPutForRouteMapConfig,
  methodByDeleteForRouteMapConfig,
  methodByPostForRouteMapConfig,
  methodByGetForRouteMapConfig,
  methodByOptionsForRouteMapConfig,

  websocketForRouteMapConfig,
  // RouteMapConfig End

  // RouteHandle Start
  methodByPutForRouteHandle,
  methodByDeleteForRouteHandle,
  methodByPostForRouteHandle,
  methodByGetForRouteHandle,
  methodByOptionsForRouteHandle,

  websocketForRouteHandle,
  // RouteHandle End
};

export default {
  // RouteMapConfig Start
  methodByPutForRouteMapConfig,
  methodByDeleteForRouteMapConfig,
  methodByPostForRouteMapConfig,
  methodByGetForRouteMapConfig,
  methodByOptionsForRouteMapConfig,

  websocketForRouteMapConfig,
  // RouteMapConfig End

  // RouteHandle Start
  methodByPutForRouteHandle,
  methodByDeleteForRouteHandle,
  methodByPostForRouteHandle,
  methodByGetForRouteHandle,
  methodByOptionsForRouteHandle,

  websocketForRouteHandle,
  // RouteHandle End
};
