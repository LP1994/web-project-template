'use strict';

import {
  getIntrospectionQuery,
  graphql,
} from 'esm_sh_graphql';

import {
  type FetchAPI as T_FetchAPI,
  type HandlerOptions as T_HandlerOptions,

  createHandler as createHandlerByHTTP,
} from 'esm_sh_graphql_http/lib/use/fetch';

import {
  type HandlerOptions as T_HandlerOptionsBySSE,
  type RequestContext as T_RequestContextBySSE,

  createHandler as createHandlerBySSE,
} from 'esm_sh_graphql_sse/lib/use/fetch';

import {
  type Context as T_Context,
  type PingMessage as T_PingMessage,
  type PongMessage as T_PongMessage,
  type Server as T_Server,
  type ServerOptions as T_ServerOptions,

  CloseCode,

  //已经废弃的子协议！不要再用了！DEPRECATED_GRAPHQL_WS_PROTOCOL的值为：graphql-ws
  DEPRECATED_GRAPHQL_WS_PROTOCOL,
  // 推荐用的子协议！GRAPHQL_TRANSPORT_WS_PROTOCOL的值为：graphql-transport-ws
  GRAPHQL_TRANSPORT_WS_PROTOCOL,

  makeServer as makeServerByWS,
  MessageType,
  stringifyMessage,
} from 'esm_sh_graphql_ws';

import {
  type T_Awaitable,

  HttpResponseHeadersFun,
  HTTPStatus,
  serversURLPrefix,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_GraphQLServerForMultipartOperations,

  GraphQLServerForExecuteBatch,

  GraphQLServerForIsMultipartRequest,
  GraphQLServerForMultipartParser,
  GraphQLServerForCleanupUploadedFiles,
  GraphQLServerForReleaseUploadedFiles,
} from './GraphQLServerForUploadFile.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
  GetLogWriteStreamForSingleton,
  IsWSForRequest,
} from 'public/PublicTools.esm.mts';

