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
@font-face {
  font-family: 'MyFont_Helvetica';
  src: url(fontsDir/Helvetica.otf) format('opentype');
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
}

.upload-for-multiple.upload {
  box-sizing: border-box;

  width: 100%;
  height: auto;

  padding-left: 20px;
  margin-bottom: 40px;

  > h3 {
    width: 100%;
    height: auto;

    font-family: 'MyFont_Helvetica', serif;
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

      font-family: 'MyFont_Helvetica', serif;
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
  <article class = 'css-reset upload-for-multiple upload'>
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
  type = 'module'
  lang = 'ts'>
'use strict';

import {
  onMounted,
} from 'vue';

// @ts-expect-error
function UploadForMultiple( event: Event ): void{
  const uploadForMultiple: HTMLInputElement = document.querySelector( '#UploadForMultiple' ) as HTMLInputElement,
    files: FileList = uploadForMultiple.files as FileList;

  if( files.length !== 0 ){
    console.dir( files );

    const formData: FormData = new FormData();

    formData.append( 'uploadType', 'multiple' );

    Array.from( files ).forEach( ( file: File ): void => {
      formData.append( 'files', file, file.name );
    } );

    fetch( `${ https4deno }/simulation_servers_deno/upload?uploadType=multiple&isForcedWrite=false`, {
      body: formData,
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        ...httpRequestHeaders,
      },
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
    } ).then(
      async ( res: Response ): Promise<Response> => {
        console.dir( await res.clone().json() );

        return res;
      },
      ( reject: unknown ): void => {
        console.error( reject );
      },
    ).catch( ( error: unknown ): void => {
      console.error( error );
    } );
  }
}

onMounted( (): void => {
  console.log( `\n\n
远端模块提供者：Vue3版本的“UploadForMultiple”的DOM已挂载。
\n\n` );
} );
</script>
