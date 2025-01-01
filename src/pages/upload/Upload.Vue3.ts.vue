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
<style
  scoped
  lang = 'scss'>
main {
  > .bookmark-list-box {
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

  > .rules-box {
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
    <aside class = 'css-reset bookmark-list-box overflow-hidden-auto'>
      <section class = 'css-reset bookmark-item-box'
               v-for = '( { ruleID, ruleName, }, index, ) of rulesData'
               :key = '"bookmark-item-" + ruleID'
               :data-rule-id = 'String(ruleID)'
               :class = '{"high-brightness":myIndex===ruleID}'
               @click.prevent = 'BookmarkItemClick($event,{
                 ruleID,
                 index,
                 isScrollTop: true,
               })'>
        <label class = 'css-reset bookmark-item-index flex-box flex-center'
               :data-rule-id = 'String(ruleID)'
               :for = 'String(ruleID)'>{{ index + 1 }}</label>
        <input class = 'css-reset bookmark-item-content'
               type = 'text'
               :id = 'String(ruleID)'
               :data-rule-id = 'String(ruleID)'
               :value = 'ruleName'
               placeholder = '请输入规则名'
               @input = 'RuleNameChange( $event, { ruleID: ruleID, } )' />
      </section>
    </aside>
    <article class = 'css-reset rules-box overflow-hidden-auto'>
      <button class = 'css-reset add-rule flex-box flex-center'
              @click = 'AddRule($event,0)'>再次插入规则
      </button>
      <template
        v-for = '( { ruleID, ruleName, ruleContent, }, index, ) of rulesData'
        :key = '"rule-item-" + ruleID'>
        <section class = 'css-reset rule-item-box'
                 :class = '{"high-brightness":myIndex===ruleID}'
                 @click.prevent = 'BookmarkItemClick($event,{
                 ruleID,
                 index,
                 isScrollTop: false,
               })'>
          <label class = 'css-reset rule-item-index flex-box flex-start-center'>规则{{ index + 1 }}（序号）</label>
          <div class = 'css-reset rule-item-name flex-box flex-start-center'>
            <label class = 'css-reset flex-box flex-start-center'
                   :for = '"rule-item-name-" + String(ruleID)'>规则名：</label>
            <input class = 'css-reset'
                   type = 'text'
                   :id = '"rule-item-name-" + String(ruleID)'
                   :data-rule-id = 'String(ruleID)'
                   :value = 'ruleName'
                   placeholder = '请输入规则名'
                   @input = 'RuleNameChange( $event, { ruleID: ruleID, } )' />
          </div>
          <div class = 'css-reset rule-item-content flex-box flex-start-center'>
            <label class = 'css-reset flex-box flex-start-center'
                   :for = '"rule-item-content-" + String(ruleID)'>配置项：</label>
            <textarea class = 'css-reset'
                      placeholder = '请输入配置项'
                      :id = '"rule-item-content-" + String(ruleID)'>{{ ruleContent }}</textarea>
          </div>
        </section>
        <button class = 'css-reset add-rule flex-box flex-center'
                @click = 'AddRule($event,index +1)'>再次插入规则
        </button>
      </template>
    </article>
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
} from 'vue';

let myIndex = ref( 0 );

const rulesData = reactive( [
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

function RuleNameChange( event: Event, {
  ruleID,
}: {
  ruleID: number;
} ){
  // @ts-expect-error
  rulesData.find( ( item, ): boolean => {
    if( item.ruleID === ruleID ){
      // @ts-expect-error
      item.ruleName = event!.target!.value as string;

      return true;
    }
  } );
}

// @ts-expect-error
function AddRule( event: Event, index: number ){
  rulesData.splice( index, 0, {
    ruleID: rulesData.length + 2024000 + 1,
    ruleName: '',
    ruleContent: '',
  } );
}

// @ts-expect-error
function BookmarkItemClick( event: Event, {
  ruleID,
  index,
  isScrollTop,
}: {
  ruleID: number;
  index: number;
  isScrollTop: boolean;
} ){
  myIndex.value = ruleID;

  if( isScrollTop ){
    // @ts-expect-error
    const offsetHeight: number = document!.querySelector( '.rule-item-box' )!.offsetHeight as number;

    document!.querySelector( '.rules-box' )!.scrollTop = ( offsetHeight * index ) + ( 20 * index ) + ( 40 * index );
  }
  else{
    // @ts-expect-error
    const offsetHeight: number = document!.querySelector( '.bookmark-item-box' )!.offsetHeight as number;

    document!.querySelector( '.bookmark-list-box' )!.scrollTop = ( offsetHeight * index ) + ( 20 * index );
  }
}

onMounted( (): void => {
  console.log( `\n\n
Vue3版本的“文件上传组件”的DOM已挂载。
\n\n` );
} );
</script>
