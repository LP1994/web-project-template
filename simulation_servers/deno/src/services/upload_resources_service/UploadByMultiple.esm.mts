/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/UploadByMultiple.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-11 18:26:31 星期五
 */

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
 * 第3种，当然也可以结合上面2种方式：
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
 *    fileNameX：用来备注上传文件的文件名（如带扩展名的：1.png），虽然可选，但尽量还是设置吧，有没有带扩展名都行（最好还是带扩展名）。
 */

'use strict';

import {
  writableStreamFromWriter,
  // @ts-ignore
} from 'DenoStd/streams/mod.ts';

import {
  httpHeaders,
  resMessageStatus,
  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  type TypeObj001,

  UpdateFileSRI,
  // @ts-ignore
} from './UpdateFileSRI.esm.mts';

type TypeResultObj001 = {
  noWriteFile: Array<TypeObj001>;
  writeFile: Array<TypeObj001>;
};

async function GetUpdateFileSRIHandle( request: Request, files: Array<File | Blob> ): Promise<Array<TypeObj001>>{
  // @ts-ignore
  return await Array.fromAsync( files.map( ( file: File | Blob ): Promise<TypeObj001> => UpdateFileSRI( request, file, file._name ) ) );
}

async function WriteFileHandle( request: Request, files: Array<File | Blob> ): Promise<TypeResultObj001>{
  const updateFileSRI: Array<TypeObj001> = await GetUpdateFileSRIHandle( request, files );

  const noWriteFile: Array<TypeObj001> = updateFileSRI.filter(
      (
        {
          isWriteFile,
        }: TypeObj001,
      ): boolean => !isWriteFile
    ),
    writeFile: Array<TypeObj001> = updateFileSRI.filter(
      (
        {
          isWriteFile,
        }: TypeObj001,
      ): boolean => isWriteFile
    );

  // @ts-ignore
  const fileOpen: Array<Promise<Deno.FsFile>> = writeFile.map(
      (
        {
          fileInfo: {
            savePath,
          },
        }: TypeObj001,
        // @ts-ignore
      ): Promise<Deno.FsFile> => Deno.open( new URL( savePath ), {
        write: true,
        create: true,
      } )
    ),
    // @ts-ignore
    arr001: Array<Deno.FsFile> = await Array.fromAsync( fileOpen );

  const arr002: Array<Promise<void>> = arr001.map(
      (
        // @ts-ignore
        item: Deno.FsFile,
        index: number,
      ): Promise<void> => ( ( writeFile[ index ] as TypeObj001 ).file as File ).stream()
      .pipeTo( writableStreamFromWriter( item ) )
    ),
    // @ts-ignore
    arr003: Array<void> = await Array.fromAsync( arr002 );

  return {
    noWriteFile,
    writeFile,
  };
}

async function UploadByMultiple( request: Request ): Promise<Response>{
  const _request: Request = request.clone();

  let result001: string = JSON.stringify( {
    data: {
      success: false,
      message: `body为空，未上传任何数据。`,
    },
    messageStatus: resMessageStatus[ 1000 ],
  } );

  const contentType = ( _request.headers.get( 'content-type' ) ?? '' ).trim().toLowerCase();

  if( _request.body && contentType.startsWith( 'multipart/form-data;' ) ){
    let formData: FormData;

    try{
      formData = await _request.formData();

      const quantity: number = ( formData.get( 'quantity' ) ?? 0 ) as number,
        files001: Array<File | Blob | string | null> = [];

      let file001: File | Blob | string | null,
        fileName001: string = '',
        str001: string = '';

      for(
        let i = 0;
        i < quantity;
        ++i
      ){
        file001 = formData.get( `file${ i }` );
        fileName001 = ( ( formData.get( `fileName${ i }` ) ?? '' ) as string ).trim();
        str001 = Object.prototype.toString.call( file001 );

        if( ( str001 === '[object File]' || str001 === '[object Blob]' ) && fileName001.length !== 0 ){
          // @ts-ignore
          file001._name = fileName001;
        }
        else if( str001 === '[object File]' && fileName001.length === 0 ){
          // @ts-ignore
          file001._name = file001.name;
        }
        else if( str001 === '[object Blob]' && fileName001.length === 0 ){
          // @ts-ignore
          file001._name = `Blob_File`;
        }

        files001.push( file001 );
      }

      const files: Array<File | Blob> = ( [
        ...( (): Array<File | Blob | string | null> => {
          return formData.getAll( 'files' )
          .map( ( item: File | Blob | string | null, ): File | Blob | string | null => {
            if( Object.prototype.toString.call( item ) === '[object File]' ){
              // @ts-ignore
              item._name = ( item as File ).name;
            }
            else if( Object.prototype.toString.call( item ) === '[object Blob]' ){
              // @ts-ignore
              item._name = `Blob_File`;
            }

            return item;
          } );
        } )(),
        ...files001,
      ].filter( ( item: File | Blob | string | null, ): boolean => Object.prototype.toString.call( item ) === '[object File]' || Object.prototype.toString.call( item ) === '[object Blob]' ) ) as Array<File | Blob>;

      const {
        noWriteFile,
        writeFile,
      }: TypeResultObj001 = await WriteFileHandle( _request, files );

      const noWriteFileInfo: Array<{ message: string; filePath: string; }> = [],
        writeFileInfo: Array<{ message: string; filePath: string; }> = [];

      noWriteFile.forEach(
        (
          {
            fileInfo: {
              filePath,
              fileType,
            },
            file,
          }: TypeObj001,
        ): void => {
          noWriteFileInfo.push( {
            // @ts-ignore
            message: `已存在跟此文件（${ file.name }，文件类型：${ fileType }）的SRI值一致的文件，故本次上传不写入此文件。`,
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
            },
            file,
          }: TypeObj001,
        ): void => {
          writeFileInfo.push( {
            // @ts-ignore
            message: `文件（${ file.name }，文件类型：${ fileType }）上传成功。`,
            filePath: `${ filePath }`,
          } );
        }
      );

      result001 = JSON.stringify( {
        data: {
          success: true,
          noWriteFile: noWriteFileInfo,
          writeFile: writeFileInfo,
        },
        messageStatus: resMessageStatus[ 200 ],
      } );
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
      ...httpHeaders,
      'content-type': 'application/json; charset=utf-8',
    },
  } );
}

export default UploadByMultiple;
