/**
 * Project: upload-for-multiple
 * FileDirPath: postcss.config.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 该postcss的配置不包含CSS Modules的处理。
 */

'use strict';

import {
  postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
} from './configures/GlobalParameters.esm.mjs';

import {
  isProduction,
  browserslist,
  autoprefixerConfig,
  postcssCalcConfig,
} from './webpack.base.esm.mjs';

export default {
  // 配置插件的时候注意顺序哦！不同插件之间有先后处理的规则！postcss的插件有200多之数（有些还废弃、迁移包名之类的），还会随着积累越来越多的，挑着对项目有用的插件配置，不要过度求全，不然指不定会出现不如所愿的情况出现。
  plugins: [
    // 生成后备的兼容语法 Start

    // postcss-will-change-transition，为transition生成will-change。这个插件在transition之后添加了will-change属性来加速动画。可以与postcss-will-change插件结合使用，但是postcss-will-change-transition插件得在postcss-will-change插件之前。
    'postcss-will-change-transition',

    /**
     * postcss-will-change（得在Autoprefixer插件之前），使用backface-visibility来强制浏览器创建一个新层，而不覆盖现有的backface-visibility属性。<br />
     * 1、这个3D CSS hack通常使用transform: translateZ(0)来完成，但是这里使用了backface-visibility来避免覆盖更流行的transform属性。<br />
     * 2、不支持will-change的浏览器需要这些hack。<br />
     * 3、得在Autoprefixer插件之前使用此插件，它将供应商前缀添加到背面可见性。<br />
     */
    'postcss-will-change',

    // postcss-safe-area，为安全区域环境变量添加浏览器后备。
    'postcss-safe-area',

    /**
     * postcss-momentum-scrolling，用于为iOS上具有overflow（scroll、auto）的元素添加动量样式滚动行为（-webkit-overflow-scrolling: touch）。<br />
     * 1、默认仅为overflow: scroll添加-webkit-overflow-scrolling: touch。
     */
    'postcss-momentum-scrolling',

    // 生成后备的兼容语法 End

    // postcss-preset-env
    [
      'postcss-preset-env',
      {
        /**
         * 根据它们在成为实施Web标准的过程中的稳定性来确定要填充哪些CSS功能。<br />
         * 1、阶段可以是0（实验）到4（稳定），也可以是false。将stage设置为false将禁用每个polyfill。仅当您打算专门使用features选项时，这样做才有用。<br />
         * 2、默认值为2。<br />
         * 3、为了在PostCSS Preset Env更新之间获得更高的稳定性，您可以设置stage: 3和minimumVendorImplementations: 2。保持接近标准的一个副作用是您可以更轻松地将项目迁移到其他工具。<br />
         */
        stage: 0,
        /**
         * 根据实现状态确定要填充哪些CSS功能。这可用于启用浏览器中可用的插件，无论规范状态如何。<br />
         * 1、可以是0（没有供应商实现它）到 3（所有主要供应商）。<br />
         * 2、默认值为0。<br />
         * 3、当任何供应商尚未实施某个功能时，可以将其视为实验性的。<br />
         * 4、即使只有一个实现，它也可能在未来发生变化。<br />
         * 5、有时，功能/规范的问题只有在它可用后才会被发现。<br />
         * 6、当您只想使用那些应该稳定的功能时，建议使用值2。<br />
         * 7、拥有2个独立的实现是提案成为标准的关键步骤，也是功能稳定性的良好指标。<br />
         * 8、为了在PostCSS Preset Env更新之间获得更高的稳定性，您可以设置stage: 3和minimumVendorImplementations: 2。保持接近标准的一个副作用是您可以更轻松地将项目迁移到其他工具。<br />
         */
        minimumVendorImplementations: 0,
        browsers: browserslist,
        preserve: true,
        // debug: !isProduction,
        // 请注意，通过“feature”选项手动启用/禁用功能会覆盖此标志。
        enableClientSidePolyfills: true,
        // autoprefixer共有三种类型的控制注释：
        // /* autoprefixer: (on|off) */：在注释前后“启用/禁用”整个块的所有Autoprefixer翻译。
        // /* autoprefixer: ignore next */：仅为下一个属性或下一个规则选择器或规则参数（但不规则/规则正文）禁用自动前缀。
        // /* autoprefixer grid: (autoplace|no-autoplace|off) */：控制Autoprefixer如何处理整个块的网格转换：
        // autoplace：启用带有自动放置支持的网格翻译。
        // no-autoplace：在禁用自动放置支持的情况下启用网格转换，但不支持自动放置（该值是值on的别名，但是值on是一个已弃用的值）。
        // off：禁用所有网格翻译。
        autoprefixer: autoprefixerConfig,
      },
    ],

    // 优化性插件，这里个人设置成只做优化，不对特殊的、非标准的CSS语法（符合W3C的CSS语法）做处理 Start

    // postcss-single-charset，当文件中存在多个@charset规则时，会将最后一个@charset规则提取到文件顶部，并删除其他@charset规则。
    'postcss-single-charset',

    /**
     * postcss-remove-nested-calc
     * 1、说是已弃用，calc(100vw - calc(20% - 10px))到calc(100vw - (20% - 10px))以实现IE 11兼容性（其实IE 9及其以上版本也都不支持calc函数嵌套）。<br />
     * 2、使用下面的“@csstools/postcss-nested-calc”来代替它也行。<br />
     */
    // 'postcss-remove-nested-calc',

    // @csstools/postcss-nested-calc，处理calc函数的嵌套，文档见：https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nested-calc。<br />
    [
      '@csstools/postcss-nested-calc',
      {
        preserve: false,
      },
    ],

    /**
     * postcss-calc
     * 1、MDN上提到允许嵌套calc()函数（IE浏览器不支持的，可以用括号来代替嵌套），在这种情况下，内部函数被视为简单的括号。<br />
     * 2、对于长度，您不能使用0来表示0px（或其他长度单位）；相反，您必须使用带有单位。<br />
     * 3、如果您愿意，您可以为表达式中的每个值使用不同的单位。您还可以在需要时使用括号来建立计算顺序。<br />
     * 4、+和-运算符必须被空格包围，有效：calc(50% - 8px)。<br />
     * 5、*和/运算符不需要空格，但为了保持一致性，允许并建议添加空格。<br />
     * 6、涉及自动和固定布局表中的表格列、表格列组、表格行、表格行组和表格单元格的宽度和高度百分比的数学表达式可能被视为已指定auto。<br />
     * 7、当calc()用于控制文本大小时，请确保其中一个值包含相对长度单位，例如： font-size: calc(1.5rem + 3vw)，这可确保在缩放页面时文本大小会缩放。<br />
     * 8、与整数一起使用时，在需要<integer>的地方使用calc()时，该值将四舍五入为最接近的整数。例如：z-index: calc(3 / 2)，最终会取2这个值。<br />
     * 9、注意：Chrome浏览器当前不接受calc()返回的某些值，当需要整数时。这包括任何除法，即使它产生一个整数。z-index: calc(4 / 2)，也将不被接受。<br />
     * 10、+和-运算符两边的操作数都必须是带单位的，但是*和/运算符两边的操作数至少有一个带单位就行。<br />
     * 11、该插件就开发环境启用，生产环境不要使用，因为生产环境会启用cssnano进行压缩，而cssnano里面就有calc选项（也是使用postcss-calc插件），而且也已经配置了。<br />
     */
    ...( () => {
      return isProduction
             ? []
             : [
          [
            'postcss-calc',
            postcssCalcConfig,
          ],
        ];
    } )(),

    // postcss-mq-optimize（说是已弃用，但是人家还在更新，而且postcss官方插件页面还能搜索到它），删除无效的媒体查询或其表达式。
    'postcss-mq-optimize',

    /**
     * postcss-merge-queries，将相同的CSS媒体查询规则合并为一个。<br />
     * 1、由于此插件将所有媒体查询移动到文件末尾，因此如果您的CSS结构不合理，它可能会引入错误，导致结果不如所愿。所以记住这一点！<br />
     * 2、因此，建议在开发中也使用此插件以更快地检测到此类副作用。<br />
     */
    'postcss-merge-queries',

    /**
     * postcss-combine-duplicated-selectors，自动检测和组合重复的css选择器，这样你就不必手动处理了。<br />
     * 1、该插件就开发环境启用，生产环境不要使用，因为生产环境会启用cssnano进行压缩，而cssnano里面就有discardDuplicates选项，而且也已经配置了。<br />
     */
    ...( () => {
      return isProduction
             ? []
             : [
          [
            'postcss-combine-duplicated-selectors',
            {
              // 可以选择组合重复的属性，启用后会移除重复的属性，后面的会覆盖前面的，从而保留最后的那个属性。
              removeDuplicatedProperties: true,
              // 限制仅在值相等时才组合属性，启用后会移除重复的属性，后面的会覆盖前面的，从而保留最后的那个属性。但是必须保证其值是全等的，对于使用了自定义属性的，还是会保留自定义属性的。
              removeDuplicatedValues: true,
            },
          ],
        ];
    } )(),

    // 优化性插件，这里个人设置成只做优化，不对特殊的、非标准的CSS语法（符合W3C的CSS语法）做处理 End

    // 特殊处理 Start

    // postcss-pseudo-element-colons，转换伪元素的双冒号、单冒号，对于新的标准的W3C规范，伪元素最好都用双冒号，虽然单冒号也被支持，但是它是不规范或者旧的规范版本。
    [
      'postcss-pseudo-element-colons',
      {
        'selectors': [
          'before',
          'after',
          'first-letter',
          'first-line',
        ],
        'colon-notation': 'double',
      },
    ],

    /**
     * postcss-viewport-height-correction，解决height: 100vh在移动端浏览器（尤其是iOS端的浏览器）上出现的“怪异”现象，哪怕不是100vh，如：50vh、75vh、-1vh也会出现怪异现象。
     * 1、相关文章可见：<br />
     * https://cloud.tencent.com/developer/article/2031944
     * https://www.jianshu.com/p/437fd5b603de
     * 2、该插件的使用需要手动引入部分JS，具体写法见：<br />
     * https://github.com/Faisal-Manzer/postcss-viewport-height-correction
     */
    [
      'postcss-viewport-height-correction',
      {
        /**
         * 注意：仅使用纯字母字符作为自定义变量名称。我们正在使用正则表达式来修补视口值，任何带有特殊字符的变量都可能导致未知问题。<br />
         * 1、自定义属性名称区分大小写--my-color将被视为与--My-color不同的自定义属性。<br />
         * 2、默认值为：vh。<br />
         * 3、该设置值要跟JS中的变量customViewportCorrectionVariable的值保持一致。<br />
         */
        variable: postcssViewportHeightCorrectionCustomViewportCorrectionVariable,
      },
    ],

    // 特殊处理 End

    // postcss-browser-reporter，如果您想涵盖所有可能的警告，请将此插件放在所有插件之后。
    [
      'postcss-browser-reporter',
      {
        selector: 'html::before',
        styles: {
          display: 'block !important',
          position: 'fixed !important',
          top: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          left: '0 !important',
          'z-index': '202200000000 !important',
          content: '',
          width: '100% !important',
          height: '100% !important',
          'background-color': 'red !important',
          color: 'white !important',
          'font-size': '12px !important',
          overflow: 'hidden !important',
          'white-space': 'pre-wrap !important',
        },
      },
    ],
  ],
};
