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
  type T_FilePath001,
  type T_Fun001,
  type T_Result001,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
  IterateToNestForPromise,
} from 'public/PublicTools.esm.mts';

import AllServicesForFileURL from 'services/AllServices.esm.mts';

import {
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

type T_Fun002 = ( request: Request ) => boolean | Promise<boolean>;

type T_Map001 = Map<T_Fun002, T_Fun001>;

type T_Obj001 = {
  [ key: string ]: string;
};

type T_RouteHandle = ( request: Request ) => Promise<T_Result001>;

type T_RouteHandleConfig = Array<[ string | URL, string | URL ]>;

type T_RouteMapConfig = {
  [ key: string ]: T_FilePath001;
};

type T_RouteMapHandle = {
  [ key: string ]: T_Fun001;
};

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 * 根据传入的“文件地址”值返回其对应的文件地址的字符串形式的值，给import()使用的。
 *
 * @param {T_FilePath001} filePath 文件地址，必需。
 *
 * @returns {string} 文件地址的字符串形式的值，给import()使用的。
 */
function Handle001( filePath: T_FilePath001 ): string{
  if( Object.prototype.toString.call( filePath ) === '[object URL]' ){
    if( ( filePath as URL ).protocol === 'file:' ){
      return ( filePath as URL ).href;
    }
    else{
      throw new Error( 'import()只接受“string”类型的参数值，且表示文件地址。' );
    }
  }
  else{
    return filePath as string;
  }
}

/**
 * 有“条件”的路由映射配置，根据“文件地址”读取其对应的函数，并重新生成配置。
 *
 * @param {T_RouteHandleConfig} routeHandleConfig 有“条件”的路由映射配置，必需。
 *
 * @returns {T_RouteHandle} 有“条件”的路由映射配置，根据“文件地址”读取其对应的函数，并重新生成配置。
 */
function GeneratorRouteHandle( routeHandleConfig: T_RouteHandleConfig ): T_RouteHandle{
  return async ( request: Request ): Promise<T_Result001> => {
    let myRouteHandleConfig: T_RouteHandleConfig = routeHandleConfig.concat( AllServicesForFileURL );

    const arr001: Array<Promise<[ T_Fun002, T_Fun001 ]>> = myRouteHandleConfig.map(
        async (
          [ key, name ]: [ string | URL, string | URL ],
        ): Promise<[ T_Fun002, T_Fun001 ]> => {
          return [
            ( await import( Handle001( key ) ) ).default,
            ( await import( Handle001( name ) ) ).default
          ];
        }
      ),
      arr002: Array<[ T_Fun002, T_Fun001 ]> = await Array.fromAsync( arr001 );

    const myMap: T_Map001 = new Map( arr002 ),
      fun001: Record<number, T_Fun002> = {};

    let index: number = 0;

    for( const key of
      myMap.keys() ){
      if( ( await IterateToNestForPromise( key( request ) ) ) as boolean ){
        fun001[ index ] = key;
      }

      ++index;
    }

    const funByKey001 = Object.keys( fun001 ),
      funByValue001 = Object.values( fun001 );

    if( funByKey001.length > 1 ){
      const url: URL = new URL( request.url ),
        pathName: string = url.pathname,
        method: string = request.method.toLowerCase().trim();

      let path001: string = '';

      for( const key of
        funByKey001 ){
        path001 += `${ ( ( myRouteHandleConfig[ Number( key ) ] as [ string | URL, string | URL ] )[ 0 ] ).toString() }\n`;
      }

      MyConsole.Red( `
${ method }请求“${ pathName }”被多个“路由逻辑”命中了！！！分别被如下文件命中，请前往它们进行检查：
${ path001 }
` );

      errorWriteStream.write( `
${ method }请求“${ pathName }”被多个“路由逻辑”命中了！！！分别被如下文件命中，请前往它们进行检查：
${ path001 }
` );

      throw new Error( `
${ method }请求“${ pathName }”被多个“路由逻辑”命中了！！！分别被如下文件命中，请前往它们进行检查：
${ path001 }
` );
    }
    else if( funByKey001.length === 1 ){
      return ( myMap.get( ( funByValue001[ 0 ] ) as T_Fun002 ) ) as T_Fun001;
    }
    else{
      return false;
    }
  };
}

/**
 * “一对一”的路由映射配置，根据“文件地址”读取其对应的函数，并重新生成配置。
 *
 * @param {T_RouteMapConfig} routeMapConfig “一对一”的路由映射配置，必需。
 *
 * @returns {Promise<T_RouteMapHandle>} “一对一”的路由映射配置，根据“文件地址”读取其对应的函数，并重新生成配置。
 */
async function GeneratorRouteMap( routeMapConfig: T_RouteMapConfig ): Promise<T_RouteMapHandle>{
  const obj001: T_Obj001 = Object.fromEntries(
    Object.entries( routeMapConfig ).map(
      (
        [ key, value ]: [ string, T_FilePath001 ],
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

  const arr001: Array<Promise<[ string, T_Fun001 ]>> = Object.entries( obj001 ).map(
      async (
        [ key, value ]: [ string, string ],
      ): Promise<[ string, T_Fun001, ]> => {
        return [
          key,
          ( await import( value ) ).default
        ];
      }
    ),
    arr002: Array<[ string, T_Fun001 ]> = await Array.fromAsync( arr001 );

  return Object.fromEntries( arr002 );
}

export {
  GeneratorRouteHandle,
  GeneratorRouteMap,
};

export default {
  GeneratorRouteHandle,
  GeneratorRouteMap,
};
