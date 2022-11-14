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

import {
  type TypeFileSRI001,

  ValidateReqHeadSRI,
  // @ts-ignore
} from './ValidateReqHeadSRI.esm.mts';

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

  let result: TypeResponse001;

  let result001: boolean | TypeFileSRI001;

  if( result001 = ValidateReqHeadSRI( request ) ){
    result001 = result001 as TypeFileSRI001;

    result = new Response( JSON.stringify( {
      data: {
        message: `已存在跟此文件的SRI值一致的文件（${ result001.fileName }，文件类型：${ result001.fileType }），本次上传不写入文件、更新文件信息。`,
        filePath: `${ result001.filePath }`,
      },
      message: resMessageStatus[ 200 ],
    } ), {
      status: 200,
      statusText: 'OK',
      headers: {
        ...httpHeaders,
        'content-type': 'application/json; charset=utf-8',
      },
    } );
  }
  else if( uploadType === 'binary' ){
    result = UploadByBinary( request );
  }
  else if( uploadType === 'single' ){
    result = UploadBySingle( request );
  }
  else if( uploadType === 'multiple' ){
    result = UploadByMultiple( request );
  }
  else if( uploadType === 'bigFile' ){
    result = UploadByBigFile( request );
  }
  else{
    result = new Response( JSON.stringify( {
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

  return result;
}

export default ResponseHandle;
