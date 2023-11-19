/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/simulation_servers_deno/upload_file_sri/Model.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-09 04:15:34 星期五
 */

/**
 * 针对集合“upload_file_sri”的Model。
 */

'use strict';

import {
  type Connection,
  type HydratedDocument,

  Model,
} from 'npm:mongoose';

import {
  MongooseConnect,
} from 'mongo/MongooseConnect.esm.mts';

import {
  type IFileSRI,

  collectionName,
  FileSRISchema,
} from './Schema.esm.mts';

export type TFileSRIInstance = HydratedDocument<IFileSRI>;
export type TFileSRIModel = Model<IFileSRI, {}, {}, {}, TFileSRIInstance>;

/**
 * @type {string} 要连接到的数据库名。
 */
const dbName: string = 'simulation_servers_deno',
  /**
   * @type {string} 连接数据库的字符串uri。
   */
  uri: string = `mongodb://127.0.0.1:27777`,
  client: Connection = MongooseConnect( dbName, uri );

const FileSRI: TFileSRIModel = client.model<
  IFileSRI
>(
  collectionName,
  FileSRISchema,
  collectionName
);

export {
  FileSRI,
};

export default {
  FileSRI,
};
