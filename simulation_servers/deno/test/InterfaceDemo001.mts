/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/test/InterfaceDemo001.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-25 13:30:22 星期五
 */

'use strict';

abstract class MyClass002 {

  getAge(): number{
    return 11;
  }

  protected abstract name: string;

}

interface MyInterface001
  extends MyClass002 {

  getName(): string;

  setName( name: string ): void;

}

class MyClass001
  extends MyClass002
  implements MyInterface001 {

  protected name: string = 'LP';

  constructor(){
    super();
  }

  getName(): string{
    return this.name;
  }

  setName( name: string ): void{
    this.name = name;
  }

}

const myClass001: MyClass001 = new MyClass001();

myClass001.setName( 'LMF' );

console.log( myClass001.getName() );
console.log( myClass001.getAge() );
