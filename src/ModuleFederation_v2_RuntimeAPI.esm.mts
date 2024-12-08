/**
 * Project: web-project-template
 * FileDirPath: src/ModuleFederation_v2_RuntimeAPI.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-01-01 00:00:00 星期六
 */

/**
 * Module Federation V2
 * 详细见：https://module-federation.io/guide/start/index.html
 * 运行时API的使用见：https://module-federation.io/guide/basic/runtime.html#federation-runtime
 */

'use strict';

import {
  // @ts-ignore
  type UserOptions as T_MF_v2_RuntimeAPI_UserOptions,

  FederationHost as MF_v2_RuntimeAPI_FederationHost,

  init as MF_v2_RuntimeAPI_Init,
  loadRemote as MF_v2_RuntimeAPI_LoadRemote,
} from '@module-federation/enhanced/runtime';

type T_MF_v2_RuntimeAPI_FederationHost = typeof MF_v2_RuntimeAPI_FederationHost;

type T_MF_v2_RuntimeAPI_LoadRemote<T> = typeof MF_v2_RuntimeAPI_LoadRemote<T>;

export {
  type T_MF_v2_RuntimeAPI_UserOptions,
  type T_MF_v2_RuntimeAPI_FederationHost,
  type T_MF_v2_RuntimeAPI_LoadRemote,

  // 该函数的函数参数类型为：T_MF_v2_RuntimeAPI_UserOptions。该函数调用后返回值的类型为：T_MF_v2_RuntimeAPI_FederationHost。
  MF_v2_RuntimeAPI_Init,
  // 该函数的类型为：T_MF_v2_RuntimeAPI_LoadRemote。
  MF_v2_RuntimeAPI_LoadRemote,
};

export default {
  MF_v2_RuntimeAPI_Init,
  MF_v2_RuntimeAPI_LoadRemote,
};
