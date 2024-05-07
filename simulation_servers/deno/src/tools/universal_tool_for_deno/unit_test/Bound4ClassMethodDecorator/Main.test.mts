#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --lock-write --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/Bound4ClassMethodDecorator/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * Bound4ClassMethodDecorator的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from '../AuxiliaryTool.test.esm.mts';

import {
  Bound4ClassMethodDecorator,
} from '../../UniversalToolForDeno.esm.mts';

class Person {

  public name: string;

  public constructor( name: string ){
    this.name = name;
  }

  @Bound4ClassMethodDecorator
  public greet(): string{
    return `Hello, my name is ${ this.name }.`;
  }

}

const g = new Person( '张三' ).greet;

Test001( 'Bound4ClassMethodDecorator', (): void => {
  Equal001( g() ).toBe( `Hello, my name is 张三.` );
} );
