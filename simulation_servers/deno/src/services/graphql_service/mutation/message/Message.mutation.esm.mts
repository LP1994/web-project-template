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
  type DocumentNode,
} from 'esm_sh_graphql';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

import {
  type Scalars,
  type MessageInput,
  type Message as TypeMessage,

  type QueryResolvers,
  type MutationResolvers,
  type QueryGetMessageArgs,
  type MutationCreateMessageArgs,
  type MutationUpdateMessageArgs,
} from 'GSD2TSTD/GSD2TSTD.esm.mts';

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
  implements TypeMessage {

  public id: Scalars['ID']['output'];
  public author: Scalars['String']['output'];
  public content: Scalars['String']['output'];

  public constructor( id: Scalars['ID']['input'], {
    content,
    author,
  }: MessageInput ){
    this.id = id;
    this.author = author;
    this.content = content;
  }

}

const typeDefs: DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Message.type.graphql` ) ) );

const resolvers: QueryResolvers<null, QueryGetMessageArgs> & MutationResolvers<null, MutationCreateMessageArgs & MutationUpdateMessageArgs> = {
  getMessage: async ( {
    id,
  }: QueryGetMessageArgs ): Promise<TypeMessage> => {

    const entry: Deno.KvEntryMaybe<MessageInput> = await kv.get( [
      id,
    ] );

    if( !entry.value ){
      throw new Error( `no message exists with id: ${ id }.` );
    }

    return new Message( id, entry.value as MessageInput );
  },

  createMessage: async ( {
    input,
  }: MutationCreateMessageArgs ): Promise<TypeMessage> => {
    const uint32Array001: Uint32Array = new Uint32Array( new ArrayBuffer( 12 ) );
    crypto.getRandomValues( uint32Array001 );

    const id: string = uint32Array001.toString().replaceAll( ',', '-' );

    await kv.set( [
      id,
    ], input );

    return new Message( id, input );
  },

  updateMessage: async ( {
    id,
    input,
  }: MutationUpdateMessageArgs ): Promise<TypeMessage> => {
    const entry: Deno.KvEntryMaybe<MessageInput> = await kv.get( [
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
};

export {
  typeDefs,
  resolvers,
};
