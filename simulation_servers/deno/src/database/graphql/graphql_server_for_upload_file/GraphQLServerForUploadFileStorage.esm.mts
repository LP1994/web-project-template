/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForUploadFileStorage.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之保存客户端上传的文件。
 */

'use strict';

import {
  createHash,
} from 'node:crypto';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import {
  IsAsyncFun,
  IsAsyncGeneratorFun,
  IsFunction,
  IsGeneratorFun,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 * 保存客户端上传的文件。
 *
 * @param {AsyncIterable<Uint8Array>} fileStream 客户端上传上来的文件数据。
 *
 * @param {string | URL} filePath 保存在磁盘上的文件路径。
 *
 * @param {number} maxFileSize 用于限制单个文件的大小。单位是字节。
 *
 * @param {{onFileCreated?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void, onFileWriting?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, chunk: Uint8Array, currentFileWritedSize: number) => void, onFileWrited?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, fileSize: number) => void, onFileClosed?: (file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void}} param3
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void} param3.onFileCreated 该函数会在文件创建成功后被调用，注意！这个阶段，文件是还没写入任何数据的，仅是创建并打开了该文件。<br />
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, chunk: Uint8Array, currentFileWritedSize: number) => void} param3.onFileWriting 该函数会在每次文件写入一部分数据后被调用。<br />
 * PS：<br />
 * 1、函数参数currentFileWritedSize：表示当前文件已经写入的总数据大小（单位为字节）。<br />
 * 2、函数参数chunk：表示当前这次写入文件的数据块，想知道当前这次写入文件的数据块的大小，可以通过chunk.byteLength获取，其单位为字节。<br />
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>, fileSize: number) => void} param3.onFileWrited 该函数会在文件写入全部数据完成后被调用。<br />
 * PS：<br />
 * 1、函数参数fileSize：表示文件写入全部数据完成后，文件的大小（单位为字节）。<br />
 * @param {(file: Deno.FsFile, filePath: (string | URL), fileStream: AsyncIterable<Uint8Array>) => void} param3.onFileClosed 该函数会在文件关闭后被调用。<br />
 *
 * @returns {Promise<number>}
 */
async function GraphQLServerForUploadFileStorage(
  fileStream: AsyncIterable<Uint8Array>,
  filePath: string | URL,
  maxFileSize: number,
  {
    onFileCreated = (): void => {
    },
    onFileWriting = (): void => {
    },
    onFileWrited = (): void => {
    },
    onFileClosed = (): void => {
    },
  }: {
    onFileCreated?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array> ) => void;
    onFileWriting?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array>, chunk: Uint8Array, currentFileWritedSize: number ) => void;
    onFileWrited?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array>, fileSize: number ) => void;
    onFileClosed?: ( file: Deno.FsFile, filePath: string | URL, fileStream: AsyncIterable<Uint8Array> ) => void;
  } = {},
): Promise<number>{
  let file: Deno.FsFile | undefined;

  try{
    file = await Deno.open( filePath, {
      createNew: true,
      write: true,
    } );

    if( IsAsyncFun( onFileCreated ) || IsAsyncGeneratorFun( onFileCreated ) ){
      await onFileCreated( file, filePath, fileStream );
    }
    else if( IsFunction( onFileCreated ) || IsGeneratorFun( onFileCreated ) ){
      onFileCreated( file, filePath, fileStream );
    }

    let size: number = 0;

    for await ( const chunk of
      fileStream ){
      if( chunk.byteLength === 0 ){
        continue;
      }

      size += chunk.byteLength;

      if( size > maxFileSize ){
        errorWriteStream.write( `
GraphQLServerForUploadFileStorage.esm.mts--->GraphQLServerForUploadFileStorage：
所要保存的文件的大小不能超过程序设定的最大值，当前程序设置的最大值为（单位为字节）：${ maxFileSize }。
` );

        throw new Error( `所要保存的文件的大小不能超过程序设定的最大值，当前程序设置的最大值为（单位为字节）：${ maxFileSize }。` );
      }

      let offset: number = 0;

      while( offset < chunk.byteLength ){
        const written: number = await file.write( chunk.subarray( offset ) );

        if( written <= 0 ){
          errorWriteStream.write( `
GraphQLServerForUploadFileStorage.esm.mts--->GraphQLServerForUploadFileStorage：
文件写入数据失败：write() 未写入任何字节！
` );

          throw new Error( '文件写入数据失败：write() 未写入任何字节！' );
        }

        offset += written;

        if( IsAsyncFun( onFileWriting ) || IsAsyncGeneratorFun( onFileWriting ) ){
          await onFileWriting( file, filePath, fileStream, chunk, size );
        }
        else if( IsFunction( onFileWriting ) || IsGeneratorFun( onFileWriting ) ){
          onFileWriting( file, filePath, fileStream, chunk, size );
        }
      }
    }

    if( IsAsyncFun( onFileWrited ) || IsAsyncGeneratorFun( onFileWrited ) ){
      await onFileWrited( file, filePath, fileStream, size );
    }
    else if( IsFunction( onFileWrited ) || IsGeneratorFun( onFileWrited ) ){
      onFileWrited( file, filePath, fileStream, size );
    }

    return size;
  }
  catch( error: unknown ){
    errorWriteStream.write( `
GraphQLServerForUploadFileStorage.esm.mts--->GraphQLServerForUploadFileStorage，文件写入失败：
文件路径：${ String( filePath ) }
错误信息：${ error instanceof Error
            ? error.message
            : String( error ) }
` );

    throw error;
  }
  finally{
    if( file ){
      ( file as Deno.FsFile ).close();

      onFileClosed( file, filePath, fileStream );
    }
  }
}

export {
  GraphQLServerForUploadFileStorage,
};

export default {
  GraphQLServerForUploadFileStorage,
};
