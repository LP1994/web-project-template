/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-27 19:58:50 星期日
 */

/**
 * 该工具库是使用“TypeScript”编写的公共的、通用的、不特定于某个项目使用的脚本工具库。
 * 该通用工具仅用于Deno环境，并且不是特定于某个项目才能使用的，使用“ECMAScript modules(ECMAScript模块)”写法。
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
 * 5、那些需要被导出供外部调用使用的函数、类等等，一定要记得也要同时部署在“默认导出”中。
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
 * 在Deno中要想能正常使用“chalk”得在启用命令中添加“--color=16m”（真彩色支持，1600 万色）标识，加在入口脚本的后面，如：
 * deno run -A --watch --config=deno.json --lock=lock.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 ./src/App.mts --color=16m
 * 支持的标识还有：--color=256（256色支持）、--color（该标识表示默认启用控制台颜色）、--color=16m（真彩色支持，1600 万色）。
 */
import {
  default as chalk,

  // @ts-ignore
} from 'https://deno.land/x/chalk_deno/source/index.js';

// 自定义的类型别名。Start

/**
 * 自定义的类型别名TypeDateFormatForObject，表示一个对象：
 * year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
export type TypeDateFormatForObject = {
  /**
   * 表示年。
   */
  year: string;
  /**
   * 表示月。
   */
  month: string;
  /**
   * 表示日。
   */
  date: string;
  /**
   * 表示时。
   */
  hours: string;
  /**
   * 表示分。
   */
  minutes: string;
  /**
   * 表示秒。
   */
  seconds: string;
  /**
   * 表示周，当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化。
   */
  day: string;
};

/**
 * 表示一个对象类型，这个对象中有个“singleton”属性，其值是“包装函数”中所返回的期望的单例对象。
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数的描述），用于清除并置空已经生成的期望的单例对象。
 */
export type TypeSingleton<T> = {
  /**
   * 已生成的期望的单例对象。
   */
  singleton: T;

  /**
   * 用于清除并置空已经生成的期望的单例对象，支持清除后的回调函数操作。
   *
   * @param {() => unknown} cb 完成清除并置空已经生成的期望的单例对象后，所要执行的回调函数，用于做一些在清除后的操作，可选。
   *
   * @returns {unknown|void} 如果传入了上面的“cb”参数，那么“cb”参数在执行后返回的值就是“clear”函数的返回值，如果没传入上面的“cb”参数，那就返回void。
   */
  clear: ( cb?: () => unknown ) => unknown | void;
};

// 自定义的类型别名。End

// 内部使用的7788的处理函数。Start

/**
 * 一种字符串的相等比较（使用===比较），用于辅助判断数据类型。<br />
 * 大多是如下的比较：<br />
 * ```ts
 * '[object Arguments]'.slice( 8, -1 ) === 'Arguments';
 * '[object HTMLDocument XXX]'.slice( 8, -1 ) === 'HTMLDocument XXX';
 * ```
 *
 * @internal
 *
 * @param {any} equalArg1 数据，必需。
 *
 * @param {string} equalArg2 可以是诸如'Arguments'、'ArrayBuffer'等等表示目标数据类型名的字符串，必需。
 *
 * @returns {boolean} 使用===比较，相等则返回true，否则返回false。
 */
function HandleByEqualForString001( equalArg1: any, equalArg2: string ): boolean{
  return GetDataType( equalArg1 ).slice( 8, -1 ) === equalArg2;
}

// 内部使用的7788的处理函数。End

// 支持泛型参数的单例工厂。Start

/**
 * 支持泛型参数的单例工厂。
 *
 * @param {() => T} func 包装函数，当它被执行时，会返回期望中的单例对象，必需。
 *
 * @returns {() => TypeSingleton<T>} 返回一个生成单例的函数，执行它就会返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“TypeSingleton<T>”），用于清除并置空已经生成的期望的单例对象。
 */
export function SingletonFactory<T>( func: () => T ): () => TypeSingleton<T>{
  let singleton: T | null = null;

  /**
   * 一个生成单例的函数，执行它就会返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“TypeSingleton<T>”），用于清除并置空已经生成的期望的单例对象。
   *
   * @returns {() => TypeSingleton<T>} 返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“TypeSingleton<T>”），用于清除并置空已经生成的期望的单例对象。
   */
  return (): TypeSingleton<T> => {
    if( singleton === null ){
      singleton = func() as T;
    }

    return {
      /**
       * 已生成的期望的单例对象。
       */
      singleton: singleton as T,
      /**
       * 用于清除并置空已经生成的期望的单例对象，支持清除后的回调函数操作。
       *
       * @param {() => unknown} cb 完成清除并置空已经生成的期望的单例对象后，所要执行的回调函数，用于做一些在清除后的操作，可选。
       *
       * @returns {unknown|void} 如果传入了上面的“cb”参数，那么“cb”参数在执行后返回的值就是“clear”函数的返回值，如果没传入上面的“cb”参数，那就返回void。
       */
      clear( cb?: () => unknown ): unknown | void{
        singleton = null;

        if( cb && typeof cb === 'function' ){
          return cb();
        }

        return void 0;
      },
    };
  };
}

