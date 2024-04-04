/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/IsString/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * IsString的单元测试。
 */

'use strict';

import {
  chalk,
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  IsString,
} from '../../UniversalTools.esm.mts';

console.log( chalk.green( `\n符合期望值的不会输出任何信息，只输出不符合期望值所导致的错误信息。\n` ) );

Test001( 'IsString', (): void => {
  Equal001( IsString( '' ) ).toBe( true );
} );
Test001( 'IsString', (): void => {
  Equal001( IsString( 1 ) ).toBe( false );
} );
Test001( 'IsString', (): void => {
  Equal001( IsString( String( '1' ) ) ).toBe( true );
} );
Test001( 'IsString', (): void => {
  Equal001( IsString( new String( '1' ) ) ).toBe( false );
} );
