/**
 * Project: web-project-template
 * FileDirPath: configures/HTMLWebpackPluginConfig.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * html-webpack-plugin插件的配置。
 * 如果您有使用它的插件，则应在任何集成插件之前先订购html-webpack-plugin。
 */

'use strict';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import entryConfig from './EntryConfig.esm.mjs';

import {
  weinreLocalPort,
  weinrePublicNetworkHost,
  weinrePublicNetworkPort,
} from './GlobalParameters.esm.mjs';

import {
  ShortcutIcons,
  Icons,
  AppleTouchIcon,
  AppleTouchIconPrecomposed,
} from './IconForLink.esm.mjs';

import StartupImgForApple from './StartupImgForApple.esm.mjs';

/**
 * @type {object} 为HtmlWebpackPlugin的data选项中的顶级变量、公共变量设置默认值，尤其是顶级变量，如果顶级变量未定义会报出编译错误。
 * 顶级变量就算不需要也要保证它们被设置为null。
 * 各个属性具体表示什么，值是什么，可参见“src/template/ejs/head_meta”、“src/template/ejs/tool”中的描述。
 */
const defaultData = {
  contentSecurityPolicy: null,
  expires: 0,
  setCookieExpires: null,
  pageEnter: 'revealTrans(duration=5,transtion=8)',
  pageExit: 'revealTrans(duration=5,transtion=9)',
  refresh: null,
  color: '#0000ff',
  keywords: 'WEB,HTML5,CSS3',
  description: 'This is a page for HelloWorld.',
  subject: '这是一个副标题。',
  generator: 'WebStorm',
  appName: 'HelloWorld',
  author: '1227839175@qq.com',
  publisher: '12278',
  creators: [
    '1227839175@qq.com',
  ],
  itemprop: {
    type: 'website',
    url: 'https://192.168.2.7:8100/dev_server/pages/HelloWorld.html',
    name: 'HelloWorld',
    description: 'This is a page for HelloWorld.',
    image: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
  },
  appLinks: {
    web: {
      url: 'https://192.168.2.7:8100/dev_server/pages/HelloWorld.html',
    },
    share: {
      type: 'website',
      url: 'https://192.168.2.7:8100/dev_server/pages/HelloWorld.html',
      title: 'HelloWorld',
      description: 'This is a page for HelloWorld.',
      image: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
    },
  },
  shortcutIcons: ShortcutIcons,
  icons: Icons,
  appleTouchIcon: AppleTouchIcon,
  appleTouchIconPrecomposed: AppleTouchIconPrecomposed,
  og: {
    og: 'website',
    title: 'HelloWorld',
    url: 'https://192.168.2.7:8100/dev_server/pages/HelloWorld.html',
    siteName: 'HelloWorld',
    description: 'This is a page for HelloWorld.',
    locale: 'zh_CN',
    image: {
      url: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
      secureURL: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
      type: 'image/png',
      width: '512',
      height: '512',
      alt: '网站图片_512x512.png',
    },
  },
  alternate: null,
  twitter: {
    type: 'website',
    creator: '1227839175@qq.com',
    site: 'https://192.168.2.7:8100/dev_server/pages/HelloWorld.html',
    url: 'https://192.168.2.7:8100/dev_server/pages/HelloWorld.html',
    title: 'HelloWorld',
    description: 'This is a page for HelloWorld.',
    card: 'summary_large_image',
    image: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
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
  startupImgForApple: StartupImgForApple,
  dynamicREM: true,
  webpackAssetsManifest: '../webpack_assets_manifest.json',
  weinreTool: {
    isEnable: false,
    weinreLocalPort,
    id: '',
    custom: null,
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
   */
  const config = [
    // 当isSPA为true时，会只取config里的第1个配置，因为此时项目被设置为单页应用，这个也将作为标准模板配置供参考，复制它后再改改某些具体的参数值即可。
    {
      title: 'HelloWorld',
      filename: 'pages/HelloWorld.html',
      template: './src/template/ejs/HelloWorld.ejs',
      excludeChunks: isSPA
                     ? []
        // 注意这里传入的字符串必须跟entry配置（EntryConfig.esm.mjs）中对应的入口项的key名一致。
                     : ExcludeChunks( 'HelloWorld' ),
      meta: {},
      data: {
        ...defaultData,
      },
    },

    {
      title: 'Upload',
      filename: 'pages/Upload.html',
      template: './src/pages/upload/Upload.ejs',
      excludeChunks: isSPA
                     ? []
                     : ExcludeChunks( 'Upload' ),
      meta: {},
      data: {
        ...defaultData,
        description: 'This is a page for Upload.',
        appName: 'Upload',
        itemprop: {
          type: 'website',
          url: 'https://192.168.2.7:8100/dev_server/pages/Upload.html',
          name: 'Upload',
          description: 'This is a page for Upload.',
          image: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
        },
        appLinks: {
          web: {
            url: 'https://192.168.2.7:8100/dev_server/pages/Upload.html',
          },
          share: {
            type: 'website',
            url: 'https://192.168.2.7:8100/dev_server/pages/Upload.html',
            title: 'Upload',
            description: 'This is a page for Upload.',
            image: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
          },
        },
        og: {
          og: 'website',
          title: 'Upload',
          url: 'https://192.168.2.7:8100/dev_server/pages/Upload.html',
          siteName: 'Upload',
          description: 'This is a page for Upload.',
          locale: 'zh_CN',
          image: {
            url: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
            secureURL: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
            type: 'image/png',
            width: '512',
            height: '512',
            alt: '网站图片_512x512.png',
          },
        },
        twitter: {
          type: 'website',
          creator: '1227839175@qq.com',
          site: 'https://192.168.2.7:8100/dev_server/pages/Upload.html',
          url: 'https://192.168.2.7:8100/dev_server/pages/Upload.html',
          title: 'Upload',
          description: 'This is a page for Upload.',
          card: 'summary_large_image',
          image: 'https://192.168.2.7:8100/dev_server/static/ico/uncompressed/ico_512_512.png',
        },
      },
    },
  ];

  const arr = config.map( item => {
    return new HtmlWebpackPlugin( {
      inject: 'body',
      publicPath: 'auto',
      scriptLoading: 'defer',
      minify: isProduction
              ? HTMLMinifyConfig
              : false,
      // 如果为true，则将唯一的webpack编译哈希附加到所有包含的脚本和CSS文件。这对于缓存破坏很有用。
      hash: isProduction,
      cache: !isProduction,
      showErrors: !isProduction,
      chunksSortMode: 'auto',
      xhtml: true,
      ...item,
    } );
  } );

  return isSPA
    // 当isSPA为true时，会只取config里的第1个配置，因为此时项目被设置为单页应用。
         ? [ arr[ 0 ] ]
         : arr;
}

export {
  HTMLWebpackPluginConfig,
};

export default HTMLWebpackPluginConfig;
