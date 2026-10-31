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
  IsArray,
  IsEmpty,
  IsObject,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

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
  const operationsPayload: T_GraphQLServerForMultipartOperations | Array<T_GraphQLServerForMultipartOperations> = await request.clone().json(),
    isNotBatchOperations: boolean = ( operationsPayload as Array<T_GraphQLServerForMultipartOperations> ).length === 0 || !( operationsPayload as Array<T_GraphQLServerForMultipartOperations> ).every( ( value: T_GraphQLServerForMultipartOperations ): boolean => ( IsObject( value ) && !IsEmpty( value ) ) );

  if( IsArray( operationsPayload ) && isNotBatchOperations ){
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
    const results: Array<unknown> = [];

    const handler: ( req: Request ) => Promise<Response> = createHandlerByHTTP( options, reqCtx );

    for(
      const operation of
      operationsPayload
      ){
      try{
        const headers: Headers = new Headers(
          request.headers,
        );

        headers.set(
          'content-type',
          'application/json; charset=utf-8',
        );

        headers.delete( 'content-length' );
        headers.delete( 'transfer-encoding' );

        const operationRequest: Request = new Request(
          request.url,
          {
            method: 'POST',
            headers,
            body: JSON.stringify( operation ),

            ...( request.signal
                 ? {
                  signal: request.signal,
                }
                 : {}
            ),
          },
        );

        const operationResponse: Response = await handler( operationRequest );

        const operationResult: unknown = await operationResponse.json();

        results.push( operationResult );
      }
      catch( error: unknown ){
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

    return new Response(
      JSON.stringify( results ),
      {
        headers: {
          ...HttpResponseHeadersFun( request ),
          'content-type': 'application/json; charset=utf-8',
        },
        status: HTTPStatus[ 200 ].status,
        statusText: HTTPStatus[ 200 ].statusText,
      },
    );
  }
  else{
    return createHandlerByHTTP(
      options,
      reqCtx,
    )( request );
  }
}

export {
  GraphQLServerForExecuteBatch,
};

export default {
  GraphQLServerForExecuteBatch,
};
