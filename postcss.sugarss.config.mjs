/**
 * Project: web-project-template
 * FileDirPath: postcss.sugarss.config.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-17 09:31:26 星期六
 */

/**
 * 1、该postcss的配置专用于SugarSS语法，SugarSS是一种基于空格的PostCSS语法，SugarSS的MIME类型为text/x-sugarss，文件扩展名为.sss。
 * 2、该postcss的配置不包含CSS Modules的处理。
 */

'use strict';

import PostcssConfig from './postcss.config.mjs';

export default {
  parser: 'sugarss',
  // stringifier: 'sugarss',
  // syntax: 'sugarss',
  // 配置插件的时候注意顺序哦！不同插件之间有先后处理的规则！postcss的插件有200多之数（有些还废弃、迁移包名之类的），还会随着积累越来越多的，挑着对项目有用的插件配置，不要过度求全，不然指不定会出现不如所愿的情况出现。
  plugins: PostcssConfig.plugins,
};
