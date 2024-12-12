/**
 * Project: upload-for-multiple
 * FileDirPath: src/pages/index/Index.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

'use strict';

import {
  type ComponentPublicInstance as T_ComponentPublicInstance,
  type App as T_App,

  createApp,
} from 'vue';

import IndexComponentForVue3 from './Index.Vue3.ts.vue';

/**
 * 创建了一个Vue 3的应用实例。
 *
 * @type {T_App<Element>}
 */
const IndexAPP: T_App<Element> = createApp( IndexComponentForVue3 );

IndexAPP.config.errorHandler = ( error: unknown, instance: T_ComponentPublicInstance | null, info: string ): void => {
  console.log( `\n\n\n` );
  console.error( `error:` );
  console.error( error );
  console.log( `\n` );
  console.log( `instance:` );
  console.dir( instance );
  console.log( `\n` );
  console.log( `info:` );
  console.log( info );
  console.log( `\n\n\n` );
};

/**
 * 一个Vue 3的根组件实例。
 *
 * @type {T_ComponentPublicInstance}
 */
const RootComponentInstance: T_ComponentPublicInstance = IndexAPP.mount( '#UploadAPP' );

console.log( `\n\n\n远端模块提供者：Vue3版本的“根组件”实例：` );
console.dir( RootComponentInstance );
console.log( `\n\n\n` );
