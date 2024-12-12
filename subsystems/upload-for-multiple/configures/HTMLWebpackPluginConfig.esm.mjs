/**
 * Project: upload-for-multiple
 * FileDirPath: configures/HTMLWebpackPluginConfig.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * html-webpack-plugin插件的配置。
 * 如果您有使用它的插件，则应在任何集成插件之前先订购html-webpack-plugin。
 * 详细的配置见：
 * node_modules/html-webpack-plugin/typings.d.ts:39
 * https://github.com/jantimon/html-webpack-plugin#options
 * 内部默认值见：
 * node_modules/html-webpack-plugin/index.js:45
 */

'use strict';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import entryConfig from './EntryConfig.esm.mjs';

import {
  Chii4RemoteLikeWeinreLocalPort,
  Chii4RemoteLikeWeinreRemoteAddr,
} from './GlobalParameters.esm.mjs';

import {
  ShortcutIcons,
  Icons,
  AppleTouchIcon,
  AppleTouchIconPrecomposed,
} from './IconForLink.esm.mjs';

import StartupImgForApple from './StartupImgForApple.esm.mjs';

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
 * 为HtmlWebpackPlugin的data选项中的顶级变量、公共变量设置默认值，尤其是顶级变量，如果顶级变量未定义会报出编译错误。
 * 顶级变量就算不需要也要保证它们被设置为null。
 * 各个属性具体表示什么，值是什么，可参见“src/template/ejs/head_meta”、“src/template/ejs/tool”中的描述。
 *
 * @type {object}
 */
const defaultData = {
  contentSecurityPolicy: null,
  expires: `${ new Date( Date.now() + ( 2 * 60 * 60 * 1000 ) ).toUTCString() }`,
  setCookieExpires: null,
  pageEnter: 'revealTrans(duration=5,transtion=8)',
  pageExit: 'revealTrans(duration=5,transtion=9)',
  refresh: null,
  color: '#0000ff',
  keywords: 'WEB,HTML5,CSS3',
  description: 'This is a page for Index.',
  subject: '这是一个副标题。',
  generator: 'WebStorm',
  appName: 'Index',
  author: '1227839175@qq.com',
  publisher: '12278',
  creators: [
    '1227839175@qq.com',
  ],
  itemprop: {
    type: 'website',
    url: URLHead + '/pages/Index.html',
    name: 'Index',
    description: 'This is a page for Index.',
    image: URLHead + '/static/ico/uncompressed/ico_167_167.png',
  },
  appLinks: {
    web: {
      url: URLHead + '/pages/Index.html',
    },
    share: {
      type: 'website',
      url: URLHead + '/pages/Index.html',
      title: 'Index',
      description: 'This is a page for Index.',
      image: URLHead + '/static/ico/uncompressed/ico_167_167.png',
    },
  },
  shortcutIcons: ShortcutIcons,
  icons: Icons,
  appleTouchIcon: AppleTouchIcon,
  appleTouchIconPrecomposed: AppleTouchIconPrecomposed,
  og: {
    og: 'website',
    title: 'Index',
    url: URLHead + '/pages/Index.html',
    siteName: 'Index',
    description: 'This is a page for Index.',
    locale: 'zh_CN',
    image: {
      url: URLHead + '/static/ico/uncompressed/ico_167_167.png',
      secureURL: URLHead + '/static/ico/uncompressed/ico_167_167.png',
      type: 'image/png',
      width: '167',
      height: '167',
      alt: '网站图片_167x167.png',
    },
  },
  alternate: null,
  twitter: {
    type: 'website',
    creator: '1227839175@qq.com',
    site: URLHead + '/pages/Index.html',
    url: URLHead + '/pages/Index.html',
    title: 'Index',
    description: 'This is a page for Index.',
    card: 'summary_large_image',
    image: URLHead + '/static/ico/uncompressed/ico_167_167.png',
  },
  facebook: null,
  publisherByGooglePlus: null,
  manifestByPWA: null,
  apple_itunes_app: null,
  dnsPrefetch: null,
  preconnect: null,
  preload: null,
  prefetch: null,
  prerender: null,
  modulepreload: null,
  mobileAgent: null,
  importByHTML: null,
  shortlink: null,
  search: null,
  startupImgForApple: null,
  dynamicREM: true,
  webpackAssetsManifest: URLHead + '/webpack_assets_manifest.json',
  chii4RemoteLikeWeinreTool: {
    isEnable: false,
    Chii4RemoteLikeWeinreLocalPort,
    Chii4RemoteLikeWeinreRemoteAddr,
  },
  // 以上的顶级变量，就算不需要也要保证它们被设置为null，否则会出现顶级变量未定义的编译错误。

  // 以下是多个模板之间会共用到的变量的默认值。
  lang: 'zh-CN',
  prefix: 'og: https://ogp.me/ns#',
};

