/*
 Project: web-project-template
 FileDirPath: configures/HtmlWebpackPluginConfig.esm.mjs
 Author: 12278
 Email: 1227839175@qq.com
 IDE: WebStorm
 CreateDate: 2022-07-23 11:31:26 星期六
 */

/**
 * 如果您有使用它的插件，则应在任何集成插件之前先订购html-webpack-plugin。
 */

'use strict';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import entryConfig from './EntryConfig.esm.mjs';

/**
 * 根据传入的函数参数currentEntryName做处理，排除掉非当前入口的模块，避免在当前页面引入非此页面需要的模块。<br />
 * PS：<br />
 * 1、已经对当前入口依赖的其他入口项做了处理，不会排除依赖项的。<br />
 *
 * @param currentEntryName string 当前入口的key名，不能为空字符串，必需。<br />
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
 * @param isProduction boolean 值为true时表示生产环境，反之开发环境，该值依赖CLI参数中的“--mode”参数值，必需。<br />
 *
 * @param isSPA boolean 是否将项目设置成单页面应用程序(SPA)，true表示单页面应用程序(SPA)，false表示多页面应用程序(MPA)，必需。<br />
 *
 * @param HTMLMinifyConfig object 压缩HTML的配置选项，必需。<br />
 *
 * @returns {HtmlWebpackPlugin[]} 返回一个数组，里面是HtmlWebpackPlugin实例。
 */
function HTMLWebpackPluginConfig( {
  isProduction,
  isSPA,
  HTMLMinifyConfig,
} ){
  // 一般只要配置该变量就行。
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
      data: {},
    },

    {
      title: 'Home',
      filename: 'pages/Home.html',
      template: './src/template/ejs/Home.ejs',
      excludeChunks: isSPA
                     ? []
                     : ExcludeChunks( 'Home' ),
      meta: {},
      data: {},
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
