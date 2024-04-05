#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --lock-write --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/DateFormatForObject/Main.test.mts
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
} from '../../UniversalToolForDeno.esm.mts';

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
