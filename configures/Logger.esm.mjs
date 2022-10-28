/**
 * Project: web-project-template
 * FileDirPath: configures/Logger.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  open,
} from 'node:fs/promises';

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
