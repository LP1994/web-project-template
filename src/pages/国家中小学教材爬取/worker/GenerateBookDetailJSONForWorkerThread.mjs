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
   用于下载、生成书籍详情JSON！！！
   close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
   该端口已关闭。
   close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
   ` );*/
} );

parentPort.on( 'messageerror', errorObject => {
  /*  console.error( `
   用于下载、生成书籍详情JSON！！！
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
  }
) => {
  await fetch( bookDetailsJSONUrl ).then(
    async res => {
      if( Number( res.status ) === 200 ){
        const bookDetailsJSON = await res.json();

        await writeFile(
          `各本书籍对应的详情/${ id }.json`,
          JSON.stringify( bookDetailsJSON, null, 4 ),
          {
            flag: 'w+',
          }
        );

        parentPort.postMessage( {
          type: `success`,
          id,
          path,
          bookDetailsJSONUrl,
          bookDetailsJSON,
        } );
      }
      else{
        parentPort.postMessage( {
          type: `fail`,
          id,
          path,
          bookDetailsJSONUrl,
        } );
      }
    },
    rejectData => {
      parentPort.postMessage( {
        type: `reject`,
        id,
        path,
        bookDetailsJSONUrl,
      } );
    }
  );
} );
