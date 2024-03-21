/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/mutation/message/Message.mutation.esm.mts
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
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

import {
  type Scalars as T_Scalars,
  type T_MessageInput,
  type T_Message,
  type T_QueryGetMessageArgs,
  type T_Resolvers,
  type T_MutationCreateMessageArgs,
  type T_MutationUpdateMessageArgs,
} from 'GSD2TSTD';

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

class Message
  implements T_Message {

  public id: T_Scalars['String']['output'];
  public author: T_Scalars['String']['output'];
  public content: T_Scalars['String']['output'];

  public constructor( id: T_Scalars['String']['input'], {
    content,
    author,
  }: T_MessageInput ){
    this.id = id;
    this.author = author;
    this.content = content;
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
        const uint32Array001: Uint32Array = new Uint32Array( new ArrayBuffer( 12 ) );
        crypto.getRandomValues( uint32Array001 );

        const id: string = uint32Array001.toString().replaceAll( ',', '-' );

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
};

export {
  typeDefs,
  resolvers,
};
