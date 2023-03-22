/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/tools/CRUDForMongoDB.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-11 12:47:57 星期日
 */

/**
 * 通用的无关特定数据库、特定集合的用于数据库“CRUD”的公共工具。
 */

'use strict';

import {
  type ObjectId,
  type Collection,
  type Filter,
  type FindOptions,
  type UpdateFilter,
  type UpdateOptions,
  type DeleteOptions,
  type InsertOptions,
  type InsertDocument,
  type FindCursor,
} from 'mongo/mongo_types.esm.mts';

import {
  type TypeMongoDBConnect,

  MongoDBConnectForSingleton,
} from 'mongo/MongoDBConnect.esm.mts';

export type TypeArgsForFindOne = {

  options?: FindOptions;

  [ key: string ]: any;

};

export type TypeArgsForUpdateOne = {

  options?: UpdateOptions;

  [ key: string ]: any;

};

export type TypeArgsForDeleteOne = {

  options?: DeleteOptions;

  [ key: string ]: any;

};

export type TypeArgsForInsertOne = {

  options?: InsertOptions;

  [ key: string ]: any;

};

/**
 * matchedCount：与“查找条件”匹配的文档数。
 * modifiedCount：修改的文档数。
 * upsertedCount：“更新插入”的文档数。
 * upsertedId：如果发生“更新插入”，则该字段表示插入文档的“_id”。
 */
export type TypeResultForUpdateOne = {

  /**
   * 与“查找条件”匹配的文档数。
   */
  matchedCount: number;

  /**
   * 修改的文档数。
   */
  modifiedCount: number;

  /**
   * “更新插入”的文档数。
   */
  upsertedCount: number;

  /**
   * 如果发生“更新插入”，则该字段表示插入文档的“_id”。
   */
  upsertedId: ObjectId | undefined;

};

/**
 * matchedCount：与“查找条件”匹配的文档数。
 * modifiedCount：修改的文档数。
 * upsertedCount：“更新插入”的文档数。
 * upsertedIds：如果发生“更新插入”，则该字段表示插入文档的“_id”数组。
 */
export type TypeResultForUpdate = {

  /**
   * 与“查找条件”匹配的文档数。
   */
  matchedCount: number;

  /**
   * 修改的文档数。
   */
  modifiedCount: number;

  /**
   * “更新插入”的文档数。
   */
  upsertedCount: number;

  /**
   * 如果发生“更新插入”，则该字段表示插入文档的“_id”数组。
   */
  upsertedIds: ObjectId[] | undefined;

};

/**
 * insertedIds：插入的多个文档的“_id”数组。
 * insertedCount：插入的文档数。
 */
export type TypeResultForInsert = {

  /**
   * 插入的多个文档的“_id”数组。
   */
  insertedIds: ObjectId[];

  /**
   * 插入的文档数。
   */
  insertedCount: number;

};

export interface InterfaceConstraint001 {

  _id?: ObjectId;

  [ key: string ]: any;

}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名插入一个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {InsertDocument<T>} insertDocument 插入的一个新文档数据，必需。
 *
 * @param {TypeArgsForInsertOne} args 其他参数，里面包含供“insertOne”使用的options参数，可选。
 *
 * @param {InsertOptions} args.options 供“insertOne”使用的配置参数，可选。
 *
 * @returns {Promise<ObjectId>} 返回一个名为ObjectId类型的值，通过“deno_mongo”这个数据库驱动工具所操作的结果里，新增的文档中的“_id”属性值类型并不是string，而是“deno_mongo”自定义的一个名为ObjectId类型。
 */
