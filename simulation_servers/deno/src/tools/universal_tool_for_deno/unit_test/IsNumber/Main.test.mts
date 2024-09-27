#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/IsNumber/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * IsNumber的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsNumber,
} from '../../UniversalToolForDeno.esm.mts';

Test001( 'IsNumber', (): void => {
  Equal001( IsNumber( NaN ) ).toBe( true );
} );
Test001( 'IsNumber', (): void => {
  Equal001( IsNumber( 1 ) ).toBe( true );
} );
Test001( 'IsNumber', (): void => {
  Equal001( IsNumber( '1' ) ).toBe( false );
} );
Test001( 'IsNumber', (): void => {
  Equal001( IsNumber( Number( 1 ) ) ).toBe( true );
} );
Test001( 'IsNumber', (): void => {
  Equal001( IsNumber( new Number( 1 ) ) ).toBe( false );
} );
