// deno run -A --config=../../../deno.jsonc --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../../../.env.deno ./test.mts --color=16m

'use strict';

import {
  createReadStream,
  ReadStream,
} from 'node:fs';

import {
  performance,
} from 'node:perf_hooks';

import {
  webDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_EncodeType,
  type T_HashTypeKey,

  FileHashWasmByRustForFilePathForMultiThread,
  FileHashWasmByRustForChunkForMultiThread,
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

// filePath、chunk
const workerType: string = 'chunk';

if( workerType === 'filePath' ){
  // Windows11_Client_x64_zh-cn_26300_9457.iso
  const result: Partial<Record<T_HashTypeKey, T_EncodeType>> = await FileHashWasmByRustForFilePathForMultiThread( {
    filePath: new URL( `${ webDir }/Windows11_Client_x64_zh-cn_26300_9457.iso` ),
    hashOptions,
    chunkSize: 4 * 1024 * 1024,
  } );

  console.dir( result );
}
else{
  const myFileHash = new FileHashWasmByRustForChunkForMultiThread( {
    hashOptions,
    chunkSize: 4 * 1024 * 1024,
  } );

  // Windows11_Client_x64_zh-cn_26300_9457.iso
  const readStream: ReadStream = createReadStream( new URL( `${ webDir }/Windows11_Client_x64_zh-cn_26300_9457.iso` ), {
    flags: 'r',
    highWaterMark: 4 * 1024 * 1024,
  } );

  const startTimer: number = performance.now();

  for await( const chunk of
    readStream ){
    await myFileHash!.update( chunk );
  }

  console.dir( await myFileHash!.digest() );

  const timer: number = performance.now() - startTimer;

  console.log( `
总共耗时：${ timer }毫秒。
约为：${ timer / 1000 }秒。
约为：${ timer / 1000 / 60 }分钟。
约为：${ timer / 1000 / 60 / 60 }小时。
` );
}
