/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/static_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  type TypeResponse001,

  // staticDir,
  // @ts-ignore
} from '../../configures/GlobalParameters.esm.mts';

// @ts-ignore
import InterceptorError from '../../public/InterceptorError.esm.mts';

function ResponseHandle( request: Request ): TypeResponse001{
  return new InterceptorError( request ).res404();
}

export default ResponseHandle;
