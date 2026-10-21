/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:47 星期三
 */

/**
 * 该文件夹是用于响应“GraphQL请求”（POST、GET、PUT、DELETE请求、Websocket请求），如：
 * POST（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：
 * https://127.0.0.1:9200/graphql
 * https://127.0.0.1:9200/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/
 *
 *
 *
 * PUT（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：
 * https://127.0.0.1:9200/graphql
 * https://127.0.0.1:9200/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/
 *
 *
 *
 * DELETE（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：
 * https://127.0.0.1:9200/graphql
 * https://127.0.0.1:9200/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/
 *
 *
 *
 * GET（服务端使用graphql-http实现，但是GET请求不支持“mutation”操作，graphql-http有对应的客户端实现）：
 * https://127.0.0.1:9200/graphql/schema.json
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/schema.json
 *
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/graphql/?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/simulation_servers_deno/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 *
 * 例子：
 * 为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：
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
 * 如果有“variables”参数，那也要序列化一下：
 * encodeURI(`{"id": "2024004-素夏"}`);
 * 处理完就成了这样：
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 *
 * operationName: "Test003"
 *
 * 完整的GET请求URL：
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
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
 * fetch("https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 *
 * 成功！完美！
 *
 *
 *
 * Websocket（服务端使用graphql-ws实现，graphql-ws有对应的客户端实现）：
 * wss://127.0.0.1:9200/graphql
 * wss://127.0.0.1:4000/graphql/
 * wss://127.0.0.1:9200/graphql/subscriptions
 * wss://127.0.0.1:9200/graphql/subscriptions/
 * wss://127.0.0.1:9200/subscriptions/graphql
 * wss://127.0.0.1:4000/subscriptions/graphql/
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/subscriptions
 * wss://127.0.0.1:4000/simulation_servers_deno/graphql/subscriptions/
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql/
 *
 *
 *
 * SSE（服务端使用graphql-sse实现，该工具支持处理由客户端发起的GET、POST请求，graphql-sse有对应的客户端实现）：
 * https://127.0.0.1:9200/graphql/stream
 * https://127.0.0.1:9200/graphql/stream/
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream/
 * https://127.0.0.1:9200/stream/graphql
 * https://127.0.0.1:9200/stream/graphql/
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql/
 * PS：
 * 1、SSE 的本质是让服务器能够持续向客户端单向推送数据。它的工作流程非常纯粹：
 * 客户端发起一个普通的 HTTP GET 请求，并在请求头中带上 Accept: text/event-stream，告诉服务器“我期望接收一个事件流”。
 * 服务器保持这个连接不关闭，并设置 Content-Type: text/event-stream，然后不断地通过这个连接向客户端发送文本格式的事件数据。
 * 2、标准规范的限制：浏览器原生的 EventSource API 被设计为只能发起 GET 请求。
 * 它不支持自定义请求方法，也不支持在请求体中发送数据，所以标准的 SSE 规范本身是不允许使用 POST 的。
 *
 * 客户端连接例子，可以使用浏览器原生的“EventSource”API也可以使用“fetch”API自行构建SSE请求：
 * 1、GET请求，为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：
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
 * 如果有“variables”参数，那也要序列化一下：
 * encodeURI(`{"id": "2024004-素夏"}`);
 * 处理完就成了这样：
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 *
 * operationName: "Test004"
 *
 * 完整的GET请求URL：
 * https://127.0.0.1:9200/graphql/stream?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A&operationName=Test004&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
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
 * 2、POST请求：
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
 * graphql-sse实现的协议说明（“独立连接”模式、单连接模式）！！！
 * 详细见：
 * https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md#graphql-over-server-sent-events-protocol
 * 基于服务器发送事件协议的 GraphQL
 * 简介
 * 我们生活在一个互联的世界中，对实时性的需求与日俱增。尤其是在这个世界上互联程度最高的“世界”——互联网中。谈到实时性，主要有两大技术：WebSockets 和服务器发送事件（SSE）。
 * 出于从简单易用到广泛采用等诸多原因，在您的下一个实时驱动项目中使用服务器发送事件（简称 SSE）听起来颇具吸引力。然而，您很快会发现，在处理基于 HTTP/1 的服务器时，SSE 存在开放连接数上限的限制（详情见下文）。
 * 本文旨在通过“单连接模式”突破 HTTP/1 的限制，并借助“独立连接模式”支持基于 HTTP/2+ 的服务器，同时采用统一的基于 SSE 的 GraphQL 传输协议。
 *
 * 例子，见：
 * https://the-guild.dev/graphql/sse/guides/recipes#with-eventsource-distinct-connections-mode
 *
 * 2种模式下的“停止”逻辑
 * 1、独立连接模式（你之前用的 POST 模式）
 * 在这种模式下，不需要也不应该使用 DELETE 请求。停止一个订阅的方式非常简单：客户端直接关闭用于接收该订阅的 SSE 连接（即 fetch 的 ReadableStream）即可，服务器会感知到连接关闭并停止操作。
 * 2、单连接模式（PUT + GET 模式）
 * 这是 DELETE 请求发挥作用的场景。因为所有订阅共享一条 GET 建立的 SSE 连接，你不能通过关闭连接来停止某一个订阅。此时，必须通过发送一个 DELETE 请求来精确地“叫停”某个特定的操作。
 *
 * 2种模式的核心区别
 * 1、独立连接模式（POST）：每个 GraphQL 订阅（Subscription）操作都会独立发起一个 POST 请求，并直接在这个请求的响应中接收 SSE 流。这种方式更适合 HTTP/2 环境，也是 graphql-sse 客户端的默认模式。
 * 2、单连接模式（PUT + GET）：所有操作复用同一条 SSE 连接，通过 PUT 获取令牌来“预约”连接，以规避 HTTP/1 对并发连接数的限制。
 *
 *
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByPostForRouteHandle”中的配置。
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
 * 符合处理条件的请求URL核心标头。<br /><br />
 *
 * 具体请求URL如：<br />
 * POST（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql <br />
 * https://127.0.0.1:9200/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * PUT（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql <br />
 * https://127.0.0.1:9200/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * DELETE（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql <br />
 * https://127.0.0.1:9200/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * GET（服务端使用graphql-http实现，但是GET请求不支持“mutation”操作，graphql-http有对应的客户端实现）：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql/schema.json
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/schema.json
 *
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/graphql/?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/simulation_servers_deno/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br />
 * 例子：<br />
 * 为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：<br />
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
 * <br />
 * 如果有“variables”参数，那也要序列化一下：<br />
 * ```ts
 * encodeURI(`{"id": "2024004-素夏"}`);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br /><br />
 * operationName: "Test003"
 * <br /><br />
 * 完整的GET请求URL：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br />
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
 * fetch("https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 * ```
 * 成功！完美！<br /><br /><br /><br />
 *
 *
 *
 * Websocket（服务端使用graphql-ws实现，graphql-ws有对应的客户端实现）：<br />
 * wss://127.0.0.1:9200/graphql <br />
 * wss://127.0.0.1:4000/graphql/ <br />
 * wss://127.0.0.1:9200/graphql/subscriptions <br />
 * wss://127.0.0.1:9200/graphql/subscriptions/ <br />
 * wss://127.0.0.1:9200/subscriptions/graphql <br />
 * wss://127.0.0.1:4000/subscriptions/graphql/ <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/ <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/subscriptions <br />
 * wss://127.0.0.1:4000/simulation_servers_deno/graphql/subscriptions/ <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * SSE（服务端使用graphql-sse实现，该工具支持处理由客户端发起的GET、POST请求，graphql-sse有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql/stream <br />
 * https://127.0.0.1:9200/graphql/stream/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream/ <br />
 * https://127.0.0.1:9200/stream/graphql <br />
 * https://127.0.0.1:9200/stream/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql/ <br />
 * PS：<br />
 * 1、SSE 的本质是让服务器能够持续向客户端单向推送数据。它的工作流程非常纯粹：<br />
 * 客户端发起一个普通的 HTTP GET 请求，并在请求头中带上 Accept: text/event-stream，告诉服务器“我期望接收一个事件流”。<br />
 * 服务器保持这个连接不关闭，并设置 Content-Type: text/event-stream，然后不断地通过这个连接向客户端发送文本格式的事件数据。<br />
 * 2、标准规范的限制：浏览器原生的 EventSource API 被设计为只能发起 GET 请求。<br />
 * 它不支持自定义请求方法，也不支持在请求体中发送数据，所以标准的 SSE 规范本身是不允许使用 POST 的。<br /><br />
 *
 * 客户端连接例子，可以使用浏览器原生的“EventSource”API也可以使用“fetch”API自行构建SSE请求：<br />
 * 1、GET请求，为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：<br />
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
 * 处理完就成了这样：<br />
 * ```ts
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A
 * ```
 * <br />
 * 如果有“variables”参数，那也要序列化一下：<br />
 * ```ts
 * encodeURI(`{"id": "2024004-素夏"}`);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br /><br />
 * operationName: "Test004"
 * <br /><br />
 * 完整的GET请求URL：<br />
 * https://127.0.0.1:9200/graphql/stream?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A&operationName=Test004&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
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
 * <br /><br />
 * 2、POST请求：<br />
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
 * graphql-sse实现的协议说明（“独立连接”模式、单连接模式）！！！<br />
 * 详细见：<br />
 * https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md#graphql-over-server-sent-events-protocol <br />
 * 基于服务器发送事件协议的 GraphQL<br />
 * 简介<br />
 * 我们生活在一个互联的世界中，对实时性的需求与日俱增。尤其是在这个世界上互联程度最高的“世界”——互联网中。谈到实时性，主要有两大技术：WebSockets 和服务器发送事件（SSE）。<br />
 * 出于从简单易用到广泛采用等诸多原因，在您的下一个实时驱动项目中使用服务器发送事件（简称 SSE）听起来颇具吸引力。然而，您很快会发现，在处理基于 HTTP/1 的服务器时，SSE 存在开放连接数上限的限制（详情见下文）。<br />
 * 本文旨在通过“单连接模式”突破 HTTP/1 的限制，并借助“独立连接模式”支持基于 HTTP/2+ 的服务器，同时采用统一的基于 SSE 的 GraphQL 传输协议。<br /><br />
 *
 * 例子，见：<br />
 * https://the-guild.dev/graphql/sse/guides/recipes#with-eventsource-distinct-connections-mode <br /><br />
 *
 * 2种模式下的“停止”逻辑<br />
 * 1、独立连接模式（你之前用的 POST 模式）<br />
 * 在这种模式下，不需要也不应该使用 DELETE 请求。停止一个订阅的方式非常简单：客户端直接关闭用于接收该订阅的 SSE 连接（即 fetch 的 ReadableStream）即可，服务器会感知到连接关闭并停止操作。<br />
 * 2、单连接模式（PUT + GET 模式）<br />
 * 这是 DELETE 请求发挥作用的场景。因为所有订阅共享一条 GET 建立的 SSE 连接，你不能通过关闭连接来停止某一个订阅。此时，必须通过发送一个 DELETE 请求来精确地“叫停”某个特定的操作。<br /><br />
 *
 * 2种模式的核心区别<br />
 * 1、独立连接模式（POST）：每个 GraphQL 订阅（Subscription）操作都会独立发起一个 POST 请求，并直接在这个请求的响应中接收 SSE 流。这种方式更适合 HTTP/2 环境，也是 graphql-sse 客户端的默认模式。<br />
 * 2、单连接模式（PUT + GET）：所有操作复用同一条 SSE 连接，通过 PUT 获取令牌来“预约”连接，以规避 HTTP/1 对并发连接数的限制。<br />
 *
 * @type {string}
 */
