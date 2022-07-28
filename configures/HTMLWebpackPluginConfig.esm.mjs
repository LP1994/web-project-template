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

function ExcludeChunks( currentEntryName ){
  const str1 = typeof entryConfig;

  if( str1 === 'string' || Array.isArray( entryConfig ) || str1 === 'function' ){
    return [];
  }
  else{
    const currentEntryConfig = entryConfig[ currentEntryName ],
      str2 = typeof currentEntryConfig;

    if( str2 === 'string' || Array.isArray( currentEntryConfig ) || str2 === 'function' ){
      return [];
    }
    else{
      const obj1 = Object.fromEntries( Object.entries( Object.keys( entryConfig ) ).map( item => item.reverse() ) );

      [
        currentEntryName,
        currentEntryConfig.dependOn ?? [],
      ].flat( Infinity ).forEach( item => {
        delete obj1[ item ];
      } );

      return Object.keys( obj1 );
    }
  }
}

function HTMLWebpackPluginConfig( {
  isProduction,
  isSPA,
  HTMLMinifyConfig,
} ){
  const config = [
    {
      title: 'HelloWorld',
      filename: 'pages/HelloWorld.html',
      template: './src/template/ejs/HelloWorld.ejs',
      excludeChunks: isSPA
                     ? []
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
         ? [ arr[ 0 ] ]
         : arr;
}

export {
  HTMLWebpackPluginConfig,
};

export default HTMLWebpackPluginConfig;
