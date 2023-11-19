/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/simulation_servers_deno/upload_file_sri/UploadFileSRI.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-07-02 23:17:54 星期日
 */

'use strict';

import {
  FileSRI,
} from './Model.esm.mts';

let FileSRIQuantity: number = ( await FileSRI.find() ).length;

console.log( `\n\n\nFileSRIQuantity--->${ FileSRIQuantity }\n\n\n` );
