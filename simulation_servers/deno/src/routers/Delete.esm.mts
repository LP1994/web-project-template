/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Delete.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:14 星期二
 */

'use strict';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

type TypeResponse001 = Response | Promise<Response>;

function Delete( request: Request ): TypeResponse001{
  return new InterceptorError( request ).res404();
}

export {
  Delete,
};

export default Delete;
