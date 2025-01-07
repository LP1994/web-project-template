/**
 * Project: web-project-template
 * FileDirPath: src/pages/upload/Upload.jsx
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  StrictMode,
} from 'react';

import {
  createRoot,
} from 'react-dom/client';

import App from './App.esm.jsx';

const root = createRoot( document.getElementById( 'UploadAPP' ) );

root.render( <StrictMode><App /></StrictMode> );

console.log( `\n\n\nReact版本的“根组件”实例：` );
console.dir( root );
console.log( `\n\n\n` );
