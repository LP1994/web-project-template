/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/SingletonFactory/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * SingletonFactory的单元测试。
 */

'use strict';

import {
  chalk,
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  type T_Singleton,

  SingletonFactory,
} from '../../UniversalTools.esm.mts';

console.log( chalk.green( `\n符合期望值的不会输出任何信息，只输出不符合期望值所导致的错误信息。\n` ) );

const obj001: {
  a: number;
} = {
  a: 0,
};

const fun001: () => T_Singleton<{
  a: number;
}> = SingletonFactory<{
  a: number;
}>( (): {
  a: number;
} => obj001 );

const {
  singleton: singleton001,
  // @ts-expect-error
  clear: clear001,
}: T_Singleton<{
  a: number;
}> = fun001();

++singleton001.a;

const {
  singleton: singleton002,
  // @ts-expect-error
  clear: clear002,
}: T_Singleton<{
  a: number;
}> = fun001();

++singleton002.a;
++singleton002.a;
++singleton002.a;

Test001( 'SingletonFactory', (): void => {
  Equal001( singleton002.a ).toBe( singleton001.a );
} );
