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
  dejs,
  // @ts-ignore
} from '../public/ThirdPartyTools.esm.mts';

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

type ResponseType001 = Response | Promise<Response>;

const requestMethods: {
  [ key: string ]: ( request: Request ) => ResponseType001;
} = {
  put: Put,
  delete: Delete,
  post: Post,
  get: Get,
  options: Options,
};

async function Routers( request: Request ): Promise<Response>{
  const method: string = request.method.toLowerCase().trim();

  if( method in requestMethods ){
    // @ts-ignore
    return requestMethods[ method ]( request );
  }

  // @ts-ignore
  const html: string = await dejs.renderToString( Deno.readTextFileSync( new URL( import.meta.resolve( '../template/ejs/ErrorForReqMethod.ejs' ) ) ), {
    message: `服务器暂不对客户端的“${ method }”请求方法提供服务，目前只提供对这些请求方法的服务：${ Object.keys( requestMethods )
    .join( '、' ) }。`,
  } );

  return new Response( html, {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  } );
}

export {
  Routers,
};

export default {
  Routers,
};
