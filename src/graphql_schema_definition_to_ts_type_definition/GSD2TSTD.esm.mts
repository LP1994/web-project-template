/**
 * Project: web-project-template
 * FileDirPath: src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2026-10-29 03:02:48 星期四
 */

"use strict";

/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type Maybe<T> = T | null | undefined | Promise<T | null | undefined>;
export type InputMaybe<T> =
  T | null | undefined | Promise<T | null | undefined>;
export type FieldWrapper<T> = T | Promise<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Upload: { input: unknown; output: unknown };
};

/** 上传文件成功后，返回的是一个文件对象，该对象里有关于文件的元数据和文件存储的磁盘路径、文件大小等等信息。 */
export type T_GraphQlUploadFile = {
  __typename?: "GraphQLUploadFile";
  /** 值形如：'binary'，该值有：'7bit' | '8bit' | 'binary'。 */
  encoding: FieldWrapper<Scalars["String"]["output"]>;
  /** 值形如：'test.png'。 */
  filename: FieldWrapper<Scalars["String"]["output"]>;
  /** 值形如：'G:/WebStormWS/7788/1.png'。 */
  filepath: FieldWrapper<Scalars["String"]["output"]>;
  /** 值形如：'image/png'。 */
  mimetype: FieldWrapper<Scalars["String"]["output"]>;
  /** 值形如：102400，单位为字节。 */
  size: FieldWrapper<Scalars["Int"]["output"]>;
};

/** 返回的“消息”主体。 */
export type T_Message = {
  __typename?: "Message";
  /** 作者。 */
  author: FieldWrapper<Scalars["String"]["output"]>;
  /** 内容。 */
  content: FieldWrapper<Scalars["String"]["output"]>;
  /** 消息ID。 */
  id: FieldWrapper<Scalars["String"]["output"]>;
};

/** 表示“消息内容”的输入参数类型。 */
export type T_MessageInput = {
  /** 作者。 */
  author: Scalars["String"]["input"];
  /** 内容。 */
  content: Scalars["String"]["input"];
};

export type T_Mutation = {
  __typename?: "Mutation";
  /** 新建一个“消息”。 */
  createMessage: FieldWrapper<T_Message>;
  /** 一次性上传多个文件。 */
  multipleUpload: Array<FieldWrapper<T_GraphQlUploadFile>>;
  /** 一次性上传单个文件。 */
  singleUpload: FieldWrapper<T_GraphQlUploadFile>;
  /** 根据消息ID更新对应的“消息”内容。 */
  updateMessage: FieldWrapper<T_Message>;
};

export type T_MutationCreateMessageArgs = {
  input: T_MessageInput;
};

export type T_MutationMultipleUploadArgs = {
  files: Array<Scalars["Upload"]["input"]>;
};

export type T_MutationSingleUploadArgs = {
  file: Scalars["Upload"]["input"];
};

export type T_MutationUpdateMessageArgs = {
  id: Scalars["String"]["input"];
  input: T_MessageInput;
};

export type T_Query = {
  __typename?: "Query";
  /** 根据消息ID返回对应的“消息”主体。 */
  getMessage: FieldWrapper<T_Message>;
  /** 表示一个值类型是String的值。 */
  hello: FieldWrapper<Scalars["String"]["output"]>;
  /** 服务器的时间，值类型是：String，被JSON.stringify处理过的，可以通过JSON.parse将该值转成Object。 */
  serverDate: FieldWrapper<Scalars["String"]["output"]>;
};

export type T_QueryGetMessageArgs = {
  id: Scalars["String"]["input"];
};

export type T_Subscription = {
  __typename?: "Subscription";
  /** 返回5种颜色名。 */
  greetings: Maybe<FieldWrapper<Scalars["String"]["output"]>>;
};
