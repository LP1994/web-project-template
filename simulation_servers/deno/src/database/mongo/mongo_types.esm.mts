/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/mongo_types.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-03-22 09:42:22 星期三
 */

'use strict';

// @ts-ignore 
import * as deno_mongo_deps from 'DenoX/mongo/deps.ts';

type Binary = deno_mongo_deps.Binary;
type BSONRegExp = deno_mongo_deps.BSONRegExp;
type Decimal128 = deno_mongo_deps.Decimal128;
type Document = {
  [ key: string ]: any;
};
type Double = deno_mongo_deps.Double;
type Int32 = deno_mongo_deps.Int32;
type Long = deno_mongo_deps.Long;
type Timestamp = deno_mongo_deps.Timestamp;

// @ts-ignore 
import * as deno_mongo_find from 'DenoX/mongo/src/collection/commands/find.ts';

export type FindCursor<T> = deno_mongo_find.FindCursor<T>;

// @ts-ignore 
import * as deno_mongo from 'DenoX/mongo/mod.ts';

type TypeCBFun001 = ( methodName: string ) => void;

const MyMongoClient: any = deno_mongo.MongoClient;

export class MongoClient
  extends MyMongoClient {

  #cb: TypeCBFun001 = (
    // @ts-expect-error
    methodName: string
  ): void => {
  };

  constructor( cb: TypeCBFun001 = (
    // @ts-expect-error
    methodName: string
  ): void => {
  } ){
    super();

    this.#cb = cb;
  }

  close(): void{
    if( this.getCluster() ){
      super.close();

      this.#cb( 'close' );
    }
  }

}

export type Database = deno_mongo.Database;
export type Collection<T extends Document> = deno_mongo.Collection<T>;

// export type Bson = deno_mongo.Bson;

// export type BSONSymbol = deno_mongo.BSONSymbol;
// export type Code = deno_mongo.Code;
// export type DBRef = deno_mongo.DBRef;
// export type MaxKey = deno_mongo.MaxKey;
// export type MinKey = deno_mongo.MinKey;
export type ObjectId = deno_mongo.ObjectId;
// export type UUID = deno_mongo.UUID;

// export type GridFSBucket = deno_mongo.GridFSBucket;

/**
 * interface for WriteConcern documents used by MongoDB
 *
 * @see https://docs.mongodb.com/manual/reference/write-concern/
 */
export interface WriteConcern {
  /**
   * The number of instances the write operation needs to be propagated to
   * before proceeding.
   *
   * The string based values are:
   *
   * - majority: The calculated majority of nodes in a cluster has accepted the
   *    the write
   * - custom write name: Writes have been acknowledged by nodes tagged with the
   *    custom write concern.
   */
  w: number | 'majority' | string;

  /**
   * If true, the server only returns after the operation has been commited to
   * disk
   */
  j: boolean;

  /**
   * An optional timeout value after which to stop the write operation
   */
  wtimeout?: number;
}

export interface Server {
  host: string;

  port: number;

  domainSocket?: string;
}

export interface ConnectOptions {
  compression?: string[];

  caCert?: string | URL;

  certFile?: string | URL;

  keyFile?: string | URL;

  keyFilePassword?: string;

  tls?: boolean;

  safe?: boolean;

  credential?: Credential;

  db: string;

  servers: Server[];

  retryWrites?: boolean;

  appname?: string;
}

export interface CountOptions {
  limit?: number;

  skip?: number;

  hint?: Document | string;

  comment?: Document;

  readConcern?: Document;

  collation?: Document;
}

export interface FindOptions {
  findOne?: boolean;

  skip?: number;

  limit?: number;

  projection?: Document;

  sort?: Document;

  noCursorTimeout?: boolean;

  /**
   * The maximum time of milliseconds the operation is allowed to take
   */
  maxTimeMS?: number;
}

export interface ListDatabaseInfo {
  name: string;

  sizeOnDisk?: number;

  empty?: false;
}

export interface InsertOptions {
  /**
   * Optional. If true, then when an insert of a document fails, return without inserting any remaining documents listed in the inserts array.
   * If false, then when an insert of a document fails, continue to insert the remaining documents. Defaults to true.
   */
  ordered?: boolean;

  /**
   * Optional. A document that expresses the write concern of the insert command. Omit to use the default write concern.
   * Do not explicitly set the write concern for the operation if run in a transaction. To use write concern with transactions, see Transactions and Write Concern.
   */
  writeConcern?: Document;

  /**
   * Optional. Enables insert to bypass document validation during the operation. This lets you insert documents that do not meet the validation requirements.
   */
  bypassDocumentValidation?: boolean;

  /**
   * Optional. A user-provided comment to attach to this command.
   */
  comment?: Document;
}

