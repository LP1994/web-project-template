/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/routers/Post.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 01:15:54 星期二
 */

'use strict';

// @ts-ignore
import InterceptorError from '../public/InterceptorError.esm.mts';

type TypeResponse001 = Response | Promise<Response>;

function Post( request: Request ): TypeResponse001{
  return new InterceptorError( request ).res404();
}

export {
  Post,
};

export default Post;
