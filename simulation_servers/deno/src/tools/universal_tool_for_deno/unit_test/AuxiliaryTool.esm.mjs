/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/AuxiliaryTool.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 给单元测试用的辅助工具。
 */

'use strict';

/**
 * 在Deno中要想能正常使用“chalk”得在启用命令中添加“--color=16m”（真彩色支持，1600 万色）标识，加在入口脚本的后面，如：<br />
 * deno run -A --watch --config=deno.json --lock=lock.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 ./src/App.mts --color=16m
 * 支持的标识还有：--color=256（256色支持）、--color（该标识表示默认启用控制台颜色）、--color=16m（真彩色支持，1600 万色）。<br />
 */
import chalk from 'DenoX/chalk_deno/source/index.js';

/**
 * 使用“!==”比较的对比函数Equal001。<br />
 * PS：<br />
 * 1、如果不相等，会抛出一个异常类MyError001的实例。<br />
 *
 * @param result {*} 被测试对象的实际返回值，必需。
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
 * 1、new这个类时，必传一个对象作为初始化数据，其结构为{ message:一个用于描述错误信息的字符串，必需, result:实际值，必需, expect:预期值，必需 }，这样捕获该异常时，就会收到这个对象（既try...catch( error )中的error）。<br />
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
 * @param desc {string} 用于描述测试对象，必需。
 *
 * @param fn {Function} 执行函数，必需。
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
    console.error( chalk.red( `
${ desc }，${ message }
实际值：
${ result }
预期值：
${ expect }
` ) );
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
