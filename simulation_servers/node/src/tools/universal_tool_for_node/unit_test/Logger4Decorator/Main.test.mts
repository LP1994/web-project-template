#!/usr/bin/env -S tsx --no-cache

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/Logger4Decorator/Main.test.mts
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
} from '../../UniversalToolForNode.esm.mjs';

class Person {

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  public static Age: number = 11;

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  static #MyAge: number = 520;

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  public name: string = 'LMF';

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  #myName: string = '私有LYF';

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
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

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  #getMyName(): string{
    return `Hello, My name is ${ this.#myName }.`;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  public getAliasName(): string{
    return this.#getMyName();
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  public static GetAge(): string{
    return `Hello, My age is ${ this.Age }.`;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  static #GetMyAge(): string{
    return `Hello, My age is ${ this.#MyAge }.`;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  public static GetAliasAge(): string{
    return this.#GetMyAge();
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: true,
  } )
  public async setSex( sex: string ): Promise<string>{
    return `Hello, My sex is ${ sex }.`;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
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

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
  getInfo(): string{
    return this.info;
  }

  @Logger4Decorator( {
    level: 'log',
    message: '类Person',
    async: false,
  } )
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

person.getAliasName();

Person.GetAge();

Person.GetAliasAge();

await ( person.setSex( '女' ) );

console.log( `设置前person.info--->` );
person.getInfo();

person.setInfo( '7788' );

console.log( `设置后person.info--->` );
person.getInfo();

console.log( `设置前person.id--->` );
person.id;

person.id = '20240423001AAA';

console.log( `设置后person.id--->` );
person.id;
