/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/AllGraphQL.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  expandGlob,
} from 'jsr:@std/fs';

import {
  relative,
} from 'jsr:@std/path';

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

const moduleList: Array<T_DefsAndResolvers> = ( await Promise.all( moduleListForPromise ) ).map( ( item: T_DefsAndResolvers ): T_DefsAndResolvers => ( { ...item, } ) );

export {
  moduleList as AllGraphQL,
};

export default moduleList;
