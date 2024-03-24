/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/demo/npm_mongodb_for_deno.test.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2023-03-22 20:40:24 星期三
 */

/**
 * 1、直到2024年03月23日，基于：npm包mongodb@6.5.0、MongoDB社区版@7.0.7、deno@1.41.3，还是无法使用TLS以及客户端证书跟数据库进行连接。
 * 但是同样的npm包mongodb@6.5.0、MongoDB社区版@7.0.7在node中是可以的。
 */

'use strict';

import {
  type MongoClientOptions as T_MongoClientOptions,
  type Db as T_Db,
  type Collection as T_Collection,

  MongoClient,
} from 'npm:mongodb';

interface I_StartupLogCollectionSchema {
  _id: string;

  hostname: string;

  startTime: Date;

  startTimeLocal: string;

  pid: number;

  cmdLine: object;

  buildinfo: object;
}

/**
 * @type {T_MongoClientOptions} node版本的mongodb驱动程序的客户端连接配置选项。该驱动程序的配置选项详细见：
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#connection-options
 * https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html
 */
const mongoClientConfig: T_MongoClientOptions = {
  // 以下选项见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#connection-options   Start

  /**
   * @type {string} 指定驱动程序在客户端元数据中作为连接握手的一部分传递给服务器的应用程序名称。服务器在建立连接时将应用名称打印到MongoDB日志中。它也会被记录在慢速查询日志和配置文件集合中。<br />
   * 创建该MongoClient实例的应用程序的名称。MongoDB 3.4和更新版本会在建立每个连接时在服务器日志中打印这个值。它也会被记录在慢速查询日志和配置文件集合中。
   */
  appName: 'npm_mongodb_driver_for_deno',
  /**
   * @type {string} 指定与服务器连接时要使用的认证机制方法。如果你没有指定一个值，驱动程序会使用默认的机制，根据服务器的版本，SCRAM-SHA-1或SCRAM-SHA-256。参见认证机制以了解可用的认证机制。<br />
   * 详细见：<br />
   * https://www.mongodb.com/docs/drivers/node/current/fundamentals/authentication
   * 值有：<br />
   * MongoDB社区版中支持的认证机制有（详细见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/authentication/mechanisms/）：<br />
   * DEFAULT：DEFAULT认证机制是一个后备设置，它指示驱动程序按以下优先顺序协商服务器支持的第一个认证机制：SCRAM-SHA-256、SCRAM-SHA-1、MONGODB-CR。<br />
   * SCRAM-SHA-256：SCRAM-SHA-256是MongoDB从4.0版本开始的默认认证方法。<br />
   * SCRAM-SHA-1：SCRAM-SHA-1是MongoDB 3.0、3.2、3.4和3.6版本的默认认证方法。<br />
   * MONGODB-CR：MONGODB-CR从MongoDB 3.6开始被弃用，从MongoDB 4.0开始不再被支持。<br />
   * MONGODB-AWS：MONGODB-AWS认证机制仅在MongoDB 4.4及以后的版本中可用。<br />
   * MONGODB-X509：MONGODB-X509认证机制仅在MongoDB 2.6及以后的版本中可用。<br />
   * MONGODB-X509认证机制使用TLS和X.509证书来验证你的用户，该用户由你的客户证书的区分名（DN）来识别。<br />
   * 关于从X.509证书中确定主题名称的更多信息，请参阅MongoDB手册中的X.509教程。<br />
   * https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/#add-x-509-certificate-subject-as-a-user
   * 关于“X.509”的，详细见：<br />
   * https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/#add-x-509-certificate-subject-as-a-user
   * https://www.mongodb.com/docs/manual/tutorial/configure-x509-member-authentication/
   * https://www.mongodb.com/docs/manual/tutorial/upgrade-keyfile-to-x509/
   * https://www.mongodb.com/docs/manual/tutorial/rotate-x509-membership-certificates/
   * 你可以通过设置以下参数来指定这种认证机制，连接字符串的以下参数来指定这种认证机制：<br />
   * 将authMechanism参数设置为MONGODB-X509值。<br />
   * 将tls参数设置为值true。<br />
   * 将客户证书文件的位置作为连接URI的参数tlsCertificateKeyFile的值传递给客户。<br />
   * 始终使用encodeURIComponent方法对用户名和证书文件路径进行URI编码，以确保它们被正确解析。<br />
   * 例子：<br />
   * const { MongoClient } = require("mongodb");
   * // 用适合你的环境的值替换以下内容。
   * const username = encodeURIComponent("<客户证书的识别名称client certificate distinguished name>");
   * const clusterUrl = "<MongoDB集群的网址MongoDB cluster url>";
   * const clientPEMFile = encodeURIComponent("<客户端pem证书文件的路径path to the client pem certificate file>");
   * const authMechanism = "MONGODB-X509";
   * // 用你的MongoDB部署的连接字符串替换以下内容。
   * const uri = `mongodb+srv://${username}@${clusterUrl}/?authMechanism=${authMechanism}&tls=true&tlsCertificateKeyFile=${clientPEMFile}`;
   * // Create a new MongoClient
   * const client = new MongoClient(uri);
   * // Function to connect to the server
   * async function run() {
   *   try {
   *     // 建立并验证连接
   *     await client.db('admin').command({ ping: 1 });
   *     console.log('Connected successfully to server');
   *   } finally {
   *     // 确保当你完成/出错时，客户端会关闭
   *     await client.close();
   *   }
   * }
   * run().catch(console.dir);
   *
   * MongoDB企业版中仅支持的认证机制有（详细见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/authentication/enterprise-mechanisms/）：<br />
   * GSSAPI（使用时，直接将'GSSAPI'设置给authMechanism参数）、
   * PLAIN（使用时，直接将'PLAIN'设置给authMechanism参数）。
   *
   * MONGODB-OIDC：一个内部值（实验性），貌似不是给外界使用的，该值在使用文档中没见到说明，但是在源码中可见到：https://github.com/mongodb/node-mongodb-native/blob/v5.1.0/src/cmap/auth/providers.ts#L12
   */
  // authMechanism: 'MONGODB-X509',
  /**
   * @type {AuthMechanismProperties} 指定为认证提供的额外选项，例如为GSSAPI启用主机名规范化。<br />
   * 值格式为逗号分隔的键值对，例如：'opt1:val1,opt2:val2'。<br />
   * 为指定的authMechanism指定属性，以逗号分隔的冒号分隔的键值对列表。<br />
   * 类型AuthMechanismProperties实际类型为：<br />
   * {
   *   SERVICE_HOST?: string;
   *   SERVICE_NAME?: string;
   *   SERVICE_REALM?: string;
   *   CANONICALIZE_HOST_NAME?: true | false | 'none' | 'forward' | 'forwardAndReverse';
   *   AWS_SESSION_TOKEN?: string;
   * }
   */
  // authMechanismProperties: {},
  /**
   * @type {string} 指定与用户凭证相关的数据库名称。指定连接应针对的数据库进行验证。
   */
  // authSource: '$external',
  /**
   * @type {string | ('none' | 'snappy' | 'zlib' | 'zstd')[]} 指定发送到或从服务器接收的有线协议信息的允许压缩类型。更多信息见网络压缩。<br />
   * 值格式为逗号分隔的字符串列表，例如：'snappy,zlib,zstd'。<br />
   * 一个数组或以逗号分隔的压缩器字符串，用于在该客户端和mongod/mongos实例之间的通信中启用网络压缩。
   */
  // compressors: 'snappy,zlib,zstd',
  /**
   * @type {number} 在超时前尝试连接的时间。指定在引发错误之前，等待建立与服务器的单个TCP套接字连接的时间，单位是毫秒（非负整数）。指定0将禁用连接超时。
   */
  // connectTimeoutMS: 30000,
  /**
   * @type {boolean} 指定是否将所有操作强制分派给连接URI中指定的主机。<br />
   * 允许驱动程序以包含一个主机的连接字符串强制使用单一拓扑类型。
   */
  // directConnection: false,
  /**
   * @type {number} 指定常规服务器监控检查的间隔时间，以毫秒为单位（大于或等于500的整数）。<br />
   * heartbeatFrequencyMS控制驱动程序何时检查MongoDB部署的状态。指定检查的间隔时间（以毫秒为单位），从上一次检查结束到下一次开始计算。
   */
  // heartbeatFrequencyMS: 500,
  /**
   * @type {boolean} 已废弃！日志写关注。请使用writeConcern选项代替。更多信息请参见：https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-j
   */
  // journal: false,
  /**
   * @type {boolean} 指定驱动程序是否连接到一个负载平衡器。<br />
   * 指示驱动程序，它正在连接到一个负载均衡器，以支持类似mongos的服务。
   */
  // loadBalanced: false,
  /**
   * @type {number} 指定延迟窗口的大小，以毫秒为单位（非负整数），在合适的服务器之间选择往返时间。指定0意味着没有等待，意味着最快的可用服务器。
   */
  // localThresholdMS: 15,
  /**
   * @type {number} 指定一个连接在被关闭之前可以空闲的时间，以毫秒为单位（非负整数）。指定为0意味着没有最小值。<br />
   * 一个连接在被删除和关闭之前在池中保持空闲的最大毫秒数。
   */
  // maxIdleTimeMS: 0,
  /**
   * @type {number} 指定驱动程序在其连接池中可以创建的最大客户数或连接数（非负整数）。这个数字包括正在使用的连接。
   */
  maxPoolSize: 10000,
  /**
   * @type {number} 指定一个驱动程序的连接池可以并发建立的最大连接数（非负整数）。
   */
  maxConnecting: 100,
  /**
   * @type {number} 指定辅助服务器可以经历并且仍有资格选择服务器的最大复制延迟（以墙上的时钟时间为单位）。指定-1表示没有最大值，-1或大于或等于90的整数。<br />
   * 以秒为单位，指定在客户端停止使用一个二级单位进行读取操作之前，该二级单位可以有多大的陈旧度。
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
   * @type {'local' | 'majority' | 'linearizable' | 'available' | 'snapshot'} 隔离的程度，指定客户端的默认读取问题。有关更多信息，请参阅阅读关注。
   * 详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/modules.html#ReadConcernLevel
   */
  // readConcernLevel: '',
  /**
   * @type {'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest'} 指定此连接的阅读偏好，指定客户端的默认读取首选项（不包括标记）。有关更多信息，请参阅阅读偏好。
   * 详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/classes/ReadPreference.html
   */
  // readPreference: 'primary',
  /**
   * @type {{ [key: string]: string }[]} 指定客户端的默认读取首选项标记。只有当读取首选项模式不是主要模式时，此选项才有效。驱动程序使用URI中标记的顺序作为读取首选项的顺序。<br />
   * 值格式为逗号分隔的键值对，例如：'dc:ny,rack:1'和'dc:ny'可以指定多次，该键的每个实例都是一个单独的标记集。
   */
  // readPreferenceTags: '',
  /**
   * @type {string} 指定要连接到的复制副本集的名称，如果mongod是一个复制集的成员，则指定复制集的名称。
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
   * @type {'auto' | 'stream' | 'poll'} 默认值“auto”，指定驱动程序监控使用的监控模式。
   * 当该选项设置为'auto'时，监控模式由驱动程序的运行环境决定：
   * 1、在功能即服务（FaaS）环境中，驱动程序使用'poll'模式。
   * 2、而在其他环境中则使用'stream'模式。
   */
  serverMonitoringMode: 'auto',
  /**
   * @type {number} 指定在引发错误之前阻止服务器选择的超时时间（以毫秒为单位，非负整数）。
   */
  // serverSelectionTimeoutMS: 30000,
  /**
   * @type {boolean} 指定在服务器选择失败后只扫描拓扑一次，而不是重复扫描，直到服务器选择超时为止。
   */
  // serverSelectionTryOnce: true,
  /**
   * @type {number} 指定超时前尝试在套接字上发送或接收所花费的时间（以毫秒为单位，非负整数）。指定0表示没有超时。<br />
   * 在尝试超时之前，在套接字上尝试发送或接收的时间，以毫秒计。
   */
  // socketTimeoutMS: 0,
  /**
   * @type {number} 指定在初始填充种子列表时或在SRV轮询期间向拓扑中添加新主机时要随机选择的SRV结果的最大数目（非负整数）。<br />
   * 当使用srv连接字符串时，要连接的最大主机数，设置为0意味着无限的主机数。
   */
  // srvMaxHosts: 0,
  /**
   * @type {string} 指定在初始DNS种子列表发现中用于SRV查找的服务名称，根据RFC 6335的有效SRV服务名称。<br />
   * 修改srv URI，使其看起来像：<br />
   * _{srvServiceName}._tcp.{hostname}.{domainname}
   * 查询这个DNS URI预计会有SRV记录的回应
   */
  // srvServiceName: 'mongodb',
  /**
   * @type {boolean} ssl是tls选项的别名。
   */
  // ssl: true,
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
   * 绕过由mongod/mongos实例提交的证书验证。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidCertificates”选项一起使用。
   */
  tlsAllowInvalidCertificates: false,
  /**
   * @type {boolean} 指定当服务器的主机名与TLS证书指定的主机名不匹配时，驱动程序是否应该出错。<br />
   * 禁止对mongod/mongos实例提交的证书进行主机名验证。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidHostnames”选项一起使用。
   */
  tlsAllowInvalidHostnames: false,
  /**
   * @type {string} 指定在进行TLS连接时要信任的具有单个或多个证书颁发机构的文件的路径。<br />
   * 指定本地.pem文件的位置，该文件包含来自证书颁发机构的根证书链。该文件用于验证mongod/mongos实例提交的证书。<br />
   * 文件的路径，该文件包含在TLS连接中使用的单个或一捆受信任的证书授权。<br />
   * 该选项值在用作配置选项连接数据库时，值保持这样的字符串格式即可：'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\001根CA证书\\MongoDBSSL001_Root_CA.pem'。<br />
   * 但是作为连接字符串时，tlsCAFile选项的值需要设置成：encodeURIComponent( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\001根CA证书\\MongoDBSSL001_Root_CA.pem' )。<br />
   * 作为连接字符串时，tlsCAFile选项的值总是需要被encodeURIComponent()调用后返回的。
   */
  tlsCAFile: 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\001根CA证书\\MongoDBSSL001_Root_CA.pem',
  /**
   * @type {string} 指定客户端证书文件或客户端私钥文件的路径。如果两者都需要，则必须将文件连接起来。<br />
   * 指定本地.pem文件的位置，该文件包含客户的TLS/SSL证书和密钥，或者当tlsCertificateFile被用来提供证书时，只包含客户的TLS/SSL密钥。<br />
   * 该选项值在用作配置选项连接数据库时，值保持这样的字符串格式即可：'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.pem'。<br />
   * 但是作为连接字符串时，tlsCertificateKeyFile选项的值需要设置成：encodeURIComponent( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.pem' )。<br />
   * 作为连接字符串时，tlsCertificateKeyFile选项的值总是需要被encodeURIComponent()调用后返回的。
   */
  tlsCertificateKeyFile: 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.pem',
  /**
   * @type {string} 指定包含客户端撤销列表的本地 CRL.pem 文件的位置。
   */
  // tlsCRLFile: '',
  /**
   * @type {string} 指定用于解密TLS连接所使用的客户端私钥的密码。
   */
  // tlsCertificateKeyFilePassword: '',
  /**
   * @type {boolean} 指定尽可能放宽TLS约束，例如允许无效证书或主机名不匹配。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidCertificates”、“tlsAllowInvalidHostnames”选项一起使用。
   */
  // tlsInsecure: false,
  /**
   * @type {number|string} 该选项已经废弃！请使用writeConcern选项代替，指定客户端的默认写入问题“w”字段，值类型为：非负整数或字符串。
   */
  // w: '',
  /**
   * @type {number} 一个线程等待连接可用的最大时间，指定超时前尝试从服务器的连接池签出连接所花费的时间（以毫秒为单位，非负整数）。
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

  // 以上选项见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#connection-options   End

  // 以下选项见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html   Start

  /**
   * @type {string[] | Uint8Array | Uint8Array[]} 一个字符串数组或一个命名可能的ALPN协议的Buffer。(协议应按其优先级排序)。<br />
   * 不能只设置这个选项，因为它需要跟其他几个选项一起使用，貌似当前没啥用，可以不用设置这个选项。
   */
  /*
   ALPNProtocols: [
   'h2',
   'http/1.1',
   'http/1.0',
   ],
   */
  /**
   * @type {{ password: string, username: string }} 连接到服务器时的认证设置。
   */
  /*
   auth: {
   // 认证的密码。
   password: '',
   // 用于认证的用户名。
   username: '',
   },
   */
  /**
   * @type {AutoEncryptionOptions} 可选择启用使用中的自动加密功能。<br />
   * 类型AutoEncryptionOptions实际为（详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/AutoEncryptionOptions.html）：<br />
   * {
   *   // 允许用户绕过自动加密，保持隐性解密。
   *   bypassAutoEncryption?: boolean
   *   // 实验性选项，公共技术预览：允许用户绕过查询分析。
   *   bypassQueryAnalysis?: boolean
   *   // 实验性选项，公共技术预览：为文件中的加密字段提供一个模式。
   *   encryptedFieldsMap?: Document，也就是：[key: string]: any
   *   // 详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/AutoEncryptionOptions.html#extraOptions
   *   extraOptions?: { cryptSharedLibPath?: string; cryptSharedLibRequired?: boolean; mongocryptdBypassSpawn?: boolean; mongocryptdSpawnArgs?: string[]; mongocryptdSpawnPath?: string; mongocryptdURI?: string }
   *   // 一个用于从钥匙库中获取钥匙的MongoClient。
   *   keyVaultClient?: MongoClient
   *   // 在钥匙库中存储钥匙的命名空间。
   *   keyVaultNamespace?: string
   *   // 特定KMS供应商在密钥生成、加密和解密期间使用的配置选项。详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/AutoEncryptionOptions.html#kmsProviders
   *   kmsProviders?: { aws?: Record<string, never> | { accessKeyId: string; secretAccessKey: string; sessionToken?: string }; azure?: { clientId: string; clientSecret: string; identityPlatformEndpoint?: string; tenantId: string } | { accessToken: string }; gcp?: Record<string, never> | { email: string; endpoint?: string; privateKey: string | Buffer } | { accessToken: string }; kmip?: { endpoint?: string }; local?: { key: string | Buffer } }
   *   // 详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/AutoEncryptionOptions.html#options
   *   options?: { logger?: any }
   *   // 详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/ProxyOptions.html
   *   proxyOptions?: { proxyHost?: string; proxyPassword?: string; proxyPort?: number; proxyUsername?: string }
   *   // 命名空间与本地JSON模式的映射，用于加密，详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/AutoEncryptionOptions.html#schemaMap
   *   schemaMap?: Document，也就是：[key: string]: any
   *   // 连接到KMS提供商的TLS选项，详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/AutoEncryptionOptions.html#tlsOptions
   *   tlsOptions?: { aws?: AutoEncryptionTlsOptions; azure?: AutoEncryptionTlsOptions; gcp?: AutoEncryptionTlsOptions; kmip?: AutoEncryptionTlsOptions; local?: AutoEncryptionTlsOptions }
   * }
   * 自动加密是一个“企业专用”的功能，只适用于对集合的操作。<br />
   * 对数据库或视图的操作不支持自动加密，不绕过的操作将导致错误（见libmongocrypt: Auto Encryption Allow-List，详细见：https://github.com/mongodb/specifications/blob/master/source/client-side-encryption/client-side-encryption.rst#libmongocrypt-auto-encryption-allow-list）。<br />
   * 要绕过所有操作的自动加密，在AutoEncryptionOpts中设置bypassAutoEncryption=true。<br />
   * 自动加密要求被认证的用户有listCollections的权限操作（详细见：https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections）。<br />
   *
   * 如果用AutoEncryptionOptions配置了连接池大小有限的MongoClient（即非零的maxPoolSize），如果以下情况为真，则会创建一个单独的内部MongoClient：<br />
   * AutoEncryptionOptions.keyVaultClient没有通过。<br />
   * AutoEncryptionOptions.bypassAutomaticEncryption为假。<br />
   *
   * 如果创建了内部MongoClient，除了minPoolSize被设置为0和AutoEncryptionOptions被省略之外，它的配置与父MongoClient的选项相同。
   */
  // autoEncryption: {},
  /**
   * @type {boolean} 将BSON正则表达式作为BSONRegExp实例返回。
   */
  // bsonRegExp: true,
  /**
   * @type {string | Buffer | (string | Buffer)[]} 可以选择覆盖受信任的CA证书。默认是信任Mozilla策划的知名CA。当使用该选项明确指定CA时，Mozilla的CA将被完全替换。
   */
  // ca: '',
  /**
   * @type {string | Buffer | (string | Buffer)[]} PEM格式的证书链。<br />
   * 每个私钥应提供一个证书链。<br />
   * 每个证书链应该由所提供的私钥的PEM格式的证书组成，然后是PEM格式的中间证书（如果有的话），按顺序排列，不包括根CA（根CA必须是对等者预先知道的，见ca）。<br />
   * 当提供多个证书链时，它们的顺序不必与它们的私钥在钥匙中的顺序相同。<br />
   * 如果不提供中间证书，对等体将无法验证该证书，握手将失败。
   */
  // cert: '',
  /**
   * @type {boolean} 序列化器将检查键是否有效。
   */
  // checkKeys: true,
  /**
   * @type {(hostname: string, cert: PeerCertificate) => Error | undefined，该函数返回值类型为Error或undefined} 详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html#checkServerIdentity
   */
  // checkServerIdentity: null,
  /**
   * @type {string} 密码套件规范，取代默认的。更多信息，请参阅修改默认密码套件。允许的密码可以通过tls.getCiphers()获得。密码名称必须是大写的，以便OpenSSL接受它们。
   */
  //ciphers: '',
  /**
   * @type {string | Buffer | (string | Buffer)[]} PEM格式的CRL（证书吊销列表）。
   */
  // crl: '',
  /**
   * @type {DriverInfo} 允许包装驱动修改由驱动生成的客户端元数据，以包括关于包装驱动的信息。
   */
  driverInfo: {
    name: 'npm_mongodb_driver_for_deno',
    platform: 'deno@1.41.3',
    version: 'mongodb@6.5.0',
  },
  /**
   * @type {string} 一个描述命名的曲线的字符串，或者一个用冒号分隔的曲线NID或名称的列表，例如：P-521:P-384:P-256，用于ECDH密钥协议。<br />
   * 设置为auto可以自动选择曲线。<br />
   * 使用 crypto.getCurves() 来获取可用的曲线名称列表。<br />
   * 在最近的版本中，openssl ecparam -list_curves 也会显示每个可用的椭圆曲线的名称和描述。<br />
   * 默认值：tls.DEFAULT_ECDH_CURVE。
   */
  // ecdhCurve: '',
  /**
   * @type {boolean} 在反序列化BSON文档时启用utf8验证。默认为true。
   */
  // enableUtf8Validation: true,
  /**
   * @type {number} IP栈的版本。必须是4、6或0。数值0表示同时允许IPv4和IPv6地址。默认值：0。
   */
  // family: 0,
  /**
   * @type {Document，也就是：[key: string]: any} 允许指定我们是否希望以非序列化的原始缓冲区的形式返回哪些字段。
   */
  // fieldsAsRaw: null,
  /**
   * @type {boolean} 强制服务器分配_id值，而不是驱动程序。
   */
  // forceServerObjectId: true,
  /**
   * @type {number} hints选项现在在所有情况下都默认为0。以前，在没有family选项的情况下，它会默认为dns.ADDRCONFIG | dns.V4MAPPED。
   */
  // hints: 0,
  /**
   * @type {boolean} 序列化将不会发出未定义的字段。
   */
  // ignoreUndefined: true,
  /**
   * @type {boolean} 启用TCP连接保持活力。
   */
  // keepAlive: true,
  /**
   * @type {number} 在TCP套接字上启动keepAlive之前要等待的毫秒数。
   */
  // keepAliveInitialDelay: 0,
  /**
   * @type {string | Buffer | (string | Buffer | KeyObject)[]} PEM格式的私钥。<br />
   * PEM允许私人钥匙被加密的选项。<br />
   * 加密的钥匙将用options.passphrase进行解密。<br />
   * 使用不同算法的多把钥匙可以以未加密的钥匙字符串或缓冲区阵列的形式提供，或者以{pem：<string|buffer>[, passphrase: ]}。<br />
   * 对象形式只能出现在一个数组中。<br />
   * object.passphrase是可选的。<br />
   * 如果提供了object.passphrase，加密的密钥将被解密，如果没有，则使用options.passphrase。
   */
  // key: '',
  /**
   * @type {string} 套接字应该连接的本地地址。
   */
  // localAddress: '',
  /**
   * @type {number} 套接字应该连接的本地端口。
   */
  // localPort: 8080,
  /**
   * @type {LookupFunction} 详细见：https://nodejs.org/dist/latest/docs/api/net.html#socketconnectoptions-connectlistener
   */
  // lookup: null,
  /**
   * @type {number} 接受TLS连接的DH参数的最小尺寸，以比特为单位。当服务器提供的DH参数的大小小于minDHSize时，TLS连接将被破坏并产生错误。默认值：1024。
   */
  // minDHSize: 1024,
  /**
   * @type {number} 设置最小心跳频率。如果驱动程序必须经常重新检查服务器的可用性，它将至少在上次检查后等待这么长时间，以避免浪费精力。
   */
  // minHeartbeatFrequencyMS: 0,
  /**
   * @type {boolean} 启用该客户端的命令监控。
   */
  // monitorCommands: true,
  /**
   * @type {boolean} TCP连接无延迟。
   */
  // noDelay: true,
  /**
   * @type {string} 用于单个私钥和/或PFX的共享口令。
   */
  // passphrase: '',
  /**
   * @type {string | Buffer | (string | Buffer | PxfObject)[]} PFX或PKCS12编码的私钥和证书链。<br />
   * PFX是单独提供钥匙和证书的一种选择。PFX通常是加密的，如果是加密的，将使用口令来解密。<br />
   * 多个PFX可以以未加密的PFX缓冲区阵列的形式提供，或者以{buf：<string|buffer>[, passphrase: ]}。<br />
   * 对象形式只能出现在数组中。<br />
   * object.passphrase是可选的。如果提供的话，加密的PFX将用object.passphrase解密，如果没有的话，则用options.passphrase解密。
   */
  // pfx: '',
  /**
   * @type {{createPk: () => any（当js-bson被类型化时，函数应该返回一些BSON类型）}} 一个用于生成自定义_id键的主键工厂函数。
   */
  // pkFactory: null,
  /**
   * @type {boolean} 当反序列化一个二进制文件时，将把它作为一个node.js Buffer实例返回。
   */
  // promoteBuffers: true,
  /**
   * @type {boolean} 当反序列化一个Long时，如果它小于53位，就会把它装入一个Number。
   */
  // promoteLongs: true,
  /**
   * @type {boolean} 当反序列化时，会将BSON值提升为与之最接近的Node.js等效类型。
   */
  // promoteValues: true,
  /**
   * @type {boolean} 请注意有一个已知的限制，即该选项不能在MongoClient层面使用（见NODE-3946）。它在Db、Collection和每个操作中都能正确工作，与其他BSON选项的工作方式相同。<br />
   * 启用原始选项将返回一个使用 allocUnsafe API 分配的 Node.js Buffer。<br />
   * 关于 "不安全 "在这里指的是什么，请参见Node.js文档的这一节，了解更多细节。<br />
   * 如果你需要维护你自己的可编辑的克隆字节，以延长进程的寿命，建议你分配自己的缓冲区并克隆内容。<br />
   * 详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html#raw
   */
  // raw: false,
  /**
   * @type {ReadConcernLike} 为集合指定一个读取关注（仅支持MongoDB 3.2或更高版本）。
   * 关于类型ReadConcernLike，详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/modules.html#ReadConcernLike
   * https://github.com/mongodb/node-mongodb-native/blob/v5.1.0/src/read_concern.ts#L16
   */
  // readConcern: null,
  /**
   * @type {boolean} 如果为 "true"，服务器将拒绝任何未经所提供的 CA 列表授权的连接。这个选项只有在 requestCert 为真时才有作用。
   */
  // rejectUnauthorized: true,
  /**
   * @type {SecureContext} 来自tls.createSecureContext()的可选TLS上下文对象。
   */
  // secureContext: null,
  /**
   * @type {string} 遗留机制，选择要使用的TLS协议版本，它不支持最小和最大版本的独立控制，也不支持将协议限制在TLSv1.3。<br />
   * 使用minVersion和maxVersion代替。<br />
   * 可能的值被列为SSL_METHODS，使用函数名称作为字符串。<br />
   * 例如，使用'TLSv1_1_method'来强制使用TLS1.1版本，或者使用'TLS_method'来允许任何TLS协议版本，直至TLSv1.3。<br />
   * 不建议使用小于1.2的TLS版本，但为了互操作性可能需要这样做。<br />
   * 默认：无，见minVersion。
   */
  // secureProtocol: '',
  /**
   * @type {boolean} 将javascript函数序列化（默认：false）。
   */
  // serializeFunctions: false,
  /**
   * @type {string|{deprecationErrors?: boolean; strict?: boolean; version: '1'}} 服务器API版本。
   */
  // serverApi: '1',
  /**
   * @type {string} 用于SNI（服务器名称指示）TLS扩展的服务器名称。
   * 它是被连接的主机的名字，必须是一个主机名，而不是一个IP地址。
   * 它可以被一个多宿主的服务器用来选择正确的证书来提交给客户端，参见tls.createServer()的SNICallback选项。
   * 详细见：https://nodejs.org/dist/latest/docs/api/tls.html#tlsconnectoptions-callback
   */
  // servername: '',
  /**
   * @type {Buffer} 一个Buffer实例，包含TLS会话。
   * 详细见：https://nodejs.org/dist/latest/docs/api/tls.html#tlsconnectoptions-callback
   */
  // session: null,
  /**
   * @type {string} SSL证书文件路径。
   */
  // sslCA: '',
  /**
   * @type {string} SSL证书撤销列表文件路径。
   */
  // sslCRL: '',
  /**
   * @type {string} SSL证书文件路径。
   */
  // sslCert: '',
  /**
   * @type {string} SSL密钥文件的路径。
   */
  // sslKey: '',
  /**
   * @type {string} SSL证书通过短语，即密码。
   */
  // sslPass: '',
  /**
   * @type {boolean} 根据证书机构验证mongod服务器证书。
   */
  // sslValidate: true,
  /**
   * @type {string} 指定本地TLS证书的位置。<br />
   * 该选项值在用作配置选项连接数据库时，值保持这样的字符串格式即可：'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.crt'。<br />
   * 但是作为连接字符串时，tlsCertificateFile选项的值需要设置成：encodeURIComponent( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.crt' )。<br />
   * 作为连接字符串时，tlsCertificateFile选项的值总是需要被encodeURIComponent()调用后返回的。
   */
  // tlsCertificateFile: decodeURI( decodeURI( import.meta.resolve( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA.crt` ).slice( 8 ) ) ),
  /**
   * @type {boolean} 当对Long进行反序列化时，将以BigInt的形式返回，true表示启用。
   */
  // useBigInt64: true,
  /**
   * @type {WriteConcern | WriteConcernSettings} 一个MongoDB WriteConcern，它描述了从MongoDB请求写操作的确认水平。
   * 详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/classes/WriteConcern.html
   * https://mongodb.github.io/node-mongodb-native/6.5/interfaces/WriteConcernSettings.html
   * https://docs.mongodb.com/manual/reference/write-concern/
   */
  // writeConcern: null,
  /**
   * @type {number} 废弃的！请使用writeConcern选项代替，写入关注的超时。
   */
  // wtimeoutMS: 0,

  // 以上选项见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html   End

  // 之所以还要强制使用“as”，是因为如果不这样，会报类型错误！真奇葩！
} as T_MongoClientOptions;

const client: MongoClient = new MongoClient( 'mongodb://127.0.0.1:27777', mongoClientConfig );

async function run(): Promise<void>{
  try{
    const database: T_Db = client.db( 'local' ),
      startup_log_collection: T_Collection<I_StartupLogCollectionSchema> = database.collection<I_StartupLogCollectionSchema>( 'startup_log' ),
      startup_log: Array<I_StartupLogCollectionSchema> = await startup_log_collection.find<I_StartupLogCollectionSchema>( {
        hostname: 'LPQAQ',
      } ).toArray();

    console.dir( startup_log );
  }
  catch( e: unknown ){
    console.error( e );
  }
  finally{
    await client.close( true );
  }
}

await run();
