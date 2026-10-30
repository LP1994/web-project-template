/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForUploadScalar.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之自定义一个Upload标量（Upload Scalar），用于GraphQL文件上传。
 */

'use strict';

import {
  type ConstValueNode as T_ConstValueNode,

  GraphQLError,
  GraphQLScalarType,
} from 'esm_sh_graphql';

import {
  type T_GraphQLServerForUploadFile,
} from './GraphQLServerForUploadFile.esm.mts';

import {
  type T_MyCusDenoFsFile,

  GetErrorWriteStreamForSingleton,
} from 'public/PublicTools.esm.mts';

import {
  GetDataType,
  IsEmpty,
  IsObject,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

const errorWriteStream: T_MyCusDenoFsFile = await GetErrorWriteStreamForSingleton();

/**
 * 自定义一个Upload标量（Upload Scalar），用于GraphQL文件上传。
 */
const GraphQLServerForUploadScalar: GraphQLScalarType = new GraphQLScalarType( {
  /**
   * 此模式元素的 GraphQL 名称。
   */
  name: 'Upload',

  /**
   * 此架构元素的人类可读描述（如有提供）。
   */
  description: 'The `Upload` scalar type represents a file upload.',

  /**
   * 将外部提供的值强制转换为可用作输入的值。<br />
   * 类型参数：<br />
   * TInternal —— 该标量在运行时内部所采用的表示形式。<br />
   *
   * @param {unknown} inputValue
   *
   * @returns {T_GraphQLServerForUploadFile}
   */
  coerceInputValue<T_GraphQLServerForUploadFile>( inputValue: unknown ): T_GraphQLServerForUploadFile{
    if(
      IsObject( inputValue ) && !IsEmpty( inputValue )
      && ( 'fileName' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'mimeType' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'encoding' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'size' in ( inputValue as T_GraphQLServerForUploadFile ) )
      && ( 'filePath' in ( inputValue as T_GraphQLServerForUploadFile ) )
    ){
      return inputValue as T_GraphQLServerForUploadFile;
    }
    else{
      errorWriteStream.write( `
GraphQLServerForUploadScalar.esm.mts--->coerceInputValue：
Upload value invalid. inputValue的值类型为：“${ GetDataType( inputValue ) }”。inputValue的值为：${ JSON.stringify( inputValue ) }
` );

      throw new GraphQLError( `Upload value invalid. inputValue的值类型为：“${ GetDataType( inputValue ) }”。inputValue的值为：${ JSON.stringify( inputValue ) }`, );
    }
  },

  /**
   * 将内部值强制转换为适合包含在响应中的形式。
   *
   * @param {unknown} outputValue
   *
   * @returns {never}
   */
  coerceOutputValue( outputValue: unknown ): never{
    errorWriteStream.write( `
GraphQLServerForUploadScalar.esm.mts--->coerceOutputValue：
Upload serialization unsupported. outputValue的数据类型为：“${ GetDataType( outputValue ) }”。outputValue的值为：${ JSON.stringify( outputValue ) }
` );

    throw new GraphQLError( `Upload serialization unsupported. outputValue的数据类型为：“${ GetDataType( outputValue ) }”。outputValue的值为：${ JSON.stringify( outputValue ) }`, );
  },

  /**
   * 将外部提供的常量字面值强制转换为输入值。
   *
   * @param {T_ConstValueNode} valueNode
   *
   * @returns {never}
   */
  coerceInputLiteral( valueNode: T_ConstValueNode ): never{
    errorWriteStream.write( `
GraphQLServerForUploadScalar.esm.mts--->coerceInputLiteral：
Upload literal unsupported. valueNode的数据类型为：“${ GetDataType( valueNode ) }”。valueNode的值为：${ JSON.stringify( valueNode ) }
` );

    throw new GraphQLError( `Upload literal unsupported. valueNode的数据类型为：“${ GetDataType( valueNode ) }”。valueNode的值为：${ JSON.stringify( valueNode ) }`, { nodes: valueNode, } );
  },
} );

export {
  GraphQLServerForUploadScalar,
};

export default {
  GraphQLServerForUploadScalar,
};
