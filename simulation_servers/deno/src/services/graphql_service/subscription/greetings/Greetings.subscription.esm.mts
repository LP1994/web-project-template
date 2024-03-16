/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/subscription/greetings/Greetings.subscription.esm.mts
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
  type T_SubscriptionResolvers,
} from 'GSD2TSTD';

const typeDefs: T_DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Greetings.type.graphql` ) ) );

const resolvers: T_SubscriptionResolvers = {
  greetings: async function* (): AsyncGenerator<{
    greetings: string;
  }, void, unknown>{
    for( const hi of
      [
        'Hi',
        'Bonjour',
        'Hola',
        'Ciao',
        'Zdravo',
      ] ){
      yield {
        greetings: hi,
      };
    }
  },
};

export {
  typeDefs,
  resolvers,
};
