#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-shadow-realm --experimental-vm-modules --experimental-wasm-modules --experimental-websocket --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: upload-for-multiple
 * FileDirPath: configures/update_graphQL_schema_json/UpdateGraphQLSchemaJSON.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 动态更新“GraphQL.Schema.json”。
 */

'use strict';

import {
  readFileSync,
  writeFileSync,
} from 'node:fs';

/*
 import {
 get,
 request,
 } from 'node:http';
 */

import {
  get,
  request,
} from 'node:https';

import {
  dirname,
  join,
} from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

import {
  MyConsole,
} from '../UniversalToolForNode.esm.mjs';

function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

const __dirname = Get__dirname( import.meta.url ),
  schemaJSONPath = join( __dirname, '../../src/graphQL/GraphQL.Schema.json' ),
  mySchemaJSONGraphQL = JSON.stringify( {
    query: readFileSync( join( __dirname, '../../src/graphQL/api/GetSchemaJSON.graphql' ), {
      encoding: 'utf8',
    } ),
  }, null, 4 );

// 获取"系统默认"的"GraphQL的Schema文档"。
if( false ){
  // 一般形如：http://192.168.1.3:8087/graphql/schema.json
  const devURL001 = {
    protocol: 'https:',
    host: '127.0.0.1',
    port: '9200',
    path: '/graphql/schema.json',
    method: 'GET',
    headers: {
      // 对于那些后端服务器不对返回的数据做压缩处理的，还是不要带上这个请求头了，否则会导致返回给客户端的数据出现乱码。
      // 'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Request-Headers': 'Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
      'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
      'User-Agent': 'My NodeJS for UpdateGraphQLSchemaJSON',
    },
    ca: readFileSync( join( Get__dirname( import.meta.url ), '../openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA.crt' ), 'utf8' ),
    key: readFileSync( join( Get__dirname( import.meta.url ), '../openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA_Key.key' ), 'utf8' ),
    cert: readFileSync( join( Get__dirname( import.meta.url ), '../openssl/HTTPSSL001/002服务端CA证书/HTTPSSL001_Servers_CA.crt' ), 'utf8' ),
  };

  function UpdateGraphQLSchemaJSON( opt = {} ){
    return new Promise( ( resolve = () => {
    }, reject = () => {
    } ) => {
      get( opt, res => {
        const {
          statusCode,
        } = res;

        const contentType = res.headers[ 'content-type' ];

        let error = null;

        if( Number( statusCode ) !== 200 ){
          error = new Error( `Request Failed.\nStatus Code: ${ statusCode }.` );
        }
        else if( !/^application\/json/.test( contentType ) ){
          error = new Error( `Invalid content-type.\nExpected application/json but received ${ contentType }.` );
        }

        if( error ){
          // 使用响应数据释放内存。
          res.resume();

          reject( error );

          return error;
        }

        res.setEncoding( 'utf8' );

        let rawData = '';

        res.on( 'data', chunk => {
          rawData += chunk;
        } );

        res.on( 'end', () => {
          try{
            resolve( JSON.parse( rawData ) );
          }
          catch( e ){
            reject( e );
          }
        } );
      } ).on( 'error', e => {
        reject( e );
      } );
    } );
  }

  UpdateGraphQLSchemaJSON( devURL001 )
    .then( result => {
      writeFileSync( schemaJSONPath, JSON.stringify( Object.assign( {
        __schema: {},
      }, result.data ), null, 4 ) );
    } )
    .catch( e => {
      MyConsole.Red( `\n${ e.message }\n` );
    } );
}

// 获取"自己定义"的更加全面详细的"GraphQL的Schema文档"。
if( false ){
  // 一般形如：http://192.168.1.3:8087/graphql/
  const devURL001 = {
    protocol: 'https:',
    host: '127.0.0.1',
    port: '9200',
    path: '/graphql/',
    method: 'POST',
    headers: {
      // 对于那些后端服务器不对返回的数据做压缩处理的，还是不要带上这个请求头了，否则会导致返回给客户端的数据出现乱码。
      // 'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Request-Headers': 'Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
      'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
      'User-Agent': 'My NodeJS for UpdateGraphQLSchemaJSON',
    },
    ca: readFileSync( join( Get__dirname( import.meta.url ), '../openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA.crt' ), 'utf8' ),
    key: readFileSync( join( Get__dirname( import.meta.url ), '../openssl/HTTPSSL001/001根CA证书/HTTPSSL001_Root_CA_Key.key' ), 'utf8' ),
    cert: readFileSync( join( Get__dirname( import.meta.url ), '../openssl/HTTPSSL001/002服务端CA证书/HTTPSSL001_Servers_CA.crt' ), 'utf8' ),
  };

  function UpdateGraphQLSchemaJSON( opt = {} ){
    return new Promise( ( resolve = () => {
    }, reject = () => {
    } ) => {
      const req = request( opt, res => {
        const {
          statusCode,
        } = res;

        const contentType = res.headers[ 'content-type' ];

        let error = null;

        if( Number( statusCode ) !== 200 ){
          error = new Error( `Request Failed.\nStatus Code: ${ statusCode }.` );
        }
        else if( !/^application\/json/.test( contentType ) ){
          error = new Error( `Invalid content-type.\nExpected application/json but received ${ contentType }.` );
        }

        if( error ){
          // 使用响应数据释放内存。
          res.resume();

          reject( error );

          return error;
        }

        res.setEncoding( 'utf8' );

        let rawData = '';

        res.on( 'data', chunk => {
          rawData += chunk;
        } );

        res.on( 'end', () => {
          try{
            resolve( JSON.parse( rawData ) );
          }
          catch( e ){
            reject( e );
          }
        } );
      } );

      req.on( 'error', e => {
        reject( e );
      } );

      req.write( mySchemaJSONGraphQL );

      req.end();
    } );
  }

  UpdateGraphQLSchemaJSON( devURL001 )
    .then( result => {
      writeFileSync( schemaJSONPath, JSON.stringify( Object.assign( {
        __schema: {},
      }, result.data ), null, 4 ) );
    } )
    .catch( e => {
      MyConsole.Red( `\n${ e.message }\n` );
    } );
}
