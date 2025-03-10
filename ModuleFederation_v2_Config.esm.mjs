/**
 * Project: web-project-template
 * FileDirPath: ModuleFederation_v2_Config.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-01-01 00:00:00 星期六
 */

/**
 * Module Federation V2
 * 详细见：https://module-federation.io/guide/start/index.html
 */

'use strict';

import {
  resolve,
} from 'node:path';

import package_json from './package.json' with { type: 'json', };

function GetVersion4NPMPackageName2PackageJson( npmPackageName ){
  const version4NPMPackageName = package_json.devDependencies[ npmPackageName.trim() ];

  if( version4NPMPackageName ){
    let str001 = String( version4NPMPackageName ).trim();

    while( !( /^[0-9]/i.test( str001 ) ) ){
      str001 = str001.slice( 1 ).trim();
    }

    return str001;
  }
  else{
    throw new Error( `你需要安装该npm包：${ npmPackageName.trim() }，请在项目根目录下执行该命令：npm --force install -D ${ npmPackageName.trim() }` );
  }
}

function ModuleFederation_v2_Config_Fun( {
  __dirname,
  isProduction,
} ){
  /**
   * @type {import('node_modules/@module-federation/sdk/dist/src/types/plugins/ModuleFederationPlugin.d.ts').ModuleFederationPluginOptions} ModuleFederationPluginOptions
   */
  return {
    /**
     * 模块联邦的模块名称，该名称必须是唯一的。必须。<br />
     * 1、模块联邦使用该名称进行运行时数据检索和全局块存储变量引用。<br />
     * 2、远端模块提供者、模块使用者都得设置该参数！<br />
     */
    name: 'MF_v2_Main_web-project-template',
    /**
     * 远端模块提供者生成的remoteEntry的文件名。非必须。<br />
     * 1、默认值：'remoteEntry.js'。<br />
     * 2、作为“output.path”目录内的相对路径。<br />
     * 例如，可以设置为：'mf_v2/RemoteEntry_UploadForMultiple.js'，表示生成的JS文件路径会是：'${ output.path }/mf_v2/RemoteEntry_UploadForMultiple.js'。<br />
     * 3、一般来说，设置了该选项的，就表示其是一个远端模块提供者（也叫做：远端模块分享者之类的，当然远端模块提供者也是可以使用（消费）其他的远端模块提供者提供的远端模块）。<br />
     */
    // filename: 'RemoteEntry_UploadForMultiple.js',
    /**
     * 一般来说，设置了该选项的，就表示其是一个远端模块使用者（也叫做：远端模块消费者之类的）。<br />
     * 1、当然远端模块提供者也是可以使用（消费）其他的远端模块提供者提供的远端模块）。<br />
     * 2、在"@module-federation/enhanced v0.8.1"中，发现有效的能运行起来的就该选项的配置写法只能是如下这种：
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@${ process.env.RemoteUploadForMultipleURL }RemoteEntry_UploadForMultiple.js`,
     * }
     * PS：(RemotesItem | RemotesObject)[]，这个类型的配置写法，都会报错！
     * </code>
     * 3、注意！如果“@”之后的URL设置的格式不对，是会导致打包出的代码不含有期望的可以成功运行的代码！<br />
     * 4、目前，“ModuleFederation v2”在插件模式下除了能通过“.env”文件来设置不同打包环境的URL值外，想要真正的根据实际业务开发需求进行动态设置“remotes”，那就只能使用“ModuleFederation v2”的运行时API了。<br />
     * 5、个人编写了一个自定义插件（注意，只是扩展了功能，不影响原本的功能）：“./src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts”。<br />
     * 注意：该自定义插件只能在插件构建模式下使用，不能在运行时注册使用该插件！因为其功用是在“beforeInit”函数中定义的，但是该函数是不会在运行时被调用的，只会在插件构建模式下被调用。<br />
     * 其功用是在“beforeInit”函数中，将自定义标识“#auto#”处理为：<br />
     * <code>
     * remote.entry = new URL( remote.entry.split( '#auto#' ).at( -1 ), location.href ).href
     * </code>
     * 自定义标识“#auto#”表示，该“远端模块提供者”的加载地址(也就是JS脚本url)是根据“远端模块使用者”的“origin”、“浏览器页面上的url”等处理成相对“远端模块使用者”url路径的“远端模块提供者”url路径。<br />
     * 使用例如：<br />
     * 在“ModuleFederation_v2_Config.esm.mjs”中有如下设置：<br />
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@${
     *     isProduction
     *     ? `#auto#${ process.env.RemoteUploadForMultipleURL }`
     *     : process.env.RemoteUploadForMultipleURL
     *   }RemoteEntry_UploadForMultiple.js`,
     * },
     * runtimePlugins: [
     *   resolve( __dirname, './src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts' ),
     * ],
     * </code>
     * 在环境变量配置文件（.env.dev）中：<br />
     * <code>
     * RemoteUploadForMultipleURL=https://localhost:8101/dev_server/mf_v2/
     * </code>
     * 在环境变量配置文件（.env.production）中：<br />
     * <code>
     * RemoteUploadForMultipleURL=../mf_v2/upload_for_multiple/mf_v2/
     * </code>
     * 在开发模式（isProduction为false）下，上面的“remotes”实际是如此：<br />
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@https://localhost:8101/dev_server/mf_v2/RemoteEntry_UploadForMultiple.js`,
     * },
     * </code>
     * 在生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@#auto#../mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
     * },
     * </code>
     * 通过自定义插件（注意，只是扩展了功能，不影响原本的功能）处理后，生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
     * 假定“远端模块使用者”的浏览器页面url地址是：<br />
     * http://localhost:8090/web-project-template/dist/production/pages/Upload.html
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@http://localhost:8090/web-project-template/dist/production/mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
     * },
     * </code>
     * 这样，原本插件构建模式下的“固定url（这里的“固定”一词是相对运行时可以动态设置远端模块提供者的url）”也就可以做到类似在运行时那样，可以动态设置远端模块提供者的url。<br />
     * 注意！该自定义插件只是扩展了功能，不影响原本的功能。<br />
     */
    remotes: {
      RemoteUploadForMultiple: `Remote_UploadForMultiple@${
        isProduction
        ? `#auto#${ process.env.RemoteUploadForMultipleURL }`
        : process.env.RemoteUploadForMultipleURL
      }RemoteEntry_UploadForMultiple.js`,
      /*
       Remote_Vue_UploadForSingle: `Remote_UploadForSingle@${
       isProduction
       ? `#auto#${ process.env.RemoteUploadForSingleURL }`
       : process.env.RemoteUploadForSingleURL
       }RemoteEntry_UploadForSingle.js`,
       */
    },
    /**
     * 远端模块提供者所要导出的各个模块。<br />
     * 1、确保所有键名都以'./'开头的。<br />
     * 例如：<br />
     * <code>
     * exposes: {
     *   './button': './src/components/button.vue',
     * }
     * </code>
     */
    /*
     exposes: [
     {
     './UploadForSingle': {
     import: [
     './src/components/UploadForSingle.Vue3.ts.vue',
     ],
     // 外露模块的自定义块名称，可选。
     // name: '',
     },
     './UploadForMultiple': {
     import: [
     './src/components/UploadForMultiple.Vue3.ts.vue',
     ],
     // 外露模块的自定义块名称，可选。
     // name: '',
     },
     },
     ],
     */
    shared: {
      vue: {
        /**
         * 应提供给共享作用域的模块。如果在共享作用域中找不到共享模块或版本无效，也可作为后备模块。默认为属性名称。<br />
         * 1、值类型为：false、string。<br />
         */
        import: 'vue',
        /**
         * 软件包名称，用于从描述文件中确定所需的版本。只有在无法从请求中自动确定软件包名称时才需要这样做。<br />
         * 2、值类型：string。<br />
         */
        packageName: 'vue',
        /**
         * 所提供模块的版本。将替换较低的匹配版本，但不会替换更高的版本。默认情况下，webpack使用依赖项的package.json文件中的版本。<br />
         * 1、值类型为：false、string。<br />
         */
        version: GetVersion4NPMPackageName2PackageJson( 'vue' ),
        /**
         * 此字段指定软件包所需的版本。值类型为：false、string。<br />
         * 1、它接受语义版本控制，例如："^1.2.3"。<br />
         * 2、此外，如果版本以URL形式提供，它会检索版本，例如："git+ssh://git@github.com:foo/bar.git#v1.0.0"。<br />
         * 3、所需的版本，可以是一个版本范围。默认值是当前应用程序的依赖关系版本。<br />
         * 4、当使用共享依赖关系时，它会检查依赖关系版本是否大于或等于requiredVersion。如果大于或等于，将正常使用。如果小于requiredVersion，控制台将发出警告，并将使用共享依赖项中可用的最小版本。<br />
         * 5、当一方设置了requiredVersion，另一方设置了singleton时，将加载具有requiredVersion的依赖项，singleton方将直接使用具有requiredVersion的依赖项，而不管其版本如何。<br />
         */
        requiredVersion: GetVersion4NPMPackageName2PackageJson( 'vue' ),
        /**
         * 在共享范围内只允许共享模块的一个版本（默认已禁用）。值类型为：boolean。<br />
         * 1、是否只允许在共享范围内使用一个版本的共享模块（单机模式）。如果设置为true，则启用单机模式；如果设置为false，则不启用单机模式。<br />
         * 2、如果启用单机模式，远程应用程序组件和主机应用程序之间的共享依赖项将只加载一次，如果版本不一致，将加载更高的版本。<br />
         * 3、如果未启用单机模式，且远程应用程序和主机应用程序之间的共享依赖项版本不同，则将分别加载各自的依赖项。<br />
         * 4、某些库使用全局内部状态（如：react、react-dom）。如果共享作用域中的同一依赖关系有多个版本，则使用语义最高的版本。<br />
         */
        singleton: true,
        /**
         * 此提示允许webpack在版本无效时拒绝共享模块（当本地回退模块可用且共享模块不是单例时，默认为true；否则为false；如果没有指定所需的版本，则此提示无效）。如果找不到所需的版本，则会抛出运行时错误。<br />
         * 1、值类型为：boolean。<br />
         */
        strictVersion: true,
        /**
         * 将eager设为true会将共享的依赖关系打包到入口文件中，这可能会导致入口文件较大。请谨慎使用。值类型：boolean。<br />
         * 1、此提示将允许webpack直接包含所提供的模块和回退模块，而不是通过异步请求获取库。换句话说，这允许在初始块中使用该共享模块。此外，需要注意的是，启用此提示后，所有提供的模块和备用模块都会被下载。<br />
         * 2、是否立即加载共享模块。在正常情况下，需要启用lazy entry，然后按需异步加载共享模块。如果想使用共享模块，但又不想启用lazy entry，可以将eager设为true。<br />
         * 3、如果是启用了：experiments: { federationRuntime: 'hoisted', }，该选项就设置为false就行。<br />
         */
        eager: false,
        // shareKey?: string;
        // shareScope?: string;
        // shareStrategy?: 'version-first'(默认) | 'loaded-first';
      },
    },
    /**
     * 表示其是一个远端模块提供者（也叫做：远端模块分享者之类的，当然远端模块提供者也是可以使用（消费）其他的远端模块提供者提供的远端模块）。<br />
     * 1、一般来说，远端模块提供者，不要设置该选项，毕竟上面已经配置了“filename选项”。<br />
     */
    /*
     manifest: {
     /!**
     * 作为“output.path”目录内的相对路径。一般不用设置，默认就直接输出在“output.path”下，跟“webpack_assets_manifest.json”同级目录。<br />
     * 1、如果设置了，那请求路径形如：<br />
     * http://localhost:8101/mf_v2/Remote_UploadForMultiple-manifest.json
     * http://localhost:8101/mf_v2/Remote_UploadForMultiple-manifest-stats.json
     *!/
     filePath: 'mf_v2',
     /!**
     * 同时还会有一个名为：Remote_UploadForMultiple-manifest-stats.json的文件，默认值：mf-manifest.json（同样还会有一个：mf-manifest-stats.json）。<br />
     * 1、如果设置了，那请求路径形如：<br />
     * http://localhost:8101/Remote_UploadForMultiple-manifest.json
     * http://localhost:8101/Remote_UploadForMultiple-manifest-stats.json
     *!/
     fileName: 'Remote_UploadForMultiple-manifest.json',
     // additionalData( options ){},
     /!**
     * 值类型为boolean，默认值为undefined，非必要！<br />
     * 1、不建议设置此配置。设置后，预加载功能将被禁用！<br />
     * 2、在复杂项目中分析资产可能需要很长时间。如果将此选项设置为true，资产分析将被禁用，从而优化构建时间。<br />
     * 3、如果项目纯粹面向消费者，则在开发过程中默认设置为true。<br />
     * 4、如果设置为"true"，清单中将不会出现shared和exposes字段，远程中也不会出现assets。<br />
     *!/
     // disableAssetsAnalyze: undefined,
     },
     */
    experiments: {
      /**
       * 启用了该选项，入口文件就不用再用异步请求包装（如：import('./bootstrap.js')）了，上面的“eager选项”也不用设置为true了。
       */
      federationRuntime: 'hoisted',
    },
    /**
     * 开发模式、生产模式都试了一下！发现没啥效果，只是纯粹的执行所设置的函数，没函数参数，返回值也没被使用！而且还是被立即执行函数包起来执行的！
     * 倒是可以在里面编码修改一些webpack特有的局部变量之类的：
     * <code>
     *   // 直接写死修改webpack的配置“output.publicPath”的值。
     *   __webpack_public_path__ = process.env.PUBLIC_PATH || 'https://localhost:8100/';
     *   // 直接写死修改webpack的配置“output.publicPath”的值。
     *   __webpack_require__.p = process.env.PUBLIC_PATH || 'https://localhost:8100/';
     * </code>
     * 1、值类型：string，可以'function'开头。<br />
     * 注意：node_modules/@module-federation/enhanced/dist/src/lib/container/runtime/RemoteEntryPlugin.js
     * 根据其源码可知，当getPublicPath选项的值是以“function”开头的字符串时，其会被处理为：
     * `(${this._getPublicPath})()`
     * 当不以“function”开头的字符串时，其会被处理为：
     * `${compiler.webpack.RuntimeGlobals.publicPath} = new Function(${JSON.stringify(this._getPublicPath)})()`
     * 其中“compiler.webpack.RuntimeGlobals.publicPath”的值为“__webpack_require__.p”的字符串。
     * 例如：
     * 将“getPublicPath”设置为`return new URL('../mf_v2/upload_for_multiple/',location.href).href`时，
     * 在“业务代码（不是webpack的配置代码）”中可以通过：__webpack_public_path__、__webpack_require__.p这两个直接变量，就可以取到实际运行在浏览器（当前浏览器的URL：http://localhost:8090/web-project-template/dist/test/pages/Upload.html）下的具体URL值了：
     * http://localhost:8090/web-project-template/dist/test/mf_v2/upload_for_multiple/
     */
    // getPublicPath: `function(){}`,
    /**
     * 用于控制模块联盟的开发行为。<br />
     * 1、一般来说，该选项用于远端模块使用者，这样当远端模块提供者发生变化后，远端模块使用者就可以实时热更新、加载远端模块提供者最新的“Type”。<br />
     * 2、当然，远端模块提供者也可以是使用其他远端模块提供者提供的模块，从而也算是远端模块使用者了。<br />
     */
    dev: {
      /*
       该选项跟webpack的顶级配置项devServer的liveReload选项是一样功用的。
       注意：不知道为什么在“远端模块提供者”中，该选项设置成true时，会报“Babel”相关的错误！但是，在“远端模块使用者”中，却是可以设置成true使用。
       */
      disableLiveReload: true,
      disableHotTypesReload: false,
      disableDynamicRemoteTypeHints: false,
    },
    /**
     * 使用场景：用于控制模块联盟生成/消耗类型行为。<br />
     * 1、配置完成后，生产者会在构建过程中自动生成一个压缩类型文件“@mf-types.zip”（默认名称），消费者会自动提取远程的类型文件并解压为“@mf-types”（默认名称）。<br />
     */
    dts: {
      // tsConfigPath: join( __dirname, './tsconfig.webpack.json' ),
      /**
       * 用于控制模块联盟生成类型行为。<br />
       * 1、该选项设置为true时，等同于如下配置：<br />
       * <code>
       *   {
       *     generateAPITypes: true,
       *     abortOnError: false,
       *     extractThirdParty: true,
       *     extractRemoteTypes: true,
       *     compileInChildProcess: true,
       *   }
       * </code>
       */
      /*
       generateTypes: {
       extractRemoteTypes: true,
       extractThirdParty: true,
       generateAPITypes: true,
       compileInChildProcess: true,
       // 在类型生成过程中遇到问题时是否抛出错误，默认值为：false。
       abortOnError: true,
       // dts.generateTypes.tsConfigPath > dts.tsConfigPath
       tsConfigPath: join( __dirname, './tsconfig.webpack.json' ),
       // typesFolder: '@mf-types',
       // deleteTypesFolder: false,
       compilerInstance: 'tsc',
       // compiledTypesFolder: '@mf-types',
       // 附加文件到编译中。
       // additionalFilesToCompile: string[]
       },
       */
      /**
       * 用于控制模块联邦消耗（加载）类型行为。<br />
       * 1、该选项设置为true时，等同于如下配置：<br />
       * <code>
       *   {
       *     abortOnError: false,
       *     consumeAPITypes: true,
       *   }
       * </code>
       */
      consumeTypes: {
        consumeAPITypes: true,
        maxRetries: 3,
        abortOnError: true,
        // typesFolder: '@mf-types',
        // deleteTypesFolder: false,
        // remoteTypesFolder: '@mf-types',
        // runtimePkgs?: string[],
      },
      displayErrorInTerminal: true,
    },
    shareStrategy: 'version-first',
    /**
     * 允许使用自定义插件、第三方插件、“MF v2”自己的生态插件进行扩展处理。<br />
     * 1、个人编写了一个自定义插件（注意，只是扩展了功能，不影响原本的功能）：“./src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts”。<br />
     * 注意：该自定义插件只能在插件构建模式下使用，不能在运行时注册使用该插件！因为其功用是在“beforeInit”函数中定义的，但是该函数是不会在运行时被调用的，只会在插件构建模式下被调用。<br />
     * 其功用是在“beforeInit”函数中，将自定义标识“#auto#”处理为：<br />
     * <code>
     * remote.entry = new URL( remote.entry.split( '#auto#' ).at( -1 ), location.href ).href
     * </code>
     * 自定义标识“#auto#”表示，该“远端模块提供者”的加载地址(也就是JS脚本url)是根据“远端模块使用者”的“origin”、“浏览器页面上的url”等处理成相对“远端模块使用者”url路径的“远端模块提供者”url路径。<br />
     * 使用例如：<br />
     * 在“ModuleFederation_v2_Config.esm.mjs”中有如下设置：<br />
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@${
     *     isProduction
     *     ? `#auto#${ process.env.RemoteUploadForMultipleURL }`
     *     : process.env.RemoteUploadForMultipleURL
     *   }RemoteEntry_UploadForMultiple.js`,
     * },
     * runtimePlugins: [
     *   resolve( __dirname, './src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts' ),
     * ],
     * </code>
     * 在环境变量配置文件（.env.dev）中：<br />
     * <code>
     * RemoteUploadForMultipleURL=https://localhost:8101/dev_server/mf_v2/
     * </code>
     * 在环境变量配置文件（.env.production）中：<br />
     * <code>
     * RemoteUploadForMultipleURL=../mf_v2/upload_for_multiple/mf_v2/
     * </code>
     * 在开发模式（isProduction为false）下，上面的“remotes”实际是如此：<br />
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@https://localhost:8101/dev_server/mf_v2/RemoteEntry_UploadForMultiple.js`,
     * },
     * </code>
     * 在生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@#auto#../mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
     * },
     * </code>
     * 通过自定义插件（注意，只是扩展了功能，不影响原本的功能）处理后，生产模式（isProduction为true）下，上面的“remotes”实际是如此：<br />
     * 假定“远端模块使用者”的浏览器页面url地址是：<br />
     * http://localhost:8090/web-project-template/dist/production/pages/Upload.html
     * <code>
     * remotes: {
     *   RemoteUploadForMultiple: `Remote_UploadForMultiple@http://localhost:8090/web-project-template/dist/production/mf_v2/upload_for_multiple/mf_v2/RemoteEntry_UploadForMultiple.js`,
     * },
     * </code>
     * 这样，原本插件构建模式下的“固定url（这里的“固定”一词是相对运行时可以动态设置远端模块提供者的url）”也就可以做到类似在运行时那样，可以动态设置远端模块提供者的url。<br />
     * 注意！该自定义插件只是扩展了功能，不影响原本的功能。<br />
     */
    runtimePlugins: [
      resolve( __dirname, './src/ModuleFederation_v2_CustomRuntimePlugin.esm.mts' ),
    ],
  };
}

export {
  ModuleFederation_v2_Config_Fun,
};

export default {
  ModuleFederation_v2_Config_Fun,
};
