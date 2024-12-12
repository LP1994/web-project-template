<!--
Project: upload-for-multiple
FileDirPath: src/components/UploadForMultiple.Vue3.ts.vue
Author: 12278
Email: 1227839175@qq.com
IDE: WebStorm
CreateDate: 2024-1-1 00:00:00 星期一
-->
<style
  scoped
  lang = 'scss'>
.upload {
  box-sizing: border-box;

  width: 100%;
  height: auto;

  padding-left: 20px;
  margin-bottom: 40px;

  > h3 {
    width: 100%;
    height: auto;

    color: blue;

    line-height: 1;
    text-align: left;

    margin-bottom: 20px;
  }

  > section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    height: 50px;

    > input[type='file'] {
      width: 200px;
      height: 100%;
    }

    > input[type='file' i] {
      display: inline-block !important;
      height: 100% !important;
      color: red;

      &::-webkit-file-upload-button {
        display: inline-block !important;
        width: 80px !important;
        height: 100% !important;
        color: green;

        padding: 0;
        border: 1px solid palevioletred;
        border-radius: 5px;
        margin: 0 20px 0 0;
        outline: none;

        background-color: white;
      }
    }

    > button {
      box-sizing: border-box;

      width: 100px;
      height: 100%;

      color: black;
      font-size: 20px;

      line-height: 48px;
      text-align: center;

      border: 1px solid palevioletred;
      border-radius: 10px;
      margin-left: 40px;

      background-color: white;
    }

  }

}
</style>
<template>
  <article class = 'css-reset upload'>
    <h3 class = 'css-reset'>FormData的多文件上传（uploadType=multiple）：</h3>
    <section class = 'css-reset'>
      <input
        id = 'UploadForMultiple'
        class = 'css-reset'
        type = 'file'
        multiple />
      <button
        class = 'css-reset'
        type = 'button'
        @click.prevent = 'UploadForMultiple'>上传
      </button>
    </section>
  </article>
</template>
<script
  setup
  type = 'module'>
'use strict';

import {
  onMounted,
} from 'vue';

function UploadForMultiple( event ){
  const uploadForMultiple = document.querySelector( '#UploadForMultiple' ),
    files = uploadForMultiple.files;

  if( files.length !== 0 ){
    console.dir( files );

    const formData = new FormData();

    formData.append( 'uploadType', 'multiple' );

    Array.from( files ).forEach( ( file ) => {
      formData.append( 'files', file, file.name );
    } );

    fetch( `https://localhost:9200/simulation_servers_deno/upload?uploadType=multiple&isForcedWrite=false`, {
      body: formData,
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        ...{
          /**
           * Cache-Control：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
           */
          'Cache-Control': 'no-cache',
          /**
           * Access-Control-Request-Headers：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers
           * 1、浏览器在发出预检请求时使用Access-Control-Request-Headers请求标头，让服务器知道在发出实际请求时客户端可能发送哪些HTTP标头（例如使用setRequestHeader()）。
           * 2、Access-Control-Allow-Headers的补充服务器端标头将回答此浏览器端标头。
           * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
           */
          'Access-Control-Request-Headers': 'deno-custom-file-sri, Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
          /**
           * Access-Control-Request-Method：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method
           * 1、浏览器在发出预检请求时使用Access-Control-Request-Method请求标头，让服务器知道在发出实际请求时将使用哪种HTTP方法。
           * 2、这个标头是必需的，因为预检请求始终是一个选项，并且不使用与实际请求相同的方法。
           * 3、该标头系用于客户端发起的请求中的标头，而不是用于服务器的响应中的标头。
           */
          'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
        },
      },
      method: 'POST',
      credentials: 'omit',
      mode: 'cors',
    } ).then(
      async ( res ) => {
        console.dir( await res.clone().json() );

        return res;
      },
      ( reject ) => {
        console.error( reject );
      },
    ).catch( ( error ) => {
      console.error( error );
    } );
  }
}

onMounted( () => {
  console.log( `\n\n
模块提供者：Vue3版本的“UploadForMultiple”的DOM已挂载。
\n\n` );
} );
</script>
