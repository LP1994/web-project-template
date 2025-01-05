/**
 * Project: web-project-template
 * FileDirPath: src/custom_declare_types/global.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 这个文件用来放置全局的类型声明。
 */

// 用于确保该文件是模块。
export {};

import {
  type UserOptions,
  FederationHost,
  loadRemote,
} from '@module-federation/enhanced/runtime';

import {
  type DefineComponent as T_DefineComponent,
} from 'vue';

import {
  type AsyncComponentLoader as T_AsyncComponentLoader,
} from '@vue/runtime-core';

declare global {
  type T_VueComponent = T_DefineComponent<{}, {}, any>;

  type T_LoadRemoteVueComponent = Awaited<ReturnType<T_AsyncComponentLoader<T_DefineComponent<{}, {}, any>>>>;

  type T_MF_v2_RuntimeAPI_UserOptions = UserOptions;

  type T_MF_v2_RuntimeAPI_FederationHost = typeof FederationHost;

  type T_MF_v2_RuntimeAPI_LoadRemote<T> = typeof loadRemote<T>;
}
