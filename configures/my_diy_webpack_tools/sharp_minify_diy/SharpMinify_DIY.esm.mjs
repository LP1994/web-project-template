/**
 * Project: web-project-template
 * FileDirPath: configures/my_diy_webpack_tools/sharp_minify_diy/SharpMinify_DIY.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2026-07-01 13:08:10 星期三
 */

'use strict';

import {
  IsAPNG,
  APNGOptimizer,
} from '../apng_optimizer_diy/APNGOptimizer_DIY.esm.mjs';

/**
 * 通过DIY扩展ImageMinimizerPlugin.sharpMinify，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。
 *
 * @param {{filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};}} original original worker result
 * @param {string} original.filename filename
 * @param {Uint8Array} original.data data uint8Array
 * @param {Error[]} original.warnings warnings
 * @param {Error[]} original.errors errors
 * @param {import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;}} original.info asset info
 *
 * @param {Record<string, any> | undefined} options options
 *
 * @param {any | null} targetFormat target format
 *
 * @returns {Promise<{filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} minified result
 */
async function SharpTransform_DIY( original, options = {}, targetFormat = null ){
  await APNGOptimizer.createOptimizer().then( optimizer => {
    // Uint8Array   7zip
    return optimizer.optAPNG( original.data, {
      // 0: zlib, 1: 7zip, 2: zopfli
      deflateMethod: 1,
      iter: 15,
      minQuality: 0,
      maxQuality: 100,
      processCallback: function ( progress ){
        // console.log( `\n${ progress }\n` );
      },
    } );
  } );

  return {};
}

/**
 * 通过DIY扩展ImageMinimizerPlugin.sharpMinify，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。
 *
 * @param {import('image-minimizer-webpack-plugin').sharpMinify} sharpMinify image-minimizer-webpack-plugin.sharpMinify
 *
 * @returns {function(original: {filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};}, options: Record<string, any> | undefined): Promise<{filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} 自定义函数
 */
function SharpMinify_DIY( sharpMinify ){
  /**
   * 通过DIY扩展ImageMinimizerPlugin.sharpMinify，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。
   *
   * @param {{filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};}} original original worker result
   * @param {string} original.filename filename
   * @param {Uint8Array} original.data data uint8Array
   * @param {Error[]} original.warnings warnings
   * @param {Error[]} original.errors errors
   * @param {import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;}} original.info asset info
   *
   * @param {Record<string, any> | undefined} options options
   *
   * @returns {Promise<{filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} minified result
   */
  return async function My_DIY( original, options ){
    if( IsAPNG( original.data ) ){
      return await SharpTransform_DIY( original, options );
    }

    return await sharpMinify( original, options );
  };
}

export {
  SharpMinify_DIY,
};

export default {
  SharpMinify_DIY,
};
