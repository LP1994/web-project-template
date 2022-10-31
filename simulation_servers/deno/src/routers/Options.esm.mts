/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Options.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:01 星期二
 */

'use strict';

type ResponseType001 = Response | Promise<Response>;

// @ts-ignore
function Options( request: Request ): ResponseType001{
  return new Response( null, {
    status: 200,
    statusText: 'OK',
  } );
}

export {
  Options,
};

export default Options;