import {
  GetDataType,
  IsArray,
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();
const logWriteStream: T_MyCusDenoFsFile = await GetLogWriteStreamForSingleton();

/**
 * 自定义了一个继承于Response的类。
 * 用于在“npm:graphql-http/lib/use/fetch”处理后，我们可以继续操作，以便根据具体的业务返回给客户端一个想要的Response。
 * 其构造函数的参数列表、类型都跟Response的构造函数的参数列表、类型是一致的。
 */
function GenerateForMyGraphQLServerResponse( request: Request ): any{
  return class MyGraphQLServerResponse
    extends Response {

    public constructor( body?: BodyInit | null | undefined, init?: ResponseInit | undefined ){
      super( body, {
        ...( init ?? {} ),
        headers: {
          ...( init?.headers ?? {} ),
          ...HttpResponseHeadersFun( request ),
        },
      } );
    }

  };
}

async function GraphQLServer( {
  graphqlHTTPOptions,
  graphqlSSEOptions,
  graphqlWSOptions,
  myURLPathName,
  request,
}: {
  graphqlHTTPOptions: [ T_HandlerOptions, Partial<T_FetchAPI>?, ];
  graphqlSSEOptions: [ T_HandlerOptionsBySSE, Partial<T_RequestContextBySSE>?, ];
  graphqlWSOptions: T_ServerOptions;
  myURLPathName: string;
  request: Request;
} ): T_Awaitable<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname );

  if( IsWSForRequest( request ) ){
    const {
      response,
      // socket.protocol为空字符！可能是Deno的BUG！所以只能重写：graphql-ws/use/deno里的makeHandler函数！
      socket,
    }: Deno.WebSocketUpgrade = Deno.upgradeWebSocket( request, {
      /**
       * 1、如果客户端在指定的超时时间内没有用pong响应此帧，则连接被视为不健康并关闭。将发出关闭和错误事件。<br />
       * 2、默认值为120秒。设置为0以禁用超时。<br />
       *
       * @type {number}
       */
      idleTimeout: 0,
      /**
       * 1、将客户端Web套接字上的“protocol”属性设置为此处提供的值，该值应该是请求Web套接字时在协议参数中指定的字符串之一。<br />
       * 2、这旨在让客户端和服务器指定用于相互通信的子协议。<br />
       * 3、在客户端使用时，需要注意，客户端发出的请求会在请求头增加一个键值对：<br />
       * "Sec-WebSocket-Protocol": `graphql-transport-ws`。<br />
       * 如果客户端发出的请求的请求头没有该键值对，客户端就会连接不上。<br />
       * 例如，在浏览器端的JS代码：<br />
       * new WebSocket( 'wss://127.0.0.1:9200/', `graphql-transport-ws` );<br />
       * 发出的请求的请求头就会自动加一个键值对：<br />
       * "Sec-WebSocket-Protocol": `graphql-transport-ws`。<br />
       * 4、GRAPHQL_TRANSPORT_WS_PROTOCOL的值为：graphql-transport-ws。<br />
       *
       * @type {string}
       */
      protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
    } );

    {
      const server: T_Server = makeServerByWS( {
        // 当客户端通过 `ConnectionInit` 消息请求初始化连接时，会触发此连接回调函数。
        // 消息载荷（即客户端发送的 `connectionParams`）包含在 `Context.connectionParams` 中。
        // 若回调函数返回 `true` 或不返回任何值，则允许客户端建立连接，并且返回给客户端数据如下：{ "type": "connection_ack" }。
        // 若回调函数返回 `false`，则会终止 Socket 连接，并触发带有 `4403: Forbidden` 状态码的关闭事件。
        // 若回调函数返回一个 Record（对象），则允许客户端建立连接，并将该返回值通过 `ConnectionAck` 消息中的可选载荷字段传递给客户端，返回给客户端数据如下：{ "type": "connection_ack", payload: 此回调函数返回的一个 Record（对象） }。
        // 若该函数内抛出错误，则会关闭 Socket，并将错误信息作为关闭事件的原因（reason）进行传递。
        // onConnect?: undefined | ((ctx: Context<P, E>) => Promise<Record<string, unknown> | boolean | void> | Record<string, unknown> | boolean | void);
        onConnect( ctx: T_Context<P, E> ): Promise<Record<string, unknown> | boolean | void> | Record<string, unknown> | boolean | void{
          const clientPayload: undefined | Record<string, unknown> = ctx.connectionParams;

          if( GetDataType( clientPayload ) === '[object Object]' ){
            MyConsole.Green( `
onConnect函数触发了，客户端向服务器发来了“connection_init”类型的消息！
并且，客户端本次向服务端发来的消息是附带了一个数据类型为"Record<string, unknown>"的“payload”荷载数据：
${ JSON.stringify( clientPayload, null, 2 ) }
` );

            logWriteStream.write( `
onConnect函数触发了，客户端向服务器发来了“connection_init”类型的消息！
并且，客户端本次向服务端发来的消息是附带了一个数据类型为"Record<string, unknown>"的“payload”荷载数据：
${ JSON.stringify( clientPayload, null, 2 ) }
` );

            // 可以根据具体业务需要，返回一个数据类型为Record<string, unknown>的数据。
            return;
          }
          else{
            MyConsole.Green( `
onConnect函数触发了，客户端向服务器发来了“connection_init”类型的消息！
` );

            logWriteStream.write( `
onConnect函数触发了，客户端向服务器发来了“connection_init”类型的消息！
` );

            // 可以根据具体业务需要，返回一个数据类型为Record<string, unknown>的数据。
            return;
          }
        },

        // 当客户端发送 `MessageType.Ping` 消息时（无论是在连接建立后的任何阶段，包括连接初始化阶段之前或之后），该回调都会被触发。
        // 如果客户端发送的 Ping 消息包含负载数据（payload），该数据将通过第二个参数传入；第一个参数则提供连接的上下文（Context）。
        // 如果实现了此回调，服务器仍会在此回调执行完毕后自动回复 Pong 消息。若需完全控制响应行为，请使用 WebSocket 本身的底层 `onPing` 监听器——实现该监听器将禁用自动回复 Pong 的功能。
        // onPing?: undefined | ((ctx: Context<P, E>, payload: PingMessage['payload']) => Promise<void> | void);

        // 当客户端发送 `MessageType.Pong` 消息时（无论是在连接建立后的任何时刻，还是在连接初始化阶段之前或之后），该方法都会被调用。
        // 如果客户端发送的 Pong 消息包含有效载荷（payload），该载荷将通过第二个参数传入；第一个参数则提供连接的上下文（Context）。
        // onPong?: undefined | ((ctx: Context<P, E>, payload: PongMessage['payload']) => Promise<void> | void);

        // 单位是毫秒，默认值是3000毫秒。
        connectionInitWaitTimeout: 1 * 60 * 1000,

        ...graphqlWSOptions,
      } );

      socket.onerror = ( error: Event | ErrorEvent ): void => {
        MyConsole.Red( `
Internal server error!!!
Internal error emitted on the WebSocket socket. Please check your implementation.
${ ( error as ErrorEvent ).message }
` );

        errorWriteStream.write( `
Internal server error!!!
Internal error emitted on the WebSocket socket. Please check your implementation.
${ ( error as ErrorEvent ).message }
` );

        socket.close( CloseCode.InternalServerError, `
Internal server error!!!
Internal error emitted on the WebSocket socket. Please check your implementation.
${ ( error as ErrorEvent ).message }
` );
      };

      let closed: ( code: number, reason: string ) => Promise<void> | void = (
        code: number,
        reason: string,
      ): Promise<void> | void => {
        MyConsole.Blue( `
close code: ${ code }, reason: ${ reason }.
` );

        logWriteStream.write( `
close code: ${ code }, reason: ${ reason }.
` );
      };

      socket.onopen = (
        // @ts-expect-error
        ev: Event
      ): void => {
        // (code?: number, reason?: string) => Promise<void>
        closed = server.opened(
          {
            close: ( code: number, reason: string ): void => socket.close( code, reason ),
            protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
            send: ( data: string | ArrayBufferLike | Blob | ArrayBufferView ): void => socket.send( data ),

            onMessage: ( cb: ( data: unknown ) => Promise<any> ): void => {
              socket.onmessage = async ( event: MessageEvent ): Promise<void> => {
                try{
                  await cb( String( event.data ) );
                }
                catch( err: unknown ){
                  MyConsole.Red( `
Internal server error!!!
Internal error occurred during message handling. Please check your implementation.
${ ( err as Error ).message }
` );

                  errorWriteStream.write( `
Internal server error!!!
Internal error occurred during message handling. Please check your implementation.
${ ( err as Error ).message }
` );

                  socket.close( CloseCode.InternalServerError, `
Internal server error!!!
Internal error occurred during message handling. Please check your implementation.
${ ( err as Error ).message }
` );
                }
              };
            },

            // 为客户端发送给服务器的 `PingMessage` 实现一个监听器。如果客户端发送的 Ping 包含有效载荷（payload），该载荷将作为第一个参数传入。
            // 一旦实现了此监听器，服务器将不再自动回复客户端发送的任何 Ping 消息；此时，如何以及何时进行响应将完全由您决定。
            // onPing?(payload: PingMessage['payload']): Promise<void> | void;
            onPing( payload: T_PingMessage['payload'] ): Promise<void> | void{
              if( GetDataType( payload ) === '[object Object]' ){
                MyConsole.Green( `
onPing函数触发了，客户端向服务器发来了“ping”类型的消息！
并且，客户端本次向服务端发来的消息是附带了一个数据类型为"Record<string, unknown>"的“payload”荷载数据：
${ JSON.stringify( payload, null, 2 ) }
` );

                logWriteStream.write( `
onPing函数触发了，客户端向服务器发来了“ping”类型的消息！
并且，客户端本次向服务端发来的消息是附带了一个数据类型为"Record<string, unknown>"的“payload”荷载数据：
${ JSON.stringify( payload, null, 2 ) }
` );

                // 可以根据具体业务需求，返回给客户端一个具体的“payload”荷载数据。这里暂时遵循graphql-ws的默认实现，将客户端传来的原有荷载数据再次返回给客户端。
                socket.send(
                  stringifyMessage( {
                    type: MessageType.Pong,
                    payload,
                  } )
                );
              }
              else{
                MyConsole.Green( `
onPing函数触发了，客户端向服务器发来了“ping”类型的消息！
` );

                logWriteStream.write( `
onPing函数触发了，客户端向服务器发来了“ping”类型的消息！
` );

                // 可以根据具体业务需求，返回给客户端一个具体的“payload”荷载数据。这里暂时遵循graphql-ws的默认实现。
                socket.send(
                  stringifyMessage( {
                    type: MessageType.Pong,
                  } )
                );
              }
            },

            // 为客户端发送给服务器的 `PongMessage` 实现一个监听器。如果客户端发送的 pong 消息包含有效载荷（payload），该载荷将通过第一个参数进行传递。
            // onPong?(payload: PongMessage['payload']): Promise<void> | void;
            onPong( payload: T_PongMessage['payload'] ): Promise<void> | void{
              if( GetDataType( payload ) === '[object Object]' ){
                MyConsole.Green( `
onPong函数触发了，客户端向服务器发来了“pong”类型的消息！
并且，客户端本次向服务端发来的消息是附带了一个数据类型为"Record<string, unknown>"的“payload”荷载数据：
${ JSON.stringify( payload, null, 2 ) }
` );

                logWriteStream.write( `
onPong函数触发了，客户端向服务器发来了“pong”类型的消息！
并且，客户端本次向服务端发来的消息是附带了一个数据类型为"Record<string, unknown>"的“payload”荷载数据：
${ JSON.stringify( payload, null, 2 ) }
` );

                // 可以根据具体业务需求，针对客户端传来的“payload”荷载数据，进行下一步的业务处理。
              }
              else{
                MyConsole.Green( `
onPong函数触发了，客户端向服务器发来了“pong”类型的消息！
` );

                logWriteStream.write( `
onPong函数触发了，客户端向服务器发来了“pong”类型的消息！
` );

                // 可以根据具体业务需求，针对客户端没有传来“payload”荷载数据时，进行下一步的业务处理。
              }
            },
          },
          {
            socket,
          },
        );
      };

      socket.onclose = async ( event: CloseEvent ): Promise<void> => {
        if( event.code === CloseCode.SubprotocolNotAcceptable && socket.protocol === DEPRECATED_GRAPHQL_WS_PROTOCOL ){
          MyConsole.Red( `
Client provided the unsupported and deprecated subprotocol "${ DEPRECATED_GRAPHQL_WS_PROTOCOL }" used by subscriptions-transport-ws.
Please see https://www.apollographql.com/docs/apollo-server/data/subscriptions/#switching-from-subscriptions-transport-ws.
` );

          errorWriteStream.write( `
Client provided the unsupported and deprecated subprotocol "${ DEPRECATED_GRAPHQL_WS_PROTOCOL }" used by subscriptions-transport-ws.
Please see https://www.apollographql.com/docs/apollo-server/data/subscriptions/#switching-from-subscriptions-transport-ws.
` );
        }

        // (code?: number, reason?: string) => Promise<void>
        await closed( event.code, event.reason );
      };
    }

    return response;
  }
  else if( ( ( ( url: string[] ): string[] => {
    const arr: string[] = [];

    serversURLPrefix.forEach( ( item001: string ): void => {
      arr.push( ...url.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
    } );

    return arr;
  } )( [
    `${ myURLPathName }/stream`,
    `${ myURLPathName }/stream/`,
    `/stream${ myURLPathName }`,
    `/stream${ myURLPathName }/`,
  ] ) ).includes( pathName ) ){
    const [
      options,
      reqCtx = {
        Response: GenerateForMyGraphQLServerResponse( request ),
      },
    ]: [ T_HandlerOptionsBySSE, Partial<T_RequestContextBySSE>?, ] = graphqlSSEOptions;

    return await createHandlerBySSE( options, reqCtx, )( request );
  }
  else{
    const [
      options,
      reqCtx = {
        Response: GenerateForMyGraphQLServerResponse( request ),
      },
    ]: [ T_HandlerOptions, Partial<T_FetchAPI>?, ] = graphqlHTTPOptions;

    const url: URL = new URL( request.url ),
      pathName: string = decodeURI( url.pathname );

    if( [
      'get',
    ].includes( request.method.toLowerCase() ) && serversURLPrefix.map( ( item: string ): string => `${ item }${ myURLPathName }/schema.json` ).includes( pathName ) ){
      const result: Record<string, unknown> = await graphql( {
        schema: options.schema,
        source: getIntrospectionQuery( {
          /**
           * Whether to include descriptions in the introspection result.
           * Default: true
           */
          descriptions: true,
          /**
           * Whether to include `specifiedByURL` in the introspection result.
           * Default: false
           */
          specifiedByUrl: true,
          /**
           * Whether to include `isRepeatable` flag on directives.
           * Default: false
           */
          directiveIsRepeatable: true,
          /**
           * Whether to include `description` field on schema.
           * Default: false
           */
          schemaDescription: true,
          /**
           * Whether target GraphQL server support deprecation of input values.
           * Default: false
           */
          inputValueDeprecation: true,
          /**
           * Whether target GraphQL server supports deprecation of directives.
           * Default: false
           */
          experimentalDirectiveDeprecation: true,
          /**
           * Whether target GraphQL server supports `@oneOf` input objects.
           * Default: false
           */
          oneOf: true,
          /**
           * How deep to recurse into nested types, larger values will result in more
           * accurate results, but have a higher load on the server.
           * Some servers might restrict the maximum query depth or complexity.
           * If that's the case, try decreasing this value.
           *
           * set typeDepth to a reasonable value between 0 and 100, Default: 9.
           */
          typeDepth: 10,
        } ),
      } );

      return new Response( JSON.stringify( result, null, 2 ), {
        headers: {
          ...HttpResponseHeadersFun( request ),
          'content-type': `application/json; charset=utf-8`,
        },
        status: HTTPStatus[ 200 ].status,
        statusText: HTTPStatus[ 200 ].statusText,
      } );
    }

    let graphqlRequest: Request = request;
    const isMultipartRequest: boolean = GraphQLServerForIsMultipartRequest( request );

    try{
      if( isMultipartRequest ){
        graphqlRequest = await GraphQLServerForMultipartParser( request );

        if( IsArray( await graphqlRequest.clone().json() ) ){
          const batchResponse: Response = await GraphQLServerForExecuteBatch( graphqlRequest, options, reqCtx );

          if( batchResponse.ok ){
            GraphQLServerForReleaseUploadedFiles( graphqlRequest );
          }
          else{
            await GraphQLServerForCleanupUploadedFiles( graphqlRequest );
          }

          return batchResponse;
        }
      }

      const graphQLResponse: Response = await createHandlerByHTTP( options, reqCtx, )( graphqlRequest );

      if( isMultipartRequest ){
        if( graphQLResponse.ok ){
          // HTTP 处理成功：文件保留在 uploadDir，仅释放本次请求的清理追踪缓存。
          GraphQLServerForReleaseUploadedFiles( graphqlRequest );
        }
        else{
          // GraphQL HTTP 层返回非 2xx：视为本次上传处理失败，删除已写入的文件。
          await GraphQLServerForCleanupUploadedFiles( graphqlRequest );
        }
      }

      return graphQLResponse;
    }
    catch( error: unknown ){
      if( isMultipartRequest ){
        // 包括 createHandlerByHTTP、批处理以及请求体转换阶段向外抛出的异常。
        // Parser 自身的异常已在 Parser 内部清理；此处重复调用是安全的（无会话时直接返回）。
        await GraphQLServerForCleanupUploadedFiles( graphqlRequest );
      }

      throw error;
    }
  }
}

export {
  GraphQLServer,
};

export default {
  GraphQLServer,
};
