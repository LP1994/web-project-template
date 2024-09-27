#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/SingletonFactoryByGlobal/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * SingletonFactoryByGlobal的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  type T_SingletonByGlobal,

  SingletonFactoryByGlobal,
} from '../../UniversalToolForDeno.esm.mts';

const obj001: {
  a: number;
} = {
  a: 0,
};

const fun001: () => T_SingletonByGlobal<{
  a: number;
}> = SingletonFactoryByGlobal<{
  a: number;
}>( (): {
  a: number;
} => obj001 );

const {
  singletonByGlobal: singletonByGlobal001,
  // @ts-expect-error
  clear: clear001,
}: T_SingletonByGlobal<{
  a: number;
}> = fun001();
++singletonByGlobal001.a;

const {
  SingletonFactoryByGlobal: SingletonFactoryByGlobal002,
}: {
  [ key: string ]: any;
} = await import( '../../UniversalToolForDeno.esm.mts' );

const fun002: () => T_SingletonByGlobal<{
  a: number;
}> = SingletonFactoryByGlobal002( (): {
  a: number;
} => obj001 );

const {
  singletonByGlobal: singletonByGlobal002,
  // @ts-expect-error
  clear: clear002,
}: T_SingletonByGlobal<{
  a: number;
}> = fun002();
++singletonByGlobal002.a;
++singletonByGlobal002.a;
++singletonByGlobal002.a;

Test001( 'SingletonFactoryByGlobal', (): void => {
  Equal001( singletonByGlobal001.a ).toBe( singletonByGlobal002.a );
} );
