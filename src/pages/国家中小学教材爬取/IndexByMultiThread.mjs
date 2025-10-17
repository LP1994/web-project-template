'use strict';

/*
 tag_list不为空数组、resource_type_code为assets_document、学段为“特殊教育”的
 检测书籍对应的详情url是否都能成功请求到数据！！！
 生成最终的下载地址.json、开始下载，并重命名每个下载下来的书籍名，并放到其对应的文件夹里。
 会发起实际的网络请求！！！
 */

import {
  mkdir,
  writeFile,
} from 'node:fs/promises';

import {
  cpus,
} from 'node:os';

import {
  dirname,
  join,
} from 'node:path';

import {
  performance,
} from 'node:perf_hooks';

import {
  exit,
} from 'node:process';

import {
  fileURLToPath,
} from 'node:url';

import {
  isMainThread,
  Worker,
} from 'node:worker_threads';

const startTimer = performance.now(),
  threadQuantity = cpus().length - 1,
  accessToken = `7F938B205F876FC3C7550081F114A1A42FFD0684C043FF4C1BFA9681A0DE12D70CFA13B3C460A96AD8A6ED9BE3662D87B45B062DECF2D7F0`,
  dataVersionUrl = `https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json`,
  dataDetailsJSONUrlPart = `https://s-file-1.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/`,
  specialEducationTag = `22700532-3cf7-4007-9168-c676bd3aefa2`,
  generateBookDetailJSONForWorkerThreadByFilePath = './worker/GenerateBookDetailJSONForWorkerThread.mjs',
  bookDownloadForWorkerThreadByFilePath = './worker/BookDownloadForWorkerThread.mjs',
  bookDetailJSONDir = `各本书籍对应的详情`;

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__dirname”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\tools。
 */
function Get__dirname( import_meta_url = import.meta.url ){
  return dirname( Get__filename( import_meta_url ) );
}

/**
 * 该函数返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。<br />
 *
 * @param {string} import_meta_url 只传入import.meta.url即可，默认值（哈哈哈，这个默认值设置的有点多余，纯粹只是为了规避传空报错）：import.meta.url，必需。
 *
 * @returns {string} 返回值完全等价于“CommonJS modules”中的“__filename”，是一个字符串，Windows系统下型如：G:\WebStormWS\xx\7788.mjs。
 */
function Get__filename( import_meta_url = import.meta.url ){
  return fileURLToPath( import_meta_url );
}

const bookInfoArr = await fetch( dataVersionUrl ).then(
  async resolve => {
    if( Number( resolve.status ) === 200 ){
      const dataVersion = await resolve.json();

      console.log( `含有获取全部书籍信息的url的json数据--->Start` );
      console.dir( dataVersion );
      console.log( `
含有获取全部书籍信息的url的json数据--->End
` );

      await writeFile(
        `data_version(含有获取全部书籍信息的url的json数据).json`,
        JSON.stringify( dataVersion, null, 4 ),
        {
          flag: 'w+',
        }
      );

      const bookInfoArr = dataVersion?.urls?.split( ',' ) ?? [];

      console.log( `\n含有全部书籍信息的url--->Start` );
      console.dir( bookInfoArr );
      console.log( `
含有全部书籍信息的url--->End
` );

      return bookInfoArr;
    }
    else{
      console.error( `\n\n\n请求“${ dataVersionUrl }”时，其“status”不为200！！！--->Start` );
      console.error( `“status”为：${ resolve.status }` );
      console.error( `请求“${ dataVersionUrl }”时，其“status”不为200！！！--->End\n` );

      throw new Error( `\n请求“${ dataVersionUrl }”时，其“status”不为200！！！\n\n\n` );
    }
  },
  reject => {
    console.error( `\n\n\n请求“${ dataVersionUrl }”时出错了！！！--->Start` );
    console.error( reject );
    console.error( `请求“${ dataVersionUrl }”时出错了！！！--->End\n` );

    throw new Error( `\n请求“${ dataVersionUrl }”时出错了！！！\n\n\n` );
  }
);

