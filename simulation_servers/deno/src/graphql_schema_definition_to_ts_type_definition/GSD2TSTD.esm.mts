/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-03-19 08:52:14 星期二
 */

"use strict";

import type { GraphQLResolveInfo } from "https://esm.sh/graphql";
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
};

export type T_Message = {
  __typename?: "Message";
  author: FieldWrapper<Scalars["String"]["output"]>;
  content: FieldWrapper<Scalars["String"]["output"]>;
  id: FieldWrapper<Scalars["ID"]["output"]>;
};

/** 消息内容。 */
export type T_MessageInput = {
  /** 作者。 */
  author: Scalars["String"]["input"];
  /** 内容。 */
  content: Scalars["String"]["input"];
};

export type T_Mutation = {
  __typename?: "Mutation";
  createMessage: FieldWrapper<T_Message>;
  updateMessage: FieldWrapper<T_Message>;
};

export type T_MutationCreateMessageArgs = {
  input: T_MessageInput;
};

export type T_MutationUpdateMessageArgs = {
  id: Scalars["ID"]["input"];
  input: T_MessageInput;
};

export type T_Query = {
  __typename?: "Query";
  getMessage: FieldWrapper<T_Message>;
  /** 表示一个值，值类型是String。 */
  hello: FieldWrapper<Scalars["String"]["output"]>;
  /** 服务器的时间，值类型是：String，被JSON.stringify处理过的，可以通过JSON.parse将该值转成Object。 */
  serverDate: FieldWrapper<Scalars["String"]["output"]>;
};

export type T_QueryGetMessageArgs = {
  id: Scalars["ID"]["input"];
};

export type T_Subscription = {
  __typename?: "Subscription";
  greetings: FieldWrapper<Scalars["String"]["output"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
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
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
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
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Message: ResolverTypeWrapper<T_Message>;
  MessageInput: T_MessageInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Subscription: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type T_ResolversParentTypes = {
  Boolean: Scalars["Boolean"]["output"];
  ID: Scalars["ID"]["output"];
  Message: T_Message;
  MessageInput: T_MessageInput;
  Mutation: {};
  Query: {};
  String: Scalars["String"]["output"];
  Subscription: {};
};

export type T_MessageResolvers<
  ContextType = any,
  ParentType extends
    T_ResolversParentTypes["Message"] = T_ResolversParentTypes["Message"],
> = {
  author?: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  content?: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<T_ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type T_MutationResolvers<
  ContextType = any,
  ParentType extends
    T_ResolversParentTypes["Mutation"] = T_ResolversParentTypes["Mutation"],
> = {
  createMessage?: Resolver<
    T_ResolversTypes["Message"],
    ParentType,
    ContextType,
    RequireFields<T_MutationCreateMessageArgs, "input">
  >;
  updateMessage?: Resolver<
    T_ResolversTypes["Message"],
    ParentType,
    ContextType,
    RequireFields<T_MutationUpdateMessageArgs, "id" | "input">
  >;
};

export type T_QueryResolvers<
  ContextType = any,
  ParentType extends
    T_ResolversParentTypes["Query"] = T_ResolversParentTypes["Query"],
> = {
  getMessage?: Resolver<
    T_ResolversTypes["Message"],
    ParentType,
    ContextType,
    RequireFields<T_QueryGetMessageArgs, "id">
  >;
  hello?: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
  serverDate?: Resolver<T_ResolversTypes["String"], ParentType, ContextType>;
};

export type T_SubscriptionResolvers<
  ContextType = any,
  ParentType extends
    T_ResolversParentTypes["Subscription"] = T_ResolversParentTypes["Subscription"],
> = {
  greetings?: SubscriptionResolver<
    T_ResolversTypes["String"],
    "greetings",
    ParentType,
    ContextType
  >;
};

export type T_Resolvers<ContextType = any> = {
  Message?: T_MessageResolvers<ContextType>;
  Mutation?: T_MutationResolvers<ContextType>;
  Query?: T_QueryResolvers<ContextType>;
  Subscription?: T_SubscriptionResolvers<ContextType>;
};
