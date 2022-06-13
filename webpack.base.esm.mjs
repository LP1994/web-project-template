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
  join,
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
   * 在webpack 5中引入了实验选项，以使用户能够激活和试用实验性功能。<br />
   * 1、由于实验性功能具有宽松的语义版本控制并且可能包含重大更改，因此请确保将webpack的版本修复为次要版本，例如webpack: ~5.4.3而不是webpack: ^5.4.3或者在使用实验时使用锁定文件。<br />
   */
  experimentsConfig = {
    /**
     * 根据更新的规范支持新的WebAssembly，它使WebAssembly模块成为异步模块。当experiments.futureDefaults设置为true时默认启用。<br />
     * 1、这是推荐的在webpack 5中的最新的WASM集成规范。<br />
     */
    asyncWebAssembly: true,
    /**
     * 为许多webpack 4 API启用带有弃用警告的向后兼容层。<br />
     */
    backCompat: true, /**
     * 启用后，webpack可以构建以http(s):协议开头的远程资源。<br />
     * 1、启用后的使用例子：import pMap1 from 'https://cdn.skypack.dev/p-map';<br />
     * 2、除了设置成Boolean值，还可以是更加详细的Object值：<br />
     * {<br />
     * allowedUris：[ string，例如：http://localhost:9990/ ]、[ RegExp，例如：^https?:// ]、[ Function，例如：(uri: string) => boolean ]，允许的URI列表（分别是它们的开头）。<br />
     * 
     * cacheLocation：string、false，定义缓存远程资源的位置。也可以通过传递false来禁用存储。<br />
     * 1、默认情况下，webpack会使用<compiler-name.>webpack.lock.data/进行缓存。<br />
     * 2、请注意，您应该将experiments.buildHttp.cacheLocation下的文件提交到版本控制系统中，因为在生产构建期间不会发出任何网络请求。<br />
     * 
     * frozen：boolean，冻结远程资源和lockfile。对lockfile或资源内容的任何修改都将导致错误。<br />
     * 
     * lockfileLocation：string，定义存储lockfile的位置。<br />
     * 1、默认情况下，webpack会生成一个<compiler-name.>webpack.lock>文件，您需要确保将其提交到版本控制系统中。<br />
     * 2、因为在生产构建期间，webpack将从experiments.buildHttp.cacheLocation下的lockfile和缓存提取资源来构建以http(s):开头的模块。<br />
     * 
     * proxy：string，指定用于获取远程资源的代理服务器。<br />
     * 1、默认情况下，webpack会暗示使用代理服务器从http_proxy（不区分大小写）环境变量中获取远程资源。但是，您也可以通过代理选项指定一个。<br />
     * 
     * upgrade：boolean，检测远程资源的更改并自动升级它们。<br />
     * 1、设置后，将获取现有lockfile条目的资源，并在资源内容发生更改时升级条目。<br />
     * }<br />
     */
    /**
     * buildHttp: true,
     */
    buildHttp: {
      allowedUris: [
        new RegExp( /^http(s)?:\/\/([\w.]+\/?)\S*/ ),
      ],
      cacheLocation: join( __dirname, `./webpack_location/lockfile_cache/${ node_env }/` ),
      frozen: true,
      lockfileLocation: join( __dirname, `./webpack_location/lockfile_cache/${ node_env }/` ),
      upgrade: true,
    },
    /**
     * 启用未更改的模块的额外内存缓存，并且仅引用未更改的模块。<br />
     * 1、默认值同futureDefaults的值。<br />
     */
    cacheUnaffected: true,
    /**
     * 启用原生CSS支持。请注意，它是一个仍在开发中的实验性功能，将在webpack v6中默认启用，但是您可以在GitHub上跟踪进度。<br />
     */
    css: true,
    /**
     * 使用下一个主要webpack的默认值，并在任何有问题的地方显示警告。<br />
     */
    futureDefaults: true,
    /**
     * 启用模块和块层。<br />
     */
    layers: true,

    lazyCompilation: true,

    /**
     * 一旦启用，webpack将尽可能输出ECMAScript模块语法。例如，import()加载块，ESM导出以公开块数据等等。<br />
     */
    outputModule: false,
    /**
     * 像webpack 4一样支持旧的WebAssembly。<br />
     * 1、这是不推荐的在webpack 4中的实验性选项。<br />
     */
    syncWebAssembly: false,
    /**
     * 支持Top Level Await Stage 3提案，当在顶层使用await时，它使模块成为异步模块。当experiments.futureDefaults设置为true时默认启用。<br />
     */
    topLevelAwait: true,
  },
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
   * 使用此选项生成一个JSON文件，其中包含webpack“记录”——用于跨多个构建存储模块标识符的数据片段。您可以使用此文件来跟踪模块在构建之间的变化。<br />
   * 1、如果您有一个利用代码拆分的复杂设置，则记录特别有用。该数据可用于确保拆分包实现您需要的缓存行为。<br />
   * 2、请注意，尽管此文件是由编译器生成的，但您可能仍希望在源代码管理中对其进行跟踪，以保留其随时间变化的历史记录。<br />
   * 3、设置recordsPath本质上会将recordsInputPath和recordsOutputPath设置为相同的位置。这通常是所有必要的，除非您决定更改包含记录的文件的名称。<br />
   */
  recordsPathConfig = folderName => {
    const nowDate = new Date( Date.now() ),
      year = nowDate.getFullYear(),
      month = String( nowDate.getMonth() + 1 ).padStart( 2, '0' ),
      date = String( nowDate.getDate() ).padStart( 2, '0' ),
      hours = String( nowDate.getHours() ).padStart( 2, '0' ),
      minutes = String( nowDate.getMinutes() ).padStart( 2, '0' ),
      seconds = String( nowDate.getSeconds() ).padStart( 2, '0' ),
      day0 = Number( nowDate.getDay() ),
      day = day0 === 0
            ? '日'
            : day0,
      recordsPath = `./webpack_location/records/${ folderName }/Records_${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒(周${ day }).json5`;

    return join( __dirname, recordsPath );
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
  experimentsConfig,
  providePluginConfig,
  recordsPathConfig,
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
  experimentsConfig,
  providePluginConfig,
  recordsPathConfig,
  targetConfig,
};
