#!/usr/bin/env -S deno run -A --config=../../../../../deno.jsonc --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../../../../../.env.deno

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/IsArray/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * IsArray的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsArray,
} from '../../UniversalToolForDeno.esm.mts';

Test001( 'IsArray', (): void => {
  Equal001( IsArray( [] ) ).toBe( true );
} );
Test001( 'IsArray', (): void => {
  Equal001( IsArray( 1 ) ).toBe( false );
} );
Test001( 'IsArray', (): void => {
  Equal001( IsArray( Array( 2 ) ) ).toBe( true );
} );
Test001( 'IsArray', (): void => {
  Equal001( IsArray( new Array( 3 ) ) ).toBe( true );
} );
