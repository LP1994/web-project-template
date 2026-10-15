/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/AllGraphQL.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

/**
 * 如果不按"关于该文件夹下各个resolve文件对应的文件命令规则说明.txt"里面的命名规则，也可以手动import导入，然后将值push到“moduleList”里面即可，如：<br />
 * ```ts
 * import XXX from './XXX/XXX.esm.mts';
 *
 * moduleList.push( XXX as T_DefsAndResolvers );
 * ```
 */

import {
  expandGlob,
} from 'deno_std_fs';

import {
  relative,

  // join,
  // resolve,
} from 'deno_std_path';

import {
  type DocumentNode as T_DocumentNode,
} from 'esm_sh_graphql';

import {
  type T_Resolvers,
} from 'GSD2TSTD';

type T_DefsAndResolvers = {
  typeDefs: T_DocumentNode;
  resolvers: T_Resolvers;
};

/**
 * 本文件上的此处“import.meta.dirname”的值形如：G:\WebStormWS\web-project-template\simulation_servers\deno\src\services\graphql_service <br />
 * 还可以有如下写法，可作为常量root的值：<br />
 * join( import.meta.dirname, '../..' ) ---> G:\WebStormWS\web-project-template\simulation_servers\deno\src <br />
 * resolve( import.meta.dirname, '../../' ) ---> G:\WebStormWS\web-project-template\simulation_servers\deno\src <br />
 *
 * @type {string}
 */
const root: string = `${ import.meta.dirname }`,
  moduleListForPromise: Array<Promise<T_DefsAndResolvers>> = [];

for await (
  const {
    path,
    isFile,
  } of
  expandGlob( './**/*.resolve.*.{ts,cts,mts}', {
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
    moduleListForPromise.push( import(`./${ relative( root, path ).replaceAll( '\\', '/' ) }`) );
  }
}

/**
 * 如果不按"关于该文件夹下各个resolve文件对应的文件命令规则说明.txt"里面的命名规则，也可以手动import导入，然后将值push到“moduleList”里面即可，如：<br />
 * ```ts
 * import XXX from './XXX/XXX.esm.mts';
 *
 * moduleList.push( XXX as T_DefsAndResolvers );
 * ```
 *
 * @type {T_DefsAndResolvers[]}
 */
const moduleList: Array<T_DefsAndResolvers> = ( await Promise.all( moduleListForPromise ) ).map( ( item: T_DefsAndResolvers ): T_DefsAndResolvers => ( { ...item, } ) );

export {
  moduleList as AllGraphQL,
};

export default moduleList;
