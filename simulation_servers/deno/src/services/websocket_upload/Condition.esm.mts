/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/websocket_upload/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:26 星期四
 */

/**
 * 用于响应WebSocket服务的上传操作，支持的请求URL有：
 * wss://127.0.0.1:9200/upload、wss://127.0.0.1:9200/upload/
 * wss://127.0.0.1:9200/subscriptions/upload、wss://127.0.0.1:9200/subscriptions/upload/
 * wss://127.0.0.1:9200/simulation_servers_deno/upload、wss://127.0.0.1:9200/simulation_servers_deno/upload/
 * wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/upload、wss://127.0.0.1:9200/simulation_servers_deno/subscriptions/upload/
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“websocketForRouteHandle”中的配置。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

/**
 * 符合处理条件的请求URL核心标头，如：<br />
 * wss://localhost:9200/upload、wss://localhost:9200/upload/、
 * wss://localhost:9200/subscriptions/upload、wss://localhost:9200/subscriptions/upload/、
 * wss://localhost:9200/simulation_servers_deno/upload、wss://localhost:9200/simulation_servers_deno/upload/、
 * wss://localhost:9200/simulation_servers_deno/subscriptions/upload、wss://localhost:9200/simulation_servers_deno/subscriptions/upload/
 *
 * @type {string}
 */
export const myURLPathName: string = `/upload`;

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
    pathName: string = decodeURI( url.pathname );

  return [
    myURLPathName,
    `${ myURLPathName }/`,

    `/subscriptions${ myURLPathName }`,
    `/subscriptions${ myURLPathName }/`,

    `/simulation_servers_deno${ myURLPathName }`,
    `/simulation_servers_deno${ myURLPathName }/`,

    `/simulation_servers_deno/subscriptions${ myURLPathName }`,
    `/simulation_servers_deno/subscriptions${ myURLPathName }/`,
  ].includes( pathName );
}

// 必须部署这个默认的导出值。
export default Condition;
