/**
 * Project: web-project-template
 * FileDirPath: configures/my_diy_webpack_tools/sharp_minify_diy/SharpMinify_DIY.esm.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2026-07-01 13:08:10 星期三
 */

/**
 * 该DIY工具扩展自“image-minimizer-webpack-plugin v5.0.0”。
 */

'use strict';

import {
  extname,
} from 'node:path';

import {
  Image as CrossImage,
} from 'cross-image';

import {
  fileTypeFromBuffer,
} from 'file-type';

import {
  IsAPNG,
  APNGOptimizer,
} from '../apng_optimizer_diy/APNGOptimizer_DIY.esm.mjs';

import {
  MyConsole,
} from '../../UniversalToolForNode.esm.mjs';

/**
 * 通过DIY扩展ImageMinimizerPlugin.sharpTransform，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。<br />
 * 1、该DIY工具扩展自“image-minimizer-webpack-plugin v5.0.0”。<br />
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
 * @returns {Promise<{filename: string; data: Buffer; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} minified result
 */
async function APNGOptimizer_DIY( original, options = {}, targetFormat = null ){
  const apngEncodeOptionsDefault = {
      // 0: zlib（压缩优化速度：快）, 1（默认值）: 7zip（压缩优化速度：很快）, 2: zopfli（压缩优化速度：慢）
      deflateMethod: 1,
      iter: 15,
      minQuality: 0,
      maxQuality: 100,
      processCallback( progress ){
        // MyConsole.Blue( `\n${ progress }\n` );
      },
    },
    encodeOptions = options.encodeOptions?.apng ?? apngEncodeOptionsDefault;

  /**
   * 压缩优化后的图片数据。
   *
   * @type {Uint8Array}
   */
  const resultData = await APNGOptimizer.createOptimizer().then( optimizer => {
    // Uint8Array
    return optimizer.optAPNG( original.data, {
      ...apngEncodeOptionsDefault,
      ...encodeOptions,
    } );
  } );

  const inputExt = extname( original.filename ).slice( 1 ).toLowerCase();

  if(
    ![
      'png',
      'apng',
    ].includes( inputExt )
  ){
    MyConsole.Yellow( `
注意：${ original.filename }，图片文件的后缀名不是“.png”、“.apng”，但是在读取该图片文件的数据时，发现其实际数据是“apng”编码的图片数据。
显然该图片文件的后缀名并不对，请排查该图片文件的后缀名，建议将其后缀名改成“.png”或“.apng”。
合规的“apng”编码的图片文件的后缀名可以是“.png”、“.apng”。
` );
  }

  // 具体实现可以参考：image-minimizer-webpack-plugin/dist/utils.js:859
  if( 'rotate' in options ){
    MyConsole.Yellow( `
注意：${ original.filename }，是“apng”编码的图片。
当前DIY的功能还不支持“rotate”属性的处理。如果需要，可以自行前往“configures/my_diy_webpack_tools/sharp_minify_diy/SharpMinify_DIY.esm.mjs”，对其进行DIY扩展。
` );
  }

  // 具体实现可以参考：image-minimizer-webpack-plugin/dist/utils.js:867
  if( 'resize' in options ){
    MyConsole.Yellow( `
注意：${ original.filename }，是“apng”编码的图片。
当前DIY的功能还不支持“resize”属性的处理。如果需要，可以自行前往“configures/my_diy_webpack_tools/sharp_minify_diy/SharpMinify_DIY.esm.mjs”，对其进行DIY扩展。
` );
  }

  // { ext: 'jpg', mime: 'image/jpeg' }
  const fileTypeResult = await fileTypeFromBuffer( original.data );

  const outputFormat = targetFormat ?? fileTypeResult.ext.toLowerCase();

  // ====== rename ======

  const outputExt = targetFormat
                    ? outputFormat
                    : inputExt;

  const {
    width,
    height,
  } = await CrossImage.decode( original.data );

  const sizeSuffix = typeof options.sizeSuffix === 'function'
                     ? options.sizeSuffix( width, height )
                     : '';

  const dotIndex = original.filename.lastIndexOf( '.' );

  const filename = dotIndex > -1
                   ? `${ original.filename.slice( 0, dotIndex ) }${ sizeSuffix }.${ outputExt }`
                   : original.filename;

  const processedFlag = targetFormat
                        ? 'generated'
                        : 'minimized';

  const processedBy = targetFormat
                      ? 'generatedBy'
                      : 'minimizedBy';

  return {
    filename,
    data: Buffer.from( resultData.buffer, resultData.byteOffset, resultData.byteLength ),
    warnings: [ ...original.warnings ],
    errors: [ ...original.errors ],
    info: {
      ...original.info,
      width,
      height,
      [ processedFlag ]: true,
      [ processedBy ]: [
        'SharpMinify_DIY',
        ...( original.info?.[ processedBy ] ?? [] ),
      ],
    },
  };
}

