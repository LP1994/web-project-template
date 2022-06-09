'use strict';

const arr1: number[] = [
  11,
  22,
  33,
  44,
  55,
];

function Fun1(): void{
  let str1: string = '';

  for( const item of
    arr1 ){
    str1 += String( item ) + '___';
  }

  console.log( str1 );
}

export {
  Fun1,
};

export default Fun1;
