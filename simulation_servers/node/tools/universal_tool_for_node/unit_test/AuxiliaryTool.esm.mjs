/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: simulation_servers/node/tools/universal_tool_for_node/unit_test/AuxiliaryTool.esm.mjs
 * IDE: WebStorm
 * Project: web-project-template
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
 * @param result {*} 被测试对象的实际返回值，必须。
 *
 * @returns {{toBe(*): void}} 返回一个对象，里头有一个toBe函数，它接收一个预期值，用于跟实际值对比。
 */
function Equal001( result ){
  return {
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
 * 1、new这个类时，必传一个对象作为初始化数据，其结构为{ message:一个用于描述错误信息的字符串，必须, result:实际值，必须, expect:预期值，必须 }，这样捕获该异常时，就会收到这个对象（既try...catch( error )中的error）。<br />
 */
class MyError001
  extends Error {

  constructor( {
    message = '',
    result = null,
    expect = null,
  } = {} ){
    super();

    this.message = message;
    this.result = result;
    this.expect = expect;
  }

}

/**
 * 执行测试代码的测试函数Test001。<br />
 * PS：<br />
 * 1、如果没通过测试，会捕获一个异常，并输出异常信息。<br />
 *
 * @param desc {string} 用于描述测试对象，必须。
 *
 * @param fn {Function} 执行函数，必须。
 */
function Test001( desc, fn ){
  try{
    fn();
  }
  catch( {
    message,
    result,
    expect,
  } ){
    console.error( chalk.red( '\n' ) );
    console.error( chalk.red( `${ desc }，${ message }` ) );
    console.error( chalk.red( '实际值：' ) );
    console.error( chalk.red( result ) );
    console.error( chalk.red( '预期值：' ) );
    console.error( chalk.red( expect ) );
    console.error( chalk.red( '\n\n' ) );
  }
}

export {
  Equal001,
  MyError001,
  Test001,
};

export default {
  Equal001,
  MyError001,
  Test001,
};
