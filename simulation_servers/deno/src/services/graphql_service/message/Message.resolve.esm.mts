/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/message/Message.resolve.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  type DocumentNode as T_DocumentNode,
} from 'esm_sh_graphql';

import {
  type T_Message,
  type T_MessageInput,
  type T_MutationCreateMessageArgs,
  type T_MutationUpdateMessageArgs,
  type T_QueryGetMessageArgs,
  type T_Resolvers,
  type Scalars as T_Scalars,
} from 'GSD2TSTD';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

const kv: Deno.Kv = await Deno.openKv();

await kv.set( [
  '2024001',
], {
  author: 'LMF',
  content: 'This is a test LMF.',
} );
await kv.set( [
  '2024002',
], {
  author: 'LYF',
  content: 'This is a test LYF.',
} );
await kv.set( [
  '2024003',
], {
  author: 'LZK',
  content: 'This is a test LZK.',
} );
await kv.set( [
  '2024004-素夏',
], {
  author: '素夏',
  content: 'This is a test 素夏.',
} );
await kv.set( [
  '2024005-离骚',
], {
  author: '离骚',
  content: 'This is a test 离骚.',
} );

class Message
  implements T_Message {

  public author: T_Scalars['String']['output'];

  public content: T_Scalars['String']['output'];

  public id: T_Scalars['String']['output'];

  public constructor( id: T_Scalars['String']['input'], {
    author,
    content,
  }: T_MessageInput ){
    this.author = author;
    this.content = content;
    this.id = id;
  }

}

const typeDefs: T_DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Message.type.graphql` ) ) );

const resolvers: T_Resolvers = {
  Query: {
    getMessage: {
      resolve: async (
        // @ts-expect-error
        parent,
        {
          id,
        }: T_QueryGetMessageArgs,
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ): Promise<T_Message> => {
        const entry: Deno.KvEntryMaybe<T_MessageInput> = await kv.get( [
          id,
        ] );

        if( !entry.value ){
          throw new Error( `no message exists with id: ${ id }.` );
        }

        return new Message( id, entry.value as T_MessageInput );
      },
    },
  },

  Mutation: {
    createMessage: {
      resolve: async (
        // @ts-expect-error
        parent,
        {
          input,
        }: T_MutationCreateMessageArgs,
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ): Promise<T_Message> => {
        const id: string = crypto.randomUUID();

        await kv.set( [
          id,
        ], input );

        return new Message( id, input );
      },
    },

    updateMessage: {
      resolve: async (
        // @ts-expect-error
        parent,
        {
          id,
          input,
        }: T_MutationUpdateMessageArgs,
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ): Promise<T_Message> => {
        const entry: Deno.KvEntryMaybe<T_MessageInput> = await kv.get( [
          id,
        ] );

        if( !entry.value ){
          throw new Error( `no message exists with id: ${ id }.` );
        }

        await kv.set( [
          id,
        ], input );

        return new Message( id, input );
      },
    },
  },
} as T_Resolvers;

export {
  resolvers,
  typeDefs,
};
