/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

// process.cwd()输出G:\\WebStormWS\\WebProTpl

'use strict';

let isPro = ( () => process.argv[ process.argv.findIndex( ( c, i, a ) => c === '--mode' ) + 1 ] === 'production' )(),
    os = require( 'os' ),
    toml = require( 'toml' ),
    yaml = require( 'yamljs' ),
    osLen = os.cpus().length,
    /*
     将此装载机放在其他装载机的前面。以下加载程序在工作池中运行。
     在工作池中运行的装载程序受到限制。例子：
     1、加载程序无法发出文件。
     2、加载程序无法使用自定义加载程序API（即通过插件）。
     3、加载程序无法访问webpack选项。
     PS：
     1、只能将此装载机用于昂贵的操作！
     2、每个工作程序都是一个单独的node.js进程，其开销约为600毫秒。进程间通信也有开销。
     */
    threadLoader = require( 'thread-loader' ),
    jsWorkerPool = {
        // 生成的工作进程数，默认为（ os.cpus().length-1 ），fallback to 1 when require('os').cpus() is undefined
        workers: osLen,
        // 一个工人并行处理的作业数默认为20
        workerParallelJobs: 20,
        // 其他的node.js参数
        workerNodeArgs: [
            '--max-old-space-size=1024',
        ],
        // 允许重新生成一个已死亡的工人池，重新生成会减慢整个编译速度，并且应设置为false以进行开发
        poolRespawn: false,
        /*
         空闲默认值为500（ms）时终止工作进程的超时，可以设置为无穷大，以便监视生成以保持工作进程的活动性
         Infinity：可用于开发模式
         600000ms也就是10分钟
         */
        poolTimeout: isPro
                     ? 1000
                     : Infinity,
        // 投票分配给工人的工作岗位数量默认为200个，分配效率较低但更公平
        poolParallelJobs: 50,
        // 池的名称可用于创建其他具有相同选项的不同池
        name: 'jsWorkerPool',
    };

threadLoader.warmup( jsWorkerPool, [
    'babel-loader',
] );