export interface UpdateOptions {
  /**
   * Optional. A document expressing the write concern of the update command. Omit to use the default write concern.
   */
  writeConcern?: Document;

  /**
   *    Optional. If true, then when an update statement fails, return without performing the remaining update statements.
   *  If false, then when an update fails, continue with the remaining update statements, if any. Defaults to true.
   */
  ordered?: boolean;

  /**
   *    Optional. If true, updates all documents that meet the query criteria.
   *  If false, limit the update to one document that meet the query criteria. Defaults to false.
   */
  multi?: boolean;

  /**
   * optional list of array filters referenced in filtered positional operators
   */
  arrayFilters?: Document[];

  /**
   * Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
   */
  collation?: Document;

  /**
   * Allow driver to bypass schema validation in MongoDB 3.2 or higher
   */
  bypassDocumentValidation?: boolean;

  /**
   * An optional hint for query optimization. See the update (https://docs.mongodb.com/manual/reference/command/update/#update-command-hint) command reference for more information.
   */
  hint?: Document;

  /**
   * When true, creates a new document if no document matches the query.
   */
  upsert?: boolean;

  /**
   * The write concern timeout.
   */
  wtimeout?: number;

  /**
   * If true, will throw if bson documents start with $ or include a . in any key value
   */
  checkKeys?: boolean;

  /**
   * Serialize functions on any object.
   */
  serializeFunctions?: boolean;

  /**
   * Specify if the BSON serializer should ignore undefined fields.
   */
  ignoreUndefined?: boolean;

  /**
   * Optional. A user-provided comment to attach to this command.
   */
  comment?: Document;

  /**
   * optional session to use for this operation
   */
  // session?: ClientSession
}

/**
 * Options for controlling the collation of strings in a query
 *
 * @see https://docs.mongodb.com/manual/reference/collation/
 */
export interface CollationOptions {
  locale: string;

  caseLevel?: boolean;

  caseFirst?: string;

  strength?: number;

  numericOrdering?: boolean;

  alternate?: string;

  maxVariable?: string;

  backwards?: boolean;
}

/**
 * Options for the findAndModify operation
 *
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/
 */
export interface FindAndModifyOptions<T = Document> {
  /**
   * Control the order in which documents are found.
   * findAndModify only modifies the first document found, so controlling the
   * sort order may ensure, that the right document is first
   */
  sort?: Document;

  /**
   * The update to execute on the found document.
   *
   * Either update or remove have to be specified
   */
  update?: UpdateFilter<T>;

  /**
   * Remove the found document
   */
  remove?: boolean;

  /**
   * Return the new state after the update
   */
  new?: boolean;

  /**
   * the fields to return.
   */
  fields?: Document;

  /**
   * perform an upsert, i.e. update if a document matches, insert otherwise.
   */
  upsert?: boolean;

  /**
   * do not validate the document during the operation
   */
  bypassDocumentValidation?: boolean;

  /**
   * The write concern to apply to the write operation
   */
  writeConcern?: WriteConcern;

  /**
   * The collation options to apply to string handling (e.g. during sort)
   */
  collation?: CollationOptions;

  /**
   * Filters determining which elements to modify in an array, when modifying
   * array values
   */
  arrayFilters?: Document[];

  /**
   * The maximum time of milliseconds the operation is allowed to take
   */
  maxTimeMS?: number;
}

export interface DeleteOptions {
  /**
   * Optional. If true, then when a delete statement fails, return without performing the remaining delete statements.
   * If false, then when a delete statement fails, continue with the remaining delete statements, if any. Defaults to true.
   */
  ordered?: boolean;

  /**
   * Optional. A document expressing the write concern of the delete command. Omit to use the default write concern.
   */
  writeConcern?: Document;

  /**
   * Optional. Specifies the collation to use for the operation.
   * See https://docs.mongodb.com/manual/reference/command/delete/#deletes-array-collation
   */
  collation?: Document;

  /**
   * Optional. A user-provided comment to attach to this command.
   */
  comment?: Document;

  /**
   * The number of matching documents to delete. Specify either a 0 to delete all matching documents or 1 to delete a single document.
   */
  limit?: number;

  /**
   * Optional. A document or string that specifies the index to use to support the query predicate.
   * The option can take an index specification document or the index name string.
   * If you specify an index that does not exist, the operation errors.
   */
  hint?: Document | string;
}

export interface DropOptions {
  /**
   * Optional. A document expressing the write concern of the drop command. Omit to use the default write concern.
   */
  writeConcern?: Document;

  /**
   * Optional. A user-provided comment to attach to this command.
   */
  // deno-lint-ignore no-explicit-any
  comment?: any;
}

export interface DistinctOptions {
  /**
   * The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
   */
  readPreference?: string;

  /**
   * Number of milliseconds to wait before aborting the query.
   */
  maxTimeMS?: number;

