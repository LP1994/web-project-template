/**
 * Project: web-project-template
 * FileDirPath: openssl/2022002/GetCertificates.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 用于生成两个“.pem”文件。
 */

'use strict';

import {
  readFileSync,
  writeFileSync,
} from 'node:fs';

import {
  dirname,
  join,
} from 'node:path';

import {
  fileURLToPath,
} from 'node:url';

import pem from 'pem';

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param import_meta_url {string} 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

/**
 * 表示项目文件夹根目录，不是磁盘根目录。<br />
 *
 * @type {string}
 */
const __dirname = Get__dirname( import.meta.url );

/**
 * 生成自定义的https证书。<br />
 *
 * @returns {Promise<{ key, cert, ca }>}
 */
function GetCertificates(){
  const keyFile = readFileSync( join( __dirname, './server2022002.key' ), 'utf8' ),
    certFile = readFileSync( join( __dirname, './server2022002.crt' ), 'utf8' );

  return new Promise( ( resolve, reject ) => {
    pem.createCSR( {
      clientKey: keyFile,
      commonName: 'localhost',
      organization: 'openssl2022002',
      locality: 'FuZhou',
      country: 'CN',
      state: 'ID',
    }, function ( error, results ){
      if( error ){
        reject( {
          error,
          results,
        } );

        throw error;
      }

      pem.createCertificate( {
        serviceKey: keyFile,
        serviceCertificate: certFile,
        csr: results.csr,
        days: 36500,
      }, function ( error, keys ){
        if( error ){
          reject( {
            error,
            keys,
          } );

          throw error;
        }

        resolve( {
          key: keys.serviceKey,
          cert: keys.certificate,
          ca: certFile,
        } );
      } );
    } );
  } );
}

/**
 * @type {{key, cert, ca}}
 */
const myCertificates = await GetCertificates();

writeFileSync( join( __dirname, './server2022002cert.pem' ), myCertificates.cert, {
  flag: 'w+',
  encoding: 'utf8',
} );
writeFileSync( join( __dirname, './server2022002key.pem' ), myCertificates.key, {
  flag: 'w+',
  encoding: 'utf8',
} );
