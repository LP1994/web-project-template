/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/node/src/tools/universal_tool_for_node/unit_test/Main.test.mjs
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
  chalk,
  Equal001,
  Test001,
} from './AuxiliaryTool.esm.test.mjs';

import {
  // 模拟Node环境下“CommonJS”模块化中的“__filename”、“__dirname”。 Start
  Get__dirname,
  Get__filename,
  // 模拟Node环境下“CommonJS”模块化中的“__filename”、“__dirname”。 End

  // Date格式处理。End
  DateFormatForObject,
  // Date格式处理。Start

  // 判断数据类型。Start
  GetDataType,
  IsArray,
  IsNumber,
  IsString,
  // 判断数据类型。End

  // 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union。Start
  Difference,
  Intersection,
  SymmetricDifference,
  Union,
  // 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union。End
} from '../UniversalToolForNode.esm.mjs';

console.log( chalk.green( `\n符合期望值的不会输出任何信息，只输出不符合期望值所导致的错误信息。\n` ) );

// DateFormatForObject
if( true ){
  Test001( 'DateFormatForObject', () => {
    Equal001( JSON.stringify( DateFormatForObject( new Date( 1670010887679 ) ) ) ).toBe( JSON.stringify( {
      year: '2022',
      month: '12',
      date: '03',
      hours: '03',
      minutes: '54',
      seconds: '47',
      day: '6'
    } ) );
  } );
}

// Get__dirname、Get__filename
if( true ){
  Test001( 'Get__dirname', () => {
    Equal001( Get__dirname( import.meta.url ) )
    .toBe( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\node\\src\\tools\\universal_tool_for_node\\unit_test' );
  } );

  Test001( 'Get__filename', () => {
    Equal001( Get__filename( import.meta.url ) )
    .toBe( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\node\\src\\tools\\universal_tool_for_node\\unit_test\\Main.test.mjs' );
  } );
}

// GetDataType
if( true ){
  Test001( 'GetDataType', () => {
    Equal001( GetDataType( [] ) ).toBe( '[object Array]' );
  } );
  Test001( 'GetDataType', () => {
    Equal001( GetDataType( Array( 2 ) ) ).toBe( '[object Array]' );
  } );
  Test001( 'GetDataType', () => {
    Equal001( GetDataType( new Array( 3 ) ) ).toBe( '[object Array]' );
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
  Test001( 'IsArray', () => {
    Equal001( IsArray( Array( 2 ) ) ).toBe( true );
  } );
  Test001( 'IsArray', () => {
    Equal001( IsArray( new Array( 3 ) ) ).toBe( true );
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
  Test001( 'IsNumber', () => {
    Equal001( IsNumber( Number( 1 ) ) ).toBe( true );
  } );
  Test001( 'IsNumber', () => {
    Equal001( IsNumber( new Number( 1 ) ) ).toBe( false );
  } );

  Test001( 'IsString', () => {
    Equal001( IsString( '' ) ).toBe( true );
  } );
  Test001( 'IsString', () => {
    Equal001( IsString( 1 ) ).toBe( false );
  } );
  Test001( 'IsString', () => {
    Equal001( IsString( String( '1' ) ) ).toBe( true );
  } );
  Test001( 'IsString', () => {
    Equal001( IsString( new String( '1' ) ) ).toBe( false );
  } );
}

// 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union。
if( true ){
  // 差集Difference。
  Test001( 'Difference', () => {
    Equal001( JSON.stringify( Difference(
      [
        1,
        2,
        3,
        3,
        4,
      ],
      [
        2,
        3,
        4,
        5,
        6,
      ]
    ) ) ).toBe( JSON.stringify( [ 1, ] ) );
  } );

  // 交集Intersection。
  Test001( 'Intersection', () => {
    Equal001( JSON.stringify( Intersection(
      [
        1,
        2,
        3,
        3,
        4,
      ],
      [
        2,
        3,
        4,
        5,
        6,
      ]
    ) ) ).toBe( JSON.stringify( [
      2,
      3,
      4,
    ] ) );
  } );

  // 对称差集SymmetricDifference。
  Test001( 'SymmetricDifference', () => {
    Equal001( JSON.stringify( SymmetricDifference(
      [
        1,
        2,
        3,
        3,
        4,
      ],
      [
        2,
        3,
        4,
        5,
        6,
      ]
    ) ) ).toBe( JSON.stringify( [
      1,
      5,
      6,
    ] ) );
  } );

  // 并集Union。
  Test001( 'Union', () => {
    Equal001( JSON.stringify( Union(
      [
        1,
        2,
        3,
        4,
      ],
      [
        2,
        3,
        4,
        5,
        6,
      ]
    ) ) ).toBe( JSON.stringify( [
      1,
      2,
      3,
      4,
      5,
      6,
    ] ) );
  } );
}
