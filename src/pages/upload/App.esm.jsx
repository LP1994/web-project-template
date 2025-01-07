/**
 * Project: web-project-template
 * FileDirPath: src/pages/upload/App.esm.jsx
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  useState,
} from 'react';

import {
  useImmer,
} from 'use-immer';

import './App.scss';

import Bookmarks from './components/bookmarks/Bookmarks.esm.jsx';

import Rules from './components/rules/Rules.esm.jsx';

function App(){
  const [
    myIndex,
    setMyIndex,
  ] = useState( 0 );

  const [
    rulesData,
    setRulesData,
  ] = useImmer( [
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

  function onMutationMyIndex( newMyIndex ){
    setMyIndex( newMyIndex );
  }

  function onMutationRulesData( setRulesDataFun ){
    setRulesData( setRulesDataFun );
  }

  return (
    // *********弹窗、悬浮一类节点的书写区域 Start*********
    /*
     说明：
     1、这些弹窗、悬浮一类节点的最外层节点的定位建议使用“position: absolute”。
     2、这样就算这些节点中有可滚动的内容，也不会出现滚动穿透BUG！
     */
    // <dialog style = 'position: absolute;'>例子：可以滚动的内容。</dialog>
    // *********弹窗、悬浮一类节点的书写区域 End*********
    // 在main这个节点里写主体HTML。
    <main className = 'css-reset full-screen overflow-hidden-auto'>
      <Bookmarks myIndex = { myIndex }
                 onMutationMyIndex = { onMutationMyIndex }
                 rulesData = { rulesData }
                 onMutationRulesData = { onMutationRulesData } />
      <Rules myIndex = { myIndex }
             onMutationMyIndex = { onMutationMyIndex }
             rulesData = { rulesData }
             onMutationRulesData = { onMutationRulesData } />
    </main>
  );
}

export default App;
