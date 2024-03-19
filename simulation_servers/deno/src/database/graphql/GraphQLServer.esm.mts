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
  type Server as T_Server,

  makeServer,

  // 推荐用的子协议！GRAPHQL_TRANSPORT_WS_PROTOCOL的值为：graphql-transport-ws
  GRAPHQL_TRANSPORT_WS_PROTOCOL,
  //已经废弃的子协议！不要再用了！DEPRECATED_GRAPHQL_WS_PROTOCOL的值为：graphql-ws
  DEPRECATED_GRAPHQL_WS_PROTOCOL,

  CloseCode,
} from 'esm_sh/graphql-ws/lib';

import {
  type FetchAPI as T_FetchAPI,
  type HandlerOptions as T_HandlerOptions,

  createHandler,
} from 'esm_sh/graphql-http/lib/use/fetch';

import {
  createHandler as createHandlerBySSE,
} from 'esm_sh/graphql-sse/lib/use/fetch';

import {
  type T_Response001,

  httpResponseHeaders,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_QueryResolvers,
  type T_MutationResolvers,
  type T_SubscriptionResolvers,
} from 'GSD2TSTD';

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
        ...httpResponseHeaders,
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
 * @param {T_HandlerOptions} options 无默认值，必须，这个参数的值类型是一个Object类型，它有哪些属性呢？详细见：
 * https://github.com/graphql/graphql-http/blob/main/src/handler.ts#L308
 * 然后搜索“interface I_HandlerOptions”即可看到具体的说明。
 * 一般来说，里面总是会有选项schema。
 *
 * @param {Partial<I_FetchAPI>} reqCtx 可选的，默认值：{ Response: MyGraphQLServerResponse, }。
 * 这个参数的值类型是一个Object类型（其源代码中的类型签名是：Partial<I_FetchAPI>），它有哪些属性呢？详细见：
 * https://github.com/graphql/graphql-http/blob/main/src/use/fetch.ts#L15
 * 然后搜索“interface I_FetchAPI”即可看到具体的说明：
 * interface I_FetchAPI {
 *   Response: typeof Response;
 *   ReadableStream: typeof ReadableStream;
 *   TextEncoder: typeof TextEncoder;
 * }
 * PS：
 * 如果需要在“npm:graphql-http/lib/use/fetch”处理后，可以继续操作，以便根据具体的业务返回给客户端一个想要的Response，可以设置该参数里的Response属性。
 * Response属性的值的具体写法，可以参考上面的自定义类MyGraphQLServerResponse，注意！必须要继承Response哦！
 *
 * @param {Record<'query' | 'mutation' | 'subscription', T_QueryResolvers | T_MutationResolvers | T_SubscriptionResolvers>} subscriptionRoots 给WebSocket使用的解析，无默认值，可选。
 *
 * @returns {T_Response001} 返回值类型为Response、Promise<Response>。
 */
function GraphQLServer( {
  request,
  options,
  reqCtx = {
    Response: MyGraphQLServerResponse,
  },
  subscriptionRoots,
}: {
  request: Request;
  options: T_HandlerOptions;
  reqCtx?: Partial<T_FetchAPI>;
  subscriptionRoots?: Record<'query' | 'mutation' | 'subscription', T_QueryResolvers | T_MutationResolvers | T_SubscriptionResolvers>;
} ): T_Response001{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname ),
    upgrade: string = ( request.headers.get( 'upgrade' ) ?? '' ).trim().toLowerCase(),
    // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
    connection: string = ( request.headers.get( 'connection' ) ?? '' ).trim().toLowerCase();

  if( upgrade === 'websocket' && ( connection === 'upgrade' || connection === 'keep-alive, Upgrade'.toLowerCase() || connection === 'keep-alive,Upgrade'.toLowerCase() ) ){
    const {
      socket,
      response,
    }: Deno.WebSocketUpgrade = Deno.upgradeWebSocket( request, {
      /**
       * @type {string} 1、将客户端Web套接字上的“protocol”属性设置为此处提供的值，该值应该是请求Web套接字时在协议参数中指定的字符串之一。<br />
       * 2、这旨在让客户端和服务器指定用于相互通信的子协议。<br />
       * 3、在客户端使用时，需要注意，客户端发出的请求会在请求头增加一个键值对：<br />
       * "Sec-WebSocket-Protocol": `graphql-transport-ws`。<br />
       * 如果客户端发出的请求的请求头没有该键值对，客户端就会连接不上。<br />
       * 例如，在浏览器端的JS代码：<br />
       * new WebSocket( 'wss://127.0.0.1:9200/', `graphql-transport-ws` );<br />
       * 发出的请求的请求头就会自动加一个键值对：<br />
       * "Sec-WebSocket-Protocol": `graphql-transport-ws`。<br />
       * 4、GRAPHQL_TRANSPORT_WS_PROTOCOL的值为：graphql-transport-ws。<br />
       */
      protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
      /**
       * @type {number} 1、如果客户端在指定的超时时间内没有用pong响应此帧，则连接被视为不健康并关闭。将发出关闭和错误事件。<br />
       * 2、默认值为120秒。设置为0以禁用超时。<br />
       */
      idleTimeout: 0,
    } );

    {
      const server: T_Server = makeServer(
        {
          ...options,
          roots: subscriptionRoots,
        },
      );

      socket.onerror = ( error: Event | ErrorEvent ): void => {
        console.error( 'Internal error emitted on the WebSocket socket. Please check your implementation.', error );

        socket.close( CloseCode.InternalServerError, 'Internal server error' );
      };

      let closed: ( code: number, reason: string ) => Promise<void> | void = (
        code: number,
        reason: string,
      ): Promise<void> | void => {
        console.log( `\n\n\nclose code: ${ code }, reason: ${ reason }.\n\n\n` );
      };

      socket.onopen = (
        // @ts-expect-error
        ev: Event
      ): void => {
        closed = server.opened(
          {
            protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
            send: ( data: string | ArrayBufferLike | Blob | ArrayBufferView ): void => socket.send( data ),
            close: ( code: number, reason: string ): void => socket.close( code, reason ),
            onMessage: ( cb: ( data: unknown ) => Promise<any> ): void => {
              socket.onmessage = async ( event: MessageEvent ): Promise<void> => {
                try{
                  await cb( String( event.data ) );
                }
                catch( err: unknown ){
                  console.error( 'Internal error occurred during message handling. Please check your implementation.', err );

                  socket.close( CloseCode.InternalServerError, 'Internal server error' );
                }
              };
            },
          },
          {
            socket,
          },
        );
      };

      socket.onclose = ( event: CloseEvent ): void => {
        if( event.code === CloseCode.SubprotocolNotAcceptable && socket.protocol === DEPRECATED_GRAPHQL_WS_PROTOCOL ){
          console.error( `Client provided the unsupported and deprecated subprotocol "${ DEPRECATED_GRAPHQL_WS_PROTOCOL }" used by subscriptions-transport-ws. Please see https://www.apollographql.com/docs/apollo-server/data/subscriptions/#switching-from-subscriptions-transport-ws.` );
        }

        closed( event.code, event.reason );
      };
    }

    return response;
  }
  else if( pathName === '/graphql/stream' || pathName === '/graphql/stream/' ){
    return createHandlerBySSE(
      options,
      reqCtx,
    )( request );
  }
  else{
    return createHandler(
      options,
      reqCtx,
    )( request );
  }
}

export {
  GraphQLServer,
};

export default {
  GraphQLServer,
};
