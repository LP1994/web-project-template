/**
 * Project: web-project-template
 * FileDirPath: src/tools/ts/universal_tools/unit_test/MainAll.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * UniversalTools.esm.mts的全部单元测试。
 */

'use strict';

import {
  type ExecSyncOptionsWithBufferEncoding,

  execSync,
} from 'node:child_process';

import {
  readdirSync,
  statSync,
} from 'node:fs';

import {
  join,
} from 'node:path';

const config: ExecSyncOptionsWithBufferEncoding = {
    // 进程允许运行的最长时间（毫秒），默认值：未定义。值类型：number。
    timeout: 1 * 60 * 60 * 1000,
    // stdout 或 stderr 上允许的最大数据量（以字节为单位）。如果超过，子进程将被终止，所有输出将被截断。请参阅 maxBuffer 和 Unicode 的注意事项。默认值：1024 * 1024。
    maxBuffer: 10 * 1024 * 1024 * 1024,
    // 用于所有 stdio 输入和输出的编码。默认值："buffer"。
    encoding: 'buffer',
    windowsHide: false,
  },
  unit_testForPath: string = join( import.meta.dirname as string, './' ),
  getDir = ( path: string = '' ): string[] => readdirSync( path ),
  isDir = ( path: string = '' ): boolean => statSync( path ).isDirectory(),
  commandArr: string[] = getDir( unit_testForPath ).filter( (
    item: string,
    // @ts-expect-error
    index: number,
    // @ts-expect-error
    array: string[],
  ): boolean => isDir( `${ unit_testForPath }./${ item }` ) ).map( (
    item: string,
    // @ts-expect-error
    index: number,
    // @ts-expect-error
    array: string[],
  ): string => `tsx --no-cache --tsconfig ../../../../../tsconfig.tsx.json ./${ item }/Main.test.mts` ),
  commands: string = commandArr.join( '&' );

console.log( `\n\n正在执行全部的的单元测试（一共${ commandArr.length }个），请稍等！！！\n\n` );

const stdoutFromCommand001: string = execSync( commands, config ).toString( 'utf8', );

console.log( stdoutFromCommand001 );
