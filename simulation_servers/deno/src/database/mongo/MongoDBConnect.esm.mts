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

/*import {
 MongoClient,
 // Collection,
 // Database,

 // ObjectId,

 // @ts-ignore
 } from 'DenoX/mongo/mod.ts';*/

/*export {
 // Collection,
 // Database,

 // ObjectId,
 };*/

// @ts-ignore
import * as DenoMongoDB from 'DenoX/mongo/mod.ts';

const {
  MongoClient,
  Database,
  Collection,
  GridFSBucket,

  Binary,
  BSONRegExp,
  BSONSymbol,
  Code,
  DBRef,
  Decimal128,
  Double,
  Int32,
  Long,
  MaxKey,
  MinKey,
  ObjectId,
  Timestamp,
  UUID,

  ReadPreference,

  Bson,
} = DenoMongoDB;

console.dir( MongoClient );
console.dir( Database );
console.dir( Collection );
console.dir( GridFSBucket );

console.dir( Binary );
console.dir( BSONRegExp );
console.dir( BSONSymbol );
console.dir( Code );
console.dir( DBRef );
console.dir( Decimal128 );
console.dir( Double );
console.dir( Int32 );
console.dir( Long );
console.dir( MaxKey );
console.dir( MinKey );
console.dir( ObjectId );
console.dir( Timestamp );
console.dir( UUID );

console.dir( ReadPreference );

console.dir( Bson );

import config from './MongoDBConfig.esm.mts';

export type TypeMongoDBConnect = {
  /**
   * 数据库连接实例，用于关闭、切换数据库等等操作。
   */
  mongoDBClient: any;

  /**
   * 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定）。
   */
  mongoDB: any;
};

let mongoDBConnectForSingleton: TypeMongoDBConnect | null;

/**
 * 开始连接MongoDB数据库，并返回一个对象：{ mongoDBClient: 数据库连接实例，用于关闭、切换数据库等等操作, mongoDB: 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定） }。
 *
 * @returns {Promise<TypeMongoDBConnect>} 其中的TypeMongoDBConnect是一个对象：{ mongoDBClient: 数据库连接实例，用于关闭、切换数据库等等操作, mongoDB: 初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定） }。
 */
async function MongoDBConnect(): Promise<TypeMongoDBConnect>{
  const mongoDBClient: any = new Object();

  const mongoDB: any = await mongoDBClient.connect( config );

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
    const mongoDBClient: any = new Object( ( methodName: string ): void => {
      if( methodName === 'close' ){
        mongoDBConnectForSingleton = null;
      }
    } );

    const mongoDB: any = await mongoDBClient.connect( config );

    mongoDBConnectForSingleton = {
      mongoDBClient,
      mongoDB,
    };
  }

  return mongoDBConnectForSingleton as TypeMongoDBConnect;
}

export {
  MongoDBConnect,
  MongoDBConnectForSingleton,
};

export default {
  MongoDBConnect,
  MongoDBConnectForSingleton,
};
