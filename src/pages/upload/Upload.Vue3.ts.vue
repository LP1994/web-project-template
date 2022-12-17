<!--
Project: web-project-template
FileDirPath: src/pages/upload/Upload.Vue3.ts.vue
Author: 12278
Email: 1227839175@qq.com
IDE: WebStorm
CreateDate: 2022-12-17 08:08:45 星期六
-->
<style
  scoped
  lang = 'scss'>
main {

  > .title {
    width: 100%;
    height: auto;

    font-family: 'MyFont_Helvetica', serif;
    color: green;

    line-height: 1;
    text-align: center;

    margin-bottom: 20px;
  }

  > .upload {
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
      justify-content: start;
      align-items: start;

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
      }

      > input[type='file' i]::-webkit-file-upload-button {
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

      > button {
        width: 100px;
        height: 100%;

        font-family: 'MyFont_Helvetica', serif;
        color: black;
        font-size: 20px;

        line-height: 1;
        text-align: center;

        border: 1px solid palevioletred;
        border-radius: 10px;
        margin-left: 40px;

        background-color: white;
      }

    }

  }

}
</style>
<template>
  <!--*********弹窗、悬浮一类节点的书写区域 Start*********-->
  <!--
  说明：
  1、这些弹窗、悬浮一类节点的最外层节点的定位建议使用“position: absolute”。
  2、这样就算这些节点中有可滚动的内容，也不会出现滚动穿透BUG！
  -->
  <!--<dialog style = 'position: absolute;'>例子：可以滚动的内容。</dialog>-->
  <!--*********弹窗、悬浮一类节点的书写区域 End*********-->
  <!--在main这个节点里写主体HTML。-->
  <main class = 'css-reset full-screen overflow-hidden-auto'>
    <h1 class = 'css-reset title'>{{ state.titleText }}</h1>
    <article class = 'css-reset upload'>
      <h3 class = 'css-reset'>FormData的单文件上传（uploadType=single）：</h3>
      <section class = 'css-reset'>
        <input
          id = 'UploadForSingle'
          class = 'css-reset'
          type = 'file' />
        <button
          class = 'css-reset'
          @click = 'UploadForSingle'>上传
        </button>
      </section>
    </article>
    <article class = 'css-reset upload'>
      <h3 class = 'css-reset'>FormData的多文件上传（uploadType=multiple）：</h3>
      <section class = 'css-reset'>
        <input
          id = 'UploadForMultiple'
          class = 'css-reset'
          type = 'file'
          multiple = 'multiple' />
        <button
          class = 'css-reset'
          @click = 'UploadForMultiple'>上传
        </button>
      </section>
    </article>
    <article class = 'css-reset upload'>
      <h3 class = 'css-reset'>单个二进制文件流上传（uploadType=binary）：</h3>
      <section class = 'css-reset'>
        <input
          id = 'UploadForBinary'
          class = 'css-reset'
          type = 'file' />
        <button
          class = 'css-reset'
          @click = 'UploadForBinary'>上传
        </button>
      </section>
    </article>
    <article class = 'css-reset upload'>
      <h3 class = 'css-reset'>单个大文件上传（uploadType=bigFile）：</h3>
      <section class = 'css-reset'>
        <input
          id = 'UploadForBigFile'
          class = 'css-reset'
          type = 'file' />
        <button
          class = 'css-reset'
          @click = 'UploadForBigFile'>上传
        </button>
      </section>
    </article>
  </main>
</template>
<script
  setup
  type = 'module'
  lang = 'ts'>
'use strict';

import {
  reactive,
  onMounted,
} from 'vue';

type TypeState = {
  [ key: string | number ]: any;
};

function UploadForSingle( event: Event ): void{
  const uploadForSingle: HTMLInputElement = document.querySelector( '#UploadForSingle' ) as HTMLInputElement,
    files: FileList = uploadForSingle.files as FileList;

  if( files.length !== 0 ){
    console.dir( files[ 0 ] );
  }
}

function UploadForMultiple( event: Event ): void{
  const uploadForMultiple: HTMLInputElement = document.querySelector( '#UploadForMultiple' ) as HTMLInputElement,
    files: FileList = uploadForMultiple.files as FileList;

  if( files.length !== 0 ){
    console.dir( files );
  }
}

function UploadForBinary( event: Event ): void{
  const uploadForBinary: HTMLInputElement = document.querySelector( '#UploadForBinary' ) as HTMLInputElement,
    files: FileList = uploadForBinary.files as FileList;

  if( files.length !== 0 ){
    console.dir( files[ 0 ] );
  }
}

function UploadForBigFile( event: Event ): void{
  const uploadForBigFile: HTMLInputElement = document.querySelector( '#UploadForBigFile' ) as HTMLInputElement,
    files: FileList = uploadForBigFile.files as FileList;

  if( files.length !== 0 ){
    console.dir( files[ 0 ] );
  }
}

const state: TypeState = reactive( {
  titleText: `上传测试`,
} );

onMounted( (): void => {
  console.log( `\n\n\nDOM以挂载。\n\n\n` );
} );
</script>
