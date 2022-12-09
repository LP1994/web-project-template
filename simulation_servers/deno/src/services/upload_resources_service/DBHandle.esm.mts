/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/DBHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-09 04:15:34 星期五
 */

/**
 * 数据库相关的操作。
 */

'use strict';

import {
  type FileSRICollectionSchema,

  InsertOne,
  DeleteOne,
  UpdateOne,
  QueryOne,

  // @ts-ignore
} from 'mongo/db/simulation_servers_deno/collections/upload_file_sri.esm.mts';

export type{
  FileSRICollectionSchema,
};

export {
  InsertOne,
  DeleteOne,
  UpdateOne,
  QueryOne,
};

export default {
  InsertOne,
  DeleteOne,
  UpdateOne,
  QueryOne,
};
