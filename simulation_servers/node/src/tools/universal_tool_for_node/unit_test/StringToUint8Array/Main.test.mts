#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/StringToUint8Array/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * StringToUint8Array的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  StringToUint8Array,
  Uint8ArrayToString,
} from '../../UniversalToolForNode.esm.mjs';

Test001( 'StringToUint8Array', (): void => {
  Equal001( Uint8ArrayToString( StringToUint8Array( 'StringToUint8Array' ) ) ).toBe( 'StringToUint8Array' );
} );
