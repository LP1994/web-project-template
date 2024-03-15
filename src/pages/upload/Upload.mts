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
  type ComponentPublicInstance as T_ComponentPublicInstance,
  type App as T_App,

  createApp,
} from 'vue';

import UploadComponentForVue3 from './Upload.Vue3.ts.vue';

/**
 * @type {T_App<Element>} 创建了一个Vue 3的应用实例。
 */
const UploadAPP: T_App<Element> = createApp( UploadComponentForVue3 );

UploadAPP.config.errorHandler = ( error: unknown, instance: T_ComponentPublicInstance | null, info: string ): void => {
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
 * @type {T_ComponentPublicInstance} 一个Vue 3的根组件实例。
 */
const RootComponent: T_ComponentPublicInstance = UploadAPP.mount( '#UploadAPP' );

console.log( `\n\n\n一个Vue 3的根组件实例：` );
console.dir( RootComponent );
console.log( `\n\n\n` );
