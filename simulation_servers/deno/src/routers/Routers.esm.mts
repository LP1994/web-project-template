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
  type TypeFun001,
  type TypeFun002,

  ejsDir,

  httpHeaders,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  dejs,

  // @ts-ignore
} from 'public/ThirdPartyModules.esm.mts';

import {
  mime,

  IterateToNestForPromise,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

// @ts-ignore
import Put from './Put.esm.mts';

// @ts-ignore
import Delete from './Delete.esm.mts';

// @ts-ignore
import Post from './Post.esm.mts';

// @ts-ignore
import Get from './Get.esm.mts';

// @ts-ignore
import Options from './Options.esm.mts';

// @ts-ignore
import WebSocket from './WebSocket.esm.mts';

type TypeFun003 = TypeFun001 | TypeFun002;

const requestMethods: {
  [ key: string ]: TypeFun003;
} = {
  put: Put,
  delete: Delete,
  post: Post,
  get: Get,
  options: Options,
};

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
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回Promise<Response>，注意最好别出现返回多层嵌套的Promise<Response>，也就是Promise<Promise<Promise<Response>>>等等。
 */
async function Routers( request: Request ): Promise<Response>{
  const method: string = request.method.toLowerCase().trim();

  const upgrade: string = ( request.headers.get( 'upgrade' ) ?? '' ).trim().toLowerCase(),
    // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
    connection: string = ( request.headers.get( 'connection' ) ?? '' ).trim().toLowerCase();

  let result: Response;

  if( upgrade === 'websocket' && ( connection === 'upgrade' || connection === 'keep-alive, Upgrade'.toLowerCase() || connection === 'keep-alive,Upgrade'.toLowerCase() ) ){
    result = ( await IterateToNestForPromise( WebSocket( request ) ) ) as Response;
  }
  else if( method in requestMethods ){
    result = ( await IterateToNestForPromise( ( requestMethods[ method ] as TypeFun003 )( request ) ) ) as Response;
  }
  else{
    // @ts-ignore
    const filePath: URL = new URL( import.meta.resolve( `${ ejsDir }/ErrorForReqMethod.ejs` ) ),
      // @ts-ignore
      html: string = await dejs.renderToString( Deno.readTextFileSync( filePath ), {
        message: `服务器暂不对客户端的“${ method }”请求方法提供服务，目前只提供对这些请求方法的服务：${ Object.keys( requestMethods )
        .join( '、' ) }。`,
      } );

    result = new Response( html, {
      status: 405,
      statusText: 'Method Not Allowed',
      headers: {
        ...httpHeaders,
        'content-type': mime.getType( filePath.href ),
      },
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