// 支持泛型参数的单例工厂。End

// 类型转换。Start

/**
 * 将“String”类型的数据转换成“Uint8Array”类型。
 *
 * @param {string} data “String”类型的数据，必需。
 *
 * @returns {Uint8Array} 转换成“Uint8Array”类型的数据。
 */
export function StringToUint8Array( data: string ): Uint8Array{
  return new TextEncoder().encode( data );
}

/**
 * 将“Uint8Array”类型的数据转换成“String”类型。
 *
 * @param {Uint8Array} data “Uint8Array”类型的数据，必需。
 *
 * @returns {string} 转换成“String”类型的数据。
 */
export function Uint8ArrayToString( data: Uint8Array ): string{
  return new TextDecoder().decode( data );
}

// 类型转换。End

// Date格式处理。Start

/**
 * 返回传入的“Date实例对象”的年、月、日、时、分、秒、周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。<br />
 *
 * @param {Date} dateInstance 一个“Date实例对象”，默认值（当前时间）：new Date( Date.now() )，可选。<br />
 *
 * @returns {TypeDateFormatForObject} year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
export function DateFormatForObject( dateInstance: Date = new Date( Date.now() ) ): TypeDateFormatForObject{
  const year: string = String( dateInstance.getFullYear() ),
    month: string = String( dateInstance.getMonth() + 1 ).padStart( 2, '0' ),
    date: string = String( dateInstance.getDate() ).padStart( 2, '0' ),
    hours: string = String( dateInstance.getHours() ).padStart( 2, '0' ),
    minutes: string = String( dateInstance.getMinutes() ).padStart( 2, '0' ),
    seconds: string = String( dateInstance.getSeconds() ).padStart( 2, '0' ),
    day001: number = dateInstance.getDay(),
    day: string = String( day001 === 0
                          ? '日'
                          : day001 );

  return {
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    day,
  };
}

// Date格式处理。End

// 判断数据类型。Start

/**
 * 获取数据类型的字符串，如：'[object HTMLDocument]'、'[object HTMLDocument XXX]'。<br />
 * PS:<br />
 * 1、如果传入的是被Proxy代理过的对象，会报错！<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {string} 表示数据类型的字符串，如：'[object HTMLDocument]'、'[object HTMLDocument XXX]'。
 */
export function GetDataType( arg: any ): string{
  'use strict';

  return Object.prototype.toString.call( arg );
}

/**
 * 判断数据是否为Array类型。<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {boolean} 是数组返回true，不是数组返回false。
 */
export function IsArray( arg: any ): boolean{
  'use strict';

  return Array.isArray( arg );
}

/**
 * 判断数据是否为Number类型的原始值，包括NaN值，但是Number对象、Number实例会返回false。<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {boolean} 是Number原始值、NaN值返回true，不是Number原始值、NaN值返回false。
 */
export function IsNumber( arg: any ): boolean{
  return HandleByEqualForString001( arg, 'Number' ) && ( typeof arg === 'number' );
}

/**
 * 判断数据是否为String类型的原始值，String对象、String实例会返回false。<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {boolean} 是String原始值返回true，不是String原始值返回false。
 */
export function IsString( arg: any ): boolean{
  return HandleByEqualForString001( arg, 'String' ) && ( typeof arg === 'string' );
}

// 判断数据类型。End

// 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union以及IsDisjointFrom（是否不相交）、IsSubsetOf（是否是子集）、IsSupersetOf（是否是超集）。Start

/**
 * 数组A、数组B两者之间是否没有交集，true表示没有交集，反之表示有交集。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {boolean} 数组A、数组B两者之间是否没有交集，true表示没有交集，反之表示有交集。
 */
export function IsDisjointFrom( arrA: Array<any> = [], arrB: Array<any> = [] ): boolean{
  if( arrA.length === 0 || arrB.length === 0 ){
    return true;
  }

  return Intersection( arrA, arrB ).length === 0;
}

/**
 * 数组B是否是数组A的子集，true表示是，反之表示不是。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {boolean} 数组B是否是数组A的子集，true表示是，反之表示不是。
 */
export function IsSubsetOf( arrA: Array<any> = [], arrB: Array<any> = [] ): boolean{
  if( arrA.length === 0 || arrB.length === 0 ){
    return false;
  }

  return Intersection( arrA, arrB ).length === Array.from( new Set( arrB ) ).length;
}

/**
 * 数组B是否是数组A的超集，true表示是，反之表示不是。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {boolean} 数组B是否是数组A的超集，true表示是，反之表示不是。
 */
export function IsSupersetOf( arrA: Array<any> = [], arrB: Array<any> = [] ): boolean{
  if( arrA.length === 0 || arrB.length === 0 ){
    return false;
  }

  return Intersection( arrA, arrB ).length === Array.from( new Set( arrA ) ).length;
}

/**
 * 差集Difference：一个由属于数组A的成员但不属于数组B的成员组成的数组，可记作：数组A - 数组B。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 *
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {Array<any>} 新数组，一个由属于数组A的成员但不属于数组B的成员组成的数组，可记作：数组A - 数组B。
 */
