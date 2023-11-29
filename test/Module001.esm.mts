#!/usr/bin/env -S tsx

/**
 * Project: web-project-template
 * FileDirPath: src/pages/hello_world/Module001.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-03 23:18:02 星期六
 */

'use strict';

import {
  Test001ForModule002,

  // @ts-ignore
} from './Module002.esm.mts';

const Test001ForModule001: string = 'Test001ForModule001';

export {
  Test001ForModule001,
  Test001ForModule002,
};

export default {
  Test001ForModule001,
  Test001ForModule002,
};
