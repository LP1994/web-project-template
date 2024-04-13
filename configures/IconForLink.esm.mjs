/**
 * Project: web-project-template
 * FileDirPath: configures/IconForLink.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 一般用于为“HTMLWebpackPluginConfig.esm.mjs”中“html-webpack-plugin”插件配置HTML模板中的head标签里的图片类link标签。
 */

'use strict';

/**
 * 为这个标签配置的：<br />
 * ```html
 * <link rel = 'shortcut icon' />
 * ```
 * 参数说明：<br />
 * type：图片类型，值如：“image/png”。<br />
 * sizes：图片尺寸，值如：“32x32”（中间的“x”为小写英文单词“x”）。<br />
 * href：图片链接，值可以是外部第三方链接，如：https://www.xxx.com/001.png，也可以是相对地址，如：“../static/ico/uncompressed/ico_32_32.png”。<br />
 *
 * @type {[{sizes: string, href: string, type: string}]}
 */
const ShortcutIcons = [
  {
    type: 'image/png',
    sizes: '32x32',
    href: '../static/ico/uncompressed/ico_32_32.png',
  },
  {
    type: 'image/png',
    sizes: '48x48',
    href: '../static/ico/uncompressed/ico_48_48.png',
  },
  {
    type: 'image/png',
    sizes: '57x57',
    href: '../static/ico/uncompressed/ico_57_57.png',
  },
  {
    type: 'image/png',
    sizes: '72x72',
    href: '../static/ico/uncompressed/ico_72_72.png',
  },
  {
    type: 'image/png',
    sizes: '96x96',
    href: '../static/ico/uncompressed/ico_96_96.png',
  },
  {
    type: 'image/png',
    sizes: '114x114',
    href: '../static/ico/uncompressed/ico_114_114.png',
  },
  {
    type: 'image/png',
    sizes: '120x120',
    href: '../static/ico/uncompressed/ico_120_120.png',
  },
  {
    type: 'image/png',
    sizes: '128x128',
    href: '../static/ico/uncompressed/ico_128_128.png',
  },
  {
    type: 'image/png',
    sizes: '144x144',
    href: '../static/ico/uncompressed/ico_144_144.png',
  },
  {
    type: 'image/png',
    sizes: '150x150',
    href: '../static/ico/uncompressed/ico_150_150.png',
  },
  {
    type: 'image/png',
    sizes: '152x152',
    href: '../static/ico/uncompressed/ico_152_152.png',
  },
  {
    type: 'image/png',
    sizes: '167x167',
    href: '../static/ico/uncompressed/ico_167_167.png',
  },
  {
    type: 'image/png',
    sizes: '180x180',
    href: '../static/ico/uncompressed/ico_180_180.png',
  },
  {
    type: 'image/png',
    sizes: '192x192',
    href: '../static/ico/uncompressed/ico_192_192.png',
  },
  {
    type: 'image/png',
    sizes: '384x384',
    href: '../static/ico/uncompressed/ico_384_384.png',
  },
  {
    type: 'image/png',
    sizes: '512x512',
    href: '../static/ico/uncompressed/ico_512_512.png',
  },
];

/**
 * 为这个标签配置的：<br />
 * ```html
 * <link rel = 'icon' />
 * ```
 * 参数说明：<br />
 * type：图片类型，值如：“image/png”。<br />
 * sizes：图片尺寸，值如：“32x32”（中间的“x”为小写英文单词“x”）。<br />
 * href：图片链接，值可以是外部第三方链接，如：https://www.xxx.com/001.png，也可以是相对地址，如：“../static/ico/uncompressed/ico_32_32.png”。<br />
 *
 * @type {[{sizes: string, href: string, type: string}]}
 */
const Icons = ShortcutIcons;

/**
 * 为这个标签配置的：<br />
 * ```html
 * <link rel = 'apple-touch-icon' />
 * ```
 * 参数说明：<br />
 * type：图片类型，值如：“image/png”。<br />
 * sizes：图片尺寸，值如：“32x32”（中间的“x”为小写英文单词“x”）。<br />
 * href：图片链接，值可以是外部第三方链接，如：https://www.xxx.com/001.png，也可以是相对地址，如：“../static/ico/uncompressed/ico_32_32.png”。<br />
 *
 * @type {[{sizes: string, href: string, type: string}]}
 */
const AppleTouchIcon = ShortcutIcons;

/**
 * 为这个标签配置的：<br />
 * ```html
 * <link rel = 'apple-touch-icon-precomposed' />
 * ```
 * 参数说明：<br />
 * type：图片类型，值如：“image/png”。<br />
 * sizes：图片尺寸，值如：“32x32”（中间的“x”为小写英文单词“x”）。<br />
 * href：图片链接，值可以是外部第三方链接，如：https://www.xxx.com/001.png，也可以是相对地址，如：“../static/ico/uncompressed/ico_32_32.png”。<br />
 *
 * @type {[{sizes: string, href: string, type: string}]}
 */
const AppleTouchIconPrecomposed = ShortcutIcons;

export {
  ShortcutIcons,
  Icons,
  AppleTouchIcon,
  AppleTouchIconPrecomposed,
};

export default {
  ShortcutIcons,
  Icons,
  AppleTouchIcon,
  AppleTouchIconPrecomposed,
};
