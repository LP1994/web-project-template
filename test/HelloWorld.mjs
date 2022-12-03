/**
 * Project: web-project-template
 * FileDirPath: src/pages/hello_world/HelloWorld.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  Test001ForModule001,
  Test001ForModule002,
} from './Module001.esm.mts';

document.querySelector( 'main' ).textContent = `Hello World!---${ Test001ForModule001 }---${ Test001ForModule002 }`;
