/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/Main.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * UniversalTools.esm.mts的单元测试。
 */

'use strict';

import {
  chalk,
  Equal001,
  Test001,

  // @ts-ignore
} from './AuxiliaryTool.esm.test.mts';

import {
  // 类型转换。Start
  StringToUint8Array,
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

  // 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union。Start
  Difference,
  Intersection,
  SymmetricDifference,
  Union,
  // 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union。End

  // @ts-ignore
} from '../UniversalTools.esm.mts';

console.log( chalk.green( `\n符合期望值的不会输出任何信息，只输出不符合期望值所导致的错误信息。\n` ) );

// StringToUint8Array
if( true ){
  Test001( 'StringToUint8Array', (): void => {
    Equal001( new TextDecoder().decode( StringToUint8Array( 'StringToUint8Array' ) ) ).toBe( 'StringToUint8Array' );
  } );
}

// DateFormatForObject
if( true ){
  Test001( 'DateFormatForObject', (): void => {
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

// GetDataType
if( true ){
  Test001( 'GetDataType', (): void => {
    Equal001( GetDataType( [] ) ).toBe( '[object Array]' );
  } );
  Test001( 'GetDataType', (): void => {
    Equal001( GetDataType( Array( 2 ) ) ).toBe( '[object Array]' );
  } );
  Test001( 'GetDataType', (): void => {
    Equal001( GetDataType( new Array( 3 ) ) ).toBe( '[object Array]' );
  } );
}

// IsArray、IsNumber、IsString
if( true ){
  Test001( 'IsArray', (): void => {
    Equal001( IsArray( [] ) ).toBe( true );
  } );
  Test001( 'IsArray', (): void => {
    Equal001( IsArray( 1 ) ).toBe( false );
  } );
  Test001( 'IsArray', (): void => {
    Equal001( IsArray( Array( 2 ) ) ).toBe( true );
  } );
  Test001( 'IsArray', (): void => {
    Equal001( IsArray( new Array( 3 ) ) ).toBe( true );
  } );

  Test001( 'IsNumber', (): void => {
    Equal001( IsNumber( NaN ) ).toBe( true );
  } );
  Test001( 'IsNumber', (): void => {
    Equal001( IsNumber( 1 ) ).toBe( true );
  } );
  Test001( 'IsNumber', (): void => {
    Equal001( IsNumber( '1' ) ).toBe( false );
  } );
  Test001( 'IsNumber', (): void => {
    Equal001( IsNumber( Number( 1 ) ) ).toBe( true );
  } );
  Test001( 'IsNumber', (): void => {
    Equal001( IsNumber( new Number( 1 ) ) ).toBe( false );
  } );

  Test001( 'IsString', (): void => {
    Equal001( IsString( '' ) ).toBe( true );
  } );
  Test001( 'IsString', (): void => {
    Equal001( IsString( 1 ) ).toBe( false );
  } );
  Test001( 'IsString', (): void => {
    Equal001( IsString( String( '1' ) ) ).toBe( true );
  } );
  Test001( 'IsString', (): void => {
    Equal001( IsString( new String( '1' ) ) ).toBe( false );
  } );
}

// 数组之间的差集Difference、交集Intersection、对称差集SymmetricDifference、并集Union。
if( true ){
  // 差集Difference。
  Test001( 'Difference', (): void => {
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
  Test001( 'Intersection', (): void => {
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
  Test001( 'SymmetricDifference', (): void => {
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
  Test001( 'Union', (): void => {
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
