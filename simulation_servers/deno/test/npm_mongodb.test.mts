/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/test/npm_mongodb.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-03-22 20:40:24 星期三
 */

'use strict';

import {
  type MongoClientOptions,

  MongoClient,

  // @ts-ignore
} from 'npm:mongodb';

import {
  opensslDir,
} from 'configures/GlobalParameters.esm.mts';

/**
 * node版本的mongodb驱动程序的客户端连接配置选项。
 *
 * @type {MongoClientOptions} 该驱动程序的配置选项详细见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#connection-options。
 */
const mongoClientConfig: MongoClientOptions = {
  /**
   * @type {string} 指定驱动程序在客户端元数据中作为连接握手的一部分传递给服务器的应用程序名称。服务器在建立连接时将应用名称打印到MongoDB日志中。它也会被记录在慢速查询日志和配置文件集合中。
   */
  appName: 'npm_mongodb_driver',
  /**
   * @type {string} 指定与服务器连接时要使用的认证机制方法。如果你没有指定一个值，驱动程序会使用默认的机制，根据服务器的版本，SCRAM-SHA-1或SCRAM-SHA-256。参见认证机制以了解可用的认证机制。<br />
   * 详细见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/authentication/#overview
   * 值有：<br />
   * MongoDB社区版中支持的认证机制有：<br />
   * DEFAULT、SCRAM-SHA-256、SCRAM-SHA-1、MONGODB-CR、MONGODB-AWS、X.509
   * MongoDB企业版中支持的认证机制有：<br />
   * Kerberos (GSSAPI/SSPI)、LDAP (PLAIN)
   */
  // authMechanism: 'SCRAM-SHA-256',
  /**
   * @type {string} 指定为认证提供的额外选项，例如为GSSAPI启用主机名规范化。<br />
   * 值格式为逗号分隔的键值对，例如：'opt1:val1,opt2:val2'。
   */
  // authMechanismProperties: '',
  /**
   * @type {string} 指定连接应针对的数据库进行验证。
   */
  // authSource: '',
  /**
   * @type {string} 指定发送到或从服务器接收的有线协议信息的允许压缩类型。更多信息见网络压缩。<br />
   * 值格式为逗号分隔的字符串列表，例如：'snappy,zstd,zlib'。
   */
  // compressors: 'snappy,zstd,zlib',
  /**
   * @type {number} 指定在引发错误之前，等待建立与服务器的单个TCP套接字连接的时间，单位是毫秒（非负整数）。指定0将禁用连接超时。
   */
  // connectTimeoutMS: 30000,
  /**
   * @type {boolean} 指定是否将所有操作强制分派给连接URI中指定的主机。
   */
  // directConnection: false,
  /**
   * @type {number} 指定常规服务器监控检查的间隔时间，以毫秒为单位（大于或等于500的整数）。
   */
  // heartbeatFrequencyMS: 500,
  /**
   * @type {boolean} 为客户端指定默认的写关注 "j "字段。更多信息请参见：https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-j
   */
  // journal: false,
  /**
   * @type {boolean} 指定驱动程序是否连接到一个负载平衡器。
   */
  // loadBalanced: false,
  /**
   * @type {number} 指定延迟窗口的大小，以毫秒为单位（非负整数），在合适的服务器之间选择往返时间。指定0意味着没有等待，意味着最快的可用服务器。
   */
  // localThresholdMS: 15,
  /**
   * @type {number} 指定一个连接在被关闭之前可以空闲的时间，以毫秒为单位（非负整数）。指定为0意味着没有最小值。
   */
  // maxIdleTimeMS: 0,
  /**
   * @type {number} 指定驱动程序在其连接池中可以创建的最大客户数或连接数（非负整数）。这个数字包括正在使用的连接。
   */
  maxPoolSize: 10000,
  /**
   * @type {number} 指定一个驱动程序的连接池可以并发建立的最大连接数（非负整数）。
   */
  maxConnecting: 20,
  /**
   * @type {number} 指定辅助服务器可以经历并且仍有资格选择服务器的最大复制延迟（以墙上的时钟时间为单位）。指定-1表示没有最大值，-1或大于或等于90的整数。
   */
  // maxStalenessSeconds: -1,
  /**
   * @type {number} 指定驱动程序应在连接池中创建和维护的连接数（非负整数），即使没有操作发生。此计数包括正在使用的连接。
   */
  // minPoolSize: 0,
  /**
   * @type {string} 指定用于连接MongoDB服务的SOCKS5代理服务器的IPv4/IPv6地址或域名。
   */
  // proxyHost: '127.0.0.1',
  /**
   * @type {number} 指定在proxyHost中指定的SOCKS5代理服务器的端口（非负整数）。
   */
  // proxyPort: 9666,
  /**
   * @type {string} 指定对proxyHost中指定的SOCKS5代理服务器进行用户名/密码身份验证的用户名。
   */
  // proxyUsername: '',
  /**
   * @type {string} 指定对proxyHost中指定的SOCKS5代理服务器进行用户名/密码身份验证的密码。
   */
  // proxyPassword: '',
  /**
   * @type {string} 指定客户端的默认读取问题。有关更多信息，请参阅阅读关注。
   */
  // readConcernLevel: '',
  /**
   * @type {string} 指定客户端的默认读取首选项（不包括标记）。有关更多信息，请参阅阅读偏好。
   */
  // readPreference: 'primary',
  /**
   * @type {string} 指定客户端的默认读取首选项标记。只有当读取首选项模式不是主要模式时，此选项才有效。驱动程序使用URI中标记的顺序作为读取首选项的顺序。<br />
   * 值格式为逗号分隔的键值对，例如：'dc:ny,rack:1'和'dc:ny'可以指定多次，该键的每个实例都是一个单独的标记集。
   */
  // readPreferenceTags: '',
  /**
   * @type {string} 指定要连接到的复制副本集的名称。
   */
  // replicaSet: '',
  /**
   * @type {boolean} 启用可重试的读取。
   */
  retryReads: true,
  /**
   * @type {boolean} 启用可重试的写入。
   */
  retryWrites: true,
  /**
   * @type {number} 指定在引发错误之前阻止服务器选择的超时时间（以毫秒为单位，非负整数）。
   */
  // serverSelectionTimeoutMS: 30000,
  /**
   * @type {boolean} 指定在服务器选择失败后只扫描拓扑一次，而不是重复扫描，直到服务器选择超时为止。
   */
  // serverSelectionTryOnce: true,
  /**
   * @type {number} 指定超时前尝试在套接字上发送或接收所花费的时间（以毫秒为单位，非负整数）。指定0表示没有超时。
   */
  // socketTimeoutMS: 0,
  /**
   * @type {number} 指定在初始填充种子列表时或在SRV轮询期间向拓扑中添加新主机时要随机选择的SRV结果的最大数目（非负整数）。
   */
  // srvMaxHosts: 0,
  /**
   * @type {string} 指定在初始DNS种子列表发现中用于SRV查找的服务名称，根据RFC 6335的有效SRV服务名称。
   */
  // srvServiceName: 'mongodb',
  /**
   * @type {boolean} ssl是tls选项的别名。
   */
  ssl: false,
  /**
   * @type {number} 指定操作完全执行的超时时间（以毫秒为单位，非负整数），取消设置（默认情况下未启用该功能）。
   */
  // timeoutMS: 0,
  /**
   * @type {boolean} 指定连接到服务器是否需要TLS。使用“mongodb+srv”的srvServiceName，或指定其他以tls为前缀的选项，将默认tls为true。
   */
  tls: false,
  /**
   * @type {boolean} 指定当服务器的TLS证书无效时，驱动程序是否应该出错。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidCertificates”选项一起使用。
   */
  tlsAllowInvalidCertificates: false,
  /**
   * @type {boolean} 指定当服务器的主机名与TLS证书指定的主机名不匹配时，驱动程序是否应该出错。
   */
  tlsAllowInvalidHostnames: false,
  /**
   * @type {string} 指定在进行TLS连接时要信任的具有单个或多个证书颁发机构的文件的路径。
   */
  tlsCAFile: decodeURI( new URL( `${ opensslDir }/MongoDBSSL001/001根CA证书/MongoDBSSL001_Root_CA.crt` ).href.slice( 8 ) ),
  /**
   * @type {string} 指定客户端证书文件或客户端私钥文件的路径。如果两者都需要，则必须将文件连接起来。
   */
  tlsCertificateKeyFile: decodeURI( new URL( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA.pem` ).href.slice( 8 ) ),
  /**
   * @type {string} 指定用于解密TLS连接所使用的客户端私钥的密码。
   */
  // tlsCertificateKeyFilePassword: '',
  /**
   * @type {boolean} 指定尽可能放宽TLS约束，例如允许无效证书或主机名不匹配。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidCertificates”选项一起使用。
   */
  // tlsInsecure: false,
  /**
   * @type {number|string} 指定客户端的默认写入问题“w”字段，值类型为：非负整数或字符串。
   */
  // w: '',
  /**
   * @type {number} 指定超时前尝试从服务器的连接池签出连接所花费的时间（以毫秒为单位，非负整数）。
   */
  // waitQueueTimeoutMS: 0,
  /**
   * @type {number} 指定客户端的默认写入问题“wtimeout”字段，非负整数。
   */
  // wTimeoutMS: 0,
  /**
   * @type {number} 指定使用zlib压缩有线协议消息时的压缩级别-1表示默认级别（介于-1和9之间的整数，-1、9也包括在内），0表示无压缩，1表示最快速度，9表示最佳压缩。有关详细信息，请参阅网络压缩。
   */
  // zlibCompressionLevel: -1,

  // 之所以还要强制使用“as”，是因为如果不这样，会报类型错误！真奇葩！
} as MongoClientOptions;

const client: MongoClient = new MongoClient( 'mongodb://127.0.0.1:27777', mongoClientConfig );

async function run(){
  try{
    const database = client.db( 'local' );

    const movies = database.collection( 'startup_log' );

    const movie = await movies.find( {
      hostname: 'LPQAQ',
    } ).toArray();

    console.dir( movie );
  }
  finally{
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch( console.error );