  /**
   * pecify collation settings for operation. See aggregation documentation(https://docs.mongodb.com/manual/reference/command/aggregate).
   */
  collation?: Document;

  /**
   * optional session to use for this operation
   */
  // session?:ClientSession;
}

export interface AggregateOptions {
  /**
   * The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
   */
  readPreference?: string;

  /**
   * @default 1000
   * The number of documents to return per batch. See aggregation documentation(https://docs.mongodb.com/manual/reference/command/aggregate).
   */
  batchSize?: number;

  /**
   * @default false
   * Explain returns the aggregation execution plan (requires mongodb 2.6 >).
   */
  explain?: boolean;

  /**
   * @default false
   * allowDiskUse lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 >).
   */
  allowDiskUse?: boolean;

  /**
   * maxTimeMS specifies a cumulative time limit in milliseconds for processing operations on the cursor. MongoDB interrupts the operation at the earliest following interrupt point.
   */
  maxTimeMS?: number;

  /**
   * @default false
   * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
   */
  bypassDocumentValidation?: boolean;

  /**
   * @default false
   * Return document results as raw BSON buffers.
   */
  raw?: boolean;

  /**
   * @default true
   * Promotes Long values to number if they fit inside the 53 bits resolution.
   */
  promoteLongs?: boolean;

  /**
   * @default true
   * Promotes BSON values to native types where possible, set to false to only receive wrapper types.
   */
  promoteValues?: boolean;

  /**
   * @default false
   * Promotes Binary BSON values to native Node Buffers.
   */
  promoteBuffers?: boolean;

  /**
   * Specify collation settings for operation. See aggregation documentation(https://docs.mongodb.com/manual/reference/command/aggregate).
   */
  collation?: Document;

  /**
   * Add a comment to an aggregation command
   */
  comment?: string;

  /**
   * Add an index selection hint to an aggregation command
   */
  hint?: string | Document;

  /**
   * optional session to use for this operation
   */
  // session?:ClientSession;
}

export interface CreateUserOptions {
  /**
   * The name of the new user.
   */
  username?: string;

  /**
   * The user’s password. The pwd field is not required if you run createUser on the $external database to create users who have credentials stored externally to MongoDB.
   */
  password?: string;

  /**
   * Optional. Any arbitrary information. This field can be used to store any data an admin wishes to associate with this particular user. For example, this could be the user’s full name or employee id.
   */
  customData?: Document;

  /**
   * The roles granted to the user. Can specify an empty array [] to create users without roles.
   */
  roles?: ( string | {
    role: string;
    db: string;
  } )[];

  /**
   * Optional. Indicates whether the server or the client digests the password.
   * See https://docs.mongodb.com/manual/reference/command/createUser/#dbcmd.createUser
   */
  digestPassword?: boolean;

  /**
   * Optional. The level of write concern for the creation operation. The writeConcern document takes the same fields as the getLastError command.
   */
  writeConcern?: Document;

  /**
   * Optional. The authentication restrictions the server enforces on the created user. Specifies a list of IP addresses and CIDR ranges from which the user is allowed to connect to the server or from which the server can accept users.
   */
  authenticationRestrictions?: Document[];

  /**
   * Optional. Specify the specific SCRAM mechanism or mechanisms for creating SCRAM user credentials.
   */
  mechanisms?: ( 'SCRAM-SHA-1' | 'SCRAM-SHA-256' )[];

  /**
   * Optional. A user-provided comment to attach to this command.
   */
  comment?: Document;
}

export interface Credential {
  /**
   * The username to authenticate with. This applies to all mechanisms but may be omitted when authenticating via MONGODB-X509.
   */
  username?: string;

  /**
   * The password to authenticate with. This does not apply to all mechanisms.
   */
  password?: string;

  /**
   * The database used to authenticate. This applies to all mechanisms and defaults to "admin" in SCRAM authentication mechanisms and "$external" for GSSAPI, MONGODB-X509 and PLAIN.
   */
  db?: string;

  /**
   * Which authentication mechanism to use. If not provided, one will be negotiated with the server.
   */
  mechanism?: 'SCRAM-SHA-1' | 'SCRAM-SHA-256' | 'MONGODB-X509';
}

export interface IndexOptions {
  /**
   * Specifies the index’s fields. For each field, specify a key-value pair in which
   * the key is the name of the field to index and the value is either the index direction
   * or index type. If specifying direction, specify 1 for ascending or -1 for descending.
   */
  key: Document;

  /**
   *    A name that uniquely identifies the index.
   */
  name: string;

  /**
   * Optional. Deprecated in MongoDB 4.2.
   */
  background?: boolean;

