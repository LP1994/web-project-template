/**
 * Project: web-project-template
 * FileDirPath: image_minimizer_for_sharp_by_multi_thread/WorkerThread.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 子线程，专门用于读取图片、压缩图片、生成图片。
 */

'use strict';

import {
  readFile,
  writeFile,
} from 'node:fs/promises';

import {
  join,
  parse,
} from 'node:path';

import {
  performance,
} from 'node:perf_hooks';

import {
  isMainThread,
  parentPort,
  threadId,
  workerData,
} from 'node:worker_threads';

import sharp from 'sharp';

import {
  MyConsole,
} from './UniversalToolForNode.esm.mjs';

let startTimer001 = 0,
  photoFileStream = null,
  resultObj = null,
  resultFilePath = '',
  resultFilePathParseObj = null,
  formats = new Map( [
    [
      'avif',
      'avif',
    ],
    [
      'jpeg',
      'jpeg',
    ],
    [
      'jpg',
      'jpeg',
    ],
    [
      'jpe',
      'jpeg',
    ],
    [
      'png',
      'png',
    ],
    [
      'raw',
      'raw',
    ],
    [
      'tiff',
      'tiff',
    ],
    [
      'tif',
      'tiff',
    ],
    [
      'webp',
      'webp',
    ],
    [
      'gif',
      'gif',
    ],
    [
      'jp2',
      'jp2',
    ],
    [
      'jpx',
      'jp2',
    ],
    [
      'j2k',
      'jp2',
    ],
    [
      'j2c',
      'jp2',
    ],
  ] ),
  encodeOptions = {
    // jpeg
    ...( () => {
      const config = {
        // 质量，值类型：number，默认值：80，值范围：1-100，可选。
        quality: 80,
        // 使用逐行（隔行）扫描，值类型：boolean，默认值：false，可选。
        progressive: false,
        // 色度二次采样，值类型：string，默认值：'4:2:0'（色度二次采样），设置为'4:4:4'以防止色度二次采样，可选。     
        chromaSubsampling: '4:4:4',
        // 优化霍夫曼编码表，值类型：boolean，默认值：true，可选。
        optimiseCoding: true,
        // optimiseCoding的替代拼写，值类型：boolean，默认值：true，可选。
        optimizeCoding: true,
        /**
         * 1、是否使用mozjpeg压缩优化。
         * 2、值类型：boolean，默认值：false，可选。<br />
         * 3、设置为true（相当于使用mozjpeg默认值，相当于{ trellisQuantisation: true, overshootDeringing: true, optimiseScans: true, quantisationTable: 3 }），表示使用mozjpeg压缩优化JPEG文件大小，会耗时，较慢。<br />
         * 4、设置为false，表示禁用mozjpeg压缩优化，不耗时。<br />
         */
        mozjpeg: true,
        // 应用网格量化，值类型：boolean，默认值：false，可选。
        trellisQuantisation: false,
        // 应用过冲去环，值类型：boolean，默认值：false，可选。
        overshootDeringing: false,
        // 优化逐行扫描，强制逐行扫描，值类型：boolean，默认值：false，可选。
        optimiseScans: false,
        // optimiseScans的替代拼写，值类型：boolean，默认值：false，可选。
        optimizeScans: false,
        // 要使用的量化表，值类型：number，默认值：0，值范围：0-8，可选。
        quantisationTable: 0,
        // quantisationTable的替代拼写，值类型：number，默认值：0，值范围：0-8，可选。
        quantizationTable: 0,
        // 强制JPEG输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
        force: true,
      };

      return {
        jpe: config,
        jpeg: config,
        jpg: config,
      };
    } )(),
    png: {
      // 使用逐行（隔行）扫描，值类型：boolean，默认值：false，可选。
      progressive: false,
      // zlib压缩级别，值类型：number，默认值：6，值范围：0（压缩速度最快，图片大小最大）-9（压缩速度最慢，图片大小最小），可选。
      compressionLevel: 6,
      // 使用自适应行过滤，值类型：boolean，默认值：false，可选。
      adaptiveFiltering: false,
      // 量化为具有Alpha透明度支持的基于调色板的图像，值类型：boolean，默认值：false，启用后压缩优化会较慢，可选。
      palette: true,
      // 使用达到给定质量所需的最少颜色数量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：100，可选。
      quality: 100,
      // CPU工作量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：7，值范围：1（最快）-10（最慢），可选。
      effort: 7,
      // 调色板条目的最大数量，需要将palette设置为true才可以应用该选项，值类型：number，默认值：256，可选。
      colours: 256,
      // colours的替代拼写，需要将palette设置为true才可以应用该选项，值类型：number，默认值：256，可选。
      colors: 256,
      // Floyd-Steinberg误差扩散级别，需要将palette设置为true才可以应用该选项，值类型：number，默认值：1.0，可选。
      dither: 1.0,
      // 强制PNG输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
      force: true,
    },
    webp: {
      // 质量，值类型：number，默认值：80，值范围：1-100，可选。
      quality: 80,
      // alpha层的质量，值类型：number，默认值：100，值范围：0-100，可选。
      alphaQuality: 100,
      // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
      lossless: false,
      // 使用near_lossless（接近无损的）压缩模式，值类型：boolean，默认值：false，可选。
      nearLossless: false,
      // 使用高质量的色度二次采样，值类型：boolean，默认值：false，可选。
      smartSubsample: false,
      // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-6（最慢），可选。
      effort: 4,
      // 动画迭代次数，使用0表示无限动画，值类型：number，默认值：0，可选。
      loop: 0,
      // 动画帧之间的延迟（以毫秒为单位），值类型：number、[ number ]，无默认值，可选。
      // delay: 1,
      // 强制WebP输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
      force: true,
    },
    gif: {
      // 调色板条目的最大数量，包括透明度，值类型：number，默认值：256，值范围：2-256，可选。
      colours: 256,
      // colours的替代拼写，值类型：number，默认值：256，值范围：2-256，可选。
      colors: 256,
      // CPU工作量，值类型：number，默认值：7，值范围：1（最快）-10（最慢），可选。
      effort: 7,
      // Floyd-Steinberg误差扩散级别，值类型：number，默认值：1.0，值范围：0（最小）-1（最大），可选。
      dither: 1.0,
      // 动画迭代次数，使用0表示无限动画，值类型：number，默认值：0，可选。
      loop: 0,
      // 动画帧之间的延迟（以毫秒为单位），值类型：number、[ number ]，无默认值，可选。
      // delay: 1,
      // 强制GIF输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
      force: true,
    },
    jp2: {
      // 质量，值类型：number，默认值：80，值范围：1-100，可选。
      quality: 80,
      // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
      lossless: false,
      // 水平tile尺寸，值类型：number，默认值：512，可选。
      tileWidth: 512,
      // 垂直tile尺寸，值类型：number，默认值：512，可选。
      tileHeight: 512,
      // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。 
      chromaSubsampling: '4:4:4',
    },
    // tif
    ...( () => {
      const config = {
        // 质量，值类型：number，默认值：80，值范围：1-100，可选。
        quality: 80,
        // 强制TIFF输出，否则尝试使用输入格式，值类型：boolean，默认值：true，可选。
        force: true,
        // 压缩选项，值类型：string，默认值：'jpeg'，有效值：'lzw'、'deflate'、'jpeg'、'ccittfax4'，可选。
        compression: 'jpeg',
        // 压缩预测器选项，值类型：string，默认值：'horizontal'，有效值：'none'、'horizontal'、'float'，可选。
        predictor: 'horizontal',
        // 写一个图像pyramid，值类型：boolean，默认值：false，可选。
        pyramid: false,
        // 写一个tiled tiff，值类型：boolean，默认值：false，可选。
        tile: false,
        // 水平tile尺寸，值类型：number，默认值：256，可选。
        tileWidth: 256,
        // 垂直tile尺寸，值类型：number，默认值：256，可选。
        tileHeight: 256,
        // 水平分辨率，像素（pixels）/毫米（mm），值类型：number，默认值：1.0，可选。
        xres: 1.0,
        // 垂直分辨率，像素（pixels）/毫米（mm），值类型：number，默认值：1.0，可选。
        yres: 1.0,
        // 分辨率单位选项，值类型：string，默认值：'inch'，有效值：'inch'、'cm'，可选。
        resolutionUnit: 'inch',
        // 将位深度减少到1、2、4bit，值类型：number，默认值：8，可选。
        bitdepth: 8,
      };

      return {
        tif: config,
        tiff: config,
      };
    } )(),
    // 使用这些AVIF选项输出图像。虽然可以创建小于16x16像素的AVIF图像，但大多数Web浏览器（火狐浏览器支持的）无法正确显示这些图像。不支持AVIF图像序列。
    avif: {
      // 质量，值类型：number，默认值：50，值范围：1-100，可选。
      quality: 50,
      // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
      lossless: false,
      // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-9（最慢），可选。
      effort: 4,
      // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。 
      chromaSubsampling: '4:4:4',
    },
    // heic，直到20220818，sharp v0.30.7、vips-dev-w64-all-8.12.2，转换heic、heif还是会报错。
    ...( () => {
      const config = {
        // 质量，值类型：number，默认值：50，值范围：1-100，可选。
        quality: 50,
        // 压缩格式，值类型：string，默认值：'av1'，有效值：'av1'、'hevc'，可选。
        compression: 'av1',
        // 使用无损压缩模式，值类型：boolean，默认值：false，可选。
        lossless: false,
        // CPU工作量，值类型：number，默认值：4，值范围：0（最快）-9（最慢），可选。
        effort: 4,
        // 色度二次采样，值类型：string，默认值：'4:4:4'（防止色度二次采样），设置为'4:2:0'以使用色度二次采样，可选。 
        chromaSubsampling: '4:4:4',
      };

      return {
        heic: config,
        heif: config,
      };
    } )(),
    // 强制输出为原始的、未压缩的像素数据。像素排序是从左到右，从上到下，没有填充。对于非灰度色彩空间，通道排序将是RGB或RGBA。
    raw: {
      // bit（位）深，值类型：string，默认值：'uchar'，有效值：'char'、'uchar'（默认值）、'short'、'ushort'、'int'、'uint'、'float'、'complex'、'double'、'dpcomplex'，可选。
      depth: 'uchar',
    },
  };

