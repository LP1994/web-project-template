/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/tools/universal_tool_for_node/unit_test/Main.test.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * UniversalToolForNode.esm.mjs的单元测试。
 */

'use strict';

import {
  Equal001,
  Test001,
} from './AuxiliaryTool.esm.mjs';

import {
  GetDataType,
  Get__dirname,
  Get__filename,
  IsArray,
  IsNumber,
  IsString,

  MyConsole,
} from '../UniversalToolForNode.esm.mjs';

// GetDataType
if( true ){
  Test001( 'GetDataType', () => {
    Equal001( GetDataType( [] ) ).toBe( '[object Array]' );
  } );
}

// IsArray、IsNumber、IsString
if( true ){
  Test001( 'IsArray', () => {
    Equal001( IsArray( [] ) ).toBe( true );
  } );
  Test001( 'IsArray', () => {
    Equal001( IsArray( 1 ) ).toBe( false );
  } );

  Test001( 'IsNumber', () => {
    Equal001( IsNumber( NaN ) ).toBe( true );
  } );
  Test001( 'IsNumber', () => {
    Equal001( IsNumber( 1 ) ).toBe( true );
  } );
  Test001( 'IsNumber', () => {
    Equal001( IsNumber( '1' ) ).toBe( false );
  } );

  Test001( 'IsString', () => {
    Equal001( IsString( '' ) ).toBe( true );
  } );
  Test001( 'IsString', () => {
    Equal001( IsString( 1 ) ).toBe( false );
  } );
}