  /**
   * Optional. Creates a unique index so that the collection will not accept insertion
   * or update of documents where the index key value matches an existing value in the index.
   * Specify true to create a unique index. The default value is false.
   */
  unique?: boolean;

  /**
   * Optional. If specified, the index only references documents that match the filter expression.
   * See Partial Indexes for more information.
   */
  partialFilterExpression?: Document;

  /**
   * Optional. If true, the index only references documents with the specified field.
   * These indexes use less space but behave differently in some situations (particularly sorts).
   * The default value is false. See Sparse Indexes for more information.
   */
  sparse?: boolean;

  /**
   * Optional. Specifies a value, in seconds, as a TTL to control how long MongoDB retains
   * documents in this collection. See Expire Data from Collections by Setting TTL for
   * more information on this functionality. This applies only to TTL indexes.
   */
  expireAfterSeconds?: number;

  /**
   * Optional. A flag that determines whether the index is hidden from the query planner.
   * A hidden index is not evaluated as part of query plan selection. Default is false.
   */
  hidden?: boolean;

  /**
   * Optional. Allows users to configure the storage engine on a per-index basis when creating an index.
   */
  storageEngine?: Document;

  /**
   * Optional. For text indexes, a document that contains field and weight pairs.
   * The weight is an integer ranging from 1 to 99,999 and denotes the significance
   * of the field relative to the other indexed fields in terms of the score.
   * You can specify weights for some or all the indexed fields.
   * See Control Search Results with Weights to adjust the scores.
   * The default value is 1.
   */
  weights?: Document;

  /**
   * Optional. For text indexes, the language that determines the list of
   * stop words and the rules for the stemmer and tokenizer.
   * See Text Search Languages for the available languages and Specify a Language
   * for Text Index for more information and examples. The default value is english.
   */
  // deno-lint-ignore camelcase
  default_language?: string;

  /**
   * Optional. For text indexes, the name of the field, in the collection’s documents,
   * that contains the override language for the document. The default value is language.
   * See Use any Field to Specify the Language for a Document for an example.
   */
  // deno-lint-ignore camelcase
  language_override?: string;

  /**
   * Optional. The text index version number. Users can use this option to override the default version number.
   */
  textIndexVersion?: number;

  /**
   * Optional. The 2dsphere index version number. Users can use this option to override the default version number.
   */
  '2dsphereIndexVersion'?: number;

  /**
   * Optional. For 2d indexes, the number of precision of the stored geohash value of the location data.
   * The bits value ranges from 1 to 32 inclusive. The default value is 26.
   */
  bits?: number;

  /**
   * Optional. For 2d indexes, the lower inclusive boundary for the longitude and latitude values. The default value is -180.0.
   */
  min?: number;

  /**
   * Optional. For 2d indexes, the upper inclusive boundary for the longitude and latitude values. The default value is 180.0.
   */
  max?: number;

  /**
   * For geoHaystack indexes, specify the number of units within which to group the location values;
   * i.e. group in the same bucket those location values that are within the specified number
   * of units to each other. The value must be greater than 0.
   */
  bucketSize?: number;

  /**
   * Optional. Specifies the collation for the index.
   */
  collation?: Document;

  /**
   * Allows users to include or exclude specific field paths from a wildcard index using
   * the { "$**" : 1} key pattern. This option is only valid if creating a wildcard index
   * on all document fields. You cannot specify this option if creating a wildcard index
   * on a specific field path and its subfields, e.g. { "path.to.field.$**" : 1 }
   */
  wildcardProjection?: Document;
}

export interface CreateIndexOptions {
  /**
   * Specifies the indexes to create. Each document in the array specifies a separate index.
   */
  indexes: IndexOptions[];

  /** Optional. A document expressing the write concern. Omit to use the default write concern. */
  writeConcern?: Document;

  /**
   * Optional. The minimum number of data-bearing voting replica set members (i.e. commit quorum),
   * including the primary, that must report a successful index build before the primary marks the indexes as ready.
   * A “voting” member is any replica set member where members[n].votes is greater than 0.
   */
  commitQuorum?: number | string;

  /** Optional. A user-provided comment to attach to this command. Once set */
  comment?: Document;
}

export interface DropIndexOptions {
  /**
   * Specifies the indexes to drop.
   * To drop all but the _id index from the collection, specify "*".
   * To drop a single index, specify either the index name, the index specification document (unless the index is a text index), or an array of the index name.
   * To drop a text index, specify the index names instead of the index specification document.
   * To drop multiple indexes (Available starting in MongoDB 4.2), specify an array of the index names.
   * See https://docs.mongodb.com/manual/reference/command/dropIndexes/#mongodb-dbcommand-dbcmd.dropIndexes
   */
  index: string | IndexOptions | string[];

  /** Optional. A document expressing the write concern. Omit to use the default write concern. */
  writeConcern?: Document;

