import {
  type Credential,

  // @ts-ignore
} from '../types.ts';

import {
  AuthContext,
  AuthPlugin

  // @ts-ignore
} from './base.ts';

import {
  type HandshakeDocument,

  // @ts-ignore
} from '../protocol/handshake.ts';

import {
  driverMetadata,

  // @ts-ignore
} from '../protocol/mod.ts';

import {
  type Document,

  // @ts-ignore
} from '../../deps.ts';

export interface X509Command
  extends Document {
  authenticate: number;

  mechanism: string;

  user?: string;
}

export class X509AuthPlugin
  extends AuthPlugin {
  constructor(){
    super();
  }

  prepare( authContext: AuthContext ): Document{
    const handshakeDoc = <HandshakeDocument> {
      ismaster: true,
      client: driverMetadata,
      compression: authContext.options.compression,
      speculativeAuthenticate: x509AuthenticateCommand( authContext.credentials ),
    };
    return handshakeDoc;
  }

  auth( authContext: AuthContext ): Promise<Document>{
    if( authContext.response!.speculativeAuthenticate ){
      return Promise.resolve( authContext.response! );
    }
    return authContext.protocol.commandSingle(
      '$external',
      x509AuthenticateCommand( authContext.credentials ),
    );
  }
}

function x509AuthenticateCommand( credentials?: Credential ): Document{
  const command: X509Command = {
    authenticate: 1,
    mechanism: 'MONGODB-X509'
  };
  if( credentials ){
    // @ts-ignore
    command.user = credentials!.username;
  }
  return command;
}
