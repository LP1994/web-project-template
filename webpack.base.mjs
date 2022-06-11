/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: webpack.base.mjs
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
  fileURLToPath,
} from 'node:url';

function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

const __dirname = Get__dirname( import.meta.url );

/*
 设置路径别名。
 1、resolve.alias优先于其他模块解析。
 2、路径别名到底是路径别名，别用于直接指向具体的文件，尤其是JS文件，因为会导致无法根据导入语法的不同自行加载到相应的模块文件，致使报错；但是CSS一类的文件倒是可以直接指向到具体的文件。
 3、为第三方包设置别名时，只能是以包名开始，其他任何都不行，因为webpack会自动从“node_modules”中查找，包括：“./”、“./node_modules/”、“node_modules/”等等都是不行的，当然如果是指向自己的模块文件夹，那还是要指定完整路径。
 4、也可以指定完整路径：xxx: path.resolve(path.join(__dirname, 'src/module1'))。
 */
const aliasConfig = {
    'element-ui_css': 'element-ui/lib/theme-chalk/index.css',
    'element-plus_css': 'element-plus/dist/index.css',
    swiper_css: 'swiper/swiper-bundle.min.css',
  },
  /*
   自动加载模块，而不必在任何地方“import”或“require”它们。
   1、默认情况下，模块解析路径是从“当前文件夹”和“node_modules”中开始查找。
   2、要导入ES2015模块的“默认导出”，必须指定模块的“默认属性”，也就是说模块必须指定“默认属性”。
   3、每当在模块中遇到标识符作为自由变量时，模块会自动加载，并且标识符会填充加载模块的导出（或“属性”以支持“命名导出”）。
   如：_map: ['lodash', 'map']、Vue: ['vue/dist/vue.esm.js', 'default']。
   4、也可以指定完整路径：identifier: path.resolve(path.join(__dirname, 'src/module1'))。
   5、为第三方包配置时，只要用包名作为value值即可，因为webpack会自动从“node_modules”中查找，并加载相应的模块文件。
   6、为第三方包配置时，不要设置以“./”、“./node_modules/”、“node_modules/”等等开头的value值，当然如果是指向自己的模块文件，那还是要指定完整路径。
   7、element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。
   */
  providePluginConfig = {
    axios: 'axios',
    echarts: 'echarts',
    /*
     element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。
     1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。
     */
    ELEMENT: 'element-ui',
    ElementPlus: 'element-plus',
    $: 'jquery',
    jQuery: 'jquery',
    'window.$': 'jquery',
    'window.jQuery': 'jquery',
    Swiper: 'swiper',
    /*
     element-ui依赖vue 2.X，而当前安装的时vue 3.X，所以如果要使用element-ui，要去安装vue 2.X的包，如：vue@2.6.14。
     1、当要使用element-ui且安装了vue 2.X，并且设置了：ELEMENT: 'element-ui'、Vue: 'vue'，那么在代码中使用这两个的时候要写成：Vue.default.use( ELEMENT )。
     */
    Vue: 'vue',
    VueRouter: 'vue-router',
    Vuex: 'vuex',
  };

export {
  Get__dirname,
  Get__filename,
  __dirname,

  aliasConfig,
  providePluginConfig,
};

export default {
  Get__dirname,
  Get__filename,
  __dirname,

  aliasConfig,
  providePluginConfig,
};
