/**
 * Project: upload-for-multiple
 * FileDirPath: webpack.production.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 该配置是给“production”环境用的webpack配置。
 */

'use strict';

import {
  resolve,
} from 'node:path';

import {
  env,
} from 'node:process';

import AssetsWebpackPlugin from 'assets-webpack-plugin';

import {
  CleanWebpackPlugin,
} from 'clean-webpack-plugin';

import CopyPlugin from 'copy-webpack-plugin';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import ForkTsCheckerNotifierWebpackPlugin from 'fork-ts-checker-notifier-webpack-plugin';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import {
  ModuleFederationPlugin,
} from '@module-federation/enhanced/webpack';

/**
 * 供插件“typedoc-webpack-plugin”使用的配置参数。<br />
 * 说明：<br />
 * 1、该插件用于为使用TypeScript编写的代码生成其对应的文档，底层是基于“typedoc”的。<br />
 * 2、目前只建议该插件用于生产、测试环境下为指定的用TypeScript编写的文件生成其文档。<br />
 * 3、不要用于开发环境，因为在开发环境下在生成文档后会出现不停的出现webpack重编译的情况，而且，开发环境下也不需要实时生成文档，毕竟生成文档的过程也是耗时的。<br />
 * 4、关于使用该插件时需要的配置文件及其相关的，可参见“src/tools/ts/universal_tools/type_doc”文件夹下的“doc”文件夹、“README.md”文件、"typedoc.json"文件、“tsconfig.typedoc.json”文件，参照它们为其他需要生成文档的文件配置文件。<br />
 * 5、当前基于的“typedoc”版本为“0.23.21”。<br />
 * 6、如果需要为多个文件生成文档，只要配置多个诸如“{options: string}”这样的配置即可，所以变量“typedocWebpackPluginConfig”才是一个数组。<br />
 *
 * PS：<br />
 * 1、插件“typedoc-webpack-plugin”由于很久不更新了，依赖的“typedoc”版本也已经发生了很大的变动，所以个人直接修改了其源码，使其能配合webpack使用，修改后的代码见“backups/typedoc-webpack-plugin/index.js”。<br />
 *
 * 配置参数说明：<br />
 * 1、一般只要配置参数“options”即可，它表示“typedoc”要使用的“typedoc.json”配置文件路径，里面的写法可参见“src/tools/ts/universal_tools/type_doc”文件夹下的"typedoc.json"文件及其他相关的配置文件。<br />
 * 2、当然也支持其他参数，详细见：<br />
 * https://typedoc.org/schema.json <br />
 * https://typedoc.org/guides/options/ <br />
 * 3、“typedoc”的官方文档见：<br />
 * https://typedoc.org/guides/overview/ <br />
 * 4、参数“options”是描述配置文件的路径，所以要使用绝对路径（其他参数如果也是表示路径什么的，也要如此），如：options: resolve( __dirname, './src/tools/ts/universal_tools/type_doc/typedoc.json' )。<br />
 */
import TypedocWebpackPlugin from 'typedoc-webpack-plugin';

import {
  VueLoaderPlugin,
} from 'vue-loader';

import webpack from 'webpack';

import DashboardPlugin from 'webpack-dashboard/plugin/index.js';

import {
  SubresourceIntegrityPlugin,
} from 'webpack-subresource-integrity';

