/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/web_resources_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 1、自建的HTTPS证书，记得要给客户端安装，比如给电脑（除了本机要安装，火狐浏览器也要安装）、手机、平板等安装。
 * 2、安装证书如下：
 * “openssl/HTTPSSL001”文件夹下的3个：
 * 001根CA证书：HTTPSSL001_Root_CA.crt，安装到“受信任的根证书颁发机构”，手机、平板等非电脑的移动设备，只要安装这个“根CA证书”即可。
 * 002服务端CA证书：HTTPSSL001_Servers_192_168_2_7_CA.crt，安装到“受信任的根证书颁发机构”。
 * 003客户端CA证书：HTTPSSL001_Clients_192_168_2_7_CA.crt，安装时选择自动识别证书类型，系统会自行将其安装到相应的类型下。
 * 3、遇到HTTPS协议下载文件时出现无法下载的话，就改用HTTP协议，比如迅雷就会遇到这种情况。
 */

/**
 * 用于响应“web”文件夹下的静态文件获取（GET请求），如：
 * 获取“web”文件夹下的“xx_project”文件夹下的“js”文件夹下的“JS001.js”文件。
 * https://127.0.0.1:9200/simulation_servers_deno/web/xx_project/js/JS001.js
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByGetForRouteHandle”中的配置。
 */

/**
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

/*
 import {
 parse,

 // @ts-ignore
 } from 'DenoStd/path/mod.ts';
 */

import {
  type TypeResponse001,

  webDir,

  httpHeaders,

  // @ts-ignore
} from 'configures/GlobalParameters.esm.mts';

import {
  mime,

  // @ts-ignore
} from 'public/PublicTools.esm.mts';

// @ts-ignore
import ResponseError from 'public/ResponseError.esm.mts';

import {
  myURLPathName,

  // @ts-ignore
} from './Condition.esm.mts';

/**
 * 当满足“Condition.esm.mts”中的条件时就会被执行以响应请求的处理函数。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {TypeResponse001} 返回值类型为Response、Promise<Response>。
 */
function ResponseHandle( request: Request ): TypeResponse001{
  const url: URL = new URL( request.url ),
    pathName: string = decodeURI( url.pathname ),
    filePath: URL = new URL( `${ webDir }/${ pathName.slice( myURLPathName.length ) }` );

  let result: TypeResponse001;

  //@ts-ignore
  let fileState: Deno.FileInfo;

  try{
    // @ts-ignore
    fileState = Deno.statSync( filePath );

    if( fileState.isFile ){
      //@ts-ignore
      const file: Deno.FsFile = Deno.openSync( filePath, {
        read: true,
      } );

      // @ts-ignore
      result = new Response( file.readable, {
        status: 200,
        statusText: 'OK',
        // @ts-ignore
        headers: {
          ...httpHeaders,
          'Content-Type': `${ mime.getType( filePath.href ) }`,
          'Content-Length': Number( fileState.size ),
          // 该属性用于下载。
          'Accept-Ranges': 'bytes',
          /**
           * Content-Disposition：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
           * 1、Content-Disposition响应头是一个表示内容是否有望在浏览器中内联显示的头，即作为网页或网页的一部分，或作为附件，被下载并保存在本地。
           * 2、在multipart/form-data主体中，Content-Disposition通用头是一个必须在multipart主体的每个子部分上使用的头，以给出它所适用的领域的信息。
           * 3、子部分是由Content-Type头中定义的边界划定的。在正文本身上使用，Content-Disposition没有任何作用。
           * 4、Content-Disposition头是在电子邮件的MIME信息的大背景下定义的，但只有一个可能的参数子集适用于HTTP表单和POST请求。只有值form-data，以及可选的指令名和文件名，可以在HTTP上下文中使用。
           * 5、第1个参数要么是内联“inline”（默认值，表示可以在网页内显示，或作为网页显示），要么是附件“attachment”（表示应该下载；大多数浏览器呈现一个"另存为"对话框，如果存在文件名“filename”参数的值，则预填）：
           * 作为主体的响应头：
           * 'Content-Disposition': 'inline'、'Content-Disposition': 'attachment'、'Content-Disposition': 'attachment; filename="filename.jpg"'
           * 6、注意：Chrome和Firefox 82及更高版本将HTML的<a>元素的下载属性“download”优先于Content-Disposition: inline参数（对于同源URL）。较早的Firefox版本优先显示标题并将内联显示内容。
           * 7、一个multipart/form-data主体需要一个Content-Disposition头来为表单的每个子部分提供信息（例如，为每个表单字段和作为字段数据一部分的任何文件）。
           * 第一个指令总是form-data，而且头文件还必须包括一个“name”名称参数来识别相关的字段。
           * 其他指令不区分大小写，其参数在'='号之后使用引号字符串语法。多个参数用分号（';'）分开。
           * 作为多部分正文的标题：
           * 'Content-Disposition': 'form-data; name=fieldName'、'Content-Disposition': 'form-data; name=fieldName; filename="filename.jpg"'
           * 8、警告。“filename”文件名后面的字符串应该总是放在引号里；但是，由于兼容性的原因，许多浏览器试图解析含有空格的无引号名称。
           */
          // 'Content-Disposition': `attachment; filename="${ parse( filePath.href ).base }"`,
        },
      } );
    }
    else if( fileState.isDirectory ){
      result = ResponseError.ResPageError( {
        title: `Error`,
        message: `当前无法获取该文件夹（${ pathName }）的信息。`,
      } );
    }
    else{
      result = ResponseError.ResPageError( {
        title: `Error`,
        message: `该路径（${ pathName }）既不指向有效的文件也不指向有效的文件夹。`,
      } );
    }
  }
  catch( error: unknown ){
    result = new ResponseError( request ).resPage404();
  }

  return result;
}

// 必须部署这个默认的导出值。
export default ResponseHandle;