  /** Optional. A user-provided comment to attach to this command. Once set */
  comment?: Document;
}

type BitwiseType = Binary | Array<number> | number;

type IntegerType = number | Int32 | Long;

type NumericType = IntegerType | Decimal128 | Double;

interface RootFilterOperators<T>
  extends Document {
  $and?: Filter<T>[];

  $nor?: Filter<T>[];

  $or?: Filter<T>[];

  $text?: {
    $search: string;
    $language?: string;
    $caseSensitive?: boolean;
    $diacriticSensitive?: boolean;
  };

  $where?: string;

  $comment?: string | Document;
}

/**
 * Operators for use in the search query.
 *
 * @see https://docs.mongodb.com/manual/reference/operator/query/
 */
interface FilterOperators<TValue>
  extends Document {
  $eq?: TValue;

  $gt?: TValue;

  $gte?: TValue;

  $in?: Array<TValue>;

  $lt?: TValue;

  $lte?: TValue;

  $ne?: TValue;

  $nin?: TValue extends ( infer T )[]
         ? T[]
         : Array<TValue>;

  $not?: FilterOperators<TValue>;

  $exists?: boolean;

  $expr?: Document;

  $jsonSchema?: Document;

  $mod?: TValue extends number
         ? [ number, number ]
         : never;

  $regex?: string | RegExp | BSONRegExp;

  $geoIntersects?: $geoAny;

  $geoWithin?: $geoPolygon | $geoMultiPolygon | ShapeOperator;

  $near?: CenterSpecifier;

  $nearSphere?: CenterSpecifier;

  $minDistance?: number;

  $maxDistance?: number;

  // deno-lint-ignore no-explicit-any
  $all?: Array<any>;

  // deno-lint-ignore no-explicit-any
  $size?: TValue extends Array<any>
          ? number
          : never;

  $bitsAllClear?: BitwiseType;

  $bitsAllSet?: BitwiseType;

  $bitsAnyClear?: BitwiseType;

  $elemMatch?: Document;

  $rand?: Record<string, never>;
}

/**
 * Operators for use in the update query.
 *
 * @see https://docs.mongodb.com/manual/reference/operator/update/
 */
interface UpdateOperators<T>
  extends Document {
  $currentDate?: DocumentOperator<
    T,
    Timestamp | Date,
    true | { $type: 'date' | 'timestamp' }
  >;

  $inc?: DocumentOperator<T, NumericType>;

  $min?: DocumentOperator<T>;

  $max?: DocumentOperator<T>;

  $mul?: DocumentOperator<T, NumericType>;

  $rename?: DocumentOperator<Omit<T, '_id'>, string>;

  $set?: DocumentOperator<T>;

  $setOnInsert?: DocumentOperator<T>;

  // deno-lint-ignore no-explicit-any
  $unset?: DocumentOperator<T, any, '' | true | 1>;

  // deno-lint-ignore no-explicit-any
  $pop?: DocumentOperator<T, Array<any>, ( 1 | -1 )>;

  $pull?: {
    // deno-lint-ignore no-explicit-any
    [Key in KeysOfType<T, Array<any>>]?:
    | Flatten<T[Key]>
    | FilterOperators<Flatten<T[Key]>>;
  };

  $pullAll?: {
    // deno-lint-ignore no-explicit-any
    [Key in KeysOfType<T, Array<any>>]?: T[Key];
  };

  $push?: {
    // deno-lint-ignore no-explicit-any
    [Key in KeysOfType<T, Array<any>>]?: {
    $each?: T[Key];
    $slice?: number;
    $position?: number;
    $sort?: 1 | -1;
    // deno-lint-ignore no-explicit-any
  } | ( T[Key] extends Array<any>
        ? T[Key][number]
        : void );
  };

  $bit?: DocumentOperator<
    T,
    NumericType,
    { and: IntegerType } | { or: IntegerType } | { xor: IntegerType }
  >;
}

/**
 * Operators for use in the aggregation query.
 *
 * @see https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
 */
type AggregateOperators =
  | '$addFields'
  | '$bucket'
  | '$bucketAuto'
  | '$collStats'
  | '$count'
  | '$currentOp'
  | '$facet'
  | '$geoNear'
  | '$graphLookup'
  | '$group'
  | '$indexStats'
  | '$limit'
  | '$listLocalSessions'
  | '$listSessions'
  | '$lookup'
  | '$match'
  | '$merge'
  | '$out'
  | '$planCacheStats'
  | '$project'
  | '$redact'
  | '$replaceRoot'
  | '$replaceWith'
  | '$sample'
  | '$search'
  | '$set'
  | '$setWindowFields'
  | '$skip'
  | '$sort'
  | '$sortByCount'
  | '$unset'
  | '$unwind';

