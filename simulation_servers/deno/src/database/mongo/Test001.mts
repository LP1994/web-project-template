/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/Test001.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-06-16 07:49:37 星期五
 */

'use strict';

import {
  type Collection,
  type Connection,
} from 'npm:mongoose';

import {
  type MyMongooseConnection,
  type TypeMongooseConnectForSingleton,

  MongooseConnectForSingleton,
} from './MongooseConnect.esm.mts';

interface StartupLogCollectionSchema {
  _id: string;

  hostname: string;

  startTime: Date;

  startTimeLocal: string;

  pid: number;

  cmdLine: object;

  buildinfo: object;
}

let myMongooseConnection: MyMongooseConnection,
  MongooseClient: Connection;

async function run(): Promise<void>{
  try{
    const mongooseConnectForSingleton: TypeMongooseConnectForSingleton = await MongooseConnectForSingleton();

    myMongooseConnection = mongooseConnectForSingleton.MyMongooseConnection;
    MongooseClient = mongooseConnectForSingleton.MongooseClient;

    MongooseClient = MongooseClient.useDb( 'local' );

    console.log( `\n\n${ MongooseClient.db.databaseName }\n\n` );

    const startup_log_collection: Collection<StartupLogCollectionSchema> = MongooseClient.collection<StartupLogCollectionSchema>( 'startup_log' );

    const startup_log: Array<StartupLogCollectionSchema> = await ( await startup_log_collection.find<StartupLogCollectionSchema>( {
      hostname: 'LPQAQ',
    } ) ).toArray();

    console.dir( startup_log );

    await myMongooseConnection.close( true );

    const startup_log_collection001: Collection<StartupLogCollectionSchema> = MongooseClient.collection<StartupLogCollectionSchema>( 'startup_log' );

    const startup_log001: Array<StartupLogCollectionSchema> = await ( await startup_log_collection001.find<StartupLogCollectionSchema>( {
      hostname: 'LPQAQ',
    } ) ).toArray();

    console.dir( startup_log001 );
  }
  catch( e: unknown ){
    console.error( e );
  }
  finally{
    await myMongooseConnection.close( true );
  }
}

await run();
