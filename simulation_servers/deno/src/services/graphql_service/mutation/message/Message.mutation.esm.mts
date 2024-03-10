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
  randomBytes,
} from 'node:crypto';

import {
  type DocumentNode,
} from 'esmSH/graphql';

import {
  type TypeResolver001,
} from 'configures/GlobalParameters.esm.mts';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

type TypeMessageInput = {
  author: string;
  content: string;
};

type TypeMessage = {
  id: number | string;
  author: string,
  content: string;
};

const kv = await Deno.openKv();

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

class Message {

  public id: number | string;
  public author: string;
  public content: string;

  public constructor( id: number | string, {
    content,
    author,
  }: TypeMessageInput ){
    this.id = id;
    this.author = author;
    this.content = content;
  }

}

const typeDefs: DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Message.type.graphql` ) ) );

const resolvers: TypeResolver001 = {
  getMessage: async ( {
    id,
  }: {
    id: string | number;
    [ key: string | number ]: unknown;
  } ): Promise<TypeMessage> => {
    const entry = await kv.get( [
      id,
    ] );

    if( !entry.value ){
      throw new Error( `no message exists with id: ${ id }.` );
    }

    return new Message( id, entry.value as TypeMessageInput );
  },

  createMessage: async ( {
    input,
  }: {
    input: TypeMessageInput;
    [ key: string | number ]: unknown;
  } ): Promise<TypeMessage> => {
    const id: string = randomBytes( 10 ).toString( 'hex' );

    await kv.set( [
      id,
    ], input );

    return new Message( id, input );
  },

  updateMessage: async ( {
    id,
    input,
  }: {
    id: string | number;
    input: TypeMessageInput;
  } ): Promise<TypeMessage> => {
    const entry = await kv.get( [
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
