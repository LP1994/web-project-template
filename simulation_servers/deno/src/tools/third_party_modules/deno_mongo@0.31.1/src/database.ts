import {
  Collection,

  // @ts-ignore
} from './collection/mod.ts';

import {
  CommandCursor,

  // @ts-ignore
} from './protocol/mod.ts';

import {
  type CreateCollectionOptions,
  type CreateUserOptions

  // @ts-ignore
} from './types.ts';

import {
  Cluster,

  // @ts-ignore
} from './cluster.ts';

import {
  type Document,

  // @ts-ignore
} from '../deps.ts';

import {
  type WriteConcern,

  // @ts-ignore
} from './types/read_write_concern.ts';

interface ListCollectionsReponse {
  cursor: {
    id: bigint;
    ns: string;
    firstBatch: [
      {
        name: string;
        type: 'collection';
      },
    ];
  };

  ok: 1;
}

export interface ListCollectionsResult {
  name: string;

  type: 'collection';
}

export class Database {
  #cluster: Cluster;

  constructor( cluster: Cluster, readonly name: string ){
    this.#cluster = cluster;
  }

  async dropDatabase( writeConcern?: WriteConcern ){
    // @ts-ignore
    return await this.#cluster.protocol.commandSingle( this.name, {
      dropDatabase: 1,
      writeConcern,
    } );
  }

  collection<T = Document>( name: string ): Collection<T>{
    // @ts-ignore
    return new Collection<T>( this.#cluster.protocol, this.name, name );
  }

  listCollections( options: {
    filter?: Document;
    nameOnly?: boolean;
    authorizedCollections?: boolean;
    comment?: Document;
  } = {} ): CommandCursor<ListCollectionsResult>{
    return new CommandCursor<ListCollectionsResult>(
      // @ts-ignore
      this.#cluster.protocol,
      async () => {
        // @ts-ignore
        const { cursor } = await this.#cluster.protocol.commandSingle<
          ListCollectionsReponse
        >( this.name, {
          listCollections: 1,
          ...options,
        } );
        return {
          id: cursor.id,
          ns: cursor.ns,
          firstBatch: cursor.firstBatch,
        };
      },
    );
  }

  async listCollectionNames( options: {
    filter?: Document;
    authorizedCollections?: boolean;
    comment?: Document;
  } = {} ): Promise<string[]>{
    const cursor = this.listCollections( {
      ...options,
      nameOnly: true,
      authorizedCollections: true,
    } );
    const names: string[] = [];
    for await ( const item of
      cursor ){
      names.push( item.name );
    }
    return names;
  }

  /**
   * `createCollection` executes a create command to create a new collection with the specified name and options.
   *
   * https://www.mongodb.com/docs/manual/reference/command/create/#mongodb-dbcommand-dbcmd.create
   */
  async createCollection<T>(
    name: string,
    options?: CreateCollectionOptions,
  ): Promise<Collection<T>>{
    // @ts-ignore
    await this.#cluster.protocol.commandSingle(
      this.name,
      { create: name, ...options },
    );

    return this.collection<T>( name );
  }

  createUser(
    username: string,
    password: string,
    options?: CreateUserOptions,
  ){
    // @ts-ignore
    return this.#cluster.protocol.commandSingle( this.name, {
      createUser: options?.username ?? username,
      pwd: options?.password ?? password,
      customData: options?.customData,
      roles: options?.roles ?? [],
      writeConcern: options?.writeConcern,
      authenticationRestrictions: options?.authenticationRestrictions,
      mechanisms: options?.mechanisms,
      digestPassword: options?.digestPassword,
      comment: options?.comment,
    } );
  }

  dropUser( username: string, options: {
    writeConcern?: Document;
    comment?: Document;
  } = {} ){
    // @ts-ignore
    return this.#cluster.protocol.commandSingle( this.name, {
      dropUser: username,
      writeConcern: options?.writeConcern,
      comment: options?.comment,
    } );
  }
}
