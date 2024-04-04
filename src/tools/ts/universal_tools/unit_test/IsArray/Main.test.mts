/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/IsArray/Main.test.mts
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
  chalk,
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsArray,
} from '../../UniversalTools.esm.mts';

console.log( chalk.green( `\n符合期望值的不会输出任何信息，只输出不符合期望值所导致的错误信息。\n` ) );

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