/**
 * 根据传入的参数currentEntryName做处理，排除掉非当前入口的模块，避免在当前页面引入非此页面需要的模块。<br />
 * PS：<br />
 * 1、已经对当前入口依赖的其他入口项做了处理，不会排除依赖项的。<br />
 *
 * @param {string} currentEntryName 当前入口的key名，不能为空字符串，必需。<br />
 *
 * @returns {string[]|[]} 返回值类型为：string[]或空数组[]，前者存放的就是要被排除的模块，后者表示不做任何排除。
 */
function ExcludeChunks( currentEntryName ){
  // entry的配置类型有4种：string、数组、function、object，当为object时，会根据传入的函数参数currentEntryName做处理，排除掉非当前入口的模块，避免在当前页面引入非此页面需要的模块。
  if( Object.prototype.toString.call( entryConfig ) === '[object Object]' ){
    const currentEntryConfig = entryConfig[ currentEntryName ];

    // 每个具体的entry的配置类型也有4种：string、数组、function、object，当为object时，会根据传入的函数参数currentEntryName做处理，排除掉非当前入口的模块，避免在当前页面引入非此页面需要的模块。
    if( Object.prototype.toString.call( currentEntryConfig ) === '[object Object]' ){
      const obj1 = Object.fromEntries( Object.entries( Object.keys( entryConfig ) ).map( item => item.reverse() ) );

      [
        currentEntryName,
        // 注意不要排除当前入口依赖的其他入口项。
        currentEntryConfig.dependOn ?? [],
      ].flat( Infinity ).forEach( item => {
        delete obj1[ item ];
      } );

      return Array.from( Object.keys( obj1 ) );
    }
    // 每个具体的entry的配置类型也有4种：string、数组、function、object，当不为object时，就不需要排除某些模块，返回一个空数组就是表示不需要排除任何模块。
    else{
      return [];
    }
  }
  // entry的配置类型有4种：string、数组、function、object，当不为object时，就不需要排除某些模块，返回一个空数组就是表示不需要排除任何模块。
  else{
    return [];
  }
}

/**
 * 生成一个或多个HtmlWebpackPlugin配置。<br />
 * 详细的配置见：<br />
 * node_modules/html-webpack-plugin/typings.d.ts:39
 * https://github.com/jantimon/html-webpack-plugin#options
 * 内部默认值见：<br />
 * node_modules/html-webpack-plugin/index.js:45
 *
 * @param {object} config 对象参数。
 *
 * @param {boolean} config.isProduction 值为true时表示生产环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值，必需。<br />
 *
 * @param {boolean} config.isSPA 是否将项目设置成单页面应用程序(SPA)，true表示单页面应用程序(SPA)，false表示多页面应用程序(MPA)，必需。<br />
 *
 * @param {object} config.HTMLMinifyConfig 压缩HTML的配置选项，必需。<br />
 *
 * @returns {HtmlWebpackPlugin[]} 返回一个数组，里面是HtmlWebpackPlugin实例。
 */
