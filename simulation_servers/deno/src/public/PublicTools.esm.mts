/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/public/PublicTools.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 19:35:23 星期二
 */

/**
 * 特定于这个项目的公共的、通用的工具脚本。
 */

'use strict';

import {
  // Deno自己有一个名为media_types的API功能跟它一样。
  mimetypes,

  // @ts-ignore
} from './ThirdPartyModules.esm.mts';

// Deno自己有一个名为media_types的API功能跟它一样。
const {
  MimeTypeMap,
  Mime,
  mime,
  mimelite,
}: any = mimetypes;

// Deno自己有一个名为media_types的API功能跟它一样。
mime.define( {
  'text/html; charset=utf-8': [
    'ejs',
  ],
  'application/json; charset=utf-8': [
    'json',
  ],
  'text/plain; charset=utf-8': [
    'gitignore',
  ],
}, true );

/**
 * 处理嵌套的“Promise”（形如：Promise<Promise<Promise<T>>>等等这样的多层嵌套，嵌套层数也是未知的），使其只返回最终的不带“Promise”的结果值。
 *
 * @param {Promise<T> | T} arg 需要被处理的数据，无默认值，必需。
 *
 * @returns {Promise<T>} 返回最终的不带“Promise”的结果值（就是“T”）。
 */
async function IterateToNestForPromise<T>( arg: T | Promise<T> ): Promise<T>{
  let result: T;

  if( Object.prototype.toString.call( arg ) !== '[object Promise]' ){
    result = arg as T;
  }
  else if( Object.prototype.toString.call( arg = await arg ) === '[object Promise]' ){
    result = await IterateToNestForPromise( arg as Promise<T> );
  }
  else{
    result = arg as T;
  }

  return result;
}

export {
  // Deno自己有一个名为media_types的API功能跟它一样。
  MimeTypeMap,
  Mime,
  mime,
  mimelite,

  IterateToNestForPromise,
};

export default {
  // Deno自己有一个名为media_types的API功能跟它一样。
  MimeTypeMap,
  Mime,
  mime,
  mimelite,

  IterateToNestForPromise,
};
