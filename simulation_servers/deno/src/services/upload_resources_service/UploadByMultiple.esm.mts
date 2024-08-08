/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByMultiple.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:31 星期五
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 多文件批量上传（支持POST请求、PUT请求）。
 * 第1种多文件的上传方式：
 * 只使用“uploadType”、“files”字段，其中“files”字段对应的值里保存了多个需要上传的文件。
 * 客户端可以通过FormData的append方法，多次设置“files”字段，如：formData.append( 'files', File_001, 'File_001.png' )、formData.append( 'files', File_002, 'File_001.png' )、......。
 * formData.append()的第3个参数用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行（最好还是带扩展名）。
 * “files”字段对应的值类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *   关于如何创建Blob见：
 *   https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 *
 * 第2种多文件的上传方式：
 * 只使用“uploadType”、“quantity”、“fileX”、“fileNameX”字段，其中“quantity”字段表示有多少个文件被上传。
 * 然后“fileX”、“fileNameX”字段中的“X”就会用index来代替，index从0开始，总数等于“quantity”字段值。
 * 如：quantity: 5
 * file0：File_000
 * fileName0：'File_000.png'
 * file0：File_001
 * fileName0：'File_001.png'
 * ......
 * file0：File_004
 * fileName0：'File_004.png'
 *
 * 第3种，当然也可以结合上面2种方式：
 * uploadType: 'multiple'
 * files: [ File | Blob, ...... ]
 * quantity: 5
 * file0：File_000
 * fileName0：'File_000.png'
 * file0：File_001
 * fileName0：'File_001.png'
 * ......
 * file0：File_004
 * fileName0：'File_004.png'
 *
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=multiple&isForcedWrite=false
 * 查询参数“isForcedWrite”是可选的。
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=multiple&isForcedWrite=true
 *
 * 1、客户端上传的body必须是用FormData包装。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=multiple”。
 * 3、FormData中必须要有的字段：
 *    uploadType：值为'multiple'。
 *    files：其值类型为数组，其中的每一个成员的类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *      关于如何创建Blob见：
 *      https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 *    quantity：其值类型为Number，表示有多少个文件被上传。
 *    fileX：其值类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *      关于如何创建Blob见：
 *      https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 * 4、可选字段有：
 *    fileNameX：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行（最好还是带扩展名）。
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
  type T_Obj001,

  GetFileMIME,
  UpdateFileSRI,
} from './UpdateFileSRI.esm.mts';

type T_ResultObj001 = {
  // 没有写入的文件信息，因为它们已经存在了，只是更新了这些文件的信息。
  noWriteFile: Array<T_Obj001>;
  // 成功写入的文件信息。
  writeFile: Array<T_Obj001>;
};

/**
 * 更新文件的SRI及其他信息。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @param {Array<File | Blob>} files 一个数组，里面的每一个成员都是一个文件对象，数据类型可以是File、Blob，无默认值，必须。
 *
 * @returns {Promise<Array<T_Obj001>>} 返回值类型为Promise<Array<T_Obj001>>。
 */
async function GetUpdateFileSRIHandle( request: Request, files: Array<File | Blob> ): Promise<Array<T_Obj001>>{
  return await Array.fromAsync( files.map( ( file: File | Blob ): Promise<T_Obj001> => UpdateFileSRI(
    request,
    {
      [ Symbol.toStringTag ]: 'Blob',
      stream: (): ReadableStream<Uint8Array> => file.stream(),
      arrayBuffer: (): Promise<ArrayBuffer> => file.arrayBuffer(),
      blob: async (): Promise<Blob> => await ( file.slice() ),
      slice: async ( start?: number, end?: number, contentType?: string ): Promise<Blob> => {
        let result: Blob;

        if( start !== null && start !== undefined && end !== null && end !== undefined && contentType !== null && contentType !== undefined ){
          result = file.slice( start, end, contentType );
        }
        else if( start !== null && start !== undefined && end !== null && end !== undefined ){
          result = file.slice( start, end );
        }
        else if( start !== null && start !== undefined ){
          result = file.slice( start );
        }
        else{
          result = file.slice();
        }

        return result;
      },
      text: (): Promise<string> => file.text(),
      lastModified: String( Date.now() ),
      // @ts-expect-error
      name: file._name,
      size: String( file.size ),
      // @ts-expect-error
      type: String( file._type ),
    },
    // @ts-expect-error
    file._name
  ) ) );
}

