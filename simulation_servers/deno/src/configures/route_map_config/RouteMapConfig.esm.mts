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

  servicesDir,
  // @ts-ignore
} from '../GlobalParameters.esm.mts';

import {
  GeneratorRouteMap,
  GeneratorRouteHandle,
  // @ts-ignore
} from './Handle.esm.mts';

type TypeRouteMapHandle = {
  [ key: string ]: TypeFun001;
};

type TypeRouteHandle = ( request: Request ) => boolean | TypeFun001;

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
} );

const methodByOptionsForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

// RouteMapConfig End

// RouteHandle Start

const methodByPutForRouteHandle: TypeRouteHandle = await GeneratorRouteHandle( [] );

const methodByDeleteForRouteHandle: TypeRouteHandle = await GeneratorRouteHandle( [] );

const methodByPostForRouteHandle: TypeRouteHandle = await GeneratorRouteHandle( [] );

const methodByGetForRouteHandle: TypeRouteHandle = await GeneratorRouteHandle( [
  [
    `${ servicesDir }/static_resources_service/Condition.esm.mts`,
    `${ servicesDir }/static_resources_service/Response.esm.mts`,
  ],
  [
    // @ts-ignore
    new URL( import.meta.resolve( `${ servicesDir }/web_resources_service/Condition.esm.mts` ) ),
    // @ts-ignore
    new URL( import.meta.resolve( `${ servicesDir }/web_resources_service/Response.esm.mts` ) ),
  ],
] );

const methodByOptionsForRouteHandle: TypeRouteHandle = await GeneratorRouteHandle( [] );

// RouteHandle End

export {
  // RouteMapConfig Start
  methodByPutForRouteMapConfig,
  methodByDeleteForRouteMapConfig,
  methodByPostForRouteMapConfig,
  methodByGetForRouteMapConfig,
  methodByOptionsForRouteMapConfig,
  // RouteMapConfig End

  // RouteHandle Start
  methodByPutForRouteHandle,
  methodByDeleteForRouteHandle,
  methodByPostForRouteHandle,
  methodByGetForRouteHandle,
  methodByOptionsForRouteHandle,
  // RouteHandle End
};

export default {
  // RouteMapConfig Start
  methodByPutForRouteMapConfig,
  methodByDeleteForRouteMapConfig,
  methodByPostForRouteMapConfig,
  methodByGetForRouteMapConfig,
  methodByOptionsForRouteMapConfig,
  // RouteMapConfig End

  // RouteHandle Start
  methodByPutForRouteHandle,
  methodByDeleteForRouteHandle,
  methodByPostForRouteHandle,
  methodByGetForRouteHandle,
  methodByOptionsForRouteHandle,
  // RouteHandle End
};
