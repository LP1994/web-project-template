/**
 * Project: upload-for-multiple
 * FileDirPath: src/ModuleFederation_v2_RuntimeAPI.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * Module Federation V2
 * 详细见：https://module-federation.io/guide/start/index.html
 * 运行时API的使用见：https://module-federation.io/guide/basic/runtime.html#federation-runtime
 */

/**
 * 运行时的各个API的类型见：node_modules/@module-federation/runtime/dist/src/index.d.ts
 *
 * @type {import('node_modules/@module-federation/runtime/dist/src/index.d.ts')}
 */

/**
 * 例子：init
 * PS：当在运行时用“init”注册的或插件配置的远端模块提供者，可以同时使用“loadRemote”、“import()”来加载它们。
 * <code>
 * init( {
 *   // 在运行时配置的“init”中的“name”可以跟插件配置里的“name”是可以一样的！
 *   name: 'MF_v2_Main',
 *   remotes: [
 *     {
 *       name: 'Remote_UploadForSingle',
 *       entry: `${
 *         isProduction
 *         ? new URL( '../mf_v2/upload_for_single/', location.href ).href
 *         : env.RemoteUploadForSingleURL
 *       }RemoteEntry_UploadForSingle.js`,
 *       alias: 'RemoteUploadForSingle',
 *     },
 *   ],
 * } );
 * </code>
 */

/**
 * 例子：registerRemotes
 * PS：用“registerRemotes”注册的远端模块提供者，只能用“loadRemote”加载它们，否者会报错！
 * <code>
 * registerRemotes(
 *   [
 *     {
 *       name: 'Remote_UploadForMultiple',
 *       entry: `${ isProduction
 *                  ? new URL( '../mf_v2/upload_for_multiple/', location.href ).href
 *                  : env.RemoteUploadForMultipleURL }RemoteEntry_UploadForMultiple.js`,
 *       alias: 'RemoteUploadForMultiple',
 *     },
 *   ],
 *   // {
 *   // true，表示此处的配置会强制覆盖掉在此之前的“name”相同的其他配置。
 *   // force: true,
 *   // }
 * );
 * </code>
 */

'use strict';

import {
  // @ts-ignore
  type UserOptions as T_MF_v2_RuntimeAPI_UserOptions,

  FederationHost as MF_v2_RuntimeAPI_FederationHost,

  /**
   * 用于初始化后注册远程模块。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#registerremotes
   * 1、注意！该API跟“init”的区别！该API也是可以多次调用的！而“init”是创建运行时实例，也可重复调用，但只能存在1个实例。如果要动态注册远端模块，请使用：registerRemotes。<br />
   * 2、当配置“force: true”时请务必谨慎！它将合并远程（包括已加载的远程），删除已加载的远程缓存，并使用console.warn警告此操作可能有风险。通俗点说：就是后设置的会覆盖前面设置的。<br />
   * 3、用“registerRemotes”注册的远端模块提供者，只能用“loadRemote”加载它们，否者会报错！<br />
   * 4、实际测试发现！不知为何！当使用“registerRemotes”并设置了“force: true”的远端模块提供者，来覆盖由插件或运行时“init”设置的远端模块提供者时，会出现，虽然加载了远端模块提供者的样式，其也正常的被加载了，但是，却不生效其样式，因为，对应的DOM上竟然没有对应的CSS作用域标识！<br />
   */
    registerRemotes as MF_v2_RuntimeAPI_RegisterRemotes,
  /**
   * 用于加载初始化的远程模块。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#loadremote
   * 1、该函数的类型为：T_MF_v2_RuntimeAPI_LoadRemote。<br />
   * 2、与构建插件一起使用时，可通过本地import("remote_name/expose")语法直接加载，构建插件会自动将其转换为loadRemote("remote_name/expose")用法。<br />
   * 3、当使用的是插件配置的远端模块提供者或是用运行时的“init”注册的远端模块提供者时，可以同时使用“loadRemote”、“import()”来加载它们。<br />
   */
    loadRemote as MF_v2_RuntimeAPI_LoadRemote,

  /**
   * 创建运行时实例，可重复调用，但只能存在一个实例。如果要动态注册远端模块或插件，请使用：registerRemotes、registerPlugins。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#init
   * 1、该函数的函数参数类型为：T_MF_v2_RuntimeAPI_UserOptions。该函数调用后返回值的类型为：T_MF_v2_RuntimeAPI_FederationHost。<br />
   * 2、注意！无论是“插件模式”还是“运行时”，都必须保证在整个项目中至少执行1次“初始化”！<br />
   * 3、如果已经是在webpack、Vite等等之类的构建工具中配置了其插件模式，而后还想在项目中动态注册远端模块，还是用“registerRemotes”更为合适的！<br />
   * 4、当在运行时用“init”注册的或插件配置的远端模块提供者，可以同时使用“loadRemote”、“import()”来加载它们。<br />
   * 5、在运行时配置的“init”中的“name”可以跟插件配置里的“name”是可以一样的！<br />
   */
    init as MF_v2_RuntimeAPI_Init,

  /**
   * 获取共享依赖关系。如果全局环境中存在与当前消费者匹配的"共享"依赖关系，则会首先重用现有的符合条件的依赖关系。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#loadshare
   * 1、用户通常不会直接调用此API，但构建插件会使用它来转换自己的依赖关系。<br />
   * 2、如果已设置多个共享版本，loadShare将返回已加载且已共享的最大版本。该行为可通过设置extraOptions.resolver来控制。<br />
   */
    loadShare as MF_v2_RuntimeAPI_LoadShare,
  /**
   * 只有当条目是“manifest file”协议时，preloadRemote接口才有效。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#preloadremote
   * 1、用于使用preloadRemote API预加载模块的远程资源，例如：remote-entry.js和其他js块、css文件等等。<br />
   */
    preloadRemote as MF_v2_RuntimeAPI_PreloadRemote,
  /**
   * 用于初始化后注册插件。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#registerplugins
   */
    registerPlugins as MF_v2_RuntimeAPI_RegisterPlugins,
} from '@module-federation/enhanced/runtime';

