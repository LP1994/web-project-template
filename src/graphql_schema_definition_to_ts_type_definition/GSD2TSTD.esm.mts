
/**
 * Project: web-project-template
 * FileDirPath: src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-03-11 18:06:25 星期一
 */

'use strict';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Message = {
  __typename?: 'Message';
  author?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

/** 消息内容。 */
export type MessageInput = {
  /** 作者。 */
  author?: InputMaybe<Scalars['String']['input']>;
  /** 内容。 */
  content?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createMessage?: Maybe<Message>;
  updateMessage?: Maybe<Message>;
};


export type MutationCreateMessageArgs = {
  input?: InputMaybe<MessageInput>;
};


export type MutationUpdateMessageArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<MessageInput>;
};

export type Query = {
  __typename?: 'Query';
  getMessage?: Maybe<Message>;
  /** 表示一个值，值类型是String。 */
  hello?: Maybe<Scalars['String']['output']>;
  /** 服务器的时间，值类型是：String，被JSON.stringify处理过的，可以通过JSON.parse将该值转成Object。 */
  serverDate?: Maybe<Scalars['String']['output']>;
};


export type QueryGetMessageArgs = {
  id: Scalars['ID']['input'];
};
