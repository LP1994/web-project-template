#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/GetDataType/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * GetDataType的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  GetDataType,
} from '../../UniversalToolForNode.esm.mjs';

Test001( 'GetDataType', (): void => {
  Equal001( GetDataType( [] ) ).toBe( '[object Array]' );
} );
Test001( 'GetDataType', (): void => {
  Equal001( GetDataType( Array( 2 ) ) ).toBe( '[object Array]' );
} );
Test001( 'GetDataType', (): void => {
  Equal001( GetDataType( new Array( 3 ) ) ).toBe( '[object Array]' );
} );
