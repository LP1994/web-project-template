/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/AuxiliaryTool.esm.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 给单元测试用的辅助工具。
 */

/**
 * 编写原则：
 * 1、能用模块化的API尽量用模块化的，少用或者不用全局的，目的是为了让“编码风格”尽量符合“模块化”的理念。
 *
 * 2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 3、注意函数尾调用、算法时间复杂度、算法空间复杂度等优化。
 *
 * 4、那些不被导出供外部调用使用的、属于内部7788的处理函数、类等等，要以“HandleBy”打头命名。
 *
 * 5、那些需要被导出供外部调用使用的函数、类等等，一定要记得部署在“默认导出”中。
 *
 * 6、编程范式使用“函数式编程”，结合“TypeScript”编写，这样更好得便于被Webpack等工具进行“Tree-shaking”，只打包那些被使用的。
 *
 * 7、那些用于限定、描述数据类型的类型声明也要记得导出，以便供外部使用，如：export type TypeMyString001 = string。
 */

/**
 * 关于“严格模式”的注意事项：
 * 1、'use strict'严格模式会在函数内部自动深度的传递严格模式的效果。
 * 如：
 * function Fun1( x ){
 * 'use strict';
 *
 * function Fun2( y = 1 ){
 * console.log( y );
 *
 * console.log( this );
 * }
 *
 * Fun2();
 * }
 * 说明：
 * Fun1里的'use strict'严格模式的效果会传递到Fun2内部！
 * 但是，Fun1里的'use strict'严格模式却不会作用于Fun2的默认函数参数，但是Fun2里的this还是会为undefined！
 * 所以，Fun1不可以设置默认函数参数，但是Fun2可以设置默认函数参数！
 *
 * 2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 3、webpack编译后的JS代码会去掉多余的'use strict'，只保留编译前每个文件的顶级'use strict'。
 *
 * 4、class内部的方法中存在的'use strict'，在webpack编译后会被删除。
 *
 * 5、严格模式下的this还是可以通过apply、bind、call来设置的，否则还是undefined。
 * 如：
 * 'use strict';
 *
 * function Fun1(){
 * 'use strict';
 * 
 * console.dir( this );
 * }
 *
 * Fun1.call( { a: 1, } ); // 输出：{ a: 1, }，而不是undefined。
 */

'use strict';

/**
 * 在Deno中要想能正常使用“chalk”得在启用命令中添加“--color=16m”（真彩色支持，1600 万色）标识，加在入口脚本的后面，如：<br />
 * deno run -A --watch --config=deno.json --lock=lock.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 ./src/App.mts --color=16m
 * 支持的标识还有：--color=256（256色支持）、--color（该标识表示默认启用控制台颜色）、--color=16m（真彩色支持，1600 万色）。<br />
 */
import {
  Chalk,

  // @ts-ignore
} from 'https://deno.land/x/chalk_deno/source/index.js';

export type TypeMyExpect001 = string | number | boolean | bigint | symbol | null | undefined;

export type TypeError001 = {
  expect: TypeMyExpect001;
  message: string;
  result: any;
};

export const chalk: any = new Chalk();

/**
 * 使用“!==”比较的对比函数Equal001。<br />
 * PS：<br />
 * 1、如果不相等，会抛出一个异常类MyError001的实例。<br />
 *
 * @param {any} result 被测试对象的实际返回值，必需。
 *
 * @returns {{toBe: (expect: (TypeMyExpect001)) => void}} 返回一个对象，里头有一个toBe函数，它接收一个预期值expect，用于跟实际值对比。
 */
export function Equal001( result: any ): { toBe: ( expect: TypeMyExpect001 ) => void; }{
  return {
    /**
     * toBe函数，它接收一个预期值expect，用于跟实际值对比。
     *
     * @param {TypeMyExpect001} expect 预期值，必需。
     */
    toBe( expect: TypeMyExpect001 ): void{
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

  public expect: TypeMyExpect001;

  public result: any;

  constructor( {
    expect,
    message,
    result,
  }: TypeError001 ){
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
export function Test001( desc: string, fn: () => void ): void{
  try{
    fn();
  }
  catch( error: unknown ){
    const {
      expect,
      message,
      result,
    } = ( error as TypeError001 );

    console.error( chalk.red( `
${ desc }，${ message }
实际值：
${ String( result ) }
预期值：
${ String( expect ) }
` ) );
  }
}

export default {
  chalk,

  Equal001,
  MyError001,
  Test001,
};
