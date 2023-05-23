/**
 * Project: web-project-template
 * FileDirPath: postcss.postcss-modules.config.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-17 09:31:26 星期六
 */

/**
 * 该postcss的配置包含CSS Modules的处理。
 */

'use strict';

import {
  writeFile,
} from 'node:fs/promises';

import {
  basename,
  resolve,
} from 'node:path';

import {
  URL,
} from 'node:url';

import {
  __dirname,
  env_platform,
} from './webpack.base.esm.mjs';

import postcssConfig from './postcss.config.mjs';

// postcss-modules
postcssConfig.plugins.unshift( [
  'postcss-modules',
  {
    /**
     * 默认情况下，一个带有导出类的JSON文件将被放在相应的CSS旁边。但你可以自由地使用导出的类来做你想做的一切，只要使用getJSON回调。getJSON也可以返回一个Promise。<br />
     *
     * @param {string} cssFileName 如：G:/WebStormWS/xxx/Upload.Vue3.ts.vue?used&vue&type=style&index=1&lang.module.scss
     *
     * @param {Record<string, string>} json 如：{"red001":"Upload-Vue3-ts-vue-used-vue-type-style-index-1-lang-module_red001_4b19293a"}
     *
     * @param {string} outputFileName 如：G:/WebStormWS/xxx/Upload.Vue3.ts.vue?used&vue&type=style&index=1&lang.module.scss
     *
     * @returns {void | Promise<any>}
     */
    getJSON: async ( cssFileName, json, outputFileName ) => {
      await writeFile( resolve( __dirname, `./dist/${ env_platform }/styles/${ basename( cssFileName )
      .replace( new URL( cssFileName ).search, '' ) }.css.modules.json` ), JSON.stringify( json ), {
        flag: 'w+',
      } );
    },
    /**
     * @type {'global' | 'local'} 默认情况下，该插件假定所有的类都是'local'。值有：'global'、'local'。
     */
    scopeBehaviour: 'local',
    /**
     * @type {string | ((name: string, filename: string, css: string) => string)}
     * 例子：<br />
     * 会生成这样的类名：Upload-Vue3-ts-vue-used-vue-type-style-index-1-lang-module_red001_4b19293a。<br />
     *
     * 详细见：<br />
     * https://github.com/webpack/loader-utils#interpolatename
     */
    generateScopedName: '[name]_[local]_[sha512:contenthash:hex:8]',
    /**
     * @type {'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly' | ((originalClassName: string, generatedClassName: string, inputFile: string) => string)} 输出类名的样式。<br />
     * camelCase：class名称将被驼峰化（如：.apply-color -> applyColor），原来的class名称将不会被从local中删除。<br />
     * camelCaseOnly：class名称将被驼峰化（如：.apply-color -> applyColor），原来的class名称将会被从local中删除。<br />
     * dashes：只有class名中的破折号（“-”）会被驼峰化（如：.apply-color -> applyColor）。<br />
     * dashesOnly：class名中的破折号（“-”）将被驼峰化（如：.apply-color -> applyColor），原来的class名将被从local删除。<br />
     */
    localsConvention: 'camelCaseOnly',
  },
] );

export default postcssConfig;
