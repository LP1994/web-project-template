import {
  BufReader,
  type Deferred,
  deferred,
  type Document,
  writeAll,

  // @ts-ignore
} from '../../deps.ts';

import {
  MongoDriverError,
  type MongoErrorInfo,
  MongoServerError,

  // @ts-ignore
} from '../error.ts';

import {
  handshake,

  // @ts-ignore
} from './handshake.ts';

import {
  parseHeader,

  // @ts-ignore
} from './header.ts';

import {
  deserializeMessage,
  type Message,
  serializeMessage,

  // @ts-ignore
} from './message.ts';

interface CommandTask {
  requestId: number;

  db: string;

  body: Document;
}

let nextRequestId = 0;

export class WireProtocol {
  // @ts-ignore
  #socket;

  #isPendingResponse = false;

  #isPendingRequest = false;

  #pendingResponses: Map<number, Deferred<Message>> = new Map();

  #reader: BufReader;

  #commandQueue: CommandTask[] = [];

  // @ts-ignore
  constructor( socket ){
    this.#socket = socket;
    this.#reader = new BufReader( this.#socket );
  }

  async connect(){
    const { connectionId: _connectionId } = await handshake( this );
  }

  async commandSingle<T = Document>(
    db: string,
    body: Document,
  ): Promise<T>{
    const [ doc ] = await this.command( db, body );

    // @ts-ignore
    if( doc.ok === 0 ){
      throw new MongoServerError( doc as MongoErrorInfo );
    }
    return doc as T;
  }

  async command<T = Document>( db: string, body: Document ): Promise<T[]>{
    const requestId = nextRequestId++;
    const commandTask = {
      requestId,
      db,
      body,
    };

    this.#commandQueue.push( commandTask );
    this.send();

    const pendingMessage = deferred<Message>();
    this.#pendingResponses.set( requestId, pendingMessage );
    this.receive();
    const message = await pendingMessage;

    let documents: T[] = [];

    for( const section of
      message?.sections! ){
      if( 'document' in section ){
        documents.push( section.document as T );
      }
      else{
        documents = documents.concat( section.documents as T[] );
      }
    }

    return documents;
  }

  private async send(){
    if( this.#isPendingRequest ){
      return;
    }
    this.#isPendingRequest = true;
    while( this.#commandQueue.length > 0 ){
      const task = this.#commandQueue.shift()!;
      const buffer = serializeMessage( {
        requestId: task.requestId,
        responseTo: 0,
        sections: [
          {
            document: {
              ...task.body,
              $db: task.db,
            },
          },
        ],
      } );

      await writeAll( this.#socket, buffer );
    }
    this.#isPendingRequest = false;
  }

  private async receive(){
    if( this.#isPendingResponse ){
      return;
    }
    this.#isPendingResponse = true;
    while( this.#pendingResponses.size > 0 ){
      const headerBuffer = await this.#reader.readFull( new Uint8Array( 16 ) );
      if( !headerBuffer ){
        throw new MongoDriverError( 'Invalid response header' );
      }
      const header = parseHeader( headerBuffer );
      const bodyBuffer = await this.#reader.readFull(
        new Uint8Array( header.messageLength - 16 ),
      );
      if( !bodyBuffer ){
        throw new MongoDriverError( 'Invalid response body' );
      }
      const reply = deserializeMessage( header, bodyBuffer );
      const pendingMessage = this.#pendingResponses.get( header.responseTo );
      this.#pendingResponses.delete( header.responseTo );
      pendingMessage?.resolve( reply );
    }
    this.#isPendingResponse = false;
  }
}
