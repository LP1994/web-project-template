/**
 * Project: web-project-template
 * FileDirPath: configures/virtual_url_plugin_config/VirtualUrlPluginConfig.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2025-11-15 00:00:00 星期六
 */

/**
 * VirtualUrlPlugin插件(webpack v5.100.0+开始启用)的使用见：
 * https://webpack.js.org/plugins/virtual-url-plugin/
 * https://github.com/webpack/webpack/blob/main/examples/virtual-modules/README.md
 */

/**
 * PS：
 * 1、配置完“虚拟模块”后，记得要在“虚拟模块”所属的“type属性值”对应的loader规则中加入如下配置：
 * // 匹配所有 v: 开头的虚拟模块，用于配合VirtualUrlPlugin插件的使用。
 * include: [ /^v:/, ]
 * 否则，会出现错误提示，说什么没有找到对应的loader规则处理该虚拟模块。
 */

'use strict';

/**
 * VirtualUrlPlugin插件(webpack v5.100.0+开始启用)的使用见：<br />
 * https://webpack.js.org/plugins/virtual-url-plugin/<br />
 * https://github.com/webpack/webpack/blob/main/examples/virtual-modules/README.md<br />
 *
 * PS：<br />
 * 1、配置完“虚拟模块”后，记得要在“虚拟模块”所属的“type属性值”对应的loader规则中加入如下配置：<br />
 * // 匹配所有 v: 开头的虚拟模块，用于配合VirtualUrlPlugin插件的使用。<br />
 * include: [ /^v:/, ]
 * <br />否则，会出现错误提示，说什么没有找到对应的loader规则处理该虚拟模块。<br />
 *
 * @returns {Array<Record<string, { type: string; source: string | ( ( loaderContext: import( 'webpack' ).LoaderContext< T > ) => Promise<string | Buffer> | string | Buffer ); version: () => string | true | string; }>, string>}
 */
function VirtualUrlPluginConfig( {} ){
  return [
    {
      // demo例子！！！可以保留当作参考！
      'v-module-demo001': {
        /**
         * 虚拟模块的内容类型。<br />
         * 1、该选项的值可以是：'.ts'、'.json'、'.css'等等，默认值是：'.js'。也可以是任何有对应loader处理的类型。<br />
         *
         * @type {string}
         */
        type: '.mjs',
        /**
         * 用于生成虚拟模块内容的工厂函数。<br />
         * 1、该选项的值类型有：string、( loaderContext: import( 'webpack' ).LoaderContext< T > ) => Promise<string | Buffer> | string | Buffer
         *
         * @param {import( 'webpack' ).LoaderContext< T >} loaderContext
         *
         * @returns {Promise<string | Buffer> | string | Buffer}
         */
        source( loaderContext ){
          return `
'use strict';

const time = Date.now();

export {
  time,
};

export default {
  time,
};
`;
        },
        /**
         * 当无效化被触发时，如果版本值与之前不同，则会再次调用源函数。一般来说，保持是true即可！<br />
         * 1、若设置为true，则始终触发源函数。<br />
         * 2、该选项的值类型有：() => string | boolean(只有true这一个有效) | string
         *
         * @type {boolean}
         */
        version: true,
        context: 'auto',
      },
      // 不支持“.ts”、“.cts”、“.mts”的处理！是webpack的BUG！
      'v-module-demo002': {
        type: '.mts',
        source( loaderContext ){
          return `
'use strict';

export type T_Inform = string | number;

export const num001: number = 2026001;
`;
        },
        version: true,
        context: 'auto',
      },
    },
    /**
     * 可定制虚拟模块的前缀协议，默认是：'virtual'。<br />
     *
     * @type {string}
     */
    'v'
  ];
}

export {
  VirtualUrlPluginConfig,
};

export default VirtualUrlPluginConfig;
