/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:42 星期四
 */

'use strict';

import {
  type TypeResponse001,

  // uploadDir,

  httpHeaders,
  // @ts-ignore
} from '../../configures/GlobalParameters.esm.mts';

// @ts-ignore
function ResponseHandle( request: Request ): TypeResponse001{
  return new Response( JSON.stringify( {
    data: {
      message: `上传成功。`,
    },
    message: {
      status: 200,
      text: 'OK',
    },
  } ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

export default ResponseHandle;
