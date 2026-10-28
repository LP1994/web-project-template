/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForMultipartUpload.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之文件上传中间层。
 */

'use strict';

import {
  basename,
  extname,
  join,
} from 'deno_std_path';

import {
  type T_GraphQLUploadFile,
  type T_GraphQLUploadFileOptions,

  DEFAULT_UPLOAD_DIR,
  DEFAULT_MAX_HEADER_SIZE,
  DEFAULT_MAX_HEADER_PAIRS,
  DEFAULT_MAX_PARTS,
  DEFAULT_MAX_FIELDS,
  DEFAULT_MAX_FIELD_NAME_SIZE,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_FIELD_SIZE,

  GetSafeFilename,
  GetStoredFilename,
} from './GraphQLServerForUploadFile.esm.mts';

import {
  GraphQLServerForWriteFileStream,
} from './GraphQLServerForUploadFileStorage.esm.mts';

import {
  GraphQLServerForMultipartParser,
} from './GraphQLServerForMultipartParser.esm.mts';

interface T_GraphQLServerForMultipartMap {
  [ fieldName: string ]: string[];
}

interface T_GraphQLServerForMultipartOperations {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  extensions?: Record<string, unknown>;
}

interface T_MultipartFilePart {
  fieldName: string;
  file: T_GraphQLUploadFile;
}

function IsMultipartRequest( request: Request ): boolean{
  return [
    'post',
  ].includes( request.method.toLowerCase() ) && ( request.headers.get( 'content-type' ) ?? '' ).toLowerCase().startsWith( 'multipart/form-data' );
}

export {
  type T_GraphQLServerForMultipartMap,
  type T_GraphQLServerForMultipartOperations,
  type T_MultipartFilePart,

  IsMultipartRequest,
};

export default {
  IsMultipartRequest,
};