/**
 * 处理文件写入的操作。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @param {Array<File | Blob>} files 一个数组，里面的每一个成员都是一个文件对象，数据类型可以是File、Blob，无默认值，必须。
 *
 * @returns {Promise<T_ResultObj001>} 返回值类型为Promise<T_ResultObj001>。
 */
async function WriteFileHandle( request: Request, files: Array<File | Blob> ): Promise<T_ResultObj001>{
  const updateFileSRI: Array<T_Obj001> = await GetUpdateFileSRIHandle( request, files );

  const noWriteFile: Array<T_Obj001> = updateFileSRI.filter(
      (
        {
          isWriteFile,
        }: T_Obj001,
      ): boolean => !isWriteFile
    ),
    writeFile: Array<T_Obj001> = updateFileSRI.filter(
      (
        {
          isWriteFile,
        }: T_Obj001,
      ): boolean => isWriteFile
    );

  const fileOpen: Array<Promise<Deno.FsFile>> = writeFile.map(
      (
        {
          fileInfo: {
            savePath,
          },
        }: T_Obj001,
      ): Promise<Deno.FsFile> => Deno.open( new URL( savePath ), {
        write: true,
        create: true,
      } )
    ),
    arr001: Array<Deno.FsFile> = await Array.fromAsync( fileOpen );

  arr001.map(
    (
      item: Deno.FsFile,
      index: number,
    ): Promise<void> => ( writeFile[ index ] as T_Obj001 ).file.stream().pipeTo( toWritableStream( item ) )
  );

  return {
    noWriteFile,
    writeFile,
  };
}

/**
 * 多文件批量上传（支持POST请求、PUT请求）。
 * 第1种多文件的上传方式：
 * 只使用“uploadType”、“files”字段，其中“files”字段对应的值里保存了多个需要上传的文件。
 * 客户端可以通过FormData的append方法，多次设置“files”字段，如：formData.append( 'files', File_001, 'File_001.png' )、formData.append( 'files', File_002, 'File_001.png' )、......。
 * formData.append()的第3个参数用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行（最好还是带扩展名）。
 * “files”字段对应的值类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *   关于如何创建Blob见：
 *   https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 *
 * 第2种多文件的上传方式：
 * 只使用“uploadType”、“quantity”、“fileX”、“fileNameX”字段，其中“quantity”字段表示有多少个文件被上传。
 * 然后“fileX”、“fileNameX”字段中的“X”就会用index来代替，index从0开始，总数等于“quantity”字段值。
 * 如：quantity: 5
 * file0：File_000
 * fileName0：'File_000.png'
 * file0：File_001
 * fileName0：'File_001.png'
 * ......
 * file0：File_004
 * fileName0：'File_004.png'
 *
 * 第3种，当然也可以结合上面2种方式：
 * uploadType: 'multiple'
 * files: [ File | Blob, ...... ]
 * quantity: 5
 * file0：File_000
 * fileName0：'File_000.png'
 * file0：File_001
 * fileName0：'File_001.png'
 * ......
 * file0：File_004
 * fileName0：'File_004.png'
 *
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=multiple&isForcedWrite=false
 * 查询参数“isForcedWrite”是可选的。
 * 当客户端发起的请求URL上带有查询参数“isForcedWrite”且值设置为true时，表示无论文件是不是已经存在，都强制写入文件并更新文件的所有信息。
 * 例子：https://127.0.0.1:9200/simulation_servers_deno/upload?uploadType=multiple&isForcedWrite=true
 *
 * 1、客户端上传的body必须是用FormData包装。
 * 2、要求客户端发起的请求url上必须要有查询参数“uploadType=multiple”。
 * 3、FormData中必须要有的字段：
 *    uploadType：值为'multiple'。
 *    files：其值类型为数组，其中的每一个成员的类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *      关于如何创建Blob见：
 *      https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 *    quantity：其值类型为Number，表示有多少个文件被上传。
 *    fileX：其值类型可以是File、Blob二者之一，其他数据类型可以先转换成Blob再上传。
 *      关于如何创建Blob见：
 *      https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
 * 4、可选字段有：
 *    fileNameX：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行（最好还是带扩展名）。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {Promise<Response>} 返回值类型为Promise<Response>。
 */
