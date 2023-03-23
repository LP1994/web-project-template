/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/test/npm_mongodb.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-03-22 20:40:24 星期三
 */

'use strict';

import {
  type MongoClientOptions,

  MongoClient,

  // @ts-ignore
} from 'npm:mongodb';

const client: MongoClient = new MongoClient( 'mongodb://localhost:27777', {
  appName: 'npm_mongodb_driver',
} as MongoClientOptions );

async function run(){
  try{
    const database = client.db( 'local' );

    const movies = database.collection( 'startup_log' );

    const movie = await movies.find( {
      hostname: 'LPQAQ',
    } ).toArray();

    console.dir( movie );
  }
  finally{
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch( console.error );
