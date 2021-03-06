/**
 * Author: 12278
 * CreateDate: 2022-01-01 00:00:00 星期六
 * Email: 1227839175@qq.com
 * FileDirPath: configures/update_graphQL_schema_json/UpdateGraphQLSchemaJSON.mjs
 * IDE: WebStorm
 * Project: web-project-template
 */

/**
 * 动态更新“GraphQL.Schema.json”。
 */

'use strict';

import {
  readFileSync,
  writeFileSync,
} from 'node:fs';

import {
  get,
  request,
} from 'node:http';

import {
  dirname,
  join,
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

const __dirname = Get__dirname( import.meta.url ),
  schemaJSONPath = join( __dirname, '../../src/graphQL/GraphQL.Schema.json' ),
  mySchemaJSONGraphQL = JSON.stringify( {
    query: readFileSync( join( __dirname, '../../src/graphQL/api/GetSchemaJSON.graphql' ), {
      encoding: 'utf8',
    } ),
  } );

// 获取"系统默认"的"GraphQL的Schema文档"。
if( false ){
  // 一般形如：http://192.168.1.196:8087/graphql/schema.json
  const devURL001 = {
    host: '192.168.1.196',
    port: '8087',
    path: '/graphql/schema.json',
    method: 'GET',
    headers: {
      'User-Agent': 'My NodeJS for UpdateGraphQLSchemaJSON',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
    },
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
    }, result.data ) ) );
  } )
  .catch( e => {
    console.error( e );
  } );
}

// 获取"自己定义"的更加全面详细的"GraphQL的Schema文档"。
if( false ){
  // 一般形如：http://192.168.1.196:8087/graphql/
  const devURL001 = {
    host: '192.168.1.196',
    port: '8087',
    path: '/graphql/',
    method: 'POST',
    headers: {
      'User-Agent': 'My NodeJS for UpdateGraphQLSchemaJSON',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
    },
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
    }, result.data ) ) );
  } )
  .catch( e => {
    console.error( e );
  } );
}
