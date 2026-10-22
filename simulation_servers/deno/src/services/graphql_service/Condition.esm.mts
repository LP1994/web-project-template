/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:47 星期三
 */

/**
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

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001_Root_CA：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002_Servers_CA：HTTPSSL001_Servers_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003_Clients_CA：HTTPSSL001_Clients_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  serversURLPrefix,
} from 'configures/GlobalParameters.esm.mts';

import {
  IsGetForRequestAndNoWS,
  IsWSForRequest,
} from 'public/PublicTools.esm.mts';

/**
 * 符合处理条件的请求URL核心标头。
 *
 * @type {string}
 */
export const myURLPathName: string = `/graphql`;

/**
 * 验证客户端的请求是否满足该条件函数，满足的话就会启用并执行“ResponseHandle.esm.mts”以响应请求。<br />
 * 返回值为true、Promise<true>时，表示满足条件。<br />
 * 返回值为false、Promise<false>时，表示不满足条件。<br /><br />
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
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<boolean>} 一般返回的是一个boolean类型的值，当然也允许返回的值类型为Promise<boolean>。
 */
async function Condition( request: Request ): Promise<boolean>{
  // url.search，形如：?query={hello1:hello,serverDate1:serverDate,}&variables={}
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname );

  return (
    (
      IsWSForRequest( request ) && ( ( ( arg: string[] ): string[] => {
        const result: string[] = [];

        serversURLPrefix.forEach( ( item001: string ): void => {
          result.push( ...arg.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
        } );

        return result;
      } )( [
        myURLPathName,
        `${ myURLPathName }/`,

        `${ myURLPathName }/subscriptions`,
        `${ myURLPathName }/subscriptions/`,

        `/subscriptions${ myURLPathName }`,
        `/subscriptions${ myURLPathName }/`,
      ] ) ).includes( pathName )
    ) ||
    (
      IsGetForRequestAndNoWS( request ) &&
      (
        ( ( ( arg: string[] ): string[] => {
          const result: string[] = [];

          serversURLPrefix.forEach( ( item001: string ): void => {
            result.push( ...arg.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
          } );

          return result;
        } )( [
          `${ myURLPathName }/schema.json`,

          `${ myURLPathName }/stream`,
          `${ myURLPathName }/stream/`,

          `/stream${ myURLPathName }`,
          `/stream${ myURLPathName }/`,
        ] ) ).includes( pathName ) ||
        ( ( ( ( arg: string[] ): string[] => {
          const result: string[] = [];

          serversURLPrefix.forEach( ( item001: string ): void => {
            result.push( ...arg.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
          } );

          return result;
        } )( [
          `${ myURLPathName }`,
          `${ myURLPathName }/`,
        ] ) ).includes( pathName ) && url.searchParams.has( 'query' ) )
      )
    ) ||
    (
      [
        'post',
      ].includes( request.method.toLowerCase() ) && ( ( ( arg: string[] ): string[] => {
        const result: string[] = [];

        serversURLPrefix.forEach( ( item001: string ): void => {
          result.push( ...arg.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
        } );

        return result;
      } )( [
        `${ myURLPathName }`,
        `${ myURLPathName }/`,

        `${ myURLPathName }/stream`,
        `${ myURLPathName }/stream/`,

        `/stream${ myURLPathName }`,
        `/stream${ myURLPathName }/`,
      ] ) ).includes( pathName )
    ) ||
    (
      [
        'put',
      ].includes( request.method.toLowerCase() ) && ( ( ( arg: string[] ): string[] => {
        const result: string[] = [];

        serversURLPrefix.forEach( ( item001: string ): void => {
          result.push( ...arg.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
        } );

        return result;
      } )( [
        `${ myURLPathName }/stream`,
        `${ myURLPathName }/stream/`,

        `/stream${ myURLPathName }`,
        `/stream${ myURLPathName }/`,
      ] ) ).includes( pathName )
    ) ||
    (
      [
        'delete',
      ].includes( request.method.toLowerCase() ) && ( ( ( arg: string[] ): string[] => {
        const result: string[] = [];

        serversURLPrefix.forEach( ( item001: string ): void => {
          result.push( ...arg.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
        } );

        return result;
      } )( [
        `${ myURLPathName }/stream`,
        `${ myURLPathName }/stream/`,

        `/stream${ myURLPathName }`,
        `/stream${ myURLPathName }/`,
      ] ) ).includes( pathName )
    )
  );
}

// 必须部署这个默认的导出值。
export default Condition;
