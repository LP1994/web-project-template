'use strict';

// ts-node-esm --project ./configures/tsconfig/ts-node.tsconfig.json5 ./src/DemoA.mts
// ts-node --esm --project ./configures/tsconfig/ts-node.tsconfig.json5 ./src/DemoA.mts

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
