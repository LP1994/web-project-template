'use strict';

/*
 tag_list不为空数组、resource_type_code为assets_document、学段不为“特殊教育”的
 学段(zxxxd)、学科(zxxxk)、版本(zxxbb)、年级(zxxnj)的“tag_name”都是不为空字符的
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
  performance,
} from 'node:perf_hooks';

import {
  exit,
} from 'node:process';

import {
  isMainThread,
  Worker,
} from 'node:worker_threads';

const startTimer = performance.now();

const accessToken = `7F938B205F876FC3C7550081F114A1A42FFD0684C043FF4C1BFA9681A0DE12D70CFA13B3C460A96AD8A6ED9BE3662D87B45B062DECF2D7F0`,
  threadQuantity = cpus().length - 1,
  generateBookDetailJSONForWorkerThreadByFilePath = './worker/GenerateBookDetailJSONForWorkerThread.mjs',
  bookDownloadForWorkerThreadByFilePath = './worker/BookDownloadForWorkerThread.mjs';

const data_part_arr = await fetch( `https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json` ).then(
  async resolve => {
    if( Number( resolve.status ) === 200 ){
      const data_version = await resolve.json();

      console.log( `含有获取全部书籍信息的url的json数据--->Start` );
      console.dir( data_version );
      console.log( `
含有获取全部书籍信息的url的json数据--->End
` );

      await writeFile(
        `data_version.json`,
        JSON.stringify( data_version, null, 4 ),
        {
          flag: 'w+',
        }
      );

      const arr001 = data_version?.urls?.split( ',' ) ?? [];

      console.log( `\n含有全部书籍信息的url--->Start` );
      console.dir( arr001 );
      console.log( `
含有全部书籍信息的url--->End
` );

      return arr001;
    }
    else{
      console.error( `\n\n\n请求“https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json”时，其“status”不为200！！！--->Start` );
      console.error( `“status”为：${ resolve.status }` );
      console.error( `请求“https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json”时，其“status”不为200！！！--->End\n` );

      throw new Error( `\n请求“https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json”时，其“status”不为200！！！\n\n\n` );
    }
  },
  reject => {
    console.error( `\n\n\n请求“https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json”时出错了！！！--->Start` );
    console.error( reject );
    console.error( `请求“https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json”时出错了！！！--->End\n` );

    throw new Error( `\n请求“https://s-file-1.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json”时出错了！！！\n\n\n` );
  }
);

const dataSource = await Promise.all( data_part_arr.map( item => fetch( item.trim() ) ) ).then(
  async values => {
    const valuesArr = values.map( async item => await item.json() ),
      resultArr = ( await Array.fromAsync( valuesArr ) ).flat( Infinity );

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
    console.error( `\n\n\n请求这${ data_part_arr.length }个url（${ data_part_arr.join( ',' ) }）时，出错！！！--->Start` );
    console.error( reason );
    console.error( `请求这${ data_part_arr.length }个url（${ data_part_arr.join( ',' ) }）时，出错！！！--->End\n` );

    throw new Error( `\n\n\n请求这${ data_part_arr.length }个url（${ data_part_arr.join( ',' ) }）时，出错！！！\n\n\n` );
  }
);

let result001 = dataSource.filter(
  (
    {
      tag_list,
      resource_type_code,
    }
  ) => {
    // tag_list不为空数组、resource_type_code为assets_document
    return tag_list.length !== 0 && resource_type_code.trim() === 'assets_document';
  }
)
  .filter(
    (
      {
        tag_list,
      }
    ) => {
      const arr001 = tag_list.map(
        (
          {
            tag_dimension_id,
          }
        ) => {
          return tag_dimension_id.trim();
        }
      );

      // 学段(zxxxd)、学科(zxxxk)、版本(zxxbb)、年级(zxxnj)
      const boo001 = arr001.includes( 'zxxxd' ) &&
        arr001.includes( 'zxxxk' ) &&
        arr001.includes( 'zxxbb' ) &&
        arr001.includes( 'zxxnj' );

      // 学段不为“特殊教育”的
      return boo001;
    }
  );

await writeFile(
  `获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.字段是完整的.${ result001.length }本.书籍信息.json`,
  JSON.stringify( result001, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.字段是完整的.${ result001.length }本.书籍信息.json\n` );

result001 = result001.filter(
  (
    {
      tag_list,
    }
  ) => {
    const arr001 = [];

    tag_list.forEach(
      (
        {
          tag_name,
          tag_dimension_id,
        }
      ) => {
        if(
          [
            // 学段
            'zxxxd',
            // 学科
            'zxxxk',
            // 版本
            'zxxbb',
            // 年级
            'zxxnj',
          ].includes( tag_dimension_id.trim() )
        ){
          arr001.push( tag_name.trim() );
        }
      }
    );

    const boo001 = !arr001.includes( '' );

    // 学段(zxxxd)、学科(zxxxk)、版本(zxxbb)、年级(zxxnj)的“tag_name”都是不为空字符的
    return boo001;
  }
);

await writeFile(
  `获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.“tag_name”不为空字符的.字段是完整的.${ result001.length }本.书籍信息.json`,
  JSON.stringify( result001, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.“tag_name”不为空字符的.字段是完整的.${ result001.length }本.书籍信息.json\n` );

result001 = result001.map(
  (
    {
      id,
      tag_list,
    }
  ) => {
    const arr001 = [];

    tag_list.forEach(
      (
        {
          tag_name,
          tag_dimension_id,
        }
      ) => {
        if(
          [
            // 学段
            'zxxxd',
            // 学科
            'zxxxk',
            // 版本
            'zxxbb',
            // 年级
            'zxxnj',
          ].includes( tag_dimension_id.trim() )
        ){
          switch( tag_dimension_id.trim() ){
            // 学段
            case 'zxxxd':
              arr001[ 0 ] = tag_name.trim().replaceAll( '/', '_' );

              break;

            // 学科
            case 'zxxxk':
              arr001[ 1 ] = tag_name.trim().replaceAll( '/', '_' );

              break;

            // 版本
            case 'zxxbb':
              arr001[ 2 ] = tag_name.trim().replaceAll( '/', '_' );

              break;

            // 年级
            case 'zxxnj':
              arr001[ 3 ] = tag_name.trim().replaceAll( '/', '_' );

              break;

            default:
              throw new Error( `\n\n\n出错了！！！出现一个“tag_dimension_id”为“${ tag_dimension_id.trim() }”，其不包含在代码处理的范围中！！！\n\n\n` );
          }
        }
      }
    );

    return [
      id,
      arr001.join( '/' ),
    ];
  }
);

const obj001 = Object.fromEntries( result001 ),
  arr001 = Array.from( Object.values( obj001 ) ),
  arr002 = Array.from( new Set( arr001 ) );

await writeFile(
  `各本书籍对应的文件夹目录.${ arr001.length }个.json`,
  JSON.stringify( obj001, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：各本书籍对应的文件夹目录.${ arr001.length }个.json\n` );

await writeFile(
  `需要生成的文件夹目录结构.${ arr002.length }个.json`,
  JSON.stringify( arr002, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：需要生成的文件夹目录结构.${ arr002.length }个.json\n` );

await Promise.all( arr002.map( item => {
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

const obj002 = {};

result001.forEach(
  (
    [
      id,
      path
    ]
  ) => {
    obj002[ id ] = {
      path,
      details: `https://s-file-1.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/${ id }.json`,
    };
  }
);

await writeFile(
  `各本书籍对应的详情url.${ arr001.length }个.json`,
  JSON.stringify( obj002, null, 4 ),
  {
    flag: 'w+',
  }
);

console.log( `\n生成完成：各本书籍对应的详情url.${ arr001.length }个.json\n` );

const bookDetailJSONQuantity = result001.length,
  success_book_download_url_obj = {};

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
      },
    }
  );

  workerIns.on( 'error', errorEventData => {
    /*    console.error( `
     用于下载、生成书籍详情JSON！！！
     error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
     typeof errorEventData--->${ typeof errorEventData }
     ${ errorEventData }
     error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
     ` );*/
  } );

  workerIns.on( 'exit', exitCode => {
    /*    console.warn( `
     用于下载、生成书籍详情JSON！！！
     exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
     exitCode:${ exitCode }.
     exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
     ` );*/

    if( Number( exitCode ) !== 0 ){
      /*      console.warn( `
       用于下载、生成书籍详情JSON！！！
       Worker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.
       ` );*/
    }
  } );

  workerIns.on( 'messageerror', errorObject => {
    /*    console.error( `
     用于下载、生成书籍详情JSON！！！
     反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
     typeof errorObject--->${ typeof errorObject }
     ${ errorObject }
     反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
     ` );*/
  } );

  workerIns.on( 'online', () => {
    /*    console.log( `
     用于下载、生成书籍详情JSON！！！
     子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
     ` );*/
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
        console.log( `\n第${ generatedBookDetailJSONNum }个生成完成：各本书籍对应的详情/${ id }.json\n` );

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
              success_book_download_url_obj[ id ] = {
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
                `${ success_book_download_url_obj[ id ].bookDownloadUrl }\n`,
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
        throw new Error( `\n当前type值为“${ type }”，该值不在这3个之中：success、fail、reject\n` );
    }

    /*    console.log( `
     用于下载、生成书籍详情JSON！！！
     message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })
     ` );*/

    if( result001.length > 0 ){
      const [
        id,
        path,
      ] = result001.shift();

      workerIns.postMessage(
        {
          id,
          path,
          bookDetailsJSONUrl: `https://s-file-1.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/${ id }.json`,
        }
      );
    }
    else if( generatedBookDetailJSONNum === bookDetailJSONQuantity ){
      // If the worker was terminated, the exitCode parameter is 1.
      await workerIns.terminate().then(
        exitCode => {
          /*          console.warn( `
           用于下载、生成书籍详情JSON！！！
           停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
           ` );*/

          // 会强制退成程序！！！
          // exit( 0 );
        },
        reject => {
          throw new Error( reject );
        }
      );

      console.log( `\n${ generatedBookDetailJSONNum }个“各本书籍对应的详情”的json文件生成完成！都在文件夹“各本书籍对应的详情”里！\n` );

      await StartBookDownload();
    }
  } );

  workerIns.postMessage(
    {
      id: bookID,
      path: bookPath,
      bookDetailsJSONUrl: `https://s-file-1.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/${ bookID }.json`,
    }
  );

  return workerIns;
}

