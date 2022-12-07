/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/test/Test001.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-25 15:34:43 星期五
 */

'use strict';

import {
  mongoDBClient,
  mongoDB,

  // @ts-ignore
} from 'mongo/Connect.esm.mts';

interface StartupLogSchema {
  _id: string;

  hostname: string;

  startTimeLocal: string;
}

console.dir( mongoDBClient );
console.dir( mongoDB );

const startupLog = mongoDB.collection<StartupLogSchema>( 'startup_log' );

const docment: unknown = await startupLog.findOne( {
  _id: `LPQAQ-1670364636573`,
} );

console.dir( docment );
