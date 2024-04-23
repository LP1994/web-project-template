#!/usr/bin/env -S deno run -A --config=../../../../../deno.json --lock-write --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/Logger4Decorator/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * Logger4Decorator的单元测试。
 */

'use strict';

import {
  Logger4Decorator,
} from '../../UniversalToolForDeno.esm.mts';

class Person {

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  public name: string = 'LMF';

  #myName: string = '私有LYF';

  public static Age: number = 11;

  static #MyAge: number = 520;

  public sex: string = '男';

  public constructor( name: string = 'LMF' ){
    this.name = name;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  public getName(): string{
    return `Hello, My name is ${ this.name }.`;
  }

  #getMyName(): string{
    return `Hello, My name is ${ this.#myName }.`;
  }

  public getAliasName(): string{
    return this.#getMyName();
  }

  public static GetAge(): string{
    return `Hello, My age is ${ this.Age }.`;
  }

  static #GetMyAge(): string{
    return `Hello, My age is ${ this.#MyAge }.`;
  }

  public static GetAliasAge(): string{
    return this.#GetMyAge();
  }

  public async setSex( sex: string ): Promise<string>{
    return `Hello, My sex is ${ sex }.`;
  }

  #info: string = '个人信息！';

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  get info(): string{
    return this.#info;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  set info( info: string ){
    this.#info = info;
  }

  getInfo(): string{
    return this.info;
  }

  setInfo( info: string ): void{
    this.info = info;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  accessor id: string = '20240423001';

}

const person: Person = new Person( '李四' );

person.getName();

person.setInfo( '7788' );

person.getInfo();

person.id = '20240423001AAA';

console.log( `person.id--->${ person.id }` );

// new Person().getAliasName();

// Person.GetAge();

// Person.GetAliasAge();

// await ( new Person().setSex( '女' ) );
