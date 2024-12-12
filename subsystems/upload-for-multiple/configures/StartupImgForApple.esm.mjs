/**
 * Project: upload-for-multiple
 * FileDirPath: configures/StartupImgForApple.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 苹果移动设备上，将网址添加到主屏幕后，从主屏幕启动该网址时，在获取到成功的响应前，用于临时展示的过渡图片。
 * 只要先前成功启动过，这类图片就会被缓存起来，以后，就算断网了，这个展示用的图片也能正常地作为过渡临时图片继续展示。
 * 最后更新时间：2024年03月07日。
 */

'use strict';

/**
 * orientation：视口的方向。
 * PS：
 * 1、此功能与设备方向不对应。在许多设备上以纵向打开软键盘将导致视区（此时视区 = 设备原本的可视区域 - 软键盘占用的面积）的宽度变得比高度大，从而导致浏览器使用横向样式而不是纵向样式。
 * 2、值有：
 * portrait：视口为纵向方向，即高度大于或等于宽度。
 * landscape：视口处于横向方向，即宽度大于高度。
 * 3、笔记本电脑上的谷歌浏览器的模拟器由于设备没有方向传感器，“orientation”这个属性，更多的是通过宽高比来模拟所谓的方向。
 */

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
 * 苹果启动图片（一般是用于iPhone、iPad）的资源数组，成员是一个对象，必须。<br />
 * 成员格式：<br />
 * {<br />
 * href：字符串，图片链接地址，可以是编译完后输出到输出目录中的图片路径，一般是相对于“pages”文件夹的相对路径，也可以是第三方图片链接地址，必须。<br />
 * type：字符串，图片类型，值如：'image/png'，可以去这里查找对应值：http://www.w3school.com.cn/media/media_mimeref.asp，必须。<br />
 * crossorigin：字符串，值如：'anonymous'，必须。<br />
 * sizes：字符串，图片大小，值如：'640x1136'，必须。<br />
 * media：字符串，媒体查询，用于让设备只加载符合自己屏幕尺寸的图片，一般包括竖屏、横屏两张图片，必须。<br />
 * }<br />
 *
 * @type {[{href: string, type: string, crossorigin: string, sizes: string, media: string}]}
 */
