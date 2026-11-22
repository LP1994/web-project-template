/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/file_hash_wasm_by_rust/WorkerThread.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2026-11-21 19:58:50 星期六
 */

'use strict';

import {
  createReadStream,
  ReadStream,
} from 'node:fs';

import {
  performance,
} from 'node:perf_hooks';

import {
  isMainThread,
  parentPort,
  threadId,
  workerData,
} from 'node:worker_threads';

import {
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

const hashTypes = workerData.hashTypes;

type T_HashTypeKey = keyof typeof hashTypes;

type T_EncodeType = {
  hex: string;
  base64: string;
} | {
  hex: string;
} | {
  base64: string;
};

let startTimer: number = 0,
  readStream: ReadStream,
  chunk: Uint8Array,
  chunkLen: number = 0,
  bytesReaded: number = 0,
  // @ts-ignore
  hasher;

/**
 * 1、1 * 1024 * 1024 * 1024 = 1GB、4 * 1024 * 1024 = 4MB，设置成1GB并没比4MB快多少，所以设置成4MB还是合理、合适的。
 * 2、要是设置了buffer.constants.MAX_LENGTH，不报错、也不执行，直接结束了，奇怪：
 * buffer.constants.MAX_LENGTH = 2GB
 *
 * @type {number}
 */
const bufferSize: number = workerData.chunkSize ?? 4 * 1024 * 1024;

// @ts-ignore
let MyFileHasher = null;

async function GetFileHasherModule(){
  // @ts-ignore
  if( MyFileHasher ){
    return MyFileHasher;
  }
  else{
    (
      {
        FileHasher: MyFileHasher,
      } = await import( './dist/FileHashWasmByRust.js' )
    );

    return MyFileHasher;
  }
}

function CalculateFileHash(
  filePath: URL,
  hashOptions: Partial<Record<T_HashTypeKey, T_EncodeType>>,
  chunkSize: number = bufferSize,
): Promise<Partial<Record<T_HashTypeKey, T_EncodeType>>>{
  return new Promise( async ( resolve: ( arg: Partial<Record<T_HashTypeKey, T_EncodeType>> ) => void, reject: ( arg: unknown ) => void ): Promise<void> => {
    hasher = new ( await GetFileHasherModule() )( hashOptions );

    readStream = createReadStream( filePath, {
      flags: 'r',
    } );

    readStream.on( 'open', ( fd: unknown ): void => {
      MyConsole.Cyan( `
${ filePath.href }
文件已打开：${ fd }。
` );
    } );

    readStream.on( 'ready', (): void => {
      MyConsole.Cyan( `
${ filePath.href }
文件已准备好。
` );
    } );

    readStream.on( 'readable', (): void => {
      while( null !== ( chunk = readStream!.read( chunkSize ) ) ){
        // @ts-ignore
        hasher.update( chunk );

        chunkLen = chunk.length;

        bytesReaded = readStream!.bytesRead;

        MyConsole.Cyan( `
${ filePath.href }
每次从文件读取到的数据块的大小：${ chunkLen }字节，约为${ ( chunkLen / 1024 ).toFixed( 6 ) }KB，约为${ ( chunkLen / 1024 / 1024 ).toFixed( 12 ) }MB，约为${ ( chunkLen / 1024 / 1024 / 1024 ).toFixed( 18 ) }GB。
已经从文件读取了的总数据流大小：${ bytesReaded }字节，约为${ ( bytesReaded / 1024 ).toFixed( 6 ) }KB，约为${ ( bytesReaded / 1024 / 1024 ).toFixed( 12 ) }MB，约为${ ( bytesReaded / 1024 / 1024 / 1024 ).toFixed( 18 ) }GB。
` );
      }
    } );

    readStream.on( 'end', (): void => {
      MyConsole.Blue( `
${ filePath.href }
文件读取已完成。
` );
    } );

    readStream.on( 'close', (): void => {
      // @ts-ignore
      MyConsole.Blue( `\n${ filePath.href }\n文件已关闭。\n本次文件哈希计算工具已经处理了的总字节数（单位为：字节），注意这里返回的是bigint类型的值：${ hasher.bytesProcessed() }\n` );

      // @ts-ignore
      resolve( hasher.digest() );
    } );

    readStream.on( 'error', ( error: unknown ): void => {
      MyConsole.Red( `
${ filePath.href }
文件出错：
${ error }
` );

      reject( error );
    } );
  } );
}

if( !isMainThread ){
  parentPort!.on( 'close', (): void => {
    MyConsole.Blue( `
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
该端口已关闭。
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );
  } );

  parentPort!.on( 'messageerror', ( errorObject: unknown ): void => {
    MyConsole.Red( `
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );
  } );

  parentPort!.on( 'message', async ( {
    filePath,
    hashOptions,
  }: {
    filePath: string;
    hashOptions: Partial<Record<T_HashTypeKey, T_EncodeType>>;
  } ): Promise<void> => {
    startTimer = performance.now();

    const hash: Partial<Record<T_HashTypeKey, T_EncodeType>> = await CalculateFileHash( new URL( filePath ), hashOptions, bufferSize );

    parentPort!.postMessage( {
      hash,
      takeUpTime: performance.now() - startTimer,
    } );
  } );
}
