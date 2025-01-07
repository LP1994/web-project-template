/**
 * Project: web-project-template
 * FileDirPath: src/pages/upload/components/rules/Rules.esm.jsx
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import classnames from 'classnames';

import {
  Fragment,
} from 'react';

import 'cssDir/FlexBox.css';

import './Rules.scss';

function Rules( {
  myIndex,
  onMutationMyIndex,
  rulesData,
  onMutationRulesData,
} ){
  function ruleNameChange( event, {
    ruleID: ruleID,
  } ){
    const newRulesData = [
        ...rulesData,
      ],
      findIndex = newRulesData.findIndex( ( {
        ruleID: itemRuleID,
      } ) => itemRuleID === ruleID );

    if( findIndex !== -1 ){
      newRulesData.splice( findIndex, 1, {
        ...newRulesData[ findIndex ],
        ruleName: event.target.value,
      } );

      onMutationRulesData( newRulesData );
    }
  }

  function addRule( event, index ){
    const newRulesData = [
      ...rulesData,
    ];

    newRulesData.splice( index, 0, {
      ruleID: newRulesData.length + 2024000 + 1,
      ruleName: '',
      ruleContent: '',
    } );

    onMutationRulesData( newRulesData );
  }

  function bookmarkItemClick( event, {
    ruleID,
    index,
  } ){
    event.preventDefault();

    onMutationMyIndex( ruleID );

    const offsetHeight = document.querySelector( '.bookmark-item-box' ).offsetHeight;

    document.querySelector( '.bookmark-list-box' ).scrollTo( {
      left: 0,
      top: ( offsetHeight * index ) + ( 20 * index ),
      behavior: 'smooth',
    } );
  }

  return (
    <article className = 'css-reset rules-box overflow-hidden-auto'>
      <button className = 'css-reset add-rule flex-box flex-center'
              onClick = {
                event => addRule( event, 0 )
              }>再次插入规则
      </button>
      {
        rulesData.map(
          (
            {
              ruleID,
              ruleName,
              ruleContent,
            },
            index,
          ) => {
            return (
              <Fragment key = { 'rule-item-' + ruleID }>
                <section className = { classnames( 'css-reset rule-item-box', { 'high-brightness': myIndex === ruleID, } ) }
                         onClick = {
                           event => bookmarkItemClick(
                             event,
                             {
                               ruleID,
                               index,
                             }
                           )
                         }>
                  <label className = 'css-reset rule-item-index flex-box flex-start-center'>规则{ index + 1 }（序号）</label>
                  <div className = 'css-reset rule-item-name flex-box flex-start-center'>
                    <label className = 'css-reset flex-box flex-start-center'
                           htmlFor = { 'rule-item-name-' + String( ruleID ) }>规则名：</label>
                    <input className = 'css-reset'
                           type = 'text'
                           id = { 'rule-item-name-' + String( ruleID ) }
                           data-rule-id = { String( ruleID ) }
                           value = { ruleName }
                           placeholder = '请输入规则名'
                           onInput = {
                             event => ruleNameChange(
                               event,
                               {
                                 ruleID: ruleID,
                               }
                             )
                           } />
                  </div>
                  <div className = 'css-reset rule-item-content flex-box flex-start-center'>
                    <label className = 'css-reset flex-box flex-start-center'
                           htmlFor = { 'rule-item-content-' + String( ruleID ) }>配置项：</label>
                    <textarea className = 'css-reset'
                              placeholder = '请输入配置项'
                              id = { 'rule-item-content-' + String( ruleID ) }
                              defaultValue = { ruleContent } />
                  </div>
                </section>
                <button className = 'css-reset add-rule flex-box flex-center'
                        onClick = {
                          event => addRule( event, index + 1 )
                        }>再次插入规则
                </button>
              </Fragment>
            );
          } )
      }
    </article>
  );
}

export default Rules;
