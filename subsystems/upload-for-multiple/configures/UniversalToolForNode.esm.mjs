/**
 * Project: upload-for-multiple
 * FileDirPath: configures/UniversalToolForNode.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 该工具库是使用“JavaScript”编写的公共的、通用的、不特定于某个项目使用的脚本工具库。
 * 该通用工具仅用于Node环境，并且不是特定于某个项目才能使用的，使用“ECMAScript modules(ECMAScript模块)”写法。
 *
 *
 *
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
 * 6、编程范式使用“函数式编程”，结合“JavaScript”编写，这样更好得便于被Webpack等工具进行“Tree-shaking”，只打包那些被使用的。
 *
 * 7、那些用于限定、描述数据类型的类型声明也要记得导出，以便供外部使用，如：export type T_MyString001 = string。
 *
 *
 *
 * 关于“严格模式”的注意事项：
 * 1、'use strict'严格模式会在函数内部自动深度的传递严格模式的效果。
 * 如：
 * ```ts
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
 * ```
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
 * ```ts
 * 'use strict';
 *
 * function Fun1(){
 * 'use strict';
 *
 * console.dir( this );
 * }
 *
 * Fun1.call( { a: 1, } ); // 输出：{ a: 1, }，而不是undefined。
 * ```
 *
 *
 *
 * 该工具经过了如下优化(以后的代码添加、修改都应该尽量遵循如下的优化标准)：
 * PS：
 * 只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 1、函数尾调用优化；
 * 2、算法时间复杂度优化；
 * 3、算法空间复杂度优化；
 */

'use strict';

import {
  dirname,
} from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

import chalk from 'chalk';

// 内部使用的7788的处理函数。Start

/**
 * 一种字符串的相等比较（使用===比较），用于辅助判断数据类型。<br />
 * 大多是如下的比较：<br />
 * ```js
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
function HandleByEqualForString001( equalArg1, equalArg2 ){
  return GetDataType( equalArg1 ).slice( 8, -1 ) === equalArg2;
}

// 内部使用的7788的处理函数。End

// 模拟Node环境下“CommonJS”模块化中的“__filename”、“__dirname”。 Start

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
export function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
export function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

// 模拟Node环境下“CommonJS”模块化中的“__filename”、“__dirname”。 End

// 支持泛型参数的单例工厂。Start

/**
 * 支持泛型参数的单例工厂。
 *
 * @param {() => any} func 包装函数，当它被执行时，会返回期望中的单例对象，必需。
 *
 * @returns {() => { singleton: 其值就是上面的“包装函数”中所返回的那个期望的单例对象, clear: “clear”函数（支持清除后的回调函数操作），用于清除并置空已经生成的期望的单例对象 }} 返回一个生成单例的函数，执行它就会返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。<br />
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数描述），用于清除并置空已经生成的期望的单例对象。<br />
 */
export function SingletonFactory( func = () => {
} ){
  let singleton = null;

  /**
   * 一个生成单例的函数，执行它就会返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数的描述），用于清除并置空已经生成的期望的单例对象。<br />
   *
   * @returns {() => { singleton: 其值就是上面的“包装函数”中所返回的那个期望的单例对象, clear: “clear”函数（支持清除后的回调函数操作），用于清除并置空已经生成的期望的单例对象 }} 返回一个生成单例的函数，执行它就会返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数描述），用于清除并置空已经生成的期望的单例对象。<br />
   */
  return () => {
    if( singleton === null ){
      singleton = func();
    }

    return {
      /**
       * 已生成的期望的单例对象。
       */
      singleton,
      /**
       * 用于清除并置空已经生成的期望的单例对象，支持清除后的回调函数操作。
       *
       * @param {() => any} cb 完成清除并置空已经生成的期望的单例对象后，所要执行的回调函数，用于做一些在清除后的操作，可选。
       *
       * @returns {any|void} 如果传入了上面的“cb”参数，那么“cb”参数在执行后返回的值就是“clear”函数的返回值，如果没传入上面的“cb”参数，那就返回void。
       */
      clear( cb = () => {
      } ){
        singleton = null;

        if( cb && typeof cb === 'function' ){
          return cb();
        }
      },
    };
  };
}

/**
 * @internal
 *
 * @type {any}
 */
let singletonByGlobal = null;

/**
 * 支持泛型参数的“全局模式”的单例工厂。
 *
 * @param {() => any} func 包装函数，当它被执行时，会返回期望中的“全局模式”的单例对象，必需。
 *
 * @returns {() => { singletonByGlobal: 其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象, clear: “clear”函数（支持清除后的回调函数操作），用于清除并置空已经生成的期望的“全局模式”的单例对象 }} 返回一个生成“全局模式”的单例的函数，执行它就会返回一个对象，这个对象中有个“singletonByGlobal”属性，其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象。<br />
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数描述），用于清除并置空已经生成的期望的“全局模式”的单例对象。<br />
 */
