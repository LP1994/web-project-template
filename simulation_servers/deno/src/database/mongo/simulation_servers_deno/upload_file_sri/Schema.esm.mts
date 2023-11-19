/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/simulation_servers_deno/upload_file_sri/Schema.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-06-30 00:22:39 星期五
 */

/**
 * 针对集合“upload_file_sri”的Schema。
 */

'use strict';

import {
  Schema,
} from 'npm:mongoose';

import {
  GetSchemaOptions,
} from 'mongo/MongooseConfig.esm.mts';

export interface IFileSRI {

  // 表示使用的是哪种哈希算法来计算文件的SRI值，当前使用的是"SHA3-512"。
  shaType: string;

  // 文件的SRI值，全是小写字母组成的。
  sri: string;

  // 上传本文件时，发起的请求URL。
  requestURL: string;

  // 文件在服务端的存储路径。
  savePath: string;

  // 供客户端再次通过GET请求获取已经上传到服务器的文件的URL，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
  filePath: string;

  // 文件的媒体类型，值格式，如：“application/json”之类的。
  fileType: string;

  // 文件大小，单位为字节。
  fileSize: string;

  // 文件的修改时间或服务器开始写入文件的时间。
  fileLastModified: string;

  // 客户端上传的文件的原文件名（由客户端设置的），但可能没有，服务端会使用默认名给它。
  fileName: string;

}

const collectionName: string = 'upload_file_sri';

const FileSRISchema: Schema<
  IFileSRI
> = new Schema<
  IFileSRI
>(
  {
    // 表示使用的是哪种哈希算法来计算文件的SRI值，当前使用的是"SHA3-512"。
    shaType: {
      type: String,
      default: 'SHA3-512',
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 8,
    },
    // 文件的SRI值，全是小写字母组成的。
    sri: {
      type: String,
      required: true,
      trim: true,
      minLength: 128,
      maxLength: 128,
    },
    // 上传本文件时，发起的请求URL。
    requestURL: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    // 文件在服务端的存储路径。
    savePath: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    // 供客户端再次通过GET请求获取已经上传到服务器的文件的URL，值格式为“/simulation_servers_deno/upload/json/XXXXXX.json”，使用时直接发起GET请求“https://127.0.0.1:9200/simulation_servers_deno/upload/json/XXXXXX.json”即可获取到。
    filePath: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    // 文件的媒体类型，值格式，如：“application/json”之类的。
    fileType: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    // 文件大小，单位为字节。
    fileSize: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    // 文件的修改时间或服务器开始写入文件的时间。
    fileLastModified: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    // 客户端上传的文件的原文件名（由客户端设置的），但可能没有，服务端会使用默认名给它。
    fileName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
  },
  GetSchemaOptions<IFileSRI>( collectionName ),
);

export {
  collectionName,
  FileSRISchema,
};

export default {
  collectionName,
  FileSRISchema,
};
