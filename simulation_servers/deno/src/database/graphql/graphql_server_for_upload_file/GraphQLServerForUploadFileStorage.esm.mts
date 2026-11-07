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

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 * 保存客户端上传的文件。
 *
 * @param {AsyncIterable<Uint8Array>} fileStream
 *
 * @param {string | URL} filePath
 *
 * @param {number} maxFileSize 用于限制单个文件的大小。单位是字节。
 *
 * @param {() => void} onFileCreated
 *
 * @returns {Promise<number>}
 */
async function GraphQLServerForUploadFileStorage(
  fileStream: AsyncIterable<Uint8Array>,
  filePath: string | URL,
  maxFileSize: number,
  onFileCreated?: () => void,
): Promise<number>{
  let file: Deno.FsFile | undefined;

  try{
    file = await Deno.open( filePath, {
      createNew: true,
      write: true,
    } );

    onFileCreated?.();

    let size: number = 0;

    for await ( const chunk of
      fileStream ){
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
      }
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
    file?.close();
  }
}

export {
  GraphQLServerForUploadFileStorage,
};

export default {
  GraphQLServerForUploadFileStorage,
};
