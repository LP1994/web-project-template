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
 * 响应“GraphQL请求”！由如下3个库工具来实现的：
 * 1、graphql-http中关于在deno里使用GraphQL的案例：
 * https://github.com/graphql/graphql-http?tab=readme-ov-file#with-deno
 *
 * 2、graphql-ws中关于在deno里使用GraphQL的案例：
 * https://the-guild.dev/graphql/ws/get-started#with-deno
 *
 * 3、graphql-sse中关于在deno里使用GraphQL的案例：
 * https://the-guild.dev/graphql/sse/get-started#with-deno
 *
 *
 *
 * GraphQL官方教程：
 * https://graphql.org/graphql-js/
 *
 *
 *
 * graphql-ws（服务端使用graphql-ws实现，graphql-ws有对应的客户端实现）：
 * wss://127.0.0.1:9200/graphql
 * wss://127.0.0.1:4000/graphql/
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/
 * wss://127.0.0.1:9200/graphql/subscriptions
 * wss://127.0.0.1:9200/graphql/subscriptions/
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/subscriptions
 * wss://127.0.0.1:4000/simulation_servers_deno/graphql/subscriptions/
 * wss://127.0.0.1:9200/subscriptions/graphql
 * wss://127.0.0.1:4000/subscriptions/graphql/
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql/
 *
 *
 *
 * graphql-http（服务端使用graphql-http实现，graphql-http有对应的客户端实现）仅允许POST、GET请求：
 * 1、POST：
 * https://127.0.0.1:9200/graphql
 * https://127.0.0.1:9200/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/
 *
 * 2、GET（但是GET请求不支持“mutation”操作，仅支持“query”操作）：
 * https://127.0.0.1:9200/graphql/schema.json
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/schema.json
 * https://127.0.0.1:9200/graphql
 * https://127.0.0.1:9200/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/
 * 例子：
 * 为了避免特殊字符的编码错误，先使用encodeURI处理一下“GraphQL查询”，即url查询参数“query”的值需要被encodeURI处理一下，如：
 * encodeURI(`query Test001{
 *     hello1: hello,
 * }
 *
 * query Test002{
 *     serverDate2: serverDate,
 * }
 *
 * query Test003( $id: String! ){
 *     hello3: hello,
 *     serverDate3: serverDate,
 *
 *     getMessage3: getMessage(id: $id){
 *      id,
 *      author,
 *      content,
 *     },
 * }`);
 * 处理完就成了这样：
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D
 *
 * 如果有url查询参数“variables”，那其值也要序列化一下：
 * encodeURI(`{"id": "2024004-素夏"}`);
 * 处理完就成了这样：
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 *
 * 如果有url查询参数“operationName”：
 * operationName=Test003
 *
 * 完整的GET请求URL：
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test003
 *
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "application/json");
 * myHeaders.append("Cache-Control", "no-cache");
 * myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
 * myHeaders.append("Host", "127.0.0.1:9200");
 * myHeaders.append("Connection", "keep-alive");
 *
 * var requestOptions = {
 *    method: 'GET',
 *    headers: myHeaders,
 *    redirect: 'follow'
 * };
 *
 * fetch("https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test003", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 *
 * 成功！完美！
 *
 *
 *
 * graphql-sse（服务端使用graphql-sse实现，graphql-sse有对应的客户端实现）又分，“独立连接”模式、单连接模式(貌似库本身有BUG暂无法使用，会报错)：
 * 1、单连接模式(貌似库本身有BUG暂无法使用，会报错)仅允许POST、GET、PUT、DELETE请求：
 * https://127.0.0.1:9200/graphql/stream
 * https://127.0.0.1:9200/graphql/stream/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream/
 * https://127.0.0.1:9200/stream/graphql
 * https://127.0.0.1:9200/stream/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql/
 * PS：单连接模式的POST、GET、PUT、DELETE请求例子跟下面的“独立连接”模式的POST、GET请求例子有所不同！！！不可原样使用！！！
 *
 * 2、“独立连接”模式仅允许POST、GET请求：
 * https://127.0.0.1:9200/graphql/stream
 * https://127.0.0.1:9200/graphql/stream/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream/
 * https://127.0.0.1:9200/stream/graphql
 * https://127.0.0.1:9200/stream/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql/
 * “独立连接”模式的GET请求例子：
 * 为了避免特殊字符的编码错误，先使用encodeURI处理一下“GraphQL查询”，即url查询参数“query”的值需要被encodeURI处理一下：
 * encodeURI(`query Test001{
 *     hello1: hello,
 * }
 *
 * query Test002{
 *     serverDate2: serverDate,
 * }
 *
 * query Test003( $id: String! ){
 *     hello3: hello,
 *     serverDate3: serverDate,
 *
 *     getMessage3: getMessage(id: $id){
 *      id,
 *      author,
 *      content,
 *     },
 * }
 *
 * subscription Test004{
 *   greetings: greetings,
 * }
 * `);
 * 处理完就成了这样：
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A
 *
 * 如果有url查询参数“variables”，那其值也要序列化一下：
 * encodeURI(`{"id": "2024004-素夏"}`);
 * 处理完就成了这样：
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 *
 * 如果有url查询参数“operationName”：
 * operationName=Test004
 *
 * 完整的GET请求URL：
 * https://127.0.0.1:9200/graphql/stream?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test004
 *
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "text/event-stream");
 * myHeaders.append("Cache-Control", "no-cache");
 * myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
 * myHeaders.append("Host", "127.0.0.1:9200");
 * myHeaders.append("Connection", "keep-alive");
 *
 * var requestOptions = {
 *    method: 'GET',
 *    headers: myHeaders,
 *    redirect: 'follow'
 * };
 *
 * fetch("https://127.0.0.1:9200/graphql/stream?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test004", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 *
 * 成功！完美！
 *
 * “独立连接”模式的POST请求例子：
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "text/event-stream");
 * myHeaders.append("Cache-Control", "no-cache");
 * myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
 * myHeaders.append("Content-Type", "application/json");
 * myHeaders.append("Host", "127.0.0.1:9200");
 * myHeaders.append("Connection", "keep-alive");
 *
 * var raw = JSON.stringify({
 *    "query": "query Test001{\n    hello1: hello,\n}\n\nquery Test002{\n    serverDate2: serverDate,\n}\n\nquery Test003( $id: String! ){\n    hello3: hello,\n    serverDate3: serverDate,\n\n    getMessage3: getMessage(id: $id){\n     id,\n     author,\n     content,\n    },\n}\n\nsubscription Test004{\n  greetings: greetings,\n}\n",
 *    "variables": {
 *       "id": "2024004-素夏"
 *    },
 *    "operationName": "Test004"
 * });
 *
 * var requestOptions = {
 *    method: 'POST',
 *    headers: myHeaders,
 *    body: raw,
 *    redirect: 'follow'
 * };
 *
 * fetch("https://127.0.0.1:9200/graphql/stream", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 *
 * 成功！完美！
 *
 * graphql-sse实现的协议说明，详细见：
 * https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md
 *
 * 2种模式的核心区别：
 * 1、“独立连接”模式仅允许POST、GET请求：
 * 每个 GraphQL 订阅（Subscription）操作都会独立发起一个POST、GET请求，并直接在这个请求的响应中接收 SSE 流。这种方式更适合 HTTP/2 环境，也是 graphql-sse 客户端的默认模式。
 *
 * 2、单连接模式(貌似库本身有BUG暂无法使用，会报错)仅允许POST、GET、PUT、DELETE请求：
 * 所有操作复用同一条 SSE 连接，通过 PUT 获取令牌来“预约”连接，以规避 HTTP/1 对并发连接数的限制。
 * graphql-sse的单连接模式，核心是为了绕过浏览器对 HTTP/1 下同域名 SSE 连接数（通常为6个）的限制。它通过一个长连接承载所有操作的结果，并用额外的 HTTP 请求来管理这些操作的生命周期。
 *
 * 单连接模式依赖 PUT、GET、POST、DELETE 4种请求类型协同完成，流程如下：
 * PUT（预留）：客户端首先发送 PUT 请求向服务器“预留”一个 Token。服务器创建并返回该 Token（通常为 201 Created），它相当于后续所有操作的“入场券”。
 *
 * GET（建连）：客户端携带上一步获取的 Token（通过 X-GraphQL-Event-Stream-Token 头或 token 查询参数），发起 GET 请求建立唯一的 SSE 长连接。此后，所有操作的结果都通过这条连接推送。
 * 该请求必须的数据项：
 * token，位于URL查询参数中。
 * X-GraphQL-Event-Stream-Token，位于请求头中。
 * 上述2者有其一即可！
 *
 * POST（执行）：客户端需要执行 GraphQL 操作时，发送 POST 请求。该请求必须包含 Token 和一个唯一的 operationId（通常放在 extensions 字段中）。服务器成功接收后返回 202 Accepted，操作结果则通过之前的 SSE 连接异步推回。
 * 该请求必须的数据项：
 * token，位于URL查询参数中。
 * X-GraphQL-Event-Stream-Token，位于请求头中。
 * 上述2者有其一即可！
 * 客户端发给服务器的请求体数据中必须的“extensions.operationId”，如：
 * {
 * "query": "query Test001{hello1:hello} subscription Test002{greetings2:greetings}",
 * "variables": {"id": "2024004-素夏"},
 * "operationName": "Test002",
 * "extensions": { "operationId": crypto.randomUUID() }
 * }
 *
 * DELETE（停止）：当需要终止某个订阅时，客户端发送 DELETE 请求，并在 URL 参数中附带对应的 operationId，服务器便会停止该操作的数据流。
 * 该请求必须的数据项：
 * token，位于URL查询参数中。
 * X-GraphQL-Event-Stream-Token，位于请求头中。
 * 上述2者有其一即可！
 * operationId，位于URL查询参数中。
 */

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
} from './graphql_server_for_upload_file/GraphQLServerForUploadFile.esm.mts';

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

