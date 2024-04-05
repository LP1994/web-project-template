#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/Difference/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * Difference的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  Difference,
} from '../../UniversalTools.esm.mts';

Test001( 'Difference', (): void => {
  Equal001( JSON.stringify( Difference(
    [
      1,
      2,
      3,
      3,
      4,
    ],
    [
      2,
      3,
      4,
      5,
      6,
    ]
  ) ) ).toBe( JSON.stringify( [ 1, ] ) );
} );
