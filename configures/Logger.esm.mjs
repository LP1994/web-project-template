/*
 Project: web-project-template
 FileDirPath: configures/Logger.esm.mjs
 Author: 12278
 Email: 1227839175@qq.com
 IDE: WebStorm
 CreateDate: 2022-10-20 03:12:27 星期四
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
