/*
 Project: web-project-template
 FileDirPath: src/pages/hello_world/MyModule001.esm.mjs
 Author: 12278
 Email: 1227839175@qq.com
 IDE: WebStorm
 CreateDate: 2022-09-07 10:53:23 星期三
 */

'use strict';

function Test001(){
  document.querySelector( 'h1' ).textContent = `Hello World! Test001.`;
}

function Test002(){
  document.querySelector( 'h1' ).textContent = `Hello World! Test002.`;
}

export {
  Test001,
  Test002,
};

export default {
  Test001,
  Test002,
};
