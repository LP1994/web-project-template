/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-03 02:25:42 星期四
 */

/**
 * 测试文件上传时，不可尽信“postman”这个工具，它貌似有BUG（x-file-sri）！用浏览器测，都没那个BUG（x-file-sri）！
 */

'use strict';

import {
  type TypeResponse001,

  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

/**
 * 单文件上传（客户端上传的body不使用FormData包装，直接就是一个File、Blob、二进制流等类型）。
 *
 * 1、客户端上传的body不使用FormData包装，直接就是一个File、Blob、二进制流等类型。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=binary”。
 */
// @ts-ignore
import UploadByBinary from './UploadByBinary.esm.mts';

/**
 * 单文件上传。
 *
 * 1、客户端上传的body必须是用FormData包装。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=single”。
 * 3、FormData中必须要有的字段：
 *    uploadType：值为'single'。
 *    file：其值类型可以是File、Blob二者之一。
 * 4、可选字段有：
 * fileName：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行。
 */
// @ts-ignore
import UploadBySingle from './UploadBySingle.esm.mts';

/**
 * 多文件上传。
 * 第1种多文件的上传方式：
 * 只使用“uploadType”、“files”字段，其中“files”字段对应的值里保存了多个需要上传的文件。
 * 客户端可以通过FormData的append方法，多次设置“files”字段，如：formData.append( 'files', File_001 )、formData.append( 'files', File_002 )、......。
 *
 * 第2种多文件的上传方式：
 * 只使用“uploadType”、“quantity”、“fileX”、“fileNameX”字段，其中“quantity”字段表示有多少个文件被上传。
 * 然后“fileX”、“fileNameX”字段中的“X”就会用index来代替，index从0开始，总数等于“quantity”字段值。
 * 如：quantity: 5
 * file0：'name_000'
 * fileName0：File_000
 * file1：'name_001'
 * fileName1：File_001
 * ......
 * file4：'name_004'
 * fileName4：File_004
 *
 * 第3种，也可以结合上面2种方式：
 * uploadType: 'multiple'
 * files: [ File | Blob, ...... ]
 * quantity: 5
 * file0: 'name_000'
 * fileName0: File_000
 * file1: 'name_001'
 * fileName1: File_001
 * ......
 * file4: 'name_004'
 * fileName4: File_004
 *
 *
 *
 * 1、客户端上传的body必须是用FormData包装。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=multiple”。
 * 3、FormData中必须要有的字段：
 *    uploadType：值为'multiple'。
 *    files：其值类型为数组，其中的每一个成员的类型可以是File、Blob二者之一。
 *    quantity：其值类型为Number，表示有多少个文件被上传。
 *    fileX：其值类型可以是File、Blob二者之一。
 * 4、可选字段有：
 * fileNameX：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行。
 */
// @ts-ignore
import UploadByMultiple from './UploadByMultiple.esm.mts';

// @ts-ignore
import UploadByBigFile from './UploadByBigFile.esm.mts';

// @ts-ignore
import FileSRI from 'upload/_FileSRI.json' assert { type: 'json', };

type TypeFileSRI001 = {
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
  const x_file_sri: string = ( request.headers.get( 'x-file-sri' ) ?? '' ).trim().toLowerCase();

  return ( FileSRI as { [ key: string ]: TypeFileSRI001; } )[ x_file_sri ] ?? false;
}

function ResponseHandle( request: Request ): TypeResponse001{
  const url: URL = new URL( request.url ),
    uploadType: string = ( url.searchParams.get( 'uploadType' ) ?? '' ).trim();

  let result: TypeResponse001;

  /**
   * 单文件上传（客户端上传的body不使用FormData包装，直接就是一个File、Blob、二进制流等类型）。
   *
   * 1、客户端上传的body不使用FormData包装，直接就是一个File、Blob、二进制流等类型。
   * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=binary”。
   */
  if( uploadType === 'binary' ){
    let result001: boolean | TypeFileSRI001 = ValidateReqHeadSRI( request );

    if( result001 ){
      result001 = result001 as TypeFileSRI001;

      result = new Response( JSON.stringify( {
        data: {
          success: true,
          message: `已存在跟此文件（文件类型：${ result001.fileType }）的SRI值一致的文件，本次上传不写入此文件、不更新此文件信息。`,
          filePath: `${ result001.filePath }`
        },
        messageStatus: resMessageStatus[ 200 ]
      } ), {
        status: 200,
        statusText: 'OK',
        headers: {
          ...httpHeaders,
          'content-type': 'application/json; charset=utf-8',
        },
      } );
    }
    else{
      result = UploadByBinary( request );
    }
  }
  /**
   * 单文件上传。
   *
   * 1、客户端上传的body必须是用FormData包装。
   * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=single”。
   * 3、FormData中必须要有的字段：
   *    uploadType：值为'single'。
   *    file：其值类型可以是File、Blob二者之一。
   * 4、可选字段有：
   * fileName：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行。
   */
  else if( uploadType === 'single' ){
    let result001: boolean | TypeFileSRI001 = ValidateReqHeadSRI( request );

    if( result001 ){
      result001 = result001 as TypeFileSRI001;

      result = new Response( JSON.stringify( {
        data: {
          success: true,
          message: `已存在跟此文件（文件类型：${ result001.fileType }）的SRI值一致的文件，本次上传不写入此文件、不更新此文件信息。`,
          filePath: `${ result001.filePath }`
        },
        messageStatus: resMessageStatus[ 200 ]
      } ), {
        status: 200,
        statusText: 'OK',
        headers: {
          ...httpHeaders,
          'content-type': 'application/json; charset=utf-8',
        },
      } );
    }
    else{
      result = UploadBySingle( request );
    }
  }
  /**
   * 多文件上传。
   * 第1种多文件的上传方式：
   * 只使用“uploadType”、“files”字段，其中“files”字段对应的值里保存了多个需要上传的文件。
   * 客户端可以通过FormData的append方法，多次设置“files”字段，如：formData.append( 'files', File_001 )、formData.append( 'files', File_002 )、......。
   *
   * 第2种多文件的上传方式：
   * 只使用“uploadType”、“quantity”、“fileX”、“fileNameX”字段，其中“quantity”字段表示有多少个文件被上传。
   * 然后“fileX”、“fileNameX”字段中的“X”就会用index来代替，index从0开始，总数等于“quantity”字段值。
   * 如：quantity: 5
   * file0：'name_000'
   * fileName0：File_000
   * file1：'name_001'
   * fileName1：File_001
   * ......
   * file4：'name_004'
   * fileName4：File_004
   *
   * 第3种，也可以结合上面2种方式：
   * uploadType: 'multiple'
   * files: [ File | Blob, ...... ]
   * quantity: 5
   * file0: 'name_000'
   * fileName0: File_000
   * file1: 'name_001'
   * fileName1: File_001
   * ......
   * file4: 'name_004'
   * fileName4: File_004
   *
   *
   *
   * 1、客户端上传的body必须是用FormData包装。
   * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=multiple”。
   * 3、FormData中必须要有的字段：
   *    uploadType：值为'multiple'。
   *    files：其值类型为数组，其中的每一个成员的类型可以是File、Blob二者之一。
   *    quantity：其值类型为Number，表示有多少个文件被上传。
   *    fileX：其值类型可以是File、Blob二者之一。
   * 4、可选字段有：
   * fileNameX：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行。
   */
  else if( uploadType === 'multiple' ){
    result = UploadByMultiple( request );
  }
  else if( uploadType === 'bigFile' ){
    let result001: boolean | TypeFileSRI001 = ValidateReqHeadSRI( request );

    if( result001 ){
      result001 = result001 as TypeFileSRI001;

      result = new Response( JSON.stringify( {
        data: {
          success: true,
          message: `已存在跟此文件（文件类型：${ result001.fileType }）的SRI值一致的文件，本次上传不写入此文件、不更新此文件信息。`,
          filePath: `${ result001.filePath }`
        },
        messageStatus: resMessageStatus[ 200 ]
      } ), {
        status: 200,
        statusText: 'OK',
        headers: {
          ...httpHeaders,
          'content-type': 'application/json; charset=utf-8',
        },
      } );
    }
    else{
      result = UploadByBigFile( request );
    }
  }
  else{
    result = new Response( JSON.stringify( {
      data: {
        success: false,
        message: `请求的url（${ url.pathname }${ url.search }）上缺少查询参数“uploadType”，其有效值有：“binary”、“single”、“multiple”、“bigFile”。`,
      },
      messageStatus: resMessageStatus[ 1003 ],
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
