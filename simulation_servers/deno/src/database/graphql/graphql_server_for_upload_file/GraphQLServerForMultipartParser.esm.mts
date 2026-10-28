/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForMultipartParser.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之multipart解析器。
 */

'use strict';

/**
 * 解析器的接口。
 */
interface T_GraphQLServerForMultipartPart {
  headers: Headers;
  name: string;
  filename?: string;
  mimetype?: string;
  body: ReadableStream<Uint8Array<ArrayBuffer>>;
}

/**
 * 解析器parse的定义。
 */
interface T_GraphQLServerForMultipartParser {
  parse( request: Request, ): AsyncIterable<T_GraphQLServerForMultipartPart>;
}

export {
  type T_GraphQLServerForMultipartParser,
  type T_GraphQLServerForMultipartPart,
};

export default {};
