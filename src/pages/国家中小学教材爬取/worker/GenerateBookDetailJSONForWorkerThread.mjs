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

parentPort.on( 'close', async () => {
  await writeFile(
    `../log/用于下载_生成书籍详情JSON_WorkerThread_close.log`,
    `\n
用于下载、生成书籍详情JSON！！！
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
该端口已关闭。
close event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
\n`,
    {
      flag: 'a+',
    }
  );
} );

parentPort.on( 'messageerror', async errorObject => {
  await writeFile(
    `../log/用于下载_生成书籍详情JSON_WorkerThread_messageerror.log`,
    `\n
用于下载、生成书籍详情JSON！！！
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->Start
typeof errorObject--->${ typeof errorObject }
errorObject.name--->${ errorObject.name }
errorObject.message--->${ errorObject.message }
errorObject.stack--->${ errorObject.stack }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ threadId }、workerInsID:${ workerData.workerInsID })--->End
\n`,
    {
      flag: 'a+',
    }
  );
} );

parentPort.on( 'message', (
  {
    id,
    path,
    bookDetailsJSONUrl,
  }
) => {
  fetch( bookDetailsJSONUrl ).then(
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
