/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/IsNumber/Main.test.mts
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
  chalk,
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsNumber,
} from '../../UniversalTools.esm.mts';

console.log( chalk.green( `\n符合期望值的不会输出任何信息，只输出不符合期望值所导致的错误信息。\n` ) );

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
