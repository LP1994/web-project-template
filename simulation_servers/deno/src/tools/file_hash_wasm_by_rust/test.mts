// deno run -A --config=../../../deno.jsonc --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../../../.env.deno ./test.mts --color=16m

'use strict';

import {
  webDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_EncodeType,
  type T_HashTypeKey,

  FileHashWasmByRustForMultiThread,
} from './FileHashWasmByRustForMultiThread.esm.mts';

const hashOptions: Partial<Record<T_HashTypeKey, T_EncodeType>> = {
  'md5': {
    'hex': '',
    'base64': '',
  },

  'sha1': {
    'hex': '',
    'base64': ''
  },
  'sha-1': {
    'hex': '',
    'base64': ''
  },

  'sha224': {
    'hex': '',
    'base64': ''
  },
  'sha-224': {
    'hex': '',
    'base64': ''
  },
  'sha2-224': {
    'hex': '',
    'base64': ''
  },

  'sha256': {
    'hex': '',
    'base64': ''
  },
  'sha-256': {
    'hex': '',
    'base64': ''
  },
  'sha2-256': {
    'hex': '',
    'base64': ''
  },

  'sha384': {
    'hex': '',
    'base64': ''
  },
  'sha-384': {
    'hex': '',
    'base64': ''
  },
  'sha2-384': {
    'hex': '',
    'base64': ''
  },

  'sha512': {
    'hex': '',
    'base64': ''
  },
  'sha-512': {
    'hex': '',
    'base64': ''
  },
  'sha2-512': {
    'hex': '',
    'base64': ''
  },

  'sha3-224': {
    'hex': '',
    'base64': ''
  },
  'sha3-256': {
    'hex': '',
    'base64': ''
  },
  'sha3-384': {
    'hex': '',
    'base64': ''
  },
  'sha3-512': {
    'hex': '',
    'base64': ''
  },
};

try{
  const result: Partial<Record<T_HashTypeKey, T_EncodeType>> = await FileHashWasmByRustForMultiThread( new URL( `${ webDir }/Windows11_Client_x64_zh-cn_26300_9457.iso` ), hashOptions );

  console.dir( result );
}
catch( e: unknown ){
  console.error( e );
}
