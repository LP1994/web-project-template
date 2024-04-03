/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/UniversalTools.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-27 19:58:50 星期日
 */

/**
 * 该工具库是使用“TypeScript”编写的公共的、通用的、不特定于某个项目使用的脚本工具库。
 * 其支持在浏览器（需要转码成JavaScript）、Node、Deno等多种支持TypeScript的宿主环境中使用，并且不是特定于某个项目才能使用的，使用“ECMAScript modules(ECMAScript模块)”写法。
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
 * 7、那些用于限定、描述数据类型的类型声明也要记得导出，以便供外部使用，如：export type T_MyString001 = string。
 */

/**
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
 */

'use strict';

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
 * 表示一个对象类型，这个对象中有个“singleton”属性，其值是“包装函数”中所返回的期望的单例对象。<br />
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数的描述），用于清除并置空已经生成的期望的单例对象。<br />
 */
export type T_Singleton<T> = {
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

/**
 * 支持泛型参数的单例工厂。
 *
 * @param {() => T} func 包装函数，当它被执行时，会返回期望中的单例对象，必需。
 *
 * @returns {() => T_Singleton<T>} 返回一个生成单例的函数，执行它就会返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。<br />
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“T_Singleton<T>”），用于清除并置空已经生成的期望的单例对象。
 */
export function SingletonFactory<T>( func: () => T ): () => T_Singleton<T>{
  let singleton: T | null = null;

  /**
   * 一个生成单例的函数，执行它就会返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“T_Singleton<T>”），用于清除并置空已经生成的期望的单例对象。<br />
   *
   * @returns {() => T_Singleton<T>} 返回一个对象，这个对象中有个“singleton”属性，其值就是上面的“包装函数”中所返回的那个期望的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“T_Singleton<T>”），用于清除并置空已经生成的期望的单例对象。
   */
  return (): T_Singleton<T> => {
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

/**
 * 表示一个对象类型，这个对象中有个“singletonByGlobal”属性，其值是“包装函数”中所返回的期望的“全局模式”的单例对象。<br />
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见下面的“clear”函数的描述），用于清除并置空已经生成的期望的“全局模式”的单例对象。<br />
 */
export type T_SingletonByGlobal<T> = {
  /**
   * 已生成的期望的“全局模式”的单例对象。
   */
  singletonByGlobal: T;

  /**
   * 用于清除并置空已经生成的期望的“全局模式”的单例对象，支持清除后的回调函数操作。
   *
   * @param {() => unknown} cb 完成清除并置空已经生成的期望的“全局模式”的单例对象后，所要执行的回调函数，用于做一些在清除后的操作，可选。
   *
   * @returns {unknown|void} 如果传入了上面的“cb”参数，那么“cb”参数在执行后返回的值就是“clear”函数的返回值，如果没传入上面的“cb”参数，那就返回void。
   */
  clear: ( cb?: () => unknown ) => unknown | void;
};

/**
 * @internal
 *
 * @type {unknown}
 */
let singletonByGlobal: unknown = null;

/**
 * 支持泛型参数的“全局模式”的单例工厂。
 *
 * @param {() => T} func 包装函数，当它被执行时，会返回期望中的“全局模式”的单例对象，必需。
 *
 * @returns {() => T_SingletonByGlobal<T>} 返回一个生成“全局模式”的单例的函数，执行它就会返回一个对象，这个对象中有个“singletonByGlobal”属性，其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象。<br />
 * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“T_SingletonByGlobal<T>”），用于清除并置空已经生成的期望的“全局模式”的单例对象。
 */
export function SingletonFactoryByGlobal<T>( func: () => T ): () => T_SingletonByGlobal<T>{
  /**
   * 一个生成“全局模式”的单例的函数，执行它就会返回一个对象，这个对象中有个“singletonByGlobal”属性，其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“T_SingletonByGlobal<T>”），用于清除并置空已经生成的期望的“全局模式”的单例对象。<br />
   *
   * @returns {() => T_SingletonByGlobal<T>} 返回一个对象，这个对象中有个“singletonByGlobal”属性，其值就是上面的“包装函数”中所返回的那个期望的“全局模式”的单例对象。<br />
   * 返回的对象里还有一个“clear”函数（支持清除后的回调函数操作，详细见上面的泛型别名“T_SingletonByGlobal<T>”），用于清除并置空已经生成的期望的“全局模式”的单例对象。
   */
  return (): T_SingletonByGlobal<T> => {
    if( singletonByGlobal === null ){
      singletonByGlobal = func() as T;
    }

    return {
      /**
       * 已生成的期望的“全局模式”的单例对象。
       */
      singletonByGlobal: singletonByGlobal as T,
      /**
       * 用于清除并置空已经生成的期望的“全局模式”的单例对象，支持清除后的回调函数操作。
       *
       * @param {() => unknown} cb 完成清除并置空已经生成的期望的“全局模式”的单例对象后，所要执行的回调函数，用于做一些在清除后的操作，可选。
       *
       * @returns {unknown|void} 如果传入了上面的“cb”参数，那么“cb”参数在执行后返回的值就是“clear”函数的返回值，如果没传入上面的“cb”参数，那就返回void。
       */
      clear( cb?: () => unknown ): unknown | void{
        singletonByGlobal = null;

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
 * 自定义的类型别名T_DateFormatForObject，表示一个对象：<br />
 * year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
export type T_DateFormatForObject = {
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
 * 返回传入的“Date实例对象”的年、月、日、时、分、秒、周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。<br />
 *
 * @param {Date} dateInstance 一个“Date实例对象”，默认值（当前时间）：new Date( Date.now() )，可选。<br />
 *
 * @returns {T_DateFormatForObject} year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
export function DateFormatForObject( dateInstance: Date = new Date( Date.now() ) ): T_DateFormatForObject{
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
 *
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
 *
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
 *
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

// 请求并发控制器（对于HTTP/2、HTTP/3而言，限制请求的并发数没什么实际效用了！） Start

export type T_ArrayPromiseAny = Array<Promise<any>>;

export type T_CurrentlyExecutingByGlobal = Record<string, T_ArrayPromiseAny>;

export type T_RequestItem = [ string, () => Promise<any> ];

/**
 * 数组，其成员都是一个2元的元组。<br />
 * 1、第1个元的值类型是一个字符串，表示请求的URL的origin这一部分，必须。<br />
 * PS：<br />
 * 1)如果是同源的请求，传个空字符串即可，内部会自动提取origin。<br />
 * 2)非同源的请求，传其url的origin这一部分即可。<br /><br />
 *
 * 2、第2个元的值类型是一个函数，必须，返回值类型必须是：Promise<服务器返回的数据体>。<br />
 * 如：
 * () => fetch( 'https://127.0.0.1:9200/graphql' ) <br />
 * () => fetch( 'https://127.0.0.1:9200/graphql' ).then( result => result.json() ) <br />
 * () => { 也可以是用Promise包装起来的其他请求逻辑，只要最后返回的值类型是"Promise<服务器返回的数据体>"这样的即可。 }
 */
export type T_ArrayRequestItem = Array<T_RequestItem>;

/**
 * requestConcurrentQuantityByGlobal：当前的请求并发数。<br />
 * 注意：谷歌、火狐浏览器对同源下的请求并发数量的限制都是6个。<br />
 * PS：<br />
 * 1、至于其他浏览器在数量上可能不为6个，可自行查找。<br />
 * 2、跨域时，“OPTIONS请求”也是占用浏览器的并发数的！<br />
 * 在浏览器中，当出现“跨域请求”时，会先出现“OPTIONS请求”进行“预检”，那么哪些请求会触发“预检”呢？<br />
 * 出现“非简单请求”时，就会触发“预检”操作！<br /><br />
 *
 * 同时满足以下所有条件，就属于“简单请求”：<br />
 * 1)请求方法是以下3种方法之一：<br />
 * HEAD、GET、POST<br />
 * 2)只有以下请求header字段允许被修改或被设置，否则必然触发预检：<br />
 * Accept、Accept-Language、Content-language、DPR、Downlink、Save-Data、Viewport-Width、Width、Last-Event-ID、<br />
 * Content-Type：只限于3个值application/x-www-form-urlencoded、multipart/form-data、text/plain。<br />
 * 3)XMLHttpRequestUpload在请求中使用的任何对象上都没有注册事件侦听器，详细见：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload。<br />
 * PS：<br />
 * 将事件监听器附加到此对象会使请求无法成为 "简单请求"，如果是跨源请求，则会导致发出预检请求；请参阅 CORS。因此，需要在调用 send() 之前注册事件监听器，否则上传事件不会被分派。<br />
 * 4)ReadableStream请求中未使用任何对象，应该是指 Fetch API 中的 Request 中的 Body，尚未验证。<br /><br />
 *
 * 满足以下任意1个条件，就属于“非简单请求”：<br />
 * 1)PUT、PATCH等请求方法必然会触发预检。<br />
 * 2)请求头中Content-Type的值不是这3个值：application/x-www-form-urlencoded、multipart/form-data、text/plain。<br />
 * 也就是说，如果请求的Content-Type被设置为如：application/json;charset=utf-8 时也必然会触发预检。<br />
 * 3)添加任何额外的自定义的请求header都会触发预检。<br />
 * 4)XMLHttpRequestUpload在请求中使用的任何对象上有注册事件侦听器，也会触发预检，详细见：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload。<br />
 * PS：<br />
 * 将事件监听器附加到此对象会使请求无法成为 "简单请求"，如果是跨源请求，则会导致发出预检请求；请参阅 CORS。因此，需要在调用 send() 之前注册事件监听器，否则上传事件不会被分派。<br /><br />
 *
 * requestConcurrentToolByGlobal：实际用于全局的请求并发控制器函数工具。<br />
 * 1、该函数有1个函数参数，其值类型见：T_ArrayRequestItem。<br />
 * 2、返回值是被Promise包裹起来的，也就是Promise.allSettled()的返回值，返回值结构详细见：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#return_value。
 */
export type T_RequestConcurrentControllerByGlobal = {
  requestConcurrentQuantityByGlobal: number;
  requestConcurrentToolByGlobal: ( requestArray: T_ArrayRequestItem ) => Promise<any>;
};

/**
 * 当前的请求并发数，默认值为6。<br />
 * 谷歌、火狐浏览器对同源下的请求并发数量的限制都是6个。<br />
 * PS：<br />
 * 1、至于其他浏览器在数量上可能不为6个，可自行查找。<br />
 * 2、跨域时，“OPTIONS请求”也是占用浏览器的并发数的！<br />
 * 在浏览器中，当出现“跨域请求”时，会先出现“OPTIONS请求”进行“预检”，那么哪些请求会触发“预检”呢？<br />
 * 出现“非简单请求”时，就会触发“预检”操作！<br /><br />
 *
 * 同时满足以下所有条件，就属于“简单请求”：<br />
 * 1)请求方法是以下3种方法之一：<br />
 * HEAD、GET、POST<br />
 * 2)只有以下请求header字段允许被修改或被设置，否则必然触发预检：<br />
 * Accept、Accept-Language、Content-language、DPR、Downlink、Save-Data、Viewport-Width、Width、Last-Event-ID、<br />
 * Content-Type：只限于3个值application/x-www-form-urlencoded、multipart/form-data、text/plain。<br />
 * 3)XMLHttpRequestUpload在请求中使用的任何对象上都没有注册事件侦听器，详细见：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload。<br />
 * PS：<br />
 * 将事件监听器附加到此对象会使请求无法成为 "简单请求"，如果是跨源请求，则会导致发出预检请求；请参阅 CORS。因此，需要在调用 send() 之前注册事件监听器，否则上传事件不会被分派。<br />
 * 4)ReadableStream请求中未使用任何对象，应该是指 Fetch API 中的 Request 中的 Body，尚未验证。<br /><br />
 *
 * 满足以下任意1个条件，就属于“非简单请求”：<br />
 * 1)PUT、PATCH等请求方法必然会触发预检。<br />
 * 2)请求头中Content-Type的值不是这3个值：application/x-www-form-urlencoded、multipart/form-data、text/plain。<br />
 * 也就是说，如果请求的Content-Type被设置为如：application/json;charset=utf-8 时也必然会触发预检。<br />
 * 3)添加任何额外的自定义的请求header都会触发预检。<br />
 * 4)XMLHttpRequestUpload在请求中使用的任何对象上有注册事件侦听器，也会触发预检，详细见：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload。<br />
 * PS：<br />
 * 将事件监听器附加到此对象会使请求无法成为 "简单请求"，如果是跨源请求，则会导致发出预检请求；请参阅 CORS。因此，需要在调用 send() 之前注册事件监听器，否则上传事件不会被分派。<br />
 *
 * @internal
 *
 * @type {number}
 */
let requestConcurrentQuantityByGlobal: number = 6;

/**
 * @internal
 *
 * @type {T_CurrentlyExecutingByGlobal}
 */
const currentlyExecutingByGlobal: T_CurrentlyExecutingByGlobal = {};

/**
 * @internal
 *
 * @type {Record<string, Promise<any>>}
 */
let currentlyResolvePromiseByGlobal: Record<string, Promise<any>> = {};

/**
 * 从请求的URL提取其最终指向的origin。<br />
 * 例如：<br />
 * 当前域：https://localhost:9200/，以下例子处理后对应的最终origin为：<br />
 * '/graphql' ---> https://localhost:9200 <br />
 * 'graphql' ---> https://localhost:9200 <br />
 * './graphql' ---> https://localhost:9200 <br />
 * '../graphql' ---> https://localhost:9200 <br />
 * '' ---> https://localhost:9200 <br />
 * '/' ---> https://localhost:9200 <br />
 * './' ---> https://localhost:9200 <br />
 * '.' ---> https://localhost:9200 <br />
 * '//127.0.0.1:9000/graphql' ---> https://127.0.0.1:9000 <br />
 * 'https://www.baidu.com/graphql' ---> https://www.baidu.com <br />
 * 'https://www.baidu.com:9200/graphql' ---> https://www.baidu.com:9200 <br />
 *
 * @internal
 *
 * @param {string} origin 请求的URL的origin这一部分，必须。<br />
 * PS：<br />
 * 1、如果是同源的请求，传个空字符串即可，内部会自动提取origin。<br />
 * 2、非同源的请求，传其url的origin这一部分即可。<br />
 *
 * @returns {string} 最终请求的URL的origin。
 */
function HandleByOrigin001( origin: string ): string{
  return new URL( origin, location.origin ).origin;
}

/**
 * 全局的请求并发控制器（对于HTTP/2、HTTP/3而言，限制请求的并发数没什么实际效用了！）。<br />
 * 使用例子：<br />
 * ```ts
 * // 假设这个例子是在“https://127.0.0.1:8100”页面下进行的。
 *
 * import {
 *   RequestConcurrentControllerByGlobal,
 * } from 'toolsDir/ts/universal_tools/UniversalTools.esm.mts';
 *
 * const {
 *   requestConcurrentQuantityByGlobal,
 *   requestConcurrentToolByGlobal
 * } = RequestConcurrentControllerByGlobal( 3 );
 *
 * console.log( `当前的请求并发数：${ requestConcurrentQuantityByGlobal }。` );
 *
 * const result = await requestConcurrentToolByGlobal( [
 *   [
 *     // 如果是同源的请求，传个空字符串即可，内部会自动提取origin。
 *     '',
 *     () => fetch( 'https://127.0.0.1:8100/https4deno/graphql', {
 *       body: JSON.stringify( {
 *         query: `
 * mutation MessageTest002( $input: MessageInput! ){
 *   createMessage111: createMessage( input: $input ){
 *     id,
 *     author,
 *     content,
 *   },
 * }
 * `,
 *         operationName: 'MessageTest002',
 *         variables: {
 *           input: {
 *             author: 'LZK',
 *             content: 'hope is a good thing',
 *           },
 *         },
 *       } ),
 *       cache: 'no-store',
 *       headers: {
 *         'Content-Type': 'application/json; charset=utf-8',
 *         'Accept': 'application/json',
 *         'Cache-Control': 'no-store',
 *         'Access-Control-Request-Headers': 'Deno-Custom-File-SRI, Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
 *         'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
 *       },
 *       method: 'POST',
 *       mode: 'cors',
 *       credentials: 'omit',
 *     } ).then( response => response.json() )
 *   ],
 *   [
 *     // 非同源的请求，传其url的origin这一部分即可。
 *     'https://127.0.0.1:9200',
 *     () => fetch( 'https://127.0.0.1:9200/graphql', {
 *       body: JSON.stringify( {
 *         query: `
 * mutation MessageTest002( $input: MessageInput! ){
 *   createMessage111: createMessage( input: $input ){
 *     id,
 *     author,
 *     content,
 *   },
 * }
 * `,
 *         operationName: 'MessageTest002',
 *         variables: {
 *           input: {
 *             author: 'LMF',
 *             content: 'hope is a good thing',
 *           },
 *         },
 *       } ),
 *       cache: 'no-store',
 *       headers: {
 *         'Content-Type': 'application/json; charset=utf-8',
 *         'Accept': 'application/json',
 *         'Cache-Control': 'no-store',
 *         'Access-Control-Request-Headers': 'Deno-Custom-File-SRI, Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
 *         'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
 *       },
 *       method: 'POST',
 *       mode: 'cors',
 *       credentials: 'omit',
 *     } ).then( response => response.json() )
 *   ],
 *   [
 *       // 非同源的请求，传其url的origin这一部分即可。
 *       'https://127.0.0.1:9000',
 *       () => fetch( 'https://127.0.0.1:9000/graphql', {
 *         body: JSON.stringify( {
 *           query: `
 * mutation MessageTest002( $input: MessageInput! ){
 *   createMessage111: createMessage( input: $input ){
 *     id,
 *     author,
 *     content,
 *   },
 * }
 * `,
 *           operationName: 'MessageTest002',
 *           variables: {
 *             input: {
 *               author: 'LYF',
 *               content: 'hope is a good thing',
 *             },
 *           },
 *         } ),
 *         cache: 'no-store',
 *         headers: {
 *           'Content-Type': 'application/json; charset=utf-8',
 *           'Accept': 'application/json',
 *           'Cache-Control': 'no-store',
 *           'Access-Control-Request-Headers': 'Deno-Custom-File-SRI, Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
 *           'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
 *         },
 *         method: 'POST',
 *         mode: 'cors',
 *         credentials: 'omit',
 *       } ).then( response => response.json() )
 *     ],
 * ] );
 *
 * // [
 * //   { status: "fulfilled", value: {"data":{"createMessage111":{"id":"f00fa7f2-67ca-4157-81f8-b1ae89dbe80f","author":"LMF","content":"hope is a good thing"}}} },
 * //   { status: "fulfilled", value: {"data":{"createMessage111":{"id":"f00fa7f2-67ca-4157-81f8-b1ae89dbe80f","author":"LZK","content":"hope is a good thing"}}} },
 * //   { status: "rejected", reason: '仅在status为"rejected"时出现。表示Promise被拒绝的原因。' },
 * // ]
 * console.dir( result );
 * ```
 *
 * @param {number | undefined} requestConcurrentQuantity 要设置的请求并发数，可选，默认值是6。<br />
 * PS：<br />
 * 1、当没有正在进行的请求时才能设置并发数，否则依旧是设置前的值，是多少就是多少。<br />
 *
 * 注意：谷歌、火狐浏览器对同源下的请求并发数量的限制都是6个。<br />
 * PS：<br />
 * 1、至于其他浏览器在数量上可能不为6个，可自行查找。<br />
 * 2、跨域时，“OPTIONS请求”也是占用浏览器的并发数的！<br />
 * 在浏览器中，当出现“跨域请求”时，会先出现“OPTIONS请求”进行“预检”，那么哪些请求会触发“预检”呢？<br />
 * 出现“非简单请求”时，就会触发“预检”操作！<br /><br />
 *
 * 同时满足以下所有条件，就属于“简单请求”：<br />
 * 1)请求方法是以下3种方法之一：<br />
 * HEAD、GET、POST<br />
 * 2)只有以下请求header字段允许被修改或被设置，否则必然触发预检：<br />
 * Accept、Accept-Language、Content-language、DPR、Downlink、Save-Data、Viewport-Width、Width、Last-Event-ID、<br />
 * Content-Type：只限于3个值application/x-www-form-urlencoded、multipart/form-data、text/plain。<br />
 * 3)XMLHttpRequestUpload在请求中使用的任何对象上都没有注册事件侦听器，详细见：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload。<br />
 * PS：<br />
 * 将事件监听器附加到此对象会使请求无法成为 "简单请求"，如果是跨源请求，则会导致发出预检请求；请参阅 CORS。因此，需要在调用 send() 之前注册事件监听器，否则上传事件不会被分派。<br />
 * 4)ReadableStream请求中未使用任何对象，应该是指 Fetch API 中的 Request 中的 Body，尚未验证。<br /><br />
 *
 * 满足以下任意1个条件，就属于“非简单请求”：<br />
 * 1)PUT、PATCH等请求方法必然会触发预检。<br />
 * 2)请求头中Content-Type的值不是这3个值：application/x-www-form-urlencoded、multipart/form-data、text/plain。<br />
 * 也就是说，如果请求的Content-Type被设置为如：application/json;charset=utf-8 时也必然会触发预检。<br />
 * 3)添加任何额外的自定义的请求header都会触发预检。<br />
 * 4)XMLHttpRequestUpload在请求中使用的任何对象上有注册事件侦听器，也会触发预检，详细见：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload。<br />
 * PS：<br />
 * 将事件监听器附加到此对象会使请求无法成为 "简单请求"，如果是跨源请求，则会导致发出预检请求；请参阅 CORS。因此，需要在调用 send() 之前注册事件监听器，否则上传事件不会被分派。<br />
 *
 * @returns {T_RequestConcurrentControllerByGlobal} 返回一个对象，里面有2个属性：<br />
 * requestConcurrentQuantityByGlobal：当前的请求并发数，通过该属性可以随时知道当前的请求并发数，详细见：T_RequestConcurrentControllerByGlobal。<br />
 * requestConcurrentToolByGlobal：实际用于全局的请求并发控制器函数工具，详细见：T_RequestConcurrentControllerByGlobal。<br />
 */
export function RequestConcurrentControllerByGlobal( requestConcurrentQuantity?: number | undefined ): T_RequestConcurrentControllerByGlobal{
  if( IsNumber( requestConcurrentQuantity ) && ( requestConcurrentQuantity as number ) >= 1 ){
    !( Object.values( currentlyExecutingByGlobal as T_CurrentlyExecutingByGlobal ).some( (
      item: T_ArrayPromiseAny,
      // @ts-expect-error
      index: number,
      // @ts-expect-error
      array: Array<T_ArrayPromiseAny>,
    ): boolean => item.length > 0 ) ) && ( requestConcurrentQuantityByGlobal = Number.parseInt( String( requestConcurrentQuantity as number ) ) );
  }

  return {
    requestConcurrentQuantityByGlobal,
    requestConcurrentToolByGlobal: (
      requestArray: T_ArrayRequestItem
    ): Promise<any> => {
      if( requestArray.length > 0 ){
        let handleOrigin: string = '';

        requestArray.forEach( (
          [
            origin,
            // @ts-expect-error
            requestFn
          ]: T_RequestItem,
          // @ts-expect-error
          index: number,
          // @ts-expect-error
          array: T_ArrayRequestItem,
        ): void => {
          handleOrigin = HandleByOrigin001( origin );

          if( !( handleOrigin in currentlyExecutingByGlobal ) ){
            currentlyExecutingByGlobal[ handleOrigin ] = [];

            currentlyResolvePromiseByGlobal[ handleOrigin ] = Promise.resolve();
          }
        } );
      }

      let index: number = 0;

      const requestResult: T_ArrayPromiseAny = [],
        taskQueue = (): Promise<any> => {
          if( index === requestArray.length ){
            return Promise.resolve();
          }

          const [ origin, requestFn ]: T_RequestItem = requestArray[ index ] as T_RequestItem;

          const promiseHandle001: Promise<any> = Promise.resolve().then( (): Promise<any> => requestFn() );

          requestResult[ index ] = promiseHandle001;

          ++index;

          const handleOrigin: string = HandleByOrigin001( origin ),
            executingPromise: Promise<any> = promiseHandle001.then(
              (): void => {
                ( currentlyExecutingByGlobal[ handleOrigin ] as T_ArrayPromiseAny ).splice( ( currentlyExecutingByGlobal[ handleOrigin ] as T_ArrayPromiseAny ).indexOf( executingPromise ), 1 );
              },
              (): void => {
                ( currentlyExecutingByGlobal[ handleOrigin ] as T_ArrayPromiseAny ).splice( ( currentlyExecutingByGlobal[ handleOrigin ] as T_ArrayPromiseAny ).indexOf( executingPromise ), 1 );
              }
            );

          ( currentlyExecutingByGlobal[ handleOrigin ] as T_ArrayPromiseAny ).push( executingPromise );

          currentlyResolvePromiseByGlobal[ handleOrigin ] = Promise.resolve();

          if( ( currentlyExecutingByGlobal[ handleOrigin ] as T_ArrayPromiseAny ).length >= requestConcurrentQuantityByGlobal ){
            currentlyResolvePromiseByGlobal[ handleOrigin ] = Promise.race( ( currentlyExecutingByGlobal[ handleOrigin ] as T_ArrayPromiseAny ) );
          }

          return Promise.race( Object.values( currentlyResolvePromiseByGlobal ) ).then(
            (): Promise<any> => taskQueue(),
            (): Promise<any> => taskQueue()
          );
        };

      return taskQueue().then(
        (): Promise<any> => Promise.allSettled( requestResult ),
        (): Promise<any> => Promise.allSettled( requestResult )
      );
    },
  };
}

// 请求并发控制器（对于HTTP/2、HTTP/3而言，限制请求的并发数没什么实际效用了！） End

/**
 * 默认导出，部署了该工具库所有的导出函数、类等等。
 */
export default {
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

  // 请求并发控制器（对于HTTP/2、HTTP/3而言，限制请求的并发数没什么实际效用了！） Start
  RequestConcurrentControllerByGlobal,
  // 请求并发控制器（对于HTTP/2、HTTP/3而言，限制请求的并发数没什么实际效用了！） End
};
