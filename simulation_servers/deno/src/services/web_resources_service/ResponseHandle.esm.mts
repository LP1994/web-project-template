/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/web_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  type TypeResponse001,

  webDir,
  httpHeaders,
  // @ts-ignore
} from '../../configures/GlobalParameters.esm.mts';

import {
  mime,
  // @ts-ignore
} from '../../public/PublicTools.esm.mts';

// @ts-ignore
import InterceptorError from '../../public/InterceptorError.esm.mts';

import {
  myURLPathName,
  // @ts-ignore
} from './Condition.esm.mts';

function ResponseHandle( request: Request ): TypeResponse001{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname ),
    filePath: URL = new URL( `${ webDir }/${ pathName.slice( myURLPathName.length ) }` );

  //@ts-ignore
  let fileState: Deno.FileInfo;

  try{
    // @ts-ignore
    fileState = Deno.statSync( filePath );

    if( fileState.isFile ){
      // @ts-ignore
      return new Response( Deno.readFileSync( filePath ), {
        status: 200,
        statusText: 'OK',
        headers: {
          ...httpHeaders,
          'content-type': `${ mime.getType( filePath.href ) }`,
        },
      } );
    }
    else if( fileState.isDirectory ){
      return InterceptorError.ResError( {
        title: `Error`,
        message: `当前无法获取该文件夹（${ pathName }）的信息。`,
      } );
    }
    else{
      return InterceptorError.ResError( {
        title: `Error`,
        message: `该路径（${ pathName }）既不指向有效的文件也不指向有效的文件夹。`,
      } );
    }
  }
  catch( error: unknown ){
    return new InterceptorError( request ).res404();
  }
}

export default ResponseHandle;
