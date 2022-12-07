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
  type MongoClientOptions,

  // @ts-ignore
} from 'npm:mongodb';

import {
  opensslDir,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

// @ts-ignore
const config: MongoClientOptions = {
  appName: 'simulation_servers_deno',
  tls: true,
  tlsInsecure: false,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  tlsCAFile: new URL( `${ opensslDir }/MongoDBSSL001/001根CA证书/MongoDBSSL001_Root_CA.pem` ).href,
  tlsCertificateKeyFile: new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_10_101_CA.pem` ).href,
};

export {
  config,
};

export default config;
