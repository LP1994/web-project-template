/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForExecuteBatch.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之批量处理。
 */

'use strict';

import {
  type FetchAPI as T_FetchAPI,
  type HandlerOptions as T_HandlerOptions,

  createHandler as createHandlerByHTTP,
} from 'esm_sh_graphql_http/lib/use/fetch';

import {
  HttpResponseHeadersFun,
  HTTPStatus,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_GraphQLServerForMultipartOperations,
} from './GraphQLServerForMultipartParser.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import {
  IsArray,
  IsEmpty,
  IsObject,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 *
 * @param {Request} request
 *
 * @param {T_HandlerOptions} options
 *
 * @param {Partial<T_FetchAPI>} reqCtx
 *
 * @returns {Promise<Response>}
 */
async function GraphQLServerForExecuteBatch( request: Request, options: T_HandlerOptions, reqCtx: Partial<T_FetchAPI> ): Promise<Response>{
  const url: URL = new URL( request.url ),
    pathName: string = url.pathname;

  const operationsPayload: T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations> = await request.clone().json(),
    isNotBatchOperations: boolean = ( operationsPayload as Array<T_GraphQLServerForMultipartOperations> ).length === 0 || !( operationsPayload as Array<T_GraphQLServerForMultipartOperations> ).every( ( value: T_GraphQLServerForMultipartOperations ): boolean => ( IsObject( value ) && !IsEmpty( value ) ) );

  if( IsArray( operationsPayload ) && isNotBatchOperations ){
    errorWriteStream.write( `
请求“${ pathName }”中：
1）GraphQLServerForExecuteBatch: The multipart "operations" array must contain one or more GraphQL operation objects.
` );

    return new Response( JSON.stringify( {
      errors: [
        {
          message: `The multipart "operations" array must contain one or more GraphQL operation objects.`,
        },
      ],
    }, null, 2 ), {
      headers: {
        ...HttpResponseHeadersFun( request ),
        'content-type': 'application/json; charset=utf-8',
      },
      status: HTTPStatus[ 400 ].status,
      statusText: HTTPStatus[ 400 ].statusText,
    } );
  }
  else if( IsArray( operationsPayload ) && !isNotBatchOperations ){
    const results: Array<Record<string, any>> = [];

    const handler: ( req: Request ) => Promise<Response> = createHandlerByHTTP( options, reqCtx );

    for(
      const operation of
      operationsPayload as Array<T_GraphQLServerForMultipartOperations>
      ){
      try{
        const headers: Headers = new Headers( request.headers );

        headers.set( 'content-type', 'application/json; charset=utf-8' );

        headers.delete( 'content-length' );
        headers.delete( 'transfer-encoding' );

        const operationResponse: Response = await handler( new Request( request.url, {
          method: 'POST',
          headers,
          body: JSON.stringify( operation ),
          ...( ( () => (
            'signal' in request
            ? { signal: request.signal }
            : {}
          ) )() ),
          ...( ( () => (
            'cache' in request
            ? { cache: request.cache }
            : {}
          ) )() ),
          ...( ( () => (
            'credentials' in request
            ? { credentials: request.credentials }
            : {}
          ) )() ),
          ...( ( () => (
            'integrity' in request
            ? { integrity: request.integrity }
            : {}
          ) )() ),
          ...( ( () => (
            'keepalive' in request
            ? { keepalive: request.keepalive }
            : {}
          ) )() ),
          ...( ( () => (
            'mode' in request
            ? { mode: request.mode }
            : {}
          ) )() ),
          ...( ( () => (
            'redirect' in request
            ? { redirect: request.redirect }
            : {}
          ) )() ),
          ...( ( () => (
            'referrer' in request
            ? { referrer: request.referrer }
            : {}
          ) )() ),
          ...( ( () => (
            'referrerPolicy' in request
            ? { referrerPolicy: request.referrerPolicy }
            : {}
          ) )() ),
        } ) );

        results.push( await operationResponse.json() );
      }
      catch( error: unknown ){
        errorWriteStream.write( `
请求“${ pathName }”中：
2）GraphQLServerForExecuteBatch: ${ error instanceof Error
                                   ? error.message
                                   : String( error ) }
` );

        results.push( {
          errors: [
            {
              message: error instanceof Error
                       ? error.message
                       : String( error ),
            },
          ],
        } );
      }
    }

    return new Response( JSON.stringify( results, null, 2 ), {
      headers: {
        ...HttpResponseHeadersFun( request ),
        'content-type': 'application/json; charset=utf-8',
      },
      status: HTTPStatus[ 200 ].status,
      statusText: HTTPStatus[ 200 ].statusText,
    } );
  }
  else{
    return await createHandlerByHTTP( options, reqCtx )( request );
  }
}

export {
  GraphQLServerForExecuteBatch,
};

export default {
  GraphQLServerForExecuteBatch,
};
