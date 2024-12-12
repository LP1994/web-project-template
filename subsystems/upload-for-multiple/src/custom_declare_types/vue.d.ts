/**
 * Project: upload-for-multiple
 * FileDirPath: src/custom_declare_types/vue.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

declare module '*.vue' {
  import {
    type DefineComponent,
  } from 'vue';

  const component: DefineComponent<{}, {}, any>;

  export default component;
}

declare module 'Remote_Vue_*' {
  import {
    type DefineComponent,
  } from 'vue';

  const component: DefineComponent<{}, {}, any>;

  export default component;
}