async function InsertOne<T extends InterfaceConstraint001>( collectionName: string, insertDocument: InsertDocument<T>, args?: TypeArgsForInsertOne ): Promise<ObjectId>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: ObjectId;

  if( args && args.options ){
    result = ( await collectionHandle.insertOne( insertDocument, args.options ) ) as ObjectId;
  }
  else{
    result = ( await collectionHandle.insertOne( insertDocument ) ) as ObjectId;
  }

  mongoDBClient.close();

  return result;
}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名插入多个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {InsertDocument<T>[]} insertDocuments 插入的多个文档数据，必需。
 *
 * @param {TypeArgsForInsertOne} args 其他参数，里面包含供“insertMany”使用的options参数，可选。
 *
 * @param {InsertOptions} args.options 供“insertMany”使用的配置参数，可选。
 *
 * @returns {Promise<TypeResultForInsert>} 返回一个结果对象：{ insertedIds: 插入的多个文档的“_id”数组, insertedCount: 插入的文档数, }。
 */
async function Insert<T extends InterfaceConstraint001>( collectionName: string, insertDocuments: InsertDocument<T>[], args?: TypeArgsForInsertOne ): Promise<TypeResultForInsert>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: TypeResultForInsert;

  if( args && args.options ){
    result = ( await collectionHandle.insertMany( insertDocuments, args.options ) ) as TypeResultForInsert;
  }
  else{
    result = ( await collectionHandle.insertMany( insertDocuments ) ) as TypeResultForInsert;
  }

  mongoDBClient.close();

  return result;
}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名删除一个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {Filter<T>} filter 查找条件，必需。
 *
 * @param {TypeArgsForDeleteOne} args 其他参数，里面包含供“deleteOne”使用的options参数，可选。
 *
 * @param {DeleteOptions} args.options 供“deleteOne”使用的配置参数，可选。
 *
 * @returns {Promise<number>} 被删除的文档数。
 */
async function DeleteOne<T extends InterfaceConstraint001>( collectionName: string, filter: Filter<T>, args?: TypeArgsForDeleteOne ): Promise<number>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: number;

  if( args && args.options ){
    result = await collectionHandle.deleteOne( filter, args.options );
  }
  else{
    result = await collectionHandle.deleteOne( filter );
  }

  mongoDBClient.close();

  return result;
}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名删除多个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {Filter<T>} filter 查找条件，必需。
 *
 * @param {TypeArgsForDeleteOne} args 其他参数，里面包含供“deleteMany”使用的options参数，可选。
 *
 * @param {DeleteOptions} args.options 供“deleteMany”使用的配置参数，可选。
 *
 * @returns {Promise<number>} 被删除的文档数。
 */
async function Delete<T extends InterfaceConstraint001>( collectionName: string, filter: Filter<T>, args?: TypeArgsForDeleteOne ): Promise<number>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: number;

  if( args && args.options ){
    result = await collectionHandle.deleteMany( filter, args.options );
  }
  else{
    result = await collectionHandle.deleteMany( filter );
  }

  mongoDBClient.close();

  return result;
}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名更新一个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {Filter<T>} filter 查找条件，必需。
 *
 * @param {UpdateFilter<T>} update 更新数据，必需。
 *
 * @param {TypeArgsForUpdateOne} args 其他参数，里面包含供“updateOne”使用的options参数，可选。
 *
 * @param {UpdateOptions} args.options 供“updateOne”使用的配置参数，可选。
 *
 * @returns {Promise<TypeResultForUpdateOne>} 返回一个结果对象：{ matchedCount: 与“查找条件”匹配的文档数, modifiedCount: 修改的文档数, upsertedCount: “更新插入”的文档数, upsertedId: 如果发生“更新插入”，则该字段表示插入文档的“_id” }。
 */