export function Difference( arrA: Array<any> = [], arrB: Array<any> = [] ): Array<any>{
  if( arrA.length === 0 ){
    return [];
  }

  if( arrB.length === 0 ){
    return arrA;
  }

  arrA = Array.from( new Set( arrA ) );
  arrB = Array.from( new Set( arrB ) );

  return arrA.filter( ( item: any ): boolean => !arrB.includes( item ) );
}

/**
 * 交集Intersection：由既是数组A的成员又是数组B的成员组成的数组。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 *
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {Array<any>} 新数组，由既是数组A的成员又是数组B的成员组成的数组。
 */
export function Intersection( arrA: Array<any> = [], arrB: Array<any> = [] ): Array<any>{
  if( arrA.length !== 0 && arrB.length !== 0 ){
    arrA = Array.from( new Set( arrA ) );
    arrB = Array.from( new Set( arrB ) );

    const arr001: Array<any> = arrA.length - arrB.length >= 0
                               ? arrB
                               : arrA,
      arr002: Array<any> = arrA.length - arrB.length >= 0
                           ? arrA
                           : arrB;

    return arr001.filter( ( item: any ): boolean => arr002.includes( item ) );
  }

  return [];
}

/**
 * 对称差集SymmetricDifference：由“数组A、数组B的并集”在剔除“数组A、数组B的交集”后的数组，可记作：数组A、数组B的并集 - 数组A、数组B的交集。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 *
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {Array<any>} 新数组：由“数组A、数组B的并集”在剔除“数组A、数组B的交集”后的数组，可记作：数组A、数组B的并集 - 数组A、数组B的交集。
 */
export function SymmetricDifference( arrA: Array<any> = [], arrB: Array<any> = [] ): Array<any>{
  arrA = Array.from( new Set( arrA ) );
  arrB = Array.from( new Set( arrB ) );

  const unionArr: Array<any> = Union( arrA, arrB ),
    intersectionArr: Array<any> = Intersection( arrA, arrB );

  return Difference( unionArr, intersectionArr );
}

/**
 * 并集Union：由数组A的所有成员和数组B的所有成员组成的新数组，且该新数组剔除了内部重复的成员，留下唯一的。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 *
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {Array<any>} 新数组，由数组A的所有成员和数组B的所有成员组成的新数组，且该新数组剔除了内部重复的成员，留下唯一的。
 */
export function Union( arrA: Array<any> = [], arrB: Array<any> = [] ): Array<any>{
  return Array.from( new Set( [
    ...arrA,
    ...arrB,
  ] ) );
}

// 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union以及IsDisjointFrom（是否不相交）、IsSubsetOf（是否是子集）、IsSupersetOf（是否是超集）。End

/**
 * 自定义的Console类，用于在控制台输出带颜色、样式的文字，还集成了“chalk”模块（一个可以输出带颜色等样式的文本）的部分函数，这些都被作为静态方法挂载在这个自定义的Console类。<br />
 * PS：<br />
 * 1、“chalk”模块文档：<br />
 * https://deno.land/x/chalk_deno<br />
 *
 * 2、如果使用的是Windows 10 2004(build 19041)或更高版本的Windows OS，请使用系统自带的Windows终端（Windows Terminal）而不是cmd.exe，不然有些效果出不来。<br />
 *
 * 3、在Deno中要想能正常使用“chalk”得在启用命令中添加“--color=16m”（真彩色支持，1600 万色）标识，加在入口脚本的后面，如：<br />
 * deno run -A --watch --config=deno.json --lock=lock.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 ./src/App.mts --color=16m <br />
 * 支持的标识还有：--color=256（256色支持）、--color（该标识表示默认启用控制台颜色）、--color=16m（真彩色支持，1600 万色）。<br />
 */
export class MyConsole {

  /**
   * 私有实例属性。<br />
   *
   * @type {{[p: string]: any}}
   *
   * @private
   */
  #myChalk: { [ keyName: string ]: any; } = chalk;

  /**
   * 私有静态属性。<br />
   *
   * @type {{[p: string]: any}}
   *
   * @private
   */
  static #MyChalk: { [ keyName: string ]: any; } = chalk;