async function ImageMinimizerForSharp( photoFileStream ){
  const imagePipeline = sharp( photoFileStream, {
    animated: true,
  } );

  const imageMetadata = await imagePipeline.metadata();

  const outputFormat = imageMetadata.format;

  imagePipeline.toFormat( outputFormat, encodeOptions[ formats.get( outputFormat.toLocaleLowerCase().trim() ) ] );

  const result = await imagePipeline.toBuffer( {
    resolveWithObject: true,
  } );

  return result;
}

parentPort.on( 'close', () => {
  MyConsole.Cyan( `\nclose event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
该端口已关闭。
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'messageerror', errorObject => {
  MyConsole.Red( `\n反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
Object.prototype.toString.call( errorObject )--->${ Object.prototype.toString.call( errorObject ) }
${ errorObject }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End\n` );
} );

parentPort.on( 'message', async ( {
  photoPath,
} ) => {
  startTimer001 = performance.now();

  resultFilePath = photoPath.replace( join( workerData.initPath, '/' ), join( workerData.savePath, '/' ) );

  if( !workerData.isNest ){
    resultFilePathParseObj = parse( resultFilePath );

    resultFilePath = join( workerData.savePath, `/${ resultFilePathParseObj.name }_${ Number.parseInt( String( Date.now() ) ) }${ resultFilePathParseObj.ext }` );
  }

  // photoFileStream--->Uint8Array   photoFileStream.buffer--->ArrayBuffer
  photoFileStream = await readFile( photoPath );

  // resultObj.data--->Uint8Array
  resultObj = await ImageMinimizerForSharp( photoFileStream );

  await writeFile( resultFilePath, resultObj.data );

  parentPort.postMessage( {
    photoPath,
    takeUpTime: ( performance.now() - startTimer001 ) / 1000,
  } );
} );
