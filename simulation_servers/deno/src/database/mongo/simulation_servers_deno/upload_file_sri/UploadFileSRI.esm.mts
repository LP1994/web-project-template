/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/simulation_servers_deno/upload_file_sri/UploadFileSRI.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:33:39 星期三
 */

'use strict';

import {
  type HydratedDocument as T_HydratedDocument,

  Model,
  Schema,
} from 'npm:mongoose';

import {
  GetSchemaOptions,
} from 'mongo/tools/MongooseConfig.esm.mts';

import {
  type T_MongooseConnectForSingleton,

  MyMongooseConnection,
  MongooseConnectForSingleton,
} from 'mongo/tools/MongooseConnect.esm.mts';

export interface I_UploadFileSRISchema {

  __v?: number;

  _id?: Schema.Types.ObjectId;

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

export type T_QueryOneResult = T_HydratedDocument<I_UploadFileSRISchema> | null;

type T_GenerateModel = {
  MyMongooseConnection: MyMongooseConnection;

  UploadFileSRI: Model<
    I_UploadFileSRISchema
  >;
};

const collectionName: string = 'upload_file_sri';

async function GenerateModel(): Promise<T_GenerateModel>{
  const {
    MyMongooseConnection,
    MongooseClient,
  }: T_MongooseConnectForSingleton = await MongooseConnectForSingleton();

  // 创建一个“Schema”，相当于定义了面向对象编程中的一个“接口”。
  const UploadFileSRISchema: Schema<
    I_UploadFileSRISchema
  > = new Schema<
    I_UploadFileSRISchema
  >(
    /**
     * 为这个“Schema”（相当于面向对象编程中的“接口”）添加“属性”。
     * SchemaType Options：
     * https://mongoosejs.com/docs/schematypes.html#schematype-options
     */
    {
      // 表示使用的是哪种哈希算法来计算文件的SRI值，当前使用的是"SHA3-512"。
      shaType: {
        type: String,
        default: 'SHA3-512',
        required: true,
        trim: true,
        minLength: 1,
      },

      // 文件的SRI值，全是小写字母组成的。
      sri: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
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
    // 为这个“Schema”（相当于面向对象编程中的“接口”）添加“方法”，如：“实例方法”、“静态方法”、“查询帮助方法”。
    {
      ...GetSchemaOptions( collectionName ),
    }
  );

  // 根据上面创建的“Schema”（相当于面向对象编程中的“接口”），生成一个对应的“Model”，其相当于面向对象编程中的“类”，并且这个类是实现了上面创建的“接口”，也就是一个Collection（相当于一张表）。
  const UploadFileSRI: Model<
    I_UploadFileSRISchema
  > = MongooseClient.model<
    I_UploadFileSRISchema
  >(
    /**
     * 第1个参数是你的model的collection的单数名称。Mongoose会自动寻找你的model名称的复数，小写版本。
     * 因此，“model（模型）”Kitten是为数据库中的kittens集合准备的。
     */
    collectionName,
    // schema
    UploadFileSRISchema,
    // 这个参数表示要在数据库里表示的“集合名”，不存在就会创建这个集合。
    collectionName
  );

  return {
    MyMongooseConnection,
    UploadFileSRI,
  };
}

/**
 * 插入一个新的自定义的文件FileSRI对象的文档数据。
 *
 * @param {I_UploadFileSRISchema} fileSRI 自定义的文件FileSRI对象，必需。
 *
 * @returns {Promise<string>} 返回一个字符串，它表示刚刚插入的文档数据在成功后所生成的新的“_id”属性的字符串形式的值。
 */
export async function InsertOne( fileSRI: I_UploadFileSRISchema ): Promise<string>{
  const {
    MyMongooseConnection,
    UploadFileSRI,
  }: T_GenerateModel = await GenerateModel();

  const uploadFileSRI: T_HydratedDocument<I_UploadFileSRISchema> = new UploadFileSRI( fileSRI );

  await uploadFileSRI.save();

  await MyMongooseConnection.myClose( true );

  return uploadFileSRI._id.toString();
}

export async function DeleteOne(){

}

export async function UpdateOne(){

}

/**
 * 根据文件的sri值查找对应的自定义的文件FileSRI对象的文档数据。
 *
 * @param {string} sri 文件的sri值，必需。
 *
 * @returns {Promise<T_QueryOneResult>} 返回null表示没找到对应的文档数据，反之，会返回一个自定义的文件FileSRI对象的文档数据。
 */
export async function QueryOne( sri: string ): Promise<T_QueryOneResult>{
  const {
    MyMongooseConnection,
    UploadFileSRI,
  }: T_GenerateModel = await GenerateModel();

  const uploadFileSRI: T_QueryOneResult = await UploadFileSRI.findOne(
    {
      sri,
    },
    {
      // 这种属于文档的内置属性是可以设置成0、1的，0表示结果中不要包含该内置属性，1表示结果中一定要包含该内置属性。
      _id: 0,
      __v: 0,
    },
  ).exec();

  await MyMongooseConnection.myClose( true );

  return uploadFileSRI;
}

export default {
  InsertOne,
  DeleteOne,
  UpdateOne,
  QueryOne,
};
