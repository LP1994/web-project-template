/**
 * Project: web-project-template
 * FileDirPath: src/pages/upload/components/bookmarks/Bookmarks.esm.jsx
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import classnames from 'classnames';

import 'cssDir/FlexBox.css';

import './Bookmarks.scss';

function Bookmarks( {
  myIndex,
  onMutationMyIndex,
  rulesData,
  onMutationRulesData,
} ){
  function bookmarkItemClick( event, {
    ruleID,
    index,
  } ){
    event.preventDefault();

    onMutationMyIndex( ruleID );

    const offsetHeight = document.querySelector( '.rule-item-box' ).offsetHeight;

    document.querySelector( '.rules-box' ).scrollTo( {
      left: 0,
      top: ( offsetHeight * index ) + ( 20 * index ) + ( 40 * index ),
      behavior: 'smooth',
    } );
  }

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

  return (
    <aside className = 'css-reset bookmark-list-box overflow-hidden-auto'>
      {
        rulesData.map(
          (
            {
              ruleID,
              ruleName,
            },
            index,
          ) => {
            return (
              <section className = { classnames( 'css-reset bookmark-item-box', { 'high-brightness': myIndex === ruleID, } ) }
                       key = { 'bookmark-item-' + ruleID }
                       data-rule-id = { String( ruleID ) }
                       onClick = {
                         event => bookmarkItemClick(
                           event,
                           {
                             ruleID,
                             index,
                           }
                         )
                       }>
                <label className = 'css-reset bookmark-item-index flex-box flex-center'
                       data-rule-id = { String( ruleID ) }
                       htmlFor = { String( ruleID ) }>{ index + 1 }</label>
                <input className = 'css-reset bookmark-item-content'
                       type = 'text'
                       id = { String( ruleID ) }
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
              </section>
            );
          } )
      }
    </aside>
  );
}

export default Bookmarks;
