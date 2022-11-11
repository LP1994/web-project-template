/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/route_map_config/RouteMapConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:12:20 星期二
 */

'use strict';

import {
  type TypeFun001,
  type TypeResult001,

  servicesDir,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  GeneratorRouteMap,
  GeneratorRouteHandle,
  // @ts-ignore
} from './Handle.esm.mts';

type TypeRouteMapHandle = {
  [ key: string ]: TypeFun001;
};

type TypeRouteHandle = ( request: Request ) => Promise<TypeResult001>;

// RouteMapConfig Start

const methodByPutForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

const methodByDeleteForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

const methodByPostForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

const methodByGetForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {
  // @ts-ignore
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

const methodByOptionsForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

const websocketForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {
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

const methodByPutForRouteHandle: TypeRouteHandle = GeneratorRouteHandle( [
  [
    `${ servicesDir }/upload_resources_service/Condition.esm.mts`,
    `${ servicesDir }/upload_resources_service/ResponseHandle.esm.mts`,
  ],
] );

const methodByDeleteForRouteHandle: TypeRouteHandle = GeneratorRouteHandle( [] );

const methodByPostForRouteHandle: TypeRouteHandle = GeneratorRouteHandle( [
  [
    `${ servicesDir }/upload_resources_service/Condition.esm.mts`,
    `${ servicesDir }/upload_resources_service/ResponseHandle.esm.mts`,
  ],
] );

const methodByGetForRouteHandle: TypeRouteHandle = GeneratorRouteHandle( [
  [
    `${ servicesDir }/get_upload_file_service/Condition.esm.mts`,
    `${ servicesDir }/get_upload_file_service/ResponseHandle.esm.mts`,
  ],
  [
    `${ servicesDir }/static_resources_service/Condition.esm.mts`,
    `${ servicesDir }/static_resources_service/ResponseHandle.esm.mts`,
  ],
  [
    // @ts-ignore
    new URL( import.meta.resolve( `${ servicesDir }/web_resources_service/Condition.esm.mts` ) ),
    // @ts-ignore
    new URL( import.meta.resolve( `${ servicesDir }/web_resources_service/ResponseHandle.esm.mts` ) ),
  ],
] );

const methodByOptionsForRouteHandle: TypeRouteHandle = GeneratorRouteHandle( [] );

const websocketForRouteHandle: TypeRouteHandle = GeneratorRouteHandle( [
  [
    `${ servicesDir }/websocket_upload/Condition.esm.mts`,
    `${ servicesDir }/websocket_upload/ResponseHandle.esm.mts`,
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
