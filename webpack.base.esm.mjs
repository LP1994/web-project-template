/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: webpack.base.esm.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 该文件里的配置都是webpack中公共部分的配置，供webpack.dev.mjs、webpack.local.mjs、webpack.production.mjs、webpack.test.mjs使用。
 */

'use strict';

import {
  dirname,
  resolve,
} from 'node:path';

import {
  argv,
  env,
} from 'node:process';

import {
  fileURLToPath,
} from 'node:url';

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

/**
 * 表示项目文件夹根目录，不是磁盘根目录。<br />
 */
const __dirname = Get__dirname( import.meta.url ),
  /**
   * isPro的值为true时表示生成环境，反之开发环境。<br />
   */
  isPro = ( argv => {
    const num1 = argv.findIndex( c => c === '--mode' );

    if( num1 !== -1 ){
      const str1 = argv.at( num1 + 1 );

      if( String( str1 ) === 'development' ){
        return false;
      }
      else if( String( str1 ) === 'production' ){
        return true;
      }
      else{
        console.dir( argv );

        throw new Error( 'CLI参数中紧跟在“--mode”之后的，只能是development、production。' );
      }
    }
    else{
      console.dir( argv );

      throw new Error( 'CLI参数中没找到“--mode”参数。' );
    }
  } )( argv ),
  /**
   * 是否将项目设置成单页面应用程序(SPA)，默认true表示单页面应用程序(SPA)，false表示多页面应用程序(MPA)。<br />
   */
  isSPA = true,
  /**
   * node_env的值是字符串，有4个值：'dev_server'、'local_server'、'test'、'production'，来源是CLI参数。<br />
   */
  node_env = env.NODE_ENV;

/**
 * 设置路径别名。<br />
 * 1、resolve.alias优先于其他模块解析。<br />
 * 2、路径别名到底是路径别名，别用于直接指向具体的文件，尤其是JS文件，因为会导致无法根据导入语法的不同自行加载到相应的模块文件，致使报错；但是CSS一类的文件倒是可以直接指向到具体的文件。<br />
 * 3、为第三方包设置别名时，只能是以包名开始，其他任何都不行，因为webpack会自动从“node_modules”中查找，包括：“./”、“./node_modules/”、“node_modules/”等等都是不行的，当然如果是指向自己的模块文件夹，那还是要指定完整路径。<br />
 * 4、也可以指定完整路径：xxx: path.resolve(path.join(__dirname, 'src/module1'))。<br />
 */
const aliasConfig = {
    'element-ui_css': 'element-ui/lib/theme-chalk/index.css',
    'element-plus_css': 'element-plus/dist/index.css',
    swiper_css: 'swiper/swiper-bundle.min.css',
  },
  entryConfig = {},
  /**
   * 自动加载模块，而不必在任何地方“import”或“require”它们。<br />
   * 1、默认情况下，模块解析路径是从“当前文件夹”和“node_modules”中开始查找。<br />
   * 2、要导入ES2015模块的“默认导出”，必须指定模块的“默认属性”，也就是说模块必须指定“默认属性”。<br />
   * 3、每当在模块中遇到标识符作为自由变量时，模块会自动加载，并且标识符会填充加载模块的导出（或“属性”以支持“命名导出”）。<br />
   * 如：_map: ['lodash', 'map']、Vue: ['vue/dist/vue.esm.js', 'default']。<br />
   * 4、也可以指定完整路径：identifier: path.resolve(path.join(__dirname, 'src/module1'))。<br />
   * 5、为第三方包配置时，只要用包名作为value值即可，因为webpack会自动从“node_modules”中查找，并加载相应的模块文件。<br />
   * 6、为第三方包配置时，不要设置以“./”、“./node_modules/”、“node_modules/”等等开头的value值，当然如果是指向自己的模块文件，那还是要指定完整路径。<br />
   * 7、element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
   */
  providePluginConfig = {
    axios: 'axios',
    echarts: 'echarts',
    /**
     * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
     * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
     */
    ELEMENT: 'element-ui',
    ElementPlus: 'element-plus',
    $: 'jquery',
    jQuery: 'jquery',
    'window.$': 'jquery',
    'window.jQuery': 'jquery',
    Swiper: 'swiper',
    /**
     * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
     * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
     */
    Vue: 'vue',
    VueRouter: 'vue-router',
    Vuex: 'vuex',
  },
  /**
   * 指示webpack以特定环境为目标，当没有找到browserslist配置时，默认为“browserslist”或“web”。<br />
   * 1、值格式：string、[ string ]、false，如：[ 'web', 'es2022', ]。<br />
   * 2、当传递多个目标时，将使用公共特征子集：[ 'web', 'es2022', ]，目前，并非所有目标都可能是混合的。<br />
   * 3、当没有提供有关“target”或“environment features”的信息时，将使用“es2015”。<br />
   */
  targetConfig = [
    'web',
    'es2022',
  ];

export {
  Get__dirname,
  Get__filename,

  __dirname,
  isPro,
  isSPA,
  node_env,

  aliasConfig,
  entryConfig,
  providePluginConfig,
  targetConfig,
};

export default {
  Get__dirname,
  Get__filename,

  __dirname,
  isPro,
  isSPA,
  node_env,

  aliasConfig,
  entryConfig,
  providePluginConfig,
  targetConfig,
};
