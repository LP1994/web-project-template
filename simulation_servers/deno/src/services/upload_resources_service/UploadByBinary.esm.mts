/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByBinary.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:16 星期五
 */

'use strict';

import {
  type TypeResponse001,

  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

// @ts-ignore
function UploadByBinary( request: Request ): TypeResponse001{
  return new Response( JSON.stringify( {
    data: {
      success: true,
      message: `二进制文件上传成功。`,
    },
    messageStatus: resMessageStatus[ 200 ],
  } ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

export default UploadByBinary;
