<!--
Project: web-project-template
FileDirPath: src/pages/upload/Upload.Vue3.ts.vue
Author: 12278
Email: 1227839175@qq.com
IDE: WebStorm
CreateDate: 2024-12-27 22:30:00 星期五
-->
<style src = 'cssDir/FlexBox.css' />
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
    <RemoteBookmarksComponent v-model:rulesData = 'rulesData'
                              v-model:myIndex = 'myIndex' />
    <RemoteRulesComponent v-model:rulesData = 'rulesData'
                          v-model:myIndex = 'myIndex' />
  </main>
</template>
<script
  setup
  type = 'module'
  lang = 'ts'>
'use strict';

import {
  ref,
  reactive,

  onMounted,
  defineAsyncComponent,
} from 'vue';

const RemoteBookmarksComponent: T_VueComponent = defineAsyncComponent<T_VueComponent>( (): Promise<T_LoadRemoteVueComponent> => MF_v2_RuntimeAPI_LoadRemote<T_LoadRemoteVueComponent>( 'RemoteUploadForMultiple/Bookmarks' ) as Promise<T_LoadRemoteVueComponent> );

const RemoteRulesComponent: T_VueComponent = defineAsyncComponent<T_VueComponent>( (): Promise<T_LoadRemoteVueComponent> => MF_v2_RuntimeAPI_LoadRemote<T_LoadRemoteVueComponent>( 'Remote_Vue_UploadForSingle/Rules' ) as Promise<T_LoadRemoteVueComponent> );

type T_Rule = {
  ruleID: number;
  ruleName: string;
  ruleContent: string;
};

type T_Data = Array<T_Rule>;

let myIndex: T_VueRef<number, number> = ref<number>( 0 );

const rulesData: T_VueReactive<T_Data> = reactive<T_Data>( [
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
