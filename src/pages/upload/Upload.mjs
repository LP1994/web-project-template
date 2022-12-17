/**
 * Project: web-project-template
 * FileDirPath: src/pages/upload/Upload.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import UploadComponentForVue3 from './Upload.Vue3.vue';

const {
  createApp,
} = Vue;

const UploadAPP = createApp( UploadComponentForVue3 );

UploadAPP.mount( '#UploadAPP' );
