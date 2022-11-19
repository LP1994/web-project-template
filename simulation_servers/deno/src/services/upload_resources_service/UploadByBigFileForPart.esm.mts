/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByBigFileForPart.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 19:07:04 星期五
 */

'use strict';

import {
  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

// 大文件上传之分块上传：前端分块上传，服务端接收后将其存储在临时文件夹中，待接受完毕后，再合并它们，?uploadType=bigFile&type=part

// @ts-ignore
function UploadByBigFileForPart( request: Request ): Response{

  return new Response( JSON.stringify( {
    data: {
      success: true,
      message: `大文件上传之分块上传的功能还没完成。`,
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

export default UploadByBigFileForPart;
