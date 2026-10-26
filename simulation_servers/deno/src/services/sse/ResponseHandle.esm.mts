/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/sse/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 用于提供SSE服务，如：
 * https://127.0.0.1:9200/sse
 * https://127.0.0.1:9200/sse/
 * https://127.0.0.1:9200/simulation_servers_deno/sse
 * https://127.0.0.1:9200/simulation_servers_deno/sse/
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteHandle”中的配置。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001_Root_CA：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002_Servers_CA：HTTPSSL001_Servers_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003_Clients_CA：HTTPSSL001_Clients_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  type T_Response001,

  HttpResponseHeadersFun,
  HTTPStatus,
} from 'configures/GlobalParameters.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetLogWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import {
  WatchingUpload,
} from './WatchingUpload.esm.mts';

const logWriteStream: T_MyCusDenoFsFile = await GetLogWriteStreamForSingleton();

/**
 * 当满足“Condition.esm.mts”中的条件时就会被执行以响应请求的处理函数。<br /><br />
 *
 * 用于提供SSE服务，如：<br />
 * https://127.0.0.1:9200/sse <br />
 * https://127.0.0.1:9200/sse/ <br />
 * https://127.0.0.1:9200/simulation_servers_deno/sse <br />
 * https://127.0.0.1:9200/simulation_servers_deno/sse/ <br />
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {T_Response001} 返回值类型为Response、Promise<Response>。
 */
function ResponseHandle( request: Request ): T_Response001{
  /**
   * 客户端是否“中断”。BodyCancel.isBodyCancel为true表示消费者（读取方）放弃并中止流，反之，消费者（读取方）没有放弃并中止流。
   *
   * @type {{ isBodyCancel: boolean; }}
   */
  const BodyCancel: {
    isBodyCancel: boolean;
  } = {
    isBodyCancel: false,
  };

  /**
   * body.cancel() 是消费者（读取方）放弃并中止流。<br />
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
   * @type {ReadableStream<ArrayBufferView<ArrayBufferLike>> | ReadableStream<Uint8Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer> | Uint16Array<ArrayBuffer> | Uint32Array<ArrayBuffer> | Int8Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Int32Array<ArrayBuffer> | BigUint64Array<ArrayBuffer> | BigInt64Array<ArrayBuffer> | Float16Array<ArrayBuffer> | Float32Array<ArrayBuffer> | Float64Array<ArrayBuffer> | DataView<ArrayBuffer>>}
   */
  const body: ReadableStream<Uint8Array<ArrayBuffer>> = new ReadableStream( {
    /**
     * 这是一个在对象构造时立即调用的方法。该方法的具体实现由开发者定义，其目的应是获取流源，并执行设置流功能所需的其他操作。<br />
     * 如果该过程需要异步执行，则可返回一个 Promise 来指示成功或失败。<br />
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
     * @param {ReadableByteStreamController} controller 传递给此方法的 controller 参数是 ReadableStreamDefaultController 或 ReadableByteStreamController，具体取决于 type 属性的值。<br />
     * 开发人员可以在设置过程中使用该参数来控制流。<br />
     * ```ts
     * // controller.close() 是生产者（数据源）主动、优雅地结束流。调用后会导致跟客户端的连接中断！
     *
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
     * @returns {Promise<any>}
     */
    async start( controller: ReadableByteStreamController ): Promise<any>{
      BodyCancel.isBodyCancel = false;

      await WatchingUpload( {
        BodyCancel,
        controller,
        request,
      } );

      await logWriteStream.write( `
SSE连接：${ request.url }<--------->Start
服务端跟客户端的SSE连接建立并开始了。
SSE连接：${ request.url }<--------->End
` );
    },

    /**
     * 当客户端中断了跟服务端的连接时，会触发此方法。<br />
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
     * @param {any} reason 中断原因。
     *
     * @returns {void | PromiseLike<void>}
     */
    async cancel( reason?: any ): void | PromiseLike<void>{
      BodyCancel.isBodyCancel = true;

      await logWriteStream.write( `
SSE连接：${ request.url }<--------->Start
服务端跟客户端的SSE连接被“取消”了！原因：${ reason as string }。
SSE连接：${ request.url }<--------->End
` );
    },
  } );

  return new Response( body, {
    headers: {
      ...HttpResponseHeadersFun( request ),
      // text/event-stream; charset=utf-8
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
    },
    status: HTTPStatus[ 200 ].status,
    statusText: HTTPStatus[ 200 ].statusText,
  } );
}

// 必须部署这个默认的导出值。
export default ResponseHandle;
