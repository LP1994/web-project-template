#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../../../../../.env.deno

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/IsSubsetOf/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * IsSubsetOf的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsSubsetOf,
} from '../../UniversalToolForDeno.esm.mts';

Test001( 'IsSubsetOf', (): void => {
  Equal001( IsSubsetOf(
    [
      1,
      2,
      3,
      4,
      3,
      4,
      5,
      6,
      7,
    ],
    [
      2,
      3,
      4,
      5,
      6,
      4,
      5,
      6,
    ]
  ) ).toBe( true );
} );
