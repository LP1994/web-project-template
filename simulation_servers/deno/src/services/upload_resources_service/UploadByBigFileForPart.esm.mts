/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByBigFileForPart.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 19:07:04 星期五
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

/**
 * 单个大文件的分块上传（支持POST请求、PUT请求）。
 * 客户端将大文件分成多个小块，一个一个小块上传，服务端接收后将这些小块存储在临时文件夹中，待全部接受完毕后，再合并它们，再删除临时文件夹。
 *
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&type=part&fileName=001.zip&isForcedWrite=false
 * 查询参数“isForcedWrite”是可选的，“fileName”也是可选的，但是最好带。
 * 单个大文件的分块上传必须在URL上包含查询参数“type”，其值必须是“part”。
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&type=part&fileName=001.zip&isForcedWrite=true
 */

'use strict';

import {
  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

/**
 * 单个大文件的分块上传（支持POST请求、PUT请求）。<br />
 * 客户端将大文件分成多个小块，一个一个小块上传，服务端接收后将这些小块存储在临时文件夹中，待全部接受完毕后，再合并它们，再删除临时文件夹。<br />
 *
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&type=part&fileName=001.zip&isForcedWrite=false<br />
 * 查询参数“isForcedWrite”是可选的，“fileName”也是可选的，但是最好带。<br />
 * 单个大文件的分块上传必须在URL上包含查询参数“type”，其值必须是“part”。<br />
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。<br />
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&type=part&fileName=001.zip&isForcedWrite=true<br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Response} 返回值类型为Response。
 */
function UploadByBigFileForPart(
  // @ts-ignore
  request: Request
): Response{
  return new Response( JSON.stringify( {
    data: {
      success: true,
      message: `大文件上传之分块上传的功能还未实现。`,
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

// 必须部署这个默认的导出值。
export default UploadByBigFileForPart;
