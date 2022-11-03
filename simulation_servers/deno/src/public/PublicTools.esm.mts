/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/public/PublicTools.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 19:35:23 星期二
 */

'use strict';

import {
  mimetypes,
  // @ts-ignore
} from './ThirdPartyModules.esm.mts';

const {
  MimeTypeMap,
  Mime,
  mime,
  mimelite,
}: any = mimetypes;

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

async function IterateToNestForPromise<T>( arg: T | Promise<T> ): Promise<T>{
  if( Object.prototype.toString.call( arg ) !== '[object Promise]' ){
    return arg as T;
  }
  else if( Object.prototype.toString.call( arg = await arg ) === '[object Promise]' ){
    return await IterateToNestForPromise( arg as Promise<T> );
  }
  else{
    return arg as T;
  }
}

export {
  MimeTypeMap,
  Mime,
  mime,
  mimelite,

  IterateToNestForPromise,
};

export default {
  MimeTypeMap,
  Mime,
  mime,
  mimelite,

  IterateToNestForPromise,
};
