/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/public/InterceptorError.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 15:17:36 星期二
 */

'use strict';

import {
  dejs,
  // @ts-ignore
} from './ThirdPartyTools.esm.mts';

class InterceptorError {
  readonly #request: Request;

  readonly #method: string;

  readonly #pathName: string;

  constructor( request: Request ){
    this.#request = request;

    this.#method = this.#request.method.toLowerCase();

    this.#pathName = new URL( this.#request.url ).pathname;
  }

  async res404(): Promise<Response>{
    // @ts-ignore
    const html: string = await dejs.renderToString( Deno.readTextFileSync( new URL( import.meta.resolve( '../template/ejs/404.ejs' ) ) ), {
      message: `未找到“${ this.#method }”请求方法的“${ this.#pathName }”资源。`,
    } );

    return new Response( html, {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    } );
  }
}

export {
  InterceptorError,
};

export default InterceptorError;
