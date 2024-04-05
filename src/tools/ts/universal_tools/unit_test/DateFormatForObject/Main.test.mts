/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/DateFormatForObject/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * DateFormatForObject的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  DateFormatForObject,
} from '../../UniversalTools.esm.mts';

Test001( 'DateFormatForObject', (): void => {
  Equal001( JSON.stringify( DateFormatForObject( new Date( 1670010887679 ) ) ) ).toBe( JSON.stringify( {
    year: '2022',
    month: '12',
    date: '03',
    hours: '03',
    minutes: '54',
    seconds: '47',
    day: '6'
  } ) );
} );
