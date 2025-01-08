<!--
Project: web-project-template
FileDirPath: src/pages/upload/components/Rules.Vue3.ts.vue
Author: 12278
Email: 1227839175@qq.com
IDE: WebStorm
CreateDate: 2024-12-27 22:30:00 星期五
-->
<style src = 'cssDir/FlexBox.css' />
<style
  scoped
  lang = 'scss'>
.rules-box {
  box-sizing: border-box;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 300px;

  width: auto;
  height: 100%;

  padding: 20px 0;

  > .add-rule {
    width: 100%;
    height: 40px;
  }

  > .rule-item-box {
    &:hover {
      border: 5px solid blue;
    }

    box-sizing: border-box;

    position: relative;

    width: 100%;
    height: 150px;

    background-color: white;

    border: 1px solid darkgrey;

    margin-bottom: 20px;

    > .rule-item-index {
      width: 100%;
      height: 30%;
    }

    > .rule-item-name {
      width: 100%;
      height: 30%;

      > label {
        width: auto;
        height: 100%;
      }

      > input {
        width: auto;
        height: 100%;
      }
    }

    > .rule-item-content {
      width: 100%;
      height: 40%;

      > label {
        width: auto;
        height: 100%;
      }

      > textarea {
        width: auto;
        height: 100%;
      }
    }
  }
}
</style>
<template>
  <article class = 'css-reset rules-box overflow-hidden-auto'>
    <button class = 'css-reset add-rule flex-box flex-center'
            @click = 'AddRule( $event, 0 )'>再次插入规则
    </button>
    <template
      v-for = '( { ruleID, ruleName, ruleContent, }, index, ) of rulesData'
      :key = '"rule-item-" + ruleID'>
      <section class = 'css-reset rule-item-box'
               :class = '{ "high-brightness": myIndex === ruleID, }'
               @click.prevent = 'BookmarkItemClick( $event, {
                 ruleID,
                 index,
               } )'>
        <label class = 'css-reset rule-item-index flex-box flex-start-center'>规则{{ index + 1 }}（序号）</label>
        <div class = 'css-reset rule-item-name flex-box flex-start-center'>
          <label class = 'css-reset flex-box flex-start-center'
                 :for = '"rule-item-name-" + String( ruleID )'>规则名：</label>
          <input class = 'css-reset'
                 type = 'text'
                 :id = '"rule-item-name-" + String( ruleID )'
                 :data-rule-id = 'String( ruleID )'
                 :value = 'ruleName'
                 placeholder = '请输入规则名'
                 @input = 'RuleNameChange( $event, {
                   ruleID: ruleID,
                   } )' />
        </div>
        <div class = 'css-reset rule-item-content flex-box flex-start-center'>
          <label class = 'css-reset flex-box flex-start-center'
                 :for = '"rule-item-content-" + String( ruleID )'>配置项：</label>
          <textarea class = 'css-reset'
                    placeholder = '请输入配置项'
                    :id = '"rule-item-content-" + String( ruleID )'>{{ ruleContent }}</textarea>
        </div>
      </section>
      <button class = 'css-reset add-rule flex-box flex-center'
              @click = 'AddRule( $event, index + 1 )'>再次插入规则
      </button>
    </template>
  </article>
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

type T_Rule = {
  ruleID: number;
  ruleName: string;
  ruleContent: string;
};

type T_Data = Array<T_Rule>;

const rulesData: T_VueModelRef<T_Data, string, T_Data, T_Data> = defineModel<T_Data>( 'rulesData', {
  required: true,
} );

// @ts-expect-error
let myIndex: T_VueModelRef<number, string, number, number> = defineModel<number>( 'myIndex', {
  required: true,
  default: 0,
  // @ts-expect-error
  validator( value: number, props: T_VuePropType<{
    rulesData: T_Data;
    myIndex: number;
  }> ): boolean{
    return value >= 0;
  },
} );

function RuleNameChange( event: Event, {
  ruleID,
}: Pick<T_Rule, 'ruleID'> ): void{
  // @ts-expect-error
  rulesData.value.find( ( item: T_Rule, ): boolean => {
    if( item.ruleID === ruleID ){
      // @ts-expect-error
      item.ruleName = event!.target!.value as string;

      return true;
    }
  } );
}

// @ts-expect-error
function AddRule( event: Event, index: number ): void{
  rulesData.value.splice( index, 0, {
    ruleID: rulesData.value.length + 2024000 + 1,
    ruleName: '',
    ruleContent: '',
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
  const offsetHeight: number = document!.querySelector( '.bookmark-item-box' )!.offsetHeight as number;

  document!.querySelector( '.bookmark-list-box' )!.scrollTo( {
    left: 0,
    top: ( offsetHeight * index ) + ( 20 * index ),
    behavior: 'smooth',
  } );
}

onMounted( (): void => {
  console.log( `\n\n
Vue3版本的“规则组件”的DOM已挂载。
\n\n` );
} );
</script>
