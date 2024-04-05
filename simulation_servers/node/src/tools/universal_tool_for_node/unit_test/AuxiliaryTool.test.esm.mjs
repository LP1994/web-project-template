/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/AuxiliaryTool.test.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 给单元测试用的辅助工具。
 */

'use strict';

import chalk from 'chalk';

/**
 * 使用“!==”比较的对比函数Equal001。<br />
 * PS：<br />
 * 1、如果不相等，会抛出一个异常类MyError001的实例。<br />
 *
 * @param {any} result 被测试对象的实际返回值，必需。
 *
 * @returns {{toBe: (expect: (any)) => void}} 返回一个对象，里头有一个toBe函数，它接收一个预期值expect，用于跟实际值对比。
 */
export function Equal001( result ){
  return {
    /**
     * toBe函数，它接收一个预期值expect，用于跟实际值对比。
     *
     * @param {any} expect 预期值，必需。
     */
    toBe( expect ){
      if( result !== expect ){
        throw new MyError001( {
          message: '实际值和预期值不全等（使用“!==”比较）！',
          result,
          expect,
        } );
      }
    },
  };
}

/**
 * 继承Error类的自定义异常类MyError001。<br />
 * PS：<br />
 * 1、new这个类时，必传一个对象作为初始化数据，其结构为{ message:一个用于描述错误信息的字符串，必需, result:实际值，必需, expect:预期值，必需 }，这样捕获该异常时，就会收到这个对象（既try...catch( error )中的error）。<br />
 */
export class MyError001
  extends Error {

  /**
   * @type {any} 预期值。
   */
  expect;

  /**
   * @type {any} 实际值。
   */
  result;

  /**
   * 构造函数，必传一个对象作为初始化数据，这样捕获该异常时，就会收到这个对象（既try...catch( error )中的error）。
   *
   * @param {object} config 构造函数的初始参数，是一个对象。
   *
   * @param {any} config.expect 预期值，必需。
   *
   * @param {string} config.message 一个用于描述错误信息的字符串，必需。
   *
   * @param {any} config.result 实际值，必需。
   */
  constructor( {
    expect,
    message,
    result,
  } ){
    super();

    this.expect = expect;
    this.message = message;
    this.result = result;
  }

}

/**
 * 执行测试代码的测试函数Test001。<br />
 * PS：<br />
 * 1、如果没通过测试，会捕获一个异常，并输出异常信息。<br />
 *
 * @param {string} desc 用于描述测试对象，必需。
 *
 * @param {() => void} fn 执行函数，必需。
 */
export function Test001( desc, fn ){
  try{
    fn();
  }
  catch( error ){
    const {
      expect,
      message,
      result,
    } = error;

    console.error( chalk.red( `
${ desc }，${ message }
实际值：
${ String( result ) }
预期值：
${ String( expect ) }
` ) );
  }
}

export {
  chalk,
};

export default {
  chalk,
  Equal001,
  MyError001,
  Test001,
};
