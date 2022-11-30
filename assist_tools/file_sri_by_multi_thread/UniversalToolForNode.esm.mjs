/**
 * Project: web-project-template
 * FileDirPath: file_sri_by_multi_thread/UniversalToolForNode.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 该通用工具仅用于Node环境，使用“ECMAScript modules(ECMAScript模块)”写法。
 */

/**
 * 编写原则：
 * 1、能用模块化的API尽量用模块化的，少用或者不用全局的，目的是为了让“编码风格”尽量符合“模块化”的理念。
 * 例如：
 * URL类从Node v10.0.0开始，可直接作为全局对象使用，但是同时也存在于模块“node:url”中（从Node v7.0.0、v6.13.0开始引入）。
 * 示例代码：
 * import { URL } from 'node:url';
 * // Prints 'true'.
 * console.log( URL === globalThis.URL );
 *
 * 2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 3、注意函数尾调用、算法时间复杂度、算法空间复杂度等优化。
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

import {
  dirname,
} from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

import chalk from 'chalk';

/**
 * 一种字符串的相等比较（使用===比较），用于辅助判断数据类型。<br />
 * 大多是如下的比较：<br />
 * '[object Arguments]'.slice( 8, -1 ) === 'Arguments';<br />
 * '[object HTMLDocument XXX]'.slice( 8, -1 ) === 'HTMLDocument XXX';<br />
 *
 * @param {any} equalArg1 数据，必需。
 *
 * @param {string} equalArg2 可以是诸如"Arguments"、'ArrayBuffer'等等表示目标数据类型名的字符串，必需。
 *
 * @returns {boolean} 使用===比较，相等则返回true，否则返回false。
 */
function EqualForString001( equalArg1, equalArg2 ){
  return GetDataType( equalArg1 ).slice( 8, -1 ) === equalArg2;
}

/**
 * 获取数据类型的字符串，如：'[object HTMLDocument]'、'[object HTMLDocument XXX]'。<br />
 * PS:<br />
 * 1、如果传入的是被Proxy代理过的对象，会报错！<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {string} 表示数据类型的字符串，如：'[object HTMLDocument]'、'[object HTMLDocument XXX]'。
 */
