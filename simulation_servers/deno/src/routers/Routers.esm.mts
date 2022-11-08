/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Routers.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:11:36 星期二
 */

'use strict';

import {
  type TypeFun001,
  type TypeFun002,

  ejsDir,

  httpHeaders,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

import {
  dejs,
  // @ts-ignore
} from '../public/ThirdPartyModules.esm.mts';

import {
  mime,

  IterateToNestForPromise,
  // @ts-ignore
} from '../public/PublicTools.esm.mts';

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
 * 一定得保证该函数返回的值类型只能是：Promise<Response>。<br />
 *
 * @param {Request} request
 *
 * @returns {Promise<Response>}
 */
async function Routers( request: Request ): Promise<Response>{
  const method: string = request.method.toLowerCase().trim();

  const upgrade: string = ( request.headers.get( 'upgrade' ) ?? '' ).toLowerCase(),
    // 当在同一个端口同时部署HTTP和WebSocket这两个服务时，火狐浏览器的请求头中“connection”属性值为“keep-alive, Upgrade”，而谷歌浏览器则为“Upgrade”。
    connection: string = ( request.headers.get( 'connection' ) ?? '' ).toLowerCase();

  if( upgrade === 'websocket' && ( connection === 'upgrade' || connection === 'keep-alive, Upgrade'.toLowerCase() || connection === 'keep-alive,Upgrade'.toLowerCase() ) ){
    return ( await IterateToNestForPromise( WebSocket( request ) ) ) as Response;
  }
  else if( method in requestMethods ){
    return ( await IterateToNestForPromise( ( requestMethods[ method ] as TypeFun003 )( request ) ) ) as Response;
  }

  // @ts-ignore
  const filePath: URL = new URL( import.meta.resolve( `${ ejsDir }/ErrorForReqMethod.ejs` ) ),
    // @ts-ignore
    html: string = await dejs.renderToString( Deno.readTextFileSync( filePath ), {
      message: `服务器暂不对客户端的“${ method }”请求方法提供服务，目前只提供对这些请求方法的服务：${ Object.keys( requestMethods )
      .join( '、' ) }。`,
    } );

  return new Response( html, {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': mime.getType( filePath.href ),
    },
  } );
}

export {
  Routers,
};

export default {
  Routers,
};
