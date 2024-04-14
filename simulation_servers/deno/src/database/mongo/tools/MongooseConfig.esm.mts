/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/tools/MongooseConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:33:39 星期三
 */

/**
 * 1、直到2024年03月23日，基于：npm包mongoose@8.2.3（该版本的mongoose也是基于npm包mongodb@6.5.0）、MongoDB社区版@7.0.7、deno@1.41.3，还是无法使用TLS以及客户端证书跟数据库进行连接。
 * 但是同样的npm包mongoose@8.2.3（该版本的mongoose也是基于npm包mongodb@6.5.0）、MongoDB社区版@7.0.7在node中是可以的。
 */

'use strict';

import {
  type ConnectOptions as T_ConnectOptions,
  type HydratedDocument as T_HydratedDocument,
  type SchemaOptions as T_SchemaOptions,
} from 'npm:mongoose';

import {
  opensslDir,
} from 'configures/GlobalParameters.esm.mts';

/**
 * 所要连接的数据库url。
 *
 * @type {string}
 */
const uri: string = 'mongodb://127.0.0.1:27777',
  /**
   * 所要连接的数据库名。
   *
   * @type {string}
   */
  dbName: string = 'simulation_servers_deno';

/**
 * node版本的mongoose驱动程序的客户端连接配置选项。该驱动程序的配置选项详细见：
 * https://mongoosejs.com/docs/connections.html
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#connection-options
 * https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html
 *
 * @type {T_ConnectOptions}
 */
