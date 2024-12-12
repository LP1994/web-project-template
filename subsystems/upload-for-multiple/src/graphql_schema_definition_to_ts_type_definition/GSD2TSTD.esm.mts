/**
 * Project: upload-for-multiple
 * FileDirPath: src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

"use strict";

export type Maybe<T> = T | null | undefined | Promise<T | null | undefined>;
export type InputMaybe<T> =
  | T
  | null
  | undefined
  | Promise<T | null | undefined>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type FieldWrapper<T> = T | Promise<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
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
  /** 根据消息ID更新对应的“消息”内容。 */
  updateMessage: FieldWrapper<T_Message>;
};

export type T_MutationCreateMessageArgs = {
  input: T_MessageInput;
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
  /** 返回5种颜色。 */
  greetings: Maybe<FieldWrapper<Scalars["String"]["output"]>>;
};
