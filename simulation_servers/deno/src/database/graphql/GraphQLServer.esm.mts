/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/GraphQLServer.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL Server。
 *
 * deno关于使用GraphQL的deno官方案例：
 * https://docs.deno.com/runtime/manual/basics/connecting_to_databases#server
 *
 * GraphQL官方教程：
 * https://graphql.org/graphql-js/
 *
 * graphql-http中关于在deno里使用GraphQL的案例：
 * https://github.com/graphql/graphql-http?tab=readme-ov-file#with-deno
 */

'use strict';

import {
  type FetchAPI,
  type HandlerOptions,

  createHandler,
} from 'esmSH/graphql-http/lib/use/fetch';

import {
  type TypeResponse001,

  httpHeaders,
} from 'configures/GlobalParameters.esm.mts';

/**
 * 自定义了一个继承于Response的类。
 * 用于在“npm:graphql-http/lib/use/fetch”处理后，我们可以继续操作，以便根据具体的业务返回给客户端一个想要的Response。
 * 其构造函数的参数列表、类型都跟Response的构造函数的参数列表、类型是一致的。
 */
class MyGraphQLServerResponse
  extends Response {

  public constructor( body?: BodyInit | null | undefined, init?: ResponseInit | undefined ){
    super( body, {
      ...( init ?? {} ),
      headers: {
        ...( init?.headers ?? {} ),
        ...httpHeaders,
      },
    } );
  }

}

/**
 * GraphQL Server。
 *
 * deno关于使用GraphQL的deno官方案例：
 * https://docs.deno.com/runtime/manual/basics/connecting_to_databases#server
 *
 * GraphQL官方教程：
 * https://graphql.org/graphql-js/
 *
 * graphql-http中关于在deno里使用GraphQL的案例：
 * https://github.com/graphql/graphql-http?tab=readme-ov-file#with-deno
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @param {HandlerOptions} options 无默认值，必须，这个参数的值类型是一个Object类型，它有哪些属性呢？详细见：
 * https://github.com/graphql/graphql-http/blob/main/src/handler.ts#L308
 * 然后搜索“interface HandlerOptions”即可看到具体的说明。
 * 一般来说，里面总是会有选项schema。
 *
 * @param {Partial<FetchAPI>} reqCtx 可选的，默认值：{ Response: MyGraphQLServerResponse, }。
 * 这个参数的值类型是一个Object类型（其源代码中的类型签名是：Partial<FetchAPI>），它有哪些属性呢？详细见：
 * https://github.com/graphql/graphql-http/blob/main/src/use/fetch.ts#L15
 * 然后搜索“interface FetchAPI”即可看到具体的说明：
 * interface FetchAPI {
 *   Response: typeof Response;
 *   ReadableStream: typeof ReadableStream;
 *   TextEncoder: typeof TextEncoder;
 * }
 * PS：
 * 如果需要在“npm:graphql-http/lib/use/fetch”处理后，可以继续操作，以便根据具体的业务返回给客户端一个想要的Response，可以设置该参数里的Response属性。
 * Response属性的值的具体写法，可以参考上面的自定义类MyGraphQLServerResponse，注意！必须要继承Response哦！
 *
 * @returns {TypeResponse001} 返回值类型为Response、Promise<Response>。
 */
function GraphQLServer( {
  request,
  options,
  reqCtx = {
    Response: MyGraphQLServerResponse,
  },
}: {
  request: Request;
  options: HandlerOptions;
  reqCtx?: Partial<FetchAPI>;
} ): TypeResponse001{
  return createHandler(
    options,
    reqCtx,
  )( request );
}

export {
  GraphQLServer,
};

export default {
  GraphQLServer,
};
