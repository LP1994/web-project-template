/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/public/InterceptorError.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 15:17:36 星期二
 */

'use strict';

type ResponseType001 = Response | Promise<Response>;

class InterceptorError {

  readonly #request: Request;

  // @ts-ignore
  readonly #method: string;

  // @ts-ignore
  readonly #pathName: string;

  constructor( request: Request ){
    this.#request = request;

    this.#method = this.#request.method.toLowerCase();

    this.#pathName = new URL( this.#request.url ).pathname;
  }

  res404(): ResponseType001{
    // @ts-ignore
    return new Response( Deno.readTextFileSync( new URL( import.meta.resolve( '../../static/html/404.html' ) ) ), {
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
