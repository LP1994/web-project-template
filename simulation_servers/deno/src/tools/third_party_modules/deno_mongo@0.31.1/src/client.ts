import {
  Database,

  // @ts-ignore
} from './database.ts';

import {
  type BuildInfo,
  type ConnectOptions,
  type ListDatabaseInfo

  // @ts-ignore
} from './types.ts';

import {
  parse,

  // @ts-ignore
} from './utils/uri.ts';

import {
  MongoDriverError,

  // @ts-ignore
} from './error.ts';

import {
  Cluster,

  // @ts-ignore
} from './cluster.ts';

import {
  type Document,

  // @ts-ignore
} from '../deps.ts';

export class MongoClient {
  #cluster?: Cluster;

  #defaultDbName = 'admin';

  #buildInfo?: BuildInfo;

  get buildInfo(){
    return this.#buildInfo;
  }

  getCluster(){
    if( !this.#cluster ){
      throw new MongoDriverError(
        'MongoClient is not connected to the Database',
      );
    }

    return this.#cluster;
  }

  async connect(
    options: ConnectOptions | string,
  ): Promise<Database>{
    try{
      const parsedOptions = typeof options === 'string'
                            ? await parse( options )
                            : options;

      this.#defaultDbName = parsedOptions.db;
      const cluster = new Cluster( parsedOptions );
      await cluster.connect();
      await cluster.authenticate();
      await cluster.updateMaster();

      this.#cluster = cluster;
      this.#buildInfo = await this.runCommand( this.#defaultDbName, {
        buildInfo: 1,
      } );
    }
    catch( e: unknown ){
      throw new MongoDriverError( `Connection failed: ${ ( e as Error ).message || e }` );
    }
    return this.database( ( options as ConnectOptions ).db );
  }

  async listDatabases( options: {
    filter?: Document;
    nameOnly?: boolean;
    authorizedCollections?: boolean;
    comment?: Document;
  } = {} ): Promise<ListDatabaseInfo[]>{
    // @ts-ignore
    const { databases } = await this.getCluster().protocol.commandSingle(
      'admin',
      {
        listDatabases: 1,
        ...options,
      },
    );
    return databases;
  }

  // deno-lint-ignore no-explicit-any
  runCommand<T = any>( db: string, body: Document ): Promise<T>{
    // @ts-ignore
    return this.getCluster().protocol.commandSingle( db, body );
  }

  database( name = this.#defaultDbName ): Database{
    return new Database( this.getCluster(), name );
  }

  close(){
    if( this.#cluster ){
      this.#cluster.close();
    }
  }
}
