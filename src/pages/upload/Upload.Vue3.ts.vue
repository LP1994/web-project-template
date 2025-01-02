<!--
Project: web-project-template
FileDirPath: src/pages/upload/Upload.Vue3.ts.vue
Author: 12278
Email: 1227839175@qq.com
IDE: WebStorm
CreateDate: 2024-12-27 22:30:00 星期五
-->
<style
  lang = 'scss'>
.high-brightness {
  border: 5px solid green !important;
}
</style>
<template>
  <!--*********弹窗、悬浮一类节点的书写区域 Start*********-->
  <!--
  说明：
  1、这些弹窗、悬浮一类节点的最外层节点的定位建议使用“position: absolute”。
  2、这样就算这些节点中有可滚动的内容，也不会出现滚动穿透BUG！
  -->
  <!--<dialog style = 'position: absolute;'>例子：可以滚动的内容。</dialog>-->
  <!--*********弹窗、悬浮一类节点的书写区域 End*********-->
  <!--在main这个节点里写主体HTML。-->
  <main class = 'css-reset full-screen overflow-hidden-auto'>
    <Bookmarks v-model:rulesData = 'rulesData'
               v-model:myIndex = 'myIndex' />
    <Rules v-model:rulesData = 'rulesData'
           v-model:myIndex = 'myIndex' />
  </main>
</template>
<script
  setup
  type = 'module'
  lang = 'ts'>
'use strict';

import {
  type Ref as T_Ref,
  type Reactive as T_Reactive,

  ref,
  reactive,

  onMounted,
} from 'vue';

import Bookmarks from './components/Bookmarks.Vue3.ts.vue';
import Rules from './components/Rules.Vue3.ts.vue';

type T_rule = {
  ruleID: number;
  ruleName: string;
  ruleContent: string;
};

type T_data = Array<T_rule>;

let myIndex: T_Ref<number, number> = ref<number>( 0 );

const rulesData: T_Reactive<T_data> = reactive<T_data>( [
  {
    ruleID: 2024001,
    ruleName: '规则1',
    ruleContent: 'value1',
  },
  {
    ruleID: 2024002,
    ruleName: '规则2',
    ruleContent: 'value2',
  },
  {
    ruleID: 2024003,
    ruleName: '规则3',
    ruleContent: 'value3',
  },
  {
    ruleID: 2024004,
    ruleName: '规则4',
    ruleContent: 'value4',
  },
  {
    ruleID: 2024005,
    ruleName: '规则5',
    ruleContent: 'value5',
  },
  {
    ruleID: 2024006,
    ruleName: '规则6',
    ruleContent: 'value6',
  },
  {
    ruleID: 2024007,
    ruleName: '规则7',
    ruleContent: 'value7',
  },
  {
    ruleID: 2024008,
    ruleName: '规则8',
    ruleContent: 'value8',
  },
  {
    ruleID: 2024009,
    ruleName: '规则9',
    ruleContent: 'value9',
  },
  {
    ruleID: 2024010,
    ruleName: '规则10',
    ruleContent: 'value10',
  },
] );

onMounted( (): void => {
  console.log( `\n\n
Vue3版本的“文件上传组件”的DOM已挂载。
\n\n` );
} );
</script>
