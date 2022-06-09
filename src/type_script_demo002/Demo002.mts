'use strict';

class MyClass001 {
  str1: string = 'str1str1str1';

  #num1: number = 111;

  static Boolean1: boolean = true;

  constructor(){
  }

  getStr1(): void{
    console.log( this.str1 );
  }

  #getNum1(): void{
    console.log( this.#num1 );
  }

  start001(): void{
    this.#getNum1();
  }

  static GetBoolean1(){
    console.log( this.Boolean1 );
  }
}

function Fun2(): void{
  new MyClass001().getStr1();
  new MyClass001().start001();
  MyClass001.GetBoolean1();
}

export {
  Fun2,
};

export default Fun2;
