#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/SingletonFactory/Main.test.mts
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
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  SingletonFactory,
} from '../../UniversalToolForNode.esm.mjs';

const obj001: {
  a: number;
} = {
  a: 0,
};

const fun001: () => any = SingletonFactory( (): {
  a: number;
} => obj001 );

const {
  singleton: singleton001,
  // @ts-expect-error
  clear: clear001,
}: any = fun001();

++singleton001.a;

const {
  singleton: singleton002,
  // @ts-expect-error
  clear: clear002,
}: any = fun001();

++singleton002.a;
++singleton002.a;
++singleton002.a;

Test001( 'SingletonFactory', (): void => {
  Equal001( singleton002.a ).toBe( singleton001.a );
} );
