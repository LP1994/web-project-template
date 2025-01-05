<!--
Project: web-project-template
FileDirPath: src/pages/upload/components/Bookmarks.Vue3.ts.vue
Author: 12278
Email: 1227839175@qq.com
IDE: WebStorm
CreateDate: 2024-12-27 22:30:00 星期五
-->
<style src = 'cssDir/FlexBox.css' />
<style
  scoped
  lang = 'scss'>
.bookmark-list-box {
  box-sizing: border-box;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;

  width: 300px;
  height: 100%;

  padding: 20px 0;

  > .bookmark-item-box {
    &:hover {
      border: 5px solid blue;
    }

    box-sizing: border-box;

    position: relative;

    width: 100%;
    height: 50px;

    background-color: white;

    border: 1px solid darkgrey;

    margin-bottom: 20px;

    > .bookmark-item-index {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      width: 50px;
      height: 100%;
    }

    > .bookmark-item-content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 50px;

      width: auto;
      height: 100%;
    }
  }
}
</style>
<template>
  <aside class = 'css-reset bookmark-list-box overflow-hidden-auto'>
    <section class = 'css-reset bookmark-item-box'
             v-for = '( { ruleID, ruleName, }, index, ) of rulesData'
             :key = '"bookmark-item-" + ruleID'
             :data-rule-id = 'String( ruleID )'
             :class = '{ "high-brightness": myIndex === ruleID, }'
             @click.prevent = 'BookmarkItemClick( $event, {
                 ruleID,
                 index,
               } )'>
      <label class = 'css-reset bookmark-item-index flex-box flex-center'
             :data-rule-id = 'String( ruleID )'
             :for = 'String( ruleID )'>{{ index + 1 }}</label>
      <input class = 'css-reset bookmark-item-content'
             type = 'text'
             :id = 'String( ruleID )'
             :data-rule-id = 'String( ruleID )'
             :value = 'ruleName'
             placeholder = '请输入规则名'
             @input = 'RuleNameChange( $event, {
               ruleID: ruleID,
               } )' />
    </section>
  </aside>
</template>
<script
  setup
  type = 'module'
  lang = 'ts'>
'use strict';

import {
  /*
   1、“Vue 3.2”及以上版本中，“Vue 3”中的一些常见编译器宏（包括：defineProps、defineEmits、defineModel等等）不需要手动导入。
   2、还有：withDefaults，用于给defineProps中的某些属性提供默认值，通常用来为某些props设置默认值。
   */
  // defineModel,

  onMounted,
} from 'vue';

type T_rule = {
  ruleID: number;
  ruleName: string;
  ruleContent: string;
};

type T_data = Array<T_rule>;

const rulesData: T_VueModelRef<T_data, string, T_data, T_data> = defineModel<T_data>( 'rulesData', {
  required: true,
} );

// @ts-expect-error
let myIndex: T_VueModelRef<number, string, number, number> = defineModel<number>( 'myIndex', {
  required: true,
  default: 0,
  // @ts-expect-error
  validator( value: number, props: T_VuePropType<{
    rulesData: T_data;
    myIndex: number;
  }> ): boolean{
    return value >= 0;
  },
} );

function RuleNameChange( event: Event, {
  ruleID,
}: Pick<T_rule, 'ruleID'> ): void{
  // @ts-expect-error
  rulesData.value.find( ( item: T_rule, ): boolean => {
    if( item.ruleID === ruleID ){
      // @ts-expect-error
      item.ruleName = event!.target!.value as string;

      return true;
    }
  } );
}

// @ts-expect-error
function BookmarkItemClick( event: Event, {
  ruleID,
  index,
}: {
  ruleID: number;
  index: number;
} ): void{
  myIndex.value = ruleID;

  // @ts-expect-error
  const offsetHeight: number = document!.querySelector( '.rule-item-box' )!.offsetHeight as number;

  document!.querySelector( '.rules-box' )!.scrollTop = ( offsetHeight * index ) + ( 20 * index ) + ( 40 * index );
}

onMounted( (): void => {
  console.log( `\n\n
Vue3版本的“书签组件”的DOM已挂载。
\n\n` );
} );
</script>