// deno-lint-ignore no-explicit-any
type DocumentOperator<T, OnlyType = any, Value = OnlyType> = IsAny<
  OnlyType,
  ( Partial<T> & Document ),
  {
    [key in KeysOfType<T, OnlyType>]?: Value;
  }
>;

// deno-lint-ignore no-explicit-any
type NotImplementedOperators<Operators extends string, Value = any> = {
  [Key in Operators]?: Value;
};

export type Filter<T> =
  & NotImplementedOperators<'$type'>
  & RootFilterOperators<T>
  & {
  [Key in keyof T]?: T[Key] | FilterOperators<T[Key]>;
};

export type UpdateFilter<T> =
  & NotImplementedOperators<'$addToSet'>
  & UpdateOperators<T>
  & Partial<T>;

export type AggregatePipeline<T> =
  & NotImplementedOperators<AggregateOperators>
  & Document
  & {
  [ '$match' ]?: Filter<T>;
};

type Flatten<T> = T extends Array<infer Item>
                  ? Item
                  : T;

type IsAny<T, Y, N> = 0 extends ( 1 & T )
                      ? Y
                      : N;

export type InsertDocument<TDocument extends Document> =
  & Omit<TDocument, '_id'>
  & {
  _id?: TDocument['_id'] | ObjectId;
};

type KeysOfType<T, Type> = {
  [Key in keyof T]: NonNullable<T[Key]> extends Type
                    ? Key
                    : never;
}[keyof T];

/** The document returned by the buildInfo command. */
export interface BuildInfo {
  /**
   * A string that conveys version information about the `mongod` instance.
   * If you need to present version information to a human, this field is preferable to `versionArray`.
   *
   * This string will take the format `<major>.<minor>.<patch>` in the case of a release,
   * but development builds may contain additional information.
   */
  version: string;

  /** The commit identifier that identifies the state of the code used to build the mongod. */
  gitVersion: string;

  /**
   * @deprecated since 3.2
   * `buildInfo.sysInfo` no longer contains useful information.
   */
  sysInfo: string;

  loaderFlags: string;

  compilerFlags: string;

  /**
   * The memory allocator that mongod uses. By default this is tcmalloc.
   */
  allocator: string;

  /**
   * An array that conveys version information about the mongod instance.
   * See version for a more readable version of this string.
   */
  versionArray: number[];

  /**
   * An embedded document describing the version of the TLS/SSL library that mongod
   * was built with and is currently using.
   */
  openssl: Document;

  /**
   * A string that reports the JavaScript engine used in the mongod instance.
   * By default, this is mozjs after version 3.2, and previously V8.
   */
  javascriptEngine: string;

  /**
   * A number that reflects the target processor architecture of the mongod binary.
   */
  bits: number;

  /**
   * A boolean. true when built with debugging options.
   */
  debug: boolean;

  /**
   * A number that reports the Maximum BSON Document Size.
   */
  maxBsonObjectSize: number;

  /**
   * A list of storage engines available to the mongod server.
   */
  storageEngines: string[];

  ok: number;
}

export const enum ReadPreference {
  Primary = 'primary',
  PrimaryPreferred = 'primaryPreferred',
  Secondary = 'secondary',
  SecondaryPreferred = 'secondaryPreferred',
  Nearest = 'nearest',
}

export type TimeSeriesGranularity = 'seconds' | 'minutes' | 'hours';
export type ValidationLevel = 'off' | 'strict' | 'moderate';
export type ValidationAction = 'error' | 'warn';

/**
 * https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
 */
export interface CreateCollectionOptions {
  capped?: boolean;

  timeseries?: {
    timeField: string;
    metaField?: string;
    granularity?: TimeSeriesGranularity;
  };

  expireAfterSeconds?: number;

  autoIndex?: boolean;

  size?: number;

  max?: number;

  storageEngine?: Document;

  validator?: Document;

  validationLevel?: ValidationLevel;

  validationAction?: ValidationAction;

  indexOptionDefaults?: Document;

  viewOn?: string;

  pipeline?: Document[];

  collation?: Document;

  writeConcern?: Document;
}

// Note:
// Copied from the link below
// - https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/geojson/index.d.ts
//
// See also
// - https://www.npmjs.com/package/@types/geojson

// Type definitions for non-npm package geojson 7946.0
// Project: https://geojson.org/
// Definitions by: Jacob Bruun <https://github.com/cobster>
//                 Arne Schubert <https://github.com/atd-schubert>
//                 Jeff Jacobson <https://github.com/JeffJacobson>
//                 Ilia Choly <https://github.com/icholy>
//                 Dan Vanderkam <https://github.com/danvk>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

// Note: as of the RFC 7946 version of GeoJSON, Coordinate Reference Systems
// are no longer supported. (See https://tools.ietf.org/html/rfc7946#appendix-B)}