import {
  type DefineComponent as T_DefineComponent,
} from 'vue';

import {
  type AsyncComponentLoader as T_AsyncComponentLoader,
} from '@vue/runtime-core';

type T_LoadRemoteVueComponent = Awaited<ReturnType<T_AsyncComponentLoader<T_DefineComponent<{}, {}, any>>>>;

type T_MF_v2_RuntimeAPI_FederationHost = typeof MF_v2_RuntimeAPI_FederationHost;

type T_MF_v2_RuntimeAPI_LoadRemote<T> = typeof MF_v2_RuntimeAPI_LoadRemote<T>;

export {
  type T_LoadRemoteVueComponent,
  type T_MF_v2_RuntimeAPI_UserOptions,
  type T_MF_v2_RuntimeAPI_FederationHost,
  type T_MF_v2_RuntimeAPI_LoadRemote,

  /**
   * 用于初始化后注册远程模块。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#registerremotes
   * 1、注意！该API跟“init”的区别！该API也是可以多次调用的！而“init”是创建运行时实例，也可重复调用，但只能存在1个实例。如果要动态注册远端模块，请使用：registerRemotes。<br />
   * 2、当配置“force: true”时请务必谨慎！它将合并远程（包括已加载的远程），删除已加载的远程缓存，并使用console.warn警告此操作可能有风险。通俗点说：就是后设置的会覆盖前面设置的。<br />
   * 3、用“registerRemotes”注册的远端模块提供者，只能用“loadRemote”加载它们，否者会报错！<br />
   * 4、实际测试发现！不知为何！当使用“registerRemotes”并设置了“force: true”的远端模块提供者，来覆盖由插件或运行时“init”设置的远端模块提供者时，会出现，虽然加载了远端模块提供者的样式，其也正常的被加载了，但是，却不生效其样式，因为，对应的DOM上竟然没有对应的CSS作用域标识！<br />
   */
    MF_v2_RuntimeAPI_RegisterRemotes,
  /**
   * 用于加载初始化的远程模块。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#loadremote
   * 1、该函数的类型为：T_MF_v2_RuntimeAPI_LoadRemote。<br />
   * 2、与构建插件一起使用时，可通过本地import("remote_name/expose")语法直接加载，构建插件会自动将其转换为loadRemote("remote_name/expose")用法。<br />
   * 3、当使用的是插件配置的远端模块提供者或是用运行时的“init”注册的远端模块提供者时，可以同时使用“loadRemote”、“import()”来加载它们。<br />
   */
    MF_v2_RuntimeAPI_LoadRemote,

  /**
   * 创建运行时实例，可重复调用，但只能存在一个实例。如果要动态注册远端模块或插件，请使用：registerRemotes、registerPlugins。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#init
   * 1、该函数的函数参数类型为：T_MF_v2_RuntimeAPI_UserOptions。该函数调用后返回值的类型为：T_MF_v2_RuntimeAPI_FederationHost。<br />
   * 2、注意！无论是“插件模式”还是“运行时”，都必须保证在整个项目中至少执行1次“初始化”！<br />
   * 3、如果已经是在webpack、Vite等等之类的构建工具中配置了其插件模式，而后还想在项目中动态注册远端模块，还是用“registerRemotes”更为合适的！<br />
   * 4、当在运行时用“init”注册的或插件配置的远端模块提供者，可以同时使用“loadRemote”、“import()”来加载它们。<br />
   * 5、在运行时配置的“init”中的“name”可以跟插件配置里的“name”是可以一样的！<br />
   */
    MF_v2_RuntimeAPI_Init,

  /**
   * 获取共享依赖关系。如果全局环境中存在与当前消费者匹配的"共享"依赖关系，则会首先重用现有的符合条件的依赖关系。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#loadshare
   * 1、用户通常不会直接调用此API，但构建插件会使用它来转换自己的依赖关系。<br />
   * 2、如果已设置多个共享版本，loadShare将返回已加载且已共享的最大版本。该行为可通过设置extraOptions.resolver来控制。<br />
   */
    MF_v2_RuntimeAPI_LoadShare,
  /**
   * 只有当条目是“manifest file”协议时，preloadRemote接口才有效。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#preloadremote
   * 1、用于使用preloadRemote API预加载模块的远程资源，例如：remote-entry.js和其他js块、css文件等等。<br />
   */
    MF_v2_RuntimeAPI_PreloadRemote,
  /**
   * 用于初始化后注册插件。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#registerplugins
   */
    MF_v2_RuntimeAPI_RegisterPlugins,
};

