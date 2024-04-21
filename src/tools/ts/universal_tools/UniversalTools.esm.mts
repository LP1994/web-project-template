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
 * 6、编程范式使用“函数式编程”，结合“TypeScript”编写，这样更好得便于被Webpack等工具进行“Tree-shaking”，只打包那些被使用的。
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
export function Uint8ArrayToString( data: Uint8Array ): string{
  'use strict';

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
 * 2、返回值是被Promise包裹起来的，也就是Promise.allSettled()的返回值，返回值结构详细见：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#return_value。<br />
 * 注意，返回值里的数据体顺序跟请求数组里的请求顺序是一样的，一一对应的，即，requestArray里的第1个对应着返回值里的第1个数据体，以此类推。<br />
 * 无论，请求是否成功、失败、网络中断等等，都会在返回值里体现。
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
 *       cache: 'no-cache',
 *       headers: {
 *         'Content-Type': 'application/json; charset=utf-8',
 *         'Accept': 'application/json',
 *         'Cache-Control': 'no-cache',
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
 *       cache: 'no-cache',
 *       headers: {
 *         'Content-Type': 'application/json; charset=utf-8',
 *         'Accept': 'application/json',
 *         'Cache-Control': 'no-cache',
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
 *         cache: 'no-cache',
 *         headers: {
 *           'Content-Type': 'application/json; charset=utf-8',
 *           'Accept': 'application/json',
 *           'Cache-Control': 'no-cache',
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

// 事件的发布、订阅的工具类 Start

export type T_PublishFun = ( ...args: any[] ) => void;

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
  #events4Queue: Record<string, Array<T_PublishFun>> = {};

  /**
   * 用于事件发布的初始化。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @private
   */
  #init( type: string ): void{
    !this.#events4Queue[ type ] && ( this.#events4Queue[ type ] = [] );
  }

  /**
   * 事件的发布、订阅的工具类的构造函数。
   */
  public constructor(){
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
  public on( type: string, fn: T_PublishFun = (): void => {
  } ): Events4PublishSubscribe{
    this.#init( type );

    ( this.#events4Queue[ type ] as Array<T_PublishFun> ).push( fn );

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
  public once( type: string, fn: T_PublishFun = (): void => {
  } ): Events4PublishSubscribe{
    this.#init( type );

    let _this = this;

    ( this.#events4Queue[ type ] as Array<T_PublishFun> ).push( function once( ...args: any[] ): void{
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
  public emit( type: string, ...params: any[] ): Events4PublishSubscribe{
    this.#events4Queue[ type ] && ( ( this.#events4Queue[ type ] as Array<T_PublishFun> ).forEach( ( fn: T_PublishFun ): void => {
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
  public off( type: string, fn: T_PublishFun ): Events4PublishSubscribe{
    this.#events4Queue[ type ] && ( this.#events4Queue[ type ] = ( this.#events4Queue[ type ] as Array<T_PublishFun> ).filter( ( cb: T_PublishFun ): boolean => fn !== cb ) );

    return this;
  }

  /**
   * 清除所有的事件队列。
   *
   * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用。
   */
  public clearAllEventsQueue(): Events4PublishSubscribe{
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
  public delEventQueue4Type( type: string ): Events4PublishSubscribe{
    this.#events4Queue[ type ] && ( delete this.#events4Queue[ type ] );

    return this;
  }

  /**
   * 获取所有的事件队列。
   *
   * @returns {Record<string, Array<T_PublishFun>>} 所有的事件队列。
   */
  public getAllEventsQueue(): Record<string, Array<T_PublishFun>>{
    return this.#events4Queue;
  }

  /**
   * 根据指定的事件名获取其拥有的所有事件函数，若不存在指定的事件名，就会返回undefined。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @returns {Array<T_PublishFun> | undefined} 根据指定的事件名获取其拥有的所有事件函数，若不存在指定的事件名，就会返回undefined。
   */
  public getEventQueue4Type( type: string ): Array<T_PublishFun> | undefined{
    return this.#events4Queue[ type ];
  }

  /**
   * 根据指定的事件名判断事件队列中是否已经存在了指定的事件名。
   *
   * @param {string} type 字符串，事件名，必须的。
   *
   * @returns {boolean} 若存在则返回true，反之，返回false。
   */
  public hasEventQueue4Type( type: string ): boolean{
    return Boolean( this.#events4Queue[ type ] );
  }

}

// 事件的发布、订阅的工具类 End

// onappinstalled和onbeforeinstallprompt的事件封装。Start

/**
 * BeforeInstallPromptEvent 接口的 userChoice 属性表示用户在收到安装应用程序的提示时所作的安装选择。
 */
export type T_userChoiceResult = {
  /**
   * 表示用户是否选择安装应用程序的字符串。必须是以下值之一：
   * "accepted"：用户安装了应用程序。
   * "dismissed"：用户未安装应用程序。
   */
  outcome: 'accepted' | 'dismissed',
  /**
   * 如果用户选择安装应用程序，这是一个字符串，表示所选平台，即 BeforeInstallPromptEvent.platforms 属性的值之一。
   * 如果用户选择不安装应用程序，则此字符串为空。
   */
  platform: string,
};

/**
 * BeforeInstallPromptEvent 是 Window 对象在提示用户将网站 "安装 "到手机主屏幕之前触发的 beforeinstallprompt 事件的接口。
 * 当浏览器检测到网站可以作为渐进式 Web 应用程序进行安装时，beforeinstallprompt 事件就会触发。
 * 该事件的触发时间并无保证，但通常会在页面加载时发生。
 * 该事件的典型用途是当网络应用希望提供自己的应用内用户界面，而不是浏览器提供的通用用户界面，来邀请用户安装应用。这样，应用程序就能提供更多关于应用程序的上下文，向用户解释为什么要安装它。
 * 在这种情况下，该事件的处理程序将：
 * 保持对传入的 BeforeInstallPromptEvent 对象的引用
 * 显示应用内安装界面（默认情况下应隐藏，因为并非所有浏览器都支持安装）。
 * 当用户使用应用内安装用户界面安装应用时，应用内安装用户界面会调用保留的 BeforeInstallPromptEvent 对象的 prompt() 方法来显示安装提示。
 */
export interface I_BeforeInstallPromptEvent
  extends Event {
  /**
   * 返回包含事件发生平台的字符串数组，其中每个字符串用于标识安装的目标平台。该数组适用于希望向用户提供版本选择的用户代理，例如，"web"或 "play"可让用户在 web 版本或 Android 版本之间进行选择。
   */
  readonly platforms: string[];

  /**
   * 返回一个 Promise，该 Promise 将解析为一个对象，描述用户在被提示安装应用程序时的选择。
   */
  readonly userChoice: Promise<T_userChoiceResult>;

  /**
   * 显示提示，询问用户是否要安装应用程序。该方法会返回一个 Promise，解析为一个对象，描述用户在被提示安装应用程序时的选择。
   * BeforeInstallPromptEvent 接口的 prompt() 方法允许开发人员在自己选择的时间显示安装提示。通常，应用程序自定义安装 UI 的事件处理程序会调用该方法。
   * 该方法必须在用户操作（如点击按钮）的事件处理程序中调用，并且只能在给定的 BeforeInstallPromptEvent 实例中调用一次。
   */
  prompt: () => Promise<T_userChoiceResult>;
}

/**
 * AppInstallEvent类的构造函数的配置参数。
 */
export type T_AppInstallEventConfig = {
  /**
   * 当onappinstalled触发时，所要执行的函数，会有一个event参数(onappinstalled的event参数)。
   *
   * @param {Event} event
   */
  onAppInstalled: ( event: Event ) => void;
  /**
   * 当onbeforeinstallprompt触发时，所要执行的函数，会有一个event参数(onbeforeinstallprompt的event参数)。
   *
   * @param {I_BeforeInstallPromptEvent} event
   */
  onBeforeInstallPrompt: ( event: I_BeforeInstallPromptEvent ) => void;
  /**
   * 布尔值，true禁用默认事件，false反之，默认值true。
   */
  isPreventDefault: boolean;
  /**
   * 当用户确定添加到主屏幕时，会被执行的函数，有一个userChoiceResult参数。
   *
   * @param {T_userChoiceResult} userChoiceResult
   */
  accepted: ( userChoiceResult: T_userChoiceResult ) => void;
  /**
   * 当用户取消添加到主屏幕时，会被执行的函数，有一个userChoiceResult参数。
   *
   * @param {T_userChoiceResult} userChoiceResult
   */
  dismissed: ( userChoiceResult: T_userChoiceResult ) => void;
  /**
   * onbeforeinstallprompt的event.userChoice的拒绝事件，有一个error参数。
   *
   * @param {Error} error
   */
  rejected: ( error: Error ) => void;
};

/**
 * onappinstalled和onbeforeinstallprompt的事件封装。<br />
 * 有的浏览器(基于谷歌浏览器内核开发的第3方浏览器)虽然显示支持这2个事件，但不触发！<br />
 * 详细见：<br />
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/appinstalled_event <br />
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event <br /><br />
 *
 * 注：<br />
 * 1、onappinstalled：<br />
 * 当在浏览器上完成添加到主屏幕的时候会触发这个事件！否则不触发该事件！<br />
 * 有的浏览器在完成添加到主屏幕的时候，会直接退出浏览器，导致没法进行触发后的其他处理！<br />
 * PC和移动端兼容性都有所不同！用的时候注意些！<br />
 * iOS上的浏览器目前都不行！但可以使用“window.navigator.standalone”来判断是不是从主屏幕打开的！<br />
 * Android设备上的谷歌浏览器支持的很好！其他基于谷歌浏览器内核开发的第3方浏览器兼容的不同，有的可以有的不行！Edge浏览器可以！<br />
 * PC的Windows上，谷歌浏览器和QQ浏览器支持！<br />
 * 有的浏览器(基于谷歌浏览器内核开发的第3方浏览器)虽然显示支持该事件，但不触发！<br /><br />
 *
 * 2、onbeforeinstallprompt：<br />
 * PC和移动端兼容性都有所不同！用的时候注意些！<br />
 * 目前只有Windows 、Android上的谷歌浏览器支持！<br />
 * Windows 、Android上的基于谷歌浏览器内核开发的第3方浏览器支持不一！<br />
 * Android上的Edge浏览器支持！Android上的Opera浏览器却不支持(虽然显示支持该事件，但不触发)！<br />
 * PC上的QQ浏览器支持！<br />
 * 有的浏览器(基于谷歌浏览器内核开发的第3方浏览器)虽然显示支持该事件，但不触发！<br />
 * 它需要满足以下条件才能触发：<br />
 * 1）Web App尚未安装到主屏幕(也就是还没进行添加到主屏幕的操作，或者已经安装过了，但又刷新了该页面)。<br />
 * 2）manifest.json(Web App的配置清单)中的prefer_related_applications属性的属性值不能是true。<br />
 * 3）添加主屏幕的操作由用户触发，而且用户与当前页面进行了超过30秒的交互(貌似没有也行)。<br />
 * 4）manifest.json(Web App的配置清单)中必须包括如下属性：<br />
 *    short_name属性、name属性、start_url属性。<br />
 *    icons属性，必须包含192x192(px)和512x512(px)大小的图标。<br />
 *    display属性的属性值必须是其中一个：fullscreen、standalone、minimal-ui。<br />
 * 5）当前页面是在HTTPS协议下(serviceWorker需要的)。<br />
 * 6）已向serviceWorker注册了fetch事件。<br />
 */
export class AppInstallEvent {

  /**
   * 当浏览器成功将页面安装为应用程序时，Web Manifest API 的 appinstalled 事件就会被触发。
   * 该事件不可取消，也不会冒泡。
   *
   * @type {(event: Event) => void}
   *
   * @private
   */
  #onAppInstalled: ( event: Event ) => void;

  /**
   * 当用户确定添加到主屏幕时，会被执行的函数。
   *
   * @type {( userChoiceResult: T_userChoiceResult ) => void}
   *
   * @private
   */
  #accepted: ( userChoiceResult: T_userChoiceResult ) => void;

  /**
   * 当用户取消添加到主屏幕时，会被执行的函数。
   *
   * @type {( userChoiceResult: T_userChoiceResult ) => void}
   *
   * @private
   */
  #dismissed: ( userChoiceResult: T_userChoiceResult ) => void;

  /**
   * BeforeInstallPromptEvent 是 Window 对象在提示用户将网站 "安装 "到手机主屏幕之前触发的 beforeinstallprompt 事件的接口。
   * 当浏览器检测到网站可以作为渐进式 Web 应用程序进行安装时，beforeinstallprompt 事件就会触发。
   * 该事件的触发时间并无保证，但通常会在页面加载时发生。
   * 该事件的典型用途是当网络应用希望提供自己的应用内用户界面，而不是浏览器提供的通用用户界面，来邀请用户安装应用。这样，应用程序就能提供更多关于应用程序的上下文，向用户解释为什么要安装它。
   * 在这种情况下，该事件的处理程序将：
   * 保持对传入的 BeforeInstallPromptEvent 对象的引用
   * 显示应用内安装界面（默认情况下应隐藏，因为并非所有浏览器都支持安装）。
   * 当用户使用应用内安装用户界面安装应用时，应用内安装用户界面会调用保留的 BeforeInstallPromptEvent 对象的 prompt() 方法来显示安装提示。
   *
   * @type {I_BeforeInstallPromptEvent | undefined}
   */
  public beforeInstallPromptEvent: I_BeforeInstallPromptEvent | undefined;

  /**
   * BeforeInstallPromptEvent 接口的 userChoice 属性表示用户在收到安装应用程序的提示时所作的安装选择。
   *
   * @type {T_userChoiceResult | undefined}
   */
  public userChoiceResult: T_userChoiceResult | undefined;

  /**
   * 构造函数，初始化事件。
   *
   * @param config 配置参数。
   *
   * @param {((event: Event) => void)} config.onAppInstalled 当onappinstalled触发时，所要执行的函数，会有一个event参数(onappinstalled的event参数)，可选。
   *
   * @param {((event: I_BeforeInstallPromptEvent) => void)} config.onBeforeInstallPrompt 当onbeforeinstallprompt触发时，所要执行的函数，会有一个event参数(onbeforeinstallprompt的event参数)，可选。
   *
   * @param {boolean} config.isPreventDefault 布尔值，true禁用默认事件，false反之，默认值true，可选。
   *
   * @param {((userChoiceResult: T_userChoiceResult) => void)} config.accepted 当用户确定添加到主屏幕时，会被执行的函数，有一个userChoiceResult参数，可选。
   *
   * @param {((userChoiceResult: T_userChoiceResult) => void)} config.dismissed 当用户取消添加到主屏幕时，会被执行的函数，有一个userChoiceResult参数，可选。
   *
   * @param {((error: Error) => void)} config.rejected onbeforeinstallprompt的event.userChoice的拒绝事件，有一个error参数，可选。
   */
  public constructor( {
    onAppInstalled = (
      // @ts-expect-error
      event: Event
    ): void => {
      console.log( 'window.onappinstalled触发了！' );
    },
    onBeforeInstallPrompt = (
      // @ts-expect-error
      event: I_BeforeInstallPromptEvent
    ): void => {
      console.log( 'window.onbeforeinstallprompt触发了！' );
    },
    isPreventDefault = true,
    accepted = (
      // @ts-expect-error
      userChoiceResult: T_userChoiceResult
    ): void => {
      console.log( 'Web APP已经添加到主屏幕了！' );
    },
    dismissed = (
      // @ts-expect-error
      userChoiceResult: T_userChoiceResult
    ): void => {
      console.log( 'Web APP还没添加到主屏幕！' );
    },
    rejected = ( error: Error ): void => {
      console.error( error.message );
    },
  }: Partial<T_AppInstallEventConfig> = {} ){
    this.#onAppInstalled = onAppInstalled;
    this.#accepted = accepted;
    this.#dismissed = dismissed;

    // @ts-expect-error
    window.onappinstalled = ( event: Event ): void => {
      this.#onAppInstalled( event );
    };

    // @ts-expect-error
    window.onbeforeinstallprompt = ( event: I_BeforeInstallPromptEvent ): void => {
      isPreventDefault && ( event.preventDefault(), event.stopPropagation(), event.stopImmediatePropagation() );

      this.beforeInstallPromptEvent = event;

      onBeforeInstallPrompt( event );

      event[ 'userChoice' ].then( ( userChoiceResult: T_userChoiceResult ): void => {
        this.userChoiceResult = userChoiceResult;

        if( userChoiceResult === undefined || userChoiceResult[ 'outcome' ] === 'dismissed' ){
          this.#dismissed( userChoiceResult );
          this.beforeInstallPromptEvent = event;
          this.userChoiceResult = userChoiceResult;
        }
        else if( userChoiceResult[ 'outcome' ] === 'accepted' ){
          this.#accepted( userChoiceResult );
          this.beforeInstallPromptEvent = undefined;
          this.userChoiceResult = undefined;
        }
      } ).catch( rejected );
    };
  }

  /**
   * 当onappinstalled触发时，所要执行的函数。
   *
   * @param {(event: Event) => void} event 函数，该函数会有1个event参数(onappinstalled的event参数)，必须。
   */
  public onAppInstalled( event: ( event: Event ) => void ): void{
    this.#onAppInstalled = event;
  }

  /**
   * 当onbeforeinstallprompt第1次被触发后，或outcome === 'dismissed'时，这2种情况下，调用该方法会触发添加到主屏幕的提示。
   *
   * @returns {Promise<T_userChoiceResult | void>}
   */
  public async prompt(): Promise<T_userChoiceResult | void>{
    if( ( this.beforeInstallPromptEvent && this.userChoiceResult === undefined ) || ( this.beforeInstallPromptEvent && this.userChoiceResult !== undefined && this.userChoiceResult[ 'outcome' ] === 'dismissed' ) ){
      return await this.beforeInstallPromptEvent.prompt();
    }
  }

  /**
   * 当用户确定添加到主屏幕时，会被执行的函数。
   *
   * @param {(userChoiceResult: T_userChoiceResult) => void} fun 函数，该函数有一个userChoiceResult参数，必须。<br />
   */
  public accepted( fun: ( userChoiceResult: T_userChoiceResult ) => void ): void{
    this.#accepted = fun;
  }

  /**
   * 当用户取消添加到主屏幕时，会被执行的函数。
   *
   * @param {(userChoiceResult: T_userChoiceResult) => void} fun 函数，该函数有一个userChoiceResult参数，必须。<br />
   */
  public dismissed( fun: ( userChoiceResult: T_userChoiceResult ) => void ): void{
    this.#dismissed = fun;
  }

}

export type T_IsSupportAppInstallEvent = {
  onappinstalled: boolean;
  onbeforeinstallprompt: boolean;
};

/**
 * 返回一个对象，有onappinstalled属性和onbeforeinstallprompt属性，都是布尔值。用于判断浏览器是否支持这2个事件！<br />
 * 有的浏览器(基于谷歌浏览器内核开发的第3方浏览器)虽然显示支持这2个事件，但不触发！<br />
 * 详细见：<br />
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/appinstalled_event <br />
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event <br /><br />
 *
 * 注：<br />
 * 1、onappinstalled：<br />
 * 当在浏览器上完成添加到主屏幕的时候会触发这个事件！否则不触发该事件！<br />
 * 有的浏览器在完成添加到主屏幕的时候，会直接退出浏览器，导致没法进行触发后的其他处理！<br />
 * PC和移动端兼容性都有所不同！用的时候注意些！<br />
 * iOS上的浏览器目前都不行！但可以使用“window.navigator.standalone”来判断是不是从主屏幕打开的！<br />
 * Android设备上的谷歌浏览器支持的很好！其他基于谷歌浏览器内核开发的第3方浏览器兼容的不同，有的可以有的不行！Edge浏览器可以！<br />
 * PC的Windows上，谷歌浏览器和QQ浏览器支持！<br />
 * 有的浏览器(基于谷歌浏览器内核开发的第3方浏览器)虽然显示支持该事件，但不触发！<br /><br />
 *
 * 2、onbeforeinstallprompt：<br />
 * PC和移动端兼容性都有所不同！用的时候注意些！<br />
 * 目前只有Windows 、Android上的谷歌浏览器支持！<br />
 * Windows 、Android上的基于谷歌浏览器内核开发的第3方浏览器支持不一！<br />
 * Android上的Edge浏览器支持！Android上的Opera浏览器却不支持(虽然显示支持该事件，但不触发)！<br />
 * PC上的QQ浏览器支持！<br />
 * 有的浏览器(基于谷歌浏览器内核开发的第3方浏览器)虽然显示支持该事件，但不触发！<br />
 * 它需要满足以下条件才能触发：<br />
 * 1）Web App尚未安装到主屏幕(也就是还没进行添加到主屏幕的操作，或者已经安装过了，但又刷新了该页面)。<br />
 * 2）manifest.json(Web App的配置清单)中的prefer_related_applications属性的属性值不能是true。<br />
 * 3）添加主屏幕的操作由用户触发，而且用户与当前页面进行了超过30秒的交互(貌似没有也行)。<br />
 * 4）manifest.json(Web App的配置清单)中必须包括如下属性：<br />
 *    short_name属性、name属性、start_url属性。<br />
 *    icons属性，必须包含192x192(px)和512x512(px)大小的图标。<br />
 *    display属性的属性值必须是其中一个：fullscreen、standalone、minimal-ui。<br />
 * 5）当前页面是在HTTPS协议下(serviceWorker需要的)。<br />
 * 6）已向serviceWorker注册了fetch事件。<br />
 *
 * @returns {T_IsSupportAppInstallEvent}
 */
export function IsSupportAppInstallEvent(): T_IsSupportAppInstallEvent{
  return {
    onappinstalled: 'onappinstalled' in window,
    onbeforeinstallprompt: 'onbeforeinstallprompt' in window,
  };
}

export type T_WindowDisplayModeConfig = {
  mode?: string;
  yes?: () => void;
  no?: () => void;
};

/**
 * 判断当前浏览器的“display-mode”是否跟指定的参数mode的值一样，可以将该函数用于辅助提示用户将Web App添加到主屏幕！
 *
 * @param {T_WindowDisplayModeConfig} config
 *
 * @param {string} config.mode display-mode的值有：fullscreen、standalone、minimal-ui、browser，默认值是'fullscreen'，可选。
 *
 * @param {() => void} config.yes 函数，如果当前浏览器的“display-mode”是指定的参数mode_str的值，就会触发这个函数，可选。
 *
 * @param {() => void} config.no 函数，如果当前浏览器的“display-mode”不是指定的参数mode_str的值，就会触发这个函数，可选。
 */
export function WindowDisplayMode( {
  mode = 'fullscreen',
  yes = (): void => {
  },
  no = (): void => {
  },
}: T_WindowDisplayModeConfig = {} ): void{
  window.matchMedia( `(display-mode: ${ mode })` ).matches
  ? yes()
  : no();
}

// onappinstalled和onbeforeinstallprompt的事件封装。End

// Decorator修饰工具。Start

/**
 * 类装饰器的类型描述。
 */
export type T_ClassDecorator = (
  value: Function,
  context: ClassDecoratorContext,
) => Function | void;

/**
 * 方法装饰器的类型描述。
 */
export type T_ClassMethodDecorator = (
  value: Function,
  context: ClassMethodDecoratorContext,
) => Function | void;

/**
 * 属性装饰器的类型描述。
 */
export type T_ClassFieldDecorator = (
  value: undefined,
  context: ClassFieldDecoratorContext,
) => ( initialValue: unknown ) => unknown | void;

/**
 * getter装饰器的类型描述。
 */
export type T_ClassGetterDecorator = (
  value: Function,
  context: ClassGetterDecoratorContext,
) => Function | void;

/**
 * setter装饰器的类型描述。
 */
export type T_ClassSetterDecorator = (
  value: Function,
  context: ClassSetterDecoratorContext,
) => Function | void;

/**
 * accessor装饰器的类型描述。
 */
export type T_ClassAccessorDecorator = (
  value: {
    get: () => unknown;
    set: ( value: unknown ) => void;
  },
  context: ClassAccessorDecoratorContext,
) => {
  get?: () => unknown;
  set?: ( value: unknown ) => void;
  init?: ( initialValue: unknown ) => unknown;
} | void;

/**
 * 方法装饰器，用于确保类的非私有方法在调用时，其内部this指向永远都是类、类实例。<br />
 * 例子：<br />
 * ```ts
 * class Person {
 *
 *   public name: string;
 *
 *   public constructor( name: string ){
 *     this.name = name;
 *   }
 *
 *   @Bound4ClassMethodDecorator
 *   public greet(): void{
 *     console.log(`Hello, my name is ${this.name}.`);
 *   }
 *
 * }
 *
 * const g = new Person( '张三' ).greet;
 *
 * g(); // "Hello, my name is 张三."
 * ```
 *
 * @param {Function} value 被修饰的类的非私有方法本身。
 *
 * @param {ClassMethodDecoratorContext} context 上下文对象。
 */
export function Bound4ClassMethodDecorator(
  // @ts-expect-error
  value: Function,
  context: ClassMethodDecoratorContext,
): void{
  if( context.kind === 'method' ){
    const methodName: string | symbol = context.name;

    if( context.private ){
      throw new Error( `方法装饰器“Bound4ClassMethodDecorator”不能用于修饰类的私有方法：${ methodName as string }` );
    }

    context.addInitializer( function (): void{
      // @ts-expect-error
      this[ methodName ] = this[ methodName ].bind( this );
    } );
  }
  else{
    throw new Error( `方法装饰器“Bound4ClassMethodDecorator”只能用于修饰类的非私有方法！` );
  }
}

// Decorator修饰工具。End

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

  // 请求并发控制器（对于HTTP/2、HTTP/3而言，限制请求的并发数没什么实际效用了！）Start
  RequestConcurrentControllerByGlobal,
  // 请求并发控制器（对于HTTP/2、HTTP/3而言，限制请求的并发数没什么实际效用了！）End

  // 事件的发布、订阅的工具类。Start
  Events4PublishSubscribe,
  // 事件的发布、订阅的工具类。End

  // onappinstalled和onbeforeinstallprompt的事件封装。Start
  AppInstallEvent,
  IsSupportAppInstallEvent,
  WindowDisplayMode,
  // onappinstalled和onbeforeinstallprompt的事件封装。End

  // Decorator修饰工具。Start
  Bound4ClassMethodDecorator,
  // Decorator修饰工具。End
};
