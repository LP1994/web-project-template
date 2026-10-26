/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/sse/WatchingUpload.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:47 星期三
 */

/**
 * 监听“upload”文件夹下的文件变更。并将变动通过SSE发送给客户端。
 */

'use strict';

import {
  uploadDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 * 监听“upload”文件夹下的文件变更。并将变动通过SSE发送给客户端。<br />
 * PS：<br />
 * 1、在Deno底层实现中，当客户端中断了跟服务端的连接时，ReadableStream( { start( controller: ReadableByteStreamController ): any{}, cancel( reason?: any ): void | PromiseLike<void>{}, } )中的“cancel”会被触发，<br />
 * 然后Deno底层极大概率也会执行“controller.close()”！！！这也就是为什么在上述的“cancel”中执行“controller.close()”会报错，提示：The stream controller cannot close...<br />
 * 所以，个人建议“controller.close()”还是用于服务端根据具体业务需求主动调用，否则，没必要在客户端中断跟服务端的连接时，调用“controller.close()”。<br />
 * 2、关于使用“controller.close()”的优雅处理：<br />
 * ···ts
 * try {
 *   controller.close();
 * } catch (e) {
 *   if (e instanceof TypeError && e.message.includes("stream controller cannot close")) {
 *     // 流已不可关闭，属于预期内的状态冲突，安全忽略
 *   } else {
 *     // 其他错误应继续抛出
 *     throw e;
 *   }
 * }
 * ```
 *
 * @param {{controller: ReadableByteStreamController, BodyCancel: {isBodyCancel: boolean}, request: Request}} param0
 *
 * @param {{isBodyCancel: boolean}} param0.BodyCancel 客户端是否“中断”。BodyCancel.isBodyCancel为true表示消费者（读取方）放弃并中止流，反之，消费者（读取方）没有放弃并中止流。
 *
 * @param {ReadableByteStreamController} param0.controller controller.close() 是生产者（数据源）主动、优雅地结束流。调用后会导致跟客户端的连接中断！<br />
 * ```ts
 * // 将数据推送给客户端。
 *       try{
 *         // event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
 *         controller.enqueue( new TextEncoder().encode( `data: ${ JSON.stringify( {
 *           data: event,
 *         } ) }\n\n` ) );
 *       }
 *       catch( e: unknown ){
 *         if( e instanceof TypeError && ( e as Error ).message.includes( 'stream controller cannot' ) ){
 *           // 流已不可关闭，属于预期内的状态冲突，安全忽略
 *           errorWriteStream.write( `
 * SSE连接：${ request.url }<--------->Start
 * 在调用“controller.enqueue”时，报出"TypeError"错误：${ ( e as Error ).message }
 * SSE连接：${ request.url }<--------->End
 * ` );
 *         }
 *         else{
 *           errorWriteStream.write( `
 * SSE连接：${ request.url }<--------->Start
 * 在调用“controller.enqueue”时，报出错误：${ ( e as Error ).message }
 * SSE连接：${ request.url }<--------->End
 * ` );
 *
 *           // 其他错误应继续抛出
 *           throw e;
 *         }
 *       }
 * ```
 *
 * @param {Request} param0.request
 *
 * @returns {Promise<void>}
 */
async function WatchingUpload( {
  BodyCancel,
  controller,
  request,
}: {
  BodyCancel: {
    isBodyCancel: boolean;
  };
  controller: ReadableByteStreamController;
  request: Request;
} ): Promise<void>{
  let isClosed: boolean = false;

  const watcher: Deno.FsWatcher = Deno.watchFs( `${ uploadDir.slice( 8 ) }`, { recursive: true, } );

  // event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
  for await ( const event of
    watcher ){
    if( !BodyCancel.isBodyCancel ){
      try{
        // event: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
        controller.enqueue( new TextEncoder().encode( `data: ${ JSON.stringify( {
          data: event,
        } ) }\n\n` ) );
      }
      catch( e: unknown ){
        if( e instanceof TypeError && ( e as Error ).message.includes( 'stream controller cannot' ) ){
          // 流已不可关闭，属于预期内的状态冲突，安全忽略
          errorWriteStream.write( `
SSE连接：${ request.url }<--------->Start
在调用“controller.enqueue”时，报出"TypeError"错误：${ ( e as Error ).message }
SSE连接：${ request.url }<--------->End
` );
        }
        else{
          errorWriteStream.write( `
SSE连接：${ request.url }<--------->Start
在调用“controller.enqueue”时，报出错误：${ ( e as Error ).message }
SSE连接：${ request.url }<--------->End
` );

          // 其他错误应继续抛出
          throw e;
        }
      }
    }
    else if( !isClosed ){
      isClosed = true;

      watcher.close();
    }
  }
}

export {
  WatchingUpload,
};

export default WatchingUpload;
