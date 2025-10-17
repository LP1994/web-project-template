'use strict';

import {
  writeFile,
} from 'node:fs/promises';

import {
  isMainThread,
  parentPort,
  threadId,
  workerData,
} from 'node:worker_threads';

parentPort.on( 'close', () => {
  /*  console.log( `
   用于下载、写入书籍！！！
   close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
   该端口已关闭。
   close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
   ` );*/
} );

parentPort.on( 'messageerror', errorObject => {
  /*  console.error( `
   用于下载、写入书籍！！！
   反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
   typeof errorObject--->${ typeof errorObject }
   ${ errorObject }
   反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
   ` );*/
} );

parentPort.on( 'message', async (
  {
    id,
    path,
    bookDetailsJSONUrl,
    bookDownloadUrl,
    bookName,
  }
) => {
  await fetch( bookDownloadUrl ).then(
    async res => {
      if( Number( res.status ) === 200 ){
        await writeFile(
          `${ path }/${ bookName }`,
          await res.bytes(),
          {
            flag: 'w+',
          }
        );

        parentPort.postMessage( {
          type: `success`,
          id,
          path,
          bookDetailsJSONUrl,
          bookDownloadUrl,
          bookName,
        } );
      }
      else{
        parentPort.postMessage( {
          type: `fail`,
          id,
          path,
          bookDetailsJSONUrl,
          bookDownloadUrl,
          bookName,
        } );
      }
    },
    rejectData => {
      parentPort.postMessage( {
        type: `reject`,
        id,
        path,
        bookDetailsJSONUrl,
        bookDownloadUrl,
        bookName,
      } );
    }
  );
} );
