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

/**
 * 个人编写了一个自定义插件（注意，只是扩展了功能，不影响原本的功能）：“./src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts”。<br />
 * 注意：该自定义插件只能在插件构建模式下使用，不能在运行时注册使用该插件！因为其功用是在“beforeInit”函数中定义的，但是该函数是不会在运行时被调用的，只会在插件构建模式下被调用。<br />
 * 其功用是在“beforeInit”函数中，将自定义标识“#auto#”处理为：<br />
 * <code>
 * remote.entry = new URL( remote.entry.split( '#auto#' ).at( -1 ), location.href ).href
 * </code>
 * 自定义标识“#auto#”表示，该“远端模块提供者”的加载地址(也就是JS脚本url)是根据“远端模块使用者”的“origin”、“浏览器页面上的url”等处理成相对“远端模块使用者”url路径的“远端模块提供者”url路径。<br />
 * 使用例如：<br />
 * 在“ModuleFederation_v2_Config.esm.mjs”中有如下设置：<br />
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@${
 *     isProduction
 *     ? `#auto#${ process.env.RemoteUploadForMultipleURL }`
 *     : process.env.RemoteUploadForMultipleURL
 *   }RemoteEntry_UploadForMultiple.js`,
 * },
 * runtimePlugins: [
 *   resolve( __dirname, './src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts' ),
 * ],
 * </code>
 * 在环境变量配置文件（.env.dev）中：<br />
 * <code>
 * RemoteUploadForMultipleURL=https://localhost:8101/dev_server/mf_v2/
 * </code>
 * 在环境变量配置文件（.env.production）中：<br />
 * <code>
 * RemoteUploadForMultipleURL=../mf_v2/upload_for_multiple/mf_v2/
 * </code>
 * 在开发模式（isProduction为false）下，上面的“remotes”实际是如此：<br />
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@https://localhost:8101/dev_server/mf_v2/RemoteEntry_UploadForMultiple.js`,
 * },
 * </code>
 * 在生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@#auto#../mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
 * },
 * </code>
 * 通过自定义插件（注意，只是扩展了功能，不影响原本的功能）处理后，生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
 * 假定“远端模块使用者”的浏览器页面url地址是：<br />
 * http://localhost:8090/web-project-template/dist/production/pages/Upload.html
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@http://localhost:8090/web-project-template/dist/production/mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
 * },
 * </code>
 * 这样，原本插件构建模式下的“固定url（这里的“固定”一词是相对运行时可以动态设置远端模块提供者的url）”也就可以做到类似在运行时那样，可以动态设置远端模块提供者的url。<br />
 * 注意！该自定义插件只是扩展了功能，不影响原本的功能。<br />
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

// @ts-ignore
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

type T_ArgsType<T> = T extends Array<any>
                     ? T
                     : Array<any>;

type T_BeforeInitOptions = {
  userOptions: T_UserOptions;
  options: T_FederationRuntimeOptions;
  origin: FederationHost;
  shareInfo: T_ShareInfos;
};

// @ts-ignore
type T_BeforeRequestOptions = {
  id: string;
  options: T_FederationRuntimeOptions;
  origin: FederationHost;
};

type T_Callback<T, K> = ( ...args: T_ArgsType<T> ) => K;

// @ts-ignore
type T_CreateScriptOptions = {
  url: string;
  attrs?: Record<string, any>;
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

// @ts-ignore
type T_InitOptions = {
  options: T_FederationRuntimeOptions;
  origin: FederationHost;
};

type T_InitScope = T_InitTokens[];

type T_InitTokens = Record<string, Record<string, any>>;

// @ts-ignore
type T_LoadEntryOptions = {
  createScriptHook: typeof T_SyncHook,
  remoteEntryExports?: T_RemoteEntryExports,
  remoteInfo: T_RemoteInfo
};

type T_ModuleOptions = {
  remoteInfo: T_RemoteInfo;
  host: FederationHost;
};

// @ts-ignore
type T_OnLoadOptions = {
  id: string;
  expose: string;
  pkgNameOrAlias: string;
  remote: T_Remote;
  options: T_ModuleOptions;
  origin: FederationHost;
  exposeModule: any;
  exposeModuleFactory: any;
  moduleInstance: T_Module;
};

type T_Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

type T_Options = {
  id?: string;
  name: string;
  version?: string;
  remotes: Array<T_Remote>;
  shared: T_ShareInfos;
  plugins: Array<T_FederationRuntimePlugin>;
  inBrowser: boolean;
  shareStrategy?: T_ShareStrategy;
};

type T_Remote = ( T_RemoteWithEntry | T_RemoteWithVersion ) & T_RemoteInfoCommon;

type T_RemoteEntryExports = {
  get: ( id: string ) => () => Promise<T_Module>;
  init: (
    shareScope: T_ShareScopeMap[string],
    initScope?: T_InitScope,
    remoteEntryInitOPtions?: T_RemoteEntryInitOptions,
  ) => void | Promise<void>;
};

type T_RemoteEntryInitOptions = {
  version: string;
  shareScopeMap: T_ShareScopeMap;
};

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

type T_ShareArgs = ( T_SharedBaseArgs & {
  get: T_SharedGetter;
} ) | ( T_SharedBaseArgs & {
  lib: () => T_Module;
} ) | T_SharedBaseArgs;

type T_SharedBaseArgs = {
  version?: string;
  shareConfig?: T_SharedConfig;
  scope?: string | Array<string>;
  deps?: Array<string>;
  strategy?: 'version-first' | 'loaded-first';
  loaded?: boolean;
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

type T_ShareScopeMap = {
  [ scope: string ]: {
    [ pkgName: string ]: {
      [ sharedVersion: string ]: T_Shared;
    };
  };
};

type T_ShareStrategy = 'version-first' | 'loaded-first';

type T_UserOptions = Omit<T_Optional<T_Options, 'plugins'>, 'shared' | 'inBrowser'> & {
  shared?: {
    [ pkgName: string ]: T_ShareArgs | T_ShareArgs[];
  };
};

declare class T_SyncHook<T, K> {
  type: string;

  listeners: Set<T_Callback<T, K>>;

  constructor( type?: string );

  on( fn: T_Callback<T, K> ): void;

  once( fn: T_Callback<T, K> ): void;

  emit( ...data: T_ArgsType<T> ): void | K | Promise<any>;

  remove( fn: T_Callback<T, K> ): void;

  removeAll(): void;
}

/**
 * 自定义插件，通过自定义标识“#auto#”，让插件构建模式下也能支持动态设置“远端模块提供者”的url。<br />
 * 关于自定义插件的使用（详细见：https://module-federation.io/plugin/dev/index.html#plugin-system）：<br />
 * 个人编写了一个自定义插件（注意，只是扩展了功能，不影响原本的功能）：“./src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts”。<br />
 * 注意：该自定义插件只能在插件构建模式下使用，不能在运行时注册使用该插件！因为其功用是在“beforeInit”函数中定义的，但是该函数是不会在运行时被调用的，只会在插件构建模式下被调用。<br />
 * 其功用是在“beforeInit”函数中，将自定义标识“#auto#”处理为：<br />
 * <code>
 * remote.entry = new URL( remote.entry.split( '#auto#' ).at( -1 ), location.href ).href
 * </code>
 * 自定义标识“#auto#”表示，该“远端模块提供者”的加载地址(也就是JS脚本url)是根据“远端模块使用者”的“origin”、“浏览器页面上的url”等处理成相对“远端模块使用者”url路径的“远端模块提供者”url路径。<br />
 * 使用例如：<br />
 * 在“ModuleFederation_v2_Config.esm.mjs”中有如下设置：<br />
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@${
 *     isProduction
 *     ? `#auto#${ process.env.RemoteUploadForMultipleURL }`
 *     : process.env.RemoteUploadForMultipleURL
 *   }RemoteEntry_UploadForMultiple.js`,
 * },
 * runtimePlugins: [
 *   resolve( __dirname, './src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts' ),
 * ],
 * </code>
 * 在环境变量配置文件（.env.dev）中：<br />
 * <code>
 * RemoteUploadForMultipleURL=https://localhost:8101/dev_server/mf_v2/
 * </code>
 * 在环境变量配置文件（.env.production）中：<br />
 * <code>
 * RemoteUploadForMultipleURL=../mf_v2/upload_for_multiple/mf_v2/
 * </code>
 * 在开发模式（isProduction为false）下，上面的“remotes”实际是如此：<br />
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@https://localhost:8101/dev_server/mf_v2/RemoteEntry_UploadForMultiple.js`,
 * },
 * </code>
 * 在生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@#auto#../mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
 * },
 * </code>
 * 通过自定义插件（注意，只是扩展了功能，不影响原本的功能）处理后，生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
 * 假定“远端模块使用者”的浏览器页面url地址是：<br />
 * http://localhost:8090/web-project-template/dist/production/pages/Upload.html
 * <code>
 * remotes: {
 *   RemoteUploadForMultiple: `Remote_UploadForMultiple@http://localhost:8090/web-project-template/dist/production/mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
 * },
 * </code>
 * 这样，原本插件构建模式下的“固定url（这里的“固定”一词是相对运行时可以动态设置远端模块提供者的url）”也就可以做到类似在运行时那样，可以动态设置远端模块提供者的url。<br />
 * 注意！该自定义插件只是扩展了功能，不影响原本的功能。<br />
 *
 * @returns {T_FederationRuntimePlugin}
 */
