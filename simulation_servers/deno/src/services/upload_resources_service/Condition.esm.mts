/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:26 星期四
 */

/**
 * 测试文件上传时，不可尽信“postman”这个工具，不知道是什么原因有时测试上传会不成功，而服务器又没出现报错信息！
 * 用浏览器测，就没出现“postman”的上述问题。
 */

/**
 * 用于响应HTTP服务的上传操作（支持POST请求、PUT请求），支持的请求URL有：
 * https://127.0.0.1:9200/simulation_servers_deno/upload、https://127.0.0.1:9200/simulation_servers_deno/upload/
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByPostForRouteHandle”、“methodByPutForRouteHandle”中的配置。
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

/**
 * 本文件上传功能，提供了5种类型的上传方式，除大文件上传没有文件大小的限制外，其他的文件上传方式都会限制上传的文件不能大于1GB（该阈值可由下面的常量maxFileSize控制调节），详细使用说明见：
 * UploadByBigFile.esm.mts（单个大文件上传）、
 * UploadByBigFileForPart.esm.mts（单个大文件的分块上传）、
 * UploadByBinary.esm.mts（单个二进制文件流上传）、
 * UploadByMultiple.esm.mts（多文件批量上传）、
 * UploadBySingle.esm.mts（单文件上传）
 */

'use strict';

// 符合处理条件的请求URL核心标头，如：https://localhost:9200/simulation_servers_deno/upload、https://localhost:9200/simulation_servers_deno/upload/
export const myURLPathName: string = `/simulation_servers_deno/upload`;

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
  ].includes( pathName );
}

// 必须部署这个默认的导出值。
export default Condition;
