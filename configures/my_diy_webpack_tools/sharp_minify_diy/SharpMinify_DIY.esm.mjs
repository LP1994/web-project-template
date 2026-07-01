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
} from '../apng_optimizer_diy/APNGOptimizer_DIY.esm.mjs';

function SharpMinify_DIY( sharpMinify ){
  return function My_DIY( original, options ){
    return sharpMinify( original, options );
  };
}

export {
  SharpMinify_DIY,
};

export default {
  SharpMinify_DIY,
};