async function UpdateOne<T extends InterfaceConstraint001>( collectionName: string, filter: Filter<T>, update: UpdateFilter<T>, args?: TypeArgsForUpdateOne ): Promise<TypeResultForUpdateOne>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: TypeResultForUpdateOne;

  if( args && args.options ){
    result = await collectionHandle.updateOne( filter, update, args.options );
  }
  else{
    result = await collectionHandle.updateOne( filter, update );
  }

  mongoDBClient.close();

  return result;
}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名更新多个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {Filter<T>} filter 查找条件，必需。
 *
 * @param {UpdateFilter<T>} update 更新数据，必需。
 *
 * @param {TypeArgsForUpdateOne} args 其他参数，里面包含供“updateMany”使用的options参数，可选。
 *
 * @param {UpdateOptions} args.options 供“updateMany”使用的配置参数，可选。
 *
 * @returns {Promise<TypeResultForUpdate>} 返回一个结果对象：{ matchedCount: 与“查找条件”匹配的文档数, modifiedCount: 修改的文档数, upsertedCount: “更新插入”的文档数, upsertedIds: 如果发生“更新插入”，则该字段表示插入文档的“_id”数组 }。
 */
async function Update<T extends InterfaceConstraint001>( collectionName: string, filter: Filter<T>, update: UpdateFilter<T>, args?: TypeArgsForUpdateOne ): Promise<TypeResultForUpdate>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: TypeResultForUpdate;

  if( args && args.options ){
    result = await collectionHandle.updateMany( filter, update, args.options );
  }
  else{
    result = await collectionHandle.updateMany( filter, update );
  }

  mongoDBClient.close();

  return result;
}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名查找一个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {Filter<T>} filter 查找条件，可选。
 *
 * @param {TypeArgsForFindOne} args 其他参数，里面包含供“findOne”使用的options参数，可选。
 *
 * @param {FindOptions} args.options 供“findOne”使用的配置参数，可选。
 *
 * @returns {Promise<T | undefined>} 如果找到匹配查找条件的文档就返回找到的所有文档数据中的第1个文档数据，否则会返回undefined，表示没找到符合查找条件的。
 */
async function QueryOne<T extends InterfaceConstraint001>( collectionName: string, filter?: Filter<T>, args?: TypeArgsForFindOne ): Promise<T | undefined>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: T | undefined = undefined;

  if( filter && args && args.options ){
    result = await collectionHandle.findOne( filter, args.options );
  }
  else if( filter && !args ){
    result = await collectionHandle.findOne( filter );
  }
  else if( !filter && args && args.options ){
    result = await collectionHandle.findOne( {}, args.options );
  }
  else{
    result = await collectionHandle.findOne();
  }

  mongoDBClient.close();

  return result;
}

/**
 * 支持泛型参数（用于描述“集合collection”的）的根据指定的集合名查找多个文档数据。
 *
 * @param {string} collectionName 集合名，必需。
 *
 * @param {Filter<T>} filter 查找条件，可选。
 *
 * @param {TypeArgsForFindOne} args 其他参数，里面包含供“find”使用的options参数，可选。
 *
 * @param {FindOptions} args.options 供“find”使用的配置参数，可选。
 *
 * @returns {FindCursor<T>} 返回一个游标，具体使用见“FindCursor”的描述。
 */
async function Query<T extends InterfaceConstraint001>( collectionName: string, filter?: Filter<T>, args?: TypeArgsForFindOne ): Promise<FindCursor<T>>{
  const {
    mongoDBClient,
    mongoDB,
  }: TypeMongoDBConnect = await MongoDBConnectForSingleton();

  const collectionHandle: Collection<T> = mongoDB.collection<T>( collectionName );

  let result: FindCursor<T>;

  if( filter && args && args.options ){
    result = await collectionHandle.find( filter, args.options );
  }
  else if( filter && !args ){
    result = await collectionHandle.find( filter );
  }
  else if( !filter && args && args.options ){
    result = await collectionHandle.find( {}, args.options );
  }
  else{
    result = await collectionHandle.find();
  }

  mongoDBClient.close();

  return result;
}

export {
  InsertOne,
  Insert,

  DeleteOne,
  Delete,

  UpdateOne,
  Update,

  QueryOne,
  Query,
};

export default {
  InsertOne,
  Insert,

  DeleteOne,
  Delete,

  UpdateOne,
  Update,

  QueryOne,
  Query,
};
