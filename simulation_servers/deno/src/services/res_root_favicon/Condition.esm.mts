/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/res_root_favicon/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:47 星期三
 */

/**
 * 用于响应HTTP服务的根图片GET请求，如：
 * https://127.0.0.1:9200/favicon.ico
 * https://127.0.0.1:9200/favicon.png
 * https://127.0.0.1:9200/apple-touch-icon.png
 * https://127.0.0.1:9200/apple-touch-icon-precomposed.png
 * https://127.0.0.1:9200/apple-touch-icon-120x120.png
 * https://127.0.0.1:9200/apple-touch-icon-120x120-precomposed.png
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteMapConfig”中的配置。
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

/**
 * 符合处理条件的请求URL核心标头。<br /><br />
 *
 * 具体请求URL如：<br />
 * https://127.0.0.1:9200/favicon.ico <br />
 * https://127.0.0.1:9200/favicon.png <br />
 * https://127.0.0.1:9200/apple-touch-icon.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-precomposed.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-120x120.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-120x120-precomposed.png <br />
 *
 * @type {string}
 */
export const myURLPathName: string = `/`;

/**
 * 验证客户端的请求是否满足该条件函数，满足的话就会启用并执行“ResponseHandle.esm.mts”以响应请求。<br />
 * 返回值为true、Promise<true>时，表示满足条件。<br />
 * 返回值为false、Promise<false>时，表示不满足条件。<br /><br />
 *
 * 具体请求URL如：<br />
 * https://127.0.0.1:9200/favicon.ico <br />
 * https://127.0.0.1:9200/favicon.png <br />
 * https://127.0.0.1:9200/apple-touch-icon.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-precomposed.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-120x120.png <br />
 * https://127.0.0.1:9200/apple-touch-icon-120x120-precomposed.png <br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {boolean} 一般返回的是一个boolean类型的值，当然也允许返回的值类型为Promise<boolean>。
 */
function Condition( request: Request ): boolean{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname ),
    method: string = request.method.toLowerCase().trim();

  return [
    `${ myURLPathName }favicon.ico`,
    `${ myURLPathName }favicon.png`,
    `${ myURLPathName }apple-touch-icon.png`,
    `${ myURLPathName }apple-touch-icon-precomposed.png`,
    `${ myURLPathName }apple-touch-icon-120x120.png`,
    `${ myURLPathName }apple-touch-icon-120x120-precomposed.png`,
  ].includes( pathName ) && method === 'get';
}

// 必须部署这个默认的导出值。
export default Condition;
