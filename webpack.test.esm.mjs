/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: webpack.test.esm.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 该配置是给“test”环境用的webpack配置。
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
  experimentsConfig,
  providePluginConfig,
  recordsPathConfig,
  targetConfig,
} from './webpack.base.esm.mjs';

export default {
  /**
   * 在第一个错误上失败而不是容忍它。默认情况下，webpack会在终端以及使用HMR时的浏览器控制台中以红色记录这些错误，但会继续捆绑。<br />
   * 1、这将强制webpack退出其捆绑过程。<br />
   * 2、避免在watch模式下使用bail选项，因为它会在发现错误时强制webpack尽快退出。<br />
   */
  bail: true,
  context: resolve( __dirname, './' ),
  entry: entryConfig,
  experiments: experimentsConfig,
  /**
   * 基础设施级别日志记录的选项。<br />
   */
  infrastructureLogging: {
    /**
     * 保持先前的输出依旧存在而不是更新现有输出，这对状态消息很有用。此选项仅在未提供自定义控制台时使用。<br />
     */
    appendOnly: true,
    /**
     * 为基础设施级别的日志记录启用彩色输出。此选项仅在未提供自定义控制台时使用。<br />
     */
    colors: true,
    /**
     * 启用基础设施日志记录输出。类似于stats.logging选项，但用于基础设施。默认为“info”。<br />
     * 1、有效值：<br />
     * none：禁用日志记录。<br />
     * error：仅错误。<br />
     * warn：仅错误和警告。<br />
     * info：错误、警告和信息消息。<br />
     * log：错误、警告、信息消息、日志消息、组、清除。折叠组以折叠状态显示。<br />
     * verbose：记录除调试和跟踪之外的所有内容。折叠组以展开状态显示。<br />
     */
    level: 'info',
  },
  mode: 'production',
  /**
   * 配置的名称。加载多个配置时使用。<br />
   */
  name: 'webpack.test.esm.mjs',
  /**
   * 限制并行处理模块的数量。可用于微调性能或获得更可靠的分析结果。<br />
   * 1、最小值是：1。<br />
   */
  parallelism: 100,
  plugins: [
    new webpack.ProvidePlugin( providePluginConfig ),
  ],
  /**
   * 捕获应用程序的“配置文件”（捕获每个模块的计时信息），包括统计信息和提示，然后可以使用分析工具对其进行剖析。它还将注销模块计时的摘要。<br />
   * 1、结合profile: true和parallelism: 1以获得正确的时序。请注意，这也会减慢构建速度。<br />
   */
  profile: true,
  recordsPath: recordsPathConfig( 'test' ),
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
