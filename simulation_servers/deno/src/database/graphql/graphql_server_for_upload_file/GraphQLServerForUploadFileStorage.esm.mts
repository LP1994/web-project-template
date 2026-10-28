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
  ensureDir,
} from 'deno_std_fs';

import {
  extname,
  join,
} from 'deno_std_path';

import {
  uploadDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_GraphQLUploadFile,
} from './GraphQLServerForUploadFile.esm.mts';

/**
 * 用于限制单文件大小。单位为字节。<br />
 * 当前设置为：100GB。<br />
 *
 * @type {number}
 */
const MAX_FILE_SIZE: number = 100 * 1024 * 1024 * 1024;

/**
 * 用于保存上传文件的文件夹路径。表示上传的文件最后都是保存在哪个文件夹下。
 *
 * @type {URL}
 */
const uploadDirectory: URL = new URL( uploadDir );

async function CreateUploadFile(
  filename: string,
  mimetype: string,
): Promise<{
  file: T_GraphQLUploadFile;
  writer: Deno.FsFile;
}>{
  await ensureDir( uploadDirectory );

  // TODO 除了根据文件名来获取文件扩展名，最好还是要从文件本身的流信息中获取到真正的文件扩展名。
  const ext: string = extname( filename );

  const safeFilename: string = `${ crypto.randomUUID() }${ ext }`;

  const filepath: string = join( uploadDirectory, safeFilename, );

  const writer: Deno.FsFile = await Deno.open( filepath, {
    // 可以避免覆盖已有文件。
    createNew: true,
    // read: true,
    write: true,
  } );

  const file: T_GraphQLUploadFile = {
    filename,
    mimetype,
    encoding: 'binary',
    size: 0,
    filepath,
  };

  return {
    file,
    writer,
  };
}

export {
  CreateUploadFile,
  MAX_FILE_SIZE,
};

export default {
  CreateUploadFile,
  MAX_FILE_SIZE,
};
