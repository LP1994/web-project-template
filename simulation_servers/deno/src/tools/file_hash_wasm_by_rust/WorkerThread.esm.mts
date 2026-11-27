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
  GetErrorMessage,
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

if( workerData.workerType === 'filePath' ){
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
  const bufferSize: number = workerData.chunkSize ?? 4 * 1024 * 1024,
    CalculateFileHash: (
      filePath: URL,
      hashOptions: Partial<Record<T_HashTypeKey, T_EncodeType>>,
      chunkSize: number,
    ) => Promise<Partial<Record<T_HashTypeKey, T_EncodeType>>> = (
      filePath: URL,
      hashOptions: Partial<Record<T_HashTypeKey, T_EncodeType>>,
      chunkSize: number = bufferSize,
    ): Promise<Partial<Record<T_HashTypeKey, T_EncodeType>>> => {
      return new Promise( async ( resolve: ( arg: Partial<Record<T_HashTypeKey, T_EncodeType>> ) => void, reject: ( arg: unknown ) => void ): Promise<void> => {
        hasher = new ( await GetFileHasherModule() )( hashOptions );

        readStream = createReadStream( filePath, {
          flags: 'r',
        } );

        readStream.on( 'open', ( fd: unknown ): void => {
          MyConsole.Cyan( `
模式：filePath
${ filePath.href }
文件已打开：${ fd }。
` );
        } );

        readStream.on( 'ready', (): void => {
          MyConsole.Cyan( `
模式：filePath
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
模式：filePath
${ filePath.href }
threadId:${ threadId }
当前计算的哈希算法为：“${ Object.keys( hashOptions ).join( ', ' ) }”。
每次从文件读取到的数据块的大小：${ chunkLen }字节，约为${ ( chunkLen / 1024 ).toFixed( 6 ) }KB，约为${ ( chunkLen / 1024 / 1024 ).toFixed( 12 ) }MB，约为${ ( chunkLen / 1024 / 1024 / 1024 ).toFixed( 18 ) }GB。
已经从文件读取了的总数据流大小：${ bytesReaded }字节，约为${ ( bytesReaded / 1024 ).toFixed( 6 ) }KB，约为${ ( bytesReaded / 1024 / 1024 ).toFixed( 12 ) }MB，约为${ ( bytesReaded / 1024 / 1024 / 1024 ).toFixed( 18 ) }GB。
` );
          }
        } );

        readStream.on( 'end', (): void => {
          MyConsole.Blue( `
模式：filePath
${ filePath.href }
文件读取已完成。
` );
        } );

        readStream.on( 'close', (): void => {
          // @ts-ignore
          MyConsole.Blue( `\n模式：filePath\n${ filePath.href }\n文件已关闭。\n本次文件哈希计算工具已经处理了的总字节数（单位为：字节），注意这里返回的是bigint类型的值：${ hasher.bytesProcessed() }\n` );

          // @ts-ignore
          resolve( hasher.digest() );
        } );

        readStream.on( 'error', ( error: unknown ): void => {
          MyConsole.Red( `
模式：filePath
${ filePath.href }
文件出错：
${ GetErrorMessage( error ) }
` );

          reject( error );
        } );
      } );
    };

  parentPort!.on( 'close', (): void => {
    MyConsole.Blue( `
模式：filePath
${ workerData.filePath.href }
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
该端口已关闭。
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );
  } );

  parentPort!.on( 'messageerror', ( error: Error ): void => {
    MyConsole.Red( `
模式：filePath
${ workerData.filePath.href }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( error )--->${ Object.prototype.toString.call( error ) }
${ error.message }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );

    throw new Error( `
模式：filePath
${ workerData.filePath.href }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( error )--->${ Object.prototype.toString.call( error ) }
${ error.message }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
`, { cause: error, } );
  } );

  parentPort!.on( 'message', async ( {
    filePath,
    hashOptions,
  }: {
    filePath: string;
    hashOptions: Partial<Record<T_HashTypeKey, T_EncodeType>>;
  } ): Promise<void> => {
    startTimer = performance.now();

    const hash: Partial<Record<T_HashTypeKey, T_EncodeType>> = (
      await CalculateFileHash( new URL( filePath ), hashOptions, bufferSize )
        .then(
          ( resolve: Partial<Record<T_HashTypeKey, T_EncodeType>> ): Partial<Record<T_HashTypeKey, T_EncodeType>> => resolve,
          ( reject: unknown ) => {
            MyConsole.Red( `
模式：filePath
${ filePath }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( reject )--->${ Object.prototype.toString.call( reject ) }
${ GetErrorMessage( reject ) }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );

            throw new Error( `
模式：filePath
${ filePath }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( reject )--->${ Object.prototype.toString.call( reject ) }
${ GetErrorMessage( reject ) }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
`, { cause: reject, } );
          },
        )
        .catch( ( error: unknown ): void => {
          MyConsole.Red( `
模式：filePath
${ filePath }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( error )--->${ Object.prototype.toString.call( error ) }
${ GetErrorMessage( error ) }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );

          throw new Error( `
模式：filePath
${ filePath }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( error )--->${ Object.prototype.toString.call( error ) }
${ GetErrorMessage( error ) }
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
`, { cause: error, } );
        } )
    ) ?? {};

    parentPort!.postMessage( {
      hash,
      takeUpTime: performance.now() - startTimer,
    } );
  } );
}
else if( workerData.workerType === 'chunk' ){
  let startTimer: number = 0;

  // 只创建一次完整视图。
  const sharedChunk: Uint8Array = new Uint8Array( workerData.sharedArrayBufferForChunk ),
    sharedStateControl: Uint8Array = new Uint8Array( workerData.sharedArrayBufferForStateControl ),
    // @ts-ignore
    fileHasherMap: Map<Partial<Record<T_HashTypeKey, T_EncodeType>>, any> = new Map<Partial<Record<T_HashTypeKey, T_EncodeType>>, any>();

  // @ts-ignore
  let fileHasher;

  parentPort!.on( 'close', (): void => {
    MyConsole.Blue( `
模式：chunk
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
该端口已关闭。
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );
  } );

  parentPort!.on( 'messageerror', ( error: Error ): void => {
    MyConsole.Red( `
模式：chunk
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( error )--->${ Object.prototype.toString.call( error ) }
${ error.message }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );

    throw new Error( `
模式：chunk
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( error )--->${ Object.prototype.toString.call( error ) }
${ error.message }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
`, { cause: error, } );
  } );

  parentPort!.on( 'message', async ( {
    type,
    chunkByteLength,
    hashOptions,
  }: {
    type: 'chunk' | 'digest';
    chunkByteLength?: number;
    hashOptions?: Partial<Record<T_HashTypeKey, T_EncodeType>>;
  } ): Promise<void> => {
    if( type === 'chunk' ){
      if( Atomics.load( sharedStateControl, 0 ) === 1 ){
        startTimer = performance.now();

        if( fileHasherMap.has( hashOptions as Partial<Record<T_HashTypeKey, T_EncodeType>> ) ){
          fileHasher = fileHasherMap.get( hashOptions as Partial<Record<T_HashTypeKey, T_EncodeType>> );
        }
        else{
          fileHasher = new ( await GetFileHasherModule() )( hashOptions );

          fileHasherMap.set( hashOptions as Partial<Record<T_HashTypeKey, T_EncodeType>>, fileHasher );
        }

        // 每次收到 chunk 消息时：subarray() 同样不会复制底层数据，只是创建一个新的视图。
        fileHasher!.update( sharedChunk.subarray( 0, chunkByteLength, ) );

        MyConsole.Cyan( `
模式：chunk
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })
当前计算的哈希算法为：“${ Object.keys( hashOptions as Partial<Record<T_HashTypeKey, T_EncodeType>> ).join( ', ' ) }”。
当前chunk的大小：${ chunkByteLength as number }字节，约为${ ( ( chunkByteLength as number ) / 1024 ).toFixed( 6 ) }KB，约为${ ( ( chunkByteLength as number ) / 1024 / 1024 ).toFixed( 12 ) }MB，约为${ ( ( chunkByteLength as number ) / 1024 / 1024 / 1024 ).toFixed( 18 ) }GB。
` );

        parentPort!.postMessage( {
          type: 'chunk-ack',
          takeUpTime: performance.now() - startTimer,
          hashOptions,
        } );
      }
      else{
        MyConsole.Red( `
模式：chunk
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
主线程当前还没执行“this.#sharedChunk.set( chunk );”，也就是还没更新共享内存区域的数据，子线程也就不能从共享内存区读取到新的数据，就算读取了，也是只能读取到旧的数据。
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );

        throw new Error( `
模式：chunk
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
主线程当前还没执行“this.#sharedChunk.set( chunk );”，也就是还没更新共享内存区域的数据，子线程也就不能从共享内存区读取到新的数据，就算读取了，也是只能读取到旧的数据。
(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
` );
      }
    }
    else if( type === 'digest' ){
      parentPort!.postMessage( {
        type: 'digest-ack',
        resultHash: ( ( hash: Partial<Record<T_HashTypeKey, T_EncodeType>> ): Partial<Record<T_HashTypeKey, T_EncodeType>> => {
          // @ts-ignore
          fileHasherMap.values().forEach( ( fileHasher ): void => {
            hash = Object.assign( {}, hash, fileHasher.digest() );
          } );

          return hash;
        } )( {} ),
      } );
    }
  } );
}
