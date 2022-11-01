/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Options.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:16:01 星期二
 */

'use strict';

import {
  type TypeResponse001,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

// @ts-ignore
function Options( request: Request ): TypeResponse001{
  return new Response( null, {
    status: 200,
    statusText: 'OK',
  } );
}

export {
  Options,
};

export default Options;
