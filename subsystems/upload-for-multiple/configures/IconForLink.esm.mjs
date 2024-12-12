/**
 * Project: upload-for-multiple
 * FileDirPath: configures/IconForLink.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 一般用于为“HTMLWebpackPluginConfig.esm.mjs”中“html-webpack-plugin”插件配置HTML模板中的head标签里的图片类link标签。
 */

'use strict';

/**
 * URL开头的共同部分。<br />
 * 例子1：<br />
 * https://192.168.2.10:8100/dev_server
 * 例子2：<br />
 * ..
 *
 * 注意：<br />
 * HTML的标签<meta>的值可以是相对路径，也可以是绝对路径。<br />
 * <meta http-equiv="refresh" content="5;url=another.html">
 * <meta http-equiv="refresh" content="5;url=https://www.runoob.com/html/html-meta.html">
 *
 * @type {string}
 */
const URLHead = '..';

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
    sizes: '167x167',
    href: URLHead + '/static/ico/uncompressed/ico_167_167.png',
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
