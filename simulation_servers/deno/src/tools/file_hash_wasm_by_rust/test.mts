// deno run -A --config=../../../deno.jsonc --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../../../.env.deno ./test.mts --color=16m --my_args="{\"md5\":{\"hex\":\"\",\"base64\":\"\"},\"sha512\":{\"hex\":\"\",\"base64\":\"\"},\"sha3-512\":{\"hex\":\"\",\"base64\":\"\"}}"

'use strict';

const startTime = performance.now();

import {
  webDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  FileHasher,
} from './dist/FileHashWasmByRust.js';

const hashOptions = {
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

/**
 * 使用固定大小的缓冲区读取文件并计算哈希。
 *
 * @param filePath 文件路径。
 *
 * @param hashOptions 哈希算法及编码格式配置。
 *
 * @param chunkSize 每次读取的缓冲区大小。
 *
 * @returns 哈希计算结果。
 */
async function CalculateFileHash(
  filePath: string | URL,
  hashOptions: Record<string, unknown>,
  // 1 * 1024 * 1024 * 1024
  // 4 * 1024 * 1024
  chunkSize: number = 4 * 1024 * 1024,
){
  if(
    !Number.isSafeInteger( chunkSize ) ||
    chunkSize <= 0
  ){
    throw new RangeError( 'chunkSize 必须是大于 0 的安全整数。', );
  }

  const hasher = new FileHasher( hashOptions );

  const buffer = new Uint8Array( chunkSize );

  const file = await Deno.open(
    filePath,
    {
      read: true,
    },
  );

  try{
    while( true ){
      // 从文件中读取一块数据。
      const bytesRead = await file.read( buffer );

      // null 表示已经到达文件末尾。
      if( bytesRead === null ){
        break;
      }

      // 0 字节不代表 EOF。
      // Deno 文档明确说明 read() 可能成功返回 0。
      if( bytesRead === 0 ){
        continue;
      }

      // ------------------------------------------------
      // 6. 获取本次真正读取的数据。
      // ------------------------------------------------
      const chunk = buffer.subarray(
        0,
        bytesRead,
      );

      // ------------------------------------------------
      // 7. 将当前 chunk 传给 Rust WASM。
      // ------------------------------------------------
      hasher.update( chunk );
    }
  }
  finally{
    // 无论读取成功还是发生异常，都关闭文件。
    file.close();
  }

  return {
    result: hasher.digest(),
    bytesProcessed: hasher.bytesProcessed(),
  };
}

const result = await CalculateFileHash(
  new URL( `${ webDir }/Windows11_Client_x64_zh-cn_26300_9457.iso` ),
  hashOptions,
);

const endTime = performance.now();

console.log( `
本次耗时（单位为毫秒）：
${ endTime - startTime }
本次耗时（单位为秒）：
${ ( endTime - startTime ) / 1000 }
本次耗时（单位为分钟）：
${ ( endTime - startTime ) / 1000 / 60 }
本次耗时（单位为小时）：
${ ( endTime - startTime ) / 1000 / 60 / 60 }
` );

console.log(
  '文件处理大小：',
  result.bytesProcessed,
);

console.log(
  JSON.stringify(
    result.result,
    null,
    2,
  ),
);
