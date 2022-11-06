/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/App.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  serversDir,
  // @ts-ignore
} from './configures/GlobalParameters.esm.mts';

Promise.allSettled( [
  // @ts-ignore
  // import( `${ serversDir }/HTTPServerForPort9999.mts` ),
  // @ts-ignore
  // import( `${ serversDir }/HTTPSServerForPort9999.mts` ),

  // @ts-ignore
  // import( `${ serversDir }/HTTPAndWebSocketByServerForPort9999.mts` ),
  // @ts-ignore
  import( `${ serversDir }/HTTPSAndWebSocketSByServerForPort9999.mts` ),

  // @ts-ignore
  // import( `${ serversDir }/HTTPV2ServerForPort9999.mts` ),

  // @ts-ignore
  // import( `${ serversDir }/WebSocketServerForPort9900.mts` ),
  // @ts-ignore
  // import( `${ serversDir }/WebSocketSServerForPort9900.mts` ),
] )
.then(
  ( resolve: Array<PromiseSettledResult<unknown>> ): void => {
    console.log( `\nresolve--->Start` );
    /*
     [ { status: "fulfilled", value: Module {} } ]
     */
    console.dir( resolve );
    console.log( `resolve--->End\n` );
  },
  ( reject: unknown ): void => {
    console.log( `\nreject--->Start` );
    console.error( reject );
    console.log( `reject--->End\n` );
  }
)
.catch( ( error: unknown ): void => {
  console.log( `\ncatch error--->Start` );
  console.error( error );
  console.log( `catch error--->End\n` );
} );