const mongooseConfig: T_ConnectOptions = {
  // 以下选项是mongoose自己的选项。Start

  /**
   * 设置为 false 可禁用与此连接关联的所有模型的自动索引创建。<br />
   * 当你的应用程序启动时，Mongoose会自动为你模式中的每个定义的索引调用createIndex。<br />
   * Mongoose会依次为每个索引调用createIndex，并在所有createIndex调用成功或出现错误时，在模型上发出一个 "index "事件。<br />
   * 虽然在开发中很好，但建议在生产中禁用这种行为，因为索引创建会对性能造成很大影响。<br />
   * 通过将你的模式的autoIndex选项设置为false来禁用该行为，或者通过将autoIndex选项设置为false来在全局连接上禁用。<br />
   *
   * @type {boolean}
   */
  autoIndex: false,
  /**
   * 设置为true可使Mongoose在此连接上创建的每个模型上自动调用'createCollection()'。<br />
   * 你可以通过使用mongoose.set('autoCreate', false)将autoCreate设置为false来停用这一行为。<br />
   * 像autoIndex一样，autoCreate对开发和测试环境很有帮助，但你可能想在生产中禁用它以避免不必要的数据库调用。<br />
   *
   * @type {boolean}
   */
  autoCreate: true,
  /**
   * 默认情况下，当连接中断时，mongoose会缓冲命令，直到驱动程序设法重新连接。要禁用缓冲，请将bufferCommands设置为false。<br />
   * Schema的bufferCommands选项覆盖了全局的bufferCommands选项。<br />
   *
   * @type {boolean}
   */
  bufferCommands: true,

  // 以上选项是mongoose自己的选项。End

  // 以下选项见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#connection-options   Start

  /**
   * 指定驱动程序在客户端元数据中作为连接握手的一部分传递给服务器的应用程序名称。服务器在建立连接时将应用名称打印到MongoDB日志中。它也会被记录在慢速查询日志和配置文件集合中。<br />
   * 创建该MongoClient实例的应用程序的名称。MongoDB 3.4和更新版本会在建立每个连接时在服务器日志中打印这个值。它也会被记录在慢速查询日志和配置文件集合中。
   *
   * @type {string}
   */
  appName: 'npm_mongoose_driver_for_deno',
  /**
   * 指定与服务器连接时要使用的认证机制方法。如果你没有指定一个值，驱动程序会使用默认的机制，根据服务器的版本，SCRAM-SHA-1或SCRAM-SHA-256。参见认证机制以了解可用的认证机制。<br />
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
   *
   * @type {string}
   */
  // authMechanism: 'MONGODB-X509',
  /**
   * 指定为认证提供的额外选项，例如为GSSAPI启用主机名规范化。<br />
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
   *
   * @type {AuthMechanismProperties}
   */
  // authMechanismProperties: {},
  /**
   * 指定与用户凭证相关的数据库名称。指定连接应针对的数据库进行验证。
   *
   * @type {string}
   */
  // authSource: '$external',
  /**
   * 指定发送到或从服务器接收的有线协议信息的允许压缩类型。更多信息见网络压缩。<br />
   * 值格式为逗号分隔的字符串列表，例如：'snappy,zlib,zstd'。<br />
   * 一个数组或以逗号分隔的压缩器字符串，用于在该客户端和mongod/mongos实例之间的通信中启用网络压缩。
   *
   * @type {string | ('none' | 'snappy' | 'zlib' | 'zstd')[]}
   */
  // compressors: 'snappy,zlib,zstd',
  /**
   * 在超时前尝试连接的时间。指定在引发错误之前，等待建立与服务器的单个TCP套接字连接的时间，单位是毫秒（非负整数）。指定0将禁用连接超时。
   *
   * @type {number}
   */
  // connectTimeoutMS: 30000,
  /**
   * 指定是否将所有操作强制分派给连接URI中指定的主机。<br />
   * 允许驱动程序以包含一个主机的连接字符串强制使用单一拓扑类型。
   *
   * @type {boolean}
   */
  // directConnection: false,
  /**
   * 指定常规服务器监控检查的间隔时间，以毫秒为单位（大于或等于500的整数）。<br />
   * heartbeatFrequencyMS控制驱动程序何时检查MongoDB部署的状态。指定检查的间隔时间（以毫秒为单位），从上一次检查结束到下一次开始计算。
   *
   * @type {number}
   */
  // heartbeatFrequencyMS: 500,
  /**
   * 已废弃！日志写关注。请使用writeConcern选项代替。更多信息请参见：https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-j
   *
   * @type {boolean}
   */
  // journal: false,
  /**
   * 指定驱动程序是否连接到一个负载平衡器。<br />
   * 指示驱动程序，它正在连接到一个负载均衡器，以支持类似mongos的服务。
   *
   * @type {boolean}
   */
  // loadBalanced: false,
  /**
   * 指定延迟窗口的大小，以毫秒为单位（非负整数），在合适的服务器之间选择往返时间。指定0意味着没有等待，意味着最快的可用服务器。
   *
   * @type {number}
   */
  // localThresholdMS: 15,
  /**
   * 指定一个连接在被关闭之前可以空闲的时间，以毫秒为单位（非负整数）。指定为0意味着没有最小值。<br />
   * 一个连接在被删除和关闭之前在池中保持空闲的最大毫秒数。
   *
   * @type {number}
   */
  // maxIdleTimeMS: 0,
  /**
   * 指定驱动程序在其连接池中可以创建的最大客户数或连接数（非负整数）。这个数字包括正在使用的连接。
   *
   * @type {number}
   */
  maxPoolSize: 10000,
  /**
   * 指定一个驱动程序的连接池可以并发建立的最大连接数（非负整数）。
   *
   * @type {number}
   */
  maxConnecting: 100,
  /**
   * 指定辅助服务器可以经历并且仍有资格选择服务器的最大复制延迟（以墙上的时钟时间为单位）。指定-1表示没有最大值，-1或大于或等于90的整数。<br />
   * 以秒为单位，指定在客户端停止使用一个二级单位进行读取操作之前，该二级单位可以有多大的陈旧度。
   *
   * @type {number}
   */
  // maxStalenessSeconds: -1,
  /**
   * 指定驱动程序应在连接池中创建和维护的连接数（非负整数），即使没有操作发生。此计数包括正在使用的连接。
   *
   * @type {number}
   */
  // minPoolSize: 0,
  /**
   * 指定用于连接MongoDB服务的SOCKS5代理服务器的IPv4/IPv6地址或域名。
   *
   * @type {string}
   */
  // proxyHost: '127.0.0.1',
  /**
   * 指定在proxyHost中指定的SOCKS5代理服务器的端口（非负整数）。
   *
   * @type {number}
   */
  // proxyPort: 9666,
  /**
   * 指定对proxyHost中指定的SOCKS5代理服务器进行用户名/密码身份验证的用户名。
   *
   * @type {string}
   */
  // proxyUsername: '',
  /**
   * 指定对proxyHost中指定的SOCKS5代理服务器进行用户名/密码身份验证的密码。
   *
   * @type {string}
   */
  // proxyPassword: '',
  /**
   * 隔离的程度，指定客户端的默认读取问题。有关更多信息，请参阅阅读关注。
   * 详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/modules.html#ReadConcernLevel
   *
   * @type {'local' | 'majority' | 'linearizable' | 'available' | 'snapshot'}
   */
  // readConcernLevel: '',
  /**
   * 指定此连接的阅读偏好，指定客户端的默认读取首选项（不包括标记）。有关更多信息，请参阅阅读偏好。
   * 详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/classes/ReadPreference.html
   *
   * @type {'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest'}
   */
  // readPreference: 'primary',
  /**
   * 指定客户端的默认读取首选项标记。只有当读取首选项模式不是主要模式时，此选项才有效。驱动程序使用URI中标记的顺序作为读取首选项的顺序。<br />
   * 值格式为逗号分隔的键值对，例如：'dc:ny,rack:1'和'dc:ny'可以指定多次，该键的每个实例都是一个单独的标记集。
   *
   * @type {{ [key: string]: string }[]}
   */
  // readPreferenceTags: '',
  /**
   * 指定要连接到的复制副本集的名称，如果mongod是一个复制集的成员，则指定复制集的名称。
   *
   * @type {string}
   */
  // replicaSet: '',
  /**
   * 启用可重试的读取。
   *
   * @type {boolean}
   */
  retryReads: true,
  /**
   * 启用可重试的写入。
   *
   * @type {boolean}
   */
  retryWrites: true,
  /**
   * 默认值“auto”，指定驱动程序监控使用的监控模式。
   * 当该选项设置为'auto'时，监控模式由驱动程序的运行环境决定：
   * 1、在功能即服务（FaaS）环境中，驱动程序使用'poll'模式。
   * 2、而在其他环境中则使用'stream'模式。
   *
   * @type {'auto' | 'stream' | 'poll'}
   */
  serverMonitoringMode: 'auto',
  /**
   * 指定在引发错误之前阻止服务器选择的超时时间（以毫秒为单位，非负整数）。
   *
   * @type {number}
   */
  // serverSelectionTimeoutMS: 30000,
  /**
   * 指定在服务器选择失败后只扫描拓扑一次，而不是重复扫描，直到服务器选择超时为止。
   *
   * @type {boolean}
   */
  // serverSelectionTryOnce: true,
  /**
   * 指定超时前尝试在套接字上发送或接收所花费的时间（以毫秒为单位，非负整数）。指定0表示没有超时。<br />
   * 在尝试超时之前，在套接字上尝试发送或接收的时间，以毫秒计。
   *
   * @type {number}
   */
  // socketTimeoutMS: 0,
  /**
   * 指定在初始填充种子列表时或在SRV轮询期间向拓扑中添加新主机时要随机选择的SRV结果的最大数目（非负整数）。<br />
   * 当使用srv连接字符串时，要连接的最大主机数，设置为0意味着无限的主机数。
   *
   * @type {number}
   */
  // srvMaxHosts: 0,
  /**
   * 指定在初始DNS种子列表发现中用于SRV查找的服务名称，根据RFC 6335的有效SRV服务名称。<br />
   * 修改srv URI，使其看起来像：<br />
   * _{srvServiceName}._tcp.{hostname}.{domainname}
   * 查询这个DNS URI预计会有SRV记录的回应
   *
   * @type {string}
   */
  // srvServiceName: 'mongodb',
  /**
   * ssl是tls选项的别名。
   *
   * @type {boolean}
   */
  // ssl: true,
  /**
   * 指定操作完全执行的超时时间（以毫秒为单位，非负整数），取消设置（默认情况下未启用该功能）。
   *
   * @type {number}
   */
  // timeoutMS: 0,
  /**
   * 指定连接到服务器是否需要TLS。使用“mongodb+srv”的srvServiceName，或指定其他以tls为前缀的选项，将默认tls为true。
   *
   * @type {boolean}
   */
  tls: false,
  /**
   * 指定当服务器的TLS证书无效时，驱动程序是否应该出错。<br />
   * 绕过由mongod/mongos实例提交的证书验证。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidCertificates”选项一起使用。
   *
   * @type {boolean}
   */
  tlsAllowInvalidCertificates: false,
  /**
   * 指定当服务器的主机名与TLS证书指定的主机名不匹配时，驱动程序是否应该出错。<br />
   * 禁止对mongod/mongos实例提交的证书进行主机名验证。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidHostnames”选项一起使用。
   *
   * @type {boolean}
   */
  tlsAllowInvalidHostnames: false,
  /**
   * 指定在进行TLS连接时要信任的具有单个或多个证书颁发机构的文件的路径。<br />
   * 指定本地.pem文件的位置，该文件包含来自证书颁发机构的根证书链。该文件用于验证mongod/mongos实例提交的证书。<br />
   * 文件的路径，该文件包含在TLS连接中使用的单个或一捆受信任的证书授权。<br />
   * 该选项值在用作配置选项连接数据库时，值保持这样的字符串格式即可：'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\001根CA证书\\MongoDBSSL001_Root_CA.pem'。<br />
   * 但是作为连接字符串时，tlsCAFile选项的值需要设置成：encodeURIComponent( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\001根CA证书\\MongoDBSSL001_Root_CA.pem' )。<br />
   * 作为连接字符串时，tlsCAFile选项的值总是需要被encodeURIComponent()调用后返回的。
   *
   * @type {string}
   */
  tlsCAFile: decodeURI( import.meta.resolve( `${ opensslDir }/MongoDBSSL001/001根CA证书/MongoDBSSL001_Root_CA.pem` ).slice( 8 ) ),
  /**
   * 指定客户端证书文件或客户端私钥文件的路径。如果两者都需要，则必须将文件连接起来。<br />
   * 指定本地.pem文件的位置，该文件包含客户的TLS/SSL证书和密钥，或者当tlsCertificateFile被用来提供证书时，只包含客户的TLS/SSL密钥。<br />
   * 该选项值在用作配置选项连接数据库时，值保持这样的字符串格式即可：'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.pem'。<br />
   * 但是作为连接字符串时，tlsCertificateKeyFile选项的值需要设置成：encodeURIComponent( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.pem' )。<br />
   * 作为连接字符串时，tlsCertificateKeyFile选项的值总是需要被encodeURIComponent()调用后返回的。
   *
   * @type {string}
   */
  tlsCertificateKeyFile: decodeURI( import.meta.resolve( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA.pem` ).slice( 8 ) ),
  /**
   * 指定包含客户端撤销列表的本地 CRL.pem 文件的位置。
   *
   * @type {string}
   */
  // tlsCRLFile: '',
  /**
   * 指定用于解密TLS连接所使用的客户端私钥的密码。
   *
   * @type {string}
   */
  // tlsCertificateKeyFilePassword: '',
  /**
   * 指定尽可能放宽TLS约束，例如允许无效证书或主机名不匹配。<br />
   * 注意！“tlsInsecure”选项不能与“tlsAllowInvalidCertificates”、“tlsAllowInvalidHostnames”选项一起使用。
   *
   * @type {boolean}
   */
  // tlsInsecure: false,
  /**
   * 该选项已经废弃！请使用writeConcern选项代替，指定客户端的默认写入问题“w”字段，值类型为：非负整数或字符串。
   *
   * @type {number|string}
   */
  // w: '',
  /**
   * 一个线程等待连接可用的最大时间，指定超时前尝试从服务器的连接池签出连接所花费的时间（以毫秒为单位，非负整数）。
   *
   * @type {number}
   */
  // waitQueueTimeoutMS: 0,
  /**
   * 指定客户端的默认写入问题“wtimeout”字段，非负整数。
   *
   * @type {number}
   */
  // wTimeoutMS: 0,
  /**
   * 指定使用zlib压缩有线协议消息时的压缩级别-1表示默认级别（介于-1和9之间的整数，-1、9也包括在内），0表示无压缩，1表示最快速度，9表示最佳压缩。有关详细信息，请参阅网络压缩。
   *
   * @type {number}
   */
  // zlibCompressionLevel: -1,

  // 以上选项见：https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/#connection-options   End

  // 以下选项见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html   Start

  /**
   * 一个字符串数组或一个命名可能的ALPN协议的Buffer。(协议应按其优先级排序)。<br />
   * 不能只设置这个选项，因为它需要跟其他几个选项一起使用，貌似当前没啥用，可以不用设置这个选项。
   *
   * @type {string[] | Uint8Array | Uint8Array[]}
   */
  /*
   ALPNProtocols: [
   'h2',
   'http/1.1',
   'http/1.0',
   ],
   */
  /**
   * 连接到服务器时的认证设置。
   *
   * @type {{ password: string, username: string }}
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
   * 可选择启用使用中的自动加密功能。<br />
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
   *
   * @type {AutoEncryptionOptions}
   */
  // autoEncryption: {},
  /**
   * 将BSON正则表达式作为BSONRegExp实例返回。
   *
   * @type {boolean}
   */
  // bsonRegExp: true,
  /**
   * 可以选择覆盖受信任的CA证书。默认是信任Mozilla策划的知名CA。当使用该选项明确指定CA时，Mozilla的CA将被完全替换。
   *
   * @type {string | Buffer | (string | Buffer)[]}
   */
  // ca: '',
  /**
   * PEM格式的证书链。<br />
   * 每个私钥应提供一个证书链。<br />
   * 每个证书链应该由所提供的私钥的PEM格式的证书组成，然后是PEM格式的中间证书（如果有的话），按顺序排列，不包括根CA（根CA必须是对等者预先知道的，见ca）。<br />
   * 当提供多个证书链时，它们的顺序不必与它们的私钥在钥匙中的顺序相同。<br />
   * 如果不提供中间证书，对等体将无法验证该证书，握手将失败。
   *
   * @type {string | Buffer | (string | Buffer)[]}
   */
  // cert: '',
  /**
   * 序列化器将检查键是否有效。
   *
   * @type {boolean}
   */
  // checkKeys: true,
  /**
   * 详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html#checkServerIdentity
   *
   * @type {(hostname: string, cert: PeerCertificate) => Error | undefined，该函数返回值类型为Error或undefined}
   */
  // checkServerIdentity: null,
  /**
   * 密码套件规范，取代默认的。更多信息，请参阅修改默认密码套件。允许的密码可以通过tls.getCiphers()获得。密码名称必须是大写的，以便OpenSSL接受它们。
   *
   * @type {string}
   */
  //ciphers: '',
  /**
   * PEM格式的CRL（证书吊销列表）。
   *
   * @type {string | Buffer | (string | Buffer)[]}
   */
  // crl: '',
  /**
   * 允许包装驱动修改由驱动生成的客户端元数据，以包括关于包装驱动的信息。
   *
   * @type {DriverInfo}
   */
  driverInfo: {
    name: 'npm_mongoose_driver_for_deno',
    platform: 'deno@1.41.3',
    version: 'mongoose@8.2.3',
  },
  /**
   * 一个描述命名的曲线的字符串，或者一个用冒号分隔的曲线NID或名称的列表，例如：P-521:P-384:P-256，用于ECDH密钥协议。<br />
   * 设置为auto可以自动选择曲线。<br />
   * 使用 crypto.getCurves() 来获取可用的曲线名称列表。<br />
   * 在最近的版本中，openssl ecparam -list_curves 也会显示每个可用的椭圆曲线的名称和描述。<br />
   * 默认值：tls.DEFAULT_ECDH_CURVE。
   *
   * @type {string}
   */
  // ecdhCurve: '',
  /**
   * 在反序列化BSON文档时启用utf8验证。默认为true。
   *
   * @type {boolean}
   */
  // enableUtf8Validation: true,
  /**
   * IP栈的版本。必须是4、6或0。数值0表示同时允许IPv4和IPv6地址。默认值：0。
   *
   * @type {number}
   */
  // family: 0,
  /**
   * 允许指定我们是否希望以非序列化的原始缓冲区的形式返回哪些字段。
   *
   * @type {Document，也就是：[key: string]: any}
   */
  // fieldsAsRaw: null,
  /**
   * 强制服务器分配_id值，而不是驱动程序。
   *
   * @type {boolean}
   */
  // forceServerObjectId: true,
  /**
   * hints选项现在在所有情况下都默认为0。以前，在没有family选项的情况下，它会默认为dns.ADDRCONFIG | dns.V4MAPPED。
   *
   * @type {number}
   */
  // hints: 0,
  /**
   * 序列化将不会发出未定义的字段。
   *
   * @type {boolean}
   */
  // ignoreUndefined: true,
  /**
   * 启用TCP连接保持活力。
   *
   * @type {boolean}
   */
  // keepAlive: true,
  /**
   * 在TCP套接字上启动keepAlive之前要等待的毫秒数。
   *
   * @type {number}
   */
  // keepAliveInitialDelay: 0,
  /**
   * PEM格式的私钥。<br />
   * PEM允许私人钥匙被加密的选项。<br />
   * 加密的钥匙将用options.passphrase进行解密。<br />
   * 使用不同算法的多把钥匙可以以未加密的钥匙字符串或缓冲区阵列的形式提供，或者以{pem：<string|buffer>[, passphrase: ]}。<br />
   * 对象形式只能出现在一个数组中。<br />
   * object.passphrase是可选的。<br />
   * 如果提供了object.passphrase，加密的密钥将被解密，如果没有，则使用options.passphrase。
   *
   * @type {string | Buffer | (string | Buffer | KeyObject)[]}
   */
  // key: '',
  /**
   * 套接字应该连接的本地地址。
   *
   * @type {string}
   */
  // localAddress: '',
  /**
   * 套接字应该连接的本地端口。
   *
   * @type {number}
   */
  // localPort: 8080,
  /**
   * 详细见：https://nodejs.org/dist/latest/docs/api/net.html#socketconnectoptions-connectlistener
   *
   * @type {LookupFunction}
   */
  // lookup: null,
  /**
   * 接受TLS连接的DH参数的最小尺寸，以比特为单位。当服务器提供的DH参数的大小小于minDHSize时，TLS连接将被破坏并产生错误。默认值：1024。
   *
   * @type {number}
   */
  // minDHSize: 1024,
  /**
   * 设置最小心跳频率。如果驱动程序必须经常重新检查服务器的可用性，它将至少在上次检查后等待这么长时间，以避免浪费精力。
   *
   * @type {number}
   */
  // minHeartbeatFrequencyMS: 0,
  /**
   * 启用该客户端的命令监控。
   *
   * @type {boolean}
   */
  // monitorCommands: true,
  /**
   * TCP连接无延迟。
   *
   * @type {boolean}
   */
  // noDelay: true,
  /**
   * 用于单个私钥和/或PFX的共享口令。
   *
   * @type {string}
   */
  // passphrase: '',
  /**
   * PFX或PKCS12编码的私钥和证书链。<br />
   * PFX是单独提供钥匙和证书的一种选择。PFX通常是加密的，如果是加密的，将使用口令来解密。<br />
   * 多个PFX可以以未加密的PFX缓冲区阵列的形式提供，或者以{buf：<string|buffer>[, passphrase: ]}。<br />
   * 对象形式只能出现在数组中。<br />
   * object.passphrase是可选的。如果提供的话，加密的PFX将用object.passphrase解密，如果没有的话，则用options.passphrase解密。
   *
   * @type {string | Buffer | (string | Buffer | PxfObject)[]}
   */
  // pfx: '',
  /**
   * 一个用于生成自定义_id键的主键工厂函数。
   *
   * @type {{createPk: () => any（当js-bson被类型化时，函数应该返回一些BSON类型）}}
   */
  // pkFactory: null,
  /**
   * 当反序列化一个二进制文件时，将把它作为一个node.js Buffer实例返回。
   *
   * @type {boolean}
   */
  // promoteBuffers: true,
  /**
   * 当反序列化一个Long时，如果它小于53位，就会把它装入一个Number。
   *
   * @type {boolean}
   */
  // promoteLongs: true,
  /**
   * 当反序列化时，会将BSON值提升为与之最接近的Node.js等效类型。
   *
   * @type {boolean}
   */
  // promoteValues: true,
  /**
   * 请注意有一个已知的限制，即该选项不能在MongoClient层面使用（见NODE-3946）。它在Db、Collection和每个操作中都能正确工作，与其他BSON选项的工作方式相同。<br />
   * 启用原始选项将返回一个使用 allocUnsafe API 分配的 Node.js Buffer。<br />
   * 关于 "不安全 "在这里指的是什么，请参见Node.js文档的这一节，了解更多细节。<br />
   * 如果你需要维护你自己的可编辑的克隆字节，以延长进程的寿命，建议你分配自己的缓冲区并克隆内容。<br />
   * 详细见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html#raw
   *
   * @type {boolean}
   */
  // raw: false,
  /**
   * 为集合指定一个读取关注（仅支持MongoDB 3.2或更高版本）。
   * 关于类型ReadConcernLike，详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/modules.html#ReadConcernLike
   * https://github.com/mongodb/node-mongodb-native/blob/v5.1.0/src/read_concern.ts#L16
   *
   * @type {ReadConcernLike}
   */
  // readConcern: null,
  /**
   * 如果为 "true"，服务器将拒绝任何未经所提供的 CA 列表授权的连接。这个选项只有在 requestCert 为真时才有作用。
   *
   * @type {boolean}
   */
  // rejectUnauthorized: true,
  /**
   * 来自tls.createSecureContext()的可选TLS上下文对象。
   *
   * @type {SecureContext}
   */
  // secureContext: null,
  /**
   * 遗留机制，选择要使用的TLS协议版本，它不支持最小和最大版本的独立控制，也不支持将协议限制在TLSv1.3。<br />
   * 使用minVersion和maxVersion代替。<br />
   * 可能的值被列为SSL_METHODS，使用函数名称作为字符串。<br />
   * 例如，使用'TLSv1_1_method'来强制使用TLS1.1版本，或者使用'TLS_method'来允许任何TLS协议版本，直至TLSv1.3。<br />
   * 不建议使用小于1.2的TLS版本，但为了互操作性可能需要这样做。<br />
   * 默认：无，见minVersion。
   *
   * @type {string}
   */
  // secureProtocol: '',
  /**
   * 将javascript函数序列化（默认：false）。
   *
   * @type {boolean}
   */
  // serializeFunctions: false,
  /**
   * 服务器API版本。
   *
   * @type {string|{deprecationErrors?: boolean; strict?: boolean; version: '1'}}
   */
  // serverApi: '1',
  /**
   * 用于SNI（服务器名称指示）TLS扩展的服务器名称。
   * 它是被连接的主机的名字，必须是一个主机名，而不是一个IP地址。
   * 它可以被一个多宿主的服务器用来选择正确的证书来提交给客户端，参见tls.createServer()的SNICallback选项。
   * 详细见：https://nodejs.org/dist/latest/docs/api/tls.html#tlsconnectoptions-callback
   *
   * @type {string}
   */
  // servername: '',
  /**
   * 一个Buffer实例，包含TLS会话。
   * 详细见：https://nodejs.org/dist/latest/docs/api/tls.html#tlsconnectoptions-callback
   *
   * @type {Buffer}
   */
  // session: null,
  /**
   * SSL证书文件路径。
   *
   * @type {string}
   */
  // sslCA: '',
  /**
   * SSL证书撤销列表文件路径。
   *
   * @type {string}
   */
  // sslCRL: '',
  /**
   * SSL证书文件路径。
   *
   * @type {string}
   */
  // sslCert: '',
  /**
   * SSL密钥文件的路径。
   *
   * @type {string}
   */
  // sslKey: '',
  /**
   * SSL证书通过短语，即密码。
   *
   * @type {string}
   */
  // sslPass: '',
  /**
   * 根据证书机构验证mongod服务器证书。
   *
   * @type {boolean}
   */
  // sslValidate: true,
  /**
   * 指定本地TLS证书的位置。<br />
   * 该选项值在用作配置选项连接数据库时，值保持这样的字符串格式即可：'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.crt'。<br />
   * 但是作为连接字符串时，tlsCertificateFile选项的值需要设置成：encodeURIComponent( 'G:\\WebStormWS\\web-project-template\\simulation_servers\\deno\\openssl\\MongoDBSSL001\\004客户端CA证书\\MongoDBSSL001_Clients_192_168_2_7_CA.crt' )。<br />
   * 作为连接字符串时，tlsCertificateFile选项的值总是需要被encodeURIComponent()调用后返回的。
   *
   * @type {string}
   */
  // tlsCertificateFile: decodeURI( decodeURI( import.meta.resolve( `${ opensslDir }/MongoDBSSL001/004客户端CA证书/MongoDBSSL001_Clients_192_168_2_7_CA.crt` ).slice( 8 ) ) ),
  /**
   * 当对Long进行反序列化时，将以BigInt的形式返回，true表示启用。
   *
   * @type {boolean}
   */
  // useBigInt64: true,
  /**
   * 一个MongoDB WriteConcern，它描述了从MongoDB请求写操作的确认水平。
   * 详细见：
   * https://mongodb.github.io/node-mongodb-native/6.5/classes/WriteConcern.html
   * https://mongodb.github.io/node-mongodb-native/6.5/interfaces/WriteConcernSettings.html
   * https://docs.mongodb.com/manual/reference/write-concern/
   *
   * @type {WriteConcern | WriteConcernSettings}
   */
  // writeConcern: null,
  /**
   * 废弃的！请使用writeConcern选项代替，写入关注的超时。
   *
   * @type {number}
   */
  // wtimeoutMS: 0,

  // 以上选项见：https://mongodb.github.io/node-mongodb-native/6.5/interfaces/MongoClientOptions.html   End

  // 之所以还要强制使用“as”，是因为如果不这样，会报类型错误！真奇葩！
} as T_ConnectOptions;

/**
 * 会返回一个对象，当new一个Schema时，它是传给Schema构造函数第2个参数的部分选项。<br />
 *
 * @param {string} collection Mongoose默认通过将模型名称传递给utils.toCollectionName方法来产生一个集合名称，并将名字复数化。<br />
 * 1、如果你需要为你的集合使用不同的名字，请设置这个选项。<br />
 * 2、但是，该选项设置的值会被Connection.prototype.model()的第3个参数覆盖。<br />
 *
 * @returns {T_SchemaOptions<DocType, TInstanceMethods, QueryHelpers, TStaticMethods, TVirtuals, THydratedDocumentType>} 会返回一个对象，当new一个Schema时，它是传给Schema构造函数第2个参数的部分选项。<br />
 */
function GetSchemaOptions<
  DocType = unknown,
  // deno-lint-ignore ban-types
  TInstanceMethods = {},
  // deno-lint-ignore ban-types
  QueryHelpers = {},
  // deno-lint-ignore ban-types
  TStaticMethods = {},
  // deno-lint-ignore ban-types
  TVirtuals = {},
  THydratedDocumentType = T_HydratedDocument<DocType, TInstanceMethods, QueryHelpers>
>( collection: string ): T_SchemaOptions<
  DocType,
  TInstanceMethods,
  QueryHelpers,
  TStaticMethods,
  TVirtuals,
  THydratedDocumentType
>{
  return {
    /**
     * 设置为 false 可禁用与此连接关联的所有模型的自动索引创建。<br />
     * 当你的应用程序启动时，Mongoose会自动为你模式中的每个定义的索引调用createIndex。<br />
     * Mongoose会依次为每个索引调用createIndex，并在所有createIndex调用成功或出现错误时，在模型上发出一个 "index "事件。<br />
     * 虽然在开发中很好，但建议在生产中禁用这种行为，因为索引创建会对性能造成很大影响。<br />
     * 通过将你的模式的autoIndex选项设置为false来禁用该行为，或者通过将autoIndex选项设置为false来在全局连接上禁用。<br />
     *
     * @type {boolean}
     */
    autoIndex: false,
    /**
     * 设置为true可使Mongoose在此连接上创建的每个模型上自动调用'createCollection()'。<br />
     * 你可以通过使用mongoose.set('autoCreate', false)将autoCreate设置为false来停用这一行为。<br />
     * 像autoIndex一样，autoCreate对开发和测试环境很有帮助，但你可能想在生产中禁用它以避免不必要的数据库调用。<br />
     *
     * @type {boolean}
     */
    autoCreate: true,
    /**
     * 默认情况下，当连接中断时，mongoose会缓冲命令，直到驱动程序设法重新连接。要禁用缓冲，请将bufferCommands设置为false。<br />
     * Schema的bufferCommands选项覆盖了全局的bufferCommands选项。<br />
     *
     * @type {boolean}
     */
    bufferCommands: true,
    /**
     * 如果bufferCommands是打开的，这个选项设置Mongoose缓冲在抛出错误之前的最大等待时间，单位是毫秒。<br />
     * 如果不指定，Mongoose将使用10000（10秒）。<br />
     *
     * @type {number}
     */
    // bufferTimeoutMS: 10000,
    /**
     * Mongoose支持MongoDB的封顶集合。<br />
     * 要指定底层的MongoDB集合是有上限的，将capped选项设置为集合的最大尺寸，单位为字节。<br />
     * 如果你想传递额外的选项，比如最大，也可以将封顶选项设置为一个对象。在这种情况下，你必须明确地传递大小选项，这是必须的。<br />
     *
     * @type {object|number}
     */
    /*
     capped: {
     size: 1024,
     max: 1000,
     autoIndexId: true,
     },
     */
    /**
     * Mongoose默认通过将模型名称传递给utils.toCollectionName方法来产生一个集合名称，并将名字复数化。<br />
     * 1、如果你需要为你的集合使用不同的名字，请设置这个选项。<br />
     * 2、但是，该选项设置的值会被Connection.prototype.model()的第3个参数覆盖。<br />
     *
     * @type {string}
     */
    collection,
    /**
     * 当你定义一个判别器时，Mongoose会在你的模式中添加一个路径，用来存储一个文档是哪个判别器的实例。<br />
     * 默认情况下，Mongoose添加了一个__t路径，但是你可以设置discriminatorKey来覆盖这个默认值。<br />
     *
     * @type {string}
     */
    // discriminatorKey: 'type',
    /**
     * Mongoose默认为你的每个模式分配了一个id虚拟获取器。<br />
     * 该获取器返回文档的_id字段，并将其转换为一个字符串，或者在ObjectIds的情况下，返回其hexString。<br />
     * 如果你不希望在你的模式中添加一个id获取器，你可以在构建模式时通过这个选项来禁用它。<br />
     *
     * @type {boolean}
     */
    // id: true,
    /**
     * 如果你没有在模式构造函数中传递一个字段，Mongoose会默认为你的每个模式分配一个_id字段。<br />
     * 分配的类型是一个ObjectId，以便与MongoDB的默认行为相吻合。<br />
     * 如果你根本不希望在你的模式中添加_id，你可以使用这个选项禁用它。<br />
     * PS：<br />
     * 你只能在subdocuments上使用这个选项。Mongoose不能在不知道其ID的情况下保存一个文档，所以如果你试图保存一个没有_ID的文档，你会得到一个错误。<br />
     *
     * @type {boolean}
     */
    // _id: true,
    /**
     * Mongoose默认会通过删除空对象来“最小化”模式。<br />
     * 这个行为可以通过设置最小化选项为false来重写。然后，它将存储空对象。<br />
     * 要检查一个对象是否为空，你可以使用$isEmpty()帮助器：<br />
     * const sam = new Character({ name: 'Sam', inventory: {} });
     * sam.$isEmpty('inventory'); // true
     *
     * sam.inventory.barrowBlade = 1;
     * sam.$isEmpty('inventory'); // false
     *
     * @type {boolean}
     */
    minimize: false,
    /**
     * https://mongoosejs.com/docs/guide.html#read
     *
     * @type {string}
     */
    // read: '',
    /**
     * https://mongoosejs.com/docs/guide.html#writeConcern
     *
     * @type {object}
     */
    /*
     writeConcern: {
     w: 'majority',
     j: true,
     wtimeout: 1000,
     },
     */
    /**
     * https://mongoosejs.com/docs/guide.html#shardKey
     *
     * @type {object}
     */
    /*
     shardKey: {
     tag: 1,
     name: 1,
     },
     */
    /**
     * 严格选项（默认启用）确保传递给我们的模型构造函数的值不会被保存到数据库中，这些值在我们的模式中没有指定。<br />
     * 例子001：<br />
     * const thingSchema = new Schema({ ... })
     * const Thing = mongoose.model('Thing', thingSchema);
     * const thing = new Thing({ iAmNotInTheSchema: true });
     * thing.save(); // iAmNotInTheSchema没有被保存到数据库中。
     *
     * // set to false..
     * const thingSchema = new Schema({ ... }, { strict: false });
     * const thing = new Thing({ iAmNotInTheSchema: true });
     * thing.save(); // iAmNotInTheSchema现在被保存到数据库中了！！！
     *
     * 这也会影响到使用doc.set()来设置一个属性值。<br />
     * 例子001：<br />
     * const thingSchema = new Schema({ ... });
     * const Thing = mongoose.model('Thing', thingSchema);
     * const thing = new Thing;
     * thing.set('iAmNotInTheSchema', true);
     * thing.save(); // iAmNotInTheSchema没有被保存到数据库中。
     *
     * 这个值可以通过传递第2个布尔参数在模型实例层面上被重写：<br />
     * const Thing = mongoose.model('Thing');
     * const thing = new Thing(doc, true);  // enables strict mode
     * const thing = new Thing(doc, false); // disables strict mode
     *
     * strict选项也可以设置为“throw”，这将导致产生错误而不是丢弃坏数据。<br />
     *
     * 注意：在实例上设置的任何键/值，如果在你的模式中不存在，则总是被忽略，不管模式选项如何：<br />
     * const thingSchema = new Schema({ ... });
     * const Thing = mongoose.model('Thing', thingSchema);
     * const thing = new Thing;
     * thing.iAmNotInTheSchema = true;
     * thing.save(); // iAmNotInTheSchema从未被保存到数据库中。
     *
     * @type {boolean|string}
     */
    strict: 'throw',
    /**
     * Mongoose支持一个单独的strictQuery选项来避免查询过滤器的严格模式。<br />
     * 这是因为空的查询过滤器会导致Mongoose返回模型中的所有文档，这可能导致问题。<br />
     * 详细见：<br />
     * https://mongoosejs.com/docs/guide.html#strictQuery
     *
     * @type {boolean}
     */
    strictQuery: true,
    /**
     * https://mongoosejs.com/docs/guide.html#toJSON
     * 更多选项见：<br />
     * https://mongoosejs.com/docs/api/document.html#Document.prototype.toJSON()
     *
     * @type {object}
     */
    // toJSON: { getters: true, virtuals: true, },
    /**
     * https://mongoosejs.com/docs/guide.html#toObject
     * 更多选项见：<br />
     * https://mongoosejs.com/docs/api/document.html#Document.prototype.toObject()
     *
     * @type {object}
     */
    // toObject: { getters: true, virtuals: true, },
    /**
     * https://mongoosejs.com/docs/guide.html#typeKey
     *
     * @type {string}
     */
    // typeKey: 'type',
    /**
     * 默认情况下，documents在被保存到数据库之前会被自动验证。<br />
     * 这是为了防止保存一个无效的documents。<br />
     * 如果你想手动处理验证，并且能够保存没有通过验证的对象，你可以把validateBeforeSave设置为false。<br />
     *
     * @type {boolean}
     */
    validateBeforeSave: true,
    /**
     * https://mongoosejs.com/docs/guide.html#versionKey
     *
     * @type {string}
     */
    // versionKey: '__v',
    /**
     * https://mongoosejs.com/docs/guide.html#optimisticConcurrency
     *
     * @type {boolean}
     */
    optimisticConcurrency: true,
    /**
     * https://mongoosejs.com/docs/guide.html#collation
     *
     * @type {object}
     */
    /*
     collation: {
     locale: 'en_US',
     // 表示忽略大小写。
     strength: 1,
     },
     */
    /**
     * https://mongoosejs.com/docs/guide.html#timeseries
     *
     * @type {object}
     */
    /*
     timeseries: {
     timeField: 'timestamp',
     metaField: 'metadata',
     granularity: 'hours',
     },
     */
    /**
     * https://mongoosejs.com/docs/guide.html#skipVersioning
     *
     * @type {object}
     */
    // skipVersioning: {},
    /**
     * https://mongoosejs.com/docs/guide.html#timestamps
     *
     * @type {object}
     */
    // timestamps: {},
    /**
     * https://mongoosejs.com/docs/guide.html#pluginTags
     *
     * @type {array}
     */
    // pluginTags: [],
    /**
     * https://mongoosejs.com/docs/guide.html#selectPopulatedPaths
     *
     * @type {boolean}
     */
    // selectPopulatedPaths: true,
    /**
     * https://mongoosejs.com/docs/guide.html#storeSubdocValidationError
     *
     * @type {boolean}
     */
    storeSubdocValidationError: true,
  };
}

export {
  dbName,
  uri,
  mongooseConfig,
  GetSchemaOptions,
};

export default {
  dbName,
  uri,
  mongooseConfig,
  GetSchemaOptions,
};
