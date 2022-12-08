/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/upload_resources_service/DBHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-09 04:15:34 星期五
 */

/**
 * 数据库相关的操作。
 */

'use strict';

import {
  type TypeMongoDBConnect,

  ObjectId,
  Collection,

  MongoDBConnectForSingleton,

  // @ts-ignore
} from 'mongo/MongoDBConnect.esm.mts';

type TypeUpdateOneForResult = {
  modifiedCount: number;
  matchedCount: number;
  upsertedCount: number;
  upsertedId: ObjectId | undefined;
};

export interface FileSRICollectionSchema {
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

/**
 * 插入一个新的自定义的文件FileSRI对象的文档数据。
 *
 * @param {FileSRICollectionSchema} fileSRI 自定义的文件FileSRI对象，必需。
 *
 * @returns {Promise<string>} 返回一个字符串，它表示刚刚插入的文档数据在成功后所生成的新的“_id”属性的字符串形式的值。注意，通过“deno_mongo”这个数据库驱动工具所操作的结果里，新增的文档中的“_id”属性值类型并不是string，而是“deno_mongo”自定义的一个名为ObjectId类型。
 */
async function Insert( fileSRI: FileSRICollectionSchema ): Promise<string>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const fileSRICollection: Collection<FileSRICollectionSchema> = mongoDB.collection<FileSRICollectionSchema>( 'upload_file_sri' );

  const insertedId: ObjectId = ( await fileSRICollection.insertOne( fileSRI ) ) as ObjectId;

  mongoDBClient.close();

  return insertedId.toString();
}

/**
 * 根据文件的sri值删除数据库中的一个自定义的文件FileSRI对象的文档数据。
 *
 * @param {string} sri 文件的sri值，必需。
 *
 * @returns {Promise<boolean>} true表示删除成功，反之失败。
 */
async function Delete( sri: string ): Promise<boolean>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const fileSRICollection: Collection<FileSRICollectionSchema> = mongoDB.collection<FileSRICollectionSchema>( 'upload_file_sri' );

  const deleteCount: number = await fileSRICollection.deleteOne( {
    sri,
  }, {
    limit: 1,
  } );

  mongoDBClient.close();

  return deleteCount === 1;
}

/**
 * 根据文件的sri值更新一个自定义的文件FileSRI对象的文档数据。
 *
 * @param {FileSRICollectionSchema} fileSRI 自定义的文件FileSRI对象，必需。
 *
 * @returns {Promise<boolean>} true表示更新成功，反之失败。
 */
async function Update( fileSRI: FileSRICollectionSchema ): Promise<boolean>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const fileSRICollection: Collection<FileSRICollectionSchema> = mongoDB.collection<FileSRICollectionSchema>( 'upload_file_sri' );

  const result: TypeUpdateOneForResult = await fileSRICollection.updateOne( {
    sri: fileSRI[ 'sri' ],
  }, {
    $set: fileSRI,
  }, {
    multi: false,
    upsert: true,
  } );

  mongoDBClient.close();

  return Number( result.modifiedCount ) === 1 && Number( result.matchedCount ) === 1;
}

/**
 * 根据文件的sri值查找对应的自定义的文件FileSRI对象的文档数据。
 *
 * @param {string} sri 文件的sri值，必需。
 *
 * @returns {Promise<FileSRICollectionSchema|undefined>} 返回undefined表示没找到对应的文档数据，反之，会返回一个自定义的文件FileSRI对象的文档数据。
 */
async function Query( sri: string ): Promise<FileSRICollectionSchema | undefined>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const fileSRICollection: Collection<FileSRICollectionSchema> = mongoDB.collection<FileSRICollectionSchema>( 'upload_file_sri' );

  const fileSRI: FileSRICollectionSchema | undefined = await fileSRICollection.findOne( {
    sri,
  }, {
    projection: {
      // 这种属于文档的内置属性是可以设置成0、1的，0表示结果中不要包含该内置属性，1表示结果中一定要包含该内置属性。
      _id: 0,
    },
  } );

  mongoDBClient.close();

  return fileSRI;
}

export {
  Insert,
  Delete,
  Update,
  Query,
};

export default {
  Insert,
  Delete,
  Update,
  Query,
};
