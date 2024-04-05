#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/Uint8ArrayToString/Main.test.mts
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
} from '../../UniversalTools.esm.mts';

Test001( 'Uint8ArrayToString', (): void => {
  Equal001( Uint8ArrayToString( StringToUint8Array( 'Uint8ArrayToString' ) ) ).toBe( 'Uint8ArrayToString' );
} );
