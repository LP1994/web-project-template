/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByBigFile.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 19:07:04 星期五
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_192_168_10_101_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_192_168_10_101_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 单个大文件上传（支持POST请求、PUT请求）。
 *
 * 允许在请求头中携带自定义的请求头标识“x-file-sri”，其值为使用“SHA3-512”计算的文件SRI值，来提前校验上传的文件是否已经存在。
 *
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&fileName=001.zip&isForcedWrite=false
 * 查询参数“isForcedWrite”是可选的，“fileName”也是可选的，但是最好带。
 * 单个大文件上传不需要在URL上包含查询参数“type”，添加了它，就会执行单个大文件的分块上传的逻辑。
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&fileName=001.zip&isForcedWrite=true
 */

'use strict';

import {
  extensionsByType,

  // @ts-ignore
} from 'DenoStd/media_types/mod.ts';

import {
  writableStreamFromWriter,

  // @ts-ignore
} from 'DenoStd/streams/writable_stream_from_writer.ts';

import {
  crypto,
  toHashString,

  // @ts-ignore
} from 'DenoStd/crypto/mod.ts';

import {
  uploadDir,

  httpHeaders,
  resMessageStatus,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  type FileSRICollectionSchema,

  UpdateOne,
  QueryOne,

  // @ts-ignore
} from 'mongo/db/simulation_servers_deno/collections/upload_file_sri.esm.mts';

import {
  myURLPathName,

  // @ts-ignore
} from './Condition.esm.mts';

/**
 * 单个大文件上传（支持POST请求、PUT请求）。<br />
 *
 * 允许在请求头中携带自定义的请求头标识“x-file-sri”，其值为使用“SHA3-512”计算的文件SRI值，来提前校验上传的文件是否已经存在。<br />
 *
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&fileName=001.zip&isForcedWrite=false<br />
 * 查询参数“isForcedWrite”是可选的，“fileName”也是可选的，但是最好带。<br />
 * 单个大文件上传不需要在URL上包含查询参数“type”，添加了它，就会执行单个大文件的分块上传的逻辑。<br />
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。<br />
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=bigFile&fileName=001.zip&isForcedWrite=true<br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回值类型为Promise<Response>。
 */
