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

const fakeDatabase: {
  [ id: string | number ]: TypeMessageInput;
} = {
  '2024001': {
    author: 'LMF',
    content: 'This is a test LMF.',
  },
  '2024002': {
    author: 'LYF',
    content: 'This is a test LYF.',
  },
  '2024003': {
    author: 'LZK',
    content: 'This is a test LZK.',
  },
};

const typeDefs: DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./Message.type.graphql` ) ) );

const resolvers: any = {
  getMessage: ( {
    id,
  }: {
    id: string | number;
    [ key: string | number ]: any;
  } ): TypeMessage => {
    if( !fakeDatabase[ id ] ){
      throw new Error( `no message exists with id: ${ id }.` );
    }

    return new Message( id, fakeDatabase[ id ] as TypeMessageInput );
  },

  createMessage: ( {
    input,
  }: {
    input: TypeMessageInput;
    [ key: string | number ]: any;
  } ): TypeMessage => {
    const id: string = randomBytes( 10 ).toString( 'hex' );

    fakeDatabase[ id ] = input;

    return new Message( id, input );
  },

  updateMessage: ( {
    id,
    input,
  }: {
    id: string | number;
    input: TypeMessageInput;
  } ): TypeMessage => {
    if( !fakeDatabase[ id ] ){
      throw new Error( `no message exists with id: ${ id }.` );
    }

    fakeDatabase[ id ] = input;

    return new Message( id, input );
  },
};

export {
  typeDefs,
  resolvers,
};
