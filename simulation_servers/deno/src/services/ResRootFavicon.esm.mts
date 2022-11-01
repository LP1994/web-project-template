/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/ResRootFavicon.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 20:28:02 星期二
 */

'use strict';

import {
  httpHeaders,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

import {
  mime,
  // @ts-ignore
} from '../public/PublicTools.esm.mts';

type TypeResponse001 = Response | Promise<Response>;

// @ts-ignore
function Handle( request: Request ): TypeResponse001{
  // @ts-ignore
  let filePath: URL = new URL( import.meta.resolve( '../../static/ico/favicon.ico' ) );

  // @ts-ignore
  return new Response( Deno.readFileSync( filePath ), {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': mime.getType( filePath.href ),
    },
  } );
}

export default Handle;
