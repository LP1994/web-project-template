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
  createApp,
} from 'vue';

import UploadComponentForVue3 from './Upload.Vue3.ts.vue';

/**
 * 创建了一个Vue 3的应用实例。
 *
 * @type {T_VueApp<Element>}
 */
const UploadAPP: T_VueApp<Element> = createApp( UploadComponentForVue3 );

UploadAPP.config.errorHandler = ( error: unknown, instance: T_VueComponentPublicInstance | null, info: string ): void => {
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
 * @type {T_VueComponentPublicInstance}
 */
const RootComponentInstance: T_VueComponentPublicInstance = UploadAPP.mount( '#UploadAPP' );

console.log( `\n\n\nVue3版本的“根组件”实例：` );
console.dir( RootComponentInstance );
console.log( `\n\n\n` );
