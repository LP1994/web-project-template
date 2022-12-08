/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/MongoDBConnect.esm.mts
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
import config from './MongoDBConfig.esm.mts';

export type TypeMongoDBConnect = {
  mongoDBClient: MongoClient;

  mongoDB: Database;
};

let mongoDBConnectForSingleton: TypeMongoDBConnect | null;

async function MongoDBConnect(): Promise<TypeMongoDBConnect>{
  const mongoDBClient: MongoClient = new MongoClient();

  const mongoDB: Database = await mongoDBClient.connect( config );

  return {
    mongoDBClient,
    mongoDB,
  };
}

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