const dataSource = await Promise.all( bookInfoArr.map( item => fetch( item.trim() ) ) ).then(
  async values => {
    const resultArr = ( await Array.fromAsync( values.map( async item => await item.json() ) ) ).flat( Infinity );

    await writeFile(
      `全部的书籍信息.字段是完整的.${ resultArr.length }本.json`,
      JSON.stringify( resultArr, null, 4 ),
      {
        flag: 'w+',
      }
    );

    console.log( `\n一共有${ resultArr.length }本书籍信息！！！\n` );

    return resultArr;
  },
  reason => {
    console.error( `\n\n\n请求这${ bookInfoArr.length }个url（${ bookInfoArr.join( ',' ) }）时，出错！！！--->Start` );
    console.error( reason );
    console.error( `请求这${ bookInfoArr.length }个url（${ bookInfoArr.join( ',' ) }）时，出错！！！--->End\n` );

    throw new Error( `\n\n\n请求这${ bookInfoArr.length }个url（${ bookInfoArr.join( ',' ) }）时，出错！！！\n\n\n` );
  }
);

let resultData = dataSource.filter(
  (
    {
      tag_list,
      tag_paths,
      resource_type_code,
    }
  ) => {
    // tag_list不为空数组、resource_type_code为assets_document
    return tag_list.length !== 0 && tag_paths.length !== 0 && tag_paths[ 0 ].trim().length !== 0 && resource_type_code.trim() === 'assets_document';
  }
)
  .filter(
    (
      {
        tag_list,
        tag_paths,
      }
    ) => {
      // 学段为“特殊教育”的
      return tag_paths[ 0 ].trim().split( `/` )[ 2 ] === specialEducationTag;
    }
  );