const StartupImgForApple = [
  // iPhone Start

  // 640 x 1136(dpr: 2): iPhone 5、iPhone 5C（最后一款支持32位操作系统）、iPhone 5S（第1个配备64位处理器的）、iPhone SE(第一代)
  {
    href: URLHead + '/static/img/apple_startup/iPhone_640_1136.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '640x1136',
    media:
      'only screen and (device-width: 320px) and (device-height: 568px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 320px) and (device-height: 568px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 320px) and (device-height: 568px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 1136 x 640(dpr: 2): iPhone 5、iPhone 5C（最后一款支持32位操作系统）、iPhone 5S（第1个配备64位处理器的）、iPhone SE(第一代)
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1136_640.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1136x640',
    media:
      'only screen and (device-width: 320px) and (device-height: 568px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 320px) and (device-height: 568px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 320px) and (device-height: 568px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 750 x 1334(dpr: 2): iPhone 6、iPhone 6S、iPhone 7、iPhone 8、iPhone SE(第二代)、iPhone SE(第三代)
  {
    href: URLHead + '/static/img/apple_startup/iPhone_750_1334.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '750x1334',
    media:
      'only screen and (device-width: 375px) and (device-height: 667px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 375px) and (device-height: 667px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 375px) and (device-height: 667px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 1334 x 750(dpr: 2): iPhone 6、iPhone 6S、iPhone 7、iPhone 8、iPhone SE(第二代)、iPhone SE(第三代)
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1334_750.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1334x750',
    media:
      'only screen and (device-width: 375px) and (device-height: 667px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 375px) and (device-height: 667px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 375px) and (device-height: 667px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 1242 x 2208(1080 x 1920、dpr: 3): iPhone 6 Plus、iPhone 6S Plus、iPhone 7 Plus、iPhone 8 Plus
  /*
   PS：特别说明一下，以上设备的实际物理分辨率是(1080 x 1920)，它们的实际dpr是2.608695652173913。
   但是，渲染、计算却是按分辨率(1242 x 2208)、dpr是3。所以，APP的启动图片也是按这些个来的(1242 x 2208、dpr是3)。
   */
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1242_2208.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1242x2208',
    media:
      'only screen and (device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2208 x 1242(1920 x 1080、dpr: 3): iPhone 6 Plus、iPhone 6S Plus、iPhone 7 Plus、iPhone 8 Plus
  /*
   PS：特别说明一下，以上设备的实际物理分辨率是(1080 x 1920)，它们的实际dpr是2.608695652173913。
   但是，渲染、计算却是按分辨率(1242 x 2208)、dpr是3。所以，APP的启动图片也是按这些个来的(1242 x 2208、dpr是3)。
   */
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2208_1242.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2208x1242',
    media:
      'only screen and (device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // 828 x 1792(dpr: 2): iPhone XR、iPhone 11
  {
    href: URLHead + '/static/img/apple_startup/iPhone_828_1792.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '828x1792',
    media:
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 1792 x 828(dpr: 2): iPhone XR、iPhone 11
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1792_828.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1792x828',
    media:
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 1125 x 2436(dpr: 3): iPhone X、iPhone XS、iPhone 11 Pro
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1125_2436.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1125x2436',
    media:
      'only screen and (device-width: 375px) and (device-height: 812px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 375px) and (device-height: 812px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 375px) and (device-height: 812px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2436 x 1125(dpr: 3): iPhone X、iPhone XS、iPhone 11 Pro
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2436_1125.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2436x1125',
    media:
      'only screen and (device-width: 375px) and (device-height: 812px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 375px) and (device-height: 812px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 375px) and (device-height: 812px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // 1242 x 2688(dpr: 3): iPhone XS Max、iPhone 11 Pro Max
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1242_2688.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1242x2688',
    media:
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2688 x 1242(dpr: 3): iPhone XS Max、iPhone 11 Pro Max
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2688_1242.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2688x1242',
    media:
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 414px) and (device-height: 896px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // 1080 x 2340(dpr: 3): iPhone 12 mini、iPhone 13 mini
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1080_2340.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1080x2340',
    media:
      'only screen and (device-width: 360px) and (device-height: 780px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 360px) and (device-height: 780px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 360px) and (device-height: 780px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2340 x 1080(dpr: 3): iPhone 12 mini、iPhone 13 mini
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2340_1080.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2340x1080',
    media:
      'only screen and (device-width: 360px) and (device-height: 780px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 360px) and (device-height: 780px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 360px) and (device-height: 780px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // 1170 x 2532(dpr: 3): iPhone 12、iPhone 12 Pro、iPhone 13、iPhone 13 Pro、iPhone 14
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1170_2532.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1170x2532',
    media:
      'only screen and (device-width: 390px) and (device-height: 844px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 390px) and (device-height: 844px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 390px) and (device-height: 844px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2532 x 1170(dpr: 3): iPhone 12、iPhone 12 Pro、iPhone 13、iPhone 13 Pro、iPhone 14
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2532_1170.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2532x1170',
    media:
      'only screen and (device-width: 390px) and (device-height: 844px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 390px) and (device-height: 844px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 390px) and (device-height: 844px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // 1284 x 2778(dpr: 3): iPhone 12 Pro Max、iPhone 13 Pro Max、iPhone 14 Plus
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1284_2778.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1284x2778',
    media:
      'only screen and (device-width: 428px) and (device-height: 926px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 428px) and (device-height: 926px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 428px) and (device-height: 926px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2778 x 1284(dpr: 3): iPhone 12 Pro Max、iPhone 13 Pro Max、iPhone 14 Plus
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2778_1284.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2778x1284',
    media:
      'only screen and (device-width: 428px) and (device-height: 926px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 428px) and (device-height: 926px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 428px) and (device-height: 926px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // 1179 x 2556(dpr: 3): iPhone 14 Pro、iPhone 15、iPhone 15 Pro
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1179_2556.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1179x2556',
    media:
      'only screen and (device-width: 393px) and (device-height: 852px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 393px) and (device-height: 852px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 393px) and (device-height: 852px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2556 x 1179(dpr: 3): iPhone 14 Pro、iPhone 15、iPhone 15 Pro
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2556_1179.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2556x1179',
    media:
      'only screen and (device-width: 393px) and (device-height: 852px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 393px) and (device-height: 852px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 393px) and (device-height: 852px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // 1290 x 2796(dpr: 3): iPhone 14 Pro Max、iPhone 15 Plus、iPhone 15 Pro Max
  {
    href: URLHead + '/static/img/apple_startup/iPhone_1290_2796.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1290x2796',
    media:
      'only screen and (device-width: 430px) and (device-height: 932px) and (orientation: portrait) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 430px) and (device-height: 932px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 430px) and (device-height: 932px) and (orientation: portrait) and (device-pixel-ratio: 3)',
  },
  // 2796 x 1290(dpr: 3): iPhone 14 Pro Max、iPhone 15 Plus、iPhone 15 Pro Max
  {
    href: URLHead + '/static/img/apple_startup/iPhone_2796_1290.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2796x1290',
    media:
      'only screen and (device-width: 430px) and (device-height: 932px) and (orientation: landscape) and (-moz-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 430px) and (device-height: 932px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3), ' +
      'only screen and (device-width: 430px) and (device-height: 932px) and (orientation: landscape) and (device-pixel-ratio: 3)',
  },

  // iPhone End

  // iPad Start

  // 1536 x 2048(dpr: 2): 7.9英寸iPad mini(第二代)、7.9英寸iPad mini(第三代)、7.9英寸iPad mini(第四代)、9.7英寸iPad(第五代)、9.7英寸iPad(第六代)、9.7英寸iPad Air(第一代)、9.7英寸iPad Air(第二代)、9.7英寸iPad Pro、7.9英寸iPad mini(第五代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_1536_2048.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1536x2048',
    media:
      'only screen and (device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 2048 x 1536(dpr: 2): 7.9英寸iPad mini(第二代)、7.9英寸iPad mini(第三代)、7.9英寸iPad mini(第四代)、9.7英寸iPad(第五代)、9.7英寸iPad(第六代)、9.7英寸iPad Air(第一代)、9.7英寸iPad Air(第二代)、9.7英寸iPad Pro、7.9英寸iPad mini(第五代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2048_1536.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2048x1536',
    media:
      'only screen and (device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 1488 x 2266(dpr: 2): iPad mini(第六代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_1488_2266.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1488x2266',
    media:
      'only screen and (device-width: 744px) and (device-height: 1133px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 744px) and (device-height: 1133px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 744px) and (device-height: 1133px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 2266 x 1488(dpr: 2): iPad mini(第六代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2266_1488.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2266x1488',
    media:
      'only screen and (device-width: 744px) and (device-height: 1133px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 744px) and (device-height: 1133px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 744px) and (device-height: 1133px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 2048 x 2732(dpr: 2): 12.9英寸iPad Pro(第一代)、12.9英寸iPad Pro(第二代)、12.9英寸iPad Pro(第三代)、12.9英寸iPad Pro(第四代)、12.9英寸iPad Pro(第五代)、12.9英寸iPad Pro(第六代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2048_2732.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2048x2732',
    media:
      'only screen and (device-width: 1024px) and (device-height: 1366px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 1024px) and (device-height: 1366px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 1024px) and (device-height: 1366px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 2732 x 2048(dpr: 2): 12.9英寸iPad Pro(第一代)、12.9英寸iPad Pro(第二代)、12.9英寸iPad Pro(第三代)、12.9英寸iPad Pro(第四代)、12.9英寸iPad Pro(第五代)、12.9英寸iPad Pro(第六代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2732_2048.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2732x2048',
    media:
      'only screen and (device-width: 1024px) and (device-height: 1366px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 1024px) and (device-height: 1366px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 1024px) and (device-height: 1366px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 1620 x 2160(dpr: 2): iPad(第七代)、iPad(第八代)、iPad(第九代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_1620_2160.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1620x2160',
    media:
      'only screen and (device-width: 810px) and (device-height: 1080px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 810px) and (device-height: 1080px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 810px) and (device-height: 1080px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 2160 x 1620(dpr: 2): iPad(第七代)、iPad(第八代)、iPad(第九代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2160_1620.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2160x1620',
    media:
      'only screen and (device-width: 810px) and (device-height: 1080px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 810px) and (device-height: 1080px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 810px) and (device-height: 1080px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 1640 x 2360(dpr: 2): iPad Air(第四代)、iPad Air(第五代)、iPad(第十代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_1640_2360.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1640x2360',
    media:
      'only screen and (device-width: 820px) and (device-height: 1180px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 820px) and (device-height: 1180px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 820px) and (device-height: 1180px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 2360 x 1640(dpr: 2): iPad Air(第四代)、iPad Air(第五代)、iPad(第十代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2360_1640.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2360x1640',
    media:
      'only screen and (device-width: 820px) and (device-height: 1180px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 820px) and (device-height: 1180px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 820px) and (device-height: 1180px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 1668 x 2224(dpr: 2): 10.5英寸iPad Pro、iPad Air(第三代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_1668_2224.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1668x2224',
    media:
      'only screen and (device-width: 834px) and (device-height: 1112px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1112px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1112px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 2224 x 1668(dpr: 2): 10.5英寸iPad Pro、iPad Air(第三代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2224_1668.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2224x1668',
    media:
      'only screen and (device-width: 834px) and (device-height: 1112px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1112px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1112px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // 1668 x 2388(dpr: 2): 11英寸iPad Pro(第一代)、11英寸iPad Pro(第二代)、11英寸iPad Pro(第三代)、11英寸iPad Pro(第四代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_1668_2388.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '1668x2388',
    media:
      'only screen and (device-width: 834px) and (device-height: 1194px) and (orientation: portrait) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1194px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1194px) and (orientation: portrait) and (device-pixel-ratio: 2)',
  },
  // 2388 x 1668(dpr: 2): 11英寸iPad Pro(第一代)、11英寸iPad Pro(第二代)、11英寸iPad Pro(第三代)、11英寸iPad Pro(第四代)
  {
    href: URLHead + '/static/img/apple_startup/iPad_2388_1668.png',
    type: 'image/png',
    crossorigin: 'anonymous',
    sizes: '2388x1668',
    media:
      'only screen and (device-width: 834px) and (device-height: 1194px) and (orientation: landscape) and (-moz-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1194px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2), ' +
      'only screen and (device-width: 834px) and (device-height: 1194px) and (orientation: landscape) and (device-pixel-ratio: 2)',
  },

  // iPad End
];

export {
  StartupImgForApple,
};

export default StartupImgForApple;