// export as namespace GeoJSON;

/**
 * The valid values for the "type" property of GeoJSON geometry objects.
 * https://tools.ietf.org/html/rfc7946#section-1.4
 */
export type GeoJsonGeometryTypes = Geometry['type'];

/**
 * The value values for the "type" property of GeoJSON Objects.
 * https://tools.ietf.org/html/rfc7946#section-1.4
 */
export type GeoJsonTypes = GeoJSON['type'];

/**
 * Bounding box
 * https://tools.ietf.org/html/rfc7946#section-5
 */
export type BBox = [ number, number, number, number ] | [
  number,
  number,
  number,
  number,
  number,
  number,
];

/**
 * A Position is an array of coordinates.
 * https://tools.ietf.org/html/rfc7946#section-3.1.1
 * Array should contain between two and three elements.
 * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
 * but the current specification only allows X, Y, and (optionally) Z to be defined.
 */
export type Position = number[]; // [number, number] | [number, number, number];

/**
 * The base GeoJSON object.
 * https://tools.ietf.org/html/rfc7946#section-3
 * The GeoJSON specification also allows foreign members
 * (https://tools.ietf.org/html/rfc7946#section-6.1)
 * Developers should use "&" type in TypeScript or extend the interface
 * to add these foreign members.
 */
export interface GeoJsonObject {
  // Don't include foreign members directly into this type def.
  // in order to preserve type safety.
  // [key: string]: any;
  /**
   * Specifies the type of GeoJSON object.
   */
  type: GeoJsonTypes;

  /**
   * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
   * The value of the bbox member is an array of length 2*n where n is the number of dimensions
   * represented in the contained geometries, with all axes of the most southwesterly point
   * followed by all axes of the more northeasterly point.
   * The axes order of a bbox follows the axes order of geometries.
   * https://tools.ietf.org/html/rfc7946#section-5
   */
  bbox?: BBox | undefined;
}

/**
 * Union of GeoJSON objects.
 */
export type GeoJSON = Geometry | Feature | FeatureCollection;

/**
 * Geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3
 */
export type Geometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon
  | GeometryCollection;
export type GeometryObject = Geometry;

/**
 * Point geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.2
 */
export interface Point
  extends GeoJsonObject {
  type: 'Point';

  coordinates: Position;
}

/**
 * MultiPoint geometry object.
 *  https://tools.ietf.org/html/rfc7946#section-3.1.3
 */
export interface MultiPoint
  extends GeoJsonObject {
  type: 'MultiPoint';

  coordinates: Position[];
}

/**
 * LineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.4
 */
export interface LineString
  extends GeoJsonObject {
  type: 'LineString';

  coordinates: Position[];
}

/**
 * MultiLineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.5
 */
export interface MultiLineString
  extends GeoJsonObject {
  type: 'MultiLineString';

  coordinates: Position[][];
}

/**
 * Polygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.6
 */
export interface Polygon
  extends GeoJsonObject {
  type: 'Polygon';

  coordinates: Position[][];
}

/**
 * MultiPolygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.7
 */
export interface MultiPolygon
  extends GeoJsonObject {
  type: 'MultiPolygon';

  coordinates: Position[][][];
}

/**
 * Geometry Collection
 * https://tools.ietf.org/html/rfc7946#section-3.1.8
 */
export interface GeometryCollection
  extends GeoJsonObject {
  type: 'GeometryCollection';

  geometries: Geometry[];
}

// deno-lint-ignore no-explicit-any
export type GeoJsonProperties = { [ name: string ]: any } | null;

/**
 * A feature object which contains a geometry and associated properties.
 * https://tools.ietf.org/html/rfc7946#section-3.2
 */
export interface Feature<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
>
  extends GeoJsonObject {
  type: 'Feature';

  /**
   * The feature's geometry
   */
  geometry: G;

  /**
   * A value that uniquely identifies this feature in a
   * https://tools.ietf.org/html/rfc7946#section-3.2.
   */
  id?: string | number | undefined;

  /**
   * Properties associated with this feature.
   */
  properties: P;
}

/**
 * A collection of feature objects.
 *  https://tools.ietf.org/html/rfc7946#section-3.3
 */
export interface FeatureCollection<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
>
  extends GeoJsonObject {
  type: 'FeatureCollection';

  features: Array<Feature<G, P>>;
}

/**
 * https://www.mongodb.com/docs/manual/reference/operator/query/geometry/#mongodb-query-op.-geometry
 */
interface GeoJsonOperators<G extends GeoJsonObject> {
  $geometry: G & CoordinateReferenceSystem;
}

/**
 * https://datatracker.ietf.org/doc/html/rfc7946#section-4
 */
