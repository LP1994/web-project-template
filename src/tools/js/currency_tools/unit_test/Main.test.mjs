#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-quic --experimental-eventsource --experimental-vm-modules --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: web-project-template
 * FileDirPath: src/tools/js/currency_tools/unit_test/Main.test.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * CurrencyTools.esm.mjs的单元测试。
 */

'use strict';

import {
  chalk,
  Equal001,
  Test001,
} from './AuxiliaryTool.test.esm.mjs';

console.log( chalk.green( `\n符合期望值的不会输出任何信息，只输出不符合期望值所导致的错误信息。\n` ) );