let fs = require( 'fs' ),
    path = require( 'path' ),
    // 直到20200908，只支持的列表如下！！！
    compilerOptions4lib_arrC = [
        'dom',
        'dom.iterable',
        'es2015',
        'es2015.collection',
        'es2015.core',
        'es2015.generator',
        'es2015.iterable',
        'es2015.promise',
        'es2015.proxy',
        'es2015.reflect',
        'es2015.symbol',
        'es2015.symbol.wellknown',
        'es2016',
        'es2016.array.include',
        'es2017',
        'es2017.intl',
        'es2017.object',
        'es2017.sharedmemory',
        'es2017.string',
        'es2017.typedarrays',
        'es2018',
        'es2018.asyncgenerator',
        'es2018.asynciterable',
        'es2018.intl',
        'es2018.promise',
        'es2018.regexp',
        'es2019',
        'es2019.array',
        'es2019.object',
        'es2019.string',
        'es2019.symbol',
        'es2020',
        'es2020.bigint',
        'es2020.intl',
        'es2020.promise',
        'es2020.string',
        'es2020.symbol.wellknown',
        'es5',
        'es6',
        'es7',
        'esnext',
        'esnext.array',
        'esnext.asynciterable',
        'esnext.bigint',
        'esnext.intl',
        'esnext.promise',
        'esnext.string',
        'esnext.symbol',
        'scripthost',
        'webworker',
        'webworker.importscripts'
    ],
    compilerOptions_obj = {
        // Project Options Start

        /*
         告诉TypeScript将上次编译的项目图信息保存到存储在磁盘上的文件中。这将在编译输出所在的文件夹中创建一系列.tsbuildinfo文件。
         它们在运行时不被JavaScript使用，可以安全地删除。
         */
        'incremental': true,
        'tsBuildInfoFile': './test/TSBuildInfo.tsbuildinfo',
        /*
         ES3、ES5、ES6、ES2015、ES7、ES2016、ES2017(Node 8)、ES2018(Node 10)、ES2019(Node 12)、ES2020、ESNext
         Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'
         */
        'target': 'ES2020',
        /*
         CommonJS(default if target is ES3 or ES5)、ES6、ES2015、ES2020、None、UMD、AMD、System、ESNext
         Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'.
         */
        'module': 'es2020',
        // 如(全是小写字母！！！)：[ 'es6', 'es2015' ]，直到20200908，只支持的列表如下！！！
        'lib': compilerOptions4lib_arrC,
        // true时，可以在.ts中导入.js；但是，false时，这么干，会报错！
        'allowJs': false,
        // true时，当把.js文件导入到.ts文件中时，如果.js文件中有错，将报告错误，这相当于在项目中包含的所有JavaScript文件的顶部包含"// @ts-check"。
        'checkJs': false,
        /*
         控制如何在JavaScript文件中发出JSX构造。这仅影响以.tsx文件开头的JS文件的输出。
         preserve: 在不更改JSX的情况下发出.jsx文件
         react: 使用JSX发出.js文件已更改为等效的React.createElement调用
         react-native: 在JSX不变的情况下发出.js文件
         */
        'jsx': 'react',
        /*
         为项目中的每个TypeScript或JavaScript文件生成.d.ts文件。这些.d.ts文件是描述模块外部API的类型定义文件。
         对于.d.ts文件，TypeScript之类的工具可以为未键入的代码提供智能感知和准确的类型。
         PS: 在为JavaScript文件使用“.d.ts”文件时，可能需要使用“emitDeclarationOnly”或“outDir”来确保JavaScript文件不会被覆盖。
         */
        'declaration': true,
        /*
         为映射回原始“.ts”源文件的“.d.ts”文件生成源映射。这将允许像VS代码这样的编辑器在使用像go to Definition这样的功能时转到原始的“.ts”文件。
         如果您使用的是项目参考，则应强烈考虑启用此功能。
         */
        'declarationMap': true,
        'sourceMap': false,
        'composite': true,
        // 转换为JavaScript时，剥离TypeScript文件中的所有注释。默认为false。
        'removeComments': true,
        'noEmit': false,
        // 属于“有助于调试的标志”！！！
        'importHelpers': true,
        'downlevelIteration': true,
        /*
         如果设置了isolatedModules，则所有实现文件都必须是模块（这意味着它具有某种形式的导入/导出）。如果任何文件不是模块，则会发生错误(此限制不适用于.d.ts文件)
         这些限制可能会导致某些类型脚本功能（如常量枚举和命名空间）出现运行时问题。
         设置isolatedModules标志会告诉TypeScript，如果您编写的某些代码无法由单个文件转换过程正确解释，则会发出警告。
         它不会更改代码的行为，也不会更改TypeScript检查和发出进程的行为。
         */
        'isolatedModules': false,

        // Project Options End

        // Strict Checks Start

        'strict': true,
        // 在隐式任何类型的表达式和声明上引发错误。
        'noImplicitAny': true,
        /*
         在严格的null检查模式下，null和undefined值不在每种类型的域中，并且只能分配给它们自己和任何值（一个例外是undefined也可以分配给void）。
         当strictNullChecks为true时，null和undefined有各自不同的类型，如果在需要具体值的地方尝试使用它们，则会出现类型错误。
         */
        'strictNullChecks': true,
        // 在开发此功能期间，我们发现了大量固有的不安全类层次结构，包括DOM中的某些层次结构。因此，该设置仅适用于以函数语法编写的函数，而不适用于以方法语法编写的函数
        'strictFunctionTypes': true,
        // 设置后，TypeScript将检查是否为基础函数使用正确的参数调用了函数的内置方法call，bind和apply：
        'strictBindCallApply': true,
        // 设置为true时，当声明了类属性但未在构造函数中设置ClassType时，TypeScript将引发错误。
        'strictPropertyInitialization': true,
        // 使用隐式任何类型引发此表达式上的错误。
        'noImplicitThis': true,
        // 确保以ECMAScript严格模式解析文件，并为每个源文件发出"use strict"信息。
        'alwaysStrict': true,

        // Strict Checks End

        // Module Resolution Start

        'baseUrl': './',
        // 就跟Webpack里的resolve.alias一样
        'paths': {
            'echarts': [
                'node_modules/echarts/dist/echarts.min.js'
            ],
            'ELEMENTCSS': [
                'node_modules/element-ui/lib/theme-chalk/index.css'
            ],
            'ELEMENT': [
                'node_modules/element-ui/lib/index.js'
            ],
            'jQuery': [
                'node_modules/jquery/dist/jquery.min.js'
            ],
            '$': [
                'node_modules/jquery/dist/jquery.min.js'
            ],
            'SwiperCSS': [
                'node_modules/swiper/swiper-bundle.min.css'
            ],
            'Swiper': [
                'node_modules/swiper/swiper-bundle.min.js'
            ],
            'Vue': [
                'node_modules/vue/dist/vue.min.js'
            ],
            'VueRouter': [
                'node_modules/vue-router/dist/vue-router.min.js'
            ],
            'Vuex': [
                'node_modules/vuex/dist/vuex.min.js'
            ],
            'tslib': [
                'node_modules/tslib/tslib.es6.js'
            ],
            'CompESM': [
                'src/components/Components.esm.js'
            ],
            'CTESM': [
                'src/js/tools/CurrencyTools.esm.js'
            ],
            'DecESM': [
                'src/js/tools/Decorator4ES6.esm.js'
            ],
            'HTML2C4ESM': [
                'src/js/tools/HTML2Canvas.esm.js'
            ],
            'WebCESM': [
                'src/js/tools/WebComponents.esm.js'
            ],
            'WorkersESM': [
                'src/js/tools/Workers4MT.esm.js'
            ],
            'configDir/*': [
                'configures/*'
            ],
            'jsonDir/*': [
                'src/assets/doc/json/*'
            ],
            'json5Dir/*': [
                'src/assets/doc/json5/*'
            ],
            'txtDir/*': [
                'src/assets/doc/txt/*'
            ],
            'xmlDir/*': [
                'src/assets/doc/xml/*'
            ],
            'fontsDir/*': [
                'src/assets/fonts/*'
            ],
            'imgDir/*': [
                'src/assets/img/*'
            ],
            'musicDir/*': [
                'src/assets/music/*'
            ],
            'videosDir/*': [
                'src/assets/videos/*'
            ],
            'compDir/*': [
                'src/components/*'
            ],
            'gQLAPIDir/*': [
                'src/graphQL/api/*'
            ],
            'jsDir/*': [
                'src/js/*'
            ],
            'jsMDir/*': [
                'src/js/modules/*'
            ],
            'jsPDir/*': [
                'src/js/pages/*'
            ],
            'jsPubDir/*': [
                'src/js/public/*'
            ],
            'jsTDir/*': [
                'src/js/tools/*'
            ],
            'manifestDir/*': [
                'src/pwa4Manifest/*'
            ],
            'cssDir/*': [
                'src/styles/css/*'
            ],
            'cssBDir/*': [
                'src/styles/css/basic/*'
            ],
            'cssMDir/*': [
                'src/styles/css/modules/*'
            ],
            'cssPDir/*': [
                'src/styles/css/pages/*'
            ],
            'cssPubDir/*': [
                'src/styles/css/public/*'
            ],
            'lessDir/*': [
                'src/styles/less/*'
            ],
            'lessBDir/*': [
                'src/styles/less/basic/*'
            ],
            'lessMDir/*': [
                'src/styles/less/modules/*'
            ],
            'lessPDir/*': [
                'src/styles/less/pages/*'
            ],
            'lessPubDir/*': [
                'src/styles/less/public/*'
            ],
            'pcssDir/*': [
                'src/styles/postcss/*'
            ],
            'pcssBDir/*': [
                'src/styles/postcss/basic/*'
            ],
            'pcssMDir/*': [
                'src/styles/postcss/modules/*'
            ],
            'pcssPDir/*': [
                'src/styles/postcss/pages/*'
            ],
            'pcssPubDir/*': [
                'src/styles/postcss/public/*'
            ],
            'sassDir/*': [
                'src/styles/sass/*'
            ],
            'sassBDir/*': [
                'src/styles/sass/basic/*'
            ],
            'sassMDir/*': [
                'src/styles/sass/modules/*'
            ],
            'sassPDir/*': [
                'src/styles/sass/pages/*'
            ],
            'sassPubDir/*': [
                'src/styles/sass/public/*'
            ],
            'scssDir/*': [
                'src/styles/scss/*'
            ],
            'scssBDir/*': [
                'src/styles/scss/basic/*'
            ],
            'scssMDir/*': [
                'src/styles/scss/modules/*'
            ],
            'scssPDir/*': [
                'src/styles/scss/pages/*'
            ],
            'scssPubDir/*': [
                'src/styles/scss/public/*'
            ],
            'stylDir/*': [
                'src/styles/stylus/*'
            ],
            'stylBDir/*': [
                'src/styles/stylus/basic/*'
            ],
            'stylMDir/*': [
                'src/styles/stylus/modules/*'
            ],
            'stylPDir/*': [
                'src/styles/stylus/pages/*'
            ],
            'stylPubDir/*': [
                'src/styles/stylus/public/*'
            ],
            'tplEJSDir/*': [
                'src/tplEJS/*'
            ],
            'tplEJSBDir/*': [
                'src/tplEJS/basic/*'
            ],
            'tplEJSMLDir/*': [
                'src/tplEJS/basic/metaLink/*'
            ],
            'tplEJSMDir/*': [
                'src/tplEJS/modules/*'
            ],
            'tplEJSPDir/*': [
                'src/tplEJS/pages/*'
            ],
            'tplEJSPubDir/*': [
                'src/tplEJS/public/*'
            ],
            'tplHTMLDir/*': [
                'src/tplHTML/*'
            ],
            'tplHTMLBDir/*': [
                'src/tplHTML/basic/*'
            ],
            'tplHTMLMDir/*': [
                'src/tplHTML/modules/*'
            ],
            'tplHTMLPDir/*': [
                'src/tplHTML/pages/*'
            ],
            'tplHTMLPubDir/*': [
                'src/tplHTML/public/*'
            ],
            'vueDir/*': [
                'src/vue/*'
            ],
            'vueCompDir/*': [
                'src/vue/components/*'
            ],
            'vueMDir/*': [
                'src/vue/models/*'
            ],
            'vueRDir/*': [
                'src/vue/routers/*'
            ],
            'vueSDir/*': [
                'src/vue/stores/*'
            ],
            'vueStyDir/*': [
                'src/vue/styles/*'
            ],
            'vueVDir/*': [
                'src/vue/views/*'
            ],
            'wasmDir/*': [
                'src/wasm/*'
            ],
            'wasmBDir/*': [
                'src/wasm/basic/*'
            ],
            'wasmMDir/*': [
                'src/wasm/modules/*'
            ],
            'wasmPDir/*': [
                'src/wasm/pages/*'
            ],
            'wasmPubDir/*': [
                'src/wasm/public/*'
            ],
            'webCDir/*': [
                'src/webComponents/*'
            ],
            'serviceWorkersDir/*': [
                'src/workers/serviceWorkers/*'
            ],
            'sWorkersDir/*': [
                'src/workers/sharedWorkers/*'
            ],
            'tWorkersDir/*': [
                'src/workers/tools/*'
            ],
            'wWorkersDir/*': [
                'src/workers/webWorkers/*'
            ]
        },
        'typeRoots': [
            'node_modules/@types'
        ],
        // 空数组将禁用自动引入 @types 包
        'types': [],
        'allowSyntheticDefaultImports': true,
        // 通过为所有导入创建名称空间对象，启用CommonJS和ES模块之间的发射互操作性。
        'esModuleInterop': true,
        /*
         这是为了在Node.js中反映相同的标志；它不解析符号链接的实际路径。
         此标志还显示与Webpack的resolve.symlinks选项相反的行为（即将TypeScript的preserveSymlinks设置为true与将Webpack的resolve.symlinks设置为false并行，反之亦然）。
         启用此选项后，对模块和包的引用（例如imports和/// <reference type="..." />指令）都是相对于符号链接文件的位置解析的，而不是相对于符号链接解析到的路径解析的。
         */
        'preserveSymlinks': false,
        /*
         当设置为true时，allowumddglobalaccess允许您从模块文件内部以全局方式访问UMD导出。模块文件是具有导入和/或导出的文件。
         如果没有这个标志，使用UMD模块的导出需要一个导入声明。
         此标志的一个示例用例是一个web项目，在该项目中，您知道特定库（如jQuery或Lodash）在运行时始终可用，但不能通过导入访问它。
         */
        'allowUmdGlobalAccess': true,

        // Module Resolution End

        // Source Maps Start

        'mapRoot': './test/',
        // 设置后，TypeScript将在.js文件中嵌入源映射内容，而不是写出.js.map文件来提供源映射。尽管这会产生更大的JS文件，但在某些情况下，这是很方便的。例如，您可能希望在不允许提供.map文件的Web服务器上调试JS文件。
        'inlineSourceMap': false,
        // 设置后，TypeScript将把.ts文件的原始内容作为嵌入字符串包含在源映射中。在与inlineSourceMap相同的情况下，这通常很有用。需要设置sourceMap或inlineSourceMap。
        'inlineSources': false,

        // Source Maps End

        // Linter Checks Start

        // 报告未使用的局部变量的错误。
        'noUnusedLocals': true,
        // 报告有关函数中未使用参数的错误。
        'noUnusedParameters': true,
        // 启用后，TypeScript将检查函数中的所有代码路径，以确保它们返回值。
        'noImplicitReturns': true,
        // 在switch语句中报告失败情况的错误。确保switch语句中的任何非空情况都包括break或return。这意味着您不会意外附带案例失败漏洞。
        'noFallthroughCasesInSwitch': true,

        // Linter Checks End

        // Experimental Start

        // 在TC39标准化流程的第二阶段，为装饰器启用实验支持。装饰器是一种语言功能，尚未完全批准到JavaScript规范中。这意味着TypeScript中的实现版本可能与TC39决定的JavaScript中的实现版本有所不同。
        'experimentalDecorators': true,
        // 为与装饰器反射元数据模块一起使用的装饰器的发射类型元数据启用实验性支持。
        'emitDecoratorMetadata': true,

        // Experimental End

        // Advanced Start

        // 属于“有助于调试的标志”！！！打印文件名称的一部分。当您不确定TypeScript是否包含所需的文件时，此功能很有用。
        'listFiles': false,
        /*
         属于“有助于调试的标志”！！！
         将编译的一部分生成文件的名称打印到终端。
         该标志在两种情况下很有用：
         1、您想将TypeScript转换为终端中构建链的一部分，该终端在下一条命令中处理文件名。
         2、您不确定TypeScript是否包含了所需的文件，这是调试文件包含设置的一部分。
         */
        'listEmittedFiles': false,
        // 属于“有助于调试的标志”！！！当您尝试调试未包含模块的原因时。您可以将traceResolutions设置为true，以使TypeScript打印有关每个已处理文件的解析过程的信息。
        'traceResolution': false,
        // 属于“有助于调试的标志”！！！不推荐使用
        // 'diagnostics': true,
        /*
         属于“有助于调试的标志”！！！
         您可以使用此标志来发现TypeScript在编译时花费的时间。这是一个用于了解代码库整体性能特征的工具。
         */
        'extendedDiagnostics': true,
        /*
         属于“有助于调试的标志”！！！
         启用此选项后，TypeScript将避免重新检查/重新生成所有真正可能受影响的文件，并且只重新检查/重新生成已更改的文件以及直接导入它们的文件。
         这可以被认为是监视算法的“快速和松散”实现，它可以大大减少增量重建时间，但代价是必须偶尔运行完整的构建以获取所有编译器错误消息。
         */
        'assumeChangesOnlyAffectDirectDependencies': true,
        /*
         属于“有助于调试的标志”！！！
         只发出.d.ts文件；不发出.js文件。 此设置在两种情况下很有用：
         1、您正在使用TypeScript以外的其他编译器来生成JavaScript。
         2、您正在使用TypeScript仅为使用者生成d.ts文件。
         */
        'emitDeclarationOnly': false,
        /*
         属于“有助于调试的标志”！！！
         此标志控制导入的工作方式，共有3种不同的选项：
         该标志起作用是因为您可以使用导入类型来显式创建一个导入语句，该语句永远不会发送到JavaScript中。
         remove 删除仅引用类型的导入语句的默认行为。
         preserve 保留所有从不使用值或类型的导入语句。这可能导致保留导入/副作用。
         error 这将保留所有导入（与preserve选项相同），但当值导入仅用作类型时将出错。如果希望确保没有意外导入值，但仍使副作用导入显式化，则这可能很有用。
         优先设置成“remove”，但是fork-ts-checker-webpack-plugin插件建议设置成“preserve”，如果TypeScript >= 3.8.0的话！！！
         */
        'importsNotUsedAsValues': 'preserve',
        /*
         属于“有助于调试的标志”！！！
         编译JSX Elements时，更改.js文件中调用的函数。最常见的更改是使用“ h”或“ preact.h”，而不是默认的“ React.createElement”（如果使用preact）。
         该属性不能和“reactNamespace”一起使用！
         */
        'jsxFactory': 'h',
        // 说是识别不到这个编译选项，因为TS 4.0才开始启动的
        'jsxFragmentFactory': 'Fragment',
        /*
         属于“有助于调试的标志”！！！
         允许导入扩展名为“ .json”的模块，这是节点项目中的常见做法。这包括基于静态JSON形状为导入生成类型。
         */
        'resolveJsonModule': true,
        // 不推荐使用
        // 'charset': 'utf8',
        'emitBOM': false,
        'newLine': 'crlf',
        // 不推荐使用
        // 'noErrorTruncation': true,
        // 禁用自动包含任何库文件。如果设置此选项，则忽略lib。
        'noLib': false,
        /*
         默认情况下，TypeScript将检查导入和引用指令的初始文件集，并将这些解析文件添加到程序中。
         如果设置了noResolve，则不会发生此过程。但是，仍然会检查import语句以查看它们是否解析为有效模块，因此您需要确保通过其他方法满足这一要求。
         */
        'noResolve': false,
        /*
         不要为JSDoc注释中包含@internal注释的代码发出声明。这是一个内部编译器选项；请自行承担使用风险，因为编译器不会检查结果是否有效。
         如果您正在搜索一个工具来处理d.ts文件中的其他可见性级别，请查看api提取器。
         @internal
         */
        'stripInternal': true,
        // 为避免在处理非常大的JavaScript项目时可能出现的内存膨胀问题，TypeScript将分配的内存量有上限。开启此标志将删除限制。
        'disableSizeLimit': true,
        /*
         禁用项目引用重定向的源
         在处理复合TypeScript项目时，此选项提供了一种方法，可返回到3.7之前的行为，其中d.ts文件用作模块之间的边界。在3.7中，真理的源头就是您的TypeScript文件。
         */
        'disableSourceOfProjectReferenceRedirect': true,
        /*
         禁用解决方案搜索
         使用复合类型脚本项目时，此选项提供了一种方法，用于声明在编辑器中使用“查找所有引用”或“跳转到定义”等功能时不希望包含项目。
         这个标志可以用来提高大型复合项目的响应性。
         */
        'disableSolutionSearching': true,
        'noImplicitUseStrict': false,
        'noEmitHelpers': false,
        /*
         如果报告了任何错误，请不要发出编译器输出文件，如JavaScript源代码、源映射或声明。
         这默认为false，使在类似于监视的环境中使用TypeScript更容易，在这种环境中，在确保解决所有错误之前，您可能希望在另一个环境中查看代码更改的结果。
         */
        'noEmitOnError': true,
        /*
         不要在生成的代码中擦除const枚举声明。 const枚举提供一种方法，该方法通过发出枚举值（而不是引用）来减少应用程序在运行时的总体内存占用。
         const枚举的默认行为是将任何Album.Something转换为相应的数字文字，并从JavaScript中完全删除对该枚举的引用。
         将preserveConstEnums设置为true时，枚举在运行时存在并且仍会发出数字。
         这实质上使此类const枚举仅具有源代码功能，而没有运行时跟踪。
         */
        'preserveConstEnums': true,
        'declarationDir': './test/',
        // 跳过默认库声明文件的类型检查。
        'skipLibCheck': true,
        // 改用如上选项，本选项算是弃用了。
        // 'skipDefaultLibCheck': true,
        /*
         设置为false可禁用有关未使用标签的警告。 标签在JavaScript中很少见，通常表示尝试编写对象文字：
         false，会启用无法访问到的代码的错误检查；true，表示关闭这种检查。
         */
        'allowUnusedLabels': false,
        /*
         设置为false可禁用有关无法访问代码的警告。这些警告仅与由于使用JavaScript语法而无法访问的代码有关
         这不会影响基于类型分析似乎无法到达的基于代码的错误。false，会启用无法访问到的代码的错误检查；true，表示关闭这种检查。
         */
        'allowUnreachableCode': true,
        /*
         true将禁用报告多余的属性错误
         添加此标志是为了帮助人们迁移到TypeScript 1.6中对新对象文字进行更严格的检查。
         我们不建议在现代代码库中使用此标志，您可以使用'// @ts-ignore'抑制一次性需要的情况。
         */
        'suppressExcessPropertyErrors': false,
        /*
         启用“suppressImplicitAnyIndexErrors”将禁止在索引到对象时报告有关隐式Any的错误
         使用suppressImplicitAnyIndexErrors是一种非常严格的方法。建议使用'// @ts-ignore'注释代替
         */
        'suppressImplicitAnyIndexErrors': false,
        // 设置此选项后，如果程序试图通过与磁盘上的大小写不同的大小写来包含文件，则TypeScript将发出错误。
        'forceConsistentCasingInFileNames': true,
        /*
         在节点模块下搜索和加载JavaScript文件的最大依赖深度。
         此标志只能在启用allowJs时使用，如果要在节点模块中为所有JavaScript设置TypeScript推断类型，则使用此标志。
         理想情况下，该值应保持在0（默认值），并且应使用d.ts文件显式定义模块的形状。但是，在某些情况下，您可能希望以牺牲速度和潜在准确性为代价来启用此功能。
         */
        'maxNodeModuleJsDepth': 0,
        // 比较两个通用函数时，TypeScript将统一类型参数。
        'noStrictGenericChecks': false,
        /*
         此标志用作迁移到即将到来的类字段标准版本的一部分。TypeScript在TC39中被认可之前引入了类字段很多年。
         即将发布的规范的最新版本与TypeScript的实现具有不同的运行时行为，但语法相同。
         此标志将切换到即将到来的ECMA运行时行为。
         */
        'useDefineForClassFields': true,
        // 不推荐使用
        // 'keyofStringsOnly': true,

        // Advanced End

        // Command Line Start

        // 是否将过时的控制台输出保持在监视模式下，而不是每次发生更改时都清除屏幕。true，保留
        'preserveWatchOutput': false,
        // 使用颜色和上下文对错误和消息进行样式化，默认情况下处于启用状态-使您有机会从编译器中获得较少的简洁单色消息。
        'pretty': true,

        // Command Line End

        // 这些只存在于命令行的启动命令参数中 Start
        // (命令参数的使用，如：tsc --project ./tsconfig.json src/*.ts)

        // --watch、-w
        'watch': true,

        // 这些只存在于命令行的启动命令参数中 End

        'listFilesOnly': false,
        'moduleResolution': 'node',
        'outDir': './test/',
        'rootDir': './',
        // 该属性不能和“jsxFactory”一起使用！
        // 'reactNamespace': 'React',
        'disableReferencedProjectLoad': false,
    },
    browsers_arr = [
        /*
         '> 1%',
         'last 3 major versions',
         'last 3 versions',
         'not ie < 9',
         'not ie_mob < 9',
         'not dead',
         */

        /*
         'since 2015-01-01',

         // Safari 10是首先完全支持ES6的浏览器(2016年7月)
         'iOS >= 10',
         'Safari >= 10',

         // Edge 14是首先完全支持ES6的浏览器(2016年8月)
         'Edge >= 14',

         // 开始支持ES6的时间点(2018年8月)
         'Opera >= 55',
         'OperaMobile >= 55',

         // 开始支持ES6的时间点(2017年1月)
         'Chrome >= 58',
         'Android >= 58',
         'ChromeAndroid >= 58',

         // 开始支持ES6的时间点(2017年3月)
         'Firefox >= 54',
         'FirefoxAndroid >= 54',
         // 'Firefox ESR',
         //
         // 'Node >= 10',
         //
         // 'last 2 BlackBerry major versions',
         // 'last 2 Electron major versions',
         // 'last 2 OperaMini major versions',
         // 'last 2 QQAndroid major versions',
         // 'last 2 Samsung major versions',
         // 'last 2 UCAndroid major versions',
         // 'last 2 kaios major versions',
         //
         // 'not ie <= 11',
         // 'not ie_mob <= 11',
         */

        // 以下只是用于自己设备上的浏览器
        /*
         'iOS >= 14',
         'Safari >= 14',

         'Edge >= 86',

         'Opera >= 72',
         'OperaMobile >= 72',

         'Chrome >= 86',
         'Android >= 86',
         'ChromeAndroid >= 86',

         'Firefox >= 82',
         'FirefoxAndroid >= 82',
         */

        // 专门在最新稳定版本的谷歌浏览器上测试用
        'Chrome >= 86',
    ],
    postCSSLoader_fun = isPro => ( {
        loader: 'postcss-loader',
        options: {
            execute: false,
            sourceMap: false,
            postcssOptions: {
                // 加了值为“sugarss”的会导致语法错误，因为“sugarss”是一种缩进语法！！！sugarss是基于缩进的语法，例如Sass或Stylus。
                // parser: require( 'sugarss' ),
                // stringifier: require( 'sugarss' ),
                syntax: require( 'postcss-syntax' )( {
                                                         /*
                                                          rules: [
                                                          {
                                                          test: /\.(?:[sx]?html?|[sx]ht|vue|ux|php)$/i,
                                                          extract: 'html',
                                                          },
                                                          {
                                                          test: /\.(?:markdown|md)$/i,
                                                          extract: 'markdown',
                                                          },
                                                          {
                                                          test: /\.(?:[cm]?[jt]sx?|es\d*|pac)$/i,
                                                          extract: 'jsx',
                                                          },
                                                          ],
                                                          */

                                                         css: require( 'postcss-safe-parser' ),
                                                         sass: require( 'postcss-sass' ),
                                                         scss: require( 'postcss-scss' ),
                                                         less: require( 'postcss-less' ),
                                                     } ),

                /*
                 当使用{Function} / require（复杂选项）时，webpack在选项中需要标识符（ident）。
                 ident可以自由命名，只要它是唯一的即可。建议命名（标识：“postcss”）
                 */
                ident: 'postcss',
                plugins: ( () => {
                    let arr = [
                        'postcss-import',
                        [
                            'postcss-preset-env',
                            {
                                /*
                                 没有任何配置选项，PostCSS Preset Env启用第2阶段功能并支持所有浏览器。
                                 阶段可以是0（实验）到4（稳定），也可以是false。将stage设置为false将禁用每个polyfill。仅当您打算专门使用功能选项时，这样做才有用。
                                 */
                                stage: 0,
                                /*
                                 features选项通过ID启用或禁用特定的polyfill。将true传递给特定功能部件ID将启用其polyfill，而将false传递将禁用它。
                                 将对象关联到特定功能部件ID将同时启用和配置它。
                                 没有通过功能明确启用或禁用的任何polyfill由stage选项确定。
                                 */
                                features: {
                                    'custom-properties': {
                                        preserve: true,
                                    },
                                    // CSS嵌套规则
                                    'nesting-rules': true,
                                    'any-link-pseudo-class': {
                                        preserve: true,
                                    },
                                    /*
                                     设置没有值的输入的样式:
                                     input:blank、input[blank]
                                     <input value="" blank>、<input value="This element has a value">
                                     */
                                    'blank-pseudo-class': {
                                        preserve: true,
                                    },
                                    'break-properties': true,
                                    // 不区分大小写的属性，true会启用转换: [data-attr-key = "a" i]--->[data-attr-key = "a" i],[data-attr-key = "A" i]
                                    'case-insensitive-attributes': true,
                                    'color-functional-notation': {
                                        preserve: true,
                                    },
                                    'color-mod-function': {
                                        // 有效值：throw、warn、ignore
                                        unresolved: 'throw',
                                    },
                                    'custom-media-queries': {
                                        preserve: true,
                                    },
                                    'custom-selectors': {
                                        preserve: true,
                                    },
                                    'dir-pseudo-class': {
                                        preserve: true,
                                    },
                                    'double-position-gradients': {
                                        preserve: true,
                                    },
                                    // 'environment-variables': {},
                                    'focus-visible-pseudo-class': {
                                        preserve: true,
                                    },
                                    'focus-within-pseudo-class': {
                                        preserve: true,
                                    },
                                    // PostCSS插件，可将W3C CSS(font variant properties)转换为更兼容的CSS（font-feature-settings）
                                    'font-variant-property': true,
                                    'gap-properties': {
                                        preserve: true,
                                    },
                                    'gray-function': {
                                        preserve: true,
                                    },
                                    'has-pseudo-class': {
                                        preserve: true,
                                    },
                                    'hexadecimal-alpha-notation': {
                                        preserve: true,
                                    },
                                    'image-set-function': {
                                        preserve: true,
                                        // 有效值：warn、throw、ignore
                                        onvalid: 'throw',
                                    },
                                    'lab-function': {
                                        preserve: true,
                                    },
                                    'logical-properties-and-values': {
                                        preserve: true,
                                    },
                                    // PostCSS插件将 :matches() W3C CSS伪类转换为更兼容的CSS（更简单的选择器）
                                    'matches-pseudo-class': {
                                        // 允许您在生成的选择器之间引入换行符。
                                        lineBreak: false,
                                    },
                                    // 编写简单而优美的媒体查询！
                                    'media-query-ranges': true,
                                    'not-pseudo-class': true,
                                    'overflow-property': {
                                        preserve: true,
                                    },
                                    // PostCSS插件，可将自动换行替换为自动换行。可以选择保留两个声明
                                    'overflow-wrap-property': {
                                        // 有效值：copy、replace
                                        method: 'copy',
                                    },
                                    'place-properties': {
                                        preserve: true,
                                    },
                                    'prefers-color-scheme-query': {
                                        preserve: true,
                                    },
                                    // PostCSS插件可将 rebeccapurple color 转换为rgb()
                                    'rebeccapurple-color': {
                                        preserve: true,
                                    },
                                    // 'system-ui-font-family': true,
                                },
                                browsers: browsers_arr,
                                autoprefixer: {
                                    // 如果CSS未压缩，Autoprefixer是否要使用视觉级联，true使用。
                                    cascade: true,
                                    // Autoprefixer是否要添加前缀，true添加。
                                    add: true,
                                    // Autoprefixer是否要删除过时的前缀，false不删除。
                                    remove: false,
                                    // Autoprefixer是否要为"@supports"参数添加前缀，true添加。
                                    supports: true,
                                    /*
                                     Autoprefixer是否要为flexbox属性添加前缀，true添加。
                                     字符串值"no-2009"，则Autoprefixer只会为最终版本和IE 10版本的规范添加前缀。
                                     */
                                    flexbox: true,
                                    /*
                                     有效值：false、"autoplace"、"no-autoplace"，Autoprefixer是否应为Grid Layout属性添加IE 10-11前缀？
                                     false: 防止Autoprefixer输出CSS网格转换。
                                     "autoplace": 启用Autoprefixer网格转换并包括自动放置支持。您还可以在CSS中使用/!* autoprefixer grid: autoplace *!/。
                                     "no-autoplace": 启用Autoprefixer网格转换，但不包括自动放置支持。您还可以在CSS中使用/!* autoprefixer grid: no-autoplace *!/。
                                     不推荐使用true这个布尔值。
                                     */
                                    grid: 'autoplace',
                                    overrideBrowserslist: browsers_arr,
                                    // 不要在Browserslist配置中的未知浏览器版本上引发错误。
                                    ignoreUnknownVersions: false,
                                },
                            }
                        ],
                        [
                            'postcss-calc',
                            {
                                precision: 6,
                                preserve: true,
                                // 当calc()不减少为单个值时添加警告。
                                warnWhenCannotResolve: false,
                                mediaQueries: true,
                                selectors: true,
                            },
                        ],
                        // 必须在postcss-simple-vars和postcss-nested之前设置此插件。
                        [
                            'postcss-mixins',
                            {
                                // 无声，删除未知的mixin，不要抛出错误。默认为false。
                                silent: false,
                            },
                        ],
                        'postcss-easings',
                        'postcss-color-hwb',
                        [
                            'postcss-color-function',
                            {
                                preserveCustomProps: true,
                            },
                        ],
                        'postcss-size',
                        'postcss-brand-colors',
                    ];

                    !isPro && ( arr.push( [
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
                                                      'z-index': '202020202020 !important',
                                                      content: '',
                                                      width: '100% !important',
                                                      height: '100% !important',
                                                      'background-color': 'red !important',
                                                      color: 'white !important',
                                                      'font-size': '14px !important',
                                                      overflow: 'hidden !important',
                                                      'white-space': 'pre-wrap !important',
                                                  },
                                              },
                                          ] ) );
                    isPro && ( arr.push( 'cssnano' ) );

                    return arr;
                } )(),
            },
        },
    } ),
    entry_obj = require( './src/js/App.js' ).pageRoutingManagement_obj,
    output_fun = ( {
                       path,
                       __dirname,
                       proName_str,
                       hashName_str
                   } ) => ( {
        charset: false,
        // 此选项确定非初始块文件的名称。如，那些动态导入的JS文件。
        chunkFilename: `js/[name]_chunk_[${ hashName_str }:6].js`,
        chunkLoading: 'jsonp',
        // 块的格式，默认块的格式包括：'array-push'(web/WebWorker)、'commonjs'(node.js)，但其他格式可能由插件添加。
        chunkFormat: 'array-push',
        crossOriginLoading: 'anonymous',
        filename: `js/[name]_[${ hashName_str }:6].js`,
        hashDigest: 'hex',
        hashDigestLength: 6,
        hashFunction: 'sha512',
        path: path.resolve( __dirname, `./dist/${ proName_str }/` ),
        pathinfo: !isPro,
        /*
         如：编译的资源都输出在dist/production下的各种一级文件夹(里面没有其他文件夹了)下，所以'../'就是向上一级，也就是定位到了根目录(dist/production)下了
         也可以指定绝对路径：'http://localhost:8081/WebProTpl/dist/production/'，一般用于正式生产环境
         */
        publicPath: '../',
        environment: {
            'arrowFunction': true,
            'bigIntLiteral': true,
            'const': true,
            'destructuring': true,
            'dynamicImport': true,
            'forOf': true,
            'module': true,
        },
        /*
         告诉webpack在写入输出文件系统之前检查要发出的文件是否已经存在并且具有相同的内容。
         当磁盘上已经存在具有相同内容的文件时，webpack将不会写入输出文件。
         */
        compareBeforeEmit: true,
        iife: true,
    } ),
    resolve_fun = ( path, __dirname, isPro_boo ) => ( {
        alias: {
            echartsESM: isPro_boo
                        ? 'echarts/dist/echarts.min.js'
                        : 'echarts/dist/echarts.js',
            elementUIESMCSS: 'element-ui/lib/theme-chalk/index.css',
            elementUIESM: 'element-ui/lib/index.js',
            jQueryESM: isPro_boo
                       ? 'jquery/dist/jquery.min.js'
                       : 'jquery/dist/jquery.js',
            swiperESMCSS: isPro_boo
                          ? 'swiper/swiper-bundle.min.css'
                          : 'swiper/swiper-bundle.css',
            swiperESM: isPro_boo
                       ? 'swiper/swiper-bundle.min.js'
                       : 'swiper/swiper-bundle.js',
            vueESM: isPro_boo
                    ? 'vue/dist/vue.min.js'
                    : 'vue/dist/vue.js',
            vueRouterESM: isPro_boo
                          ? 'vue-router/dist/vue-router.min.js'
                          : 'vue-router/dist/vue-router.js',
            vuexESM: isPro_boo
                     ? 'vuex/dist/vuex.min.js'
                     : 'vuex/dist/vuex.js',

            CompESM: path.resolve( __dirname, './src/components/Components.esm.js' ),

            CTESM: path.resolve( __dirname, './src/js/tools/CurrencyTools.esm.js' ),
            DecESM: path.resolve( __dirname, './src/js/tools/Decorator4ES6.esm.js' ),
            HTML2C4ESM: path.resolve( __dirname, './src/js/tools/HTML2Canvas.esm.js' ),
            WebCESM: path.resolve( __dirname, './src/js/tools/WebComponents.esm.js' ),
            WorkersESM: path.resolve( __dirname, './src/js/tools/Workers4MT.esm.js' ),

            configDir: path.resolve( __dirname, './configures/' ),

            jsonDir: path.resolve( __dirname, './src/assets/doc/json/' ),
            json5Dir: path.resolve( __dirname, './src/assets/doc/json5/' ),
            txtDir: path.resolve( __dirname, './src/assets/doc/txt/' ),
            xmlDir: path.resolve( __dirname, './src/assets/doc/xml/' ),
            fontsDir: path.resolve( __dirname, './src/assets/fonts/' ),
            imgDir: path.resolve( __dirname, './src/assets/img/' ),
            musicDir: path.resolve( __dirname, './src/assets/music/' ),
            videosDir: path.resolve( __dirname, './src/assets/videos/' ),

            compDir: path.resolve( __dirname, './src/components/' ),

            // 注意事项去看：notes/关于在JS和TS文件中导入和使用graphql文件时出现的BUG以及注意事项说明.txt
            gQLAPIDir: path.resolve( __dirname, './src/graphQL/api/' ),

            jsDir: path.resolve( __dirname, './src/js/' ),
            jsMDir: path.resolve( __dirname, './src/js/modules/' ),
            jsPDir: path.resolve( __dirname, './src/js/pages/' ),
            jsPubDir: path.resolve( __dirname, './src/js/public/' ),
            jsTDir: path.resolve( __dirname, './src/js/tools/' ),

            manifestDir: path.resolve( __dirname, './src/pwa4Manifest/' ),

            cssDir: path.resolve( __dirname, './src/styles/css/' ),
            cssBDir: path.resolve( __dirname, './src/styles/css/basic/' ),
            cssMDir: path.resolve( __dirname, './src/styles/css/modules/' ),
            cssPDir: path.resolve( __dirname, './src/styles/css/pages/' ),
            cssPubDir: path.resolve( __dirname, './src/styles/css/public/' ),

            lessDir: path.resolve( __dirname, './src/styles/less/' ),
            lessBDir: path.resolve( __dirname, './src/styles/less/basic/' ),
            lessMDir: path.resolve( __dirname, './src/styles/less/modules/' ),
            lessPDir: path.resolve( __dirname, './src/styles/less/pages/' ),
            lessPubDir: path.resolve( __dirname, './src/styles/less/public/' ),

            sassDir: path.resolve( __dirname, './src/styles/sass/' ),
            sassBDir: path.resolve( __dirname, './src/styles/sass/basic/' ),
            sassMDir: path.resolve( __dirname, './src/styles/sass/modules/' ),
            sassPDir: path.resolve( __dirname, './src/styles/sass/pages/' ),
            sassPubDir: path.resolve( __dirname, './src/styles/sass/public/' ),

            scssDir: path.resolve( __dirname, './src/styles/scss/' ),
            scssBDir: path.resolve( __dirname, './src/styles/scss/basic/' ),
            scssMDir: path.resolve( __dirname, './src/styles/scss/modules/' ),
            scssPDir: path.resolve( __dirname, './src/styles/scss/pages/' ),
            scssPubDir: path.resolve( __dirname, './src/styles/scss/public/' ),

            pcssDir: path.resolve( __dirname, './src/styles/postcss/' ),
            pcssBDir: path.resolve( __dirname, './src/styles/postcss/basic/' ),
            pcssMDir: path.resolve( __dirname, './src/styles/postcss/modules/' ),
            pcssPDir: path.resolve( __dirname, './src/styles/postcss/pages/' ),
            pcssPubDir: path.resolve( __dirname, './src/styles/postcss/public/' ),

            stylDir: path.resolve( __dirname, './src/styles/stylus/' ),
            stylBDir: path.resolve( __dirname, './src/styles/stylus/basic/' ),
            stylMDir: path.resolve( __dirname, './src/styles/stylus/modules/' ),
            stylPDir: path.resolve( __dirname, './src/styles/stylus/pages/' ),
            stylPubDir: path.resolve( __dirname, './src/styles/stylus/public/' ),

            tplEJSDir: path.resolve( __dirname, './src/tplEJS/' ),
            tplEJSBDir: path.resolve( __dirname, './src/tplEJS/basic/' ),
            tplEJSMLDir: path.resolve( __dirname, './src/tplEJS/basic/metaLink/' ),
            tplEJSMDir: path.resolve( __dirname, './src/tplEJS/modules/' ),
            tplEJSPDir: path.resolve( __dirname, './src/tplEJS/pages/' ),
            tplEJSPubDir: path.resolve( __dirname, './src/tplEJS/public/' ),

            tplHTMLDir: path.resolve( __dirname, './src/tplHTML/' ),
            tplHTMLBDir: path.resolve( __dirname, './src/tplHTML/basic/' ),
            tplHTMLMDir: path.resolve( __dirname, './src/tplHTML/modules/' ),
            tplHTMLPDir: path.resolve( __dirname, './src/tplHTML/pages/' ),
            tplHTMLPubDir: path.resolve( __dirname, './src/tplHTML/public/' ),

            vueDir: path.resolve( __dirname, './src/vue/' ),
            vueCompDir: path.resolve( __dirname, './src/vue/components/' ),
            vueMDir: path.resolve( __dirname, './src/vue/models/' ),
            vueRDir: path.resolve( __dirname, './src/vue/routers/' ),
            vueSDir: path.resolve( __dirname, './src/vue/stores/' ),
            vueStyDir: path.resolve( __dirname, './src/vue/styles/' ),
            vueVDir: path.resolve( __dirname, './src/vue/views/' ),

            wasmDir: path.resolve( __dirname, './src/wasm/' ),
            wasmBDir: path.resolve( __dirname, './src/wasm/basic/' ),
            wasmMDir: path.resolve( __dirname, './src/wasm/modules/' ),
            wasmPDir: path.resolve( __dirname, './src/wasm/pages/' ),
            wasmPubDir: path.resolve( __dirname, './src/wasm/public/' ),

            webCDir: path.resolve( __dirname, './src/webComponents/' ),

            serviceWorkersDir: path.resolve( __dirname, './src/workers/serviceWorkers/' ),
            sWorkersDir: path.resolve( __dirname, './src/workers/sharedWorkers/' ),
            tWorkersDir: path.resolve( __dirname, './src/workers/tools/' ),
            wWorkersDir: path.resolve( __dirname, './src/workers/webWorkers/' ),
        },
        modules: [
            'node_modules',
        ],
        symlinks: false,
        // 如果为true，则将不允许无扩展名的文件。
        enforceExtension: false,
    } ),
    externals_obj = {
        win_echarts: 'window.echarts',
        win_ELEMENT: 'window.ELEMENT',
        win_$: 'window.$',
        win_jQuery: 'window.jQuery',
        win_Swiper: 'window.Swiper',
        win_Vue: 'window.Vue',
        win_VueRouter: 'window.VueRouter',
        win_Vuex: 'window.Vuex',
    },
    performance_obj = {
        hints: 'warning',
        // 10MB
        maxAssetSize: 10485760,
        // 10MB
        maxEntrypointSize: 10485760,
        assetFilter( assetFilename ){
            return /\.(jng|bmp|dcx|gif|icns|ico|jbig2|jpe|jpeg|jpg|pam|pbm|pcx|pgm|png|pnm|ppm|psd|rgbe|tga|tif|tiff|wbmp|xbm|xpm|svg|svgz|webp|heif|heic)$/i.test( assetFilename ) || /\.(eot|otf|fon|font|ttf|ttc|woff|woff2)$/i.test( assetFilename ) || /\.(js|ts|tsx|mjs|cjs|css|less|scss|sass|styl|stylus|pcss|postcss|html|htm|ejs|vue|json|json5|xml|txt|toml|yaml|csv|wasm|graphql|gql)$/i.test( assetFilename );
        },
    },
    optimization_fun = ( isPro, isTest = true ) => ( isPro
                                                     ? {
            minimize: true,
            runtimeChunk: {
                name: entryPoint => `Runtime_${ entryPoint.name }`,
            },
            emitOnErrors: false,
            /*
             natural: 按使用顺序的数字ID。
             named: 可读的ID，以进行更好的调试。
             deterministic: 模块名称被散列为较小的数值。
             size: 数字ID专注于最小的初始下载大小。
             在webpack 5中添加了moduleIds：'deterministic'，不赞成使用moduleIds：'hashed'。
             moduleIds:
             'deterministic'时，默认长度为3，要覆盖默认行为，请将Optimization.moduleIds设置为false并使用webpack.ids.DeterministicModuleIdsPlugin
             moduleIds："total-size"已在webpack 5中删除。
             */
            moduleIds: false,
            /*
             natural: 按使用顺序的数字ID。
             named: 可读的ID，以进行更好的调试。
             deterministic: 简短的数字ID，在编译之间不会更改。适合长期缓存。在生产模式下默认启用。
             size: 数字ID专注于最小的初始下载大小。
             total-size: 数字ID专注于最小的总下载大小。
             chunkIds:
             'deterministic'时，默认长度为3，要覆盖默认行为，请将Optimization.chunkIds设置为false并使用webpack.ids.DeterministicChunkIdsPlugin
             */
            chunkIds: false,
            nodeEnv: 'production',
            mangleWasmImports: false,
            removeAvailableModules: false,
            removeEmptyChunks: true,
            mergeDuplicateChunks: true,
            flagIncludedChunks: true,
            providedExports: true,
            usedExports: true,
            concatenateModules: true,
            sideEffects: true,
            portableRecords: true,
            /*
             "size": 短名称-通常是一个字符-专注于最小下载大小。
             "deterministic": 短名称-通常是两个字符-在添加或删除导出时不会更改。适合长期缓存。
             true: 与“deterministic”相同
             false: 保留原始名称。适用于可读性和调试。
             */
            mangleExports: 'deterministic',
            innerGraph: true,
            realContentHash: true,
        }
                                                     : {
            runtimeChunk: {
                name: entryPoint => `Runtime_${ entryPoint.name }`,
            },
            nodeEnv: 'development',
        } ),
    // 如果定义的值是字符串值，得单引号内部嵌套双引号，如：'"例子"'，否则没法真正输出这个字符串
    defineObj_fun = isPro => {
        const str1 = `( location.protocol === "http:" ? "ws:" : "wss:" ) + "//" + location.hostname + ":" + location.port + `;

        return {
            isPro,

            // 黄总监的开发服(连公司有线局域网，端口：8087) http://192.168.1.196:8087/graphql
            devURL4HZJDev8087A: isPro
                                ? '"/"'
                                : '"/devURL4HZJDev8087A/"',
            // 黄总监的开发服(连刘家敏电脑的无线网络，端口：8087) http://192.168.137.137:8087/graphql
            devURL4HZJDev8087B: isPro
                                ? '"/"'
                                : '"/devURL4HZJDev8087B/"',
            // websocket黄总监的开发服(连公司有线局域网，端口：8087) ws://192.168.1.196:8087
            ws4DevURL4HZJDev8087A: isPro
                                   ? `${ str1 }"/"`
                                   : `${ str1 }"/ws4DevURL4HZJDev8087A/"`,
            // websocket黄总监的开发服(连刘家敏电脑的无线网络，端口：8087) ws://192.168.137.137:8087
            ws4DevURL4HZJDev8087B: isPro
                                   ? `${ str1 }"/"`
                                   : `${ str1 }"/ws4DevURL4HZJDev8087B/"`,

            // 油罐，黄总监的开发服(连公司有线局域网，端口：8098) http://192.168.1.196:8098/graphql
            devURL4HZJDev8098A: isPro
                                ? '"/"'
                                : '"/devURL4HZJDev8098A/"',
            // 油罐，黄总监的开发服(连刘家敏电脑的无线网络，端口：8098) http://192.168.137.137:8098/graphql
            devURL4HZJDev8098B: isPro
                                ? '"/"'
                                : '"/devURL4HZJDev8098B/"',
            // 油罐，websocket黄总监的开发服(连公司有线局域网，端口：8098) ws://192.168.1.196:8098
            ws4DevURL4HZJDev8098A: isPro
                                   ? `${ str1 }"/"`
                                   : `${ str1 }"/ws4DevURL4HZJDev8098A/"`,
            // 油罐，websocket黄总监的开发服(连刘家敏电脑的无线网络，端口：8098) ws://192.168.137.137:8098
            ws4DevURL4HZJDev8098B: isPro
                                   ? `${ str1 }"/"`
                                   : `${ str1 }"/ws4DevURL4HZJDev8098B/"`,

            // 开发服务器(连公司有线局域网，端口：8081) http://192.168.1.168:8081/graphql
            devURL8081A: isPro
                         ? '"/"'
                         : '"/devURL8081A/"',
            // websocket开发服务器(连公司有线局域网，端口：8081) ws://192.168.1.168:8081
            ws4DevURL8081A: isPro
                            ? `${ str1 }"/"`
                            : `${ str1 }"/ws4DevURL8081A/"`,

            // 内网穿透 http://sn2020a.nat300.top/graphql
            devURL4Natapp: isPro
                           ? '"/"'
                           : '"/devURL4Natapp/"',
            // websocket内网穿透 ws://sn2020a.nat300.top
            ws4DevURL4Natapp: isPro
                              ? `${ str1 }"/"`
                              : `${ str1 }"/ws4DevURL4Natapp/"`,

            // 测试服务器 http://192.168.1.168:8080/graphql
            testURL: isPro
                     ? '"/"'
                     : '"/testURL/"',
            // websocket测试服务器 ws://192.168.1.168:8080
            ws4TestURL: isPro
                        ? `${ str1 }"/"`
                        : `${ str1 }"/ws4TestURL/"`,

            // 邓龙光(连公司有线局域网，端口：8099) http://192.168.1.167:8099/graphql
            devURL4DLG8099A: isPro
                             ? '"/"'
                             : '"/devURL4DLG8099A/"',
            // 邓龙光(连刘家敏电脑的无线网络，端口：8099) http://192.168.137.123:8099/graphql
            devURL4DLG8099B: isPro
                             ? '"/"'
                             : '"/devURL4DLG8099B/"',
            // 邓龙光(连吴丹桦电脑的无线网络，端口：8099) http://192.168.137.236:8099/graphql
            devURL4DLG8099C: isPro
                             ? '"/"'
                             : '"/devURL4DLG8099C/"',
            // websocket邓龙光(连公司有线局域网，端口：8099) ws://192.168.1.167:8099
            ws4DevURL4DLG8099A: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4DLG8099A/"`,
            // websocket邓龙光(连刘家敏电脑的无线网络，端口：8099) ws://192.168.137.123:8099
            ws4DevURL4DLG8099B: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4DLG8099B/"`,
            // websocket邓龙光(连吴丹桦电脑的无线网络，端口：8099) ws://192.168.137.236:8099
            ws4DevURL4DLG8099C: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4DLG8099C/"`,

            // 许锦滨(连公司有线局域网，端口：8099) http://192.168.1.153:8099/graphql
            devURL4XJB8099A: isPro
                             ? '"/"'
                             : '"/devURL4XJB8099A/"',
            // 许锦滨(连刘家敏电脑的无线网络，端口：8099) http://192.168.137.217:8099/graphql
            devURL4XJB8099B: isPro
                             ? '"/"'
                             : '"/devURL4XJB8099B/"',
            // 许锦滨(连吴丹桦电脑的无线网络，端口：8099) http://192.168.137.73:8099/graphql
            devURL4XJB8099C: isPro
                             ? '"/"'
                             : '"/devURL4XJB8099C/"',
            // websocket许锦滨(连公司有线局域网，端口：8099) ws://192.168.1.153:8099
            ws4DevURL4XJB8099A: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4XJB8099A/"`,
            // websocket许锦滨(连刘家敏电脑的无线网络，端口：8099) ws://192.168.137.217:8099
            ws4DevURL4XJB8099B: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4XJB8099B/"`,
            // websocket许锦滨(连吴丹桦电脑的无线网络，端口：8099) ws://192.168.137.73:8099
            ws4DevURL4XJB8099C: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4XJB8099C/"`,

            // 李东明(连公司有线局域网，端口：8081) http://192.168.1.123:8081/graphql
            devURL4LDM8081A: isPro
                             ? '"/"'
                             : '"/devURL4LDM8081A/"',
            // 李东明(连吴丹桦电脑的无线网络，端口：8081) http://192.168.137.208:8081/graphql
            devURL4LDM8081B: isPro
                             ? '"/"'
                             : '"/devURL4LDM8081B/"',
            // websocket李东明(连公司有线局域网，端口：8081) ws://192.168.1.123:8081
            ws4DevURL4LDM8081A: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4LDM8081A/"`,
            // websocket李东明(连吴丹桦电脑的无线网络，端口：8081) ws://192.168.137.208:8081
            ws4DevURL4LDM8081B: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4LDM8081B/"`,

            // 戴海涛(连公司有线局域网，端口：8081) http://192.168.1.147:8081/graphql
            devURL4DHT8081A: isPro
                             ? '"/"'
                             : '"/devURL4DHT8081A/"',
            // websocket戴海涛(连公司有线局域网，端口：8081) ws://192.168.1.147:8081
            ws4DevURL4DHT8081A: isPro
                                ? `${ str1 }"/"`
                                : `${ str1 }"/ws4DevURL4DHT8081A/"`,
        };
    },
    splitChunks_obj = {
        chunks: 'all',
        // 单位：字节
        minSize: 1 * 1024 * 1024,
        // 单位：字节
        // maxSize: 10 * 1024 * 1024,
        hidePathInfo: true,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '_',
        automaticNameMaxLength: 109,
        name: true,
        cacheGroups: require( './src/js/App.js' ).isSPA_booC
                     ? ( ( ( start_num = 100000000 ) => {
                let styleType_arr = [
                        'css',
                        'less',
                        'sass',
                        'scss',
                        'postcss',
                        'stylus',
                    ],
                    obj = {
                        VendorsDir_CSS: {
                            test: /node_modules[\\/].*\.css$/,
                            name: 'VendorsDir_CSS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `Basic_Colors_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]basic[\\\\/](Basic.${ c }|Colors.${ c })$` ),
                                    name: `Basic_Colors_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `BasicDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]basic[\\\\/](?!Basic.${ c }|Colors.${ c }).*\\.${ c }$` ),
                                    name: `BasicDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `ComponentsDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]components[\\\\/][^(/)]+[\\\\/].*\\.${ c }$` ),
                                    name: `ComponentsDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),
                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `Components_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]components[\\\\/][^(/)]+\\.${ c }$` ),
                                    name: `Components_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `WebComponentsDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]webComponents[\\\\/].*\\.${ c }$` ),
                                    name: `WebComponentsDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `PublicDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]public[\\\\/].*\\.${ c }$` ),
                                    name: `PublicDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `ModulesDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]modules[\\\\/].*\\.${ c }$` ),
                                    name: `ModulesDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `VueComponentsDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/][^(/)]+[\\\\/].*\\.${ c }$` ),
                                    name: `VueComponentsDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),
                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `VueComponents_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/][^(/)]+\\.${ c }$` ),
                                    name: `VueComponents_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `VueStylesDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]vue[\\\\/]styles[\\\\/].*\\.${ c }$` ),
                                    name: `VueStylesDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `PagesDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]pages[\\\\/].*\\.${ c }$` ),
                                    name: `PagesDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        VendorsDir_JS: ( arr => {
                            return {
                                test: new RegExp( `node_modules[\\\\/](?!${ arr.map( ( c, i, a ) => c + '[\\\\/]' )
                                                                               .join( '|' ) }).*\\.js$` ),
                                name: 'VendorsDir_JS',
                                // 数值越高越先添加加载
                                // priority: 1000,
                                enforce: true,
                                reuseExistingChunk: true
                            };
                        } )( [
                                 'echarts',
                                 'jquery',
                                 'swiper',
                                 'vue',
                                 'vue-router',
                                 'vuex',
                             ] ),
                        VendorsToolsDir_JS: ( arr => {
                            return {
                                test: new RegExp( `node_modules[\\\\/](${ arr.map( ( c, i, a ) => c + '[\\\\/]' )
                                                                             .join( '|' ) }).*\\.js$` ),
                                name: 'VendorsToolsDir_JS',
                                // 数值越高越先添加加载
                                // priority: 1000,
                                enforce: true,
                                reuseExistingChunk: true
                            };
                        } )( [
                                 'echarts',
                                 'jquery',
                                 'swiper',
                                 'vue',
                                 'vue-router',
                                 'vuex',
                             ] ),
                        ToolsDir_JS: {
                            test: /src[\\/]js[\\/]tools[\\/].*\.js$/,
                            name: 'ToolsDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        WASMBasicDir: {
                            test: /src[\\/]wasm[\\/]basic[\\/]/,
                            name: 'WASMBasicDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WASMPublicDir: {
                            test: /src[\\/]wasm[\\/]public[\\/]/,
                            name: 'WASMPublicDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WASMModulesDir: {
                            test: /src[\\/]wasm[\\/]modules[\\/]/,
                            name: 'WASMModulesDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WASMPagesDir: {
                            test: /src[\\/]wasm[\\/]pages[\\/]/,
                            name: 'WASMPagesDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        GQLAPIDir_JS: {
                            test: /src[\\/]graphQL[\\/]api[\\/].*\.(graphql|gql)$/,
                            name: 'GQLAPIDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        ComponentsDir_JS: {
                            test: new RegExp( `src[\\\\/]components[\\\\/][^(/)]+[\\\\/].*\\.js$` ),
                            name: 'ComponentsDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        Components_JS: {
                            test: new RegExp( `src[\\\\/]components[\\\\/][^(/)]+\\.js$` ),
                            name: 'Components_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WebComponentsDir_JS: {
                            test: /src[\\/]webComponents[\\/].*\.js$/,
                            name: 'WebComponentsDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        PublicDir_JS: {
                            test: /src[\\/]js[\\/]public[\\/].*\.js$/,
                            name: 'PublicDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        ModulesDir_JS: {
                            test: /src[\\/]js[\\/]modules[\\/].*\.js$/,
                            name: 'ModulesDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        VueRoutersDir_JS: {
                            test: /src[\\/]vue[\\/]routers[\\/].*\.js$/,
                            name: 'VueRoutersDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        VueStoresDir_JS: {
                            test: /src[\\/]vue[\\/]stores[\\/].*\.js$/,
                            name: 'VueStoresDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        VueComponentsDir_JS: {
                            test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/][^(/)]+[\\\\/].*\\.js$` ),
                            name: 'VueComponentsDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        VueComponents_JS: {
                            test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/][^(/)]+\\.js$` ),
                            name: 'VueComponents_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        VueModelsDir_JS: {
                            test: /src[\\/]vue[\\/]models[\\/].*\.js$/,
                            name: 'VueModelsDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        PagesDir_JS: {
                            test: /src[\\/]js[\\/]pages[\\/].*\.js$/,
                            name: 'PagesDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        /*
                         default: {
                         minChunks: 2,
                         // 数值越高越先添加加载
                         // priority: -10,
                         reuseExistingChunk: true,
                         },
                         */
                    };

                Object.entries( obj )
                      .forEach( ( c, i, ) => {
                          c[ 1 ].priority = start_num - i;
                      } );

                return obj;
            } )( 100000000 ) )
                     : ( ( ( start_num = 100000000 ) => {
                let fun = c => {
                        let arr1 = [ ...c ];

                        return `${ arr1.shift()
                                       .toLocaleUpperCase() }${ arr1.join( '' ) }`.replace( new RegExp( '[^a-zA-Z0-9_@]', 'g' ), '' );
                    },
                    styleType_arr = [
                        'css',
                        'less',
                        'sass',
                        'scss',
                        'postcss',
                        'stylus',
                    ],
                    obj = {
                        VendorsDir_CSS: {
                            test: /node_modules[\\/].*\.css$/,
                            name: 'VendorsDir_CSS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `Basic_Colors_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]basic[\\\\/](Basic.${ c }|Colors.${ c })$` ),
                                    name: `Basic_Colors_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `BasicDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]basic[\\\\/](?!Basic.${ c }|Colors.${ c }).*\\.${ c }$` ),
                                    name: `BasicDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        // ./src/components/xxx/
                        ...( arr => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/components' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/components/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  arr.forEach( ( c1, i1, a1 ) => {
                                      str1 = fun( c );

                                      result_obj[ `Components_${ str1 }_${ c1.toLocaleUpperCase() }` ] = {
                                          test: new RegExp( `src[\\\\/]components[\\\\/]${ c }[\\\\/].*\\.${ c1 }$` ),
                                          name: `Components_${ str1 }_${ c1.toLocaleUpperCase() }`,
                                          // 数值越高越先添加加载
                                          // priority: 1000,
                                          enforce: true,
                                          reuseExistingChunk: true
                                      };
                                  } );
                              } );

                            return result_obj;
                        } )( styleType_arr ),
                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `Components_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]components[\\\\/][^(/)]+\\.${ c }$` ),
                                    name: `Components_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        // ./src/webComponents/xxx/
                        ...( arr => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/webComponents' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/webComponents/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  arr.forEach( ( c1, i1, a1 ) => {
                                      str1 = fun( c );

                                      result_obj[ `WebComponents_${ str1 }_${ c1.toLocaleUpperCase() }` ] = {
                                          test: new RegExp( `src[\\\\/]webComponents[\\\\/]${ c }[\\\\/].*\\.${ c1 }$` ),
                                          name: `WebComponents_${ str1 }_${ c1.toLocaleUpperCase() }`,
                                          // 数值越高越先添加加载
                                          // priority: 1000,
                                          enforce: true,
                                          reuseExistingChunk: true
                                      };
                                  } );
                              } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `PublicDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]public[\\\\/].*\\.${ c }$` ),
                                    name: `PublicDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `ModulesDir_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]modules[\\\\/].*\\.${ c }$` ),
                                    name: `ModulesDir_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        // ./src/vue/components/xxx/
                        ...( arr => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/vue/components' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/vue/components/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  arr.forEach( ( c1, i1, a1 ) => {
                                      str1 = fun( c );

                                      result_obj[ `VueComponents_${ str1 }_${ c1.toLocaleUpperCase() }` ] = {
                                          test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/]${ c }[\\\\/].*\\.${ c1 }$` ),
                                          name: `VueComponents_${ str1 }_${ c1.toLocaleUpperCase() }`,
                                          // 数值越高越先添加加载
                                          // priority: 1000,
                                          enforce: true,
                                          reuseExistingChunk: true
                                      };
                                  } );
                              } );

                            return result_obj;
                        } )( styleType_arr ),
                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `VueComponents_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/][^(/)]+\\.${ c }$` ),
                                    name: `VueComponents_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        // ./src/vue/styles/xxx/
                        ...( arr => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/vue/styles' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/vue/styles/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  arr.forEach( ( c1, i1, a1 ) => {
                                      str1 = fun( c );

                                      result_obj[ `VueStyles_${ str1 }_${ c1.toLocaleUpperCase() }` ] = {
                                          test: new RegExp( `src[\\\\/]vue[\\\\/]styles[\\\\/]${ c }[\\\\/].*\\.${ c1 }$` ),
                                          name: `VueStyles_${ str1 }_${ c1.toLocaleUpperCase() }`,
                                          // 数值越高越先添加加载
                                          // priority: 1000,
                                          enforce: true,
                                          reuseExistingChunk: true
                                      };
                                  } );
                              } );

                            return result_obj;
                        } )( styleType_arr ),
                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `VueStyles_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]vue[\\\\/]styles[\\\\/][^(/)]+\\.${ c }$` ),
                                    name: `VueStyles_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        // ./src/styles
                        ...( arr => {
                            let result_obj = {},
                                str1;

                            arr.forEach( ( c1, i1, a1 ) => {
                                fs.readdirSync( path.join( __dirname, `./src/styles/${ c1 }/pages` ) )
                                  .filter( ( c, i, a ) => {
                                      return fs.statSync( path.join( __dirname, `./src/styles/${ c1 }/pages/${ c }` ) )
                                               .isDirectory();
                                  } )
                                  .filter( ( c, i, a ) => true )
                                  .forEach( ( c, i, a ) => {
                                      str1 = fun( c );

                                      result_obj[ `Pages_${ str1 }_${ c1.toLocaleUpperCase() }` ] = {
                                          test: new RegExp( `src[\\\\/]styles[\\\\/]${ c1 }[\\\\/]pages[\\\\/]${ c }[\\\\/].*\\.${ c1 }$` ),
                                          name: `Pages_${ str1 }_${ c1.toLocaleUpperCase() }`,
                                          // 数值越高越先添加加载
                                          // priority: 1000,
                                          enforce: true,
                                          reuseExistingChunk: true
                                      };
                                  } );
                            } );

                            return result_obj;
                        } )( styleType_arr ),
                        ...( arr => {
                            let result_obj = {};

                            arr.forEach( ( c, i, a ) => {
                                result_obj[ `Pages_${ c.toLocaleUpperCase() }` ] = {
                                    test: new RegExp( `src[\\\\/]styles[\\\\/]${ c }[\\\\/]pages[\\\\/][^(/)]+\\.${ c }$` ),
                                    name: `Pages_${ c.toLocaleUpperCase() }`,
                                    // 数值越高越先添加加载
                                    // priority: 1000,
                                    enforce: true,
                                    reuseExistingChunk: true
                                };
                            } );

                            return result_obj;
                        } )( styleType_arr ),

                        VendorsDir_JS: ( arr => {
                            return {
                                test: new RegExp( `node_modules[\\\\/](?!${ arr.map( ( c, i, a ) => c + '[\\\\/]' )
                                                                               .join( '|' ) }).*\\.js$` ),
                                name: 'VendorsDir_JS',
                                // 数值越高越先添加加载
                                // priority: 1000,
                                enforce: true,
                                reuseExistingChunk: true
                            };
                        } )( [
                                 'echarts',
                                 'jquery',
                                 'swiper',
                                 'vue',
                                 'vue-router',
                                 'vuex',
                             ] ),
                        VueFamily_JS: {
                            test: /node_modules[\\/](vue[\\/]|vue-router[\\/]|vuex[\\/]).*\.js$/,
                            name: 'VueFamily_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        Echarts_JS: {
                            test: /node_modules[\\/]echarts[\\/].*\.js$/,
                            name: 'Echarts_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        jQuery_JS: {
                            test: /node_modules[\\/]jquery[\\/].*\.js$/,
                            name: 'jQuery_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        Swiper_JS: {
                            test: /node_modules[\\/]swiper[\\/].*\.js$/,
                            name: 'Swiper_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        CT_JS: {
                            test: /src[\\/]js[\\/]tools[\\/]CurrencyTools.esm.js$/,
                            name: 'CT_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        Decorator_JS: {
                            test: /src[\\/]js[\\/]tools[\\/]Decorator4ES6.esm.js$/,
                            name: 'Decorator_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        HTML2Canvas_JS: {
                            test: /src[\\/]js[\\/]tools[\\/]HTML2Canvas.esm.js$/,
                            name: 'HTML2Canvas_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WebC_JS: {
                            test: /src[\\/]js[\\/]tools[\\/]WebComponents.esm.js$/,
                            name: 'WebC_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        Workers4MT_JS: {
                            test: /src[\\/]js[\\/]tools[\\/]Workers4MT.esm.js$/,
                            name: 'Workers4MT_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        ToolsDir_JS: ( arr => {
                            return {
                                test: new RegExp( `src[\\\\/]js[\\\\/]tools[\\\\/](?!${ arr.join( '|' ) }).*\\.js$` ),
                                name: 'ToolsDir_JS',
                                // 数值越高越先添加加载
                                // priority: 1000,
                                enforce: true,
                                reuseExistingChunk: true
                            };
                        } )( [
                                 'CurrencyTools.esm.js',
                                 'Decorator4ES6.esm.js',
                                 'HTML2Canvas.esm.js',
                                 'WebComponents.esm.js',
                                 'Workers4MT.esm.js',
                             ] ),

                        WASMBasicDir: {
                            test: /src[\\/]wasm[\\/]basic[\\/]/,
                            name: 'WASMBasicDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WASMPublicDir: {
                            test: /src[\\/]wasm[\\/]public[\\/]/,
                            name: 'WASMPublicDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WASMModulesDir: {
                            test: /src[\\/]wasm[\\/]modules[\\/]/,
                            name: 'WASMModulesDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        WASMPagesDir: {
                            test: /src[\\/]wasm[\\/]pages[\\/]/,
                            name: 'WASMPagesDir',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        ...( () => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/graphQL/api' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/graphQL/api/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  str1 = fun( c );

                                  result_obj[ `GQLAPI_${ str1 }_JS` ] = {
                                      test: new RegExp( `src[\\\\/]graphQL[\\\\/]api[\\\\/]${ c }[\\\\/].*\\.(graphql|gql)$` ),
                                      name: `GQLAPI_${ str1 }_JS`,
                                      // 数值越高越先添加加载
                                      // priority: 1000,
                                      enforce: true,
                                      reuseExistingChunk: true
                                  };
                              } );

                            return result_obj;
                        } )(),
                        GQLAPI_JS: {
                            test: new RegExp( `src[\\\\/]graphQL[\\\\/]api[\\\\/][^(/)]+\\.(graphql|gql)$` ),
                            name: 'GQLAPI_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        // ./src/components/xxx/
                        ...( () => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/components' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/components/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  str1 = fun( c );

                                  result_obj[ `Components_${ str1 }_JS` ] = {
                                      test: new RegExp( `src[\\\\/]components[\\\\/]${ c }[\\\\/].*\\.js$` ),
                                      name: `Components_${ str1 }_JS`,
                                      // 数值越高越先添加加载
                                      // priority: 1000,
                                      enforce: true,
                                      reuseExistingChunk: true
                                  };
                              } );

                            return result_obj;
                        } )(),
                        Components_JS: {
                            test: new RegExp( `src[\\\\/]components[\\\\/][^(/)]+\\.js$` ),
                            name: 'Components_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        // ./src/webComponents/xxx/
                        ...( () => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/webComponents' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/webComponents/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  str1 = fun( c );

                                  result_obj[ `WebComponents_${ str1 }_JS` ] = {
                                      test: new RegExp( `src[\\\\/]webComponents[\\\\/]${ c }[\\\\/].*\\.js$` ),
                                      name: `WebComponents_${ str1 }_JS`,
                                      // 数值越高越先添加加载
                                      // priority: 1000,
                                      enforce: true,
                                      reuseExistingChunk: true
                                  };
                              } );

                            return result_obj;
                        } )(),
                        PublicDir_JS: {
                            test: /src[\\/]js[\\/]public[\\/].*\.js$/,
                            name: 'PublicDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        ModulesDir_JS: {
                            test: /src[\\/]js[\\/]modules[\\/].*\.js$/,
                            name: 'ModulesDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        VueRoutersDir_JS: {
                            test: /src[\\/]vue[\\/]routers[\\/].*\.js$/,
                            name: 'VueRoutersDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        VueStoresDir_JS: {
                            test: /src[\\/]vue[\\/]stores[\\/].*\.js$/,
                            name: 'VueStoresDir_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        ...( () => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/vue/components' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/vue/components/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  str1 = fun( c );

                                  result_obj[ `VueComponents_${ str1 }_JS` ] = {
                                      test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/]${ c }[\\\\/].*\\.js$` ),
                                      name: `VueComponents_${ str1 }_JS`,
                                      // 数值越高越先添加加载
                                      // priority: 1000,
                                      enforce: true,
                                      reuseExistingChunk: true
                                  };
                              } );

                            return result_obj;
                        } )(),
                        VueComponents_JS: {
                            test: new RegExp( `src[\\\\/]vue[\\\\/]components[\\\\/][^(/)]+\\.js$` ),
                            name: 'VueComponents_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },
                        ...( () => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/vue/models' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/vue/models/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  str1 = fun( c );

                                  result_obj[ `VueModels_${ str1 }_JS` ] = {
                                      test: new RegExp( `src[\\\\/]vue[\\\\/]models[\\\\/]${ c }[\\\\/].*\\.js$` ),
                                      name: `VueModels_${ str1 }_JS`,
                                      // 数值越高越先添加加载
                                      // priority: 1000,
                                      enforce: true,
                                      reuseExistingChunk: true
                                  };
                              } );

                            return result_obj;
                        } )(),
                        VueModels_JS: {
                            test: new RegExp( `src[\\\\/]vue[\\\\/]models[\\\\/][^(/)]+\\.js$` ),
                            name: 'VueModels_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        ...( () => {
                            let result_obj = {},
                                str1;

                            fs.readdirSync( path.join( __dirname, './src/js/pages' ) )
                              .filter( ( c, i, a ) => {
                                  return fs.statSync( path.join( __dirname, `./src/js/pages/${ c }` ) )
                                           .isDirectory();
                              } )
                              .filter( ( c, i, a ) => true )
                              .forEach( ( c, i, a ) => {
                                  str1 = fun( c );

                                  result_obj[ `Pages_${ str1 }_JS` ] = {
                                      test: new RegExp( `src[\\\\/]js[\\\\/]pages[\\\\/]${ c }[\\\\/].*\\.js$` ),
                                      name: `Pages_${ str1 }_JS`,
                                      // 数值越高越先添加加载
                                      // priority: 1000,
                                      enforce: true,
                                      reuseExistingChunk: true
                                  };
                              } );

                            return result_obj;
                        } )(),
                        Pages_JS: {
                            test: new RegExp( `src[\\\\/]js[\\\\/]pages[\\\\/][^(/)]+\\.js$` ),
                            name: 'Pages_JS',
                            // 数值越高越先添加加载
                            // priority: 1000,
                            enforce: true,
                            reuseExistingChunk: true
                        },

                        /*
                         default: {
                         minChunks: 2,
                         // 数值越高越先添加加载
                         // priority: -10,
                         reuseExistingChunk: true,
                         },
                         */
                    };

                Object.entries( obj )
                      .forEach( ( c, i, ) => {
                          c[ 1 ].priority = start_num - i;
                      } );

                return obj;
            } )( 100000000 ) )
    },
    provide_obj = {
        echarts: 'echartsESM',

        ELEMENTCSS: 'elementUIESMCSS',
        ELEMENT: 'elementUIESM',

        $: 'jQueryESM',
        jQuery: 'jQueryESM',
        'window.$': 'jQueryESM',
        'window.jQuery': 'jQueryESM',

        SwiperCSS: 'swiperESMCSS',
        Swiper: 'swiperESM',

        Vue: 'vueESM',
        VueRouter: 'vueRouterESM',
        Vuex: 'vuexESM',

        CompESM: 'CompESM',

        CTESM: 'CTESM',
        DecESM: 'DecESM',
        HTML2C4ESM: 'HTML2C4ESM',
        WebCESM: 'WebCESM',
        WorkersESM: 'WorkersESM',
    },
    babelPresets_fun = ( isPro_boo, noTest_boo ) => [
        [
            '@babel/preset-env',
            {
                // 是否松散，建议不要
                loose: true,
                // 是否规范，启用后编译会耗时
                spec: false,
                // 7.4版本的插件写法发生巨变！！！
                corejs: {
                    version: 3,
                    proposals: true,
                },
                /*
                 modules这个选项说明！！！要细看！！！

                 把 modules 设置为 false，就是告诉 babel 不要编译模块代码。这会让 Babel 保留我们现有的 es2015 import/export 语句。
                 划重点：
                 所有可需要 tree-shaking 的代码必须以这种方式编译。
                 因此，如果你有要导入的库，则必须将这些库编译为 es2015 模块以便进行 tree-shaking 。
                 如果它们被编译为 commonjs，那么它们就不能做 tree-shaking ，并且将会被打包进你的应用程序中。
                 许多库支持部分导入，lodash 就是一个很好的例子，它本身是 commonjs 模块，但是它有一个 lodash-es 版本，用的是 es2015模块。
                 此外，如果你在应用程序中使用内部库，也必须使用 es2015 模块编译。为了减少应用程序包的大小，必须将所有这些内部库修改为以这种方式编译。
                 */
                modules: false,
                useBuiltIns: 'usage',
                shippedProposals: true,
                targets: {
                    safari: 'tp',
                    // 启用会忽略browsers属性
                    esmodules: false,
                    browsers: browsers_arr,
                },
            },
        ],
        [
            '@babel/preset-typescript',
            {
                isTSX: false,
                allExtensions: false,
                // jsxPragma: 'React',
                // 默认值就是：false
                allowNamespaces: true,
                // 默认值就是：false
                allowDeclareFields: true,
                // 默认值就是：false
                onlyRemoveTypeImports: true,
            },
        ],
        [
            'const-enum',
            {
                allExtensions: false,
                // removeConst constObject
                transform: 'constObject',
            },
        ],
    ],
    babelPlugins_fun = ( isPro_boo, noTest_boo, isESM_boo ) => {
        let miniJS_arr = [
                // JS压缩插件 Start
                // 暂时不用
                // [ 'minify-simplify' ],

                // 当函数的默认参数设置为常量或私有变量时，该插件会报错。Cannot read property 'add' of undefined
                /*
                 [
                 'minify-mangle-names',
                 {
                 // exclude: { TestClassA: true },
                 keepFnName: true,
                 eval: true,
                 topLevel: true,
                 keepClassName: true,
                 }
                 ],
                 */

                [ 'transform-inline-consecutive-adds' ],
                [ '@babel/plugin-transform-member-expression-literals' ],
                [ 'transform-merge-sibling-variables' ],
                // [ 'transform-minify-booleans' ],
                /*
                 [
                 'minify-builtins',
                 {
                 tdz: true,
                 }
                 ],
                 */
                [
                    'minify-constant-folding',
                    {
                        tdz: true,
                    }
                ],
                [
                    'minify-dead-code-elimination',
                    {
                        optimizeRawSize: true,
                        keepFnName: true,
                        keepFnArgs: true,
                        keepClassName: true,
                        tdz: true,
                    }
                ],
                [ 'minify-numeric-literals' ],
                // Boolean(x) -> !!x
                [
                    'minify-type-constructors',
                    {
                        // true不转换
                        array: true,
                        boolean: true,
                        number: true,
                        object: true,
                        string: true,
                    }
                ],
                // const foo='ab+';var a=new RegExp(foo+'c','i');->const foo='ab+';var a=/ab+c/i;
                [ 'transform-regexp-constructors' ],
                /*
                 [
                 'transform-remove-undefined',
                 {
                 tdz: true,
                 }
                 ],
                 */
                // [ 'transform-undefined-to-void' ]
                // JS压缩插件 End
            ],
            cjs_arr = [
                '@babel/plugin-transform-modules-commonjs',
                {
                    allowTopLevelThis: true,
                    loose: true,
                    strict: false,
                    noInterop: false,
                    lazy: false,
                }
            ],
            runtime_arr = [
                '@babel/plugin-transform-runtime',
                {
                    // 7.4版本的插件写法发生巨变！！！如果把如下的注释启用了，那么在生产环境的编译下会报错！！！
                    /*
                     corejs: {
                     version: 3,
                     proposals: true,
                     },
                     */
                    helpers: true,
                    regenerator: true,
                    useESModules: isESM_boo,
                }
            ],
            plug_arr = [
                [ '@babel/plugin-external-helpers' ],

                [
                    'const-enum',
                    {
                        // removeConst constObject
                        transform: 'constObject',
                    }
                ],

                /*ES6+提案语法转换插件 Start*/

                [
                    '@babel/plugin-proposal-record-and-tuple',
                    {
                        /*
                         importPolyfill: true会使用由提案者维护的语法转换插件(@bloomberg/record-tuple-polyfill，如果启用要记得安装它)进行转换的。
                         importPolyfill: false会仅使用Record和Tuple全局变量来转换提案语法。
                         默认值是：false。
                         */
                        importPolyfill: false,
                        /*
                         如果您希望将导入内容注入到不同于@bloomberg/record-tuple-polyfill的polyfill中，则可以使用此选项指定其名称。
                         默认值是“@bloomberg/record-tuple-polyfill”。
                         当importPolyfill: true时，这个选项才有实际使用意义。
                         */
                        // polyfillModuleName: '@bloomberg/record-tuple-polyfill',
                    }
                ],
                [
                    '@babel/plugin-proposal-class-static-block',
                    {
                        'loose': true,
                    }
                ],
                [ 'babel-plugin-transform-typescript-metadata' ],
                [
                    '@babel/plugin-proposal-decorators',
                    {
                        legacy: true,
                        /*
                         // 当decoratorsBeforeExport === undefined时，而且legacy = false(默认的值也是false)时，会报错！！！
                         // The decorators plugin requires a 'decoratorsBeforeExport' option, whose value must be a boolean. If you want to use the legacy decorators semantics, you can set the 'legacy: true' option.

                         // 当decoratorsBeforeExport !== undefined时，而且legacy = true时，会报错！！！
                         // 'decoratorsBeforeExport' can't be used with legacy decorators.

                         decoratorsBeforeExport: true
                         //@decorator
                         //export class Foo {}

                         //decoratorsBeforeExport: false
                         //export @decorator class Bar {}
                         */
                    }
                ],
                [
                    '@babel/plugin-proposal-class-properties',
                    {
                        loose: true,
                    }
                ],
                // ES2018
                // [ '@babel/plugin-proposal-async-generator-functions' ],
                [ '@babel/plugin-proposal-do-expressions' ],
                [ '@babel/plugin-proposal-export-default-from' ],
                [ '@babel/plugin-proposal-export-namespace-from' ],
                [ '@babel/plugin-proposal-function-bind' ],
                [ '@babel/plugin-proposal-function-sent' ],
                [ '@babel/plugin-proposal-json-strings' ],
                [ '@babel/plugin-proposal-logical-assignment-operators' ],
                [
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                    {
                        loose: false,
                    }
                ],
                [ '@babel/plugin-proposal-numeric-separator' ],
                [ '@babel/plugin-transform-literals' ],
                // ES2018
                /*
                 [
                 '@babel/plugin-proposal-object-rest-spread',
                 {
                 loose: true,
                 useBuiltIns: true,
                 }
                 ],
                 */
                // ES2018
                // [ '@babel/plugin-proposal-optional-catch-binding' ],
                [
                    '@babel/plugin-proposal-optional-chaining',
                    {
                        loose: false,
                    }
                ],
                [
                    '@babel/plugin-proposal-pipeline-operator',
                    {
                        proposal: 'minimal',
                    }
                ],
                [ '@babel/plugin-proposal-throw-expressions' ],
                // ES2018
                /*
                 [
                 '@babel/plugin-proposal-unicode-property-regex',
                 {
                 useUnicodeFlag: true,
                 }
                 ],
                 */
                [
                    '@babel/plugin-proposal-private-methods',
                    {
                        loose: true,
                    }
                ],
                [ '@babel/plugin-proposal-partial-application' ],
                [
                    '@babel/plugin-proposal-private-property-in-object',
                    {
                        loose: true,
                    }
                ],
				[ '@babel/plugin-proposal-async-do-expressions' ],
                /*ES6+提案语法转换插件 End*/

                /*句法转换插件 Start*/
                [
                    '@babel/plugin-syntax-decorators',
                    {
                        legacy: true,
                        /*
                         // 当decoratorsBeforeExport === undefined时，而且legacy = false(默认的值也是false)时，会报错！！！
                         // The decorators plugin requires a 'decoratorsBeforeExport' option, whose value must be a boolean. If you want to use the legacy decorators semantics, you can set the 'legacy: true' option.

                         // 当decoratorsBeforeExport !== undefined时，而且legacy = true时，会报错！！！
                         // 'decoratorsBeforeExport' can't be used with legacy decorators.

                         decoratorsBeforeExport: true
                         //@decorator
                         //export class Foo {}

                         //decoratorsBeforeExport: false
                         //export @decorator class Bar {}
                         */
                    }
                ],
                [
                    '@babel/plugin-syntax-class-properties',
                    {
                        loose: true,
                    }
                ],
                // ES2018
                // [ '@babel/plugin-syntax-async-generators' ],
                [ '@babel/plugin-syntax-bigint' ],
                [ '@babel/plugin-syntax-do-expressions' ],
                [ '@babel/plugin-syntax-dynamic-import' ],
                [ '@babel/plugin-syntax-export-default-from' ],
                [ '@babel/plugin-syntax-export-extensions' ],
                [ '@babel/plugin-syntax-export-namespace-from' ],
                [ '@babel/plugin-syntax-flow' ],
                [ '@babel/plugin-syntax-function-bind' ],
                [ '@babel/plugin-syntax-function-sent' ],
                [ '@babel/plugin-syntax-import-meta' ],
                [ '@babel/plugin-syntax-json-strings' ],
                [ '@babel/plugin-syntax-jsx' ],
                [ '@babel/plugin-syntax-logical-assignment-operators' ],
                [
                    '@babel/plugin-syntax-nullish-coalescing-operator',
                    {
                        loose: false,
                    }
                ],
                [ '@babel/plugin-syntax-numeric-separator' ],
                // ES2018
                /*
                 [
                 '@babel/plugin-syntax-object-rest-spread',
                 {
                 loose: true,
                 useBuiltIns: true,
                 }
                 ],
                 */
                // ES2018
                // [ '@babel/plugin-syntax-optional-catch-binding' ],
                [
                    '@babel/plugin-syntax-optional-chaining',
                    {
                        loose: false,
                    }
                ],
                [
                    '@babel/plugin-syntax-pipeline-operator',
                    {
                        proposal: 'minimal',
                    }
                ],
                [ '@babel/plugin-syntax-throw-expressions' ],
                [
                    '@babel/plugin-syntax-typescript',
                    {
                        isTSX: false,
                    }
                ],
                [ '@babel/plugin-syntax-partial-application' ],
                [ '@babel/plugin-syntax-top-level-await' ],
                /*句法转换插件 End*/

                // 当不需要兼容低版本的浏览器的时候，就可以不用转码ES2015(ES6)
                /*ES2015(ES6)语法转换插件 Start*/
                /* 暂时不用 [ '@babel/plugin-transform-instanceof' ],*/
                /* 暂时不用 [ '@babel/plugin-transform-sticky-regex' ],*/
                /*tdz: true会报错 TypeError: this.addHelper is not a function*/
                /*
                 [
                 '@babel/plugin-transform-block-scoping',
                 {
                 throwIfClosureRequired: false,
                 tdz: false,
                 }
                 ],
                 [
                 '@babel/plugin-transform-arrow-functions',
                 {
                 spec: true,
                 }
                 ],
                 [ '@babel/plugin-transform-block-scoped-functions' ],
                 [
                 '@babel/plugin-transform-computed-properties',
                 {
                 loose: false,
                 }
                 ],
                 [
                 '@babel/plugin-transform-destructuring',
                 {
                 loose: false,
                 useBuiltIns: true,
                 }
                 ],
                 [ '@babel/plugin-transform-duplicate-keys' ],
                 [
                 '@babel/plugin-transform-for-of',
                 {
                 loose: false,
                 assumeArray: false,
                 }
                 ],
                 [ '@babel/plugin-transform-function-name' ],
                 [ '@babel/plugin-transform-new-target' ],
                 [ '@babel/plugin-transform-object-super' ],
                 [
                 '@babel/plugin-transform-parameters',
                 {
                 loose: false,
                 }
                 ],
                 [ '@babel/plugin-transform-shorthand-properties' ],
                 [
                 '@babel/plugin-transform-spread',
                 {
                 loose: false,
                 }
                 ],
                 [
                 '@babel/plugin-transform-template-literals',
                 {
                 loose: false,
                 }
                 ],
                 [ '@babel/plugin-transform-typeof-symbol' ],
                 [ '@babel/plugin-transform-unicode-regex' ],
                 [
                 '@babel/plugin-transform-classes',
                 {
                 loose: false,
                 }
                 ],
                 [ '@babel/plugin-transform-unicode-escapes' ],
                 */
                /*ES2015(ES6)语法转换插件 End*/

                // 当不需要兼容低版本的浏览器的时候，就可以不用转码ES2016
                /*ES2016语法转换插件 Strat*/
                /*[ '@babel/plugin-transform-exponentiation-operator' ],*/
                /*ES2016语法转换插件 End*/

                // 当不需要兼容低版本的浏览器的时候，就可以不用转码ES2017
                /*ES2017语法转换插件 Strat*/
                /*
                 [
                 '@babel/plugin-transform-async-to-generator',
                 {
                 module: 'bluebird',
                 method: 'coroutine',
                 }
                 ],
                 */
                /*ES2017语法转换插件 End*/

                // 当不需要兼容低版本的浏览器的时候，就可以不用转码ES2018
                /*ES2018语法转换插件 Strat*/
                /*
                 [ '@babel/plugin-transform-dotall-regex' ],
                 [
                 '@babel/plugin-transform-named-capturing-groups-regex',
                 {
                 runtime: true,
                 }
                 ],
                 */
                /*ES2018语法转换插件 End*/

                // 当不需要兼容低版本的浏览器的时候，就不需要启用这些插件
                /*语法转换插件 Start*/
                /*
                 [ '@babel/plugin-transform-jscript' ],
                 [ '@babel/plugin-check-constants' ],
                 [ '@babel/plugin-codemod-optional-catch-binding' ],
                 [ '@babel/plugin-transform-eval' ],
                 [ '@babel/plugin-transform-property-literals' ],
                 [ '@babel/plugin-transform-property-mutators' ],
                 [
                 '@babel/plugin-transform-regenerator',
                 {
                 asyncGenerators: true,
                 generators: true,
                 async: true,
                 }
                 ],

                 [ '@babel/plugin-transform-reserved-words' ],
                 [ '@babel/plugin-transform-object-assign' ],
                 */

                // 要注意这个插件的使用方法！！！该插件配合下面那个插件使用！！！没用这两个插件，IE9中就无法使用Object.setPrototypeOf()
                // [ '@babel/plugin-transform-proto-to-assign' ],
                // Object.setPrototypeOf(bar, foo);要注意这个插件的使用方法！！！需要上头那个插件的配合使用！！！没用这两个插件，IE9中就无法使用Object.setPrototypeOf()
                // [ '@babel/plugin-transform-object-set-prototype-of-to-assign' ],
                /*
                 PS:
                 var foo = { a: 1 };
                 var bar = { b: 2 };
                 bar.__proto__ = foo;
                 bar.a; // 1
                 foo.a = 2;
                 bar.a; // 1 没用这个两个插件，会输出2(本来也应该输出2的)！！！用了会输出1！！！
                 */

                /*语法转换插件 End*/

                // 没啥效果
                // [ '@babel/plugin-transform-strict-mode' ],
            ];
        noTest_boo && miniJS_arr.unshift( [ 'transform-remove-console' ], [ 'transform-remove-debugger' ] );
        isESM_boo
        ? plug_arr.push( runtime_arr )
        : ( plug_arr.push( cjs_arr ), plug_arr.push( runtime_arr ) );
        isPro_boo && plug_arr.push( ...miniJS_arr );
        return plug_arr;
    },
    moduleRules_fun = ( {
                            path,
                            __dirname,
                            isPro,
                            MiniCSSExtractPlugin,
                            noTest_boo,
                            isESM_boo,
                        } ) => {
        // 注意这些个“loader”是否都有"esModule: false"这个配置项！！！有的默认值是false，有的是true！！！

        /*
         在mini-css-extract-plugin v1.0.0中“reloadAll”、“hmr”、“moduleFilename”已被删除
         从“v1.3.0”中可知，作为加载器使用时，只有如下几个有效的配置参数：publicPath、modules、esModule。
         */
        let obj = {
            // publicPath: '../',
            esModule: false,
        };

        return [
            {
                test: /\.(html|htm)$/i,
                /*
                 “webpack 5”中“enforce”可用的2个值：'pre'、'post'。
                 enforce: 指定加载程序的类别。无值表示正常加载程序。
                 正常阶段：装载机上的正常方法按“pre, post”的顺序执行。在此阶段进行模块源代码的转换。
                 当使用“webpack 5”时，需要这个属性，否则后面的“vue-loader”会报错！
                 */
                enforce: 'post',
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attributes: true,
                            minimize: {
                                collapseBooleanAttributes: false,
                                collapseInlineTagWhitespace: true,
                                collapseWhitespace: true,
                                html5: true,
                                // 在单例元素上保留斜线
                                keepClosingSlash: true,
                                minifyCSS: isPro,
                                minifyJS: isPro,
                                removeAttributeQuotes: false,
                                removeComments: true,
                                removeEmptyAttributes: false,
                                removeEmptyElements: false,
                                removeOptionalTags: false,
                                removeRedundantAttributes: false,
                                removeScriptTypeAttributes: true,
                                removeStyleLinkTypeAttributes: true,
                                removeTagWhitespace: false,
                            },
                            esModule: false,
                        }
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/vue/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.ejs$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'ejs-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/tplEJS/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },

            {
                test: /\.css$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                        options: obj,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true,
                            importLoaders: 1,
                            esModule: false,
                            sourceMap: false,
                        },
                    },
                    postCSSLoader_fun( isPro ),
                ],
                include: [
                    path.resolve( __dirname, './node_modules/' ),
                    // /node_modules[\\/](element-ui[\\/]).*\.css/,
                    // /node_modules[\\/](swiper[\\/]).*\.css/,
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/styles/css/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    // /node_modules[\\/](?!element-ui[\\/]).*\.css/,
                    // /node_modules[\\/](?!swiper[\\/]).*\.css/,
                    // path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/less/' ),
                    path.resolve( __dirname, './src/styles/postcss/' ),
                    path.resolve( __dirname, './src/styles/sass/' ),
                    path.resolve( __dirname, './src/styles/scss/' ),
                    path.resolve( __dirname, './src/styles/stylus/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                sideEffects: true,
            },
            {
                test: /\.scss$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                        options: obj,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true,
                            importLoaders: 2,
                            esModule: false,
                            sourceMap: false,
                        }
                    },
                    postCSSLoader_fun( isPro ),
                    {
                        loader: 'sass-loader',
                        options: {
                            /*
                             使用dart-sass实现
                             不支持以下选项：precision、sourceComments
                             */
                            implementation: require( 'sass' ),
                            sassOptions: {
                                // 作者自己说这个库已经过时了，不建议再使用它了！设置成false就可以禁用它，而不是不设置，因为默认是启用它的。
                                fiber: false,
                                indentedSyntax: false,
                                indentType: 'space',
                                indentWidth: 2,
                                // cr、crlf、lf、lfcr
                                linefeed: 'lf',
                                /*
                                 nested(嵌套)、expanded(扩大)、compact(紧凑)、compressed(压缩)
                                 使用“dart-sass”实现的只支持：expanded(扩大)、compressed(压缩)
                                 */
                                outputStyle: isPro
                                             ? 'compressed'
                                             : 'expanded',
                                // Dart Sass默认为所有现有浏览器提供足够高的精度，并且使其可自定义将使代码的效率大大降低。
                                // precision: 6,
                            },
                            // 在某些情况下，这可以提高性能。请谨慎使用，因为以〜开头的别名和@import规则将不起作用。您可以通过自己的进口商解决此问题（请参阅进口商文档）。
                            webpackImporter: true,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/styles/scss/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/css/' ),
                    path.resolve( __dirname, './src/styles/less/' ),
                    path.resolve( __dirname, './src/styles/postcss/' ),
                    path.resolve( __dirname, './src/styles/sass/' ),
                    path.resolve( __dirname, './src/styles/stylus/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                sideEffects: true,
            },
            {
                test: /\.less$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:contenthash:hex:6].css',
                            // publicPath: '../',
                            outputPath: './styles/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        }
                    },
                    {
                        loader: 'extract-loader',
                        options: {
                            // publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true,
                            importLoaders: 1,
                            esModule: false,
                            sourceMap: false,
                        },
                    },
                    postCSSLoader_fun( isPro ),
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                // （不建议使用） 它已由math选项代替。
                                // strictMath: true,
                                // always(当前默认值)、parens-division(未来会成为默认值)、parens | strict(等效于：strictMath: true)、strict-legacy(不推荐)
                                math: 'strict-legacy',
                                // 启用严格的单位，我们假设这是计算中的错误并引发错误。
                                strictUnits: true,
                                // 兼容性IE8，不推荐使用，从v3.0.0开始默认为False。当前仅用于data-uri函数，以确保不会创建太大的图像，以至于浏览器无法处理。
                                // ieCompat: true,
                                // 最新的文档没有找到这个选项信息
                                noIeCompat: true,
                            },
                            // 在某些情况下，这可以提高性能。请谨慎使用，因为以〜开头的别名和@import规则将不起作用。
                            webpackImporter: true,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/styles/less/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/css/' ),
                    path.resolve( __dirname, './src/styles/postcss/' ),
                    path.resolve( __dirname, './src/styles/sass/' ),
                    path.resolve( __dirname, './src/styles/scss/' ),
                    path.resolve( __dirname, './src/styles/stylus/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                sideEffects: true,
            },
            {
                test: /\.sass$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'styleTag',
                            insert: 'head',
                            esModule: false,
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true,
                            importLoaders: 2,
                            esModule: false,
                            sourceMap: false,
                        }
                    },
                    postCSSLoader_fun( isPro ),
                    {
                        loader: 'sass-loader',
                        options: {
                            /*
                             使用dart-sass实现
                             不支持以下选项：precision、sourceComments
                             */
                            implementation: require( 'sass' ),
                            sassOptions: {
                                // 作者自己说这个库已经过时了，不建议再使用它了！设置成false就可以禁用它，而不是不设置，因为默认是启用它的。
                                fiber: false,
                                indentedSyntax: true,
                                indentType: 'space',
                                indentWidth: 4,
                                // cr、crlf、lf、lfcr
                                linefeed: 'lf',
                                /*
                                 nested(嵌套)、expanded(扩大)、compact(紧凑)、compressed(压缩)
                                 使用“dart-sass”实现的只支持：expanded(扩大)、compressed(压缩)
                                 */
                                outputStyle: isPro
                                             ? 'compressed'
                                             : 'expanded',
                                // Dart Sass默认为所有现有浏览器提供足够高的精度，并且使其可自定义将使代码的效率大大降低。
                                // precision: 6,
                            },
                            // 在某些情况下，这可以提高性能。请谨慎使用，因为以〜开头的别名和@import规则将不起作用。您可以通过自己的进口商解决此问题（请参阅进口商文档）。
                            webpackImporter: true,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/styles/sass/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/css/' ),
                    path.resolve( __dirname, './src/styles/less/' ),
                    path.resolve( __dirname, './src/styles/postcss/' ),
                    path.resolve( __dirname, './src/styles/scss/' ),
                    path.resolve( __dirname, './src/styles/stylus/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                sideEffects: true,
            },
            {
                test: /\.(styl|stylus)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                        options: obj,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true,
                            importLoaders: 2,
                            esModule: false,
                            sourceMap: false,
                        }
                    },
                    postCSSLoader_fun( isPro ),
                    {
                        loader: 'stylus-loader',
                        options: {
                            stylusOptions: {
                                // 在@import上包含常规CSS。默认值是：false
                                includeCSS: false,
                                // 可用于解析导入文件中的相对URL，解决相对url（）内部导入的文件。
                                resolveURL: {
                                    // 其他解析路径
                                    // paths: '',
                                    // 不要检查文件是否存在
                                    nocheck: true,
                                },
                                // 在生成的CSS中发出注释，指示相应的手写笔行。默认值是：false
                                lineNumbers: isPro,
                                // 将@import和@charset移到顶部。默认值是：false
                                hoistAtrules: true,
                                // 压缩CSS输出。默认值是：false
                                compress: isPro,
                            },
                            // 在某些情况下，这可以提高性能。请谨慎使用，因为以〜开头的别名和@import规则将不起作用。
                            webpackImporter: true,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/styles/stylus/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/css/' ),
                    path.resolve( __dirname, './src/styles/less/' ),
                    path.resolve( __dirname, './src/styles/postcss/' ),
                    path.resolve( __dirname, './src/styles/sass/' ),
                    path.resolve( __dirname, './src/styles/scss/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                sideEffects: true,
            },
            {
                test: /\.(pcss|postcss)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'styleTag',
                            insert: 'head',
                            esModule: false,
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true,
                            importLoaders: 1,
                            esModule: false,
                            sourceMap: false,
                        }
                    },
                    postCSSLoader_fun( isPro ),
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/styles/postcss/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/css/' ),
                    path.resolve( __dirname, './src/styles/less/' ),
                    path.resolve( __dirname, './src/styles/sass/' ),
                    path.resolve( __dirname, './src/styles/scss/' ),
                    path.resolve( __dirname, './src/styles/stylus/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                sideEffects: true,
            },

            {
                test: /\.vue$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            transformAssetUrls: {
                                video: [
                                    'src',
                                    'poster',
                                ],
                                source: 'src',
                                img: 'src',
                                audio: 'src',
                                image: [
                                    'xlink:href',
                                    'href',
                                ],
                                use: [
                                    'xlink:href',
                                    'href',
                                ],
                            },
                            compilerOptions: {
                                // preserve保留、condense压缩
                                whitespace: 'condense',
                            },
                            prettify: !isPro,
                            exposeFilename: !isPro,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/vue/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },

            {
                test: /\.ts(x?)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            // 默认值是：false
                            cacheDirectory: !isPro,
                            // 默认值是：true
                            cacheCompression: true,
                            presets: babelPresets_fun( isPro, noTest_boo ),
                            plugins: babelPlugins_fun( isPro, noTest_boo, isESM_boo ),
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            // true禁用类型检查器-我们将在"fork-ts-checker-webpack-plugin"插件中使用它
                            transpileOnly: true,
                            // 重要！使用happyPackMode模式加快编译速度并减少报告给Webpack的错误
                            happyPackMode: true,
                            // 默认值：false
                            logInfoToStdOut: false,
                            // 默认值：warn，可选值：info、warn、error
                            logLevel: 'error',
                            // 默认值：false，如果为true，则不会发出console.log消息。请注意，大多数错误消息都是通过webpack发出的，不受此标志的影响。
                            silent: true,
                            // 默认值：number[]，您可以通过指定要忽略的诊断代码数组来抑制某些TypeScript错误。
                            // ignoreDiagnostics: [],
                            // 仅报告与这些全局模式匹配的文件中的错误。当某些类型定义具有对您的应用程序不致命的错误时，这很有用。
                            reportFiles: [
                                'src/components/**/*.{ts,tsx}',
                                'src/js/**/*.{ts,tsx}',
                                'src/vue/**/*.{ts,tsx}',
                                'src/vue/**/*.ts.vue',
                                'src/webComponents/**/*.{ts,tsx}',
                            ],
                            // 默认值：typescript，允许使用非官方的TypeScript编译器。应该设置为编译器的NPM名称，例如：ntypescript。
                            compiler: 'typescript',
                            // 允许您指定在哪里可以找到TypeScript配置文件。
                            configFile: path.resolve( __dirname, './tsconfig.json' ),
                            colors: true,
                            // 默认值：undefined
                            // errorFormatter: undefined,
                            // 允许覆盖TypeScript options(编译选项compiler options，TypeScript选项应使用tsconfig.json文件设置)。应该以与“tsconfig.json”中的“compilerOptions”属性相同的格式指定。
                            compilerOptions: compilerOptions_obj,
                            // 默认值：'TODO'，高级选项，强制文件通过TypeScript编译器的不同实例。可用于强制分离代码的不同部分。
                            // instance: 'TODO',
                            // 默认值：RegExp[]，要与文件名匹配的正则表达式列表。如果文件名与正则表达式之一匹配，则将.ts或.tsx后缀附加到该文件名。
                            appendTsSuffixTo: [
                                /\.ts\.vue$/i,
                                // If you're using HappyPack or thread-loader with ts-loader, you need use the string type for the regular expressions, not RegExp object.
                                // '\\.ts\\.vue$',
                            ],
                            // 默认值：RegExp[]，要与文件名匹配的正则表达式列表。如果文件名与正则表达式之一匹配，则将.ts或.tsx后缀附加到该文件名。
                            appendTsxSuffixTo: [
                                /\.tsx\.vue$/i,
                                // If you're using HappyPack or thread-loader with ts-loader, you need use the string type for the regular expressions, not RegExp object.
                                // '\\.tsx\\.vue$',
                            ],
                            // 默认值：false
                            onlyCompileBundledFiles: true,
                            // 默认值：false
                            allowTsInNodeModules: false,
                            // 默认值：undefined
                            // context: undefined,
                            // 默认值：true
                            experimentalFileCaching: true,
                            /*
                             默认值：false，
                             “ts-loader”支持“project references”。启用此配置选项后，“ts-loader”将像“tsc--build”那样增量地重建上游项目。
                             否则，引用项目中的源文件将被视为根项目的一部分。
                             */
                            projectReferences: true,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },

            {
                test: /\.(js|mjs|cjs)$/i,
                /*
                 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async'
                 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                 */
                type: 'javascript/auto',
                parser: {
                    // true启用 false禁用，启用 CommonJS
                    commonjs: true,
                    // 启用 ES2015 Harmony import/export
                    harmony: true,
                },
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    /*
                     将此装载机放在其他装载机的前面。以下加载程序在工作池中运行。
                     在工作池中运行的装载程序受到限制。例子：
                     1、加载程序无法发出文件。
                     2、加载程序无法使用自定义加载程序API（即通过插件）。
                     3、加载程序无法访问webpack选项。
                     PS：
                     1、只能将此装载机用于昂贵的操作！
                     2、每个工作程序都是一个单独的node.js进程，其开销约为600毫秒。进程间通信也有开销。
                     */
                    {
                        loader: 'thread-loader',
                        options: jsWorkerPool,
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            // 默认值是：false
                            cacheDirectory: !isPro,
                            // 默认值是：true
                            cacheCompression: true,
                            presets: babelPresets_fun( isPro, noTest_boo ),
                            plugins: babelPlugins_fun( isPro, noTest_boo, isESM_boo ),
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            // src/workers下的.js文件的特殊处理
            {
                test: /\.(js)$/i,
                /*
                 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async'
                 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                 */
                type: 'javascript/auto',
                parser: {
                    // 启用 CommonJS，true启用 false禁用
                    commonjs: true,
                    // 启用 ES2015 Harmony import/export
                    harmony: true,
                },
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:contenthash:hex:6].worker.js',
                            // publicPath: '../',
                            outputPath: './workers/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/workers/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                // sideEffects: true,
            },

            {
                test: /\.manifest\.json$/i,
                /*
                 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async'
                 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                 */
                type: 'javascript/auto',
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:contenthash:hex:6].[ext]',
                            // publicPath: '../',
                            outputPath: './others/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        }
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.json5$/i,
                /*
                 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async'
                 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                 */
                type: 'javascript/auto',
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'json5-loader',
                        options: {
                            esModule: true,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/assets/doc/json5/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/doc/txt/' ),
                    path.resolve( __dirname, './src/assets/doc/xml/' ),
                    path.resolve( __dirname, './src/assets/fonts/' ),
                    path.resolve( __dirname, './src/assets/img/' ),
                    path.resolve( __dirname, './src/assets/music/' ),
                    path.resolve( __dirname, './src/assets/videos/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.xml$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'xml-loader',
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/assets/doc/xml/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/doc/json/' ),
                    path.resolve( __dirname, './src/assets/doc/json5/' ),
                    path.resolve( __dirname, './src/assets/doc/txt/' ),
                    path.resolve( __dirname, './src/assets/fonts/' ),
                    path.resolve( __dirname, './src/assets/img/' ),
                    path.resolve( __dirname, './src/assets/music/' ),
                    path.resolve( __dirname, './src/assets/videos/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.txt$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'raw-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/assets/doc/txt/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/doc/json/' ),
                    path.resolve( __dirname, './src/assets/doc/json5/' ),
                    path.resolve( __dirname, './src/assets/doc/xml/' ),
                    path.resolve( __dirname, './src/assets/fonts/' ),
                    path.resolve( __dirname, './src/assets/img/' ),
                    path.resolve( __dirname, './src/assets/music/' ),
                    path.resolve( __dirname, './src/assets/videos/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.toml$/i,
                /*
                 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async'
                 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                 */
                type: 'json',
                parser: {
                    parse: toml.parse,
                },
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.yaml$/i,
                /*
                 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async'
                 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                 */
                type: 'json',
                parser: {
                    parse: yaml.parse,
                },
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.csv$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'csv-loader',
                        options: {
                            dynamicTyping: true,
                            header: true,
                            skipEmptyLines: true,
                        },
                    },
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),
                ],
                // sideEffects: true,
            },

            {
                test: /\.wasm$/i,
                /*
                 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async'
                 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                 */
                type: 'javascript/auto',
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:hash:hex:6].[ext]',
                            // publicPath: '../',
                            outputPath: './wasm/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        }
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },

            // 注意事项去看：notes/关于在JS和TS文件中导入和使用graphql文件时出现的BUG以及注意事项说明.txt
            {
                test: /\.(graphql|gql)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'webpack-graphql-loader',
                        options: {
                            // graphql自省查询架构JSON文件的位置。如果与validate选项一起使用，它将用于验证导入的查询和片段。
                            schema: './src/graphQL/GraphQL.Schema.json',
                            // 如果为true，则加载程序将根据您指定的模式文件验证导入的文档。
                            validate: false,
                            // 'string'、'document'
                            output: 'string',
                            // 如果为true且输出选项为字符串，则加载程序将从graphql文档字符串中删除注释和空格。这有助于减小捆绑的代码大小。
                            minify: isPro,
                            /*
                             如果为true，则加载程序将从导入的文档中删除未使用的碎片。
                             如果查询要从文件导入片段，但未使用该文件中的所有片段，则这可能很有用。
                             另请参阅此问题。
                             */
                            removeUnusedFragments: false,
                        },
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/graphQL/api/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/graphQL/doc/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },

            {
                test: /\.(jng|bmp|dcx|gif|icns|ico|jbig2|jpe|jpeg|jpg|pam|pbm|pcx|pgm|png|pnm|ppm|psd|rgbe|tga|tif|tiff|wbmp|xbm|xpm|svg|svgz|webp|heif|heic)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 以字节为单位，以下是限定为10kb
                            limit: 10240,
                            encoding: 'base64',
                            fallback: 'file-loader',
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:hash:hex:6].[ext]',
                            // publicPath: '../',
                            outputPath: './img/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        }
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/assets/img/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/doc/' ),
                    path.resolve( __dirname, './src/assets/fonts/' ),
                    path.resolve( __dirname, './src/assets/music/' ),
                    path.resolve( __dirname, './src/assets/videos/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.(eot|otf|fon|font|ttf|ttc|woff|woff2)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:hash:hex:6].[ext]',
                            // publicPath: '../',
                            outputPath: './fonts/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        }
                    },
                ],
                include: [
                    path.resolve( __dirname, './node_modules/' ),
                    // /node_modules[\\/](element-ui[\\/]).*\.ttf/,
                    // /node_modules[\\/](element-ui[\\/]).*\.woff/,
                    // /node_modules[\\/](swiper[\\/]).*\.ttf/,
                    // /node_modules[\\/](swiper[\\/]).*\.woff/,
                    path.resolve( __dirname, './src/assets/fonts/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    // /node_modules[\\/](?!element-ui[\\/]).*\.ttf/,
                    // /node_modules[\\/](?!element-ui[\\/]).*\.woff/,
                    // /node_modules[\\/](?!swiper[\\/]).*\.ttf/,
                    // /node_modules[\\/](?!swiper[\\/]).*\.woff/,
                    // path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/doc/' ),
                    path.resolve( __dirname, './src/assets/img/' ),
                    path.resolve( __dirname, './src/assets/music/' ),
                    path.resolve( __dirname, './src/assets/videos/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.(m4a|kar|ape|wav|wave|flac|wma|cda|aiff|au|mpeg|mpeg-1|mpeg-2|mpeg-layer3|mpeg-4|mp3|mp2|mp1|mid|midi|ra|rm|rmx|vqf|amr|aac|vorbis)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:hash:hex:6].[ext]',
                            // publicPath: '../',
                            outputPath: './music/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        }
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/assets/music/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/doc/' ),
                    path.resolve( __dirname, './src/assets/fonts/' ),
                    path.resolve( __dirname, './src/assets/img/' ),
                    path.resolve( __dirname, './src/assets/videos/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
            {
                test: /\.(wmv|asf|asx|rmvb|mp4|3gp|mov|m4v|avi|dat|mkv|flv|vob|mod|mng|mpg|3gpp|ogg|webm)$/i,
                // 可以通过传递多个加载程序来链接加载程序，这些加载程序将从右到左（最后配置到第一个配置）应用。
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // chunkhash hash contenthash
                            name: '[name]_[sha512:hash:hex:6].[ext]',
                            // publicPath: '../',
                            outputPath: './videos/',
                            /*
                             如果为true，则发出一个文件（将文件写入文件系统）。如果为false，则加载程序将返回公共URI，但不会发出文件。
                             禁用服务器端软件包的此选项通常很有用。
                             */
                            emitFile: true,
                            esModule: false,
                        }
                    },
                ],
                include: [
                    path.resolve( __dirname, './src/assets/videos/' ),
                    path.resolve( __dirname, './src/components/' ),
                    path.resolve( __dirname, './src/vue/' ),
                    path.resolve( __dirname, './src/webComponents/' ),
                ],
                exclude: [
                    path.resolve( __dirname, './assistTools/' ),
                    path.resolve( __dirname, './backups/' ),
                    path.resolve( __dirname, './bats/' ),
                    path.resolve( __dirname, './configures/' ),
                    path.resolve( __dirname, './dist/' ),
                    path.resolve( __dirname, './node_modules/' ),
                    path.resolve( __dirname, './notes/' ),
                    path.resolve( __dirname, './simServer/' ),
                    path.resolve( __dirname, './simServer4Deno/' ),
                    path.resolve( __dirname, './test/' ),
                    path.resolve( __dirname, './webpackRecords/' ),

                    path.resolve( __dirname, './src/assets/doc/' ),
                    path.resolve( __dirname, './src/assets/fonts/' ),
                    path.resolve( __dirname, './src/assets/img/' ),
                    path.resolve( __dirname, './src/assets/music/' ),
                    path.resolve( __dirname, './src/graphQL/' ),
                    path.resolve( __dirname, './src/js/' ),
                    path.resolve( __dirname, './src/pwa4Manifest/' ),
                    path.resolve( __dirname, './src/static/' ),
                    path.resolve( __dirname, './src/styles/' ),
                    path.resolve( __dirname, './src/tplEJS/' ),
                    path.resolve( __dirname, './src/tplHTML/' ),
                    path.resolve( __dirname, './src/wasm/' ),
                    path.resolve( __dirname, './src/workers/' ),
                ],
                // sideEffects: true,
            },
        ];
    },
    watchIgnored_arr = [
        path.resolve( __dirname, './.git/' ),
        path.resolve( __dirname, './.idea/' ),
        path.resolve( __dirname, './assistTools/' ),
        path.resolve( __dirname, './backups/' ),
        path.resolve( __dirname, './bats/' ),
        path.resolve( __dirname, './dist/' ),
        path.resolve( __dirname, './node_modules/' ),
        path.resolve( __dirname, './notes/' ),
        path.resolve( __dirname, './simServer/' ),
        path.resolve( __dirname, './simServer4Deno/' ),
        path.resolve( __dirname, './test/' ),
        path.resolve( __dirname, './webpackRecords/' ),
    ],
    watchOptions_obj = {
        // 以毫秒为单位
        aggregateTimeout: 200,
        ignored: watchIgnored_arr,
        // 以毫秒为单位
        poll: 1000,
    },
    copyWebpackPluginConfig_obj = {
        patterns: [
            {
                context: './src/',
                from: 'static',
                to: './static',
                toType: 'dir',
                force: true,
                globOptions: {
                    concurrency: osLen,
                    deep: Infinity,
                    ignore: [
                        '**/*.gitignore',
                        '**/该文件夹说明.txt',
                    ],
                },
                cacheTransform: true,
            },
            {
                context: './src/workers/',
                from: 'tools',
                to: './workers/tools',
                toType: 'dir',
                force: true,
                globOptions: {
                    concurrency: osLen,
                    deep: Infinity,
                    ignore: [
                        '**/*.gitignore',
                        '**/该文件夹说明.txt',
                    ],
                },
                cacheTransform: true,
            },
        ],
        options: {
            // 并发量，默认100
            concurrency: 100,
        },
    },
    cleanWebpackPluginConfig_fun = ( arg, isPro ) => ( {
        // 模拟删除文件的操作，true开启，开启后，不会真的删除硬盘上的文件
        dry: false,
        // 将日志写入控制台，true开启，当dry开启时，这个选项总是开启的
        verbose: false,
        /*
         在重建时自动删除所有未使用的webpack资产，true开启，默认值是false
         告诉CleanWebpackPlugin我们不想在watch触发增量构建后删除index.html文件。
         我们使用cleanStaleWebpackAssets选项执行此操作：cleanStaleWebpackAssets: false
         */
        cleanStaleWebpackAssets: isPro,
        // 不允许删除当前的webpack资产，true开启
        protectWebpackAssets: false,
        /*
         在Webpack编译之前删除一次文件，但是不包括重建过程中的文件（也就是监视模式）
         值为空数组时，表示禁用“cleanOnceBeforeBuildPatterns”的功能
         !test，表示排除test文件
         相对于Webpack的output.path目录。
         如果在webpack的output.path目录之外，请使用完整路径。path.join
         */
        //如：'**/*', '!static-files*'
        cleanOnceBeforeBuildPatterns: [
            path.join( __dirname, `./dist/${ arg }/fonts/*` ),
            path.join( __dirname, `./dist/${ arg }/img/*` ),
            path.join( __dirname, `./dist/${ arg }/js/*` ),
            path.join( __dirname, `./dist/${ arg }/music/*` ),
            path.join( __dirname, `./dist/${ arg }/others/*` ),
            path.join( __dirname, `./dist/${ arg }/pages/*` ),
            path.join( __dirname, `./dist/${ arg }/static/*` ),
            path.join( __dirname, `./dist/${ arg }/styles/*` ),
            path.join( __dirname, `./dist/${ arg }/videos/*` ),
            path.join( __dirname, `./dist/${ arg }/wasm/*` ),
            path.join( __dirname, `./dist/${ arg }/workers/*` ),

            `!${ path.join( __dirname, `./dist/${ arg }/fonts/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/img/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/js/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/music/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/others/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/pages/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/styles/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/videos/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/wasm/.gitignore` ) }`,
            `!${ path.join( __dirname, `./dist/${ arg }/workers/.gitignore` ) }`,
        ],
        /*
         在每次构建（包括监视模式）后删除与此模式匹配的文件。
         如：'static*.*', '!static1.js'
         */
        cleanAfterEveryBuildPatterns: [],
        // true开启，会删除匹配之外的文件
        dangerouslyAllowCleanPatternsOutsideProject: false,
    } ),
    recordsPath_fun = str => {
        const nowDate = new Date( Date.now() ),
            year = nowDate.getFullYear(),
            month = String( nowDate.getMonth() + 1 )
                .padStart( 2, '0' ),
            date = String( nowDate.getDate() )
                .padStart( 2, '0' ),
            hours = String( nowDate.getHours() )
                .padStart( 2, '0' ),
            minutes = String( nowDate.getMinutes() )
                .padStart( 2, '0' ),
            seconds = String( nowDate.getSeconds() )
                .padStart( 2, '0' ),
            day0 = Number( nowDate.getDay() ),
            day = day0 === 0
                  ? '日'
                  : day0,
            result_str = `./webpackRecords/${ str }/${ year }年${ month }月${ date }日${ hours }时${ minutes }分${ seconds }秒_周${ day }.json5`;

        return path.join( __dirname, result_str );
    },
    AssetsWebpackPluginOption_obj = {
        filename: 'ProjectAssets.json',
        fullPath: true,
        // 如果为true，则将自动删除webpack生成的/auto/前缀的完整路径。默认值是false。
        removeFullPathAutoPrefix: false,
        /*
         将清单javascript作为文本属性插入到资源中。接受清单块的名称。
         manifest是最后一个只包含webpack引导代码的CommonChunk。
         当您希望将清单内联到HTML框架中以进行长期缓存时，这对于生产使用非常有用。
         如：includeManifest: 'manifest'
         assets.json:
         {entries: {manifest: {js: `hashed_manifest.js`, text: 'function(modules)...'}}}

         Your html template:
         <script>
         {assets.entries.manifest.text}
         </script>
         */
        includeManifest: false,
        manifestFirst: true,
        useCompilerPath: false,
        prettyPrint: false,
        // 格式化资产输出。
        // processOutput: assets => `window.ProjectAssets = ${ JSON.stringify( assets ) }`,
        update: false,
        includeAllFileTypes: true,
        integrity: isPro,
        entrypoints: false,
        metadata: {
            version: '2020.01.01',
            assetsFileName: '../others/ProjectAssets.json',
            externalAssets: require( './configures/CacheResources.js' ).cacheResources,
        },
    },
    ForkTsCheckerWebpackPlugin_obj = {
        // 如果为true，则在完成webpack的编译后报告问题。因此，它不会阻止编译。仅在"watch"模式下使用。
        async: true,
        typescript: {
            enabled: true,
            // 单位：MB
            memoryLimit: 4096,
            configFile: path.resolve( __dirname, './tsconfig.json' ),
            // 此配置将覆盖tsconfig.json文件中的配置。支持的字段包括: extends, compilerOptions, include, exclude, files, and references.
            // configOverwrite: {},
            // context: '',
            build: false,
            /*
             如果使用“babel-loader”，建议使用"write-references"模式来提高初始编译时间。如果使用“ts-loader”，建议使用"write-tsbuildinfo"模式，以不覆盖“ts-loader”发出的文件。
             readonly write-tsbuildinfo write-references
             */
            mode: 'write-tsbuildinfo',
            // 用于选择我们要执行的诊断的设置。
            diagnosticsOptions: {
                // 句法，默认：false
                syntactic: true,
                // 语义，默认：true
                semantic: true,
                // 声明，默认：false
                declaration: true,
                // 全局，默认：false
                global: true,
            },
            // TypeScript扩展选项
            extensions: {
                vue: {
                    enabled: true,
                    // 将用于分析“.vue”文件的编译器的包名称。如果使用"nativescript-vue"，则可以使用“nativescript-vue-template-compiler”
                    compiler: 'vue-template-compiler',
                },
            },
            // 测量并打印与TypeScript性能相关的计时
            profile: false,
            // 如果提供，这是可以在其中找到TypeScript的自定义路径。
            typescriptPath: require.resolve( 'typescript' ),
        },
        // 可选值：true | undefined
        eslint: undefined,
        issue: {
            include: undefined,
            exclude: undefined,
            /*
             'all' or 'webpack'，定义要报告的问题范围。如果为“ webpack”，则仅报告与webpack编译相关的错误。否则报告所有错误（例如tsc和eslint命令）。
             v6.0.0-alpha.1中删除了"scope"选项！！！
             */
            // scope: 'all',
        },
        // formatter: {},
        // 可用的记录器为: silent, console, and webpack-infrastructure
        logger: {
            // 基础设施
            infrastructure: 'silent',
            // 问题
            issues: 'console',
            devServer: true,
        },
    },
    ForkTsCheckerNotifierWebpackPlugin_obj = {
        // 通知中显示的标题前缀。
        title: 'WebProTpl Notice!!!',
        // 如果设置为true，警告将不会引起通知。
        excludeWarnings: true,
        // 每次触发通知。称其为“噪音模式”。
        alwaysNotify: false,
        // 不要在第一个版本上通知。这使您可以在后续增量构建上收到通知，而无需在初始构建上得到通知。
        skipFirstNotification: true,
        // 跳过有关成功构建的通知。
        skipSuccessful: true,
    },
    cache_fun = isPro => {
        return {
            /*
             memory选项非常简单，它告诉webpack将缓存存储在内存中，并且不允许进行其他配置！
             将cache.type设置为"filesystem"时，会打开更多配置选项。
             */
            type: 'memory',
        };
    },
    experiments_obj = {
        // 这是不推荐的在Webpack 4中的实验性选项
        // syncWebAssembly: true,
        // 这是推荐的在Webpack 5中的最新的WASM集成规范
        asyncWebAssembly: true,
        topLevelAwait: true,
        outputModule: false,
    };

module.exports = {
    entry_obj,
    output_fun,
    resolve_fun,
    externals_obj,
    performance_obj,
    optimization_fun,
    defineObj_fun,
    splitChunks_obj,
    provide_obj,
    moduleRules_fun,
    watchIgnored_arr,
    watchOptions_obj,
    copyWebpackPluginConfig_obj,
    cleanWebpackPluginConfig_fun,
    recordsPath_fun,
    AssetsWebpackPluginOption_obj,
    ForkTsCheckerWebpackPlugin_obj,
    ForkTsCheckerNotifierWebpackPlugin_obj,
    cache_fun,
    experiments_obj,
};
