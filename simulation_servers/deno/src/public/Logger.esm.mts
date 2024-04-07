/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/public/Logger.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-03 01:28:49 星期六
 */

/**
 * 该工具用于打开文件（没有就创建一个新的文件再打开），并持续写入。一般用于日志记录什么的。
 */

'use strict';

import {
  type T_DateFormatForObject,

  DateFormatForObject,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

/**
 * 该类型别名同“Deno.OpenOptions”，详细见：https://deno.land/api?s=Deno.OpenOptions
 */
export type T_DenoOpenOptions = Partial<{
  read: boolean;
  write: boolean;
  append: boolean;
  truncate: boolean;
  create: boolean;
  createNew: boolean;
  mode: number;
}>;

/**
 * 自定义的一个类似Deno.FsFile的类型别名，详细见：https://deno.land/api?s=Deno.FsFile。
 */
export type T_MyCusDenoFsFile = {
  /**
   * 文件开始写入数据。
   *
   * @param {string} data 写入的数据，默认值为空字符串，可选。
   *
   * @returns {Promise<number>} 返回的是本次写入的字节数。
   */
  write( data?: string ): Promise<number>;
  /**
   * 关闭文件的写入。
   *
   * @returns {void}
   */
  close(): void;
};

let loggerForSingleton: T_MyCusDenoFsFile | null = null;

/**
 * 用于打开文件（没有就创建一个新的文件再打开），并持续写入。一般用于日志记录什么的。
 *
 * @param {string | URL} filePath 文件路径，必需。
 *
 * @param {T_DenoOpenOptions} denoOpenOptions 文件标志对象，默认值为：{ write: true, create: true, append: true, }，表示打开文件（没有就创建一个新的文件再打开），并持续写入，不断地追加而不是覆盖先前的内容，可选。
 *
 * @returns {Promise<T_MyCusDenoFsFile>} 返回一个自定义对象，里面有两个函数，一个是文件开始写入数据：write(data?: string): Promise<number>、一个是关闭文件的写入：close(): void。
 */
async function CreateLogger( filePath: string | URL, denoOpenOptions: T_DenoOpenOptions = {
  create: true,
  write: true,
  append: true,
} ): Promise<T_MyCusDenoFsFile>{
  const file: Deno.FsFile = await Deno.open( new URL( filePath ), denoOpenOptions );

  return {
    /**
     * 文件开始写入数据。
     *
     * @param {string} data 写入的数据，默认值为空字符串，可选。
     *
     * @returns {Promise<number>} 返回的是本次写入的字节数。
     */
    write( data: string = '' ): Promise<number>{
      const {
        year,
        month,
        date,
        hours,
        minutes,
        seconds,
        day,
      }: T_DateFormatForObject = DateFormatForObject();

      return file.write( new TextEncoder().encode( `
------------------>${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒_周${ day }<------------------
${ data }` ) );
    },
    /**
     * 关闭文件的写入。
     *
     * @returns {void}
     */
    close(): void{
      file.close();
    },
  };
}

/**
 * 单例版本的CreateLogger，用于打开文件（没有就创建一个新的文件再打开），并持续写入。一般用于日志记录什么的。
 *
 * @param {string | URL} filePath 文件路径，必需。
 *
 * @param {T_DenoOpenOptions} denoOpenOptions 文件标志对象，默认值为：{ write: true, create: true, append: true, }，表示打开文件（没有就创建一个新的文件再打开），并持续写入，不断地追加而不是覆盖先前的内容，可选。
 *
 * @returns {Promise<T_MyCusDenoFsFile>} 返回一个自定义对象，里面有两个函数，一个是文件开始写入数据：write(data?: string): Promise<number>、一个是关闭文件的写入：close(): void。
 */
async function CreateLoggerForSingleton( filePath: string | URL, denoOpenOptions: T_DenoOpenOptions = {
  create: true,
  write: true,
  append: true,
} ): Promise<T_MyCusDenoFsFile>{
  if( !loggerForSingleton ){
    const file: Deno.FsFile = await Deno.open( new URL( filePath ), denoOpenOptions );

    loggerForSingleton = {
      /**
       * 文件开始写入数据。
       *
       * @param {string} data 写入的数据，默认值为空字符串，可选。
       *
       * @returns {Promise<number>} 返回的是本次写入的字节数。
       */
      write( data: string = '' ): Promise<number>{
        const {
          year,
          month,
          date,
          hours,
          minutes,
          seconds,
          day,
        }: T_DateFormatForObject = DateFormatForObject();

        return file.write( new TextEncoder().encode( `
------------------>${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒_周${ day }<------------------
${ data }` ) );
      },
      /**
       * 关闭文件的写入。
       *
       * @returns {void}
       */
      close(): void{
        loggerForSingleton = null;

        file.close();
      },
    };
  }

  return loggerForSingleton as T_MyCusDenoFsFile;
}

export {
  CreateLogger,
  CreateLoggerForSingleton,
};

export default {
  CreateLogger,
  CreateLoggerForSingleton,
};
