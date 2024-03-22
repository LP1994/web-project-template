/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/hello/Hello.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  type DocumentNode as T_DocumentNode,
} from 'esm_sh_graphql';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

import {
  type T_Resolvers,
} from 'GSD2TSTD';

const typeDefs: T_DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Hello.type.graphql` ) ) );

const resolvers: T_Resolvers = {
  Query: {
    hello: {
      resolve: (): string => {
        return `Hello World! This is the GraphQL Server.`;
      },
    },
  },
};

export {
  typeDefs,
  resolvers,
};
