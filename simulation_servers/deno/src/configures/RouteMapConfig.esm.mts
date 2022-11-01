/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/RouteMapConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:12:20 星期二
 */

'use strict';

type TypeFun001 = ( request: Request ) => Response | Promise<Response>;

type TypeFilePath001 = string | URL;

type TypeRouteMapConfig = {
  [ key: string ]: TypeFilePath001;
};

type TypeRouteMapHandle = {
  [ key: string ]: TypeFun001;
};

type TypeObj001 = {
  [ key: string ]: string;
};

async function GeneratorRouteMap( routeMapConfig: TypeRouteMapConfig ): Promise<TypeRouteMapHandle>{
  const obj001: TypeObj001 = Object.fromEntries(
    Object.entries( routeMapConfig ).map(
      (
        [ key, value ]: [ string, TypeFilePath001 ],
      ): [ string, string ] => {
        return [
          key,
          Object.prototype.toString.call( value ) === '[object URL]'
            // @ts-ignore
          ? value.href
          : value
        ];
      }
    )
  );

  const arr001: Array<Promise<[ string, TypeFun001 ]>> = Object.entries( obj001 ).map(
      async (
        [ key, value ]: [ string, string ],
      ): Promise<[ string, TypeFun001, ]> => {
        return [
          key,
          ( await import( value ) ).default
        ];
      }
    ),
    arr002: Array<[ string, TypeFun001 ]> = [];

  for await ( const item of
    arr001 ){
    arr002.push( item );
  }

  return Object.fromEntries( arr002 );
}

const methodByPutForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

const methodByDeleteForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

const methodByPostForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

const methodByGetForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {
  '/': '../services/ResRoot.esm.mts',
  '/favicon.ico': '../services/ResRootFavicon.esm.mts',
  '/simulation_servers_deno/GetJSON': '../services/GetJSON.esm.mts',
} );

const methodByOptionsForRouteMapConfig: TypeRouteMapHandle = await GeneratorRouteMap( {} );

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
