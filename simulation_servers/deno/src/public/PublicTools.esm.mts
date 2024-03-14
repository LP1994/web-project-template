/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/public/PublicTools.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-01 19:35:23 星期二
 */

/**
 * 特定于这个项目的公共的、通用的工具脚本。
 */

'use strict';

import {
  type DocumentNode,

  parse,
} from 'esm_sh_graphql';

import {
  // Deno自己有一个名为media_types的API功能跟它一样。
  mimetypes,
} from './ThirdPartyModules.esm.mts';

import {
  logDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type TypeDateFormatForObject,

  DateFormatForObject,
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type TypeMyCusDenoFsFile,

  CreateLogger,
} from 'public/Logger.esm.mts';

// Deno自己有一个名为media_types的API功能跟它一样。
const {
  MimeTypeMap,
  Mime,
  mime,
  mimelite,
}: any = mimetypes;

// Deno自己有一个名为media_types的API功能跟它一样。
mime.define( {
  'text/html; charset=utf-8': [
    'ejs',
  ],
  'application/json; charset=utf-8': [
    'json',
  ],
  'text/plain; charset=utf-8': [
    'gitignore',
    'txt',
  ],
}, true );

/**
 * @type {TypeMyCusDenoFsFile} 一个logWriteStream单例变量，一般用于记录常规日志信息什么的。
 */
let logWriteStream: TypeMyCusDenoFsFile | null = null;
/**
 * @type {TypeMyCusDenoFsFile} 一个errorWriteStream单例变量，一般用于记录错误信息什么的。
 */
let errorWriteStream: TypeMyCusDenoFsFile | null = null;

/**
 * 获取一个logWriteStream单例变量，一般用于记录常规日志信息什么的。
 *
 * @returns {Promise<TypeMyCusDenoFsFile>}
 */
async function GetLogWriteStreamForSingleton(): Promise<TypeMyCusDenoFsFile>{
  const {
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    day,
  }: TypeDateFormatForObject = DateFormatForObject();

  if( !logWriteStream ){
    logWriteStream = new Proxy( await CreateLogger( new URL( `${ logDir }/log_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒_周${ day }.log` ) ), {
      get( target: TypeMyCusDenoFsFile, propKey: string | symbol, receiver: unknown ): any{
        if( propKey === 'close' ){
          logWriteStream = null;
        }

        return Reflect.get( target, propKey, receiver );
      },
    } );
  }

  return logWriteStream as TypeMyCusDenoFsFile;
}

/**
 * 获取一个errorWriteStream单例变量，一般用于记录错误信息什么的。
 *
 * @returns {Promise<TypeMyCusDenoFsFile>}
 */
async function GetErrorWriteStreamForSingleton(): Promise<TypeMyCusDenoFsFile>{
  const {
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    day,
  }: TypeDateFormatForObject = DateFormatForObject();

  if( !errorWriteStream ){
    errorWriteStream = new Proxy( await CreateLogger( new URL( `${ logDir }/error_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒_周${ day }.log` ) ), {
      get( target: TypeMyCusDenoFsFile, propKey: string | symbol, receiver: unknown ): any{
        if( propKey === 'close' ){
          errorWriteStream = null;
        }

        return Reflect.get( target, propKey, receiver );
      },
    } );
  }

  return errorWriteStream as TypeMyCusDenoFsFile;
}

/**
 * 处理嵌套的“Promise”（形如：Promise<Promise<Promise<T>>>等等这样的多层嵌套，嵌套层数也是未知的），使其只返回最终的不带“Promise”的结果值。
 *
 * @param {Promise<T> | T} arg 需要被处理的数据，无默认值，必需。
 *
 * @returns {Promise<T>} 返回最终的不带“Promise”的结果值（就是“T”）。
 */
async function IterateToNestForPromise<T>( arg: T | Promise<T> ): Promise<T>{
  let result: T;

  if( Object.prototype.toString.call( arg ) !== '[object Promise]' ){
    result = arg as T;
  }
  else if( Object.prototype.toString.call( arg = await arg ) === '[object Promise]' ){
    result = await IterateToNestForPromise( arg as Promise<T> );
  }
  else{
    result = arg as T;
  }

  return result;
}

/**
 * 根据一个内容是“GraphQL类型定义（即：GraphQL source）”的文件的路径，将其中的“GraphQL类型定义（即：GraphQL source）”解析为“DocumentNode”。
 * PS：
 * 1、如果解析过程遇到语法错误，则抛出GraphQLError。
 * 2、在读取文件内容时，以UTF-8解码字符串的形式同步读取并返回文件的全部内容。读取目录时会出错。
 * 例如：
 * // Hello.type.graphql
 * type Query {
 *   hello: String,
 * }
 * // Hello.query.esm.mts
 * GraphqlParseByFilePath( new URL( import.meta.resolve( `./Hello.type.graphql` ) ) );
 *
 * @param {string | URL} path 文件路径，无默认值，必须。
 * 该值形如：new URL( import.meta.resolve( `./Hello.type.graphql` ) )。
 *
 * @returns {DocumentNode} 返回一个DocumentNode。
 */
function GraphqlParseByFilePath( path: string | URL ): DocumentNode{
  return parse( Deno.readTextFileSync( path ) );
}

export {
  type TypeMyCusDenoFsFile,

  GetLogWriteStreamForSingleton,
  GetErrorWriteStreamForSingleton,

  // Deno自己有一个名为media_types的API功能跟它一样。
  MimeTypeMap,
  Mime,
  mime,
  mimelite,

  IterateToNestForPromise,
  GraphqlParseByFilePath,
};

export default {
  GetLogWriteStreamForSingleton,
  GetErrorWriteStreamForSingleton,

  // Deno自己有一个名为media_types的API功能跟它一样。
  MimeTypeMap,
  Mime,
  mime,
  mimelite,

  IterateToNestForPromise,
  GraphqlParseByFilePath,
};