function ModuleFederation_v2_CustomRuntimePlugin(): T_FederationRuntimePlugin{
  return {
    name: 'mf-v2-custom-runtime-plugin',

    /**
     * 在远程容器初始化过程之前更新联合主机配置。<br />
     * 注意：该函数只会在插件构建模式下被调用！<br />
     * PS: SyncWaterfallHook
     *
     * @param {T_BeforeInitOptions} args
     *
     * @returns {T_BeforeInitOptions}
     */
    beforeInit( args: T_BeforeInitOptions ): T_BeforeInitOptions{
      // @ts-expect-error
      args.userOptions.remotes.forEach( ( remote: T_Remote, ): void => ( remote.entry.includes( `#auto#` ) && ( remote.entry = new URL( remote.entry.split( '#auto#' ).at( -1 ), location.href ).href ) ) );

      return args;
    },

    /**
     * 在远程容器初始化期间调用。<br />
     * 注意：该函数只会在插件构建模式下被调用！<br />
     * PS: SyncHook
     *
     * @param {T_InitOptions} args
     */
    /*
     init( args: T_InitOptions ): void{
     console.log( `\n\n\ninit----------------Start` );
     console.dir( args );
     console.log( `init----------------End\n\n\n` );
     },
     */

    /**
     * 在解析远程容器之前调用，用于在查找之前注入容器或更新某些内容。<br />
     * PS: AsyncWaterfallHook
     *
     * @param {T_BeforeRequestOptions} args
     *
     * @returns {Promise<T_BeforeRequestOptions>}
     */
    /*
     async beforeRequest( args: T_BeforeRequestOptions ): Promise<T_BeforeRequestOptions>{
     console.log( `\n\n\nbeforeRequest------${ args.id }----------Start` );
     console.dir( args );
     console.log( `beforeRequest--------${ args.id }--------End\n\n\n` );

     return args;
     },
     */

    /**
     * 在解析容器后调用，允许重定向或修改已解析的信息。<br />
     * PS: AsyncWaterfallHook
     *
     * @param {T_AfterResolveOptions} args
     *
     * @returns {Promise<T_AfterResolveOptions>}
     */
    /*
     async afterResolve( args: T_AfterResolveOptions ): Promise<T_AfterResolveOptions>{
     console.log( `\n\n\nafterResolve--------${ args.id }--------Start` );
     console.dir( args );
     console.log( `afterResolve--------${ args.id }--------End\n\n\n` );

     return args;
     },
     */

    /**
     * 联合模块完全加载时触发，允许访问和修改已加载文件的导出内容。<br />
     * PS: AsyncHook
     *
     * @param {T_OnLoadOptions} args
     *
     * @returns {Promise<void>}
     */
    /*
     async onLoad( args: T_OnLoadOptions ): Promise<void>{
     console.log( `\n\n\nonLoad-------${ args.id }---------Start` );
     console.dir( args );
     console.log( `onLoad-------${ args.id }---------End\n\n\n` );
     },
     */

    /**
     * 创建加载远端模块的“script标签”。<br />
     * PS: SyncHook
     *
     * @param {T_CreateScriptOptions} params
     *
     * @param {string} params.url
     *
     * @param {Record<string, any> | undefined} params.attrs
     *
     * @returns {HTMLScriptElement | {script?: HTMLScriptElement, timeout?: number} | void}
     */
    /*
     createScript( {
     url,
     attrs,
     }: T_CreateScriptOptions ): HTMLScriptElement | {
     script?: HTMLScriptElement,
     timeout?: number
     } | void{
     console.log( `\n\n\ncreateScript-----------${ url }-----------Start` );
     console.dir( attrs );
     console.log( `createScript-----------${ url }-----------End\n\n\n` );

     // const script = document.createElement( 'script' );

     // script.src = `${ new URL( '../mf_v2/upload_for_multiple/', location.href ).href }${ url }`;

     // can modify the attrs object
     // attrs[ 'loader-hooks' ] = 'isTrue';
     // or add them to the script
     // script.setAttribute( 'crossorigin', 'anonymous' );

     // return script;
     },
     */

    /**
     * fetch函数允许自定义获取清单JSON的请求。成功的Response必须生成有效的JSON。<br />
     * PS: AsyncHook
     *
     * @param {string} manifestUrl
     *
     * @param {RequestInit} requestInit
     *
     * @returns {Promise<Response> | void | false}
     */
    /*
     fetch( manifestUrl: string, requestInit: RequestInit ): Promise<Response> | void | false{
     // 获取清单JSON时包含“凭证”的示例。
     // return fetch( manifestUrl, {
     //   ...requestInit,
     //   credentials: 'include',
     // } );
     },
     */

    /**
     * 通过loadEntry函数，可以完全自定义远程类型，从而扩展和创建新的远程类型。<br />
     * 例子见：<br />
     * https://module-federation.io/plugin/dev/index.html#loadentry
     * PS: asyncHook
     *
     * @param {T_LoadEntryOptions} args
     *
     * @returns {T_RemoteEntryExports | void}
     */
    // loadEntry( args: T_LoadEntryOptions ): T_RemoteEntryExports | void{}

  };
}

export {
  ModuleFederation_v2_CustomRuntimePlugin,
};

export default ModuleFederation_v2_CustomRuntimePlugin;
