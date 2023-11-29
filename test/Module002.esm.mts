#!/usr/bin/env -S tsx

/**
 * Project: web-project-template
 * FileDirPath: src/pages/hello_world/Module002.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-03 23:18:22 星期六
 */

'use strict';

enum Enum001 {
  ERROR = 111,
  WARN = 222,
  INFO = 'INFO001',
  DEBUG = 333,
}

/**
 * 等同于：type TypeEnum001 = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type TypeEnum001 = typeof Enum001;

type Type001<T> = {
  [P in keyof T]: T[P];
};

let Test001ForModule002: Type001<TypeEnum001> = {
  ERROR: 111,
  WARN: 222,
  INFO: Enum001.INFO,
  DEBUG: 333,
};

console.dir( Test001ForModule002 );

export {
  Test001ForModule002,
};

export default {
  Test001ForModule002,
};
