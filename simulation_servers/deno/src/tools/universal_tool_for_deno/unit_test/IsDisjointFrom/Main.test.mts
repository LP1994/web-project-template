#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --lock-write --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/IsDisjointFrom/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * IsDisjointFrom的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsDisjointFrom,
} from '../../UniversalToolForDeno.esm.mts';

Test001( 'IsDisjointFrom', (): void => {
  Equal001( IsDisjointFrom(
    [
      1,
      2,
      3,
      4,
      3,
      4,
    ],
    [
      2,
      3,
      4,
      5,
      4,
      5,
      6,
    ]
  ) ).toBe( false );
} );
