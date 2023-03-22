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
  appname: 'simulation_servers_deno',
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
  caCert: new URL( `${ opensslDir }/MongoDBSSL001/001根CA证书/MongoDBSSL001_Root_CA.crt` ),
  keyFile: new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA_Key.key` ),
  certFile: new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA.crt` ),
};

export {
  config,
};

export default config;
