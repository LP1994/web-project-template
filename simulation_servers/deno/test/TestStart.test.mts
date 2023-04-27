/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/test/TestStart.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-03-23 03:11:08 星期四
 */

/**
 * 用于测试。
 */

'use strict';

console.log( `\n\n\n` );

if( true ){
  import('./npm_mongodb_for_deno.test.mts').catch( ( error: unknown ): void => {
    console.error( error );
  } ).finally( (): void => {
    console.log( `\n\n\n` );
  } );
}

if( true ){
  import('./npm_mongoose_for_deno.test.mts').catch( ( error: unknown ): void => {
    console.error( error );
  } ).finally( (): void => {
    console.log( `\n\n\n` );
  } );
}
