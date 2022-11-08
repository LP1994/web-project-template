/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:26 星期四
 */

'use strict';

// 发起的请求URL如：https://localhost:9200/simulation_servers_deno/upload、https://localhost:9200/simulation_servers_deno/upload/
export const myURLPathName: string = `/simulation_servers_deno/upload`;

/**
 * 一定得保证该函数返回的值类型只能是：boolean。<br />
 *
 * @param {Request} request
 *
 * @returns {boolean}
 */
function Condition( request: Request ): boolean{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname );

  return [
    myURLPathName,
    `${ myURLPathName }/`,
  ].includes( pathName );
}

export default Condition;
