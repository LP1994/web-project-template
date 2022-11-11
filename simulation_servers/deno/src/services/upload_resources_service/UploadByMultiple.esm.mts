/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByMultiple.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:31 星期五
 */

'use strict';

import {
  type TypeResponse001,

  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

// @ts-ignore
function UploadByMultiple( request: Request ): TypeResponse001{
  return new Response( JSON.stringify( {
    data: {
      message: `多文件上传成功。`,
    },
    message: resMessageStatus[ 200 ],
  } ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

export default UploadByMultiple;
