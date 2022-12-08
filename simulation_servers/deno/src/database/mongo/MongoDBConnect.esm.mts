/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/MongoDBConnect.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * 开始连接MongoDB数据库，并返回：数据库连接实例，用于关闭、切换数据库等等操作、初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定）。
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
import config from './MongoDBConfig.esm.mts';

export type TypeMongoDBConnect = {
  /**
   * 数据库连接实例，用于关闭、切换数据库等等操作。
   */
  mongoDBClient: MongoClient;

  /**
   * 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定）。
   */
  mongoDB: Database;
};

let mongoDBConnectForSingleton: TypeMongoDBConnect | null;

/**
 * 开始连接MongoDB数据库，并返回一个对象：{ mongoDBClient: 数据库连接实例，用于关闭、切换数据库等等操作, mongoDB: 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定） }。
 *
 * @returns {Promise<TypeMongoDBConnect>} 其中的TypeMongoDBConnect是一个对象：{ mongoDBClient: 数据库连接实例，用于关闭、切换数据库等等操作, mongoDB: 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定） }。
 */
async function MongoDBConnect(): Promise<TypeMongoDBConnect>{
  const mongoDBClient: MongoClient = new MongoClient();

  const mongoDB: Database = await mongoDBClient.connect( config );

  return {
    mongoDBClient,
    mongoDB,
  };
}

/**
 * 单例的，开始连接MongoDB数据库，并返回一个对象：{ mongoDBClient: 数据库连接实例，用于关闭、切换数据库等等操作, mongoDB: 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定） }。
 *
 * @returns {Promise<TypeMongoDBConnect>} 其中的TypeMongoDBConnect是一个对象：{ mongoDBClient: 数据库连接实例，用于关闭、切换数据库等等操作, mongoDB: 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定） }。
 */
async function MongoDBConnectForSingleton(): Promise<TypeMongoDBConnect>{
  if( !mongoDBConnectForSingleton ){
    const mongoDBClient: MongoClient = new MongoClient( ( methodName: string ): void => {
      if( methodName === 'close' ){
        mongoDBConnectForSingleton = null;
      }
    } );

    const mongoDB: Database = await mongoDBClient.connect( config );

    mongoDBConnectForSingleton = {
      mongoDBClient,
      mongoDB,
    };
  }

  return mongoDBConnectForSingleton as TypeMongoDBConnect;
}

export {
  Collection,
  FindCursor,

  MongoClient,
  Database,

  MongoDBConnect,
  MongoDBConnectForSingleton,
};

export default {
  Collection,
  FindCursor,

  MongoClient,
  Database,

  MongoDBConnect,
  MongoDBConnectForSingleton,
};