  /**
   * 自定义的Console类，用于在控制台输出带颜色、样式的文字，还集成了“chalk”模块（一个可以输出带颜色等样式的文本）的部分函数，这些都被作为静态方法挂载在这个自定义的Console类。<br />
   * PS：<br />
   * 1、“chalk”模块文档：<br />
   * https://deno.land/x/chalk_deno<br />
   *
   * 2、如果使用的是Windows 10 2004(build 19041)或更高版本的Windows OS，请使用系统自带的Windows终端（Windows Terminal）而不是cmd.exe，不然有些效果出不来。<br />
   *
   * 3、在Deno中要想能正常使用“chalk”得在启用命令中添加“--color=16m”（真彩色支持，1600 万色）标识，加在入口脚本的后面，如：<br />
   * deno run -A --watch --config=deno.json --lock=lock.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 ./src/App.mts --color=16m <br />
   * 支持的标识还有：--color=256（256色支持）、--color（该标识表示默认启用控制台颜色）、--color=16m（真彩色支持，1600 万色）。<br />
   *
   * @param {object} config 初始化字体颜色（color）、背景色（bgColor），可选。<br />
   *
   * @param {Array<number> | string | number | null} config.color 初始化字体颜色（color），值类型可以是：number[]（rgb值，如：[255, 136, 0]）、string（hex值，如：'#FF8800'）、number（ansi256值，如：194），默认值null，可选。<br />
   *
   * @param {Array<number> | string | number | null} config.bgColor 初始化背景色（bgColor），值类型可以是：number[]（rgb值，如：[255, 136, 0]）、string（hex值，如：'#FF8800'）、number（ansi256值，如：194），默认值null，可选。<br />
   */
  public constructor( {
    color = null,
    bgColor = null,
  }: {
    color: Array<number> | string | number | null;
    bgColor: Array<number> | string | number | null;
  } = {
    color: null,
    bgColor: null,
  } ){
    if( IsArray( color ) ){
      this.#myChalk = this.#myChalk.rgb( ...( color as Array<number> ) );
    }
    else if( IsString( color ) ){
      this.#myChalk = this.#myChalk.hex( color );
    }
    else if( IsNumber( color ) ){
      this.#myChalk = this.#myChalk.ansi256( color );
    }

    if( IsArray( bgColor ) ){
      this.#myChalk = this.#myChalk.bgRgb( ...( bgColor as Array<number> ) );
    }
    else if( IsString( bgColor ) ){
      this.#myChalk = this.#myChalk.bgHex( bgColor );
    }
    else if( IsNumber( bgColor ) ){
      this.#myChalk = this.#myChalk.bgAnsi256( bgColor );
    }
  }

  /**
   * 重置当前已经自定义的样式，回到默认样式。<br />
   */
  public reset(): void{
    this.#myChalk.reset();

    this.#myChalk = chalk;
  }

  // 设置字体颜色 Start

  /**
   * 使用rgb值设置字体颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {number[]} rgbArr rgb值，如：[ 255, 136, 0 ]，必需。
   */
  public setRGB( rgbArr: Array<number> ): void{
    if( IsArray( rgbArr ) ){
      this.#myChalk = this.#myChalk.rgb( ...rgbArr );
    }
  }

  /**
   * 使用hex值设置字体颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {string} hexStr hex值，如：'#FF8800'，必需。
   */
  public setHEX( hexStr: string ): void{
    if( IsString( hexStr ) ){
      this.#myChalk = this.#myChalk.hex( hexStr );
    }
  }

  /**
   * 使用ansi256值设置字体颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {number} ansi256Num ansi256值，如：194，必需。
   */
  public setANSI256( ansi256Num: number ): void{
    if( IsNumber( ansi256Num ) ){
      this.#myChalk = this.#myChalk.ansi256( ansi256Num );
    }
  }

  // 设置字体颜色 End

  // 设置背景颜色 Start

  /**
   * 使用rgb值设置背景颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {number[]} rgbArr rgb值，如：[ 255, 136, 0 ]，必需。
   */
  public setBgRGB( rgbArr: Array<number> ): void{
    if( IsArray( rgbArr ) ){
      this.#myChalk = this.#myChalk.bgRgb( ...rgbArr );
    }
  }

  /**
   * 使用hex值设置背景颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {string} hexStr hex值，如：'#FF8800'，必需。
   */
  public setBgHEX( hexStr: string ): void{
    if( IsString( hexStr ) ){
      this.#myChalk = this.#myChalk.bgHex( hexStr );
    }
  }

  /**
   * 使用ansi256值设置背景颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {number} ansi256Num ansi256值，如：194，必需。
   */
  public setBgANSI256( ansi256Num: number ): void{
    if( IsNumber( ansi256Num ) ){
      this.#myChalk = this.#myChalk.bgAnsi256( ansi256Num );
    }
  }

  // 设置背景颜色 End

  // 文字修饰 Start

