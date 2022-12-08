/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/Connect.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * 连接MongoDB数据库。
 */

'use strict';

import {
  MongoClient,
  Database,

  // @ts-ignore
} from 'third_party_modules/deno_mongo@0.31.1/mod.ts';

// @ts-ignore
import config from './Config.esm.mts';

const mongoDBClient: MongoClient = new MongoClient();

const mongoDB: Database = await mongoDBClient.connect( config );

export {
  mongoDBClient,
  mongoDB,
};

export default {
  mongoDBClient,
  mongoDB,
};
