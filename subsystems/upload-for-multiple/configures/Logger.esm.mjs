/**
 * Project: upload-for-multiple
 * FileDirPath: configures/Logger.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 该工具用于打开文件（没有就创建一个新的文件再打开），并持续写入。一般用于日志记录什么的。
 */

'use strict';

import {
  open,
} from 'node:fs/promises';

/**
 * 用于打开文件（没有就创建一个新的文件再打开），并持续写入。一般用于日志记录什么的。
 *
 * @param {string} filePath 文件路径，必需。
 *
 * @param {string} flags 文件标志，默认值为“a+”，表示打开文件（没有就创建一个新的文件再打开），并持续写入，不断地追加而不是覆盖先前的内容，可选。
 *
 * @returns {Promise<WriteStream>} 返回一个可写入的流对象。
 */
async function CreateLogger( filePath, flags = 'a+' ){
  const fileHandle = await open( filePath, flags );

  return fileHandle.createWriteStream();
}

export {
  CreateLogger,
};

export default {
  CreateLogger,
};
