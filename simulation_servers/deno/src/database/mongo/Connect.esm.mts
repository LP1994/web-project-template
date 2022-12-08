/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/Connect.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * 连接MongoDB数据库，并返回一个数据库连接实例MongoClient、数据库实例Database。
 */

'use strict';

import {
  Collection,
  FindCursor,

  MongoClient,
  Database,

  // @ts-ignore
} from 'third_party_modules/deno_mongo@0.31.1/mod.ts';

// @ts-ignore
import config from './Config.esm.mts';

const mongoDBClient: MongoClient = new MongoClient();

const mongoDB: Database = await mongoDBClient.connect( config );

export {
  Collection,
  FindCursor,

  mongoDBClient,
  mongoDB,
};

export default {
  Collection,
  FindCursor,

  mongoDBClient,
  mongoDB,
};