export const myURLPathName: string = `/graphql`;

/**
 * 验证客户端的请求是否满足该条件函数，满足的话就会启用并执行“ResponseHandle.esm.mts”以响应请求。<br />
 * 返回值为true、Promise<true>时，表示满足条件。<br />
 * 返回值为false、Promise<false>时，表示不满足条件。<br /><br />
 *
 * 具体请求URL如：<br />
 * POST（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql <br />
 * https://127.0.0.1:9200/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * PUT（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql <br />
 * https://127.0.0.1:9200/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * DELETE（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql <br />
 * https://127.0.0.1:9200/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * GET（服务端使用graphql-http实现，但是GET请求不支持“mutation”操作，graphql-http有对应的客户端实现）：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql/schema.json
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/schema.json
 *
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/graphql/?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/simulation_servers_deno/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br />
 * 例子：<br />
 * 为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：<br />
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
 * <br />
 * 如果有“variables”参数，那也要序列化一下：<br />
 * ```ts
 * encodeURI(`{"id": "2024004-素夏"}`);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br /><br />
 * operationName: "Test003"
 * <br /><br />
 * 完整的GET请求URL：<br />
 * ```ts
 * https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br />
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
 * fetch("https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D&operationName=Test003&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 * ```
 * 成功！完美！<br /><br /><br /><br />
 *
 *
 *
 * Websocket（服务端使用graphql-ws实现，graphql-ws有对应的客户端实现）：<br />
 * wss://127.0.0.1:9200/graphql <br />
 * wss://127.0.0.1:4000/graphql/ <br />
 * wss://127.0.0.1:9200/graphql/subscriptions <br />
 * wss://127.0.0.1:9200/graphql/subscriptions/ <br />
 * wss://127.0.0.1:9200/subscriptions/graphql <br />
 * wss://127.0.0.1:4000/subscriptions/graphql/ <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/ <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/graphql/subscriptions <br />
 * wss://127.0.0.1:4000/simulation_servers_deno/graphql/subscriptions/ <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql <br />
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/graphql/ <br /><br /><br /><br />
 *
 *
 *
 * SSE（服务端使用graphql-sse实现，该工具支持处理由客户端发起的GET、POST请求，graphql-sse有对应的客户端实现）：<br />
 * https://127.0.0.1:9200/graphql/stream <br />
 * https://127.0.0.1:9200/graphql/stream/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream <br />
 * https://127.0.0.1:9200/simulation_servers_deno/graphql/stream/ <br />
 * https://127.0.0.1:9200/stream/graphql <br />
 * https://127.0.0.1:9200/stream/graphql/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql <br />
 * https://127.0.0.1:9200/simulation_servers_deno/stream/graphql/ <br />
 * PS：<br />
 * 1、SSE 的本质是让服务器能够持续向客户端单向推送数据。它的工作流程非常纯粹：<br />
 * 客户端发起一个普通的 HTTP GET 请求，并在请求头中带上 Accept: text/event-stream，告诉服务器“我期望接收一个事件流”。<br />
 * 服务器保持这个连接不关闭，并设置 Content-Type: text/event-stream，然后不断地通过这个连接向客户端发送文本格式的事件数据。<br />
 * 2、标准规范的限制：浏览器原生的 EventSource API 被设计为只能发起 GET 请求。<br />
 * 它不支持自定义请求方法，也不支持在请求体中发送数据，所以标准的 SSE 规范本身是不允许使用 POST 的。<br /><br />
 *
 * 客户端连接例子，可以使用浏览器原生的“EventSource”API也可以使用“fetch”API自行构建SSE请求：<br />
 * 1、GET请求，为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：<br />
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
 * 处理完就成了这样：<br />
 * ```ts
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A
 * ```
 * <br />
 * 如果有“variables”参数，那也要序列化一下：<br />
 * ```ts
 * encodeURI(`{"id": "2024004-素夏"}`);
 * ```
 * <br />
 * 处理完就成了这样：<br />
 * ```ts
 * %7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
 * ```
 * <br /><br />
 * operationName: "Test004"
 * <br /><br />
 * 完整的GET请求URL：<br />
 * https://127.0.0.1:9200/graphql/stream?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate2:%20serverDate,%0A%7D%0A%0Aquery%20Test003(%20$id:%20String!%20)%7B%0A%20%20%20%20hello3:%20hello,%0A%20%20%20%20serverDate3:%20serverDate,%0A%0A%20%20%20%20getMessage3:%20getMessage(id:%20$id)%7B%0A%20%20%20%20%20id,%0A%20%20%20%20%20author,%0A%20%20%20%20%20content,%0A%20%20%20%20%7D,%0A%7D%0A%0Asubscription%20Test004%7B%0A%20%20greetings:%20greetings,%0A%7D%0A&operationName=Test004&variables=%7B%22id%22:%20%222024004-%E7%B4%A0%E5%A4%8F%22%7D
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
 * <br /><br />
 * 2、POST请求：<br />
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
 * graphql-sse实现的协议说明（“独立连接”模式、单连接模式）！！！<br />
 * 详细见：<br />
 * https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md#graphql-over-server-sent-events-protocol <br />
 * 基于服务器发送事件协议的 GraphQL<br />
 * 简介<br />
 * 我们生活在一个互联的世界中，对实时性的需求与日俱增。尤其是在这个世界上互联程度最高的“世界”——互联网中。谈到实时性，主要有两大技术：WebSockets 和服务器发送事件（SSE）。<br />
 * 出于从简单易用到广泛采用等诸多原因，在您的下一个实时驱动项目中使用服务器发送事件（简称 SSE）听起来颇具吸引力。然而，您很快会发现，在处理基于 HTTP/1 的服务器时，SSE 存在开放连接数上限的限制（详情见下文）。<br />
 * 本文旨在通过“单连接模式”突破 HTTP/1 的限制，并借助“独立连接模式”支持基于 HTTP/2+ 的服务器，同时采用统一的基于 SSE 的 GraphQL 传输协议。<br /><br />
 *
 * 例子，见：<br />
 * https://the-guild.dev/graphql/sse/guides/recipes#with-eventsource-distinct-connections-mode <br /><br />
 *
 * 2种模式下的“停止”逻辑<br />
 * 1、独立连接模式（你之前用的 POST 模式）<br />
 * 在这种模式下，不需要也不应该使用 DELETE 请求。停止一个订阅的方式非常简单：客户端直接关闭用于接收该订阅的 SSE 连接（即 fetch 的 ReadableStream）即可，服务器会感知到连接关闭并停止操作。<br />
 * 2、单连接模式（PUT + GET 模式）<br />
 * 这是 DELETE 请求发挥作用的场景。因为所有订阅共享一条 GET 建立的 SSE 连接，你不能通过关闭连接来停止某一个订阅。此时，必须通过发送一个 DELETE 请求来精确地“叫停”某个特定的操作。<br /><br />
 *
 * 2种模式的核心区别<br />
 * 1、独立连接模式（POST）：每个 GraphQL 订阅（Subscription）操作都会独立发起一个 POST 请求，并直接在这个请求的响应中接收 SSE 流。这种方式更适合 HTTP/2 环境，也是 graphql-sse 客户端的默认模式。<br />
 * 2、单连接模式（PUT + GET）：所有操作复用同一条 SSE 连接，通过 PUT 获取令牌来“预约”连接，以规避 HTTP/1 对并发连接数的限制。<br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {boolean} 一般返回的是一个boolean类型的值，当然也允许返回的值类型为Promise<boolean>。
 */
function Condition( request: Request ): boolean{
  // url.search，形如：?query={hello1:hello,serverDate1:serverDate,}&variables={}
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname );

  return (
    ( IsWSForRequest( request ) && ( ( ( arg: string[] ): string[] => {
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
    ] ) ).includes( pathName ) ) ||
    (
      IsGetForRequestAndNoWS( request ) &&
      (
        (
          ( ( arg: string[] ): string[] => {
            const result: string[] = [];

            serversURLPrefix.forEach( ( item001: string ): void => {
              result.push( ...arg.map( ( item002: string ): string => `${ item001 }${ item002 }` ) );
            } );

            return result;
          } )( [
            `${ myURLPathName }/schema.json`,
          ] )
        ).includes( pathName ) ||
        (
          ( ( ( arg: string[] ): string[] => {
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
          ] ) ).includes( pathName ) &&
          url.search.trim().startsWith( '?' ) &&
          url.searchParams.has( 'query' )
        )
      )
    ) ||
    ( [
      'put',
      'delete',
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
    ] ) ).includes( pathName ) )
  );
}

// 必须部署这个默认的导出值。
export default Condition;
