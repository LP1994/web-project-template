/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/AllServices.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  expandGlob,
} from 'deno_std_fs';

import {
  relative,

  // join,
  // resolve,
} from 'deno_std_path';

import {
  servicesDir,
} from 'configures/GlobalParameters.esm.mts';

type T_RouteHandleConfig = Array<[ string, string ]>;

/**
 * 本文件上的此处“import.meta.dirname”的值形如：G:\WebStormWS\web-project-template\simulation_servers\deno\src\services <br />
 * 还可以有如下写法，可作为常量root的值：<br />
 * join( import.meta.dirname, '..' ) ---> G:\WebStormWS\web-project-template\simulation_servers\deno\src <br />
 * resolve( import.meta.dirname, '..' ) ---> G:\WebStormWS\web-project-template\simulation_servers\deno\src <br />
 *
 * @type {string}
 */
const root: string = `${ import.meta.dirname }`,
  AllServicesForCondition: Array<string> = [],
  AllServicesForResponseHandle: Array<string> = [];

for await (
  const {
    /**
     * 值类型为字符串，如：<br />
     * "Condition.esm.mts"<br />
     * "ResponseHandle.esm.mts"<br />
     *
     * @type {string}
     */
    name,
    /**
     * 值类型为字符串，如：<br />
     * "G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\src\\services\\cookie\\Condition.esm.mts"<br />
     * "G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\src\\services\\cookie\\ResponseHandle.esm.mts"<br />
     *
     * @type {string}
     */
    path,
    /**
     * @type {boolean}
     */
    isFile,
  } of
  expandGlob( './**/{Condition,ResponseHandle}.esm.{ts,cts,mts}', {
    /**
     * @type {string}
     */
    root,
    includeDirs: true,
    /**
     * 可以接受通配符格式的字符串。
     *
     * @type {Array<string>}
     */
    exclude: [],
  } )
  ){
  if( isFile ){
    switch( name ){
      case `Condition.esm.mts`:
        // push的值形如：`${ relative( root, path ).replaceAll( '\\', '/' ) }` ---> cookie/Condition.esm.mts
        AllServicesForCondition.push( `${ relative( root, path ).replaceAll( '\\', '/' ) }` );

        break;
      case `ResponseHandle.esm.mts`:
        // push的值形如：`${ relative( root, path ).replaceAll( '\\', '/' ) }` ---> cookie/ResponseHandle.esm.mts
        AllServicesForResponseHandle.push( `${ relative( root, path ).replaceAll( '\\', '/' ) }` );

        break;
    }
  }
}

// 该值形如：{ 'cookie/': 'cookie/ResponseHandle.esm.mts', }
const AllServicesForResponseHandleByObj: Record<string, string> = {};

AllServicesForResponseHandle.forEach( ( item: string ): void => {
  AllServicesForResponseHandleByObj[ item.replaceAll( /ResponseHandle\.esm\.(?:ts|cts|mts)/g, '' ) ] = item;
} );

const AllServices: T_RouteHandleConfig = AllServicesForCondition.map( ( item: string ): [ string, string ] | undefined => {
  const value: string | undefined = AllServicesForResponseHandleByObj[ item.replaceAll( /Condition\.esm\.(?:ts|cts|mts)/g, '' ) ];

  if( value ){
    return [
      // 值形如：file:///G:/WebStormWS/web-project-template/simulation_servers/deno/src/services/cookie/Condition.esm.mts
      `${ servicesDir }/${ item }`,
      // 值形如：file:///G:/WebStormWS/web-project-template/simulation_servers/deno/src/services/cookie/ResponseHandle.esm.mts
      `${ servicesDir }/${ value as string }`,
    ];
  }
  else{
    return undefined;
  }
} ).filter( ( item: [ string, string ] | undefined ): boolean => item !== undefined ) as T_RouteHandleConfig;

export {
  AllServices,
};

export default AllServices;
