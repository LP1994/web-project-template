'use strict';

import {
  Fun1,
  // @ts-expect-error
} from './type_script_demo001/Demo001.mts';

import {
  Fun2,
  // @ts-expect-error
} from './type_script_demo002/Demo002.mts';

import {
  Fun3,
  // @ts-expect-error
} from './type_script_demo001/type_script_demo003/Demo003.mts';

Fun1();
Fun2();
Fun3();

enum Enum001 {
  qwe = 2022,
  asd = 2030,
  zxc,
}

console.log( `${ Enum001.asd }---${ Enum001[ 2030 ] }` );

console.dir( Enum001 );
