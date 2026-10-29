/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/graphql/graphql_server_for_upload_file/GraphQLServerForUploadScalar.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * GraphQL上传功能之定义Upload标量（Upload Scalar）。
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
 * 定义Upload标量（Upload Scalar）。
 */
const GraphQLServerForUploadScalar: GraphQLScalarType = new GraphQLScalarType( {
  name: 'Upload',

  description: 'The `Upload` scalar type represents a file upload.',

  coerceInputValue<T_GraphQLServerForUploadFile>( inputValue: unknown ): T_GraphQLServerForUploadFile{
    if(
      IsObject( inputValue ) && !IsEmpty( inputValue )
      && ( 'filename' in inputValue )
      && ( 'mimetype' in inputValue )
      && ( 'encoding' in inputValue )
      && ( 'size' in inputValue )
      && ( 'filepath' in inputValue )
    ){
      return inputValue as T_GraphQLServerForUploadFile;
    }
    else{
      errorWriteStream.write( `
coerceInputValue：
Upload value invalid. inputValue的值类型为：“${ GetDataType( inputValue ) }”。inputValue的值为：${ JSON.stringify( inputValue ) }
` );

      throw new GraphQLError( `Upload value invalid. inputValue的值类型为：“${ GetDataType( inputValue ) }”。inputValue的值为：${ JSON.stringify( inputValue ) }`, );
    }
  },

  coerceOutputValue( outputValue: unknown ): never{
    errorWriteStream.write( `
coerceOutputValue：
Upload serialization unsupported. outputValue的数据类型为：“${ GetDataType( outputValue ) }”。outputValue的值为：${ JSON.stringify( outputValue ) }
` );

    throw new GraphQLError( `Upload serialization unsupported. outputValue的数据类型为：“${ GetDataType( outputValue ) }”。outputValue的值为：${ JSON.stringify( outputValue ) }`, );
  },

  coerceInputLiteral( valueNode: T_ConstValueNode ): never{
    errorWriteStream.write( `
coerceInputLiteral：
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
