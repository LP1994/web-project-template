/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/tools/file_hash_wasm_by_rust/FileHashWasmByRustForMultiThread.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2026-11-21 19:58:50 星期六
 */

'use strict';

import {
  cpus,
} from 'node:os';

import {
  performance,
} from 'node:perf_hooks';

import {
  isMainThread,
  Worker,
} from 'node:worker_threads';

import {
  MyConsole,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

export type T_HashName = 'md5' |
  'sha1' |
  'sha224' |
  'sha256' |
  'sha384' |
  'sha512' |
  'sha3-224' | 'sha3-256' | 'sha3-384' | 'sha3-512';

export type T_EncodeType = {
  hex: string;
  base64: string;
} | {
  hex: string;
} | {
  base64: string;
};

const hashTypes = {
  'md5': 'md5',

  'sha1': 'sha1',
  'sha-1': 'sha1',

  'sha224': 'sha224',
  'sha-224': 'sha224',
  'sha2-224': 'sha224',

  'sha256': 'sha256',
  'sha-256': 'sha256',
  'sha2-256': 'sha256',

  'sha384': 'sha384',
  'sha-384': 'sha384',
  'sha2-384': 'sha384',

  'sha512': 'sha512',
  'sha-512': 'sha512',
  'sha2-512': 'sha512',

  'sha3-224': 'sha3-224',
  'sha3-256': 'sha3-256',
  'sha3-384': 'sha3-384',
  'sha3-512': 'sha3-512',
} as const;

export type T_HashTypeKey = keyof typeof hashTypes;

function CheckHashTypes( hashOptions: Record<T_HashTypeKey, T_EncodeType> ){
  const hashTypeKeys: Array<T_HashTypeKey> = Object.keys( hashTypes ) as Array<T_HashTypeKey>;

  if( Object.keys( hashOptions ).length === 0 || Object.keys( hashOptions ).some( ( item: string ): boolean => {
    return !hashTypeKeys.includes( item as T_HashTypeKey );
  } ) ){
    throw new Error( `当前只支持如下的哈希算法：${ hashTypeKeys.join( ', ' ) }，注意是大小写敏感的，必须严格匹配支持的哈希算法名！` );
  }
}

function GetHashGroup( hashOptions: Record<T_HashTypeKey, T_EncodeType> ): Array<Record<T_HashTypeKey, T_EncodeType>>{
  const hashOptionsKeys: Array<[ T_HashTypeKey, T_EncodeType ]> = Object.entries( hashOptions ) as Array<[ T_HashTypeKey, T_EncodeType ]>,
    hashObj: Record<T_HashName, Record<T_HashTypeKey, T_EncodeType>> = {} as Record<T_HashName, Record<T_HashTypeKey, T_EncodeType>>;

  hashOptionsKeys.forEach( ( [ item, value ]: [ T_HashTypeKey, T_EncodeType ] ): void => {
    if( ( hashTypes[ item as T_HashTypeKey ] ) in hashObj ){
      hashObj[ hashTypes[ item as T_HashTypeKey ] ][ item as T_HashTypeKey ] = value as T_EncodeType;
    }
    else{
      hashObj[ hashTypes[ item as T_HashTypeKey ] ] = { [ item ]: value } as Record<T_HashTypeKey, T_EncodeType>;
    }
  } );

  return Object.values( hashObj );
}

function CreateWorkerIns( filePath: URL, hashOptions: Record<T_HashTypeKey, T_EncodeType>, workerInsIndex: number ): Promise<boolean>{
  return new Promise( ( resolve: ( args: any ) => void, reject: ( args: any ) => void ): void => {
    const workerIns: Worker = new Worker( workerThreadFilePath, {
      workerData: {
        workerInsID: `workerInsID${ workerInsIndex }`,
        hashTypes,
      },
    } );

    workerIns.on( 'error', ( errorEventData: unknown ): void => {
      MyConsole.Red( `
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
Object.prototype.toString.call( errorEventData )--->${ Object.prototype.toString.call( errorEventData ) }
${ errorEventData }
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );

      reject( errorEventData );
    } );

    workerIns.on( 'exit', ( exitCode: number ): void => {
      MyConsole.Yellow( `
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
exitCode:${ exitCode }.
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );

      if( Number( exitCode ) !== 0 ){
        MyConsole.Yellow( `\nWorker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.\n` );
      }
    } );

    workerIns.on( 'message', ( messageData: {
      hash: Record<T_HashTypeKey, T_EncodeType>;
      takeUpTime: number;
    } ): void => {
      ++successTotal;

      MyConsole.Blue( `\nmessage event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start\n` );

      MyConsole.Green( `
${ filePath.href }
本文件的本轮该${ Object.keys( messageData.hash ).length }种哈希算法（${ Object.keys( messageData.hash ).join( ', ' ) }）对应的哈希值计算完成。
本轮计算耗时${ messageData.takeUpTime.toFixed( 3 ) }毫秒。
约为${ ( Number( messageData.takeUpTime.toFixed( 3 ) ) / 1000 ).toFixed( 3 ) }秒。
约为${ ( Number( messageData.takeUpTime.toFixed( 3 ) ) / 1000 / 60 ).toFixed( 6 ) }分钟。
约为${ ( Number( messageData.takeUpTime.toFixed( 3 ) ) / 1000 / 60 / 60 ).toFixed( 9 ) }小时。
已有${ successTotal }轮哈希算法完成计算。
还有${ hashQuantity - successTotal }轮哈希算法未计算。
` );

      MyConsole.Blue( `\nmessage event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End\n` );

      result = Object.assign( {}, result, messageData.hash ) as Record<T_HashTypeKey, T_EncodeType>;

      if( hashGroupArr.length > 0 ){
        workerIns.postMessage( {
          filePath: filePath.href,
          hashOptions: hashGroupArr.shift(),
        } );
      }
      else if( successTotal === hashQuantity ){
        const endTimer: number = performance.now();

        MyConsole.Green( `
${ filePath.href }
本文件的指定的所有种类的哈希算法对应的哈希值全部计算完成，总共耗时：${ ( endTimer - startTimer ).toFixed( 3 ) }毫秒！
约为${ ( Number( ( endTimer - startTimer ).toFixed( 3 ) ) / 1000 ).toFixed( 3 ) }秒。
约为${ ( Number( ( endTimer - startTimer ).toFixed( 3 ) ) / 1000 / 60 ).toFixed( 6 ) }分钟。
约为${ ( Number( ( endTimer - startTimer ).toFixed( 3 ) ) / 1000 / 60 / 60 ).toFixed( 9 ) }小时。
` );

        // If the worker was terminated, the exitCode parameter is 1.
        workerIns.terminate().then(
          ( exitCode: number ): void => {
            MyConsole.Yellow( `\n停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );

            resolve( true );

            // 会强制退成程序！！！
            // exit( 0 );
          },
          ( reject: unknown ): void => {
            resolve( true );

            throw new Error( reject );
          }
        ).catch( ( err: unknown ): void => {
          console.error( err );
        } );
      }
    } );

    workerIns.on( 'messageerror', ( errorObject: unknown ): void => {
      MyConsole.Red( `
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
` );

      reject( errorObject );
    } );

    workerIns.on( 'online', (): void => {
      MyConsole.Cyan( `\n子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。\n` );
    } );

    workerIns.postMessage( {
      filePath: filePath.href,
      hashOptions,
    } );
  } );
}

let startTimer: number = 0,
  successTotal: number = 0,
  hashQuantity: number = 0,
  hashGroupArr: Array<Record<T_HashTypeKey, T_EncodeType>> = [] as Array<Record<T_HashTypeKey, T_EncodeType>>,
  result: Record<T_HashTypeKey, T_EncodeType> = {} as Record<T_HashTypeKey, T_EncodeType>;

const hashOptionsDefault: Record<T_HashTypeKey, T_EncodeType> = {
    'md5': {
      'hex': '',
      'base64': '',
    },

    'sha1': {
      'hex': '',
      'base64': ''
    },
    'sha-1': {
      'hex': '',
      'base64': ''
    },

    'sha224': {
      'hex': '',
      'base64': ''
    },
    'sha-224': {
      'hex': '',
      'base64': ''
    },
    'sha2-224': {
      'hex': '',
      'base64': ''
    },

    'sha256': {
      'hex': '',
      'base64': ''
    },
    'sha-256': {
      'hex': '',
      'base64': ''
    },
    'sha2-256': {
      'hex': '',
      'base64': ''
    },

    'sha384': {
      'hex': '',
      'base64': ''
    },
    'sha-384': {
      'hex': '',
      'base64': ''
    },
    'sha2-384': {
      'hex': '',
      'base64': ''
    },

    'sha512': {
      'hex': '',
      'base64': ''
    },
    'sha-512': {
      'hex': '',
      'base64': ''
    },
    'sha2-512': {
      'hex': '',
      'base64': ''
    },

    'sha3-224': {
      'hex': '',
      'base64': ''
    },
    'sha3-256': {
      'hex': '',
      'base64': ''
    },
    'sha3-384': {
      'hex': '',
      'base64': ''
    },
    'sha3-512': {
      'hex': '',
      'base64': ''
    },
  },
  workerThreadFilePath: string = './WorkerThread.esm.mts';

export async function FileHashWasmByRustForMultiThread( filePath: URL, hashOptions?: Record<T_HashTypeKey, T_EncodeType> = hashOptionsDefault ): Promise<Record<T_HashTypeKey, T_EncodeType>>{
  CheckHashTypes( hashOptions as Record<T_HashTypeKey, T_EncodeType> );

  const threadQuantity: number = cpus().length - 1;

  hashGroupArr = GetHashGroup( hashOptions as Record<T_HashTypeKey, T_EncodeType> );

  hashQuantity = hashGroupArr.length;

  MyConsole.Cyan( `\n一共有${ hashQuantity }种哈希算法需要计算。\n` );

  startTimer = performance.now();

  let createWorkerThreadQuantity: number = threadQuantity;

  const workerInsArr: Array<Promise<boolean>> = [] as Array<Promise<boolean>>;

  if( hashQuantity <= threadQuantity ){
    createWorkerThreadQuantity = hashQuantity;
  }

  for(
    let i: number = 0;
    i < createWorkerThreadQuantity;
    ++i
  ){
    workerInsArr.push( CreateWorkerIns( filePath, hashGroupArr.shift(), i ) );
  }

  MyConsole.Cyan( `\n创建了${ workerInsArr.length }个Worker线程！\n` );

  const res: unknown = await Promise.any( workerInsArr );

  if( res === true ){
    return result;
  }
  else{
    throw res;
  }
}

export default {
  FileHashWasmByRustForMultiThread,
};