async function UploadByMultiple( request: Request ): Promise<Response>{
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

      const quantity: number = ( formData.get( 'quantity' ) ?? 0 ) as number,
        files001: Array<FormDataEntryValue | Blob | null> = [];

      let file001: FormDataEntryValue | Blob | null,
        fileName001: string = '',
        str001: string = '';

      for(
        let i: number = 0;
        i < quantity;
        ++i
      ){
        file001 = formData.get( `file${ i }` );
        fileName001 = ( ( formData.get( `fileName${ i }` ) ?? '' ) as string ).trim();
        str001 = Object.prototype.toString.call( file001 );

        if( ( str001 === '[object File]' || str001 === '[object Blob]' ) && fileName001.length !== 0 ){
          // @ts-expect-error
          ( file001 as File | Blob )._name = fileName001;
        }
        else if( str001 === '[object File]' && fileName001.length === 0 ){
          // @ts-expect-error
          ( file001 as File )._name = ( file001 as File ).name.length === 0
                                      ? 'MultipleFile'
                                      : ( file001 as File ).name;
        }
        else if( str001 === '[object Blob]' && fileName001.length === 0 ){
          // @ts-expect-error
          ( file001 as Blob )._name = `MultipleBlob`;
        }

        if( str001 === '[object File]' || str001 === '[object Blob]' ){
          // @ts-expect-error
          ( file001 as File | Blob )._type = await GetFileMIME( ( file001 as File | Blob ).slice(), ( file001 as File | Blob )._name );
        }

        files001.push( file001 );
      }

      const files: Array<File | Blob> = ( [
        ...(
          await (
            async (): Promise<Array<FormDataEntryValue | Blob | null>> => ( await Array.fromAsync( formData.getAll( 'files' ).map( async ( item: FormDataEntryValue | Blob | null, ): Promise<FormDataEntryValue | Blob | null> => {
              str001 = Object.prototype.toString.call( item );

              if( str001 === '[object File]' ){
                // @ts-expect-error
                ( item as File )._name = ( item as File ).name.length === 0
                                         ? 'MultipleFile'
                                         : ( item as File ).name;
              }
              else if( str001 === '[object Blob]' ){
                // @ts-expect-error
                ( item as Blob )._name = `MultipleBlob`;
              }

              if( str001 === '[object File]' || str001 === '[object Blob]' ){
                // @ts-expect-error
                ( item as File | Blob )._type = await GetFileMIME( ( item as File | Blob ).slice(), ( item as File | Blob )._name );
              }

              return item;
            } ) ) ) as Array<FormDataEntryValue | Blob | null>
          )()
        ),
        ...files001,
      ].filter( ( item: FormDataEntryValue | Blob | null, ): boolean => Object.prototype.toString.call( item ) === '[object File]' || Object.prototype.toString.call( item ) === '[object Blob]' ) ) as Array<File | Blob>;

      const {
        noWriteFile,
        writeFile,
      }: T_ResultObj001 = await WriteFileHandle( _request, files );

      const noWriteFileInfo: Array<{
          message: string;
          filePath: string;
        }> = [],
        writeFileInfo: Array<{
          message: string;
          filePath: string;
        }> = [];

      noWriteFile.forEach(
        (
          {
            fileInfo: {
              filePath,
              fileType,
              fileName,
            },
          }: T_Obj001,
        ): void => {
          noWriteFileInfo.push( {
            // 描述性说明。
            message: `已存在跟此文件（${ fileName }，文件类型：${ fileType }）的SRI值一致的文件，故本次上传不写入此文件。`,
            // 该属性值可供客户端再次获取上传到服务器的文件，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
            filePath: `${ filePath }`,
          } );
        }
      );

      writeFile.forEach(
        (
          {
            fileInfo: {
              filePath,
              fileType,
              fileName,
            },
          }: T_Obj001,
        ): void => {
          writeFileInfo.push( {
            // 描述性说明。
            message: `文件（${ fileName }，文件类型：${ fileType }）上传成功。`,
            // 该属性值可供客户端再次获取上传到服务器的文件，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
            filePath: `${ filePath }`,
          } );
        }
      );

      result001 = JSON.stringify( {
        data: {
          // true表示上传成功，反之，表示失败。
          success: true,
          // 没有写入的文件信息，因为它们已经存在了，只是更新了这些文件的信息。
          noWriteFile: noWriteFileInfo,
          // 成功写入的文件信息。
          writeFile: writeFileInfo,
        },
        messageStatus: resMessageStatus[ 200 ],
      } );
    }
    catch( error: unknown ){
      result001 = JSON.stringify( {
        data: {
          // true表示上传成功，反之，表示失败。
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
export default UploadByMultiple;
