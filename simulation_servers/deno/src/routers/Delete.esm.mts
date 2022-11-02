/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Delete.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:14 星期二
 */

'use strict';

import {
  type TypeResponse001,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

/**
 * 一定得保证该函数返回的值类型只能是：Response或Promise<Response>。<br />
 *
 * @param {Request} request
 *
 * @returns {Promise<Response>}
 */
function Delete( request: Request ): TypeResponse001{
  return new InterceptorError( request ).res404();
}

export {
  Delete,
};

export default Delete;
