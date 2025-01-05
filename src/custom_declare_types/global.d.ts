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
  type ExtractPropTypes as T_ExtractPropTypes,
  type ExtractPublicPropTypes as T_ExtractPublicPropTypes,
  type MaybeRef as T_MaybeRef,
  type MaybeRefOrGetter as T_MaybeRefOrGetter,
  type ModelRef as T_ModelRef,
  type PropType as T_PropType,
  type Ref as T_Ref,
  type Reactive as T_Reactive,
} from 'vue';

import {
  type AsyncComponentLoader as T_AsyncComponentLoader,
} from '@vue/runtime-core';

declare global {
  type T_VueComponent = T_DefineComponent<{}, {}, any>;

  type T_VueExtractPropTypes<T> = T_ExtractPropTypes<T>;

  type T_VueExtractPublicPropTypes<T> = T_ExtractPublicPropTypes<T>;

  type T_VueMaybeRef<T> = T_MaybeRef<T>;

  type T_VueMaybeRefOrGetter<T> = T_MaybeRefOrGetter<T>;

  type T_VueModelRef<T, M, G, S> = T_ModelRef<T, M, G, S>;

  type T_VuePropType<T> = T_PropType<T>;

  type T_VueRef<T, S> = T_Ref<T, S>;

  type T_VueReactive<T> = T_Reactive<T>;

  type T_LoadRemoteVueComponent = Awaited<ReturnType<T_AsyncComponentLoader<T_DefineComponent<{}, {}, any>>>>;

  type T_MF_v2_RuntimeAPI_UserOptions = UserOptions;

  type T_MF_v2_RuntimeAPI_FederationHost = typeof FederationHost;

  type T_MF_v2_RuntimeAPI_LoadRemote<T> = typeof loadRemote<T>;
}
