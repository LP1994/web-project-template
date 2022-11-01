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
} );

export {
  MimeTypeMap,
  Mime,
  mime,
  mimelite,
};

export default {
  MimeTypeMap,
  Mime,
  mime,
  mimelite,
};
