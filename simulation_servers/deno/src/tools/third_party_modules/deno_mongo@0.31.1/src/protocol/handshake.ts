import {
  WireProtocol,

  // @ts-ignore
} from './protocol.ts';

import {
  type Document,

  // @ts-ignore
} from '../../deps.ts';

export const driverMetadata = {
  driver: {
    name: 'Deno Mongo',
    version: 'v0.0.1',
  },
  os: {
    // @ts-ignore
    type: Deno.build.os,

    // @ts-ignore
    name: Deno.build.os,

    // @ts-ignore
    architecture: Deno.build.arch,
  },
};

export interface HandshakeDocument
  extends Document {
  ismaster: boolean;

  // deno-lint-ignore no-explicit-any
  client: any;

  compression: string[];

  saslSupportedMechs?: string;

  speculativeAuthenticate?: Document;
}

interface HandshakeResponse {
  ismaster: string;

  maxBsonObjectSize: number;

  maxMessageSizeBytes: number;

  maxWriteBatchSize: number;

  localTime: Date;

  logicalSessionTimeoutMinutes: number;

  connectionId: number;

  minWireVersion: number;

  maxWireVersion: number;

  readOnly: boolean;

  ok: number;
}

export async function handshake(
  protocol: WireProtocol,
): Promise<HandshakeResponse>{
  const reply = await protocol.commandSingle<HandshakeResponse>( 'admin', {
    isMaster: true,
    client: driverMetadata,
  } );
  return reply;
}
