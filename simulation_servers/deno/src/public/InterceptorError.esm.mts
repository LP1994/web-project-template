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
  mimetypes,
  // @ts-ignore
} from './ThirdPartyTools.esm.mts';

const {
  Mime,
}: any = mimetypes;

const myMime: any = new Mime( {
  'text/html; charset=utf-8': [
    'ejs',
  ],
} );

class InterceptorError {
  readonly #request: Request;

  readonly #method: string;

  readonly #URL: URL;

  readonly #pathName: string;

  readonly #search: string;

  constructor( request: Request ){
    this.#request = request;
    this.#method = this.#request.method.toLowerCase();
    this.#URL = new URL( this.#request.url );
    this.#pathName = this.#URL.pathname;
    this.#search = this.#URL.search;
  }

  public async res404(): Promise<Response>{
    // @ts-ignore
    const filePath: URL = new URL( import.meta.resolve( '../template/ejs/404.ejs' ) ),
      // @ts-ignore
      html: string = await dejs.renderToString( Deno.readTextFileSync( filePath ), {
        message: `未找到“${ this.#method }”请求方法的“${ decodeURI( this.#pathName + this.#search ) }”资源。`,
      } );

    return new Response( html, {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': myMime.getType( filePath.href ),
      },
    } );
  }

  public static async ResError( {
    title = '',
    message = '',
  }: {
    title: string;
    message: string;
  } = {
    title: '',
    message: '',
  } ): Promise<Response>{
    // @ts-ignore
    const filePath: URL = new URL( import.meta.resolve( '../template/ejs/Error.ejs' ) ),
      // @ts-ignore
      html: string = await dejs.renderToString( Deno.readTextFileSync( filePath ), {
        title,
        message,
      } );

    return new Response( html, {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': myMime.getType( filePath.href ),
      },
    } );
  }
}

export {
  InterceptorError,
};

export default InterceptorError;