export function SingletonFactoryByGlobal( func ){
  /**
   * 一个生成“全局模式”的单例的函数，执行它就会返回一个对象，这个对象中有个“singletonByGlobal”属性，其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“T_SingletonByGlobal>”），用于清除并置空已经生成的期望的“全局模式”的单例对象。<br />
   *
   * @returns {() => { singletonByGlobal: 其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象, clear: “clear”函数（支持清除后的回调函数操作），用于清除并置空已经生成的期望的“全局模式”的单例对象 }} 返回一个生成“全局模式”的单例的函数，执行它就会返回一个对象，这个对象中有个“singletonByGlobal”属性，其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数描述），用于清除并置空已经生成的期望的“全局模式”的单例对象。<br />
   */
  return () => {
    if( singletonByGlobal === null ){
      singletonByGlobal = func();
    }

    return {
      /**
       * 已生成的期望的“全局模式”的单例对象。
       */
      singletonByGlobal,
      /**
       * 用于清除并置空已经生成的期望的“全局模式”的单例对象，支持清除后的回调函数操作。
       *
       * @param {() => any} cb 完成清除并置空已经生成的期望的“全局模式”的单例对象后，所要执行的回调函数，用于做一些在清除后的操作，可选。
       *
       * @returns {any|void} 如果传入了上面的“cb”参数，那么“cb”参数在执行后返回的值就是“clear”函数的返回值，如果没传入上面的“cb”参数，那就返回void。
       */
      clear( cb = () => {
      } ){
        singletonByGlobal = null;

        if( cb && typeof cb === 'function' ){
          return cb();
        }
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
export function StringToUint8Array( data ){
  'use strict';

  return new TextEncoder().encode( data );
}

/**
 * 将“Uint8Array”类型的数据转换成“String”类型。
 *
 * @param {Uint8Array} data “Uint8Array”类型的数据，必需。
 *
 * @returns {string} 转换成“String”类型的数据。
 */
export function Uint8ArrayToString( data ){
  'use strict';

  return new TextDecoder().decode( data );
}

// 类型转换。End

// Date格式处理。Start

/**
 * 返回传入的“Date实例对象”的年、月、日、时、分、秒、周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。<br />
 *
 * @param {Date} dateInstance 一个“Date实例对象”，默认值（当前时间）：new Date( Date.now() )，可选。<br />
 *
 * @returns {{year: string, month: string, date: string, hours: string, minutes: string, seconds: string, day: string}} year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
export function DateFormatForObject( dateInstance = new Date( Date.now() ) ){
  const year = String( dateInstance.getFullYear() ),
    month = String( dateInstance.getMonth() + 1 ).padStart( 2, '0' ),
    date = String( dateInstance.getDate() ).padStart( 2, '0' ),
    hours = String( dateInstance.getHours() ).padStart( 2, '0' ),
    minutes = String( dateInstance.getMinutes() ).padStart( 2, '0' ),
    seconds = String( dateInstance.getSeconds() ).padStart( 2, '0' ),
    day001 = dateInstance.getDay(),
    day = String( day001 === 0
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
export function GetDataType( arg ){
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
export function IsArray( arg ){
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
export function IsNumber( arg ){
  return HandleByEqualForString001( arg, 'Number' ) && ( typeof arg === 'number' );
}

/**
 * 判断数据是否为String类型的原始值，String对象、String实例会返回false。<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {boolean} 是String原始值返回true，不是String原始值返回false。
 */
export function IsString( arg ){
  return HandleByEqualForString001( arg, 'String' ) && ( typeof arg === 'string' );
}

// 判断数据类型。End

// 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union以及IsDisjointFrom（是否不相交）、IsSubsetOf（是否是子集）、IsSupersetOf（是否是超集）。Start

/**
 * 数组A、数组B两者之间是否没有交集，true表示没有交集，反之表示有交集。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 *
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {boolean} 数组A、数组B两者之间是否没有交集，true表示没有交集，反之表示有交集。
 */
export function IsDisjointFrom( arrA = [], arrB = [] ){
  if( arrA.length === 0 || arrB.length === 0 ){
    return true;
  }

  return Intersection( arrA, arrB ).length === 0;
}

/**
 * 数组B是否是数组A的子集，true表示是，反之表示不是。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 *
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {boolean} 数组B是否是数组A的子集，true表示是，反之表示不是。
 */
export function IsSubsetOf( arrA = [], arrB = [] ){
  if( arrA.length === 0 || arrB.length === 0 ){
    return false;
  }

  return Intersection( arrA, arrB ).length === Array.from( new Set( arrB ) ).length;
}

/**
 * 数组B是否是数组A的超集，true表示是，反之表示不是。
 *
 * @param {Array<any>} arrA 数组A，默认值为空数组，可选。
 *
 * @param {Array<any>} arrB 数组B，默认值为空数组，可选。
 *
 * @returns {boolean} 数组B是否是数组A的超集，true表示是，反之表示不是。
 */
export function IsSupersetOf( arrA = [], arrB = [] ){
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
export function Difference( arrA = [], arrB = [] ){
  if( arrA.length === 0 ){
    return [];
  }

  if( arrB.length === 0 ){
    return arrA;
  }

  arrA = Array.from( new Set( arrA ) );
  arrB = Array.from( new Set( arrB ) );

  return arrA.filter( item => !arrB.includes( item ) );
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
export function Intersection( arrA = [], arrB = [] ){
  if( arrA.length !== 0 && arrB.length !== 0 ){
    arrA = Array.from( new Set( arrA ) );
    arrB = Array.from( new Set( arrB ) );

    const arr001 = arrA.length - arrB.length >= 0
                   ? arrB
                   : arrA,
      arr002 = arrA.length - arrB.length >= 0
               ? arrA
               : arrB;

    return arr001.filter( item => arr002.includes( item ) );
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
export function SymmetricDifference( arrA = [], arrB = [] ){
  arrA = Array.from( new Set( arrA ) );
  arrB = Array.from( new Set( arrB ) );

  const unionArr = Union( arrA, arrB ),
    intersectionArr = Intersection( arrA, arrB );

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
export function Union( arrA = [], arrB = [] ){
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
 */
export class MyConsole {

  /**
   * 私有实例属性。<br />
   *
   * @type {ChalkInstance}
   *
   * @private
   */
  #myChalk = chalk;

  /**
   * 私有静态属性。<br />
   *
   * @type {ChalkInstance}
   *
   * @private
   */
  static #MyChalk = chalk;

  /**
   * 自定义的Console类，用于在控制台输出带颜色、样式的文字，还集成了“chalk”模块（一个可以输出带颜色等样式的文本）的部分函数，这些都被作为静态方法挂载在这个自定义的Console类。<br />
   * PS：<br />
   * 1、“chalk”模块文档：<br />
   * https://deno.land/x/chalk_deno<br />
   *
   * 2、如果使用的是Windows 10 2004(build 19041)或更高版本的Windows OS，请使用系统自带的Windows终端（Windows Terminal）而不是cmd.exe，不然有些效果出不来。<br />
   *
   * @param {object} config 初始化字体颜色（color）、背景色（bgColor），可选。<br />
   *
   * @param {Array<number> | string | number | null} config.color 初始化字体颜色（color），值类型可以是：number[]（rgb值，如：[255, 136, 0]）、string（hex值，如：'#FF8800'）、number（ansi256值，如：194），默认值null，可选。<br />
   *
   * @param {Array<number> | string | number | null} config.bgColor 初始化背景色（bgColor），值类型可以是：number[]（rgb值，如：[255, 136, 0]）、string（hex值，如：'#FF8800'）、number（ansi256值，如：194），默认值null，可选。<br />
   */
  constructor( {
    color = null,
    bgColor = null,
  } = {
    color: null,
    bgColor: null,
  } ){
    if( IsArray( color ) ){
      this.#myChalk = this.#myChalk.rgb( ...color );
    }
    else if( IsString( color ) ){
      this.#myChalk = this.#myChalk.hex( color );
    }
    else if( IsNumber( color ) ){
      this.#myChalk = this.#myChalk.ansi256( color );
    }

    if( IsArray( bgColor ) ){
      this.#myChalk = this.#myChalk.bgRgb( ...bgColor );
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
  reset(){
    this.#myChalk.reset();

    this.#myChalk = chalk;
  }

  // 设置字体颜色 Start

  /**
   * 使用rgb值设置字体颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {number[]} rgbArr rgb值，如：[ 255, 136, 0 ]，必需。
   */
  setRGB( rgbArr ){
    if( IsArray( rgbArr ) ){
      this.#myChalk = this.#myChalk.rgb( ...rgbArr );
    }
  }

  /**
   * 使用hex值设置字体颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {string} hexStr hex值，如：'#FF8800'，必需。
   */
  setHEX( hexStr ){
    if( IsString( hexStr ) ){
      this.#myChalk = this.#myChalk.hex( hexStr );
    }
  }

  /**
   * 使用ansi256值设置字体颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {number} ansi256Num ansi256值，如：194，必需。
   */
  setANSI256( ansi256Num ){
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
  setBgRGB( rgbArr ){
    if( IsArray( rgbArr ) ){
      this.#myChalk = this.#myChalk.bgRgb( ...rgbArr );
    }
  }

  /**
   * 使用hex值设置背景颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {string} hexStr hex值，如：'#FF8800'，必需。
   */
  setBgHEX( hexStr ){
    if( IsString( hexStr ) ){
      this.#myChalk = this.#myChalk.bgHex( hexStr );
    }
  }

  /**
   * 使用ansi256值设置背景颜色，该方法也可以用于改变调用构造函数时设置的颜色。<br />
   *
   * @param {number} ansi256Num ansi256值，如：194，必需。
   */
  setBgANSI256( ansi256Num ){
    if( IsNumber( ansi256Num ) ){
      this.#myChalk = this.#myChalk.bgAnsi256( ansi256Num );
    }
  }

  // 设置背景颜色 End

  // 文字修饰 Start

  /**
   * 使用自定义的样式在控制台输出粗体文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bold( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bold方法，可参见chalk模块的bold方法的参数说明，必需。
   */
  bold( data ){
    console.log( this.#myChalk.bold( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出暗淡的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).dim( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的dim方法，可参见chalk模块的dim方法的参数说明，必需。
   */
  dim( data ){
    console.log( this.#myChalk.dim( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出斜体文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).italic( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的italic方法，可参见chalk模块的italic方法的参数说明，必需。
   */
  italic( data ){
    console.log( this.#myChalk.italic( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带下划线的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).underline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的underline方法，可参见chalk模块的underline方法的参数说明，必需。
   */
  underline( data ){
    console.log( this.#myChalk.underline( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带上划线的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).overline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的overline方法，可参见chalk模块的overline方法的参数说明，必需。
   */
  overline( data ){
    console.log( this.#myChalk.overline( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出反转背景色和前景色（也就是将背景色用作字体颜色，字体颜色用作背景色）的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).inverse( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的inverse方法，可参见chalk模块的inverse方法的参数说明，必需。
   */
  inverse( data ){
    console.log( this.#myChalk.inverse( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出但是隐藏文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).hidden( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的hidden方法，可参见chalk模块的hidden方法的参数说明，必需。
   */
  hidden( data ){
    console.log( this.#myChalk.hidden( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带删除线的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).strikethrough( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的strikethrough方法，可参见chalk模块的strikethrough方法的参数说明，必需。
   */
  strikethrough( data ){
    console.log( this.#myChalk.strikethrough( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出常规的可见文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).visible( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的visible方法，可参见chalk模块的visible方法的参数说明，必需。
   */
  visible( data ){
    console.log( this.#myChalk.visible( data ) );
  }

  /**
   * 使用默认样式在控制台输出粗体文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Bold( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bold方法，可参见chalk模块的bold方法的参数说明，必需。
   */
  static Bold( data ){
    console.log( this.#MyChalk.bold( data ) );
  }

  /**
   * 使用默认样式在控制台输出暗淡的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Dim( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的dim方法，可参见chalk模块的dim方法的参数说明，必需。
   */
  static Dim( data ){
    console.log( this.#MyChalk.dim( data ) );
  }

  /**
   * 使用默认样式在控制台输出斜体文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Italic( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的italic方法，可参见chalk模块的italic方法的参数说明，必需。
   */
  static Italic( data ){
    console.log( this.#MyChalk.italic( data ) );
  }

  /**
   * 使用默认样式在控制台输出带下划线的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Underline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的underline方法，可参见chalk模块的underline方法的参数说明，必需。
   */
  static Underline( data ){
    console.log( this.#MyChalk.underline( data ) );
  }

  /**
   * 使用默认样式在控制台输出带上划线的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Overline( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的overline方法，可参见chalk模块的overline方法的参数说明，必需。
   */
  static Overline( data ){
    console.log( this.#MyChalk.overline( data ) );
  }

  /**
   * 使用默认样式在控制台输出反转背景色和前景色（也就是将背景色用作字体颜色，字体颜色用作背景色）的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Inverse( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的inverse方法，可参见chalk模块的inverse方法的参数说明，必需。
   */
  static Inverse( data ){
    console.log( this.#MyChalk.inverse( data ) );
  }

  /**
   * 使用默认样式在控制台输出但是隐藏文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Hidden( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的hidden方法，可参见chalk模块的hidden方法的参数说明，必需。
   */
  static Hidden( data ){
    console.log( this.#MyChalk.hidden( data ) );
  }

  /**
   * 使用默认样式在控制台输出带删除线的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Strikethrough( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的strikethrough方法，可参见chalk模块的strikethrough方法的参数说明，必需。
   */
  static Strikethrough( data ){
    console.log( this.#MyChalk.strikethrough( data ) );
  }

  /**
   * 使用默认样式在控制台输出常规的可见文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Visible( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的visible方法，可参见chalk模块的visible方法的参数说明，必需。
   */
  static Visible( data ){
    console.log( this.#MyChalk.visible( data ) );
  }

  // 文字修饰 End

  // 文字颜色 Start

  /**
   * 使用自定义的样式在控制台输出黑色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).black( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的black方法，可参见chalk模块的black方法的参数说明，必需。
   */
  black( data ){
    console.log( this.#myChalk.black( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出红色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).red( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的red方法，可参见chalk模块的red方法的参数说明，必需。
   */
  red( data ){
    console.log( this.#myChalk.red( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出绿色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).green( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的green方法，可参见chalk模块的green方法的参数说明，必需。
   */
  green( data ){
    console.log( this.#myChalk.green( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黄色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).yellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellow方法，可参见chalk模块的yellow方法的参数说明，必需。
   */
  yellow( data ){
    console.log( this.#myChalk.yellow( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出蓝色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).blue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blue方法，可参见chalk模块的blue方法的参数说明，必需。
   */
  blue( data ){
    console.log( this.#myChalk.blue( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出洋红色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).magenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magenta方法，可参见chalk模块的magenta方法的参数说明，必需。
   */
  magenta( data ){
    console.log( this.#myChalk.magenta( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出青色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).cyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyan方法，可参见chalk模块的cyan方法的参数说明，必需。
   */
  cyan( data ){
    console.log( this.#myChalk.cyan( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出白色文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).white( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的white方法，可参见chalk模块的white方法的参数说明，必需。
   */
  white( data ){
    console.log( this.#myChalk.white( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出灰色文字（blackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).gray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的gray方法，可参见chalk模块的gray方法的参数说明，必需。
   */
  gray( data ){
    console.log( this.#myChalk.gray( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出灰色文字（blackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).grey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的grey方法，可参见chalk模块的grey方法的参数说明，必需。
   */
  grey( data ){
    console.log( this.#myChalk.grey( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黑亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).blackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blackBright方法，可参见chalk模块的blackBright方法的参数说明，必需。
   */
  blackBright( data ){
    console.log( this.#myChalk.blackBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出红亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).redBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的redBright方法，可参见chalk模块的redBright方法的参数说明，必需。
   */
  redBright( data ){
    console.log( this.#myChalk.redBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出绿亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).greenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的greenBright方法，可参见chalk模块的greenBright方法的参数说明，必需。
   */
  greenBright( data ){
    console.log( this.#myChalk.greenBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黄亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).yellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellowBright方法，可参见chalk模块的yellowBright方法的参数说明，必需。
   */
  yellowBright( data ){
    console.log( this.#myChalk.yellowBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出蓝亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).blueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blueBright方法，可参见chalk模块的blueBright方法的参数说明，必需。
   */
  blueBright( data ){
    console.log( this.#myChalk.blueBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出洋红亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).magentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magentaBright方法，可参见chalk模块的magentaBright方法的参数说明，必需。
   */
  magentaBright( data ){
    console.log( this.#myChalk.magentaBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出青亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).cyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyanBright方法，可参见chalk模块的cyanBright方法的参数说明，必需。
   */
  cyanBright( data ){
    console.log( this.#myChalk.cyanBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出白亮文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).whiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的whiteBright方法，可参见chalk模块的whiteBright方法的参数说明，必需。
   */
  whiteBright( data ){
    console.log( this.#myChalk.whiteBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出黑色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Black( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的black方法，可参见chalk模块的black方法的参数说明，必需。
   */
  static Black( data ){
    console.log( this.#MyChalk.black( data ) );
  }

  /**
   * 使用默认样式在控制台输出红色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Red( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的red方法，可参见chalk模块的red方法的参数说明，必需。
   */
  static Red( data ){
    console.log( this.#MyChalk.red( data ) );
  }

  /**
   * 使用默认样式在控制台输出绿色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Green( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的green方法，可参见chalk模块的green方法的参数说明，必需。
   */
  static Green( data ){
    console.log( this.#MyChalk.green( data ) );
  }

  /**
   * 使用默认样式在控制台输出黄色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Yellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellow方法，可参见chalk模块的yellow方法的参数说明，必需。
   */
  static Yellow( data ){
    console.log( this.#MyChalk.yellow( data ) );
  }

  /**
   * 使用默认样式在控制台输出蓝色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Blue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blue方法，可参见chalk模块的blue方法的参数说明，必需。
   */
  static Blue( data ){
    console.log( this.#MyChalk.blue( data ) );
  }

  /**
   * 使用默认样式在控制台输出洋红色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Magenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magenta方法，可参见chalk模块的magenta方法的参数说明，必需。
   */
  static Magenta( data ){
    console.log( this.#MyChalk.magenta( data ) );
  }

  /**
   * 使用默认样式在控制台输出青色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Cyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyan方法，可参见chalk模块的cyan方法的参数说明，必需。
   */
  static Cyan( data ){
    console.log( this.#MyChalk.cyan( data ) );
  }

  /**
   * 使用默认样式在控制台输出白色文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.White( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的white方法，可参见chalk模块的white方法的参数说明，必需。
   */
  static White( data ){
    console.log( this.#MyChalk.white( data ) );
  }

  /**
   * 使用默认样式在控制台输出灰色文字（BlackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Gray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的gray方法，可参见chalk模块的gray方法的参数说明，必需。
   */
  static Gray( data ){
    console.log( this.#MyChalk.gray( data ) );
  }

  /**
   * 使用默认样式在控制台输出灰色文字（BlackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.Grey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的grey方法，可参见chalk模块的grey方法的参数说明，必需。
   */
  static Grey( data ){
    console.log( this.#MyChalk.grey( data ) );
  }

  /**
   * 使用默认样式在控制台输出黑亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BlackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blackBright方法，可参见chalk模块的blackBright方法的参数说明，必需。
   */
  static BlackBright( data ){
    console.log( this.#MyChalk.blackBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出红亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.RedBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的redBright方法，可参见chalk模块的redBright方法的参数说明，必需。
   */
  static RedBright( data ){
    console.log( this.#MyChalk.redBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出绿亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.GreenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的greenBright方法，可参见chalk模块的greenBright方法的参数说明，必需。
   */
  static GreenBright( data ){
    console.log( this.#MyChalk.greenBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出黄亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.YellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的yellowBright方法，可参见chalk模块的yellowBright方法的参数说明，必需。
   */
  static YellowBright( data ){
    console.log( this.#MyChalk.yellowBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出蓝亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BlueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的blueBright方法，可参见chalk模块的blueBright方法的参数说明，必需。
   */
  static BlueBright( data ){
    console.log( this.#MyChalk.blueBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出洋红亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.MagentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的magentaBright方法，可参见chalk模块的magentaBright方法的参数说明，必需。
   */
  static MagentaBright( data ){
    console.log( this.#MyChalk.magentaBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出青亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.CyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的cyanBright方法，可参见chalk模块的cyanBright方法的参数说明，必需。
   */
  static CyanBright( data ){
    console.log( this.#MyChalk.cyanBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出白亮文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.WhiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的whiteBright方法，可参见chalk模块的whiteBright方法的参数说明，必需。
   */
  static WhiteBright( data ){
    console.log( this.#MyChalk.whiteBright( data ) );
  }

  // 文字颜色 End

  // 背景颜色 Start

  /**
   * 使用自定义的样式在控制台输出背景为黑色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlack( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlack方法，可参见chalk模块的bgBlack方法的参数说明，必需。
   */
  bgBlack( data ){
    console.log( this.#myChalk.bgBlack( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为红色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgRed( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRed方法，可参见chalk模块的bgRed方法的参数说明，必需。
   */
  bgRed( data ){
    console.log( this.#myChalk.bgRed( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为绿色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGreen( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreen方法，可参见chalk模块的bgGreen方法的参数说明，必需。
   */
  bgGreen( data ){
    console.log( this.#myChalk.bgGreen( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黄色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgYellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellow方法，可参见chalk模块的bgYellow方法的参数说明，必需。
   */
  bgYellow( data ){
    console.log( this.#myChalk.bgYellow( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为蓝色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlue方法，可参见chalk模块的bgBlue方法的参数说明，必需。
   */
  bgBlue( data ){
    console.log( this.#myChalk.bgBlue( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为洋红色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgMagenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagenta方法，可参见chalk模块的bgMagenta方法的参数说明，必需。
   */
  bgMagenta( data ){
    console.log( this.#myChalk.bgMagenta( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为青色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgCyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyan方法，可参见chalk模块的bgCyan方法的参数说明，必需。
   */
  bgCyan( data ){
    console.log( this.#myChalk.bgCyan( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为白色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgWhite( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhite方法，可参见chalk模块的bgWhite方法的参数说明，必需。
   */
  bgWhite( data ){
    console.log( this.#myChalk.bgWhite( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为灰色的文字（bgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGray方法，可参见chalk模块的bgGray方法的参数说明，必需。
   */
  bgGray( data ){
    console.log( this.#myChalk.bgGray( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为灰色的文字（bgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGrey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGrey方法，可参见chalk模块的bgGrey方法的参数说明，必需。
   */
  bgGrey( data ){
    console.log( this.#myChalk.bgGrey( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黑亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlackBright方法，可参见chalk模块的bgBlackBright方法的参数说明，必需。
   */
  bgBlackBright( data ){
    console.log( this.#myChalk.bgBlackBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为红亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgRedBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRedBright方法，可参见chalk模块的bgRedBright方法的参数说明，必需。
   */
  bgRedBright( data ){
    console.log( this.#myChalk.bgRedBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为绿亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgGreenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreenBright方法，可参见chalk模块的bgGreenBright方法的参数说明，必需。
   */
  bgGreenBright( data ){
    console.log( this.#myChalk.bgGreenBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黄亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgYellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellowBright方法，可参见chalk模块的bgYellowBright方法的参数说明，必需。
   */
  bgYellowBright( data ){
    console.log( this.#myChalk.bgYellowBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为蓝亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlueBright方法，可参见chalk模块的bgBlueBright方法的参数说明，必需。
   */
  bgBlueBright( data ){
    console.log( this.#myChalk.bgBlueBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为洋红亮的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgMagentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagentaBright方法，可参见chalk模块的bgMagentaBright方法的参数说明，必需。
   */
  bgMagentaBright( data ){
    console.log( this.#myChalk.bgMagentaBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为青亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgCyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyanBright方法，可参见chalk模块的bgCyanBright方法的参数说明，必需。
   */
  bgCyanBright( data ){
    console.log( this.#myChalk.bgCyanBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为白亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * new MyConsole( { color: [ 255, 136, 0 ], } ).bgWhiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhiteBright方法，可参见chalk模块的bgWhiteBright方法的参数说明，必需。
   */
  bgWhiteBright( data ){
    console.log( this.#myChalk.bgWhiteBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黑色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgBlack( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlack方法，可参见chalk模块的bgBlack方法的参数说明，必需。
   */
  static BgBlack( data ){
    console.log( this.#MyChalk.bgBlack( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为红色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgRed( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRed方法，可参见chalk模块的bgRed方法的参数说明，必需。
   */
  static BgRed( data ){
    console.log( this.#MyChalk.bgRed( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为绿色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgGreen( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreen方法，可参见chalk模块的bgGreen方法的参数说明，必需。
   */
  static BgGreen( data ){
    console.log( this.#MyChalk.bgGreen( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黄色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgYellow( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellow方法，可参见chalk模块的bgYellow方法的参数说明，必需。
   */
  static BgYellow( data ){
    console.log( this.#MyChalk.bgYellow( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为蓝色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgBlue( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlue方法，可参见chalk模块的bgBlue方法的参数说明，必需。
   */
  static BgBlue( data ){
    console.log( this.#MyChalk.bgBlue( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为洋红色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgMagenta( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagenta方法，可参见chalk模块的bgMagenta方法的参数说明，必需。
   */
  static BgMagenta( data ){
    console.log( this.#MyChalk.bgMagenta( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为青色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgCyan( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyan方法，可参见chalk模块的bgCyan方法的参数说明，必需。
   */
  static BgCyan( data ){
    console.log( this.#MyChalk.bgCyan( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为白色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgWhite( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhite方法，可参见chalk模块的bgWhite方法的参数说明，必需。
   */
  static BgWhite( data ){
    console.log( this.#MyChalk.bgWhite( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为灰色的文字（BgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgGray( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGray方法，可参见chalk模块的bgGray方法的参数说明，必需。
   */
  static BgGray( data ){
    console.log( this.#MyChalk.bgGray( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为灰色的文字（BgBlackBright的别名）。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgGrey( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGrey方法，可参见chalk模块的bgGrey方法的参数说明，必需。
   */
  static BgGrey( data ){
    console.log( this.#MyChalk.bgGrey( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黑亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgBlackBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlackBright方法，可参见chalk模块的bgBlackBright方法的参数说明，必需。
   */
  static BgBlackBright( data ){
    console.log( this.#MyChalk.bgBlackBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为红亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgRedBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgRedBright方法，可参见chalk模块的bgRedBright方法的参数说明，必需。
   */
  static BgRedBright( data ){
    console.log( this.#MyChalk.bgRedBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为绿亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgGreenBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgGreenBright方法，可参见chalk模块的bgGreenBright方法的参数说明，必需。
   */
  static BgGreenBright( data ){
    console.log( this.#MyChalk.bgGreenBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黄亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgYellowBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgYellowBright方法，可参见chalk模块的bgYellowBright方法的参数说明，必需。
   */
  static BgYellowBright( data ){
    console.log( this.#MyChalk.bgYellowBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为蓝亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgBlueBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgBlueBright方法，可参见chalk模块的bgBlueBright方法的参数说明，必需。
   */
  static BgBlueBright( data ){
    console.log( this.#MyChalk.bgBlueBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为洋红亮的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgMagentaBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgMagentaBright方法，可参见chalk模块的bgMagentaBright方法的参数说明，必需。
   */
  static BgMagentaBright( data ){
    console.log( this.#MyChalk.bgMagentaBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为青亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgCyanBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgCyanBright方法，可参见chalk模块的bgCyanBright方法的参数说明，必需。
   */
  static BgCyanBright( data ){
    console.log( this.#MyChalk.bgCyanBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为白亮色的文字。<br />
   * 使用例子：<br />
   * ```js
   * MyConsole.BgWhiteBright( 'XXX' );
   * ```
   *
   * @param {any} data data参数传给chalk模块的bgWhiteBright方法，可参见chalk模块的bgWhiteBright方法的参数说明，必需。
   */
  static BgWhiteBright( data ){
    console.log( this.#MyChalk.bgWhiteBright( data ) );
  }

  // 背景颜色 End

}

// 事件的发布、订阅的工具类 Start

/**
 * 事件的发布、订阅的工具类。
 */
export class Events4PublishSubscribe {

  /**
   * 用于存储事件(模拟队列)的对象。
   *
   * @type {Record<string, Array<T_PublishFun>>}
   *
   * @private
   */
  #events4Queue = {};

  /**
   * 用于事件发布的初始化。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @private
   */
  #init( type ){
    !this.#events4Queue[ type ] && ( this.#events4Queue[ type ] = [] );
  }

  /**
   * 事件的发布、订阅的工具类的构造函数。
   */
  constructor(){
  }

  /**
   * 根据指定的事件名发布指定的事件逻辑。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @param {T_PublishFun} fn 函数，要执行的事件逻辑，可选的。
   *
   * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用。
   */
  on( type, fn = () => {
  } ){
    this.#init( type );

    this.#events4Queue[ type ].push( fn );

    return this;
  }

  /**
   * 根据指定的事件名发布一个只执行一次的指定的事件逻辑。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @param {T_PublishFun} fn 函数，要执行的事件逻辑，可选的。
   *
   * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用。
   */
  once( type, fn = () => {
  } ){
    this.#init( type );

    let _this = this;

    this.#events4Queue[ type ].push( function once( ...args ){
      fn( ...args );

      _this.off( type, once );
    } );

    return this;
  }

  /**
   * 根据指定的事件名订阅（也就是“执行”）其拥有的所有事件函数。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @param params rest参数列表，一个个参数都是传给即将被调用的事件函数，可选的。
   *
   * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用。
   */
  emit( type, ...params ){
    this.#events4Queue[ type ] && ( this.#events4Queue[ type ].forEach( ( fn ) => {
      fn( ...params );
    } ) );

    return this;
  }

  /**
   * 根据指定的事件名注销其拥有的所有事件函数中指定的那个事件函数。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @param {T_PublishFun} fn 函数，就是当初发布事件时用的那个存着发布事件函数的那个函数变量名，必须的。
   *
   * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用。
   */
  off( type, fn ){
    this.#events4Queue[ type ] && ( this.#events4Queue[ type ] = this.#events4Queue[ type ].filter( ( cb ) => fn !== cb ) );

    return this;
  }

  /**
   * 清除所有的事件队列。
   *
   * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用。
   */
  clearAllEventsQueue(){
    this.#events4Queue = {};

    return this;
  }

  /**
   * 根据指定的事件名清除其拥有的所有事件函数，并且也会删除这个事件名。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用。
   */
  delEventQueue4Type( type ){
    this.#events4Queue[ type ] && ( delete this.#events4Queue[ type ] );

    return this;
  }

  /**
   * 获取所有的事件队列。
   *
   * @returns {Record<string, Array<T_PublishFun>>} 所有的事件队列。
   */
  getAllEventsQueue(){
    return this.#events4Queue;
  }

  /**
   * 根据指定的事件名获取其拥有的所有事件函数，若不存在指定的事件名，就会返回undefined。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @returns {Array<T_PublishFun> | undefined} 根据指定的事件名获取其拥有的所有事件函数，若不存在指定的事件名，就会返回undefined。
   */
  getEventQueue4Type( type ){
    return this.#events4Queue[ type ];
  }

  /**
   * 根据指定的事件名判断事件队列中是否已经存在了指定的事件名。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @returns {boolean} 若存在则返回true，反之，返回false。
   */
  hasEventQueue4Type( type ){
    return Boolean( this.#events4Queue[ type ] );
  }

}

// 事件的发布、订阅的工具类 End

/**
 * 默认导出，部署了该工具库所有的导出函数、类等等。
 */
export default {
  // 模拟Node环境下“CommonJS”模块化中的“__filename”、“__dirname”。 Start
  Get__dirname,
  Get__filename,
  // 模拟Node环境下“CommonJS”模块化中的“__filename”、“__dirname”。 End

  // 支持泛型参数的单例工厂。Start
  SingletonFactory,
  SingletonFactoryByGlobal,
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

  MyConsole,

  // 事件的发布、订阅的工具类 Start
  Events4PublishSubscribe,
  // 事件的发布、订阅的工具类 End
};
