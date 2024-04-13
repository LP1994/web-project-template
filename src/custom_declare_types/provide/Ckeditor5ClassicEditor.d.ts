/**
 * Project: web-project-template
 * FileDirPath: src/custom_declare_types/provide/Ckeditor5ClassicEditor.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 强大的所见即所得框架可提供完全自定义的编辑体验。<br />
 * 详细见：https://ckeditor.com/docs/ckeditor5/latest/installation/index.html
 */
declare class Ckeditor5ClassicEditor
  extends import('@ckeditor/ckeditor5-editor-classic').ClassicEditor {

  static builtinPlugins: (
    typeof import('@ckeditor/ckeditor5-typing').TextTransformation |
    typeof import('@ckeditor/ckeditor5-essentials').Essentials |
    typeof import('@ckeditor/ckeditor5-adapter-ckfinder').CKFinderUploadAdapter |
    typeof import('@ckeditor/ckeditor5-paragraph').Paragraph |
    typeof import('@ckeditor/ckeditor5-heading').Heading |
    typeof import('@ckeditor/ckeditor5-autoformat').Autoformat |
    typeof import('@ckeditor/ckeditor5-basic-styles').Bold |
    typeof import('@ckeditor/ckeditor5-basic-styles').Italic |
    typeof import('@ckeditor/ckeditor5-block-quote').BlockQuote |
    typeof import('@ckeditor/ckeditor5-image').Image |
    typeof import('@ckeditor/ckeditor5-image').ImageCaption |
    typeof import('@ckeditor/ckeditor5-image').ImageStyle |
    typeof import('@ckeditor/ckeditor5-image').ImageToolbar |
    typeof import('@ckeditor/ckeditor5-image').ImageUpload |
    typeof import('@ckeditor/ckeditor5-cloud-services').CloudServices |
    typeof import('@ckeditor/ckeditor5-ckbox').CKBox |
    typeof import('@ckeditor/ckeditor5-ckfinder').CKFinder |
    typeof import('@ckeditor/ckeditor5-easy-image').EasyImage |
    typeof import('@ckeditor/ckeditor5-list').List |
    typeof import('@ckeditor/ckeditor5-indent').Indent |
    typeof import('@ckeditor/ckeditor5-link').Link |
    typeof import('@ckeditor/ckeditor5-media-embed').MediaEmbed |
    typeof import('@ckeditor/ckeditor5-paste-from-office').PasteFromOffice |
    typeof import('@ckeditor/ckeditor5-table').Table |
    typeof import('@ckeditor/ckeditor5-table').TableToolbar |
    typeof import('@ckeditor/ckeditor5-image').PictureEditing
    )[];

  static defaultConfig: {
    toolbar: {
      items: string[];
    };

    image: {
      toolbar: string[];
    };

    table: {
      contentToolbar: string[];
    };

    language: string;
  };

}