/**
 * 通过DIY扩展ImageMinimizerPlugin.sharpMinify，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。<br />
 * 1、该DIY工具扩展自“image-minimizer-webpack-plugin v5.0.0”。<br />
 *
 * @param {import('image-minimizer-webpack-plugin').sharpMinify} sharpMinify image-minimizer-webpack-plugin.sharpMinify
 *
 * @returns {function(original: {filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};}, options: Record<string, any> | undefined): Promise<{filename: string; data: Buffer; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} 自定义函数
 */
function SharpMinify_DIY( sharpMinify ){
  /**
   * 通过DIY扩展ImageMinimizerPlugin.sharpMinify，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。<br />
   * 1、该DIY工具扩展自“image-minimizer-webpack-plugin v5.0.0”。<br />
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
   * @returns {Promise<{filename: string; data: Buffer; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} minified result
   */
  return async function My_Minify_DIY( original, options ){
    if( IsAPNG( original.data ) ){
      return await APNGOptimizer_DIY( original, options );
    }
    else{
      return await sharpMinify( original, options );
    }
  };
}

/**
 * 通过DIY扩展ImageMinimizerPlugin.sharpGenerate，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。<br />
 * 1、该DIY工具扩展自“image-minimizer-webpack-plugin v5.0.0”。<br />
 *
 * @param {import('image-minimizer-webpack-plugin').sharpGenerate} sharpGenerate image-minimizer-webpack-plugin.sharpGenerate
 *
 * @returns {function(original: {filename: string; data: Uint8Array; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};}, options: Record<string, any> | undefined): Promise<{filename: string; data: Buffer; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} 自定义函数
 */
function SharpGenerate_DIY( sharpGenerate ){
  /**
   * 通过DIY扩展ImageMinimizerPlugin.sharpGenerate，来支持对图片后缀名为“.apng”的图片、图片后缀名为“.png”但是实际内部数据是“apng”格式的图片进行压缩优化。<br />
   * 1、该DIY工具扩展自“image-minimizer-webpack-plugin v5.0.0”。<br />
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
   * @returns {Promise<{filename: string; data: Buffer; warnings: Error[]; errors: Error[]; info: import('webpack').AssetInfo & {[worker.isFilenameProcessed]?: boolean;};} | null>} minified result
   */
  return async function My_Generate_DIY( original, options ){
    if( IsAPNG( original.data ) ){
      const sharpOptions = options ?? {};

      const targetFormats = Object.keys( sharpOptions.encodeOptions ?? {} );

      if( targetFormats.length === 0 ){
        const error = new Error( `No result from 'SharpGenerate_DIY' for '${ original.filename }', please configure the 'encodeOptions' option to generate images` );

        original.errors.push( error );

        return Promise.resolve( null );
      }

      if( targetFormats.length > 1 ){
        const error = new Error( `Multiple values for the 'encodeOptions' option is not supported for '${ original.filename }', specify only one codec for the generator` );

        original.errors.push( error );

        return Promise.resolve( null );
      }

      const [
        targetFormat,
      ] = targetFormats;

      return await APNGOptimizer_DIY( original, sharpOptions, targetFormat );
    }
    else{
      return await sharpGenerate( original, options );
    }
  };
}

export {
  SharpMinify_DIY,
  SharpGenerate_DIY,
};

export default {
  SharpMinify_DIY,
  SharpGenerate_DIY,
};
