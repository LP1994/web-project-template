/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForUploadFileStorage.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之文件的存储。
 */

'use strict';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

async function GraphQLServerForUploadFileStorage(
  fileStream: AsyncIterable<Uint8Array>,
  filepath: string | URL,
  maxFileSize: number,
): Promise<number>{
  const file: Deno.FsFile = await Deno.open( filepath, {
    createNew: true,
    write: true,
  } );

  let size: number = 0;

  try{
    for await ( const chunk of
      fileStream ){
      size += chunk.byteLength;

      if( size > maxFileSize ){
        errorWriteStream.write( `
GraphQLServerForUploadFileStorage：
单个文件的大小不能超过程序设定的最大值，当前程序设置的最大值为（单位为字节）：${ maxFileSize }。
` );

        throw new Error( `单个文件的大小不能超过程序设定的最大值，当前程序设置的最大值为（单位为字节）：${ maxFileSize }。` );
      }

      let offset: number = 0;

      while( offset < chunk.byteLength ){
        const written: number = await file.write( chunk.subarray( offset ) );

        if( written <= 0 ){
          errorWriteStream.write( `
GraphQLServerForUploadFileStorage：
写入数据量小于等于0！写入文件失败！
` );

          throw new Error( '写入数据量小于等于0！写入文件失败！' );
        }

        offset += written;
      }
    }

    return size;
  }
  catch( error: unknown ){
    errorWriteStream.write( `
GraphQLServerForUploadFileStorage：
文件写入失败：${ ( error as Error ).message }
` );

    throw new Error( ( error as Error ).message );
  }
  finally{
    file.close();
  }
}

export {
  GraphQLServerForUploadFileStorage,
};

export default {
  GraphQLServerForUploadFileStorage,
};
