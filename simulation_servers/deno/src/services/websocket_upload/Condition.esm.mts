/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/websocket_upload/Condition.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:26 星期四
 */

'use strict';

/**
 * 发起的请求URL如：
 * wss://localhost:9200/upload、wss://localhost:9200/upload/、
 * wss://localhost:9200/subscriptions/upload、wss://localhost:9200/subscriptions/upload/、
 * wss://localhost:9200/simulation_servers_deno/upload、wss://localhost:9200/simulation_servers_deno/upload/、
 * wss://localhost:9200/simulation_servers_deno/subscriptions/upload、wss://localhost:9200/simulation_servers_deno/subscriptions/upload/
 *
 * @type {string}
 */
export const myURLPathName: string = `/upload`;

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

    `/subscriptions${ myURLPathName }`,
    `/subscriptions${ myURLPathName }/`,

    `/simulation_servers_deno${ myURLPathName }`,
    `/simulation_servers_deno${ myURLPathName }/`,

    `/simulation_servers_deno/subscriptions${ myURLPathName }`,
    `/simulation_servers_deno/subscriptions${ myURLPathName }/`,
  ].includes( pathName );
}

export default Condition;
