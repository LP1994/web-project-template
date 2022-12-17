/**
 * Project: web-project-template
 * FileDirPath: src/pages/upload/Upload.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  type ComponentPublicInstance,
  App,

  createApp,
} from 'vue';

import UploadComponentForVue3 from './Upload.Vue3.ts.vue';

/**
 * 创建了一个Vue 3的应用实例。
 *
 * @type {App<Element>} 一个Vue 3的应用实例。
 */
const UploadAPP: App<Element> = createApp( UploadComponentForVue3 );

UploadAPP.config.errorHandler = ( error: unknown, instance: ComponentPublicInstance | null, info: string ): void => {
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
 * @type {ComponentPublicInstance} 一个Vue 3的根组件实例。
 */
const RootComponent: ComponentPublicInstance = UploadAPP.mount( '#UploadAPP' );

console.log( `\n\n\n一个Vue 3的根组件实例：` );
console.dir( RootComponent );
console.log( `\n\n\n` );
