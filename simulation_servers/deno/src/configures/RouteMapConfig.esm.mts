/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/RouteMapConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:12:20 星期二
 */

'use strict';

import {
  servicesDir,
  // @ts-ignore
} from './GlobalParameters.esm.mts';

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
  /*
   URL {
   href: "file:///G:/WebStormWS/web-project-template/simulation_servers/deno/static/html/Index.html",
   origin: "null",
   protocol: "file:",
   username: "",
   password: "",
   host: "",
   hostname: "",
   port: "",
   pathname: "/G:/WebStormWS/web-project-template/simulation_servers/deno/static/html/Index.html",
   hash: "",
   search: ""
   }
   */
  const obj001: TypeObj001 = Object.fromEntries(
    Object.entries( routeMapConfig ).map(
      (
        [ key, value ]: [ string, TypeFilePath001 ],
      ): [ string, string ] => {
        if( Object.prototype.toString.call( value ) === '[object URL]' ){
          if( ( value as URL ).protocol === 'file:' ){
            return [
              key,
              ( value as URL ).href
            ];
          }
          else{
            throw new Error( 'import()只接受“string”类型的参数值，且表示文件地址。' );
          }
        }
        else{
          return [
            key,
            value as string
          ];
        }
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
  // @ts-ignore
  '/': new URL( import.meta.resolve( `${ servicesDir }/ResRoot.esm.mts` ) ),
  '/favicon.ico': `${ servicesDir }/ResRootFavicon.esm.mts`,
  '/simulation_servers_deno/GetJSON': `${ servicesDir }/GetJSON.esm.mts`,
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
