/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/configures/route_map_config/Handle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:08:50 星期三
 */

'use strict';

import {
  type TypeFun001,
  type TypeFilePath001,
  // @ts-ignore
} from '../GlobalParameters.esm.mts';

type TypeRouteMapConfig = {
  [ key: string ]: TypeFilePath001;
};

type TypeRouteHandleConfig = Array<[ string | URL, string | URL ]>;

type TypeRouteMapHandle = {
  [ key: string ]: TypeFun001;
};

type TypeRouteHandle = ( request: Request ) => boolean | TypeFun001;

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

// @ts-ignore
async function GeneratorRouteHandle( routeHandleConfig: TypeRouteHandleConfig ): Promise<TypeRouteHandle>{
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
}

export {
  GeneratorRouteMap,
  GeneratorRouteHandle,
};

export default {
  GeneratorRouteMap,
  GeneratorRouteHandle,
};