let bookDownloadArr = [],
  bookDownloadQuantity = 0;

async function StartBookDownload(){
  bookDownloadArr = Array.from( Object.values( success_book_download_url_obj ) );

  bookDownloadQuantity = bookDownloadArr.length;

  if( bookDownloadQuantity > 0 ){
    await writeFile(
      `获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.“tag_name”不为空字符的.书籍下载地址.${ bookDownloadQuantity }本.json`,
      JSON.stringify( success_book_download_url_obj, null, 4 ),
      {
        flag: 'w+',
      }
    );

    console.log( `\n生成完成：获取tag_list不为空数组.resource_type_code为assets_document.学段不为“特殊教育”.“tag_name”不为空字符的.书籍下载地址.${ bookDownloadQuantity }本.json\n` );

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

  workerIns.on( 'error', errorEventData => {
    /*    console.error( `
     用于下载、写入书籍！！！
     error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
     typeof errorEventData--->${ typeof errorEventData }
     ${ errorEventData }
     error event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
     ` );*/
  } );

  workerIns.on( 'exit', exitCode => {
    /*    console.warn( `
     用于下载、写入书籍！！！
     exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
     exitCode:${ exitCode }.
     exit event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
     ` );*/

    if( Number( exitCode ) !== 0 ){
      /*      console.warn( `
       用于下载、写入书籍！！！
       Worker stopped with exit code ${ exitCode }.isMainThread:${ isMainThread }、threadId:${ workerIns.threadId }.
       ` );*/
    }
  } );

  workerIns.on( 'messageerror', errorObject => {
    /*    console.error( `
     用于下载、写入书籍！！！
     反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->Start
     typeof errorObject--->${ typeof errorObject }
     ${ errorObject }
     反序列化消息失败，messageerror event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })--->End
     ` );*/
  } );

  workerIns.on( 'online', () => {
    /*    console.log( `
     用于下载、写入书籍！！！
     子线程开始执行JavaScript代码了，online event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
     ` );*/
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
        throw new Error( `\n当前type值为“${ type }”，该值不在这3个之中：success、fail、reject\n` );
    }

    /*    console.log( `
     用于下载、生成书籍详情JSON！！！
     message event(isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })
     ` );*/

    if( bookDownloadArr.length > 0 ){
      workerIns.postMessage(
        bookDownloadArr.shift()
      );
    }
    else if( bookDownloadNum === bookDownloadQuantity ){
      // If the worker was terminated, the exitCode parameter is 1.
      await workerIns.terminate().then(
        exitCode => {
          /*          console.warn( `
           用于下载、写入书籍！！！
           停止工作线程(exitCode:${ exitCode }、isMainThread:${ isMainThread }、threadId:${ workerIns.threadId })。
           ` );*/

          // 会强制退成程序！！！
          // exit( 0 );
        },
        reject => {
          throw new Error( reject );
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

if( result001.length > 0 ){
  await mkdir(
    `各本书籍对应的详情`,
    {
      recursive: true,
    }
  );

  let createGenerateBookDetailJSONForWorkerThreadQuantity = threadQuantity,
    generateBookDetailJSONForWorkerInsArr = [];

  if( result001.length <= threadQuantity ){
    createGenerateBookDetailJSONForWorkerThreadQuantity = result001.length;
  }

  for(
    let i = 0;
    i < createGenerateBookDetailJSONForWorkerThreadQuantity;
    ++i
  ){
    generateBookDetailJSONForWorkerInsArr.push(
      CreateGenerateBookDetailJSONForWorkerIns(
        result001.shift(),
        i
      )
    );
  }

  console.log( `\n\n\n创建了${ createGenerateBookDetailJSONForWorkerThreadQuantity }个Worker线程，用于下载、生成书籍详情JSON！\n\n\n` );
}