interface CoordinateReferenceSystem {
  crs?: {
    type: string;
    properties: { name: string };
  };
}

/**
 * https://www.mongodb.com/docs/manual/reference/operator/query/minDistance/
 * https://www.mongodb.com/docs/manual/reference/operator/query/maxDistance/
 */
export interface DistanceConstraint {
  $minDistance?: number;

  $maxDistance?: number;
}

export type LegacyPoint = Position;

/**
 * Example:
 *
 * ```ts
 * {
 *    $geometry: GeometryObject, // any GeoJSON object
 * }
 * ```
 */
export type $geoAny = GeoJsonOperators<GeometryObject>;

/**
 * Example:
 *
 * ```ts
 * {
 *   $geometry: { type: "Point", coordinates: [ 40, 5 ] },
 * }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/geojson/#point
 */
export type $geoPoint = GeoJsonOperators<Point>;

/**
 * Example:
 *
 * ```ts
 * {
 *   $geometry: { type: "LineString", coordinates: [ [ 40, 5 ], [ 41, 6 ] ] }
 * }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/geojson/#linestring
 */
export type $geoLineString = GeoJsonOperators<LineString>;

/**
 * Example:
 *
 * ```ts
 * {
 *   $geometry: {
 *     type: "Polygon",
 *     coordinates: [ [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0 ] ] ]
 *   },
 * }
 *
 * ```
 * https://www.mongodb.com/docs/manual/reference/geojson/#polygon
 */
export type $geoPolygon = GeoJsonOperators<Polygon>;

/**
 * Example:
 *
 * ```ts
 * {
 *   $geometry: {
 *     type: "MultiPoint",
 *     coordinates: [
 *       [ -73.9580, 40.8003 ],
 *       [ -73.9498, 40.7968 ],
 *       [ -73.9737, 40.7648 ],
 *       [ -73.9814, 40.7681 ]
 *     ]
 *   },
 * }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/geojson/#multipoint
 */
export type $geoMultiPoint = GeoJsonOperators<MultiPoint>;

/**
 * Example:
 *
 * ```ts
 * {
 *   $geometry: {
 *     type: "MultiLineString",
 *     coordinates: [
 *       [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
 *       [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
 *       [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
 *       [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
 *     ]
 *   }
 * }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/geojson/#multilinestring
 */
export type $geoMultiLineString = GeoJsonOperators<MultiLineString>;

/**
 * Example:
 *
 * ```ts
 * {
 *   $geometry: {
 *     type: "MultiPolygon",
 *     coordinates: [
 *       [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.9814, 40.7681 ], [ -73.958, 40.8003 ] ] ],
 *       [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.958, 40.8003 ] ] ]
 *     ]
 *   },
 * }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/geojson/#multipolygon
 */
export type $geoMultiPolygon = GeoJsonOperators<MultiPolygon>;

/**
 * Example:
 *
 * ```ts
 * {
 *   $geometry: {
 *     type: "GeometryCollection",
 *     geometries: [
 *       {
 *         type: "MultiPoint",
 *         coordinates: [
 *           [ -73.9580, 40.8003 ],
 *           [ -73.9498, 40.7968 ],
 *           [ -73.9737, 40.7648 ],
 *           [ -73.9814, 40.7681 ]
 *         ]
 *       },
 *       {
 *         type: "MultiLineString",
 *         coordinates: [
 *           [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
 *           [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
 *           [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
 *           [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
 *         ]
 *       }
 *     ]
 *   }
 * }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/geojson/#geometrycollection
 */
export type $geoCollection = GeoJsonOperators<GeometryCollection>;

/**
 * Example:
 *
 * ```ts
 * { $box:  [ [ 0, 0 ], [ 100, 100 ] ] }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/operator/query/box/#-box
 */
export type $box = { $box: [ LegacyPoint, LegacyPoint ] };

/**
 * Example:
 *
 * ```ts
 * { $polygon: [ [ 0 , 0 ], [ 3 , 6 ], [ 6 , 0 ] ] }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/operator/query/polygon/#-polygon
 */
export type $polygon = { $polygon: LegacyPoint[] };

/**
 * Example:
 *
 * ```ts
 * { $center: [ [-74, 40.74], 10 ] }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/operator/query/center/#definition
 */
export type $center = { $center: [ LegacyPoint, number ] };

/**
 * Example:
 *
 * ```ts
 * { $centerSphere: [ [ -88, 30 ], 10/3963.2 ] }
 * ```
 *
 * https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#-centersphere
 */
export type $centerSphere = { $centerSphere: [ LegacyPoint, number ] };

export type ShapeOperator =
  | $box
  | $polygon
  | $center
  | $centerSphere;

export type CenterSpecifier =
  | ( $geoPoint & DistanceConstraint )
  | LegacyPoint
  | Document;
