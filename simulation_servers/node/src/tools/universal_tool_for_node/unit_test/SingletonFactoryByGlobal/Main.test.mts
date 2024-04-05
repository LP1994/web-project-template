#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/SingletonFactoryByGlobal/Main.test.mts
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
  SingletonFactoryByGlobal,
} from '../../UniversalToolForNode.esm.mjs';

const obj001: {
  a: number;
} = {
  a: 0,
};

const fun001: () => any = SingletonFactoryByGlobal( (): {
  a: number;
} => obj001 );

const {
  singletonByGlobal: singletonByGlobal001,
  // @ts-expect-error
  clear: clear001,
}: any = fun001();
++singletonByGlobal001.a;

const {
  SingletonFactoryByGlobal: SingletonFactoryByGlobal002,
}: {
  [ key: string ]: any;
} = await import( '../../UniversalToolForNode.esm.mjs' );

const fun002: () => any = SingletonFactoryByGlobal002( (): {
  a: number;
} => obj001 );

const {
  singletonByGlobal: singletonByGlobal002,
  // @ts-expect-error
  clear: clear002,
}: any = fun002();
++singletonByGlobal002.a;
++singletonByGlobal002.a;
++singletonByGlobal002.a;

Test001( 'SingletonFactoryByGlobal', (): void => {
  Equal001( singletonByGlobal001.a ).toBe( singletonByGlobal002.a );
} );