function HTMLWebpackPluginConfig( {
  isProduction,
  isSPA,
  HTMLMinifyConfig,
} ){
  /**
   * 一般只要配置该变量就行。<br />
   * PS：<br />
   * 1、当isSPA为true时，会只取config里的第1个配置，因为此时项目被设置为单页应用，这个也将作为标准模板配置供参考，复制它后再改改某些具体的参数值即可。<br />
   *
   * 详细的配置见：
   * node_modules/html-webpack-plugin/typings.d.ts:39
   * https://github.com/jantimon/html-webpack-plugin#options
   * 内部默认值见：
   * node_modules/html-webpack-plugin/index.js:45
   */
  const config = [
    // 当isSPA为true时，会只取config里的第1个配置，因为此时项目被设置为单页应用，这个也将作为标准模板配置供参考，复制它后再改改某些具体的参数值即可。
    {
      title: 'Index',
      filename: 'pages/Index.html',
      template: './src/pages/index/Index.ejs',
      excludeChunks: isSPA
                     ? []
        // 注意这里传入的字符串必须跟entry配置（EntryConfig.esm.mjs）中对应的入口项的key名一致。
                     : ExcludeChunks( 'Index' ),
      data: {
        ...defaultData,
      },
    },
  ];

  const configArr = config.map( item => {
    /**
     * 详细的配置见：
     * node_modules/html-webpack-plugin/typings.d.ts:39
     * https://github.com/jantimon/html-webpack-plugin#options
     * 内部默认值见：
     * node_modules/html-webpack-plugin/index.js:45
     */
    return new HtmlWebpackPlugin( {
      /**
       * 只有在文件被改变的情况下才发出。默认值：true。
       *
       * @type {boolean}
       */
      cache: !isProduction,
      /**
       * 列出应注入的所有块，只负责确保哪些块会被注入到模板中，不负责这些块的先后顺序。<br />
       * 1、该选项默认值也是'all'，也就是说就算不设置该选项，该插件的内部也会将其设置为'all'，'all'表示将所有“块”都注入到该模板中。<br />
       * 2、如果某个块既在选项“excludeChunks”中又在选项“chunks”中，那么这个块最后也还是会被排除掉。<br />
       *
       * @type {'all' | string[]}
       */
      chunks: 'all',
      /**
       * 允许控制在html中包含块之前应该如何排序的问题。默认值：'auto'。
       *
       * @type {'auto'|'manual'|((entryNameA: string, entryNameB: string) => number)}
       */
      chunksSortMode: 'auto',
      /**
       * 列出所有不应注入的块。<br />
       * 1、默认值为空数组，空数组表示什么块都不排除。<br />
       * 2、如果某个块既在选项“excludeChunks”中又在选项“chunks”中，那么这个块最后也还是会被排除掉。<br />
       *
       * @type {string[]}
       */
      // excludeChunks: [],
      /**
       * favicon图标的路径。默认值为false。
       *
       * @type {false | string}
       */
      // favicon: false,
      /**
       * 要写入HTML的文件。支持子目录，例如：`assets/admin.html`。[name]将被条目名称所取代，支持一个函数来生成名称。默认值为：'index.html'。<br />
       * 1、例如设置为：filename: 'pages/Index.html'，最后会在文件夹“pages”下生成一个“Index.html”文件，文件夹“pages”则是在输出文件夹下。<br />
       *
       * @type {string | ((entryName: string) => string)}
       */
      // filename: '',
      /**
       * 默认值为'auto'。默认情况下，publicPath被设置为 "auto"--这样一来，html-webpack-plugin会尝试根据当前文件名和webpack的公共路径设置来设置公共路径。
       *
       * @type {string | 'auto'}
       */
      publicPath: 'auto',
      /**
       * 如果为true，则将唯一的webpack编译哈希附加到所有包含的脚本和CSS文件。这对于缓存破坏很有用。默认值为false。
       *
       * @type {boolean}
       */
      hash: true,
      /**
       * 要将生成的“scripts”标签注入到哪个HTML节点内。默认值为：head。
       * 1、false表示不要将生成的“scripts”标签注入到任何HTML节点内。
       * 2、true表示要将生成的“scripts”标签注入到body节点内。
       * 3、'body'表示要将生成的“scripts”标签注入到body节点内。
       * 4、'head'表示要将生成的“scripts”标签注入到head节点内。
       *
       * @type {false|true|'body'|'head'}
       */
      inject: 'body',
      /**
       * 默认值为'defer'。设置脚本加载的形式。
       * 1、blocking表示生成这样的：<script src="..."></script>
       * 2、defer表示生成这样的：<script defer src="..."></script>
       * 3、module表示生成这样的：<script type="module" src="..."></script>
       *
       * @type {'blocking' | 'defer' | 'module'}
       */
      scriptLoading: 'defer',
      /**
       * 注入meta标签，默认值：{}。
       *
       * @type {false|{ [name: string]: | string | false | { [attributeName: string]: string | boolean }; }}
       */
      meta: {},
      /**
       * HTML最小化选项。默认值'auto'。
       * 1、Set to `false` to disable minifcation
       * 2、Set to `'auto'` to enable minifcation only for production mode
       * 3、Set to custom minification according to：node_modules/@types/html-minifier-terser/index.d.ts:15
       *
       * @type {'auto' | boolean | MinifyOptions}
       */
      minify: isProduction
              ? HTMLMinifyConfig
              : false,
      /**
       * 将错误渲染到HTML页面中。默认值true。
       *
       * @type {boolean}
       */
      showErrors: !isProduction,
      /**
       * 'webpack'需要的模板路径。默认值是一个字符串：'auto'。<br />
       * 1、例如：设置成：'./src/template/ejs/Index.ejs'，就表示说模板的位置是在这里。<br />
       * 2、注意，由于“configures/HTMLWebpackPluginConfig.esm.mjs”最后是被“webpack.base.esm.mjs”文件引入使用，所以，当设置为相对路径时，也应该是以“webpack.base.esm.mjs”文件所在的文件夹路径开始。<br />
       *
       * @type {string}
       */
      // template: '',
      /**
       * 允许使用一个html字符串，而不是从文件中读取。默认值是false。
       *
       * @type {false|string|((templateParameters: { [option: string]: any; }) => string | Promise<string>)|Promise<string>}
       */
      // templateContent: false,
      /**
       * 允许覆盖模板中使用的参数。默认值为：templateParametersGenerator。
       *
       * @type {false|(( compilation: any, assets: { publicPath: string; js: Array<string>; css: Array<string>; manifest?: string; favicon?: string; }, assetTags: { headTags: HtmlTagObject[]; bodyTags: HtmlTagObject[]; }, options: ProcessedOptions ) => { [option: string]: any } | Promise<{ [option: string]: any }>)|{ [option: string]: any }}
       */
      // templateParameters: templateParametersGenerator,
      /**
       * 生成的HTML文档要使用的标题。默认值为：'Webpack App'。
       *
       * @type {string}
       */
      // title: '',
      /**
       * 强制执行自我关闭标签，如<link />。默认值为：false。
       *
       * @type {boolean}
       */
      xhtml: true,
      /**
       * 除了这个插件实际使用的选项（也就是上面列出的那些选项）之外，你还可以自定义任意的选项，将它们作为额外的数据注入到模板中。
       * 1、在模板中，可以直接通过“htmlWebpackPlugin”取到“options”，而“options”上就有能直接取到自定义的那些选项，从而取到自定义的数据。如：使用htmlWebpackPlugin.options。
       */
      // [option: string]: any;
      ...item,
    } );
  } );

  return isSPA
    // 当isSPA为true时，会只取config里的第1个配置，因为此时项目被设置为单页应用。
         ? [ configArr[ 0 ] ]
         : configArr;
}

export {
  HTMLWebpackPluginConfig,
};

export default HTMLWebpackPluginConfig;
