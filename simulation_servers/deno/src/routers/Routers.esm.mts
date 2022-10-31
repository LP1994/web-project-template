/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Routers.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:11:36 星期二
 */

'use strict';

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

function Routers( request: Request ): ResponseType001{
  const method: string = request.method.toLowerCase().trim();

  if( method in requestMethods ){
    // @ts-ignore
    return requestMethods[ method ]( request );
  }

  return new Response( `服务器暂不对客户端的“${ method }”请求方法提供服务，目前只提供对这些请求方法的服务：${ Object.keys( requestMethods )
  .join( '、' ) }。` );
}

export {
  Routers,
};

export default {
  Routers,
};