import {
  __dirname,
  isProduction,

  aliasConfig,
  assetsWebpackPluginConfig,
  cleanWebpackPluginConfig,
  copyPluginConfig,
  definePluginConfig,
  deterministicChunkIdsPluginConfig,
  deterministicModuleIdsPluginConfig,
  entryConfig,
  experimentsConfig,
  extensionsConfig,
  extensionAliasConfig,
  externalsConfig,
  forkTsCheckerWebpackPluginConfig,
  forkTsCheckerNotifierWebpackPluginConfig,
  htmlWebpackPluginConfig,
  limitChunkCountPluginConfig,
  minChunkSizePluginConfig,
  miniCssExtractPluginConfig,
  moduleConfig,
  moduleFederationPluginConfig,
  nodeConfig,
  optimizationConfig,
  outputConfig,
  performanceConfig,
  prefetchPluginConfig,
  providePluginConfig,
  recordsPathConfig,
  subresourceIntegrityPluginConfig,
  targetConfig,
  /**
   * 供插件“typedoc-webpack-plugin”使用的配置参数。<br />
   * 说明：<br />
   * 1、该插件用于为使用TypeScript编写的代码生成其对应的文档，底层是基于“typedoc”的。<br />
   * 2、目前只建议该插件用于生产、测试环境下为指定的用TypeScript编写的文件生成其文档。<br />
   * 3、不要用于开发环境，因为在开发环境下在生成文档后会出现不停的出现webpack重编译的情况，而且，开发环境下也不需要实时生成文档，毕竟生成文档的过程也是耗时的。<br />
   * 4、关于使用该插件时需要的配置文件及其相关的，可参见“src/tools/ts/universal_tools/type_doc”文件夹下的“doc”文件夹、“README.md”文件、"typedoc.json"文件、“tsconfig.typedoc.json”文件，参照它们为其他需要生成文档的文件配置文件。<br />
   * 5、当前基于的“typedoc”版本为“0.23.21”。<br />
   * 6、如果需要为多个文件生成文档，只要配置多个诸如“{options: string}”这样的配置即可，所以变量“typedocWebpackPluginConfig”才是一个数组。<br />
   *
   * PS：<br />
   * 1、插件“typedoc-webpack-plugin”由于很久不更新了，依赖的“typedoc”版本也已经发生了很大的变动，所以个人直接修改了其源码，使其能配合webpack使用，修改后的代码见“backups/typedoc-webpack-plugin/index.js”。<br />
   *
   * 配置参数说明：<br />
   * 1、一般只要配置参数“options”即可，它表示“typedoc”要使用的“typedoc.json”配置文件路径，里面的写法可参见“src/tools/ts/universal_tools/type_doc”文件夹下的"typedoc.json"文件及其他相关的配置文件。<br />
   * 2、当然也支持其他参数，详细见：<br />
   * https://typedoc.org/schema.json <br />
   * https://typedoc.org/guides/options/ <br />
   * 3、“typedoc”的官方文档见：<br />
   * https://typedoc.org/guides/overview/ <br />
   * 4、参数“options”是描述配置文件的路径，所以要使用绝对路径（其他参数如果也是表示路径什么的，也要如此），如：options: resolve( __dirname, './src/tools/ts/universal_tools/type_doc/typedoc.json' )。<br />
   */
    typedocWebpackPluginConfig,
} from './webpack.base.esm.mjs';