async function UploadByBigFile( request: Request ): Promise<Response>{
  const _request: Request = request.clone(),
    isForcedWrite: string = ( new URL( _request.url ).searchParams.get( 'isForcedWrite' ) ?? '' ).trim().toLowerCase(),
    contentType: string = ( _request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase(),
    contentLength: string = ( _request.headers.get( 'content-length' ) ?? '' ).trim().toLowerCase(),
    extension: string[] | undefined = extensionsByType( contentType );

  let result: string;

  const boo001: boolean = contentType.length !== 0 && Array.isArray( extension ) && extension.length !== 0,
    boo002: boolean = contentLength.length !== 0 && Number( contentLength ) > 0;

  if( !request.clone().body ){
    result = JSON.stringify( {
      data: {
        success: false,
        message: `body为空，未上传任何数据。`,
      },
      messageStatus: resMessageStatus[ 1000 ],
    } );
  }
  else if( boo001 && boo002 ){
    try{
      let fileName001: string = decodeURI( ( new URL( _request.url ).searchParams.get( 'fileName' ) ?? '' ).trim() );

      if( fileName001.length === 0 ){
        fileName001 = `Big_File`;
      }

      const hash: ArrayBuffer = await crypto.subtle.digest( 'SHA3-512', ( request.clone().body as ReadableStream ) ),
        sri: string = toHashString( hash, 'hex' );

      let fileName: string = `${ sri }.${ ( extension as string[] )[ 0 ] as string }`;

      if( contentType === 'application/octet-stream' && fileName001.length !== 0 && fileName001.includes( '.' ) ){
        fileName = `${ sri }.${ fileName001.split( '.' ).at( -1 ) }`;
      }

      const savePath: URL = new URL( `${ uploadDir }/big_files/${ fileName }` ),
        filePath: string = `${ myURLPathName }/big_files/${ fileName }`;

      // @ts-ignore
      Deno.mkdirSync( new URL( `${ uploadDir }/big_files` ), {
        recursive: true,
      } );

      let fileSRIInfo: FileSRICollectionSchema | undefined = ( await QueryOne( sri ) );

      const handleFun001: () => Promise<void> = async (): Promise<void> => {
        // @ts-ignore
        const file001: Deno.FsFile = await Deno.open( savePath, {
          write: true,
          create: true,
        } );

        await ( _request.body as ReadableStream ).pipeTo( writableStreamFromWriter( file001 ) );

        Object.assign( fileSRIInfo as FileSRICollectionSchema, {
          shaType: 'SHA3-512',
          sri,
          requestURL: decodeURI( _request.url ),
          savePath: savePath.href,
          filePath,
          fileType: contentType,
          fileSize: String( contentLength ),
          fileLastModified: String( Date.now() ),
          fileName: fileName001,
        } );
      };

      if( fileSRIInfo ){
        // @ts-ignore
        Deno.renameSync( new URL( fileSRIInfo.savePath ), savePath );

        if( isForcedWrite === 'true' ){
          await handleFun001();

          result = JSON.stringify( {
            data: {
              // true表示上传成功，反之，表示失败。
              success: true,
              // 描述性说明。
              message: `大文件（${ fileName001 }，文件类型：${ contentType }）上传成功。`,
              // 该属性值可供客户端再次获取上传到服务器的文件，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
              filePath: `${ filePath }`,
            },
            messageStatus: resMessageStatus[ 200 ],
          } );
        }
        else{
          Object.assign( fileSRIInfo, {
            requestURL: decodeURI( _request.url ),
            savePath: savePath.href,
            filePath,
            fileType: contentType,
            fileLastModified: String( Date.now() ),
            fileName: fileName001,
          } );

          result = JSON.stringify( {
            data: {
              // true表示上传成功，反之，表示失败。
              success: true,
              // 描述性说明。
              message: `已存在跟此大文件（${ fileName001 }，文件类型：${ contentType }）的SRI值一致的大文件，故本次上传不写入此大文件。`,
              // 该属性值可供客户端再次获取上传到服务器的文件，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
              filePath: `${ filePath }`,
            },
            messageStatus: resMessageStatus[ 200 ],
          } );
        }
      }
      else{
        fileSRIInfo = {} as FileSRICollectionSchema;

        await handleFun001();

        result = JSON.stringify( {
          data: {
            // true表示上传成功，反之，表示失败。
            success: true,
            // 描述性说明。
            message: `大文件（${ fileName001 }，文件类型：${ contentType }）上传成功。`,
            // 该属性值可供客户端再次获取上传到服务器的文件，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
            filePath: `${ filePath }`,
          },
          messageStatus: resMessageStatus[ 200 ],
        } );
      }

      await UpdateOne( fileSRIInfo as FileSRICollectionSchema );
    }
    catch( error: unknown ){
      result = JSON.stringify( {
        data: {
          success: false,
          message: `${ ( error as Error ).message }`,
        },
        messageStatus: resMessageStatus[ 9999 ],
      } );
    }
  }
  else if( boo001 && !boo002 ){
    result = JSON.stringify( {
      data: {
        success: false,
        message: `请求头中的“content-length”的值（${ contentLength }）不是有效的，可能是缺少该属性，或其值为0。`,
      },
      messageStatus: resMessageStatus[ 1004 ],
    } );
  }
  else{
    result = JSON.stringify( {
      data: {
        success: false,
        message: `请求头中的“content-type”的值（${ contentType }）不符合要求，必须是一个明确的、有效的“媒体类型”，诸如：'text/html; charset=UTF-8'、'application/json'等等。`,
      },
      messageStatus: resMessageStatus[ 1001 ],
    } );
  }

  return new Response( result, {
    status: 200,
    statusText: 'OK',
    headers: {
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

// 必须部署这个默认的导出值。
export default UploadByBigFile;
