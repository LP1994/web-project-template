/**
 * Project: upload-for-multiple
 * FileDirPath: src/custom_declare_types/provide.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 配合new webpack.ProvidePlugin插件里定义的全局常量所自定义的关于这些全局常量的类型描述。
 */

/**
 * Axios是一款基于承诺的 HTTP 客户端，适用于 node.js 和浏览器。它是同构的（= 它能以相同的代码库在浏览器和 nodejs 中运行）。在服务器端，它使用本地 node.js http 模块，而在客户端（浏览器），它使用 XMLHttpRequests。<br />
 * 详细见：https://axios-http.com/docs/intro
 */
declare const axios: typeof import('axios');

/**
 * 强大的所见即所得框架可提供完全自定义的编辑体验。<br />
 * 详细见：https://ckeditor.com/docs/ckeditor5/latest/installation/index.html
 */
declare const Ckeditor5ClassicEditor: typeof import('@ckeditor/ckeditor5-build-classic');

/**
 * D3（或D3.js）是一个免费的开源 JavaScript 库，用于可视化数据。其基于 Web 标准构建的低级方法为创作动态、数据驱动的图形提供了无与伦比的灵活性。十多年来，D3 推动了突破性且屡获殊荣的可视化，成为高级图表库的基础构建块，并在世界各地培育了一个充满活力的数据从业者社区。<br />
 * 详细见：https://d3js.org/getting-started
 */
declare const d3: typeof import('d3');

/**
 * Apache ECharts 是一个免费的、功能强大的图表和可视化库，可提供简单的方法为您的商业产品添加直观、交互式和高度可定制的图表。它由纯 JavaScript 编写，基于全新的轻量级画布库 zrender。<br />
 * 详细见：https://echarts.apache.org/handbook/en/get-started/
 */
declare const echarts: typeof import('echarts');

/**
 * 用于 Web 的 Vue.js 2.0 UI 工具包。<br />
 * 详细见：https://element.eleme.io/#/zh-CN/component/installation
 */
declare const ELEMENT: typeof import('element-ui');

/**
 * Vue.js 3 UI 库。<br />
 * 详细见：https://element-plus.org/zh-CN/guide/quickstart.html
 */
declare const ElementPlus: typeof import('element-plus');

/**
 * JavaScript HTML 渲染器：<br />
 * 该脚本允许您直接在用户浏览器上截取网页或其部分内容的“屏幕截图”。屏幕截图基于 DOM，因此可能无法 100% 准确地反映真实情况，因为它不会制作实际的屏幕截图，而是根据页面上的可用信息构建屏幕截图。<br />
 * 详细见：https://github.com/niklasvh/html2canvas <br />
 * Options选项见：https://html2canvas.hertzen.com/configuration <br />
 */
declare const html2canvas: typeof import('html2canvas');

/**
 * jQuery 是一个快速、小巧、功能丰富的 JavaScript 库。它通过一个易于使用的 API，使 HTML 文档的遍历和操作、事件处理、动画和 Ajax 等变得更加简单，并能在多种浏览器上运行。集多功能性和可扩展性于一身，jQuery 改变了数百万人编写 JavaScript 的方式。<br />
 * 详细见：https://api.jquery.com/
 */
declare const $: typeof import('jquery');

/**
 * jQuery 是一个快速、小巧、功能丰富的 JavaScript 库。它通过一个易于使用的 API，使 HTML 文档的遍历和操作、事件处理、动画和 Ajax 等变得更加简单，并能在多种浏览器上运行。集多功能性和可扩展性于一身，jQuery 改变了数百万人编写 JavaScript 的方式。<br />
 * 详细见：https://api.jquery.com/
 */
declare const jQuery: typeof import('jquery');

/**
 * 适用于 JavaScript 的简单 SHA-3 / Keccak / Shake 哈希函数支持 UTF-8 编码。<br />
 * 详细见：https://github.com/emn178/js-sha3
 */
declare const JSSHA3: typeof import('js-sha3');

/**
 * 用于 JavaScript 的简单 SHA-512、SHA-384、SHA-512/224、SHA-512/256 哈希函数支持 UTF-8 编码。<br />
 * 详细见：https://github.com/emn178/js-sha512
 */
declare const JSSHA512: typeof import('js-sha512');

/**
 * 用于 JavaScript 的简单 SHA-256 / SHA-224 哈希函数支持 UTF-8 编码。<br />
 * 详细见：https://github.com/emn178/js-sha256
 */
declare const JSSHA256: typeof import('js-sha256');

/**
 * 用于 JavaScript 的简单 SHA1 哈希函数支持 UTF-8 编码。<br />
 * 详细见：https://github.com/emn178/js-sha1
 */
declare const JSSHA1: typeof import('js-sha1');

/**
 * 适用于 JavaScript 的简单快速 MD5 哈希函数，支持 UTF-8 编码。<br />
 * 详细见：https://github.com/emn178/js-md5
 */
declare const JSMD5: typeof import('js-md5');

