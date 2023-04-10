/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 首选，提供“https:”和“wss:”协议的服务，端口都是9200，基于HTTP/2（使用HTTP/2要必需使用HTTPS，这是强制的），Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
 * https://127.0.0.1:9200、wss://127.0.0.1:9200
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_192_168_2_7_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_192_168_2_7_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

'use strict';

import {
  opensslDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  MyConsole,
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type TypeMyCusDenoFsFile,

  GetLogWriteStreamForSingleton,
  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import {
  Routers,
} from 'routers/Routers.esm.mts';

const logWriteStream: TypeMyCusDenoFsFile = await GetLogWriteStreamForSingleton();
const errorWriteStream: TypeMyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

async function HandleConn( conn: Deno.TlsConn ): Promise<void>{
  logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，connInfo--->Start

${ JSON.stringify( {
    localAddr: conn.localAddr,
    remoteAddr: conn.remoteAddr,
  }, null, ' ' ) }

HTTP/2 服务，connInfo--->End
` );

  const httpConn: Deno.HttpConn = Deno.serveHttp( conn );

  try{
    for await ( const requestEvent of
      httpConn ){
      if( requestEvent ){
        const request: Request = requestEvent.request;

        logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，request--->Start

${ JSON.stringify( {
          method: request.method,
          url: request.url,
          redirect: request.redirect,
          bodyUsed: request.bodyUsed,
          headers: ( () => {
            const result: { [ keyName: string ]: string; } = {};

            request.headers.forEach( (
              value: string,
              key: string,
              // @ts-expect-error
              parent: Headers
            ): void => {
              result[ key ] = value;
            } );

            return result;
          } )(),
        }, null, ' ' ) }

HTTP/2 服务，request--->End
` );

        // 不要await，会导致阻塞。
        requestEvent.respondWith( Routers( request ) );
      }
    }
  }
  catch( error: unknown ){
    // 不要因为客户端的某一个连接出错而关闭本连接，因为这样会直接中断了其他所有连接。
    // httpConn.close();

    MyConsole.Red( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，报错--->Start

${ ( error as Error ).message }

HTTP/2 服务，报错--->End
` );

    errorWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，报错--->Start

${ ( error as Error ).message }

HTTP/2 服务，报错--->End
` );
  }
}

try{
  const server: Deno.TlsListener = Deno.listenTls( {
    port: 9200,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9200”、“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9200”、“https://127.0.0.1:9200”、“https://192.168.2.7:9200”能连接上（https、wss皆是如此）。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9200”、“https://localhost:9200”能连接上（https、wss皆是如此）。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9200”、“https://127.0.0.1:9200”、“https://192.168.2.7:9200”能连接上（https、wss皆是如此）。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9200”）跟其中的websocket服务地址（如“wss://localhost:9000”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9000”。<br />
     * 3、然后才能让页面（如“https://localhost:9200”）成功访问其中的websocket服务地址（如“wss://localhost:9000”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9200。<br />
     */
    hostname: '0.0.0.0',
    key: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA_Key.key` ) ),
    cert: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPSSL001/002服务端CA证书/HTTPSSL001_Servers_192_168_2_7_CA.crt` ) ),
    transport: 'tcp',
    alpnProtocols: [
      'h2',
      'http/1.1',
    ],
  } );

  const addr: Deno.NetAddr = server.addr as Deno.NetAddr;

  MyConsole.Cyan( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务已开启（Windows系统上无法直接访问“0.0.0.0”，请改用本地、局域网IP等等，支持IPV4、IPV6）：https://${ addr.hostname }:${ addr.port }/、wss://${ addr.hostname }:${ addr.port }/。
说明：Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
` );

  logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务已开启（Windows系统上无法直接访问“0.0.0.0”，请改用本地、局域网IP等等，支持IPV4、IPV6）：https://${ addr.hostname }:${ addr.port }/、wss://${ addr.hostname }:${ addr.port }/。
说明：Deno会自动在HTTP/2和HTTP/1.1之间切换，以响应HTTP请求（使用HTTP/2）和WebSocket请求（使用HTTP/1.1）。
` );

  try{
    for await ( const conn of
      server ){
      // 不要await，会导致阻塞。
      HandleConn( conn );
    }
  }
  catch( error: unknown ){
    // 不要因为一个监听器报错，而关闭所有的监听器。
    // server.close();

    MyConsole.Red( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，监听器报错--->Start

${ ( error as Error ).message }

HTTP/2 服务，监听器报错--->End
` );

    errorWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，监听器报错--->Start

${ ( error as Error ).message }

HTTP/2 服务，监听器报错--->End
` );
  }
}
catch( error: unknown ){
  MyConsole.Red( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，打开网络端口时出现问题--->Start

${ ( error as Error ).message }

HTTP/2 服务，打开网络端口时出现问题--->End
` );

  errorWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPV2AndWebSocketSServerForPort9200.mts
HTTP/2 服务，打开网络端口时出现问题--->Start

${ ( error as Error ).message }

HTTP/2 服务，打开网络端口时出现问题--->End
` );
}
