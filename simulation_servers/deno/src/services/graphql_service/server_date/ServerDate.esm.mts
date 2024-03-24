/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/server_date/ServerDate.esm.mts
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
  DateFormatForObject,
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type T_Resolvers,
} from 'GSD2TSTD';

const typeDefs: T_DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./ServerDate.type.graphql` ) ) );

const resolvers: T_Resolvers = {
  Query: {
    serverDate: {
      resolve: (
        // @ts-expect-error
        parent,
        // @ts-expect-error
        args,
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ): string => {
        return JSON.stringify( DateFormatForObject() );
      },
    },
  },
};

export {
  typeDefs,
  resolvers,
};
