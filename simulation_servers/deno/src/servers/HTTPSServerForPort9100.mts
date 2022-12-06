/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/servers/HTTPSServerForPort9100.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-10-31 23:17:27 星期一
 */

/**
 * 提供“https:”协议的服务，端口9100，基于HTTP/1.1，https://127.0.0.1:9100/。
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPS_192_168_10_101”文件夹下的4个：
 * 001根CA证书：HTTPSRootCA.crt
 * 002中间签名CA证书：HTTPSMiddlemanSigningCA.crt
 * 003成员_服务端CA证书：HTTPSServers_192_168_10_101_CA.crt
 * 004客户端CA证书：HTTPSClients_192_168_10_101_CA.crt
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 * 4、就算安装了上述的证书到iPhone 13 Pro Max上，其上的谷歌浏览器、火狐浏览器（但Safari浏览器却不会）在访问相关链接时，还是会报如下错误提示，但还是能顺利访问，只是会输出这个错误提示：
 * error writing a body to connection: tls handshake eof: tls handshake eof
 */

'use strict';

import {
  type ConnInfo,

  serveTls,

  // @ts-ignore
} from 'DenoStd/http/server.ts';

import {
  type TypeResponse001,

  opensslDir,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  MyConsole,

  // @ts-ignore
} from 'tools/universal_tool_for_deno/UniversalToolForDeno.esm.mts';

import {
  type TypeMyCusDenoFsFile,

  GetLogWriteStreamForSingleton,
  GetErrorWriteStreamForSingleton,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

// @ts-ignore
import ResponseError from 'public/ResponseError.esm.mts';

import {
  Routers,

  // @ts-ignore
} from 'routers/Routers.esm.mts';

const logWriteStream: TypeMyCusDenoFsFile = await GetLogWriteStreamForSingleton();
const errorWriteStream: TypeMyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

serveTls(
  (
    request: Request,
    connInfo: ConnInfo,
  ): TypeResponse001 => {
    logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPSServerForPort9100.mts
HTTPS Server request--->Start

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
          // @ts-ignore
          parent: Headers
        ): void => {
          result[ key ] = value;
        } );

        return result;
      } )(),
    }, null, ' ' ) }

HTTPS Server request--->End
` );

    logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPSServerForPort9100.mts
HTTPS Server connInfo--->Start

${ JSON.stringify( connInfo, null, ' ' ) }

HTTPS Server connInfo--->End
` );

    return Routers( request );
  },
  {
    port: 9100,
    /**
     * 用postman测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9100”能连接上。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9100”、“https://localhost:9100”能连接上。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9100”、“https://127.0.0.1:9100”、“https://192.168.10.101:9100”能连接上。<br />
     *
     * 用浏览器测试时：<br />
     * 1、当设置为'localhost'时，用如“https://localhost:9100”能连接上。<br />
     * 2、当设置为'127.0.0.1'时，用如“https://127.0.0.1:9100”、“https://localhost:9100”能连接上。<br />
     * 3、当设置为'0.0.0.0'时，用如“https://localhost:9100”、“https://127.0.0.1:9100”、“https://192.168.10.101:9100”能连接上。<br />
     *
     * 关于浏览器访问“不安全的HTTPS协议”时的注意事项（尤其是火狐浏览器），浏览器访问“不安全的HTTPS协议”时需要先同意其不安全的警告，否则无法访问：<br />
     * 1、当页面地址（如“https://localhost:9100”）跟其中的websocket服务地址（如“wss://localhost:9200”）不一样时，因为端口不一致，所以也算不同的服务地址。<br />
     * 2、这时要先访问一下websocket服务地址对应的HTTP服务地址，即“https://localhost:9200”。<br />
     * 3、然后才能让页面（如“https://localhost:9100”）成功访问其中的websocket服务地址（如“wss://localhost:9200”）。<br />
     * 4、可以的话，还是使用同一个端口提供http、https、ws、wss服务，这样只需要同意一次不安全的警告即可。<br />
     *
     * 当设置为'0.0.0.0'时的注意事项：<br />
     * 1、关于浏览器通过node服务代理请求本deno服务时，node的代理设置（target、router选项）得指向'0.0.0.0'，否者node会报错误：<br />
     * ECONNREFUSED (Connection refused): No connection could be made because the target machine actively refused it. This usually results from trying to connect to a service that is inactive on the foreign host.<br />
     * 2、如上类比，当任何非浏览器端访问、代理到本deno服务时，都得保证其目标指向'0.0.0.0'，否则，大概率会报错。<br />
     * 3、Windows系统上，浏览器不支持对0.0.0.0的直接访问，例如无法访问：https://0.0.0.0:9100。<br />
     */
    hostname: '0.0.0.0',
    // @ts-ignore
    key: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA_Key.key` ) ),
    // @ts-ignore
    cert: Deno.readTextFileSync( new URL( `${ opensslDir }/HTTPSSL001/002服务端CA证书/HTTPSSL001_Servers_192_168_10_101_CA.crt` ) ),
    onListen: (
      {
        hostname,
        port,
      }: {
        hostname: string;
        port: number;
      }
    ): void => {
      MyConsole.Cyan( `
来自：simulation_servers/deno/src/servers/HTTPSServerForPort9100.mts
HTTPS Server已启动（Windows系统上无法直接访问“0.0.0.0”，请改用本地、局域网IP等等，支持IPV4、IPV6）：https://${ hostname }:${ port }/。
` );

      logWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPSServerForPort9100.mts
HTTPS Server已启动（Windows系统上无法直接访问“0.0.0.0”，请改用本地、局域网IP等等，支持IPV4、IPV6）：https://${ hostname }:${ port }/。
` );
    },
    onError: ( error: unknown ): TypeResponse001 => {
      MyConsole.Red( `
来自：simulation_servers/deno/src/servers/HTTPSServerForPort9100.mts
HTTPS Server onError--->Start

${ ( error as Error ).message }

HTTPS Server onError--->End
` );

      errorWriteStream.write( `
来自：simulation_servers/deno/src/servers/HTTPSServerForPort9100.mts
HTTPS Server onError--->Start

${ ( error as Error ).message }

HTTPS Server onError--->End
` );

      return ResponseError.ResPageError( {
        title: `HTTPS Server服务器内部出现错误`,
        message: `当路由处理程序抛出错误时会调用该错误处理程序。
错误信息：
${ ( error as Error ).message }`,
      } );
    },
  }
);
