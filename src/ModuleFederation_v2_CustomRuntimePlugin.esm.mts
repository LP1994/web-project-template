/**
 * Project: web-project-template
 * FileDirPath: src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-01-01 00:00:00 星期六
 */

/**
 * Module Federation V2
 * 详细见：https://module-federation.io/guide/start/index.html
 * 插件的使用见：https://module-federation.io/plugin/dev/index.html#plugin-system
 */

'use strict';

import {
  type FederationRuntimePlugin as T_FederationRuntimePlugin,

  FederationHost,
} from '@module-federation/enhanced/runtime';

import {
  type Module as T_Module,
  type ModuleInfo as T_ModuleInfo,
  type RemoteEntryType as T_RemoteEntryType,
  type RemoteWithEntry as T_RemoteWithEntry,
  type RemoteWithVersion as T_RemoteWithVersion,
} from '@module-federation/sdk';

type T_AfterResolveOptions = {
  id: string;
  pkgNameOrAlias: string;
  expose: string;
  remote: T_Remote;
  options: T_FederationRuntimeOptions;
  origin: FederationHost;
  remoteInfo: T_RemoteInfo;
  remoteSnapshot?: T_ModuleInfo;
};

type T_FederationRuntimeOptions = {
  id?: string;
  name: string;
  version?: string;
  remotes: Array<T_Remote>;
  shared: T_ShareInfos;
  plugins: Array<T_FederationRuntimePlugin>;
  inBrowser: boolean;
};

type T_Remote = ( T_RemoteWithEntry | T_RemoteWithVersion ) & T_RemoteInfoCommon;

type T_RemoteInfo = {
  name: string;
  version?: string;
  buildVersion?: string;
  entry: string;
  type: T_RemoteEntryType;
  entryGlobalName: string;
  shareScope: string;
};

type T_RemoteInfoCommon = {
  alias?: string;
  shareScope?: string;
  type?: T_RemoteEntryType;
  entryGlobalName?: string;
};

type T_Shared = {
  version: string;
  get: T_SharedGetter;
  shareConfig: T_SharedConfig;
  scope: Array<string>;
  useIn: Array<string>;
  from: string;
  deps: Array<string>;
  lib?: () => T_Module;
  loaded?: boolean;
  loading?: null | Promise<any>;
  eager?: boolean;
  /**
   * @deprecated set in initOptions.shareStrategy instead
   */
  strategy: T_ShareStrategy;
};

type T_SharedConfig = {
  singleton?: boolean;
  requiredVersion: false | string;
  eager?: boolean;
  strictVersion?: boolean;
};

type T_SharedGetter = ( () => () => T_Module ) | ( () => Promise<() => T_Module> );

type T_ShareInfos = {
  [ pkgName: string ]: T_Shared[];
};

type T_ShareStrategy = 'version-first' | 'loaded-first';

function ModuleFederation_v2_CustomRuntimePlugin(): T_FederationRuntimePlugin{
  return {
    name: 'mf-v2-custom-runtime-plugin',

    // 在解析容器后调用，允许重定向或修改已解析的信息。
    afterResolve( args: T_AfterResolveOptions ): T_AfterResolveOptions{
      console.dir( '\n\n\nafterResolve', args );

      return args;
    },

  };
}

export {
  ModuleFederation_v2_CustomRuntimePlugin,
};

export default ModuleFederation_v2_CustomRuntimePlugin;
