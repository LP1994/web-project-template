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
 * @type {boolean} 在Vue 3中启用/禁用Vue 2的Options API支持，默认值true，表示在Vue 3中启用对Vue 2的Options API支持。<br />
 * 1、当使用Vue 3时（建议使用“组合API”的写法，如果想使用“选项API”写法，还不如切换到Vue 2，毕竟“组合API”的写法更配Vue 3），建议将其设置为false，这样可以让Vue 3正确的使用“tree-shaking”，以使打包后的代码最小化。<br />
 */
declare const __VUE_OPTIONS_API__: boolean;

/**
 * @type {boolean} 在生产中启用/禁用devtools支持，默认值false。
 */
declare const __VUE_PROD_DEVTOOLS__: boolean;

/**
 * @type {string} 代理http、https请求的写法例子，假定目标请求地址为：https://127.0.0.1:9200/graphql<br />
 * 注意：<br />
 * 在业务代码中使用时，记得在它后面加"/"，这里在定义时特意没加，以便在业务代码中使用时能有良好的编码语义理解。<br />
 * 使用例子：<br />
 * axios.get( '${ https4deno }/graphql' )
 */
declare const https4deno: string;

/**
 * @type {string} 代理websocket请求的写法例子，假定目标请求地址为：wss://127.0.0.1:9200/graphql<br />
 * 注意：<br />
 * 在业务代码中使用时，记得在它后面加"/"，这里在定义时特意没加，以便在业务代码中使用时能有良好的编码语义理解。<br />
 * 使用例子：<br />
 * new WebSocket( '${ wss4deno }/graphql' )
 */
declare const wss4deno: string;
