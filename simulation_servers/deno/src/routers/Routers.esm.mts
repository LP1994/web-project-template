/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Routers.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:11:36 星期二
 */

/**
 * 集中处理客户端发起的请求，根据不同的请求方式分流到对应的请求方式的处理。
 * 目前有9种请求方式：
 * GET
 * HEAD
 * POST
 * PUT
 * DELETE
 * CONNECT
 * OPTIONS
 * TRACE
 * PATCH
 */

'use strict';

import {
  type T_Awaitable,
  type T_FunRequest,

  ejsDir,
  HttpResponseHeadersFun,
  HTTPStatus,
} from 'configures/GlobalParameters.esm.mts';

import {
  HTMLMinifyByRehype,
  IsWSForRequest,
  IterateToNestForPromise,
  mime,
} from 'public/PublicTools.esm.mts';

import {
  ejs,
} from 'public/ThirdPartyModules.esm.mts';

import Delete from './Delete.esm.mts';

import Get from './Get.esm.mts';

import Options from './Options.esm.mts';

import Post from './Post.esm.mts';

import Put from './Put.esm.mts';

import WebSocket from './WebSocket.esm.mts';

type T_MyFunRequest = T_FunRequest<T_Awaitable<Response>> | T_FunRequest<Promise<T_Awaitable<Response>>>;

type T_MyRequestMethods = 'put' | 'delete' | 'post' | 'get' | 'options';

const requestMethods = {
  put: Put,
  delete: Delete,
  post: Post,
  get: Get,
  options: Options,
} satisfies Record<T_MyRequestMethods, T_MyFunRequest>;

/**
 * 集中处理客户端发起的请求，根据不同的请求方式分流到对应的请求方式的处理。<br />
 * 目前有9种请求方式：<br />
 * GET <br />
 * HEAD <br />
 * POST <br />
 * PUT <br />
 * DELETE <br />
 * CONNECT <br />
 * OPTIONS <br />
 * TRACE <br />
 * PATCH <br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
 */
async function Routers( request: Request ): Promise<Response>{
  const method: string = request.method.toLowerCase().trim();

  let result: Response;

  if( IsWSForRequest( request ) ){
    result = ( await IterateToNestForPromise( WebSocket( request ) ) ) as Response;
  }
  else if( method in requestMethods ){
    result = ( await IterateToNestForPromise( ( requestMethods[ method as T_MyRequestMethods ] as T_MyFunRequest )( request ) ) ) as Response;
  }
  else{
    const filePath: URL = new URL( import.meta.resolve( `${ ejsDir }/ErrorForReqMethod.ejs` ) ),
      html: string = await HTMLMinifyByRehype( ejs.render( Deno.readTextFileSync( filePath ), {
        message: `服务器暂不对客户端的“${ method }”请求方法提供服务，目前只提供对这些请求方法的服务：${ Object.keys( requestMethods ).join( '、' ) }。`,
      } ) );

    result = new Response( html, {
      headers: {
        ...HttpResponseHeadersFun( request ),
        'content-type': mime.getType( filePath.href ),
      },
      status: HTTPStatus[ 405 ].status,
      statusText: HTTPStatus[ 405 ].statusText,
    } );
  }

  return result;
}

export {
  Routers,
};

export default {
  Routers,
};
