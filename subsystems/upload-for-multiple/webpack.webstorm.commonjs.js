/**
 * Project: upload-for-multiple
 * FileDirPath: webpack.webstorm.commonjs.js
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 该文件是用来让“WebStorm”这个开发工具识别“Webpack”配置中“resolve”这个字段里头的各个别名变量，当然其他配置字段也系可以被识别的。
 * 1、这么做才能让代码中的别名路径被“WebStorm”这个开发工具识别到，才可以通过点击这个别名路径导航到目标文件。
 * 2、目前“WebStorm”这个开发工具只能识别以.js为结尾的CommonJS模块标准编写的“Webpack”配置，其他的后缀名、模块写法还不能识别。
 */

'use strict';

const path = require( 'node:path' ),
  webpack = require( 'webpack' );

module.exports = {
  resolve: {
    /**
     * 设置路径别名。<br />
     * 1、resolve.alias优先于其他模块解析。<br />
     * 2、路径别名到底是路径别名，别用于直接指向具体的文件，尤其是JS文件，因为会导致无法根据导入语法的不同自行加载到相应的模块文件，致使报错；但是CSS一类的文件倒是可以直接指向到具体的文件。<br />
     * 3、为第三方包设置别名时，只能是以包名开始，其他任何都不行，因为webpack会自动从“node_modules”中查找，包括：“./”、“./node_modules/”、“node_modules/”等等都是不行的，当然如果是指向自己的模块文件夹，那还是要指定完整路径。<br />
     * 4、也可以指定完整路径：xxx: path.resolve(path.join(__dirname, 'src/module1'))。<br />
     * 5、path.resolve和path.join的区别在于：<br />
     * 例如：<br />
     * path.resolve( __dirname, './src/assets/' )，最后解析成：G:\WebStormWS\upload-for-multiple\src\assets
     * path.join( __dirname, './src/assets/' )，最后解析成：G:\WebStormWS\upload-for-multiple\src\assets\
     * 有或是没有最后的“\”在具体应用时很重要！不然容易出现不如你所愿的现象。<br />
     * 6、当设置文件夹的路径别名时，用path.resolve设置时，其值包不包含最后的“/”都没关系，因为最后生成的路径（如：G:\WebStormWS\upload-for-multiple\src\assets）最尾部都不会包含“\”。<br />
     * 7、当设置文件夹的路径别名时，用path.join设置时，其值如果包含最后的“/”，则最后生成的路径（如：G:\WebStormWS\upload-for-multiple\src\assets\）最尾部就会包含“\”，反之不会。<br />
     * 8、设置文件夹的路径别名时，建议使用path.resolve，这样在后续使用路径别名时，就可以按正常的习惯使用：import JSONDemo001 from 'jsonDir/Demo001.json';<br />
     */
    alias: {
      'element-ui-css$': 'element-ui/lib/theme-chalk/index.css',
      'element-plus-css$': 'element-plus/dist/index.css',
      'swiper-css$': 'swiper/swiper-bundle.min.css',

      // assets文件夹 Start
      'assetsDir': path.resolve( __dirname, './src/assets/' ),

      'docDir': path.resolve( __dirname, './src/assets/doc/' ),

      'csonDir': path.resolve( __dirname, './src/assets/doc/cson/' ),
      'csvDir': path.resolve( __dirname, './src/assets/doc/csv/' ),
      'jsonDir': path.resolve( __dirname, './src/assets/doc/json/' ),
      'json5Dir': path.resolve( __dirname, './src/assets/doc/json5/' ),
      'tomlDir': path.resolve( __dirname, './src/assets/doc/toml/' ),
      'tsvDir': path.resolve( __dirname, './src/assets/doc/tsv/' ),
      'txtDir': path.resolve( __dirname, './src/assets/doc/txt/' ),
      'xmlDir': path.resolve( __dirname, './src/assets/doc/xml/' ),
      'yamlDir': path.resolve( __dirname, './src/assets/doc/yaml/' ),

      'fontsDir': path.resolve( __dirname, './src/assets/fonts/' ),
      'imgDir': path.resolve( __dirname, './src/assets/img/' ),
      'musicDir': path.resolve( __dirname, './src/assets/music/' ),
      'videosDir': path.resolve( __dirname, './src/assets/videos/' ),
      // assets文件夹 End

      'componentsDir': path.resolve( __dirname, './src/components/' ),

      'gQLAPIDir': path.resolve( __dirname, './src/graphQL/api/' ),

      'nativeComponentsDir': path.resolve( __dirname, './src/native_components/' ),

      'pagesDir': path.resolve( __dirname, './src/pages/' ),

      'pwaManifestDir': path.resolve( __dirname, './src/pwa_manifest/' ),

      // styles文件夹 Start
      'stylesDir': path.resolve( __dirname, './src/styles/' ),

      'cssDir': path.resolve( __dirname, './src/styles/css/' ),
      'lessDir': path.resolve( __dirname, './src/styles/less/' ),
      'postcssDir': path.resolve( __dirname, './src/styles/postcss/' ),
      'sassDir': path.resolve( __dirname, './src/styles/sass/' ),
      'scssDir': path.resolve( __dirname, './src/styles/scss/' ),
      'stylusDir': path.resolve( __dirname, './src/styles/stylus/' ),
      // styles文件夹 End

      // template文件夹 Start
      'templateDir': path.resolve( __dirname, './src/template/' ),

      'ejsDir': path.resolve( __dirname, './src/template/ejs/' ),
      'handlebarsDir': path.resolve( __dirname, './src/template/handlebars/' ),
      'htmlDir': path.resolve( __dirname, './src/template/html/' ),
      'markdownDir': path.resolve( __dirname, './src/template/markdown/' ),
      'mustacheDir': path.resolve( __dirname, './src/template/mustache/' ),
      'pug_jadeDir': path.resolve( __dirname, './src/template/pug_jade/' ),
      // template文件夹 End

      // tools文件夹 Start
      'toolsDir': path.resolve( __dirname, './src/tools/' ),

      'jsDir': path.resolve( __dirname, './src/tools/js/' ),
      'tsDir': path.resolve( __dirname, './src/tools/ts/' ),

      'currency_toolsDir': path.resolve( __dirname, './src/tools/js/currency_tools/' ),
      'universal_toolsDir': path.resolve( __dirname, './src/tools/ts/universal_tools/' ),
      // tools文件夹 End

      'wasmDir': path.resolve( __dirname, './src/wasm/build/' ),

      'webComponentsDir': path.resolve( __dirname, './src/web_components/' ),

      // workers文件夹 Start
      'workersDir': path.resolve( __dirname, './src/workers/' ),

      'serviceWorkersDir': path.resolve( __dirname, './src/workers/service_workers/' ),
      'sharedWorkersDir': path.resolve( __dirname, './src/workers/shared_workers/' ),
      'workersToolsDir': path.resolve( __dirname, './src/workers/tools/' ),
      'webWorkersDir': path.resolve( __dirname, './src/workers/web_workers/' ),
      // workers文件夹 End

      'deno_std/': 'https://deno.land/std/',
      'deno_std_encoding/': 'https://deno.land/std/encoding/',
      'deno_std_io/': 'https://deno.land/std/io/',
      'deno_std_media_types$': 'https://deno.land/std/media_types/mod.ts',
      'deno_std_path$': 'https://deno.land/std/path/mod.ts',

      'deno_x/': 'https://deno.land/x/',
      'deno_x_corejs$': 'https://deno.land/x/corejs/index.js',
      'deno_x_ejs$': 'https://deno.land/x/dejs/mod.ts',
      'deno_x_mongo$': 'https://deno.land/x/mongo/mod.ts',

      'esm_sh/': 'https://esm.sh/',
      'esm_sh_graphql$': 'https://esm.sh/graphql',

      'preact/': 'https://cdn.skypack.dev/preact/',
      'preact_jsx-runtime$': 'https://cdn.skypack.dev/preact/jsx-runtime?dts',
      'preact_jsx-dev-runtime$': 'https://cdn.skypack.dev/preact/jsx-dev-runtime?dts',

      'deno_src/': path.resolve( __dirname, './simulation_servers/deno/src/' ),
      'configures/': path.resolve( __dirname, './simulation_servers/deno/src/configures/' ),
      'route_map_config/': path.resolve( __dirname, './simulation_servers/deno/src/configures/route_map_config/' ),
      'database/': path.resolve( __dirname, './simulation_servers/deno/src/database/' ),
      'deno_db/': path.resolve( __dirname, './simulation_servers/deno/src/database/deno_db/' ),
      'firebase/': path.resolve( __dirname, './simulation_servers/deno/src/database/firebase/' ),
      'graphql/': path.resolve( __dirname, './simulation_servers/deno/src/database/graphql/' ),
      'mongo/': path.resolve( __dirname, './simulation_servers/deno/src/database/mongo/' ),
      'mysql/': path.resolve( __dirname, './simulation_servers/deno/src/database/mysql/' ),
      'postgres/': path.resolve( __dirname, './simulation_servers/deno/src/database/postgres/' ),
      'sqlite/': path.resolve( __dirname, './simulation_servers/deno/src/database/sqlite/' ),
      'supabase/': path.resolve( __dirname, './simulation_servers/deno/src/database/supabase/' ),
      'public/': path.resolve( __dirname, './simulation_servers/deno/src/public/' ),
      'routers/': path.resolve( __dirname, './simulation_servers/deno/src/routers/' ),
      'servers/': path.resolve( __dirname, './simulation_servers/deno/src/servers/' ),
      'services/': path.resolve( __dirname, './simulation_servers/deno/src/services/' ),
      'ssr/': path.resolve( __dirname, './simulation_servers/deno/src/ssr/' ),
      'template/': path.resolve( __dirname, './simulation_servers/deno/src/template/' ),
      'ejs/': path.resolve( __dirname, './simulation_servers/deno/src/template/ejs/' ),
      'handlebars/': path.resolve( __dirname, './simulation_servers/deno/src/template/handlebars/' ),
      'html/': path.resolve( __dirname, './simulation_servers/deno/src/template/html/' ),
      'markdown/': path.resolve( __dirname, './simulation_servers/deno/src/template/markdown/' ),
      'mustache/': path.resolve( __dirname, './simulation_servers/deno/src/template/mustache/' ),
      'pug_jade/': path.resolve( __dirname, './simulation_servers/deno/src/template/pug_jade/' ),
      'tools/': path.resolve( __dirname, './simulation_servers/deno/src/tools/' ),
      'third_party_modules/': path.resolve( __dirname, './simulation_servers/deno/src/tools/third_party_modules/' ),
      'universal_tool_for_deno/': path.resolve( __dirname, './simulation_servers/deno/src/tools/universal_tool_for_deno/' ),
      'static/': path.resolve( __dirname, './simulation_servers/deno/static/' ),
      'test/': path.resolve( __dirname, './simulation_servers/deno/test/' ),
      'upload/': path.resolve( __dirname, './simulation_servers/deno/upload/' ),
      'web/': path.resolve( __dirname, './simulation_servers/deno/web/' ),

      'GSD2TSTD$': path.resolve( __dirname, './simulation_servers/deno/src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts' ),
      'MF_v2_RuntimeAPI$': path.resolve( __dirname, './src/ModuleFederation_v2_RuntimeAPI.esm.mts' ),
    },
    /**
     * 如果为true，则将不允许无扩展名的文件。设置成false就行。<br />
     * 1、强制解析器使用扩展选项中的一个扩展（用户必须指定不带扩展的请求）。<br />
     */
    enforceExtension: false,
    extensions: [
      '.js',
      '.cjs',
      '.mjs',
      '.ts',
      '.cts',
      '.mts',

      '.jsx',
      '.tsx',

      '.json',
      '.json5',

      '.wasm',

      '.vue',

      '...',
    ],
    modules: [
      'node_modules',
    ],
    plugins: [
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
       * 8、注意，不同的包，因为其package.json中"exports"字段值的不同，如下设置也会不同的，最好每次都要在代码中测试是否如期望一样达到目的效果。<br />
       * 9、鉴于某些低版本浏览器不支持ES6+的语法，而如下设置又直接使用了第三方包的ESM版本，那么最终的打包代码中会直接使用其ESM版本的代码，从而导致不支持某些低版本浏览器。<br />
       *
       * @type {object}
       */
      new webpack.ProvidePlugin( {
        axios: [
          path.resolve( path.join( __dirname, './node_modules/axios/dist/esm/axios.js' ) ),
          'default',
        ],

        Ckeditor5ClassicEditor: path.resolve( path.join( __dirname, './node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js' ) ),

        d3: 'd3',

        echarts: path.resolve( path.join( __dirname, './node_modules/echarts/dist/echarts.js' ) ),

        /**
         * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
         * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
         */
        ELEMENT: path.resolve( path.join( __dirname, './node_modules/element-ui/lib/element-ui.common.js' ) ),
        ElementPlus: 'element-plus',

        /**
         * JavaScript HTML 渲染器：<br />
         * 该脚本允许您直接在用户浏览器上截取网页或其部分内容的“屏幕截图”。屏幕截图基于 DOM，因此可能无法 100% 准确地反映真实情况，因为它不会制作实际的屏幕截图，而是根据页面上的可用信息构建屏幕截图。<br />
         * 详细见：https://github.com/niklasvh/html2canvas <br />
         * Options选项见：https://html2canvas.hertzen.com/configuration <br />
         */
        html2canvas: path.resolve( path.join( __dirname, './node_modules/html2canvas/dist/html2canvas.esm.js' ) ),

        $: path.resolve( path.join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),
        jQuery: path.resolve( path.join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),
        'window.$': path.resolve( path.join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),
        'window.jQuery': path.resolve( path.join( __dirname, './node_modules/jquery/dist/jquery.js' ) ),

        /*
         官方文档：https://github.com/emn178/js-sha3

         导出的JSSHA3是一个对象，JSSHA3上部署有如下函数：
         cshake128、cshake256、cshake_128、cshake_256、
         keccak224、keccak256、keccak384、keccak512、keccak_224、keccak_256、keccak_384、keccak_512、
         kmac128、kmac256、kmac_128、kmac_256、
         sha3_224、sha3_256、sha3_384、sha3_512、
         shake128、shake256、shake_128、shake_256
         */
        JSSHA3: path.resolve( path.join( __dirname, './node_modules/js-sha3/build/sha3.min.js' ) ),
        /*
         https://github.com/emn178/js-sha512

         导出的JSSHA512是一个函数。
         */
        JSSHA512: path.resolve( path.join( __dirname, './node_modules/js-sha512/build/sha512.min.js' ) ),
        /*
         https://github.com/emn178/js-sha256

         导出的JSSHA256是一个函数。
         */
        JSSHA256: path.resolve( path.join( __dirname, './node_modules/js-sha256/build/sha256.min.js' ) ),
        /*
         https://github.com/emn178/js-sha1

         导出的JSSHA1是一个函数。
         */
        JSSHA1: path.resolve( path.join( __dirname, './node_modules/js-sha1/build/sha1.min.js' ) ),
        /*
         https://github.com/emn178/js-md5

         导出的JSMD5是一个函数。
         */
        JSMD5: path.resolve( path.join( __dirname, './node_modules/js-md5/build/md5.min.js' ) ),
        /*
         https://github.com/dankogai/js-base64

         导出的JSBase64是一个对象。
         */
        JSBase64: path.resolve( path.join( __dirname, './node_modules/js-base64/base64.js' ) ),

        localforage: path.resolve( path.join( __dirname, './node_modules/localforage/dist/localforage.js' ) ),

        lodash: path.resolve( path.join( __dirname, './node_modules/lodash/lodash.js' ) ),

        PIXI: 'pixi.js',

        Swiper: [
          path.resolve( path.join( __dirname, './node_modules/swiper/swiper.mjs' ) ),
          'default',
        ],

        THREE: 'three',

        underscore: 'underscore',

        /**
         * element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。<br />
         * 1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。<br />
         */
        Vue: 'vue',
        VueRouter: 'vue-router',
        Vuex: [
          'vuex',
          'default',
        ],
        Pinia: 'pinia',

        CurrencyTools: path.resolve( path.join( __dirname, './src/tools/js/currency_tools/CurrencyTools.esm.mjs' ) ),
        UniversalTools: path.resolve( path.join( __dirname, './src/tools/ts/universal_tools/UniversalTools.esm.mts' ) ),
      } ),
    ],
    symlinks: false,
  },
};