export default {
  /**
   * 在第1个错误上失败而不是容忍它。默认情况下，webpack会在终端以及使用HMR时的浏览器控制台中以红色记录这些错误，但会继续捆绑。<br />
   * 1、设置成true，这将强制webpack退出其捆绑过程，设置成false将容忍它。<br />
   * 2、避免在watch模式下使用bail选项，因为它会在发现错误时强制webpack尽快退出。<br />
   */
  bail: true,
  /**
   * 缓存生成的webpack模块和块以提高构建速度，开发启用，生产禁用。<br />
   * 1、true：启用内存缓存（等同于cache: { type: 'memory' }）；false：禁用内存缓存。<br />
   * 2、将cache.type设置为'filesystem'会打开更多配置选项。<br />
   * 3、将cache.type设置为'memory'，它告诉webpack将缓存存储在内存中，并且只允许几个其他配置！<br />
   * 4、cache.type设置为'memory'时，可以配合使用的部分选项说明：<br />
   * cacheUnaffected：启用版本5.54.0+，缓存未更改的模块的计算并仅引用未更改的模块。它只能与cache.type设置为'memory'一起使用，此外，必须启用experiments.cacheUnaffected才能使用它。<br />
   * maxGenerations：启用版本5.30.0+，定义内存缓存中未使用的缓存条目的寿命，它只能与cache.type设置为'memory'一起使用，cache.maxGenerations: 1，缓存条目在未用于单个编译后被删除；cache.maxGenerations: Infinity，缓存条目被永久保存。<br />
   */
  cache: false,
  context: resolve( __dirname, './' ),
  /**
   * 此选项控制是否以及如何生成源映射。<br />
   * 注意事项：<br />
   * 1、使用SourceMapDevToolPlugin进行更细粒度的配置。查看source-map-loader来处理现有的源映射。<br />
   * 2、除了使用devtool选项，您还可以直接使用SourceMapDevToolPlugin、EvalSourceMapDevToolPlugin，因为它有更多选项。永远不要同时使用“devtool选项”和“插件”，devtool选项在内部添加插件，因此您最终会应用两次插件。<br />
   * 3、其中一些值适合开发，一些适合生产。对于开发，您通常需要以捆绑大小为代价的快速Source Map，但对于生产，您需要准确且支持最小化的单独Source Map。<br />
   *
   * 快捷解释：<br />
   * hidden-*：未添加对SourceMap的引用。当SourceMap未部署但仍应生成时，例如，用于错误报告目的。<br />
   * eval-*：为每个模块生成SourceMap并通过eval附加它。推荐用于开发，因为改进了重建性能。请注意，有一个Windows Defender问题，由于病毒扫描而导致速度大幅下降。<br />
   *
   * 以下选项不适合“开发”或“生产”。某些特殊情况需要它们：<br />
   * inline-source-map：SourceMap作为DataUrl添加到包中。<br />
   * cheap-source-map：一个没有列映射的SourceMap，忽略了加载器Source Maps。<br />
   * inline-cheap-source-map：与cheap-source-map类似，但SourceMap作为DataUrl添加到包中。<br />
   * cheap-module-source-map：一个没有列映射的SourceMap，它将加载器Source Maps简化为每行一个映射。<br />
   * inline-cheap-module-source-map：与cheap-module-source-map类似，但SourceMap作为DataUrl添加到包中。<br />
   *
   * 1、开发环境，以下选项非常适合开发：<br />
   * eval：构建：快速，重建：最快，每个模块都使用eval()和//@ sourceURL执行。这是相当快的。主要缺点是它不能正确显示行号，因为它被映射到转译代码而不是原始代码（没有来自加载器的源映射）。<br />
   * eval-source-map：构建：最慢，重建：好的，使用高质量SourceMap进行开发构建的推荐选择。每个模块都使用eval()执行，并将SourceMap作为DataUrl添加到eval()。最初它很慢，但它提供了快速的重建速度并生成真实文件。行号被正确映射，因为它被映射到原始代码。它为开发提供最优质的SourceMap。<br />
   * eval-cheap-source-map：构建：好的，重建：快，与eval-source-map类似，每个模块都使用eval()执行。它很“cheap便宜”，因为它没有列映射，它只映射行号。它忽略来自Loaders的SourceMaps，只显示类似于eval devtool的转译代码。<br />
   * eval-cheap-module-source-map：构建：慢，重建：快，然而，与eval-cheap-source-map类似，在这种情况下，来自Loaders的Source Map被处理以获得更好的结果。然而，Loader Source Maps被简化为每行一个映射。<br />
   *
   * 2、生产环境，推荐的值（如果默认的webpack最小化器已被覆盖（例如自定义terser-webpack-plugin选项），请确保将其替换为sourceMap: true以启用SourceMap支持）：<br />
   * false：或者不设置这个devtool选项时，构建、重建的速度都是最快的，不发出SourceMap，具有最高性能的生产构建的推荐选择。<br />
   *
   * source-map：构建、重建的速度都是最慢的，具有高质量SourceMap的生产构建的推荐选择。<br />
   *   1)完整的SourceMap作为单独的文件发出。它将参考注释添加到包中，以便开发工具知道在哪里可以找到它。<br />
   *   2)您应该将您的服务器配置为禁止普通用户访问Source Map文件！
   *
   * hidden-source-map：构建、重建的速度都是最慢的，没有将参考注释添加到包中。仅将SourceMap用于错误报告目的时的可能选择。<br />
   *   1)与source-map相同，但不向捆绑包添加参考注释。如果您只希望SourceMaps从错误报告中映射错误堆栈跟踪，但不想为浏览器开发工具公开您的SourceMap，则很有用。<br />
   *   2)您不应将Source Map文件部署到Web服务器。而是仅将其用于错误报告工具。<br />
   *
   * nosources-source-map：构建、重建的速度都是最慢的，不包括源代码。<br />
   *   1)一个SourceMap是在其中不包含sourcesContent的情况下创建的。它可用于在客户端映射堆栈跟踪，而无需暴露所有源代码。您可以将Source Map文件部署到Web服务器。<br />
   *   2)它仍然公开文件名和结构以进行反编译，但不公开原始代码。<br />
   *
   * hidden-nosources-source-map：构建、重建的速度都是最慢的，无参考注释，不包括源代码。<br />
   */
  devtool: 'hidden-source-map',
  entry: entryConfig,
  experiments: experimentsConfig,
  externals: externalsConfig,
  /**
   * 基础设施级别日志记录的选项。<br />
   * 1、值类型Object：<br />
   * {<br />
   * appendOnly：保持先前的输出依旧存在而不是更新现有输出，这对状态消息很有用。此选项仅在未提供自定义控制台时使用。<br />
   * 1、启用版本：5.31.0+。<br />
   * 2、值类型boolean。<br />
   *
   * colors：为基础设施级别的日志记录启用彩色输出。此选项仅在未提供自定义控制台时使用。<br />
   * 1、启用版本：5.31.0+。<br />
   * 2、值类型boolean。<br />
   *
   * console：自定义用于基础架构级别日志记录的控制台。<br />
   * 1、启用版本：5.31.0+。<br />
   * 2、值类型Console。<br />
   *
   * debug：启用指定记录器的调试信息，例如插件或加载器。类似于stats.loggingDebug选项，但用于基础设施。默认为false。<br />
   * 1、有效值类型：<br />
   * string、boolean = false、RegExp、( name ) => boolean、[ string, RegExp, ( name ) => boolean ]。<br />
   *
   * level：值类型是string，启用基础设施日志记录输出。类似于stats.logging选项，但用于基础设施。默认为“info”。<br />
   * 1、有效值：<br />
   * none：禁用日志记录。<br />
   * error：仅错误。<br />
   * warn：仅错误和警告。<br />
   * info：错误、警告和信息消息。<br />
   * log：错误、警告、信息消息、日志消息、组、清除。折叠组以折叠状态显示。<br />
   * verbose：记录除调试和跟踪之外的所有内容。折叠组以展开状态显示。<br />
   *
   * stream：用于记录输出的流。默认为process.stderr。此选项仅在未提供自定义console时使用。<br />
   * 1、启用版本：5.31.0+。<br />
   * 2、默认值：process.stderr，值类型是NodeJS.WritableStream。<br />
   * }<br />
   */
  infrastructureLogging: {
    appendOnly: true,
    colors: true,
    level: 'warn',
  },
  mode: 'production',
  module: moduleConfig( {
    MiniCssExtractPlugin,
  } ),
  /**
   * 配置的名称。加载多个配置时使用。<br />
   */
  name: 'webpack.production.esm.mjs',
  node: nodeConfig,
  optimization: optimizationConfig,
  output: outputConfig,
  /**
   * 限制并行处理模块的数量。可用于微调性能或获得更可靠的分析结果。<br />
   * 1、最小值是：1。<br />
   */
  parallelism: 100,
  performance: performanceConfig,
  plugins: [
    ...( () => {
      return env?.npm_lifecycle_script?.includes( 'webpack-dashboard' )
             ? [ new DashboardPlugin(), ]
             : [];
    } )(),

    new ModuleFederationPlugin( moduleFederationPluginConfig ),

    // 如果您有使用它的插件，则应在任何集成插件之前先订购html-webpack-plugin。
    ...htmlWebpackPluginConfig,

    new AssetsWebpackPlugin( assetsWebpackPluginConfig ),

    new CleanWebpackPlugin( cleanWebpackPluginConfig ),

    new CopyPlugin( copyPluginConfig ),

    // 插件顺序很重要。错误的顺序将导致一些钩子未定义并且生成失败。该插件需要在ForkTsCheckerWebpackPlugin之前生效执行。
    new VueLoaderPlugin(),

    // 插件顺序很重要。错误的顺序将导致一些钩子未定义并且生成失败。ForkTsCheckerWebpackPlugin必须在ForkTsCheckerNotifierWebpackPlugin之前生效执行。
    new ForkTsCheckerWebpackPlugin( forkTsCheckerWebpackPluginConfig ),
    new ForkTsCheckerNotifierWebpackPlugin( forkTsCheckerNotifierWebpackPluginConfig ),

    /**
     * 请注意，如果您从webpack入口点导入CSS或在初始块中导入样式，则mini-css-extract-plugin不会将此CSS加载到页面中。<br />
     * 1、请使用html-webpack-plugin自动生成链接标签或使用链接标签创建index.html文件。<br />
     * 2、对于开发模式（包括webpack-dev-server），您可以使用style-loader，因为它使用多个<style></style>将CSS注入到DOM中并且运行速度更快。<br />
     * 3、在同一个“文件loader规则”中，不要同时使用style-loader和mini-css-extract-plugin，生产环境建议用mini-css-extract-plugin。<br />
     * 4、当处理“css module”风格的样式时，无论生产模式还是开发模式都强烈建议使用mini-css-extract-plugin处理它们。<br />
     */
    new MiniCssExtractPlugin( miniCssExtractPluginConfig ),

    new SubresourceIntegrityPlugin( subresourceIntegrityPluginConfig ),

    new webpack.DefinePlugin( definePluginConfig ),
    new webpack.ids.DeterministicChunkIdsPlugin( deterministicChunkIdsPluginConfig ),
    new webpack.ids.DeterministicModuleIdsPlugin( deterministicModuleIdsPluginConfig ),
    /**
     * 限制生成的代码块（chunk）数量。值类型为：number，无默认值。<br />
     * 1、如果生成的chunk数量超过maxChunks设置的值，Webpack会尝试合并某些chunk以满足该数量限制。<br />
     * 2、较大的值：如果你希望生成的chunk文件较多，可以设置一个较大的maxChunks。这会增加生成的文件数量，但会增加HTTP请求的数量。<br />
     * 3、较小的值：如果你希望Webpack自动优化拆分文件数目（通过合并一些文件），可以设置较小的maxChunks值。尽量少的文件数量，会减少HTTP请求的数量。<br />
     */
    new webpack.optimize.LimitChunkCountPlugin( limitChunkCountPluginConfig ),
    /**
     * 确保拆分出的代码块达到一定的最小尺寸。单位是：字节。无默认值。例如：1 * 1024，就表示：1KB。<br />
     * 1、确保拆分出来的每个chunk至少达到指定的最小大小。如果某个chunk的大小小于minChunkSize配置的值，Webpack会尝试将其合并到其他chunk中。<br />
     * 2、较大的值：如果你希望避免生成过小的文件，可以设置较大的minChunkSize。这会迫使Webpack合并那些过小的chunk。<br />
     * 3、较小的值：如果你希望拆分出更多的小文件（例如为了优化缓存策略或其他原因），可以设置较小的minChunkSize。<br />
     * 4、注意，如果设置的值大于某个动态加载文件的大小，且其会用作“预取”，那么会导致其被合并到其他文件中，从而使“预取”不生效，此时，只要更改该设置值成小于那个预取文件的大小就行。<br />
     */
    new webpack.optimize.MinChunkSizePlugin( minChunkSizePluginConfig ),
    ...prefetchPluginConfig,
    new webpack.ProvidePlugin( providePluginConfig ),

    /**
     * 供插件“typedoc-webpack-plugin”使用的配置参数。<br />
     * 说明：<br />
     * 1、该插件用于为使用TypeScript编写的代码生成其对应的文档，底层是基于“typedoc”的。<br />
     * 2、目前只建议该插件用于生产、测试环境下为指定的用TypeScript编写的文件生成其文档。<br />
     * 3、不要用于开发环境，因为在开发环境下在生成文档后会出现不停的出现webpack重编译的情况，而且，开发环境下也不需要实时生成文档，毕竟生成文档的过程也是耗时的。<br />
     * 4、关于使用该插件时需要的配置文件及其相关的，可参见“src/tools/ts/universal_tools/type_doc”文件夹下的“doc”文件夹、“README.md”文件、"typedoc.json"文件、“tsconfig.typedoc.json”文件，参照它们为其他需要生成文档的文件配置文件。<br />
     * 5、当前基于的“typedoc”版本为“0.23.21”。<br />
     * 6、如果需要为多个文件生成文档，只要配置多个诸如“{options: string}”这样的配置即可，所以变量“typedocWebpackPluginConfig”才是一个数组。<br />
     *
     * PS：<br />
     * 1、插件“typedoc-webpack-plugin”由于很久不更新了，依赖的“typedoc”版本也已经发生了很大的变动，所以个人直接修改了其源码，使其能配合webpack使用，修改后的代码见“backups/typedoc-webpack-plugin/index.js”。<br />
     *
     * 配置参数说明：<br />
     * 1、一般只要配置参数“options”即可，它表示“typedoc”要使用的“typedoc.json”配置文件路径，里面的写法可参见“src/tools/ts/universal_tools/type_doc”文件夹下的"typedoc.json"文件及其他相关的配置文件。<br />
     * 2、当然也支持其他参数，详细见：<br />
     * https://typedoc.org/schema.json <br />
     * https://typedoc.org/guides/options/ <br />
     * 3、“typedoc”的官方文档见：<br />
     * https://typedoc.org/guides/overview/ <br />
     * 4、参数“options”是描述配置文件的路径，所以要使用绝对路径（其他参数如果也是表示路径什么的，也要如此），如：options: resolve( __dirname, './src/tools/ts/universal_tools/type_doc/typedoc.json' )。<br />
     */
    ...( () => typedocWebpackPluginConfig.map( item => new TypedocWebpackPlugin( item ) ) )(),
  ],
  /**
   * 捕获应用程序的“配置文件”（捕获每个模块的计时信息），包括统计信息和提示，然后可以使用分析工具对其进行剖析。它还将注销模块计时的摘要。<br />
   * 1、结合profile: true和parallelism: 1以获得正确的时序。请注意，这也会减慢构建速度。<br />
   */
  profile: true,
  recordsPath: recordsPathConfig( 'production' ),
  resolve: {
    alias: aliasConfig,
    /**
     * 如果为true，则将不允许无扩展名的文件。设置成false就行。<br />
     * 1、强制解析器使用扩展选项中的一个扩展（用户必须指定不带扩展的请求）。<br />
     */
    enforceExtension: false,
    extensions: extensionsConfig,
    // 之所以设置该选项，系为了配合ts-loader的使用。
    extensionAlias: extensionAliasConfig,
    modules: [
      'node_modules',
    ],
    symlinks: false,
  },
  /**
   * 该选项可让您精确控制显示的捆绑信息。<br />
   * 1、值类型有3种：string、boolean、object。<br />
   * 2、值类型为string时表示webpack带有一些可用于统计输出的预设：<br />
   * errors-only：仅在发生错误时输出。<br />
   * errors-warnings：仅输出错误和警告。<br />
   * minimal：仅在发生错误或新编译时输出。<br />
   * none：无输出，等同于stats: false。<br />
   * normal：标准输出，等同于stats: true。<br />
   * verbose：输出一切。<br />
   * detailed：输出除了chunkModules和chunkRootModules之外的所有内容。<br />
   * summary：输出webpack版本、警告计数和错误计数。<br />
   */
  stats: 'normal',
  target: targetConfig,
  /**
   * 在webpack-dev-server和webpack-dev-middleware中默认启用watch模式。<br />
   */
  watch: false,
};