  /**
   * 使用自定义的样式在控制台输出粗体文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bold( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bold方法，可参见chalk模块的bold方法的参数说明，必需。
   */
  public bold( data: any ): void{
    console.log( this.#myChalk.bold( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出暗淡的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).dim( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的dim方法，可参见chalk模块的dim方法的参数说明，必需。
   */
  public dim( data: any ): void{
    console.log( this.#myChalk.dim( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出斜体文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).italic( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的italic方法，可参见chalk模块的italic方法的参数说明，必需。
   */
  public italic( data: any ): void{
    console.log( this.#myChalk.italic( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带下划线的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).underline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的underline方法，可参见chalk模块的underline方法的参数说明，必需。
   */
  public underline( data: any ): void{
    console.log( this.#myChalk.underline( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带上划线的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).overline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的overline方法，可参见chalk模块的overline方法的参数说明，必需。
   */
  public overline( data: any ): void{
    console.log( this.#myChalk.overline( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出反转背景色和前景色（也就是将背景色用作字体颜色，字体颜色用作背景色）的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).inverse( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的inverse方法，可参见chalk模块的inverse方法的参数说明，必需。
   */
  public inverse( data: any ): void{
    console.log( this.#myChalk.inverse( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出但是隐藏文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).hidden( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的hidden方法，可参见chalk模块的hidden方法的参数说明，必需。
   */
  public hidden( data: any ): void{
    console.log( this.#myChalk.hidden( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带删除线的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).strikethrough( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的strikethrough方法，可参见chalk模块的strikethrough方法的参数说明，必需。
   */
  public strikethrough( data: any ): void{
    console.log( this.#myChalk.strikethrough( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出常规的可见文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).visible( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的visible方法，可参见chalk模块的visible方法的参数说明，必需。
   */
  public visible( data: any ): void{
    console.log( this.#myChalk.visible( data ) );
  }

  /**
   * 使用默认样式在控制台输出粗体文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Bold( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bold方法，可参见chalk模块的bold方法的参数说明，必需。
   */
  public static Bold( data: any ): void{
    console.log( this.#MyChalk.bold( data ) );
  }

  /**
   * 使用默认样式在控制台输出暗淡的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Dim( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的dim方法，可参见chalk模块的dim方法的参数说明，必需。
   */
  public static Dim( data: any ): void{
    console.log( this.#MyChalk.dim( data ) );
  }

  /**
   * 使用默认样式在控制台输出斜体文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Italic( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的italic方法，可参见chalk模块的italic方法的参数说明，必需。
   */
  public static Italic( data: any ): void{
    console.log( this.#MyChalk.italic( data ) );
  }

  /**
   * 使用默认样式在控制台输出带下划线的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Underline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的underline方法，可参见chalk模块的underline方法的参数说明，必需。
   */
  public static Underline( data: any ): void{
    console.log( this.#MyChalk.underline( data ) );
  }

  /**
   * 使用默认样式在控制台输出带上划线的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Overline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的overline方法，可参见chalk模块的overline方法的参数说明，必需。
   */
  public static Overline( data: any ): void{
    console.log( this.#MyChalk.overline( data ) );
  }

  /**
   * 使用默认样式在控制台输出反转背景色和前景色（也就是将背景色用作字体颜色，字体颜色用作背景色）的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Inverse( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的inverse方法，可参见chalk模块的inverse方法的参数说明，必需。
   */
  public static Inverse( data: any ): void{
    console.log( this.#MyChalk.inverse( data ) );
  }

  /**
   * 使用默认样式在控制台输出但是隐藏文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Hidden( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的hidden方法，可参见chalk模块的hidden方法的参数说明，必需。
   */
  public static Hidden( data: any ): void{
    console.log( this.#MyChalk.hidden( data ) );
  }

  /**
   * 使用默认样式在控制台输出带删除线的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Strikethrough( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的strikethrough方法，可参见chalk模块的strikethrough方法的参数说明，必需。
   */
  public static Strikethrough( data: any ): void{
    console.log( this.#MyChalk.strikethrough( data ) );
  }

  /**
   * 使用默认样式在控制台输出常规的可见文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Visible( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的visible方法，可参见chalk模块的visible方法的参数说明，必需。
   */
  public static Visible( data: any ): void{
    console.log( this.#MyChalk.visible( data ) );
  }

  // 文字修饰 End

  // 文字颜色 Start

  /**
   * 使用自定义的样式在控制台输出黑色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).black( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的black方法，可参见chalk模块的black方法的参数说明，必需。
   */
  public black( data: any ): void{
    console.log( this.#myChalk.black( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出红色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).red( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的red方法，可参见chalk模块的red方法的参数说明，必需。
   */
  public red( data: any ): void{
    console.log( this.#myChalk.red( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出绿色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).green( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的green方法，可参见chalk模块的green方法的参数说明，必需。
   */
  public green( data: any ): void{
    console.log( this.#myChalk.green( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黄色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).yellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellow方法，可参见chalk模块的yellow方法的参数说明，必需。
   */
  public yellow( data: any ): void{
    console.log( this.#myChalk.yellow( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出蓝色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).blue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blue方法，可参见chalk模块的blue方法的参数说明，必需。
   */
  public blue( data: any ): void{
    console.log( this.#myChalk.blue( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出洋红色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).magenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magenta方法，可参见chalk模块的magenta方法的参数说明，必需。
   */
  public magenta( data: any ): void{
    console.log( this.#myChalk.magenta( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出青色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).cyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyan方法，可参见chalk模块的cyan方法的参数说明，必需。
   */
  public cyan( data: any ): void{
    console.log( this.#myChalk.cyan( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出白色文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).white( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的white方法，可参见chalk模块的white方法的参数说明，必需。
   */
  public white( data: any ): void{
    console.log( this.#myChalk.white( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出灰色文字（blackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).gray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的gray方法，可参见chalk模块的gray方法的参数说明，必需。
   */
  public gray( data: any ): void{
    console.log( this.#myChalk.gray( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出灰色文字（blackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).grey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的grey方法，可参见chalk模块的grey方法的参数说明，必需。
   */
  public grey( data: any ): void{
    console.log( this.#myChalk.grey( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黑亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).blackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blackBright方法，可参见chalk模块的blackBright方法的参数说明，必需。
   */
  public blackBright( data: any ): void{
    console.log( this.#myChalk.blackBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出红亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).redBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的redBright方法，可参见chalk模块的redBright方法的参数说明，必需。
   */
  public redBright( data: any ): void{
    console.log( this.#myChalk.redBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出绿亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).greenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的greenBright方法，可参见chalk模块的greenBright方法的参数说明，必需。
   */
  public greenBright( data: any ): void{
    console.log( this.#myChalk.greenBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黄亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).yellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellowBright方法，可参见chalk模块的yellowBright方法的参数说明，必需。
   */
  public yellowBright( data: any ): void{
    console.log( this.#myChalk.yellowBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出蓝亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).blueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blueBright方法，可参见chalk模块的blueBright方法的参数说明，必需。
   */
  public blueBright( data: any ): void{
    console.log( this.#myChalk.blueBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出洋红亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).magentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magentaBright方法，可参见chalk模块的magentaBright方法的参数说明，必需。
   */
  public magentaBright( data: any ): void{
    console.log( this.#myChalk.magentaBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出青亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).cyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyanBright方法，可参见chalk模块的cyanBright方法的参数说明，必需。
   */
  public cyanBright( data: any ): void{
    console.log( this.#myChalk.cyanBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出白亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).whiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的whiteBright方法，可参见chalk模块的whiteBright方法的参数说明，必需。
   */
  public whiteBright( data: any ): void{
    console.log( this.#myChalk.whiteBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出黑色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Black( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的black方法，可参见chalk模块的black方法的参数说明，必需。
   */
  public static Black( data: any ): void{
    console.log( this.#MyChalk.black( data ) );
  }

  /**
   * 使用默认样式在控制台输出红色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Red( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的red方法，可参见chalk模块的red方法的参数说明，必需。
   */
  public static Red( data: any ): void{
    console.log( this.#MyChalk.red( data ) );
  }

  /**
   * 使用默认样式在控制台输出绿色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Green( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的green方法，可参见chalk模块的green方法的参数说明，必需。
   */
  public static Green( data: any ): void{
    console.log( this.#MyChalk.green( data ) );
  }

  /**
   * 使用默认样式在控制台输出黄色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Yellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellow方法，可参见chalk模块的yellow方法的参数说明，必需。
   */
  public static Yellow( data: any ): void{
    console.log( this.#MyChalk.yellow( data ) );
  }

  /**
   * 使用默认样式在控制台输出蓝色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Blue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blue方法，可参见chalk模块的blue方法的参数说明，必需。
   */
  public static Blue( data: any ): void{
    console.log( this.#MyChalk.blue( data ) );
  }

  /**
   * 使用默认样式在控制台输出洋红色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Magenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magenta方法，可参见chalk模块的magenta方法的参数说明，必需。
   */
  public static Magenta( data: any ): void{
    console.log( this.#MyChalk.magenta( data ) );
  }

  /**
   * 使用默认样式在控制台输出青色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Cyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyan方法，可参见chalk模块的cyan方法的参数说明，必需。
   */
  public static Cyan( data: any ): void{
    console.log( this.#MyChalk.cyan( data ) );
  }

  /**
   * 使用默认样式在控制台输出白色文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.White( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的white方法，可参见chalk模块的white方法的参数说明，必需。
   */
  public static White( data: any ): void{
    console.log( this.#MyChalk.white( data ) );
  }

  /**
   * 使用默认样式在控制台输出灰色文字（BlackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Gray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的gray方法，可参见chalk模块的gray方法的参数说明，必需。
   */
  public static Gray( data: any ): void{
    console.log( this.#MyChalk.gray( data ) );
  }

  /**
   * 使用默认样式在控制台输出灰色文字（BlackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.Grey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的grey方法，可参见chalk模块的grey方法的参数说明，必需。
   */
  public static Grey( data: any ): void{
    console.log( this.#MyChalk.grey( data ) );
  }

  /**
   * 使用默认样式在控制台输出黑亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BlackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blackBright方法，可参见chalk模块的blackBright方法的参数说明，必需。
   */
  public static BlackBright( data: any ): void{
    console.log( this.#MyChalk.blackBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出红亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.RedBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的redBright方法，可参见chalk模块的redBright方法的参数说明，必需。
   */
  public static RedBright( data: any ): void{
    console.log( this.#MyChalk.redBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出绿亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.GreenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的greenBright方法，可参见chalk模块的greenBright方法的参数说明，必需。
   */
  public static GreenBright( data: any ): void{
    console.log( this.#MyChalk.greenBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出黄亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.YellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellowBright方法，可参见chalk模块的yellowBright方法的参数说明，必需。
   */
  public static YellowBright( data: any ): void{
    console.log( this.#MyChalk.yellowBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出蓝亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BlueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blueBright方法，可参见chalk模块的blueBright方法的参数说明，必需。
   */
  public static BlueBright( data: any ): void{
    console.log( this.#MyChalk.blueBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出洋红亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.MagentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magentaBright方法，可参见chalk模块的magentaBright方法的参数说明，必需。
   */
  public static MagentaBright( data: any ): void{
    console.log( this.#MyChalk.magentaBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出青亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.CyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyanBright方法，可参见chalk模块的cyanBright方法的参数说明，必需。
   */
  public static CyanBright( data: any ): void{
    console.log( this.#MyChalk.cyanBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出白亮文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.WhiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的whiteBright方法，可参见chalk模块的whiteBright方法的参数说明，必需。
   */
  public static WhiteBright( data: any ): void{
    console.log( this.#MyChalk.whiteBright( data ) );
  }

  // 文字颜色 End

  // 背景颜色 Start

  /**
   * 使用自定义的样式在控制台输出背景为黑色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlack( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlack方法，可参见chalk模块的bgBlack方法的参数说明，必需。
   */
  public bgBlack( data: any ): void{
    console.log( this.#myChalk.bgBlack( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为红色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgRed( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRed方法，可参见chalk模块的bgRed方法的参数说明，必需。
   */
  public bgRed( data: any ): void{
    console.log( this.#myChalk.bgRed( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为绿色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGreen( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreen方法，可参见chalk模块的bgGreen方法的参数说明，必需。
   */
  public bgGreen( data: any ): void{
    console.log( this.#myChalk.bgGreen( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黄色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgYellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellow方法，可参见chalk模块的bgYellow方法的参数说明，必需。
   */
  public bgYellow( data: any ): void{
    console.log( this.#myChalk.bgYellow( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为蓝色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlue方法，可参见chalk模块的bgBlue方法的参数说明，必需。
   */
  public bgBlue( data: any ): void{
    console.log( this.#myChalk.bgBlue( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为洋红色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgMagenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagenta方法，可参见chalk模块的bgMagenta方法的参数说明，必需。
   */
  public bgMagenta( data: any ): void{
    console.log( this.#myChalk.bgMagenta( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为青色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgCyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyan方法，可参见chalk模块的bgCyan方法的参数说明，必需。
   */
  public bgCyan( data: any ): void{
    console.log( this.#myChalk.bgCyan( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为白色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgWhite( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhite方法，可参见chalk模块的bgWhite方法的参数说明，必需。
   */
  public bgWhite( data: any ): void{
    console.log( this.#myChalk.bgWhite( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为灰色的文字（bgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGray方法，可参见chalk模块的bgGray方法的参数说明，必需。
   */
  public bgGray( data: any ): void{
    console.log( this.#myChalk.bgGray( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为灰色的文字（bgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGrey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGrey方法，可参见chalk模块的bgGrey方法的参数说明，必需。
   */
  public bgGrey( data: any ): void{
    console.log( this.#myChalk.bgGrey( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黑亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlackBright方法，可参见chalk模块的bgBlackBright方法的参数说明，必需。
   */
  public bgBlackBright( data: any ): void{
    console.log( this.#myChalk.bgBlackBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为红亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgRedBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRedBright方法，可参见chalk模块的bgRedBright方法的参数说明，必需。
   */
  public bgRedBright( data: any ): void{
    console.log( this.#myChalk.bgRedBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为绿亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGreenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreenBright方法，可参见chalk模块的bgGreenBright方法的参数说明，必需。
   */
  public bgGreenBright( data: any ): void{
    console.log( this.#myChalk.bgGreenBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黄亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgYellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellowBright方法，可参见chalk模块的bgYellowBright方法的参数说明，必需。
   */
  public bgYellowBright( data: any ): void{
    console.log( this.#myChalk.bgYellowBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为蓝亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlueBright方法，可参见chalk模块的bgBlueBright方法的参数说明，必需。
   */
  public bgBlueBright( data: any ): void{
    console.log( this.#myChalk.bgBlueBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为洋红亮的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgMagentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagentaBright方法，可参见chalk模块的bgMagentaBright方法的参数说明，必需。
   */
  public bgMagentaBright( data: any ): void{
    console.log( this.#myChalk.bgMagentaBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为青亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgCyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyanBright方法，可参见chalk模块的bgCyanBright方法的参数说明，必需。
   */
  public bgCyanBright( data: any ): void{
    console.log( this.#myChalk.bgCyanBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为白亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgWhiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhiteBright方法，可参见chalk模块的bgWhiteBright方法的参数说明，必需。
   */
  public bgWhiteBright( data: any ): void{
    console.log( this.#myChalk.bgWhiteBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黑色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgBlack( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlack方法，可参见chalk模块的bgBlack方法的参数说明，必需。
   */
  public static BgBlack( data: any ): void{
    console.log( this.#MyChalk.bgBlack( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为红色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgRed( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRed方法，可参见chalk模块的bgRed方法的参数说明，必需。
   */
  public static BgRed( data: any ): void{
    console.log( this.#MyChalk.bgRed( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为绿色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgGreen( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreen方法，可参见chalk模块的bgGreen方法的参数说明，必需。
   */
  public static BgGreen( data: any ): void{
    console.log( this.#MyChalk.bgGreen( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黄色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgYellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellow方法，可参见chalk模块的bgYellow方法的参数说明，必需。
   */
  public static BgYellow( data: any ): void{
    console.log( this.#MyChalk.bgYellow( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为蓝色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgBlue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlue方法，可参见chalk模块的bgBlue方法的参数说明，必需。
   */
  public static BgBlue( data: any ): void{
    console.log( this.#MyChalk.bgBlue( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为洋红色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgMagenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagenta方法，可参见chalk模块的bgMagenta方法的参数说明，必需。
   */
  public static BgMagenta( data: any ): void{
    console.log( this.#MyChalk.bgMagenta( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为青色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgCyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyan方法，可参见chalk模块的bgCyan方法的参数说明，必需。
   */
  public static BgCyan( data: any ): void{
    console.log( this.#MyChalk.bgCyan( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为白色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgWhite( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhite方法，可参见chalk模块的bgWhite方法的参数说明，必需。
   */
  public static BgWhite( data: any ): void{
    console.log( this.#MyChalk.bgWhite( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为灰色的文字（BgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgGray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGray方法，可参见chalk模块的bgGray方法的参数说明，必需。
   */
  public static BgGray( data: any ): void{
    console.log( this.#MyChalk.bgGray( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为灰色的文字（BgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgGrey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGrey方法，可参见chalk模块的bgGrey方法的参数说明，必需。
   */
  public static BgGrey( data: any ): void{
    console.log( this.#MyChalk.bgGrey( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黑亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgBlackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlackBright方法，可参见chalk模块的bgBlackBright方法的参数说明，必需。
   */
  public static BgBlackBright( data: any ): void{
    console.log( this.#MyChalk.bgBlackBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为红亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgRedBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRedBright方法，可参见chalk模块的bgRedBright方法的参数说明，必需。
   */
  public static BgRedBright( data: any ): void{
    console.log( this.#MyChalk.bgRedBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为绿亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgGreenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreenBright方法，可参见chalk模块的bgGreenBright方法的参数说明，必需。
   */
  public static BgGreenBright( data: any ): void{
    console.log( this.#MyChalk.bgGreenBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黄亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgYellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellowBright方法，可参见chalk模块的bgYellowBright方法的参数说明，必需。
   */
  public static BgYellowBright( data: any ): void{
    console.log( this.#MyChalk.bgYellowBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为蓝亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgBlueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlueBright方法，可参见chalk模块的bgBlueBright方法的参数说明，必需。
   */
  public static BgBlueBright( data: any ): void{
    console.log( this.#MyChalk.bgBlueBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为洋红亮的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgMagentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagentaBright方法，可参见chalk模块的bgMagentaBright方法的参数说明，必需。
   */
  public static BgMagentaBright( data: any ): void{
    console.log( this.#MyChalk.bgMagentaBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为青亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgCyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyanBright方法，可参见chalk模块的bgCyanBright方法的参数说明，必需。
   */
  public static BgCyanBright( data: any ): void{
    console.log( this.#MyChalk.bgCyanBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为白亮色的文字。<br />
   * 使用例子：<br />
   * ```ts
   * MyConsole.BgWhiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhiteBright方法，可参见chalk模块的bgWhiteBright方法的参数说明，必需。
   */
  public static BgWhiteBright( data: any ): void{
    console.log( this.#MyChalk.bgWhiteBright( data ) );
  }

  // 背景颜色 End

}

/**
 * 默认导出，部署了该工具库所有的导出函数、类等等。
 */
export default {
  // 支持泛型参数的单例工厂。Start
  SingletonFactory,
  // 支持泛型参数的单例工厂。End

  // 类型转换。Start
  StringToUint8Array,
  Uint8ArrayToString,
  // 类型转换。End

  // Date格式处理。Start
  DateFormatForObject,
  // Date格式处理。End

  // 判断数据类型。Start
  GetDataType,
  IsArray,
  IsNumber,
  IsString,
  // 判断数据类型。End

  // 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union以及IsDisjointFrom（是否不相交）、IsSubsetOf（是否是子集）、IsSupersetOf（是否是超集）。Start
  IsDisjointFrom,
  IsSubsetOf,
  IsSupersetOf,
  Difference,
  Intersection,
  SymmetricDifference,
  Union,
  // 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union以及IsDisjointFrom（是否不相交）、IsSubsetOf（是否是子集）、IsSupersetOf（是否是超集）。End

  /**
   * 自定义的Console类，用于在控制台输出带颜色、样式的文字，还集成了“chalk”模块（一个可以输出带颜色等样式的文本）的部分函数，这些都被作为静态方法挂载在这个自定义的Console类。<br />
   * PS：<br />
   * 1、“chalk”模块文档：<br />
   * https://deno.land/x/chalk_deno<br />
   *
   * 2、如果使用的是Windows 10 2004(build 19041)或更高版本的Windows OS，请使用系统自带的Windows终端（Windows Terminal）而不是cmd.exe，不然有些效果出不来。<br />
   *
   * 3、在Deno中要想能正常使用“chalk”得在启用命令中添加“--color=16m”（真彩色支持，1600 万色）标识，加在入口脚本的后面，如：<br />
   * deno run -A --watch --config=deno.json --lock=lock.json --lock-write --unstable --prompt --check --v8-flags=--max-old-space-size=8192 ./src/App.mts --color=16m <br />
   * 支持的标识还有：--color=256（256色支持）、--color（该标识表示默认启用控制台颜色）、--color=16m（真彩色支持，1600 万色）。<br />
   */
  MyConsole,
};
