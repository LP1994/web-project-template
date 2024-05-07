/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadBySingle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:16 星期五
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_192_168_2_7_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_192_168_2_7_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 单文件上传（支持POST请求、PUT请求）。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=single&isForcedWrite=false
 * 查询参数“isForcedWrite”是可选的。
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=single&isForcedWrite=true
 *
 * 允许在请求头中携带自定义的请求头标识“deno-custom-file-sri”，其值为使用“SHA-512”计算的文件SRI值，来提前校验上传的文件是否已经存在。
 *
 * 1、客户端上传的body必须是用FormData包装。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=single”。
 * 3、FormData中必须要有的字段：
 *    uploadType：值为'single'。
 *    file：其值类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *    关于如何创建Blob见：
 *    https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 * 4、可选字段有：
 *    fileName：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行（最好带扩展名）。
 */

'use strict';

import {
  toWritableStream,
} from 'deno_std_io/to_writable_stream.ts';

import {
  HttpResponseHeadersFun,
  resMessageStatus,
} from 'configures/GlobalParameters.esm.mts';

import {
  DeleteOne,
} from 'mongo/simulation_servers_deno/upload_file_sri/UploadFileSRI.esm.mts';

import {
  type T_Obj001,
  type I_UploadFileSRISchema,

  GetFileMIME,
  UpdateFileSRI,
} from './UpdateFileSRI.esm.mts';

/**
 * 单文件上传（支持POST请求、PUT请求）。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=single&isForcedWrite=false
 * 查询参数“isForcedWrite”是可选的。
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=single&isForcedWrite=true
 *
 * 允许在请求头中携带自定义的请求头标识“deno-custom-file-sri”，其值为使用“SHA-512”计算的文件SRI值，来提前校验上传的文件是否已经存在。
 *
 * 1、客户端上传的body必须是用FormData包装。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=single”。
 * 3、FormData中必须要有的字段：
 *    uploadType：值为'single'。
 *    file：其值类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *    关于如何创建Blob见：
 *    https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 * 4、可选字段有：
 *    fileName：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行（最好带扩展名）。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回值类型为Promise<Response>。
 */
async function UploadBySingle( request: Request ): Promise<Response>{
  const _request: Request = request.clone();

  let result001: string = JSON.stringify( {
    data: {
      success: false,
      message: `body为空，未上传任何数据。`,
    },
    messageStatus: resMessageStatus[ 1000 ],
  } );

  const contentType: string = ( _request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase();

  if( _request.body && contentType.startsWith( 'multipart/form-data;' ) ){
    let formData: FormData;

    try{
      formData = await _request.formData();

      let file: FormDataEntryValue | Blob | null = formData.get( 'file' ),
        fileName: string = ( ( formData.get( 'fileName' ) ?? '' ) as string ).trim();

      const str001: string = Object.prototype.toString.call( file );

      if( str001 === '[object File]' || str001 === '[object Blob]' ){
        if( fileName.length === 0 && str001 === '[object File]' ){
          fileName = ( file as File ).name.length !== 0
                     ? ( file as File ).name
                     : `SingleFile`;
        }
        else if( fileName.length === 0 && str001 === '[object Blob]' ){
          fileName = `SingleBlob`;
        }

        const fileMIME: string = await GetFileMIME( ( file as File | Blob ).slice(), fileName );

        const {
          isWriteFile,
          fileInfo,
        }: T_Obj001 = await UpdateFileSRI( _request, {
          [ Symbol.toStringTag ]: 'Blob',
          stream: (): ReadableStream<Uint8Array> => ( file as File | Blob ).stream(),
          arrayBuffer: (): Promise<ArrayBuffer> => ( file as File | Blob ).arrayBuffer(),
          blob: async (): Promise<Blob> => await ( ( file as File | Blob ).slice() ),
          slice: async ( start?: number, end?: number, contentType?: string ): Promise<Blob> => {
            let result: Blob;

            if( start !== null && start !== undefined && end !== null && end !== undefined && contentType !== null && contentType !== undefined ){
              result = ( file as File | Blob ).slice( start, end, contentType );
            }
            else if( start !== null && start !== undefined && end !== null && end !== undefined ){
              result = ( file as File | Blob ).slice( start, end );
            }
            else if( start !== null && start !== undefined ){
              result = ( file as File | Blob ).slice( start );
            }
            else{
              result = ( file as File | Blob ).slice();
            }

            return result;
          },
          text: (): Promise<string> => ( file as File | Blob ).text(),
          lastModified: String( Date.now() ),
          name: fileName,
          size: String( ( file as File | Blob ).size ),
          type: String( fileMIME ),
        }, fileName );

        const {
          savePath,
          filePath,
          fileType,
          sri,
          fileName: fileName001,
        }: I_UploadFileSRISchema = fileInfo;

        if( !isWriteFile ){
          result001 = JSON.stringify( {
            data: {
              // true表示上传成功，反之，表示失败。
              success: true,
              // 描述性说明。
              message: `已存在跟此文件（${ fileName001 }，文件类型：${ fileType }）的SRI值一致的文件，故本次上传不写入此文件。`,
              // 该属性值可供客户端再次获取上传到服务器的文件，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
              filePath: `${ filePath }`,
            },
            messageStatus: resMessageStatus[ 200 ],
          } );
        }
        else{
          try{
            const file001: Deno.FsFile = await Deno.open( new URL( savePath ), {
              write: true,
              create: true,
            } );

            await ( file as File ).stream().pipeTo( toWritableStream( file001 ) );

            result001 = JSON.stringify( {
              data: {
                // true表示上传成功，反之，表示失败。
                success: true,
                // 描述性说明。
                message: `文件（${ fileName001 }，文件类型：${ fileType }）上传成功。`,
                // 该属性值可供客户端再次获取上传到服务器的文件，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
                filePath: `${ filePath }`,
              },
              messageStatus: resMessageStatus[ 200 ],
            } );
          }
          catch( error: unknown ){
            await DeleteOne( sri );

            result001 = JSON.stringify( {
              data: {
                success: false,
                message: `${ ( error as Error ).message }`,
              },
              messageStatus: resMessageStatus[ 9999 ],
            } );
          }
        }
      }
      else{
        result001 = JSON.stringify( {
          data: {
            success: false,
            message: `客户端上传的不是一个File或Blob类型的数据，其数据类型为“${ str001 }”，其他数据类型可以先转换成Blob再上传。`,
          },
          messageStatus: resMessageStatus[ 1002 ],
        } );
      }
    }
    catch( error: unknown ){
      result001 = JSON.stringify( {
        data: {
          success: false,
          message: `${ ( error as Error ).message }`,
        },
        messageStatus: resMessageStatus[ 9999 ],
      } );
    }
  }
  else if( _request.body && !contentType.startsWith( 'multipart/form-data;' ) ){
    result001 = JSON.stringify( {
      data: {
        success: false,
        message: `请求头中的“content-type”的值（${ contentType }）不是服务端要求的类型（multipart/form-data），可能客户端上传的body不是“FormData”类型或客户端设置了不正确的“content-type”值。`,
      },
      messageStatus: resMessageStatus[ 1001 ],
    } );
  }

  return new Response( result001, {
    status: 200,
    statusText: 'OK',
    headers: {
      ...HttpResponseHeadersFun( request ),
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

// 必须部署这个默认的导出值。
export default UploadBySingle;
