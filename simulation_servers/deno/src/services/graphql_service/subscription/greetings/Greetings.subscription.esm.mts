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
  type T_Resolvers,
} from 'GSD2TSTD';

const typeDefs: T_DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Greetings.type.graphql` ) ) );

const resolvers: T_Resolvers = {
  Subscription: {
    greetings: {
      subscribe: async function* (): AsyncGenerator<{
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
      /**
       * 当执行完上面定义的subscribe函数后，会得到即将返回给客户端的数据，在将数据发送给客户端前，还可以再使用这个resolve函数来处理一下即将返回给客户端的数据。
       *
       * @param {{greetings: string}} payloadData 该值就是上面定义的subscribe函数后，得到的即将返回给客户端的数据。该值的数据类型就是上面定义的subscribe函数的返回值类型AsyncGenerator的三个类型参数中的第一个类型参数。
       *
       * @returns {string} 返回值类型就是GraphQL定义文件“Greetings.type.graphql”中，定义的订阅操作“greetings”的返回值类型。
       */
      resolve: ( payloadData: {
        greetings: string;
      } ): string => payloadData.greetings,
    },
  },
};

export {
  typeDefs,
  resolvers,
};
