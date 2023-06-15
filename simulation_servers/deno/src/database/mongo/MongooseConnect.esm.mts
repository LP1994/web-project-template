/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/MongooseConnect.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * 开始使用“mongoose”连接MongoDB数据库，并返回：数据库连接实例，用于关闭、切换数据库等等操作、初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定）。
 */

'use strict';

import {
  type Connection,

  Mongoose,
} from 'npm:mongoose';

import {
  config,
  dbName,
  uri,
} from './MongooseConfig.esm.mts';

export type TypeMongooseConnect = {
  /**
   * 数据库连接实例，用于关闭、切换数据库等等操作。
   */
  MongooseClient: Connection;
};

let mongooseConnectForSingleton: TypeMongooseConnect | null;

/**
 * 开始使用“mongoose”连接MongoDB数据库，并返回一个对象：{ MongooseClient: 数据库连接实例，用于关闭、切换数据库等等操作 }。
 *
 * @returns {TypeMongooseConnect} 其中的TypeMongooseConnect是一个对象：{ MongooseClient: 数据库连接实例，用于关闭、切换数据库等等操作 }。
 */
function MongooseConnect(): TypeMongooseConnect{
  const mongoose: Mongoose = new Mongoose(),
    MongooseClient: Connection = mongoose.createConnection( uri, config ).useDb( dbName );

  return {
    MongooseClient,
  };
}

/**
 * 单例的，开始使用“mongoose”连接MongoDB数据库，并返回一个对象：{ MongooseClient: 数据库连接实例，用于关闭、切换数据库等等操作 }。
 *
 * @returns {TypeMongooseConnect} 其中的TypeMongooseConnect是一个对象：{ MongooseClient: 数据库连接实例，用于关闭、切换数据库等等操作 }。
 */
function MongooseConnectForSingleton(): TypeMongooseConnect{
  if( !mongooseConnectForSingleton ){
    const mongoose: Mongoose = new Mongoose(),
      MongooseClient: Connection = mongoose.createConnection( uri, config ).useDb( dbName );

    /*
     const mongoDBClient: MongoClient = new MongoClient( ( methodName: string ): void => {
     if( methodName === 'close' ){
     mongoDBConnectForSingleton = null;
     }
     } );
     */

    mongooseConnectForSingleton = {
      MongooseClient,
    };
  }

  return mongooseConnectForSingleton as TypeMongooseConnect;
}

export {
  MongooseConnect,
  MongooseConnectForSingleton,
};

export default {
  MongooseConnect,
  MongooseConnectForSingleton,
};
