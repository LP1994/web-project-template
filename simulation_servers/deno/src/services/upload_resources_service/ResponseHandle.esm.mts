/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:42 星期四
 */

'use strict';

import {
  type TypeResponse001,

  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

// @ts-ignore
import UploadByBinary from './UploadByBinary.esm.mts';

// @ts-ignore
import UploadBySingle from './UploadBySingle.esm.mts';

// @ts-ignore
import UploadByMultiple from './UploadByMultiple.esm.mts';

// @ts-ignore
import UploadByBigFile from './UploadByBigFile.esm.mts';

function ResponseHandle( request: Request ): TypeResponse001{
  const url: URL = new URL( request.url ),
    uploadType: string = ( url.searchParams.get( 'uploadType' ) ?? '' ).trim();

  if( uploadType === 'binary' ){
    return UploadByBinary( request );
  }
  else if( uploadType === 'single' ){
    return UploadBySingle( request );
  }
  else if( uploadType === 'multiple' ){
    return UploadByMultiple( request );
  }
  else if( uploadType === 'bigFile' ){
    return UploadByBigFile( request );
  }
  else{
    return new Response( JSON.stringify( {
      data: {
        message: `请求的url（${ url.pathname }${ url.search }）上缺少查询参数“uploadType”，其有效值有：“binary”、“single”、“multiple”、“bigFile”。`,
      },
      message: resMessageStatus[ 1003 ],
    } ), {
      status: 200,
      statusText: 'OK',
      headers: {
        ...httpHeaders,
        'content-type': 'application/json; charset=utf-8',
      },
    } );
  }
}

export default ResponseHandle;
