/**
 * Project: web-project-template
 * FileDirPath: src/custom_declare_types/define.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 配合new webpack.DefinePlugin插件里定义的全局常量所自定义的关于这些全局常量的类型描述。
 */

/**
 * @type {string} 值可为这4个中的任意一个：'dev_server'、'local_server'、'test'、'production'。
 */
declare const env_platform: string;

/**
 * @type {boolean} 值为true时表示生产环境，反之开发环境。
 */
declare const isProduction: boolean;

/**
 * @type {string} 代理http、https请求的写法例子，假定目标请求地址为：http://192.168.1.3:9000/graphql<br />
 * 注意：<br />
 * 在业务代码中使用时，记得在它后面加"/"，这里在定义时特意没加，以便在业务代码中使用时能有良好的编码语义理解。<br />
 * 使用例子：<br />
 * axios.get( '${ devURLDemo001 }/graphql' )
 */
declare const devURL001: string;

/**
 * @type {string} 代理websocket请求的写法例子，假定目标请求地址为：ws://192.168.1.3:9000/subscriptions<br />
 * 注意：<br />
 * 在业务代码中使用时，记得在它后面加"/"，这里在定义时特意没加，以便在业务代码中使用时能有良好的编码语义理解。<br />
 * 使用例子：<br />
 * new WebSocket( '${ ws4DevURLDemo001 }/subscriptions' )
 */
declare const ws4DevURL001: string;
