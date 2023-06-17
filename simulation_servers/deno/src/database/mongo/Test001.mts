/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/Test001.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-06-16 07:49:37 星期五
 */

// deno run -A --watch --config=../../../deno.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 --reload ./Test001.mts --color=16m

'use strict';

import {
  type Collection,
  type Connection,
} from 'npm:mongoose';

import {
  MongooseConnect,
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

let MongooseClient: Connection;

async function run(): Promise<void>{
  try{
    MongooseClient = MongooseConnect().useDb( 'local' );

    console.dir( MongooseClient.name );

    const startup_log_collection: Collection<StartupLogCollectionSchema> = MongooseClient.collection<StartupLogCollectionSchema>( 'startup_log' );

    const startup_log: Array<StartupLogCollectionSchema> = await ( await startup_log_collection.find<StartupLogCollectionSchema>( {
      hostname: 'LPQAQ',
    } ) ).toArray();

    console.dir( startup_log );
  }
  catch( e: unknown ){
    console.error( e );
  }
  finally{
    await MongooseClient.close( true );
  }
}

await run();
