#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/IsNumber/Main.test.mts
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
} from '../../UniversalToolForNode.esm.mjs';

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