export default {
  /**
   * 用于初始化后注册远程模块。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#registerremotes
   * 1、注意！该API跟“init”的区别！该API也是可以多次调用的！而“init”是创建运行时实例，也可重复调用，但只能存在1个实例。如果要动态注册远端模块，请使用：registerRemotes。<br />
   * 2、当配置“force: true”时请务必谨慎！它将合并远程（包括已加载的远程），删除已加载的远程缓存，并使用console.warn警告此操作可能有风险。通俗点说：就是后设置的会覆盖前面设置的。<br />
   * 3、用“registerRemotes”注册的远端模块提供者，只能用“loadRemote”加载它们，否者会报错！<br />
   * 4、实际测试发现！不知为何！当使用“registerRemotes”并设置了“force: true”的远端模块提供者，来覆盖由插件或运行时“init”设置的远端模块提供者时，会出现，虽然加载了远端模块提供者的样式，其也正常的被加载了，但是，却不生效其样式，因为，对应的DOM上竟然没有对应的CSS作用域标识！<br />
   */
  MF_v2_RuntimeAPI_RegisterRemotes,
  /**
   * 用于加载初始化的远程模块。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#loadremote
   * 1、该函数的类型为：T_MF_v2_RuntimeAPI_LoadRemote。<br />
   * 2、与构建插件一起使用时，可通过本地import("remote_name/expose")语法直接加载，构建插件会自动将其转换为loadRemote("remote_name/expose")用法。<br />
   * 3、当使用的是插件配置的远端模块提供者或是用运行时的“init”注册的远端模块提供者时，可以同时使用“loadRemote”、“import()”来加载它们。<br />
   */
  MF_v2_RuntimeAPI_LoadRemote,

  /**
   * 创建运行时实例，可重复调用，但只能存在一个实例。如果要动态注册远端模块或插件，请使用：registerRemotes、registerPlugins。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#init
   * 1、该函数的函数参数类型为：T_MF_v2_RuntimeAPI_UserOptions。该函数调用后返回值的类型为：T_MF_v2_RuntimeAPI_FederationHost。<br />
   * 2、注意！无论是“插件模式”还是“运行时”，都必须保证在整个项目中至少执行1次“初始化”！<br />
   * 3、如果已经是在webpack、Vite等等之类的构建工具中配置了其插件模式，而后还想在项目中动态注册远端模块，还是用“registerRemotes”更为合适的！<br />
   * 4、当在运行时用“init”注册的或插件配置的远端模块提供者，可以同时使用“loadRemote”、“import()”来加载它们。<br />
   * 5、在运行时配置的“init”中的“name”可以跟插件配置里的“name”是可以一样的！<br />
   */
  MF_v2_RuntimeAPI_Init,

  /**
   * 获取共享依赖关系。如果全局环境中存在与当前消费者匹配的"共享"依赖关系，则会首先重用现有的符合条件的依赖关系。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#loadshare
   * 1、用户通常不会直接调用此API，但构建插件会使用它来转换自己的依赖关系。<br />
   * 2、如果已设置多个共享版本，loadShare将返回已加载且已共享的最大版本。该行为可通过设置extraOptions.resolver来控制。<br />
   */
  MF_v2_RuntimeAPI_LoadShare,
  /**
   * 只有当条目是“manifest file”协议时，preloadRemote接口才有效。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#preloadremote
   * 1、用于使用preloadRemote API预加载模块的远程资源，例如：remote-entry.js和其他js块、css文件等等。<br />
   */
  MF_v2_RuntimeAPI_PreloadRemote,
  /**
   * 用于初始化后注册插件。<br />
   * 详细见：https://module-federation.io/guide/basic/runtime.html#registerplugins
   */
  MF_v2_RuntimeAPI_RegisterPlugins,
};
