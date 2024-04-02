/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:47 星期三
 */

/**
 * 该文件夹是用于响应“GraphQL请求”（POST请求、GET请求、Websocket请求），如：
 * POST（服务端使用graphql-http实现，graphql-http有对应的客户端实现）：https://127.0.0.1:9200/graphql
 *
 * GET（服务端使用graphql-http实现，但是GET请求不支持“mutation”操作，graphql-http有对应的客户端实现）：https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate1:%20serverDate,%0A%7D&variables={}&operationName=Test001
 * 例子：
 * 为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：
 * encodeURI(`query Test001{
 *     hello1: hello,
 * }
 *
 * query Test002{
 *     serverDate1: serverDate,
 * }`);
 * 处理完就成了这样：
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate1:%20serverDate,%0A%7D
 *
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "application/json");
 * myHeaders.append("Cache-Control", "no-store");
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
 * fetch("https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate1:%20serverDate,%0A%7D&variables={}&operationName=Test001", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 *
 * 成功！完美！
 *
 * Websocket（服务端使用graphql-ws实现，graphql-ws有对应的客户端实现）：
 * wss://127.0.0.1:9200/graphql
 * wss://127.0.0.1:4000/graphql/
 * wss://127.0.0.1:9200/graphql/subscriptions
 * wss://127.0.0.1:9200/graphql/subscriptions/
 *
 * SSE（服务端使用graphql-sse实现，该工具支持：PUT、DELETE、POST、GET这4个类型的请求，graphql-sse有对应的客户端实现）：
 * https://127.0.0.1:9200/graphql/stream
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
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_192_168_2_7_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_192_168_2_7_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

// 符合处理条件的请求URL核心标头，如：https://127.0.0.1:9200/graphql
export const myURLPathName: string = `/graphql`;

/**
 * 验证客户端的请求是否满足该条件函数，满足的话就会启用并执行“ResponseHandle.esm.mts”以响应请求。<br />
 * 返回值为true、Promise<true>时，表示满足条件。<br />
 * 返回值为false、Promise<false>时，表示不满足条件。<br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {boolean} 一般返回的是一个boolean类型的值，当然也允许返回的值类型为Promise<boolean>。
 */
function Condition( request: Request ): boolean{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname ),
    upgrade: string = ( request.headers.get( 'upgrade' ) ?? '' ).trim().toLowerCase(),
    // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
    connection: string = ( request.headers.get( 'connection' ) ?? '' ).trim().toLowerCase();

  if( upgrade === 'websocket' && ( connection === 'upgrade' || connection === 'keep-alive, Upgrade'.toLowerCase() || connection === 'keep-alive,Upgrade'.toLowerCase() ) && [
    myURLPathName,
    `${ myURLPathName }/`,

    `${ myURLPathName }/subscriptions`,
    `${ myURLPathName }/subscriptions/`,
  ].includes( pathName ) ){
    return true;
  }
  else if( request.method.toLowerCase() === 'get' ){
    // 形如：?query={hello1:hello,serverDate1:serverDate,}&variables={}
    const search: string = url.search,
      searchParams: URLSearchParams = url.searchParams;

    if( ( pathName === myURLPathName || pathName === String( myURLPathName + '/' ) ) && search.trim().startsWith( '?' ) && searchParams.has( 'query' ) ){
      return true;
    }
    else if( pathName === '/graphql/stream' || pathName === '/graphql/stream/' ){
      return true;
    }
    else{
      return false;
    }
  }
  else if( request.method.toLowerCase() === 'post' ){
    if( pathName === myURLPathName || pathName === String( myURLPathName + '/' ) ){
      return true;
    }
    else if( pathName === '/graphql/stream' || pathName === '/graphql/stream/' ){
      return true;
    }
    else{
      return false;
    }
  }
  else if( request.method.toLowerCase() === 'put' ){
    if( pathName === '/graphql/stream' || pathName === '/graphql/stream/' ){
      return true;
    }
    else{
      return false;
    }
  }
  else if( request.method.toLowerCase() === 'delete' ){
    if( pathName === '/graphql/stream' || pathName === '/graphql/stream/' ){
      return true;
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
}

// 必须部署这个默认的导出值。
export default Condition;
