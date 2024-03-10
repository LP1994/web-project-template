/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/query/hello/Hello.query.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  type DocumentNode,
} from 'esmSH/graphql';

import {
  type TypeResolver001,
} from 'configures/GlobalParameters.esm.mts';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

const typeDefs: DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Hello.type.graphql` ) ) );

const resolvers: TypeResolver001 = {
  hello: (): string => {
    return `Hello World! This is the GraphQL Server.`;
  },
};

export {
  typeDefs,
  resolvers,
};
