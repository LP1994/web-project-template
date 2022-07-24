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

function ExcludeChunks( entryName ){
  const arr = [];

  Object.keys( entryConfig )
  .forEach( item => {
    if( item.trim() !== entryName.trim() ){
      arr.push( item );
    }
  } );

  return arr;
}

function HtmlWebpackPluginConfig( {
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
      minify: HTMLMinifyConfig,
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
  HtmlWebpackPluginConfig,
};

export default HtmlWebpackPluginConfig;