/**
 * GraphQL Server。
 *
 * 响应“GraphQL请求”！由如下3个库工具来实现的：<br />
 * 1、graphql-http中关于在deno里使用GraphQL的案例：<br />
 * https://github.com/graphql/graphql-http?tab=readme-ov-file#with-deno
 * <br /><br />
 * 2、graphql-ws中关于在deno里使用GraphQL的案例：<br />
 * https://the-guild.dev/graphql/ws/get-started#with-deno
 * <br /><br />
 * 3、graphql-sse中关于在deno里使用GraphQL的案例：<br />
 * https://the-guild.dev/graphql/sse/get-started#with-deno
 *
 * <br /><br /><br /><br />
 *
 * GraphQL官方教程：<br />
 * https://graphql.org/graphql-js/
 *
 * <br /><br /><br /><br />
 *
 * graphql-ws（服务端使用graphql-ws实现，graphql-ws有对应的客户端实现）：<br />
 * ```ts
 * wss://127.0.0.1:9200/graphql
 * wss://127.0.0.1:4000/graphql/
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/
 * wss://127.0.0.1:9200/graphql/subscriptions
 * wss://127.0.0.1:9200/graphql/subscriptions/
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/subscriptions
 * wss://127.0.0.1:4000/simulation_servers_deno/graphql/subscriptions/
 * wss://127.0.0.1:9200/subscriptions/graphql
 * wss://127.0.0.1:4000/subscriptions/graphql/
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql/
 * ```
 *
 * <br /><br /><br /><br />
 *
 * graphql-http（服务端使用graphql-http实现，graphql-http有对应的客户端实现）仅允许POST、GET请求：<br />
 * 1、POST：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql
 * https://127.0.0.1:9200/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/
 * ```
 * <br /><br />
 * 2、GET（但是GET请求不支持“mutation”操作，仅支持“query”操作）：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql/schema.json
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/schema.json
 * https://127.0.0.1:9200/graphql
 * https://127.0.0.1:9200/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/
 * ```
 * <br />
 * 例子：<br />
 * 为了避免特殊字符的编码错误，先使用encodeURI处理一下“GraphQL查询”，即url查询参数“query”的值需要被encodeURI处理一下，如：<br />
 * ```ts
 * encodeURI(`query Test001{
 *     hello1: hello,
 * }
 *
 * query Test002{
 *     serverDate2: serverDate,
 * }
 *
 * query Test003( $id: String! ){
 *     hello3: hello,
 *     serverDate3: serverDate,
 *
 *     getMessage3: getMessage(id: $id){
 *      id,
 *      author,
 *      content,
 *     },
 * }`);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D
 * ```
 * <br /><br />
 * 如果有url查询参数“variables”，那其值也要序列化一下：<br />
 * ```ts
 * encodeURI(`{"id": "2024004-素夏"}`);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br /><br />
 * 如果有url查询参数“operationName”：<br />
 * ```ts
 * operationName=Test003
 * ```
 * <br /><br />
 * 完整的GET请求URL：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test003
 * ```
 * <br /><br />
 * ```ts
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "application/json");
 * myHeaders.append("Cache-Control", "no-cache");
 * myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
 * myHeaders.append("Host", "127.0.0.1:9200");
 * myHeaders.append("Connection", "keep-alive");
 *
 * var requestOptions = {
 *    method: 'GET',
 *    headers: myHeaders,
 *    redirect: 'follow'
 * };
 *
 * fetch("https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test003", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 * ```
 * <br />
 * 成功！完美！
 *
 * <br /><br /><br /><br />
 *
 * graphql-sse（服务端使用graphql-sse实现，graphql-sse有对应的客户端实现）又分，“独立连接”模式、单连接模式(貌似库本身有BUG暂无法使用，会报错)：<br />
 * 1、单连接模式(貌似库本身有BUG暂无法使用，会报错)仅允许POST、GET、PUT、DELETE请求：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql/stream
 * https://127.0.0.1:9200/graphql/stream/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream/
 * https://127.0.0.1:9200/stream/graphql
 * https://127.0.0.1:9200/stream/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql/
 * ```
 * <br />
 * PS：单连接模式的POST、GET、PUT、DELETE请求例子跟下面的“独立连接”模式的POST、GET请求例子有所不同！！！不可原样使用！！！<br /><br />
 *
 * 2、“独立连接”模式仅允许POST、GET请求：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql/stream
 * https://127.0.0.1:9200/graphql/stream/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream/
 * https://127.0.0.1:9200/stream/graphql
 * https://127.0.0.1:9200/stream/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql/
 * ```
 * <br />
 * “独立连接”模式的GET请求例子：<br />
 * 为了避免特殊字符的编码错误，先使用encodeURI处理一下“GraphQL查询”，即url查询参数“query”的值需要被encodeURI处理一下：<br />
 * ```ts
 * encodeURI(`query Test001{
 *     hello1: hello,
 * }
 *
 * query Test002{
 *     serverDate2: serverDate,
 * }
 *
 * query Test003( $id: String! ){
 *     hello3: hello,
 *     serverDate3: serverDate,
 *
 *     getMessage3: getMessage(id: $id){
 *      id,
 *      author,
 *      content,
 *     },
 * }
 *
 * subscription Test004{
 *   greetings: greetings,
 * }
 * `);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A
 * ```
 * <br />
 * 如果有url查询参数“variables”，那其值也要序列化一下：<br />
 * ```ts
 * encodeURI(`{"id": "2024004-素夏"}`);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br /><br />
 * 如果有url查询参数“operationName”：<br />
 * ```ts
 * operationName=Test004
 * ```
 * <br /><br />
 * 完整的GET请求URL：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql/stream?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test004
 * ```
 * <br /><br />
 * ```ts
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "text/event-stream");
 * myHeaders.append("Cache-Control", "no-cache");
 * myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
 * myHeaders.append("Host", "127.0.0.1:9200");
 * myHeaders.append("Connection", "keep-alive");
 *
 * var requestOptions = {
 *    method: 'GET',
 *    headers: myHeaders,
 *    redirect: 'follow'
 * };
 *
 * fetch("https://127.0.0.1:9200/graphql/stream?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D&operationName=Test004", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 * ```
 * <br />
 * 成功！完美！<br /><br />
 *
 * “独立连接”模式的POST请求例子：<br />
 * ```ts
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "text/event-stream");
 * myHeaders.append("Cache-Control", "no-cache");
 * myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
 * myHeaders.append("Content-Type", "application/json");
 * myHeaders.append("Host", "127.0.0.1:9200");
 * myHeaders.append("Connection", "keep-alive");
 *
 * var raw = JSON.stringify({
 *    "query": "query Test001{\n    hello1: hello,\n}\n\nquery Test002{\n    serverDate2: serverDate,\n}\n\nquery Test003( $id: String! ){\n    hello3: hello,\n    serverDate3: serverDate,\n\n    getMessage3: getMessage(id: $id){\n     id,\n     author,\n     content,\n    },\n}\n\nsubscription Test004{\n  greetings: greetings,\n}\n",
 *    "variables": {
 *       "id": "2024004-素夏"
 *    },
 *    "operationName": "Test004"
 * });
 *
 * var requestOptions = {
 *    method: 'POST',
 *    headers: myHeaders,
 *    body: raw,
 *    redirect: 'follow'
 * };
 *
 * fetch("https://127.0.0.1:9200/graphql/stream", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 * ```
 * <br />
 * 成功！完美！<br /><br />
 *
 * graphql-sse实现的协议说明，详细见：<br />
 * ```ts
 * https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md
 * ```
 * <br /><br />
 * 2种模式的核心区别：<br />
 * 1、“独立连接”模式仅允许POST、GET请求：<br />
 * 每个 GraphQL 订阅（Subscription）操作都会独立发起一个POST、GET请求，并直接在这个请求的响应中接收 SSE 流。这种方式更适合 HTTP/2 环境，也是 graphql-sse 客户端的默认模式。<br /><br />
 *
 * 2、单连接模式(貌似库本身有BUG暂无法使用，会报错)仅允许POST、GET、PUT、DELETE请求：<br />
 * 所有操作复用同一条 SSE 连接，通过 PUT 获取令牌来“预约”连接，以规避 HTTP/1 对并发连接数的限制。<br />
 * graphql-sse的单连接模式，核心是为了绕过浏览器对 HTTP/1 下同域名 SSE 连接数（通常为6个）的限制。它通过一个长连接承载所有操作的结果，并用额外的 HTTP 请求来管理这些操作的生命周期。<br /><br />
 *
 * 单连接模式依赖 PUT、GET、POST、DELETE 4种请求类型协同完成，流程如下：<br />
 * PUT（预留）：客户端首先发送 PUT 请求向服务器“预留”一个 Token。服务器创建并返回该 Token（通常为 201 Created），它相当于后续所有操作的“入场券”。<br /><br />
 *
 * GET（建连）：客户端携带上一步获取的 Token（通过 X-GraphQL-Event-Stream-Token 头或 token 查询参数），发起 GET 请求建立唯一的 SSE 长连接。此后，所有操作的结果都通过这条连接推送。<br />
 * 该请求必须的数据项：<br />
 * token，位于URL查询参数中。<br />
 * X-GraphQL-Event-Stream-Token，位于请求头中。<br />
 * 上述2者有其一即可！<br /><br />
 *
 * POST（执行）：客户端需要执行 GraphQL 操作时，发送 POST 请求。该请求必须包含 Token 和一个唯一的 operationId（通常放在 extensions 字段中）。服务器成功接收后返回 202 Accepted，操作结果则通过之前的 SSE 连接异步推回。<br />
 * 该请求必须的数据项：<br />
 * token，位于URL查询参数中。<br />
 * X-GraphQL-Event-Stream-Token，位于请求头中。<br />
 * 上述2者有其一即可！<br />
 * 客户端发给服务器的请求体数据中必须的“extensions.operationId”，如：<br />
 * ```ts
 * {
 * "query": "query Test001{hello1:hello} subscription Test002{greetings2:greetings}",
 * "variables": {"id": "2024004-素夏"},
 * "operationName": "Test002",
 * "extensions": { "operationId": crypto.randomUUID() }
 * }
 * ```
 * <br /><br />
 * DELETE（停止）：当需要终止某个订阅时，客户端发送 DELETE 请求，并在 URL 参数中附带对应的 operationId，服务器便会停止该操作的数据流。<br />
 * 该请求必须的数据项：<br />
 * token，位于URL查询参数中。<br />
 * X-GraphQL-Event-Stream-Token，位于请求头中。<br />
 * 上述2者有其一即可！<br />
 * operationId，位于URL查询参数中。<br />
 *
 * @param {object} config 配置对象。
 *
 * @param {[ T_HandlerOptions, Partial<T_FetchAPI>?, ]} config.graphqlHTTPOptions 值类型是一个数组（拥有两个成员），用于存放“第三方工具库graphql-http”中createHandler函数的两个参数，无默认值，必须。<br />
 * 1、一般来说，第一个参数里面总是会有选项schema。<br />
 * 2、第二个参数，值类型是Partial<I_FetchAPI>，可选的，默认值：{ Response: MyGraphQLServerResponse, }。<br />
 * 这个参数的值类型是一个Object类型（其源代码中的类型签名是：Partial<FetchAPI>），它有哪些属性呢？详细见：<br />
 * https://github.com/graphql/graphql-http/blob/main/src/use/fetch.ts#L15 <br />
 * 然后搜索“interface FetchAPI”即可看到具体的说明：<br />
 * ```ts
 * interface FetchAPI {
 *   Response: typeof Response;
 *   ReadableStream: typeof ReadableStream;
 *   TextEncoder: typeof TextEncoder;
 * }
 * ```
 * <br />
 * PS：<br />
 * 如果需要在“npm:graphql-http/lib/use/fetch”处理后，可以继续操作，以便根据具体的业务返回给客户端一个想要的Response，可以设置该参数里的Response属性。<br />
 * Response属性的值的具体写法，可以参考上面的自定义类MyGraphQLServerResponse，注意！必须要继承Response哦！<br />
 * 3、详细参数见：<br />
 * node_modules/graphql-http/lib/use/fetch.d.ts:96 <br /><br />
 *
 * @param {[ T_HandlerOptionsBySSE, Partial<T_RequestContextBySSE>?, ]} config.graphqlSSEOptions 值类型是一个数组（拥有两个成员），用于存放“第三方工具库graphql-sse”中createHandler函数的两个参数，无默认值，必须。<br />
 * 1、一般来说，第一个参数里面总是会有选项schema。<br />
 * 2、第二个参数，值类型是Partial<T_RequestContextBySSE>，可选的，默认值：{ Response: MyGraphQLServerResponse, }。<br />
 * 这个参数的值类型是一个Object类型（其源代码中的类型签名是：Partial<RequestContext>），它有哪些属性呢？详细见：<br />
 * https://github.com/enisdenjo/graphql-sse/blob/master/src/use/fetch.ts#L10 <br />
 * 然后搜索“interface RequestContext”即可看到具体的说明：<br />
 * ```ts
 * interface RequestContext {
 *   Response: typeof Response;
 *   ReadableStream: typeof ReadableStream;
 *   TextEncoder: typeof TextEncoder;
 * }
 * ```
 * <br />
 * PS：<br />
 * 如果需要在“npm:graphql-sse/lib/use/fetch”处理后，可以继续操作，以便根据具体的业务返回给客户端一个想要的Response，可以设置该参数里的Response属性。<br />
 * Response属性的值的具体写法，可以参考上面的自定义类MyGraphQLServerResponse，注意！必须要继承Response哦！<br />
 * 3、详细参数见：<br />
 * node_modules/graphql-sse/lib/use/fetch.d.ts:45 <br />
 *
 * @param {T_ServerOptions} config.graphqlWSOptions 值类型是一个对象，是“第三方工具库graphql-ws”中makeServer函数的唯一个参数，无默认值，必须。<br />
 * 1、一般来说，里面总是会有选项schema。<br />
 * 2、详细参数见：<br />
 * node_modules/graphql-ws/server.d.ts:402
 *
 * @param {string} config.myURLPathName 符合处理条件的请求URL核心标头。
 *
 * @param {Request} config.request 请求对象，无默认值，必须。
 *
 * @returns {T_Awaitable<Response>} 返回值类型为Response、Promise<Response>。
 */
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

    return createHandlerBySSE( options, reqCtx, )( request );
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

    if( GraphQLServerForIsMultipartRequest( request ) ){
      graphqlRequest = await GraphQLServerForMultipartParser( request );

      if( IsArray( await graphqlRequest.clone().json() ) ){
        return await GraphQLServerForExecuteBatch( graphqlRequest, options, reqCtx );
      }
    }

    return createHandlerByHTTP( options, reqCtx, )( graphqlRequest );
  }
}

export {
  GraphQLServer,
};

export default {
  GraphQLServer,
};
