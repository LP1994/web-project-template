/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Put.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:15:45 星期二
 */

'use strict';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

type ResponseType001 = Response | Promise<Response>;

function Put( request: Request ): ResponseType001{
  return new InterceptorError( request ).res404();
}

export {
  Put,
};

export default Put;