function GetDataType( arg ){
  'use strict';

  return Object.prototype.toString.call( arg );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

/**
 * 判断数据是否为Array类型。<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {boolean} 是数组返回true，不是数组返回false。
 */
function IsArray( arg ){
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
function IsNumber( arg ){
  return EqualForString001( arg, 'Number' ) && ( typeof arg === 'number' );
}

/**
 * 判断数据是否为String类型的原始值，String对象、String实例会返回false。<br />
 *
 * @param {any} arg 数据，必需。
 *
 * @returns {boolean} 是String原始值返回true，不是String原始值返回false。
 */
function IsString( arg ){
  return EqualForString001( arg, 'String' ) && ( typeof arg === 'string' );
}

/**
 * 自定义的Console类，用于在控制台输出带颜色、样式的文字，还集成了“chalk”模块（一个可以输出带颜色等样式的文本）的部分函数，这些都被作为静态方法挂载在这个自定义的Console类。<br />
 * PS：<br />
 * 1、“chalk”模块文档：<br />
 * https://github.com/chalk/chalk<br />
 *
 * 2、如果使用的是Windows 10 2004(build 19041)或更高版本的Windows OS，请使用系统自带的Windows终端（Windows Terminal）而不是cmd.exe，不然有些效果出不来。<br />
 */
class MyConsole {

  /**
   * 私有chalk实例。<br />
   *
   * @type {ChalkInstance}
   */
  #myChalk = chalk;

  /**
   * 自定义的Console类，用于在控制台输出带颜色、样式的文字，还集成了“chalk”模块（一个可以输出带颜色等样式的文本）的部分函数，这些都被作为静态方法挂载在这个自定义的Console类。<br />
   * PS：<br />
   * 1、“chalk”模块文档：<br />
   * https://github.com/chalk/chalk<br />
   *
   * 2、如果使用的是Windows 10 2004(build 19041)或更高版本的Windows OS，请使用系统自带的Windows终端（Windows Terminal）而不是cmd.exe，不然有些效果出不来。<br />
   *
   * @param {object} config 初始化字体颜色（color）、背景色（bgColor），可选。
   * <br />选项说明：<br />
   * color：值类型可以是：number[]（rgb值，如：[255, 136, 0]）、string（hex值，如：'#FF8800'）、number（ansi256值，如：194），默认值null，可选。<br />
   * bgColor：值类型可以是：number[]（rgb值，如：[255, 136, 0]）、string（hex值，如：'#FF8800'）、number（ansi256值，如：194），默认值null，可选。<br />
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
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bold( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bold方法，可参见chalk模块的bold方法的参数说明，必需。
   */
  bold( data ){
    console.log( this.#myChalk.bold( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出暗淡的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).dim( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的dim方法，可参见chalk模块的dim方法的参数说明，必需。
   */
  dim( data ){
    console.log( this.#myChalk.dim( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出斜体文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).italic( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的italic方法，可参见chalk模块的italic方法的参数说明，必需。
   */
  italic( data ){
    console.log( this.#myChalk.italic( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带下划线的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).underline( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的underline方法，可参见chalk模块的underline方法的参数说明，必需。
   */
  underline( data ){
    console.log( this.#myChalk.underline( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带上划线的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).overline( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的overline方法，可参见chalk模块的overline方法的参数说明，必需。
   */
  overline( data ){
    console.log( this.#myChalk.overline( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出反转背景色和前景色（也就是将背景色用作字体颜色，字体颜色用作背景色）的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).inverse( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的inverse方法，可参见chalk模块的inverse方法的参数说明，必需。
   */
  inverse( data ){
    console.log( this.#myChalk.inverse( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出但是隐藏文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).hidden( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的hidden方法，可参见chalk模块的hidden方法的参数说明，必需。
   */
  hidden( data ){
    console.log( this.#myChalk.hidden( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出带删除线的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).strikethrough( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的strikethrough方法，可参见chalk模块的strikethrough方法的参数说明，必需。
   */
  strikethrough( data ){
    console.log( this.#myChalk.strikethrough( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出常规的可见文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).visible( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的visible方法，可参见chalk模块的visible方法的参数说明，必需。
   */
  visible( data ){
    console.log( this.#myChalk.visible( data ) );
  }

  /**
   * 使用默认样式在控制台输出粗体文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Bold( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bold方法，可参见chalk模块的bold方法的参数说明，必需。
   */
  static Bold( data ){
    console.log( chalk.bold( data ) );
  }

  /**
   * 使用默认样式在控制台输出暗淡的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Dim( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的dim方法，可参见chalk模块的dim方法的参数说明，必需。
   */
  static Dim( data ){
    console.log( chalk.dim( data ) );
  }

  /**
   * 使用默认样式在控制台输出斜体文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Italic( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的italic方法，可参见chalk模块的italic方法的参数说明，必需。
   */
  static Italic( data ){
    console.log( chalk.italic( data ) );
  }

  /**
   * 使用默认样式在控制台输出带下划线的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Underline( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的underline方法，可参见chalk模块的underline方法的参数说明，必需。
   */
  static Underline( data ){
    console.log( chalk.underline( data ) );
  }

  /**
   * 使用默认样式在控制台输出带上划线的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Overline( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的overline方法，可参见chalk模块的overline方法的参数说明，必需。
   */
  static Overline( data ){
    console.log( chalk.overline( data ) );
  }

  /**
   * 使用默认样式在控制台输出反转背景色和前景色（也就是将背景色用作字体颜色，字体颜色用作背景色）的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Inverse( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的inverse方法，可参见chalk模块的inverse方法的参数说明，必需。
   */
  static Inverse( data ){
    console.log( chalk.inverse( data ) );
  }

  /**
   * 使用默认样式在控制台输出但是隐藏文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Hidden( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的hidden方法，可参见chalk模块的hidden方法的参数说明，必需。
   */
  static Hidden( data ){
    console.log( chalk.hidden( data ) );
  }

  /**
   * 使用默认样式在控制台输出带删除线的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Strikethrough( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的strikethrough方法，可参见chalk模块的strikethrough方法的参数说明，必需。
   */
  static Strikethrough( data ){
    console.log( chalk.strikethrough( data ) );
  }

  /**
   * 使用默认样式在控制台输出常规的可见文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Visible( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的visible方法，可参见chalk模块的visible方法的参数说明，必需。
   */
  static Visible( data ){
    console.log( chalk.visible( data ) );
  }

  // 文字修饰 End

  // 文字颜色 Start

  /**
   * 使用自定义的样式在控制台输出黑色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).black( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的black方法，可参见chalk模块的black方法的参数说明，必需。
   */
  black( data ){
    console.log( this.#myChalk.black( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出红色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).red( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的red方法，可参见chalk模块的red方法的参数说明，必需。
   */
  red( data ){
    console.log( this.#myChalk.red( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出绿色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).green( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的green方法，可参见chalk模块的green方法的参数说明，必需。
   */
  green( data ){
    console.log( this.#myChalk.green( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黄色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).yellow( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的yellow方法，可参见chalk模块的yellow方法的参数说明，必需。
   */
  yellow( data ){
    console.log( this.#myChalk.yellow( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出蓝色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).blue( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的blue方法，可参见chalk模块的blue方法的参数说明，必需。
   */
  blue( data ){
    console.log( this.#myChalk.blue( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出洋红色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).magenta( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的magenta方法，可参见chalk模块的magenta方法的参数说明，必需。
   */
  magenta( data ){
    console.log( this.#myChalk.magenta( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出青色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).cyan( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的cyan方法，可参见chalk模块的cyan方法的参数说明，必需。
   */
  cyan( data ){
    console.log( this.#myChalk.cyan( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出白色文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).white( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的white方法，可参见chalk模块的white方法的参数说明，必需。
   */
  white( data ){
    console.log( this.#myChalk.white( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出灰色文字（blackBright的别名）。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).gray( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的gray方法，可参见chalk模块的gray方法的参数说明，必需。
   */
  gray( data ){
    console.log( this.#myChalk.gray( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出灰色文字（blackBright的别名）。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).grey( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的grey方法，可参见chalk模块的grey方法的参数说明，必需。
   */
  grey( data ){
    console.log( this.#myChalk.grey( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黑亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).blackBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的blackBright方法，可参见chalk模块的blackBright方法的参数说明，必需。
   */
  blackBright( data ){
    console.log( this.#myChalk.blackBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出红亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).redBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的redBright方法，可参见chalk模块的redBright方法的参数说明，必需。
   */
  redBright( data ){
    console.log( this.#myChalk.redBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出绿亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).greenBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的greenBright方法，可参见chalk模块的greenBright方法的参数说明，必需。
   */
  greenBright( data ){
    console.log( this.#myChalk.greenBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出黄亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).yellowBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的yellowBright方法，可参见chalk模块的yellowBright方法的参数说明，必需。
   */
  yellowBright( data ){
    console.log( this.#myChalk.yellowBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出蓝亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).blueBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的blueBright方法，可参见chalk模块的blueBright方法的参数说明，必需。
   */
  blueBright( data ){
    console.log( this.#myChalk.blueBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出洋红亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).magentaBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的magentaBright方法，可参见chalk模块的magentaBright方法的参数说明，必需。
   */
  magentaBright( data ){
    console.log( this.#myChalk.magentaBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出青亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).cyanBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的cyanBright方法，可参见chalk模块的cyanBright方法的参数说明，必需。
   */
  cyanBright( data ){
    console.log( this.#myChalk.cyanBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出白亮文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).whiteBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的whiteBright方法，可参见chalk模块的whiteBright方法的参数说明，必需。
   */
  whiteBright( data ){
    console.log( this.#myChalk.whiteBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出黑色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Black( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的black方法，可参见chalk模块的black方法的参数说明，必需。
   */
  static Black( data ){
    console.log( chalk.black( data ) );
  }

  /**
   * 使用默认样式在控制台输出红色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Red( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的red方法，可参见chalk模块的red方法的参数说明，必需。
   */
  static Red( data ){
    console.log( chalk.red( data ) );
  }

  /**
   * 使用默认样式在控制台输出绿色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Green( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的green方法，可参见chalk模块的green方法的参数说明，必需。
   */
  static Green( data ){
    console.log( chalk.green( data ) );
  }

  /**
   * 使用默认样式在控制台输出黄色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Yellow( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的yellow方法，可参见chalk模块的yellow方法的参数说明，必需。
   */
  static Yellow( data ){
    console.log( chalk.yellow( data ) );
  }

  /**
   * 使用默认样式在控制台输出蓝色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Blue( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的blue方法，可参见chalk模块的blue方法的参数说明，必需。
   */
  static Blue( data ){
    console.log( chalk.blue( data ) );
  }

  /**
   * 使用默认样式在控制台输出洋红色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Magenta( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的magenta方法，可参见chalk模块的magenta方法的参数说明，必需。
   */
  static Magenta( data ){
    console.log( chalk.magenta( data ) );
  }

  /**
   * 使用默认样式在控制台输出青色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.Cyan( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的cyan方法，可参见chalk模块的cyan方法的参数说明，必需。
   */
  static Cyan( data ){
    console.log( chalk.cyan( data ) );
  }

  /**
   * 使用默认样式在控制台输出白色文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.White( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的white方法，可参见chalk模块的white方法的参数说明，必需。
   */
  static White( data ){
    console.log( chalk.white( data ) );
  }

  /**
   * 使用默认样式在控制台输出灰色文字（BlackBright的别名）。<br />
   * 使用例子：<br />
   * <code>MyConsole.Gray( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的gray方法，可参见chalk模块的gray方法的参数说明，必需。
   */
  static Gray( data ){
    console.log( chalk.gray( data ) );
  }

  /**
   * 使用默认样式在控制台输出灰色文字（BlackBright的别名）。<br />
   * 使用例子：<br />
   * <code>MyConsole.Grey( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的grey方法，可参见chalk模块的grey方法的参数说明，必需。
   */
  static Grey( data ){
    console.log( chalk.grey( data ) );
  }

  /**
   * 使用默认样式在控制台输出黑亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BlackBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的blackBright方法，可参见chalk模块的blackBright方法的参数说明，必需。
   */
  static BlackBright( data ){
    console.log( chalk.blackBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出红亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.RedBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的redBright方法，可参见chalk模块的redBright方法的参数说明，必需。
   */
  static RedBright( data ){
    console.log( chalk.redBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出绿亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.GreenBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的greenBright方法，可参见chalk模块的greenBright方法的参数说明，必需。
   */
  static GreenBright( data ){
    console.log( chalk.greenBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出黄亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.YellowBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的yellowBright方法，可参见chalk模块的yellowBright方法的参数说明，必需。
   */
  static YellowBright( data ){
    console.log( chalk.yellowBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出蓝亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BlueBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的blueBright方法，可参见chalk模块的blueBright方法的参数说明，必需。
   */
  static BlueBright( data ){
    console.log( chalk.blueBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出洋红亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.MagentaBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的magentaBright方法，可参见chalk模块的magentaBright方法的参数说明，必需。
   */
  static MagentaBright( data ){
    console.log( chalk.magentaBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出青亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.CyanBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的cyanBright方法，可参见chalk模块的cyanBright方法的参数说明，必需。
   */
  static CyanBright( data ){
    console.log( chalk.cyanBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出白亮文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.WhiteBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的whiteBright方法，可参见chalk模块的whiteBright方法的参数说明，必需。
   */
  static WhiteBright( data ){
    console.log( chalk.whiteBright( data ) );
  }

  // 文字颜色 End

  // 背景颜色 Start

  /**
   * 使用自定义的样式在控制台输出背景为黑色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlack( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlack方法，可参见chalk模块的bgBlack方法的参数说明，必需。
   */
  bgBlack( data ){
    console.log( this.#myChalk.bgBlack( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为红色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgRed( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgRed方法，可参见chalk模块的bgRed方法的参数说明，必需。
   */
  bgRed( data ){
    console.log( this.#myChalk.bgRed( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为绿色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgGreen( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGreen方法，可参见chalk模块的bgGreen方法的参数说明，必需。
   */
  bgGreen( data ){
    console.log( this.#myChalk.bgGreen( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黄色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgYellow( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgYellow方法，可参见chalk模块的bgYellow方法的参数说明，必需。
   */
  bgYellow( data ){
    console.log( this.#myChalk.bgYellow( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为蓝色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlue( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlue方法，可参见chalk模块的bgBlue方法的参数说明，必需。
   */
  bgBlue( data ){
    console.log( this.#myChalk.bgBlue( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为洋红色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgMagenta( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgMagenta方法，可参见chalk模块的bgMagenta方法的参数说明，必需。
   */
  bgMagenta( data ){
    console.log( this.#myChalk.bgMagenta( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为青色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgCyan( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgCyan方法，可参见chalk模块的bgCyan方法的参数说明，必需。
   */
  bgCyan( data ){
    console.log( this.#myChalk.bgCyan( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为白色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgWhite( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgWhite方法，可参见chalk模块的bgWhite方法的参数说明，必需。
   */
  bgWhite( data ){
    console.log( this.#myChalk.bgWhite( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为灰色的文字（bgBlackBright的别名）。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgGray( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGray方法，可参见chalk模块的bgGray方法的参数说明，必需。
   */
  bgGray( data ){
    console.log( this.#myChalk.bgGray( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为灰色的文字（bgBlackBright的别名）。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgGrey( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGrey方法，可参见chalk模块的bgGrey方法的参数说明，必需。
   */
  bgGrey( data ){
    console.log( this.#myChalk.bgGrey( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黑亮色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlackBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlackBright方法，可参见chalk模块的bgBlackBright方法的参数说明，必需。
   */
  bgBlackBright( data ){
    console.log( this.#myChalk.bgBlackBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为红亮色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgRedBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgRedBright方法，可参见chalk模块的bgRedBright方法的参数说明，必需。
   */
  bgRedBright( data ){
    console.log( this.#myChalk.bgRedBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为绿亮色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgGreenBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGreenBright方法，可参见chalk模块的bgGreenBright方法的参数说明，必需。
   */
  bgGreenBright( data ){
    console.log( this.#myChalk.bgGreenBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为黄亮色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgYellowBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgYellowBright方法，可参见chalk模块的bgYellowBright方法的参数说明，必需。
   */
  bgYellowBright( data ){
    console.log( this.#myChalk.bgYellowBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为蓝亮色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgBlueBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlueBright方法，可参见chalk模块的bgBlueBright方法的参数说明，必需。
   */
  bgBlueBright( data ){
    console.log( this.#myChalk.bgBlueBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为洋红亮的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgMagentaBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgMagentaBright方法，可参见chalk模块的bgMagentaBright方法的参数说明，必需。
   */
  bgMagentaBright( data ){
    console.log( this.#myChalk.bgMagentaBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为青亮色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgCyanBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgCyanBright方法，可参见chalk模块的bgCyanBright方法的参数说明，必需。
   */
  bgCyanBright( data ){
    console.log( this.#myChalk.bgCyanBright( data ) );
  }

  /**
   * 使用自定义的样式在控制台输出背景为白亮色的文字。<br />
   * 使用例子：<br />
   * <code>new MyConsole( { color: [ 255, 136, 0 ], } ).bgWhiteBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgWhiteBright方法，可参见chalk模块的bgWhiteBright方法的参数说明，必需。
   */
  bgWhiteBright( data ){
    console.log( this.#myChalk.bgWhiteBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黑色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgBlack( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlack方法，可参见chalk模块的bgBlack方法的参数说明，必需。
   */
  static BgBlack( data ){
    console.log( chalk.bgBlack( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为红色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgRed( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgRed方法，可参见chalk模块的bgRed方法的参数说明，必需。
   */
  static BgRed( data ){
    console.log( chalk.bgRed( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为绿色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgGreen( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGreen方法，可参见chalk模块的bgGreen方法的参数说明，必需。
   */
  static BgGreen( data ){
    console.log( chalk.bgGreen( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黄色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgYellow( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgYellow方法，可参见chalk模块的bgYellow方法的参数说明，必需。
   */
  static BgYellow( data ){
    console.log( chalk.bgYellow( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为蓝色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgBlue( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlue方法，可参见chalk模块的bgBlue方法的参数说明，必需。
   */
  static BgBlue( data ){
    console.log( chalk.bgBlue( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为洋红色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgMagenta( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgMagenta方法，可参见chalk模块的bgMagenta方法的参数说明，必需。
   */
  static BgMagenta( data ){
    console.log( chalk.bgMagenta( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为青色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgCyan( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgCyan方法，可参见chalk模块的bgCyan方法的参数说明，必需。
   */
  static BgCyan( data ){
    console.log( chalk.bgCyan( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为白色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgWhite( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgWhite方法，可参见chalk模块的bgWhite方法的参数说明，必需。
   */
  static BgWhite( data ){
    console.log( chalk.bgWhite( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为灰色的文字（BgBlackBright的别名）。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgGray( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGray方法，可参见chalk模块的bgGray方法的参数说明，必需。
   */
  static BgGray( data ){
    console.log( chalk.bgGray( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为灰色的文字（BgBlackBright的别名）。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgGrey( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGrey方法，可参见chalk模块的bgGrey方法的参数说明，必需。
   */
  static BgGrey( data ){
    console.log( chalk.bgGrey( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黑亮色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgBlackBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlackBright方法，可参见chalk模块的bgBlackBright方法的参数说明，必需。
   */
  static BgBlackBright( data ){
    console.log( chalk.bgBlackBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为红亮色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgRedBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgRedBright方法，可参见chalk模块的bgRedBright方法的参数说明，必需。
   */
  static BgRedBright( data ){
    console.log( chalk.bgRedBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为绿亮色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgGreenBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgGreenBright方法，可参见chalk模块的bgGreenBright方法的参数说明，必需。
   */
  static BgGreenBright( data ){
    console.log( chalk.bgGreenBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为黄亮色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgYellowBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgYellowBright方法，可参见chalk模块的bgYellowBright方法的参数说明，必需。
   */
  static BgYellowBright( data ){
    console.log( chalk.bgYellowBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为蓝亮色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgBlueBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgBlueBright方法，可参见chalk模块的bgBlueBright方法的参数说明，必需。
   */
  static BgBlueBright( data ){
    console.log( chalk.bgBlueBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为洋红亮的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgMagentaBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgMagentaBright方法，可参见chalk模块的bgMagentaBright方法的参数说明，必需。
   */
  static BgMagentaBright( data ){
    console.log( chalk.bgMagentaBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为青亮色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgCyanBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgCyanBright方法，可参见chalk模块的bgCyanBright方法的参数说明，必需。
   */
  static BgCyanBright( data ){
    console.log( chalk.bgCyanBright( data ) );
  }

  /**
   * 使用默认样式在控制台输出背景为白亮色的文字。<br />
   * 使用例子：<br />
   * <code>MyConsole.BgWhiteBright( 'XXX' );</code><br />
   *
   * @param {any} data data参数传给chalk模块的bgWhiteBright方法，可参见chalk模块的bgWhiteBright方法的参数说明，必需。
   */
  static BgWhiteBright( data ){
    console.log( chalk.bgWhiteBright( data ) );
  }

  // 背景颜色 End

}

export {
  GetDataType,
  Get__dirname,
  Get__filename,
  IsArray,
  IsNumber,
  IsString,

  MyConsole,
};

export default {
  GetDataType,
  Get__dirname,
  Get__filename,
  IsArray,
  IsNumber,
  IsString,

  MyConsole,
};
