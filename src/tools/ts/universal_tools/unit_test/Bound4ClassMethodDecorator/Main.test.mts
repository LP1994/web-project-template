#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/Bound4ClassMethodDecorator/Main.test.mts
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
  Bound4ClassMethodDecorator,
} from '../../UniversalTools.esm.mts';

class Person {

  public name: string;

  public constructor( name: string ){
    this.name = name;
  }

  @Bound4ClassMethodDecorator
  public greet(): void{
    console.log( `Hello, my name is ${ this.name }.` );
  }

}

const g = new Person( '张三' ).greet;

g(); // "Hello, my name is 张三."
