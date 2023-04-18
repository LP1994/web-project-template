/**
 * Project: web-project-template
 * FileDirPath: configures/DefinePluginConfig.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * new webpack.DefinePlugin插件的配置。
 */

'use strict';

/**
 * new webpack.DefinePlugin插件的配置。DefinePlugin在编译时用其他值或表达式替换代码中的变量。这对于允许开发构建和生产构建之间的不同行为很有用。<br />
 * 1、传递给DefinePlugin的每个键都是一个标识符或多个用.连接的标识符：'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)。<br />
 * 2、如果该值是一个字符串，它将被用作代码片段：TWO: '1+1'。<br />
 * 3、如果值不是字符串，它将被字符串化（包括函数）。<br />
 * 4、如果你在key前加上typeof前缀，它只为typeof调用定义：'typeof window': JSON.stringify('object111')。<br />
 * 5、如果需要定义一个值是字符串值，得单引号内部嵌套双引号，如：'"例子"'（或者JSON.stringify('例子')），否则没法真正输出这个字符串。<br />
 * 6、如果值不是字符串，它将被字符串化，相当于使用JSON.stringify处理，但是如果是函数，直接这么设置就行，别用JSON.stringify：'fun1': () => {}。<br />
 *
 * @param {object} config 对象参数。
 *
 * @param {string|undefined} config.env_platform env_platform的值是字符串，有4个值：'dev_server'、'local_server'、'test'、'production'，来源是CLI参数中的“--env”参数值，注意“--env”参数是允许多个的哦，必需。<br />
 * 注意：<br />
 * 1、但是必须有这么一个“--env”参数设置，这4个之中的其中一个即可：--env platform=dev_server、--env platform=local_server、--env platform=test、--env platform=production。<br />
 *
 * @param {boolean} config.isProduction 值为true时表示生产环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值，必需。<br />
 *
 * @returns {object} 返回一个对象，里面是new webpack.DefinePlugin插件的配置项。
 */
function DefinePluginConfig( {
  env_platform,
  isProduction,
} ){
  const wsHost001 = `( location.protocol === "http:" ? "ws:" : "wss:" ) + "//" + location.hostname + ":" + location.port + `;

  return {
    env_platform: JSON.stringify( env_platform ),
    isProduction: JSON.stringify( isProduction ),

    /**
     * 代理http、https请求的写法例子，假定目标请求地址为：http://192.168.1.3:9000/graphql
     * 注意：
     * 在业务代码中使用时，记得在它后面加"/"，这里在定义时特意没加，以便在业务代码中使用时能有良好的编码语义理解。
     * 使用例子：
     * axios.get( '${ devURLDemo001 }/graphql' )
     */
    devURL001: isProduction
               ? '""'
               : '"/devURL001"',

    /**
     * 代理websocket请求的写法例子，假定目标请求地址为：ws://192.168.1.3:9000/subscriptions
     * 注意：
     * 在业务代码中使用时，记得在它后面加"/"，这里在定义时特意没加，以便在业务代码中使用时能有良好的编码语义理解。
     * 使用例子：
     * new WebSocket( '${ ws4DevURLDemo001 }/subscriptions' )
     */
    ws4DevURL001: isProduction
                  ? `${ wsHost001 }""`
                  : `${ wsHost001 }"/ws4DevURL001"`,
  };
}

export {
  DefinePluginConfig,
};

export default DefinePluginConfig;
