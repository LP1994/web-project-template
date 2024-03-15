/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/query/server_date/ServerDate.query.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  type DocumentNode,
} from 'esm_sh_graphql';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

import {
  DateFormatForObject,
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type QueryResolvers,
} from 'GSD2TSTD/GSD2TSTD.esm.mts';

const typeDefs: DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./ServerDate.type.graphql` ) ) );

const resolvers: QueryResolvers = {
  serverDate: (): string => {
    return JSON.stringify( DateFormatForObject() );
  },
};

export {
  typeDefs,
  resolvers,
};
