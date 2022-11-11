/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/public/ThirdPartyModules.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 16:03:51 星期二
 */

'use strict';

// @ts-ignore
import * as dejs from 'DenoX/dejs/mod.ts';

// Deno自己有一个名为media_types的API功能跟它一样。
// @ts-ignore
import * as mimetypes from 'tools/third_party_modules/mimetypes@1.0.0.ts'

export {
  dejs,
  // Deno自己有一个名为media_types的API功能跟它一样。
  mimetypes,
};

export default {
  dejs,
  // Deno自己有一个名为media_types的API功能跟它一样。
  mimetypes,
};
