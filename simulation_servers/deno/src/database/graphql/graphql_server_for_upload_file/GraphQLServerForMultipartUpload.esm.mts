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
  type T_GraphQLServerForUploadFile,
} from './GraphQLServerForUploadFile.esm.mts';

interface T_GraphQLServerForMultipartFilePart {
  fieldName: string;
  file: T_GraphQLServerForUploadFile;
}

interface T_GraphQLServerForMultipartOperations {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  extensions?: Record<string, unknown>;
}

function GraphQLServerForIsMultipartRequest( request: Request ): boolean{
  return [
    'post',
  ].includes( request.method.toLowerCase() ) && ( request.headers.get( 'content-type' ) ?? '' ).toLowerCase().startsWith( 'multipart/form-data' );
}

export {
  type T_GraphQLServerForMultipartFilePart,
  type T_GraphQLServerForMultipartOperations,

  GraphQLServerForIsMultipartRequest,
};

export default {
  GraphQLServerForIsMultipartRequest,
};
