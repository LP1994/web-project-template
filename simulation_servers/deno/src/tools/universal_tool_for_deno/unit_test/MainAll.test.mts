#!/usr/bin/env -S deno run -A --config=../../../../deno.json --check --v8-flags=--max-old-space-size=1024000 --reload --unstable-hmr

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/universal_tool_for_deno/unit_test/MainAll.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * UniversalToolForDeno.esm.mts的全部单元测试。
 */

'use strict';

import {
  join,
} from 'deno_std_path';

const unit_testForPath: string = join( import.meta.dirname as string, './' ),
  getDir: ( path: string ) => Iterable<Deno.DirEntry> = ( path: string = '' ): Iterable<Deno.DirEntry> => Deno.readDirSync( path ),
  commandArr: Array<string> = ( Array.from( getDir( unit_testForPath ) ) as Array<Deno.DirEntry> ).filter( (
    item: Deno.DirEntry,
    // @ts-expect-error
    index: number,
    // @ts-expect-error
    array: Array<Deno.DirEntry>,
  ): boolean => item.isDirectory ).map( (
    item: Deno.DirEntry,
    // @ts-expect-error
    index: number,
    // @ts-expect-error
    array: Array<Deno.DirEntry>,
  ): string => `./${ item.name }/Main.test.mts` );

console.log( `\n\n正在执行全部的的单元测试（一共${ commandArr.length }个），请稍等！！！\n\n` );

for(
  let i: number = 0;
  i < commandArr.length;
  ++i
){
  const command: Deno.Command = new Deno.Command( 'deno', {
    args: [
      'run',
      '-A',
      '--config=../../../../deno.json',
      '--check',
      '--v8-flags=--max-old-space-size=1024000',
      `${ commandArr[ i ] }`,
      '--color=16m',
    ],
  } );

  const {
    stdout,
    stderr,
  }: Deno.CommandOutput = command.outputSync();

  console.log( new TextDecoder().decode( stdout ) );

  console.error( new TextDecoder().decode( stderr ) );
}
