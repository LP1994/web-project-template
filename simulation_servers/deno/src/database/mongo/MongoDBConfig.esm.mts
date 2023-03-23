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

  /**
   * 从“deno_mongo@v0.31.2”源码中可知该选项还未被实现，详细见：https://deno.land/x/mongo@v0.31.2/src/cluster.ts?source#L39。
   */
  // keyFile: new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA_Key.key` ),

  /**
   * 从“deno_mongo@v0.31.2”源码中可知（详细见：https://deno.land/x/mongo@v0.31.2/src/cluster.ts?source#L35）：
   * 该选项表示一个文件地址，作为调用Deno.readTextFileSync()的参数，将调用后返回的文件内容存入一个数组中，并将该数组设置给内部选项“caCerts”。
   * 该“caCerts”选项是Deno.ConnectTlsOptions的选项，详细见：https://deno.land/api@v1.32.0?s=Deno.ConnectTlsOptions&unstable=#prop_caCerts。
   * 在Deno.ConnectTlsOptions中的选项“caCerts”的参数说明表述：
   * 除了默认的根证书外，还将使用根证书的列表来验证对等体的证书，必须是PEM格式。
   * 注意：在Deno.ConnectTlsOptions中，也有一个“certFile”选项，但是被弃用了，详细见：https://deno.land/api@v1.32.0?s=Deno.ConnectTlsOptions&unstable=#prop_certFile。
   */
  certFile: new URL( `${ opensslDir }/MongoDBSSL001/001根CA证书/MongoDBSSL001_Root_CA.crt` ),

  // PEM格式的客户证书链。
  certChain: Deno.readTextFileSync( new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA.crt` ) ),

  // PEM格式的（RSA或PKCS8）客户证书的私钥。
  privateKey: Deno.readTextFileSync( new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA_Key.key` ) ),

  // 客户端支持的应用层协议协商（ALPN）协议。如果不指定，在TLS握手中不会包括ALPN扩展。
  alpnProtocols: [
    'h2',
    'http/1.1',
  ],

  // 之所以还强制使用了“as”，是因为添加了非“deno_mongo@v0.31.2”提供的参数，但是这些参数来自：https://deno.land/api@v1.32.0?s=Deno.ConnectTlsOptions&unstable=
} as ConnectOptions;

export {
  config,
};

export default config;