// Get__dirname、Get__filename
if( true ){
  Test001( 'Get__dirname', () => {
    Equal001( Get__dirname( import.meta.url ) )
    .toBe( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\node\\tools\\universal_tool_for_node\\unit_test' );
  } );

  Test001( 'Get__filename', () => {
    Equal001( Get__filename( import.meta.url ) )
    .toBe( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\node\\tools\\universal_tool_for_node\\unit_test\\Main.test.mjs' );
  } );
}

// MyConsole类的构造方法（无参数）：new MyConsole()
if( false ){
  const myConsoleIns001 = new MyConsole();

  myConsoleIns001.underline( '带下划线的文字' );
  myConsoleIns001.bold( '粗体文字' );
  myConsoleIns001.dim( '暗淡的文字' );
  myConsoleIns001.overline( '带上划线的文字' );
  myConsoleIns001.italic( '斜体文字' );
  myConsoleIns001.inverse( '反转背景色和前景色的文字' );
  myConsoleIns001.hidden( '输出但是隐藏文字' );
  myConsoleIns001.strikethrough( '带删除线的文字' );
  myConsoleIns001.visible( '常规的可见文字' );

  myConsoleIns001.green( '绿色文字' );
  myConsoleIns001.redBright( '红亮文字' );

  myConsoleIns001.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的构造方法（有参数）：new MyConsole()
if( false ){
  const myConsoleIns001 = new MyConsole( {
    color: [
      255,
      136,
      0
    ],
    bgColor: '#8137ef',
  } );

  myConsoleIns001.underline( '带下划线的文字' );
  myConsoleIns001.bold( '粗体文字' );
  myConsoleIns001.dim( '暗淡的文字' );
  myConsoleIns001.overline( '带上划线的文字' );
  myConsoleIns001.italic( '斜体文字' );
  myConsoleIns001.inverse( '反转背景色和前景色的文字' );
  myConsoleIns001.hidden( '输出但是隐藏文字' );
  myConsoleIns001.strikethrough( '带删除线的文字' );
  myConsoleIns001.visible( '常规的可见文字' );

  myConsoleIns001.green( '绿色文字' );
  myConsoleIns001.redBright( '红亮文字' );

  myConsoleIns001.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的实例方法：reset()
if( false ){
  const myConsoleIns = new MyConsole( {
    color: [
      255,
      136,
      0
    ],
    bgColor: '#F6F712',
  } );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );

  console.log( '以上是自定义的样式！！！！！！！！！！！！' );

  console.log( '以下是重置当前已经自定义的样式，回到默认样式！！！！！！！！！！！！' );

  myConsoleIns.reset();

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的实例方法：setRGB()
if( false ){
  const myConsoleIns = new MyConsole( {
    color: [
      255,
      136,
      0
    ],
    bgColor: '#F6F712',
  } );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );

  console.log( '以上是自定义字体颜色1的样式！！！！！！！！！！！！' );

  console.log( '以下是自定义RGB字体颜色2的样式！！！！！！！！！！！！' );

  myConsoleIns.setRGB( [
    136,
    136,
    136
  ] );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的实例方法：setHEX()
if( false ){
  const myConsoleIns = new MyConsole( {
    color: [
      255,
      136,
      0
    ],
    bgColor: '#F6F712',
  } );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );

  console.log( '以上是自定义字体颜色1的样式！！！！！！！！！！！！' );

  console.log( '以下是自定义HEX字体颜色2的样式！！！！！！！！！！！！' );

  myConsoleIns.setHEX( '#24de61' );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的实例方法：setANSI256()
if( false ){
  const myConsoleIns = new MyConsole( {
    color: '#e82c7a',
    bgColor: '#772ce8',
  } );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );

  console.log( '以上是自定义字体颜色1的样式！！！！！！！！！！！！' );

  console.log( '以下是自定义ANSI256字体颜色2的样式！！！！！！！！！！！！' );

  myConsoleIns.setANSI256( 100 );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的实例方法：setBgRGB()
if( false ){
  const myConsoleIns = new MyConsole( {
    color: '#1240f7',
    bgColor: '#F6F712',
  } );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );

  console.log( '以上是自定义背景色1的样式！！！！！！！！！！！！' );

  console.log( '以下是自定义RGB背景色2的样式！！！！！！！！！！！！' );

  myConsoleIns.setBgRGB( [
    136,
    136,
    136
  ] );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的实例方法：setBgHEX()
if( false ){
  const myConsoleIns = new MyConsole( {
    color: '#1240f7',
    bgColor: '#F6F712',
  } );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );

  console.log( '以上是自定义背景色1的样式！！！！！！！！！！！！' );

  console.log( '以下是自定义HEX背景色2的样式！！！！！！！！！！！！' );

  myConsoleIns.setBgHEX( '#f7126a' );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的实例方法：setBgANSI256()
if( false ){
  const myConsoleIns = new MyConsole( {
    color: '#1240f7',
    bgColor: '#ef12f7',
  } );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );

  console.log( '以上是自定义背景色1的样式！！！！！！！！！！！！' );

  console.log( '以下是自定义ANSI256背景色2的样式！！！！！！！！！！！！' );

  myConsoleIns.setBgANSI256( 194 );

  myConsoleIns.underline( '带下划线的文字' );
  myConsoleIns.bold( '粗体文字' );
  myConsoleIns.dim( '暗淡的文字' );
  myConsoleIns.overline( '带上划线的文字' );
  myConsoleIns.italic( '斜体文字' );
  myConsoleIns.inverse( '反转背景色和前景色的文字' );
  myConsoleIns.hidden( '输出但是隐藏文字' );
  myConsoleIns.strikethrough( '带删除线的文字' );
  myConsoleIns.visible( '常规的可见文字' );

  myConsoleIns.green( '绿色文字' );
  myConsoleIns.redBright( '红亮文字' );

  myConsoleIns.bgCyanBright( '背景为青亮色的文字' );
}
// MyConsole类的所有“static（静态）”方法
if( false ){
  MyConsole.Underline( '带下划线的文字' );
  MyConsole.Bold( '粗体文字' );
  MyConsole.Dim( '暗淡的文字' );
  MyConsole.Overline( '带上划线的文字' );
  MyConsole.Italic( '斜体文字' );
  MyConsole.Inverse( '反转背景色和前景色的文字' );
  MyConsole.Hidden( '输出但是隐藏文字' );
  MyConsole.Strikethrough( '带删除线的文字' );
  MyConsole.Visible( '常规的可见文字' );

  MyConsole.Black( '黑色文字' );
  MyConsole.Red( '红色文字' );
  MyConsole.Green( '绿色文字' );
  MyConsole.Yellow( '黄色文字' );
  MyConsole.Blue( '蓝色文字' );
  MyConsole.Magenta( '洋红色文字' );
  MyConsole.Cyan( '青色文字' );
  MyConsole.White( '白色文字' );
  MyConsole.Gray( '灰色文字' );
  MyConsole.Grey( '灰色文字' );
  MyConsole.BlackBright( '黑亮文字' );
  MyConsole.RedBright( '红亮文字' );
  MyConsole.GreenBright( '绿亮文字' );
  MyConsole.YellowBright( '黄亮文字' );
  MyConsole.BlueBright( '蓝亮文字' );
  MyConsole.MagentaBright( '洋红亮文字' );
  MyConsole.CyanBright( '青亮文字' );
  MyConsole.WhiteBright( '白亮文字' );

  MyConsole.BgBlack( '背景为黑色的文字' );
  MyConsole.BgRed( '背景为红色的文字' );
  MyConsole.BgGreen( '背景为绿色的文字' );
  MyConsole.BgYellow( '背景为黄色的文字' );
  MyConsole.BgBlue( '背景为蓝色的文字' );
  MyConsole.BgMagenta( '背景为洋红色的文字' );
  MyConsole.BgCyan( '背景为青色的文字' );
  MyConsole.BgWhite( '背景为白色的文字' );
  MyConsole.BgGray( '背景为灰色的文字' );
  MyConsole.BgGrey( '背景为灰色的文字' );
  MyConsole.BgBlackBright( '背景为黑亮色的文字' );
  MyConsole.BgRedBright( '背景为红亮色的文字' );
  MyConsole.BgGreenBright( '背景为绿亮色的文字' );
  MyConsole.BgYellowBright( '背景为黄亮色的文字' );
  MyConsole.BgBlueBright( '背景为蓝亮色的文字' );
  MyConsole.BgMagentaBright( '背景为洋红亮的文字' );
  MyConsole.BgCyanBright( '背景为青亮色的文字' );
  MyConsole.BgWhiteBright( '背景为白亮色的文字' );
}
// MyConsole类的所有“实例”方法
if( false ){
  const myConsoleIns001 = new MyConsole( {
    color: '#a4ee53',
    bgColor: '#b237ef',
  } );

  myConsoleIns001.underline( '带下划线的文字' );
  myConsoleIns001.bold( '粗体文字' );
  myConsoleIns001.dim( '暗淡的文字' );
  myConsoleIns001.overline( '带上划线的文字' );
  myConsoleIns001.italic( '斜体文字' );
  myConsoleIns001.inverse( '反转背景色和前景色的文字' );
  myConsoleIns001.hidden( '输出但是隐藏文字' );
  myConsoleIns001.strikethrough( '带删除线的文字' );
  myConsoleIns001.visible( '常规的可见文字' );

  myConsoleIns001.black( '黑色文字' );
  myConsoleIns001.red( '红色文字' );
  myConsoleIns001.green( '绿色文字' );
  myConsoleIns001.yellow( '黄色文字' );
  myConsoleIns001.blue( '蓝色文字' );
  myConsoleIns001.magenta( '洋红色文字' );
  myConsoleIns001.cyan( '青色文字' );
  myConsoleIns001.white( '白色文字' );
  myConsoleIns001.gray( '灰色文字' );
  myConsoleIns001.grey( '灰色文字' );
  myConsoleIns001.blackBright( '黑亮文字' );
  myConsoleIns001.redBright( '红亮文字' );
  myConsoleIns001.greenBright( '绿亮文字' );
  myConsoleIns001.yellowBright( '黄亮文字' );
  myConsoleIns001.blueBright( '蓝亮文字' );
  myConsoleIns001.magentaBright( '洋红亮文字' );
  myConsoleIns001.cyanBright( '青亮文字' );
  myConsoleIns001.whiteBright( '白亮文字' );

  myConsoleIns001.bgBlack( '背景为黑色的文字' );
  myConsoleIns001.bgRed( '背景为红色的文字' );
  myConsoleIns001.bgGreen( '背景为绿色的文字' );
  myConsoleIns001.bgYellow( '背景为黄色的文字' );
  myConsoleIns001.bgBlue( '背景为蓝色的文字' );
  myConsoleIns001.bgMagenta( '背景为洋红色的文字' );
  myConsoleIns001.bgCyan( '背景为青色的文字' );
  myConsoleIns001.bgWhite( '背景为白色的文字' );
  myConsoleIns001.bgGray( '背景为灰色的文字' );
  myConsoleIns001.bgGrey( '背景为灰色的文字' );
  myConsoleIns001.bgBlackBright( '背景为黑亮色的文字' );
  myConsoleIns001.bgRedBright( '背景为红亮色的文字' );
  myConsoleIns001.bgGreenBright( '背景为绿亮色的文字' );
  myConsoleIns001.bgYellowBright( '背景为黄亮色的文字' );
  myConsoleIns001.bgBlueBright( '背景为蓝亮色的文字' );
  myConsoleIns001.bgMagentaBright( '背景为洋红亮的文字' );
  myConsoleIns001.bgCyanBright( '背景为青亮色的文字' );
  myConsoleIns001.bgWhiteBright( '背景为白亮色的文字' );
}
