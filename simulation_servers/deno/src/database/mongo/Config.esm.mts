/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/Config.esm.mts
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
  type ConnectOptions,

  // @ts-ignore
} from 'third_party_modules/deno_mongo@0.31.1/mod.ts';

import {
  opensslDir,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

const config: ConnectOptions = {
  appname: 'simulation_servers_deno',
  db: 'local',
  servers: [
    {
      host: '127.0.0.1',
      port: 27777,
    },
  ],
  tls: false,
  safe: true,
  retryWrites: true,
  caCert: new URL( `${ opensslDir }/MongoDBSSL001/001根CA证书/MongoDBSSL001_Root_CA.pem` ),
  privateKey: new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_10_101_CA_Key.key` ),
  certChain: new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_10_101_CA.crt` ),
};

export {
  config,
};

export default config;
