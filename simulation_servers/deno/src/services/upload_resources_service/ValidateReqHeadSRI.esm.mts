/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/ValidateReqHeadSRI.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-12 17:22:19 星期六
 */

'use strict';

// @ts-ignore
import FileSRI from 'upload/_FileSRI.json' assert { type: 'json', };

export type TypeFileSRI001 = {
  shaType: string;
  requestURL: string;
  savePath: string;
  filePath: string;
  fileType: string;
  fileSize: string;
  fileLastModified: string;
  fileName: string;
};

function ValidateReqHeadSRI( request: Request ): boolean | TypeFileSRI001{
  const x_file_sri: string = ( request.headers.get( 'x-file-sri' ) ?? '' ).toLowerCase();

  if( x_file_sri in ( FileSRI as { [ key: string ]: TypeFileSRI001; } ) ){
    return ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ x_file_sri ] as TypeFileSRI001;
  }
  else{
    return false;
  }
}

export {
  ValidateReqHeadSRI,
};

export default ValidateReqHeadSRI;
