#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/IsSupersetOf/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * IsSupersetOf的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsSupersetOf,
} from '../../UniversalTools.esm.mts';

Test001( 'IsSupersetOf', (): void => {
  Equal001( IsSupersetOf(
    [
      1,
      2,
      3,
      4,
      3,
      4,
    ],
    [
      1,
      2,
      3,
      4,
      3,
      4,
      5,
      6,
    ]
  ) ).toBe( true );
} );