await writeFile(
  `获取tag_list不为空数组.resource_type_code为assets_document.学段为“特殊教育”.字段是完整的.${ resultData.length }本.书籍信息.json`,
  JSON.stringify( resultData, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：获取tag_list不为空数组.resource_type_code为assets_document.学段为“特殊教育”.字段是完整的.${ resultData.length }本.书籍信息.json\n` );

resultData = resultData.filter(
  (
    {
      tag_list,
      tag_paths,
    }
  ) => {
    const tagObj = {};

    tag_list.forEach(
      (
        {
          tag_id,
          tag_name,
        }
      ) => {
        tagObj[ tag_id.trim() ] = tag_name.trim();
      }
    );

    return !tag_paths[ 0 ].trim().split( `/` ).slice( 2, -1 ).map( item => tagObj[ item ] ).includes( `` );
  }
);

await writeFile(
  `获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.“tag_name”不为空字符的.字段是完整的.${ resultData.length }本.书籍信息.json`,
  JSON.stringify( resultData, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.“tag_name”不为空字符的.字段是完整的.${ resultData.length }本.书籍信息.json\n` );

resultData = resultData.map(
  (
    {
      id,
      tag_list,
      tag_paths,
    }
  ) => {
    const tagObj = {};

    tag_list.forEach(
      (
        {
          tag_id,
          tag_name,
        }
      ) => {
        tagObj[ tag_id.trim() ] = tag_name.trim();
      }
    );

    return [
      id,
      tag_paths[ 0 ].trim().split( `/` ).slice( 2, -1 ).map( item => tagObj[ item ] ).join( '/' ),
    ];
  }
);

const resultDataObj = Object.fromEntries( resultData ),
  bookPaths = Array.from( Object.values( resultDataObj ) ),
  pathArr = Array.from( new Set( bookPaths ) );

await writeFile(
  `各本书籍对应的文件夹目录.${ bookPaths.length }个.json`,
  JSON.stringify( resultDataObj, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：各本书籍对应的文件夹目录.${ bookPaths.length }个.json\n` );

await writeFile(
  `需要生成的文件夹目录结构.${ pathArr.length }个.json`,
  JSON.stringify( pathArr, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：需要生成的文件夹目录结构.${ pathArr.length }个.json\n` );

await Promise.all( pathArr.map( item => {
  return mkdir(
    item,
    {
      recursive: true,
    }
  );
} ) ).then(
  resolve => {
    console.log( `\n文件夹目录结构生成完成！一共${ resolve.length }个文件夹目录结构！\n` );
  },
  reason => {
    console.error( `\n\n\n生成文件夹目录结构时，出错！！！--->Start` );
    console.error( reason );
    console.error( `生成文件夹目录结构时，出错！！！--->End\n` );

    throw new Error( `\n\n\n生成文件夹目录结构时，出错！！！\n\n\n` );
  }
);

const bookDetailUrlObj = {};

resultData.forEach(
  (
    [
      id,
      path
    ]
  ) => {
    bookDetailUrlObj[ id ] = {
      path,
      details: `${ dataDetailsJSONUrlPart }${ id }.json`,
    };
  }
);

await writeFile(
  `各本书籍对应的详情url.${ bookPaths.length }个.json`,
  JSON.stringify( bookDetailUrlObj, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：各本书籍对应的详情url.${ bookPaths.length }个.json\n` );

const bookDetailJSONQuantity = resultData.length,
  successBookDownloadUrlObj = {};

let bookName = '';

let generatedBookDetailJSONNum = 0,
  bookDownloadNum = 0;

/**
 * 用于下载、生成书籍详情JSON！
 */
async function CreateGenerateBookDetailJSONForWorkerIns(
  [ bookID, bookPath ],
  workerInsIndex
){
  const workerIns = new Worker(
    generateBookDetailJSONForWorkerThreadByFilePath,
    {
      workerData: {
        workerInsID: `workerInsID${ workerInsIndex }`,
        bookDetailJSONDir: `${ join( Get__dirname( import.meta.url ), bookDetailJSONDir ) }`,
      },
    }
  );

  workerIns.on( 'error', async errorEventData => {
    await writeFile(
      `log/用于下载_生成书籍详情JSON_MainThread_error.log`,
      `\n
用于下载、生成书籍详情JSON！！！
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
typeof errorEventData--->${ typeof errorEventData }
errorEventData.name--->${ errorEventData.name }
errorEventData.message--->${ errorEventData.message }
errorEventData.stack--->${ errorEventData.stack }
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
\n`,
      {
        flag: 'a+',
      }
    );
  } );

  workerIns.on( 'messageerror', async errorObject => {
    await writeFile(
      `log/用于下载_生成书籍详情JSON_MainThread_messageerror.log`,
      `\n
用于下载、生成书籍详情JSON！！！
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
typeof errorObject--->${ typeof errorObject }
errorObject.name--->${ errorObject.name }
errorObject.message--->${ errorObject.message }
errorObject.stack--->${ errorObject.stack }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
\n`,
      {
        flag: 'a+',
      }
    );
  } );

  workerIns.on( 'online', async () => {
    await writeFile(
      `log/用于下载_生成书籍详情JSON_MainThread_online.log`,
      `\n
用于下载、生成书籍详情JSON！！！
子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
\n`,
      {
        flag: 'a+',
      }
    );
  } );

  workerIns.on( 'exit', async exitCode => {
    await writeFile(
      `log/用于下载_生成书籍详情JSON_MainThread_exit.log`,
      `\n
用于下载、生成书籍详情JSON！！！
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
exitCode:${ exitCode }.
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
\n`,
      {
        flag: 'a+',
      }
    );

    if( Number( exitCode ) !== 0 ){
      await writeFile(
        `log/用于下载_生成书籍详情JSON_MainThread_exit.log`,
        `\n
用于下载、生成书籍详情JSON！！！
Worker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.
\n`,
        {
          flag: 'a+',
        }
      );
    }
  } );

  workerIns.on( 'message', async (
    {
      // type: success、fail、reject
      type,
      id,
      path,
      bookDetailsJSONUrl,
      bookDetailsJSON = null,
    }
  ) => {
    ++generatedBookDetailJSONNum;

    switch( type ){
      case 'success':
        console.log( `\n第${ generatedBookDetailJSONNum }个生成完成：${ bookDetailJSONDir }/${ id }.json\n` );

        ( bookDetailsJSON?.ti_items ?? [] ).map(
          async (
            {
              // source
              ti_file_flag,
              // pdf
              ti_format,
              // pdf
              lc_ti_format,

              // [ ... ]
              ti_storages,
            }
          ) => {
            if( ti_file_flag === 'source' && ti_format === 'pdf' && lc_ti_format === 'pdf' && ti_storages.length > 0 ){
              successBookDownloadUrlObj[ id ] = {
                id,
                path,
                bookDetailsJSONUrl,
                bookDownloadUrl: `${ ti_storages[ 0 ] }?accessToken=${ accessToken }`,
                bookName: ( () => {
                  bookName = ( ti_storages[ 0 ].split( '/' ).at( -1 ).split( '.pdf' )[ 0 ] ).trim();

                  if( bookName === 'pdf' || bookName.startsWith( 'pdf' ) ){
                    return `${ bookDetailsJSON.title.trim() }_${ id }.pdf`;
                  }
                  else{
                    return `${ bookName }_${ id }.pdf`;
                  }
                } )(),
              };

              await writeFile(
                `成功获取到的书籍下载地址（都是pdf的）.txt`,
                `${ successBookDownloadUrlObj[ id ].bookDownloadUrl }\n`,
                {
                  flag: 'a+',
                }
              );
            }
            else if( ti_file_flag === 'source' && !( ti_format === 'pdf' && lc_ti_format === 'pdf' && ti_storages.length > 0 ) ){
              await writeFile(
                `未能获取到书籍下载地址的书籍对应的书籍详情地址.txt`,
                `${ bookDetailsJSONUrl }\n`,
                {
                  flag: 'a+',
                }
              );
            }
          }
        );

        await writeFile(
          `获取书籍详情的请求的响应的status为200的请求.txt`,
          `${ bookDetailsJSONUrl }\n`,
          {
            flag: 'a+',
          }
        );

        break;

      case 'fail':
        await writeFile(
          `获取书籍详情的请求的响应的status不为200的请求.txt`,
          `${ bookDetailsJSONUrl }\n`,
          {
            flag: 'a+',
          }
        );

        break;

      case 'reject':
        await writeFile(
          `获取书籍详情的请求出现reject的请求.txt`,
          `${ bookDetailsJSONUrl }\n`,
          {
            flag: 'a+',
          }
        );

        break;

      default:
        throw new Error( `\n用于下载、生成书籍详情JSON！！！当前type值为“${ type }”，该值不在这3个之中：success、fail、reject\n` );
    }

    if( resultData.length > 0 ){
      const [
        id,
        path,
      ] = resultData.shift();

      workerIns.postMessage(
        {
          id,
          path,
          bookDetailsJSONUrl: `${ dataDetailsJSONUrlPart }${ id }.json`,
        }
      );
    }
    else if( generatedBookDetailJSONNum === bookDetailJSONQuantity ){
      // If the worker was terminated, the exitCode parameter is 1.
      await workerIns.terminate().then(
        async exitCode => {
          await writeFile(
            `log/用于下载_生成书籍详情JSON_MainThread_terminate().log`,
            `\n
用于下载、生成书籍详情JSON！！！
停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
\n`,
            {
              flag: 'a+',
            }
          );

          // 会强制退成程序！！！
          // exit( 0 );
        },
        reject => {
          console.error( `\n\n\n用于下载、生成书籍详情JSON！！！执行“workerIns.terminate()”时，出现reject！！！isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }` );
          console.error( reject );
          console.error( `用于下载、生成书籍详情JSON！！！执行“workerIns.terminate()”时，出现reject！！！isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }\n\n\n` );

          throw new Error( `\n\n\n用于下载、生成书籍详情JSON！！！执行“workerIns.terminate()”时，出现reject！！！isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }\n\n\n` );
        }
      );

      console.log( `\n${ generatedBookDetailJSONNum }个“各本书籍对应的详情”的json文件生成完成！都在文件夹“${ bookDetailJSONDir }”里！\n` );

      await StartBookDownload();
    }
  } );

  workerIns.postMessage(
    {
      id: bookID,
      path: bookPath,
      bookDetailsJSONUrl: `${ dataDetailsJSONUrlPart }${ bookID }.json`,
    }
  );

  return workerIns;
}

let bookDownloadArr = [],
  bookDownloadQuantity = 0;

async function StartBookDownload(){
  bookDownloadArr = Array.from( Object.values( successBookDownloadUrlObj ) );

  bookDownloadQuantity = bookDownloadArr.length;

  if( bookDownloadQuantity > 0 ){
    await writeFile(
      `获取tag_list不为空数组.resource_type_code为assets_document.学段为“特殊教育”.“tag_name”不为空字符的.书籍下载地址.${ bookDownloadQuantity }本.json`,
      JSON.stringify( successBookDownloadUrlObj, null, 4 ),
      {
        flag: 'w+',
      }
    );

    console.log( `\n生成完成：获取tag_list不为空数组.resource_type_code为assets_document.学段为“特殊教育”.“tag_name”不为空字符的.书籍下载地址.${ bookDownloadQuantity }本.json\n` );

    let createBookDownloadForWorkerThreadQuantity = threadQuantity,
      bookDownloadForWorkerInsArr = [];

    if( bookDownloadQuantity <= threadQuantity ){
      createBookDownloadForWorkerThreadQuantity = bookDownloadQuantity;
    }

    for(
      let i = 0;
      i < createBookDownloadForWorkerThreadQuantity;
      ++i
    ){
      bookDownloadForWorkerInsArr.push(
        CreateBookDownloadForWorkerIns(
          bookDownloadArr.shift(),
          i
        )
      );
    }

    console.log( `\n\n\n创建了${ createBookDownloadForWorkerThreadQuantity }个Worker线程，用于下载、写入书籍！\n\n\n` );
  }
}

/**
 * 用于下载、写入书籍！
 */
async function CreateBookDownloadForWorkerIns(
  {
    id,
    path,
    bookDetailsJSONUrl,
    bookDownloadUrl,
    bookName,
  },
  workerInsIndex
){
  const workerIns = new Worker(
    bookDownloadForWorkerThreadByFilePath,
    {
      workerData: {
        workerInsID: `workerInsID${ workerInsIndex }`,
      },
    }
  );

  workerIns.on( 'error', async errorEventData => {
    await writeFile(
      `log/用于下载_写入书籍_MainThread_error.log`,
      `\n
用于下载、写入书籍！！！
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
typeof errorEventData--->${ typeof errorEventData }
errorEventData.name--->${ errorEventData.name }
errorEventData.message--->${ errorEventData.message }
errorEventData.stack--->${ errorEventData.stack }
error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
\n`,
      {
        flag: 'a+',
      }
    );
  } );

  workerIns.on( 'messageerror', async errorObject => {
    await writeFile(
      `log/用于下载_写入书籍_MainThread_messageerror.log`,
      `\n
用于下载、写入书籍！！！
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
typeof errorObject--->${ typeof errorObject }
errorObject.name--->${ errorObject.name }
errorObject.message--->${ errorObject.message }
errorObject.stack--->${ errorObject.stack }
反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
\n`,
      {
        flag: 'a+',
      }
    );
  } );

  workerIns.on( 'online', async () => {
    await writeFile(
      `log/用于下载_写入书籍_MainThread_online.log`,
      `\n
用于下载、写入书籍！！！
子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
\n`,
      {
        flag: 'a+',
      }
    );
  } );

  workerIns.on( 'exit', async exitCode => {
    await writeFile(
      `log/用于下载_写入书籍_MainThread_exit.log`,
      `\n
用于下载、写入书籍！！！
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
exitCode:${ exitCode }.
exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
\n`,
      {
        flag: 'a+',
      }
    );

    if( Number( exitCode ) !== 0 ){
      await writeFile(
        `log/用于下载_写入书籍_MainThread_exit.log`,
        `\n
用于下载、写入书籍！！！
Worker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.
\n`,
        {
          flag: 'a+',
        }
      );
    }
  } );

  workerIns.on( 'message', async (
    {
      // type: success、fail、reject
      type,
      id,
      path,
      bookDetailsJSONUrl,
      bookDownloadUrl,
      bookName,
    }
  ) => {
    ++bookDownloadNum;

    switch( type ){
      case 'success':
        console.log( `\n第${ bookDownloadNum }本书籍（${ path }/${ bookName }）写入磁盘完成！\n` );

        break;

      case 'fail':
        await writeFile(
          `下载书籍时响应的status不为200的书籍下载地址.txt`,
          `${ bookDownloadUrl }\n`,
          {
            flag: 'a+',
          }
        );

        break;

      case 'reject':
        await writeFile(
          `下载书籍时出现reject的书籍下载地址.txt`,
          `${ bookDownloadUrl }\n`,
          {
            flag: 'a+',
          }
        );

        break;

      default:
        throw new Error( `\n用于下载、写入书籍！！！当前type值为“${ type }”，该值不在这3个之中：success、fail、reject\n` );
    }

    if( bookDownloadArr.length > 0 ){
      workerIns.postMessage(
        bookDownloadArr.shift()
      );
    }
    else if( bookDownloadNum === bookDownloadQuantity ){
      // If the worker was terminated, the exitCode parameter is 1.
      await workerIns.terminate().then(
        async exitCode => {
          await writeFile(
            `log/用于下载_写入书籍_MainThread_terminate().log`,
            `\n
用于下载、写入书籍！！！
停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
\n`,
            {
              flag: 'a+',
            }
          );

          // 会强制退成程序！！！
          // exit( 0 );
        },
        reject => {
          console.error( `\n\n\n用于下载、写入书籍！！！执行“workerIns.terminate()”时，出现reject！！！isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }` );
          console.error( reject );
          console.error( `用于下载、写入书籍！！！执行“workerIns.terminate()”时，出现reject！！！isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }\n\n\n` );

          throw new Error( `\n\n\n用于下载、写入书籍！！！执行“workerIns.terminate()”时，出现reject！！！isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }\n\n\n` );
        }
      );

      console.log( `\n${ bookDownloadNum }本书籍下载完成！\n` );

      console.log( `\n总共耗时：${ ( ( performance.now() - startTimer ) / 1000 / 60 ).toFixed( 3 ) }分钟！\n` );
    }
  } );

  workerIns.postMessage(
    {
      id,
      path,
      bookDetailsJSONUrl,
      bookDownloadUrl,
      bookName,
    }
  );

  return workerIns;
}

if( resultData.length > 0 ){
  await mkdir(
    bookDetailJSONDir,
    {
      recursive: true,
    }
  );

  let createGenerateBookDetailJSONForWorkerThreadQuantity = threadQuantity,
    generateBookDetailJSONForWorkerInsArr = [];

  if( resultData.length <= threadQuantity ){
    createGenerateBookDetailJSONForWorkerThreadQuantity = resultData.length;
  }

  for(
    let i = 0;
    i < createGenerateBookDetailJSONForWorkerThreadQuantity;
    ++i
  ){
    generateBookDetailJSONForWorkerInsArr.push(
      CreateGenerateBookDetailJSONForWorkerIns(
        resultData.shift(),
        i
      )
    );
  }

  console.log( `\n\n\n创建了${ createGenerateBookDetailJSONForWorkerThreadQuantity }个Worker线程，用于下载、生成书籍详情JSON！\n\n\n` );
}