/**
 * 又一个 Base64 转码器。<br />
 * 详细见：https://github.com/dankogai/js-base64
 */
declare const JSBase64: typeof import('js-base64');

/**
 * localForage 通过使用异步存储（IndexedDB 或 WebSQL）和类似于 localStorage 的简单 API，改善了网络应用程序的离线体验。<br />
 * 详细见：https://localforage.github.io/localForage/#localforage
 */
declare const localforage: typeof import('localforage');

/**
 * 现代 JavaScript 工具库，提供模块化、高性能和额外功能。<br />
 * 详细见：https://lodash.com/docs/
 */
declare const lodash: typeof import('lodash');

/**
 * PixiJS 是一个渲染库，可让您创建丰富的交互式图形以及跨平台应用程序和游戏，而无需深入研究 WebGL API 或处理浏览器和设备兼容性。<br />
 * 详细见：https://pixijs.com/guides
 */
declare const PIXI: typeof import('pixi.js');

/**
 * Swiper - 是一款免费、最现代的移动触摸滑块，具有硬件加速转换功能和惊人的本地行为。它适用于移动网站、移动网络应用程序和移动原生/混合应用程序。Swiper 并不兼容所有平台，它是一款现代触摸滑块，只专注于现代应用程序/平台，以带来最佳体验和简洁性。<br />
 * 详细见：https://swiperjs.com/get-started
 */
declare const Swiper: typeof import('swiper');

/**
 * three是一个JavaScript 3D 库。目标是创建一个易于使用、轻量级、跨浏览器、通用的 3D 库。目前的版本只包含一个 WebGL 渲染器，但 WebGPU（试验性）、SVG 和 CSS3D 渲染器也可作为附加组件使用。<br />
 * 详细见：https://threejs.org/
 */
declare const THREE: typeof import('three');

/**
 * Underscore.js是JavaScript的实用工具带库，它为常见的功能性对象（each、map、reduce、filter......）提供支持，而无需扩展任何JavaScript核心对象。<br />
 * 详细见：https://underscorejs.org/
 */
declare const underscore: typeof import('underscore');

/**
 * Vue 3是一个渐进的、可逐步采用的 JavaScript 框架，用于在网络上构建用户界面。<br />
 * 详细见：https://vuejs.org/guide/introduction.html
 */
declare const Vue: typeof import('vue');

/**
 * Vue路由器，Vue.js 的官方路由器，富有表现力、可配置且方便的路由。<br />
 * 详细见：https://router.vuejs.org/guide/
 */
declare const VueRouter: typeof import('vue-router');

/**
 * Vuex 是 Vue.js 应用程序的状态管理模式和库。它是应用程序中所有组件的集中存储，其规则确保状态只能以可预测的方式发生变化。它还与 Vue 的官方 devtools 扩展集成，提供零配置时间旅行调试和状态快照导出/导入等高级功能。<br />
 * 详细见：https://vuex.vuejs.org/
 */
declare const Vuex: typeof import('vuex');

/**
 * Pinia是直观、类型安全、轻便灵活的 Vue Store，使用支持 DevTools 的合成 api。<br />
 * 1、Pinia现在是新的默认设置。Vue 的官方状态管理库已更改为Pinia。<br />
 * 2、Pinia具有与Vuex 5几乎完全相同或增强的 API，如Vuex 5 RFC中所述。您可以简单地将 Pinia 视为具有不同名称的 Vuex 5。<br />
 * 3、Pinia 也可以与 Vue 2.x 配合使用。Vuex 3 和 4 仍将得到维护。然而，它不太可能为其添加新功能。<br />
 * 4、Vuex 和 Pinia 可以安装在同一个项目中。如果您要将现有的 Vuex 应用程序迁移到 Pinia，它可能是一个合适的选择。<br />
 * 5、但是，如果您计划开始一个新项目，我们强烈建议您使用 Pinia。<br />
 * 详细见：https://pinia.vuejs.org/introduction.html
 */
declare const Pinia: typeof import('pinia');

