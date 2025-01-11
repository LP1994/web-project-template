/**
 * Project: web-project-template
 * FileDirPath: src/ModuleFederation_v2_RegisterRemotes.se.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-01-01 00:00:00 星期六
 */

/**
 * 该文件的公用：可以在运行时注册项目需要的“远端模块提供者”及其提供的远端模块，以便在后续业务代码中“加载”使用这些在运行时注册的“远端模块提供者”提供的各个模块。
 * 1、当然，也可以在后续业务代码中根据具体的需要、逻辑注册需要的“远端模块提供者”及其提供的远端模块。
 * 2、该文件可以算是一个尽量将简单注册操作“归一化”在一个文件里，方便统一管理。
 */

/**
 * 该文件的使用例子：
 * 1、在该文件中编写在运行时注册项目需要的“远端模块提供者”及其提供的远端模块。
 * <code>
 * import {
 *   MF_v2_RuntimeAPI_RegisterRemotes,
 * } from 'MF_v2_RuntimeAPI';
 *
 * MF_v2_RuntimeAPI_RegisterRemotes(
 *   [
 *     {
 *       name: 'Remote_UploadForSingle',
 *       entry: `${
 *         isProduction
 *         ? new URL( '../mf_v2/upload_for_single/', location.href ).href
 *         : env.RemoteUploadForSingleURL
 *       }RemoteEntry_UploadForSingle.js`,
 *       alias: 'Remote_Vue_UploadForSingle',
 *     },
 *   ],
 * );
 * 2、在后续业务代码中“加载”使用这些在运行时注册的“远端模块提供者”提供的各个模块：src/pages/upload/Upload.mts
 * import 'MF_v2_RegisterRemotes';
 *
 * import {
 *   type T_LoadRemoteVueComponent,
 *
 *   MF_v2_RuntimeAPI_LoadRemote,
 * } from 'MF_v2_RuntimeAPI';
 *
 * const RemoteUploadForSingleComponent = defineAsyncComponent( (): Promise<T_LoadRemoteVueComponent> => MF_v2_RuntimeAPI_LoadRemote<T_LoadRemoteVueComponent>( 'Remote_Vue_UploadForSingle/UploadForSingle' ) as Promise<T_LoadRemoteVueComponent> );
 * </code>
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
  ModuleFederation_v2_CustomRuntimePlugin,
} from './ModuleFederation_v2_CustomRuntimePlugin.esm.mts';

MF_v2_RuntimeAPI_RegisterPlugins( [
  ModuleFederation_v2_CustomRuntimePlugin(),
] );

MF_v2_RuntimeAPI_RegisterRemotes(
  [
    {
      name: 'Remote_UploadForSingle',
      entry: `${
        isProduction
        ? new URL( '../mf_v2/upload_for_single/', location.href ).href
        : env.RemoteUploadForSingleURL
      }RemoteEntry_UploadForSingle.js`,
      alias: 'Remote_Vue_UploadForSingle',
    },
  ],
);
