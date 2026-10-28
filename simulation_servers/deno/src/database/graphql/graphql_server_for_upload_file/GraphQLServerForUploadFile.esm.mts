/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForUploadFile.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能。
 */

'use strict';

/**
 * 一个文件对象，该对象里有关于文件的元数据和文件存储的磁盘路径、文件大小等等信息。<br />
 * 例子：<br />
 * ```ts
 * {
 *   filename: 'test.png',
 *   mimetype: 'image/png',
 *   encoding: 'binary',
 *   size: 102400,
 *   filepath: 'G:/WebStormWS/7788/1.png',
 * }
 * ```
 */
interface T_GraphQLUploadFile {
  filename: string;
  mimetype: string;
  encoding: '7bit' | '8bit' | 'binary';
  size: number;
  filepath: string;
}

export {
  type T_GraphQLUploadFile,
};