/**
 * 该工具库是使用“JavaScript”编写的公共的、通用的、不特定于某个项目使用的脚本工具库。
 * 其支持在浏览器（需要转码成JavaScript）、Node、Deno等多种支持JavaScript的宿主环境中使用，并且不是特定于某个项目才能使用的，使用“ECMAScript modules(ECMAScript模块)”写法。
 *
 *
 *
 * 编写原则：
 * 1、能用模块化的API尽量用模块化的，少用或者不用全局的，目的是为了让“编码风格”尽量符合“模块化”的理念。
 *
 * 2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 3、注意函数尾调用、算法时间复杂度、算法空间复杂度等优化。
 *
 * 4、那些不被导出供外部调用使用的、属于内部7788的处理函数、类等等，要以“HandleBy”打头命名。
 *
 * 5、那些需要被导出供外部调用使用的函数、类等等，一定要记得也要同时部署在“默认导出”中。
 *
 * 6、编程范式使用“函数式编程”，结合“JavaScript”编写，这样更好得便于被Webpack等工具进行“Tree-shaking”，只打包那些被使用的。
 *
 * 7、那些用于限定、描述数据类型的类型声明也要记得导出，以便供外部使用，如：export type T_MyString001 = string。
 *
 *
 *
 * 关于“严格模式”的注意事项：
 * 1、'use strict'严格模式会在函数内部自动深度的传递严格模式的效果。
 * 如：
 * ```ts
 * function Fun1( x ){
 * 'use strict';
 *
 * function Fun2( y = 1 ){
 * console.log( y );
 *
 * console.log( this );
 * }
 *
 * Fun2();
 * }
 * ```
 * 说明：
 * Fun1里的'use strict'严格模式的效果会传递到Fun2内部！
 * 但是，Fun1里的'use strict'严格模式却不会作用于Fun2的默认函数参数，但是Fun2里的this还是会为undefined！
 * 所以，Fun1不可以设置默认函数参数，但是Fun2可以设置默认函数参数！
 *
 * 2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 3、webpack编译后的JS代码会去掉多余的'use strict'，只保留编译前每个文件的顶级'use strict'。
 *
 * 4、class内部的方法中存在的'use strict'，在webpack编译后会被删除。
 *
 * 5、严格模式下的this还是可以通过apply、bind、call来设置的，否则还是undefined。
 * 如：
 * ```ts
 * 'use strict';
 *
 * function Fun1(){
 * 'use strict';
 *
 * console.dir( this );
 * }
 *
 * Fun1.call( { a: 1, } ); // 输出：{ a: 1, }，而不是undefined。
 * ```
 *
 *
 *
 * 该工具经过了如下优化(以后的代码添加、修改都应该尽量遵循如下的优化标准)：
 * PS：
 * 只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 1、函数尾调用优化；
 * 2、算法时间复杂度优化；
 * 3、算法空间复杂度优化；
 */
declare const CurrencyTools: typeof import('../tools/js/currency_tools/CurrencyTools.esm.mjs');

/**
 * 该工具库是使用“TypeScript”编写的公共的、通用的、不特定于某个项目使用的脚本工具库。
 * 其支持在浏览器（需要转码成JavaScript）、Node、Deno等多种支持TypeScript的宿主环境中使用，并且不是特定于某个项目才能使用的，使用“ECMAScript modules(ECMAScript模块)”写法。
 *
 *
 *
 * 编写原则：
 * 1、能用模块化的API尽量用模块化的，少用或者不用全局的，目的是为了让“编码风格”尽量符合“模块化”的理念。
 *
 * 2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 3、注意函数尾调用、算法时间复杂度、算法空间复杂度等优化。
 *
 * 4、那些不被导出供外部调用使用的、属于内部7788的处理函数、类等等，要以“HandleBy”打头命名。
 *
 * 5、那些需要被导出供外部调用使用的函数、类等等，一定要记得也要同时部署在“默认导出”中。
 *
 * 6、编程范式使用“函数式编程”，结合“TypeScript”编写，这样更好得便于被Webpack等工具进行“Tree-shaking”，只打包那些被使用的。
 *
 * 7、那些用于限定、描述数据类型的类型声明也要记得导出，以便供外部使用，如：type T_MyString001 = string。
 *
 *
 *
 * 关于“严格模式”的注意事项：
 * 1、'use strict'严格模式会在函数内部自动深度的传递严格模式的效果。
 * 如：
 * ```ts
 * function Fun1( x ){
 * 'use strict';
 *
 * function Fun2( y = 1 ){
 * console.log( y );
 *
 * console.log( this );
 * }
 *
 * Fun2();
 * }
 * ```
 * 说明：
 * Fun1里的'use strict'严格模式的效果会传递到Fun2内部！
 * 但是，Fun1里的'use strict'严格模式却不会作用于Fun2的默认函数参数，但是Fun2里的this还是会为undefined！
 * 所以，Fun1不可以设置默认函数参数，但是Fun2可以设置默认函数参数！
 *
 * 2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 3、webpack编译后的JS代码会去掉多余的'use strict'，只保留编译前每个文件的顶级'use strict'。
 *
 * 4、class内部的方法中存在的'use strict'，在webpack编译后会被删除。
 *
 * 5、严格模式下的this还是可以通过apply、bind、call来设置的，否则还是undefined。
 * 如：
 * ```ts
 * 'use strict';
 *
 * function Fun1(){
 * 'use strict';
 *
 * console.dir( this );
 * }
 *
 * Fun1.call( { a: 1, } ); // 输出：{ a: 1, }，而不是undefined。
 * ```
 *
 *
 *
 * 该工具经过了如下优化(以后的代码添加、修改都应该尽量遵循如下的优化标准)：
 * PS：
 * 只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
 *
 * 1、函数尾调用优化；
 * 2、算法时间复杂度优化；
 * 3、算法空间复杂度优化；
 */
declare const UniversalTools: typeof import('../tools/ts/universal_tools/UniversalTools.esm.mts');
