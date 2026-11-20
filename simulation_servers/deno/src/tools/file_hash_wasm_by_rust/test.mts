import {
  webDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  FileHasher,
} from './dist/FileHashWasmByRust.js';

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
  chunkSize: number = 1 * 1024 * 1024 * 1024,
){

  // --------------------------------------------------------
  // 1. 检查 chunkSize。
  // --------------------------------------------------------

  if(
    !Number.isSafeInteger( chunkSize ) ||
    chunkSize <= 0
  ){

    throw new RangeError(
      'chunkSize 必须是大于 0 的安全整数。',
    );

  }

  // --------------------------------------------------------
  // 2. 创建 Rust WASM 哈希计算器。
  // --------------------------------------------------------

  const hasher = new FileHasher( hashOptions );

  // --------------------------------------------------------
  // 3. 创建文件读取缓冲区。
  // --------------------------------------------------------

  const buffer = new Uint8Array( chunkSize );

  // --------------------------------------------------------
  // 4. 打开文件。
  // --------------------------------------------------------

  const file = await Deno.open(
    filePath,
    {
      read: true,
    },
  );

  try{

    // ----------------------------------------------------
    // 5. 循环读取文件。
    // ----------------------------------------------------

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

  // --------------------------------------------------------
  // 8. 返回计算结果。
  // --------------------------------------------------------

  return {

    result: hasher.digest(),

    bytesProcessed: hasher.bytesProcessed(),

  };

}

// ============================================================
// 执行示例
// ============================================================

const hashOptions = {
  'md5': {
    'hex': '',
    'base64': ''
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
  }
};

// 使用 4 MiB chunk。
const result = await CalculateFileHash(
  // 1.avif
  // Windows11_Client_x64_zh-cn_26300_9457.iso
  new URL( `${ webDir }/Windows11_Client_x64_zh-cn_26300_9457.iso` ),
  hashOptions,
  // 1 * 1024 * 1024 * 1024
  // 4 * 1024 * 1024
  1 * 1024 * 1024 * 1024,
);

console.log(
  JSON.stringify(
    result.result,
    null,
    4,
  ),
);

console.log(
  '文件处理大小：',
  result.bytesProcessed,
);
