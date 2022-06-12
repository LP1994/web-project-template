/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: webpack.local.esm.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 该配置是给“local”（本地）环境用的webpack配置。
 */

'use strict';

import {
  dirname,
  resolve,
} from 'node:path';

import webpack from 'webpack';

import {
  __dirname,

  aliasConfig,
  entryConfig,
  providePluginConfig,
  targetConfig,
} from './webpack.base.esm.mjs';

export default {
  context: resolve( __dirname, './' ),
  entry: entryConfig,
  mode: 'development',
  plugins: [
    new webpack.ProvidePlugin( providePluginConfig ),
  ],
  resolve: {
    alias: aliasConfig,
    /**
     * 如果为true，则将不允许无扩展名的文件。设置成false就行。<br />
     */
    enforceExtension: false,
    modules: [
      'node_modules',
    ],
    symlinks: false,
  },
  target: targetConfig,
};
