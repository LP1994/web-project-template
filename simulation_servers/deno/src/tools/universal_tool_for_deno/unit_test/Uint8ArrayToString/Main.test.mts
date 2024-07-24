#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/Uint8ArrayToString/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * Uint8ArrayToString的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  StringToUint8Array,
  Uint8ArrayToString,
} from '../../UniversalToolForDeno.esm.mts';

Test001( 'Uint8ArrayToString', (): void => {
  Equal001( Uint8ArrayToString( StringToUint8Array( 'Uint8ArrayToString' ) ) ).toBe( 'Uint8ArrayToString' );
} );
