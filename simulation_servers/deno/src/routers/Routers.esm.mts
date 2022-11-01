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
  httpHeaders,
  // @ts-ignore
} from '../configures/GlobalParameters.esm.mts';

import {
  dejs,
  // @ts-ignore
} from '../public/ThirdPartyModules.esm.mts';

import {
  mime,
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

type TypeResponse001 = Response | Promise<Response>;

type TypeFun001 = ( request: Request ) => TypeResponse001;

const requestMethods: {
  [ key: string ]: TypeFun001;
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
    return ( requestMethods[ method ] as TypeFun001 )( request );
  }

  // @ts-ignore
  const filePath: URL = new URL( import.meta.resolve( '../template/ejs/ErrorForReqMethod.ejs' ) ),
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
