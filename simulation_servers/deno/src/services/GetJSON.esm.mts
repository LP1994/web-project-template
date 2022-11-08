/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/GetJSON.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:30:07 星期二
 */

'use strict';

import {
  type TypeResponse001,

  staticDir,

  httpHeaders,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  mime,
  // @ts-ignore
} from 'public/PublicTools.esm.mts';

// @ts-ignore
function Handle( request: Request ): TypeResponse001{
  // @ts-ignore
  let filePath: URL = new URL( import.meta.resolve( `${ staticDir }/json/JSON001.json` ) );

  // @ts-ignore
  return new Response( Deno.readTextFileSync( filePath ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': `${ mime.getType( filePath.href ) }; charset=utf-8`,
    },
  } );
}

export default Handle;
