/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/MongoDBConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:33:39 星期三
 */

/**
 * 配置连接“MongoDB”数据库时，需要的连接参数。
 * 注意：
 * 1、直到2023年03月26日，基于：deno_mongo@0.31.2、MongoDB社区版@6.0.5、deno@1.32.1，还是无法使用TLS以及客户端证书跟数据库进行连接。
 * 报错信息：
 * Sending fatal alert BadCertificate
 * error: Uncaught (in promise) InvalidData: presented server name type wasn't supported
 *     nwritten += await w.write(arr.subarray(nwritten));
 *                 ^
 *     at async write (ext:deno_net/01_net.js:27:10)
 *     at async writeAll (https://deno.land/std@0.154.0/streams/conversion.ts:422:17)
 *     at async WireProtocol.send (https://deno.land/x/mongo@v0.31.2/src/protocol/protocol.ts:101:7)
 *
 * 类似的问题见：https://github.com/denoland/deno/issues/7660#issuecomment-1403282800
 * 而且，就算在启动命令行中添加“--unsafely-ignore-certificate-errors”也不能成功使用TLS连接。
 *
 * 2、所以只能使用非TLS的方式跟数据库进行连接。
 */

'use strict';

import {
  opensslDir,
} from 'configures/GlobalParameters.esm.mts';

import {
  type ConnectOptions,
} from 'mongo/deno_mongo.esm.mts';

const config: ConnectOptions = {
  appname: 'deno_mongo_driver',
  db: 'simulation_servers_deno',
  servers: [
    {
      host: '127.0.0.1',
      port: 27777,
    },
  ],
  tls: false,
  safe: true,
  retryWrites: true,
  /*
   credential: {
   db: '$external',
   mechanism: 'MONGODB-X509',
   },
   */

  /**
   * 从“deno_mongo@v0.31.2”源码中可知该选项还未被实现，详细见：https://deno.land/x/mongo@v0.31.2/src/cluster.ts?source#L39。
   * 极可能就是指Deno.ConnectTlsOptions的“privateKey”选项，详细见：https://deno.land/api@v1.32.1?s=Deno.ConnectTlsOptions&unstable=#prop_privateKey
   */
  // keyFile: Deno.readTextFileSync( new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA_Key.key` ) ),

  /**
   * PEM格式的（RSA或PKCS8）客户证书的私钥。
   * 该“privateKey”选项是Deno.ConnectTlsOptions的选项，详细见：https://deno.land/api@v1.32.1?s=Deno.ConnectTlsOptions&unstable=#prop_privateKey
   */
  // privateKey: Deno.readTextFileSync( new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA_Key.key` ) ),

  /**
   * PEM格式的客户证书链。
   * 该“certChain”选项是Deno.ConnectTlsOptions的选项，详细见：https://deno.land/api@v1.32.1?s=Deno.ConnectTlsOptions&unstable=#prop_certChain
   */
  // certChain: Deno.readTextFileSync( new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA.crt` ) ),

  /**
   * 从“deno_mongo@v0.31.2”源码中可知（详细见：https://deno.land/x/mongo@v0.31.2/src/cluster.ts?source#L35）：
   * 该选项表示一个文件地址，作为调用Deno.readTextFileSync()的参数，将调用后返回的文件内容存入一个数组中，并将该数组设置给内部选项“caCerts”。
   * 该“caCerts”选项是Deno.ConnectTlsOptions的选项，详细见：https://deno.land/api@v1.32.0?s=Deno.ConnectTlsOptions&unstable=#prop_caCerts。
   * 在Deno.ConnectTlsOptions中的选项“caCerts”的参数说明表述：
   * 除了默认的根证书外，还将使用根证书的列表来验证对等体的证书，必须是PEM格式。
   * 注意：在Deno.ConnectTlsOptions中，也有一个“certFile”选项，但是被弃用了，详细见：https://deno.land/api@v1.32.0?s=Deno.ConnectTlsOptions&unstable=#prop_certFile。
   */
  certFile: new URL( `${ opensslDir }/MongoDBSSL001/001根CA证书/MongoDBSSL001_Root_CA.pem` ),
};

export {
  config,
};

export default config;
