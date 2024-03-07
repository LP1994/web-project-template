/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/GraphQLServer.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL Server，详细见：
 * https://docs.deno.com/runtime/manual/basics/connecting_to_databases#server
 */

'use strict';

import {
  GraphQLHTTP,
} from 'DenoX/gql/mod.ts';

import {
  gql,
} from 'DenoX/graphql_tag/mod.ts';

import {
  makeExecutableSchema,
} from 'esmSH/@graphql-tools/schema';

import {
  type TypeResponse001,

  httpHeaders,
} from 'configures/GlobalParameters.esm.mts';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => `2024，Hello World！`,
  },
};

const schema = makeExecutableSchema( {
  typeDefs,
  resolvers,
} );

/**
 * GraphQL Server。
 * 关于函数“GraphQLHTTP”的使用详细见：
 * https://deno.land/x/gql/mod.ts?source=
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {TypeResponse001} 返回值类型为Response、Promise<Response>。
 */
function GraphQLServer( request: Request ): TypeResponse001{
  return GraphQLHTTP<Request>( {
    /**
     * 选项playgroundOptions（值类型标注是：Omit<RenderPageOptions, "endpoint">）的值详细见：
     * https://github.com/graphql/graphql-playground/blob/main/packages/graphql-playground-html/src/render-playground-page.ts
     */
    // playgroundOptions: {},

    graphiql: true,
    headers: httpHeaders,

    /**
     * 以下参数到底有哪些可以见：
     * https://github.com/graphql/graphql-http/blob/main/src/handler.ts
     * 检索“interface HandlerOptions”即可。
     */

    // 选项schema：操作将在其上执行和验证的“GraphQL schema”。
    schema,
  } )( request );
}

export {
  GraphQLServer,
};

export default GraphQLServer;
