/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
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
import type {
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "https://esm.sh/graphql";
import type { GraphQLResolveInfo } from "https://esm.sh/graphql";
export type Maybe<T> = T | null | undefined | Promise<T | null | undefined>;
export type InputMaybe<T> =
  T | null | undefined | Promise<T | null | undefined>;
export type FieldWrapper<T> = T | Promise<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** 自定义的标量。 */
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

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type T_ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  GraphQLUploadFile: ResolverTypeWrapper<T_GraphQlUploadFile>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Message: ResolverTypeWrapper<T_Message>;
  MessageInput: T_MessageInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Upload: ResolverTypeWrapper<Scalars["Upload"]["output"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type T_ResolversParentTypes = {
  Boolean: Scalars["Boolean"]["output"];
  GraphQLUploadFile: T_GraphQlUploadFile;
  Int: Scalars["Int"]["output"];
  Message: T_Message;
  MessageInput: T_MessageInput;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Scalars["String"]["output"];
  Subscription: Record<PropertyKey, never>;
  Upload: Scalars["Upload"]["output"];
};

export type T_GraphQlUploadFileResolvers<
  ContextType = any,
  ParentType extends T_ResolversParentTypes["GraphQLUploadFile"] =
    T_ResolversParentTypes["GraphQLUploadFile"],
> = {
  encoding: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  filename: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  filepath: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  mimetype: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  size: Resolver<T_ResolversTypes["Int"], ParentType, ContextType>;
};

export type T_MessageResolvers<
  ContextType = any,
  ParentType extends T_ResolversParentTypes["Message"] =
    T_ResolversParentTypes["Message"],
> = {
  author: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  content: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  id: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
};

export type T_MutationResolvers<
  ContextType = any,
  ParentType extends T_ResolversParentTypes["Mutation"] =
    T_ResolversParentTypes["Mutation"],
> = {
  createMessage: Resolver<
    T_ResolversTypes["Message"],
    ParentType,
    ContextType,
    RequireFields<T_MutationCreateMessageArgs, "input">
  >;
  multipleUpload: Resolver<
    Array<T_ResolversTypes["GraphQLUploadFile"]>,
    ParentType,
    ContextType,
    RequireFields<T_MutationMultipleUploadArgs, "files">
  >;
  singleUpload: Resolver<
    T_ResolversTypes["GraphQLUploadFile"],
    ParentType,
    ContextType,
    RequireFields<T_MutationSingleUploadArgs, "file">
  >;
  updateMessage: Resolver<
    T_ResolversTypes["Message"],
    ParentType,
    ContextType,
    RequireFields<T_MutationUpdateMessageArgs, "id" | "input">
  >;
};

export type T_QueryResolvers<
  ContextType = any,
  ParentType extends T_ResolversParentTypes["Query"] =
    T_ResolversParentTypes["Query"],
> = {
  getMessage: Resolver<
    T_ResolversTypes["Message"],
    ParentType,
    ContextType,
    RequireFields<T_QueryGetMessageArgs, "id">
  >;
  hello: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  serverDate: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
};

export type T_SubscriptionResolvers<
  ContextType = any,
  ParentType extends T_ResolversParentTypes["Subscription"] =
    T_ResolversParentTypes["Subscription"],
> = {
  greetings: SubscriptionResolver<
    Maybe<T_ResolversTypes["String"]>,
    "greetings",
    ParentType,
    ContextType
  >;
};

export interface T_UploadScalarConfig extends GraphQLScalarTypeConfig<
  T_ResolversTypes["Upload"],
  any
> {
  name: "Upload";
}

export type T_Resolvers<ContextType = any> = {
  GraphQLUploadFile: T_GraphQlUploadFileResolvers<ContextType>;
  Message: T_MessageResolvers<ContextType>;
  Mutation: T_MutationResolvers<ContextType>;
  Query: T_QueryResolvers<ContextType>;
  Subscription: T_SubscriptionResolvers<ContextType>;
  Upload: GraphQLScalarType;
};
