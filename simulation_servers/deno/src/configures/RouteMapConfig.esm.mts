/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/RouteMapConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:12:20 星期二
 */

'use strict';

type Fun001 = ( request: Request ) => Response | Promise<Response>;

type RouteMapConfig = {
  [ key: string ]: string;
};

type RouteMapHandle = {
  [ key: string ]: Fun001;
};

async function GeneratorRouteMap( routeMapConfig: RouteMapConfig ): Promise<RouteMapHandle>{
  const arr001: Array<Promise<[ string, Fun001 ]>> = Object.entries( routeMapConfig ).map(
      async (
        [ key, value ]: [ string, string ],
      ): Promise<[ string, Fun001, ]> => {
        return [
          key,
          ( await import( value ) ).default
        ];
      }
    ),
    arr002: Array<[ string, Fun001 ]> = [];

  for await ( const item of
    arr001 ){
    arr002.push( item );
  }

  return Object.fromEntries( arr002 );
}

const methodByPutForRouteMapConfig: RouteMapHandle = await GeneratorRouteMap( {} );

const methodByDeleteForRouteMapConfig: RouteMapHandle = await GeneratorRouteMap( {} );

const methodByPostForRouteMapConfig: RouteMapHandle = await GeneratorRouteMap( {} );

const methodByGetForRouteMapConfig: RouteMapHandle = await GeneratorRouteMap( {
  '/': '../services/ResRoot.esm.mts',
  '/favicon.ico': '../services/ResRootFavicon.esm.mts',
  '/simulation_servers_deno/GetJSON': '../services/GetJSON.esm.mts',
} );

const methodByOptionsForRouteMapConfig: RouteMapHandle = await GeneratorRouteMap( {} );

export {
  methodByPutForRouteMapConfig,
  methodByDeleteForRouteMapConfig,
  methodByPostForRouteMapConfig,
  methodByGetForRouteMapConfig,
  methodByOptionsForRouteMapConfig,
};

export default {
  methodByPutForRouteMapConfig,
  methodByDeleteForRouteMapConfig,
  methodByPostForRouteMapConfig,
  methodByGetForRouteMapConfig,
  methodByOptionsForRouteMapConfig,
};
