/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForUploadFile.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能。
 */

'use strict';

import {
  basename,
  extname,
} from 'deno_std_path';

import {
  uploadDir,
} from 'configures/GlobalParameters.esm.mts';

/**
 * 一个文件对象，该对象里有关于文件的元数据和文件存储的磁盘路径、文件大小等等信息。<br />
 * 例子：<br />
 * ```ts
 * {
 *   filename: 'test.png',
 *   mimetype: 'image/png',
 *   encoding: 'binary',
 *   size: 102400,
 *   filepath: 'G:/WebStormWS/7788/1.png',
 * }
 * ```
 */
interface T_GraphQLUploadFile {
  filename: string;
  mimetype: string;
  encoding: '7bit' | '8bit' | 'binary';
  size: number;
  filepath: string;
}

interface T_GraphQLUploadFileOptions {
  /**
   * 上用于保存上传文件的文件夹路径。表示上传的文件最后都是保存在哪个文件夹下。
   *
   * @default new URL( uploadDir )
   */
  uploadDir?: string | URL;

  /**
   * 对于多部分表单，标题部分的最大尺寸。
   *
   * @default Infinity
   */
  maxHeaderSize?: number;

  /**
   * 对于多部分（multipart）表单，需解析的标头键值对的最大数量。
   *
   * @default Infinity
   */
  maxHeaderPairs?: number;

  /**
   * 对于多部分表单，最大部分数（字段 + 文件）。
   *
   * @default Infinity
   */
  maxParts?: number;

  /**
   * 非文件字段的最大数量。
   *
   * @default Infinity
   */
  maxFields?: number;

  /**
   * 字段名称的最大长度（以字节为单位）。
   *
   * @default Infinity
   */
  maxFieldNameSize?: number;

  /**
   * 用于限制单个文件的大小。单位为字节。
   *
   * @default Infinity
   */
  maxFileSize?: number;

  /**
   * 用于限制上传文件的数量。
   *
   * @default Infinity
   */
  maxFiles?: number;

  /**
   * 用于限制multipart中普通字段的最大字节数。
   *
   * @default Infinity
   */
  maxFieldSize?: number;

  /**
   * 文件保存成功后，生成对外访问URL。<br />
   */
  getFileUrl?: ( file: T_GraphQLUploadFile ) => string;
}

/**
 * 上用于保存上传文件的文件夹路径。表示上传的文件最后都是保存在哪个文件夹下。
 *
 * @type {string|URL}
 */
const DEFAULT_UPLOAD_DIR: URL = new URL( uploadDir );
/**
 * 对于多部分表单，标题部分的最大尺寸。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_HEADER_SIZE: number = Infinity;
/**
 * 对于多部分（multipart）表单，需解析的标头键值对的最大数量。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_HEADER_PAIRS: number = Infinity;
/**
 * 对于多部分表单，最大部分数（字段 + 文件）。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_PARTS: number = Infinity;
/**
 * 非文件字段的最大数量。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FIELDS: number = Infinity;
/**
 * 字段名称的最大长度（以字节为单位）。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FIELD_NAME_SIZE: number = Infinity;
/**
 * 用于限制单个文件的大小。单位为字节。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FILE_SIZE: number = Infinity;
/**
 * 用于限制上传文件的数量。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FILES: number = Infinity;
/**
 * 用于限制multipart中普通字段的最大字节数。<br />
 * 当前默认值设置为：Infinity。<br />
 *
 * @type {number}
 */
const DEFAULT_MAX_FIELD_SIZE: number = Infinity;

function GetSafeFilename( filename: string ): string{
  return basename( filename.replaceAll( '\\', '/' ) );
}

function GetStoredFilename( filename: string ): string{
  const extension: string = extname( GetSafeFilename( filename ) ).replaceAll( /[^a-zA-Z0-9.]/g, '' ).slice( 0, 20 );

  return `${ crypto.randomUUID() }${ extension }`;
}

export {
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
};

export default {
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
};
