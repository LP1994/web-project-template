import {
  WireProtocol,

  // @ts-ignore
} from './protocol/mod.ts';

import {
  type ConnectOptions,
  type Server,

  // @ts-ignore
} from './types.ts';

import {
  AuthContext,
  ScramAuthPlugin,
  X509AuthPlugin

  // @ts-ignore
} from './auth/mod.ts';

import {
  MongoDriverError,

  // @ts-ignore
} from './error.ts';

export class Cluster {
  #options: ConnectOptions;

  // @ts-ignore
  #connections: Deno.Conn[];

  #protocols: WireProtocol[];

  #masterIndex: number;

  constructor( options: ConnectOptions ){
    this.#options = options;
    this.#connections = [];
    this.#protocols = [];
    this.#masterIndex = -1;
  }

  async connect(){
    const options = this.#options;
    this.#connections = await Promise.all(
      options.servers.map( ( server: Server ) => this.connectToServer( server, options ) ),
    );
  }

  connectToServer( server: Server, options: ConnectOptions ){
    // @ts-ignore
    const denoConnectOps: Deno.ConnectTlsOptions = {
      hostname: server.host,
      port: server.port,
    };

    if( !options.tls ){
      // @ts-ignore
      return Deno.connect( denoConnectOps );
    }

    if( options.caCert ){
      denoConnectOps.caCerts = [
        // @ts-ignore
        Deno.readTextFileSync( options.caCert ),
      ];
    }

    if( options.privateKey ){
      // @ts-ignore
      denoConnectOps.privateKey = Deno.readTextFileSync( options.privateKey );

      //TODO: need something like const key = decrypt(options.keyFile) ...
      //TODO: need Deno.connectTls with something like key or keyFile option.
      if( options.keyFilePassword ){
        throw new MongoDriverError(
          'Tls keyFilePassword not implemented in Deno driver',
        );
      }
    }

    if( options.certChain ){
      // @ts-ignore
      denoConnectOps.certChain = Deno.readTextFileSync( options.certChain );
    }

    // @ts-ignore
    return Deno.connectTls( denoConnectOps );
  }

  async authenticate(){
    const options = this.#options;
    this.#protocols = await Promise.all(
      this.#connections.map( ( conn ) => this.authenticateToServer( conn, options ) ),
    );
  }

  async authenticateToServer(
    // @ts-ignore
    conn,
    options: ConnectOptions
  ){
    const protocol = new WireProtocol( conn );
    if( options.credential ){
      const authContext = new AuthContext(
        protocol,
        options.credential,
        options,
      );
      const mechanism = options.credential!.mechanism;
      let authPlugin;
      if( mechanism === 'SCRAM-SHA-256' ){
        authPlugin = new ScramAuthPlugin( 'sha256' ); //TODO AJUST sha256
      }
      else if( mechanism === 'SCRAM-SHA-1' ){
        authPlugin = new ScramAuthPlugin( 'sha1' );
      }
      else if( mechanism === 'MONGODB-X509' ){
        authPlugin = new X509AuthPlugin();
      }
      else{
        throw new MongoDriverError(
          `Auth mechanism not implemented in Deno driver: ${ mechanism }`,
        );
      }
      const request = authPlugin.prepare( authContext );
      authContext.response = await protocol.commandSingle(
        'admin', // TODO: Should get the auth db from connectionOptions?
        request,
      );
      await authPlugin.auth( authContext );
    }
    else{
      await protocol.connect();
    }
    return protocol;
  }

  async updateMaster(){
    const results = await Promise.all( this.#protocols.map( ( protocol ) => {
      return protocol.commandSingle(
        'admin',
        { isMaster: 1 },
      );
    } ) );
    const masterIndex = results.findIndex( ( result ) =>
      result.isWritablePrimary || result.ismaster
    );
    if( masterIndex === -1 ){
      throw new Error( `Could not find a master node` );
    }
    this.#masterIndex = masterIndex;
  }

  private getMaster(){
    return {
      protocol: this.#protocols[ this.#masterIndex ],
      conn: this.#connections[ this.#masterIndex ],
    };
  }

  get protocol(){
    return this.getMaster().protocol;
  }

  close(){
    for( const conn of
      this.#connections ){
      try{
        conn.close();
      }
      catch( error ){
        console.error( `Error closing connection: ${ error }` );
      }
    }
  }
}
