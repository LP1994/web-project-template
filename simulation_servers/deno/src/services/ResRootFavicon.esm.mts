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
  type TypeResponse001,

  staticDir,

  httpHeaders,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

import {
  mime,
  // @ts-ignore
} from '../public/PublicTools.esm.mts';

// @ts-ignore
function Handle( request: Request ): TypeResponse001{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  let filePath: URL;

  switch( pathName ){
  case '/favicon.ico':
    // @ts-ignore
    filePath = new URL( import.meta.resolve( `${ staticDir }/ico/favicon.ico` ) );

    break;
  case '/favicon.png':
    // @ts-ignore
    filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

    break;
  case '/apple-touch-icon.png':
    // @ts-ignore
    filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

    break;
  case '/apple-touch-icon-precomposed.png':
    // @ts-ignore
    filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

    break;
  case '/apple-touch-icon-120x120.png':
    // @ts-ignore
    filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

    break;
  case '/apple-touch-icon-120x120-precomposed.png':
    // @ts-ignore
    filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

    break;
  default:
    // @ts-ignore
    filePath = new URL( import.meta.resolve( `${ staticDir }/ico/uncompressed/ico_120_120.png` ) );

    break;
  }

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
