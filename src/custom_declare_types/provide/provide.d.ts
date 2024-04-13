/// <reference types="./axios.d.ts" />
/// <reference types="./JSSHA3.d.ts" />
/// <reference types="./JSSHA512.d.ts" />
/// <reference types="./JSSHA256.d.ts" />
/// <reference types="./JSSHA1.d.ts" />
/// <reference types="./JSMD5.d.ts" />
/// <reference types="./JSBase64.d.ts" />
/// <reference types="./localforage.d.ts" />
/// <reference types="./underscore.d.ts" />
/// <reference types="./UniversalTools.d.ts" />

/**
 * Project: web-project-template
 * FileDirPath: src/custom_declare_types/provide/provide.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 配合new webpack.ProvidePlugin插件里定义的全局常量所自定义的关于这些全局常量的类型描述。
 */

declare global {

  interface Window {
    /**
     * jQuery 是一个快速、小巧、功能丰富的 JavaScript 库。它通过一个易于使用的 API，使 HTML 文档的遍历和操作、事件处理、动画和 Ajax 等变得更加简单，并能在多种浏览器上运行。集多功能性和可扩展性于一身，jQuery 改变了数百万人编写 JavaScript 的方式。<br />
     * 详细见：https://api.jquery.com/
     */
    $: any;
    /**
     * jQuery 是一个快速、小巧、功能丰富的 JavaScript 库。它通过一个易于使用的 API，使 HTML 文档的遍历和操作、事件处理、动画和 Ajax 等变得更加简单，并能在多种浏览器上运行。集多功能性和可扩展性于一身，jQuery 改变了数百万人编写 JavaScript 的方式。<br />
     * 详细见：https://api.jquery.com/
     */
    jQuery: any;
  }

}

/**
 * 强大的所见即所得框架可提供完全自定义的编辑体验。<br />
 * 详细见：https://ckeditor.com/docs/ckeditor5/latest/installation/index.html
 */
declare const Ckeditor5ClassicEditor: any;

/**
 * D3（或D3.js）是一个免费的开源 JavaScript 库，用于可视化数据。其基于 Web 标准构建的低级方法为创作动态、数据驱动的图形提供了无与伦比的灵活性。十多年来，D3 推动了突破性且屡获殊荣的可视化，成为高级图表库的基础构建块，并在世界各地培育了一个充满活力的数据从业者社区。<br />
 * 详细见：https://d3js.org/getting-started
 */
declare const d3: any;

/**
 * Apache ECharts 是一个免费的、功能强大的图表和可视化库，可提供简单的方法为您的商业产品添加直观、交互式和高度可定制的图表。它由纯 JavaScript 编写，基于全新的轻量级画布库 zrender。<br />
 * 详细见：https://echarts.apache.org/handbook/en/get-started/
 */
declare const echarts: any;

/**
 * 用于 Web 的 Vue.js 2.0 UI 工具包。<br />
 * 详细见：https://element.eleme.io/#/zh-CN/component/installation
 */
declare const ELEMENT: any;

/**
 * Vue.js 3 UI 库。<br />
 * 详细见：https://element-plus.org/zh-CN/guide/quickstart.html
 */
declare const ElementPlus: any;

/**
 * jQuery 是一个快速、小巧、功能丰富的 JavaScript 库。它通过一个易于使用的 API，使 HTML 文档的遍历和操作、事件处理、动画和 Ajax 等变得更加简单，并能在多种浏览器上运行。集多功能性和可扩展性于一身，jQuery 改变了数百万人编写 JavaScript 的方式。<br />
 * 详细见：https://api.jquery.com/
 */
declare const $: any;
/**
 * jQuery 是一个快速、小巧、功能丰富的 JavaScript 库。它通过一个易于使用的 API，使 HTML 文档的遍历和操作、事件处理、动画和 Ajax 等变得更加简单，并能在多种浏览器上运行。集多功能性和可扩展性于一身，jQuery 改变了数百万人编写 JavaScript 的方式。<br />
 * 详细见：https://api.jquery.com/
 */
declare const jQuery: any;

/**
 * 现代 JavaScript 工具库，提供模块化、高性能和额外功能。<br />
 * 详细见：https://lodash.com/docs/
 */
declare const lodash: any;

/**
 * PixiJS 是一个渲染库，可让您创建丰富的交互式图形以及跨平台应用程序和游戏，而无需深入研究 WebGL API 或处理浏览器和设备兼容性。<br />
 * 详细见：https://pixijs.com/guides
 */
declare const PIXI: any;

/**
 * Swiper - 是一款免费、最现代的移动触摸滑块，具有硬件加速转换功能和惊人的本地行为。它适用于移动网站、移动网络应用程序和移动原生/混合应用程序。Swiper 并不兼容所有平台，它是一款现代触摸滑块，只专注于现代应用程序/平台，以带来最佳体验和简洁性。<br />
 * 详细见：https://swiperjs.com/get-started
 */
declare const Swiper: any;

/**
 * three是一个JavaScript 3D 库。目标是创建一个易于使用、轻量级、跨浏览器、通用的 3D 库。目前的版本只包含一个 WebGL 渲染器，但 WebGPU（试验性）、SVG 和 CSS3D 渲染器也可作为附加组件使用。<br />
 * 详细见：https://threejs.org/
 */
declare const THREE: any;

/**
 * Vue 3是一个渐进的、可逐步采用的 JavaScript 框架，用于在网络上构建用户界面。<br />
 * 详细见：https://vuejs.org/guide/introduction.html
 */
declare const Vue: any;

/**
 * Vue路由器，Vue.js 的官方路由器，富有表现力、可配置且方便的路由。<br />
 * 详细见：https://router.vuejs.org/guide/
 */
declare const VueRouter: any;

/**
 * Vuex 是 Vue.js 应用程序的状态管理模式和库。它是应用程序中所有组件的集中存储，其规则确保状态只能以可预测的方式发生变化。它还与 Vue 的官方 devtools 扩展集成，提供零配置时间旅行调试和状态快照导出/导入等高级功能。<br />
 * 详细见：https://vuex.vuejs.org/
 */
declare const Vuex: any;

/**
 * Pinia是直观、类型安全、轻便灵活的 Vue Store，使用支持 DevTools 的合成 api。<br />
 * 1、Pinia现在是新的默认设置。Vue 的官方状态管理库已更改为Pinia。<br />
 * 2、Pinia具有与Vuex 5几乎完全相同或增强的 API，如Vuex 5 RFC中所述。您可以简单地将 Pinia 视为具有不同名称的 Vuex 5。<br />
 * 3、Pinia 也可以与 Vue 2.x 配合使用。Vuex 3 和 4 仍将得到维护。然而，它不太可能为其添加新功能。<br />
 * 4、Vuex 和 Pinia 可以安装在同一个项目中。如果您要将现有的 Vuex 应用程序迁移到 Pinia，它可能是一个合适的选择。<br />
 * 5、但是，如果您计划开始一个新项目，我们强烈建议您使用 Pinia。<br />
 * 详细见：https://pinia.vuejs.org/introduction.html
 */
declare const Pinia: any;

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
declare const CurrencyTools: any;
