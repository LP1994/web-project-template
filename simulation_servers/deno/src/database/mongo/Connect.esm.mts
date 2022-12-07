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

  // @ts-ignore
} from 'npm:mongodb';

// @ts-ignore
import config from './Config.esm.mts';

// @ts-ignore
const mongoDBClient: MongoClient = new MongoClient( `mongodb://localhost:27777`, config );

export {
  mongoDBClient,
};

export default {
  mongoDBClient,
};
