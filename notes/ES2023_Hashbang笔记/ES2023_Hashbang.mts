#!/usr/bin/env -S tsx --no-cache

'use strict';

import {
  argv,
} from 'node:process';

let str001: string = 'ES2023的新增语法Hashbang又叫Shebang。';

console.log( `${ str001 }` );

console.log( `执行时，由外部传入的参数，例如：从命令行中传入的参数：` );
console.dir( argv );
