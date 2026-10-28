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
  type T_GraphQLUploadFile,
} from './GraphQLServerForUploadFile.esm.mts';

import {
  GetDataType,
} from 'universal_tool_for_deno/UniversalToolForDeno.esm.mts';

/**
 * 定义Upload标量（Upload Scalar）。
 */
const GraphQLServerForUploadScalar: GraphQLScalarType = new GraphQLScalarType( {
  name: 'Upload',

  description: 'The `Upload` scalar type represents a file upload.',

  coerceInputValue( inputValue: unknown ): T_GraphQLUploadFile{
    if(
      typeof inputValue !== 'object'
      || inputValue === null
      || !( 'filename' in inputValue )
      || !( 'mimetype' in inputValue )
      || !( 'encoding' in inputValue )
      || !( 'size' in inputValue )
      || !( 'filepath' in inputValue )
    ){
      throw new GraphQLError( `Upload value invalid. inputValue的值类型为：“${ GetDataType( inputValue ) }”。inputValue的值为：${ JSON.stringify( inputValue ) }`, );
    }

    return value as T_GraphQLUploadFile;
  },

  coerceOutputValue( outputValue: unknown ): never{
    throw new GraphQLError( `Upload serialization unsupported. outputValue的数据类型为：“${ GetDataType( outputValue ) }”。outputValue的值为：${ JSON.stringify( outputValue ) }`, );
  },

  coerceInputLiteral( valueNode: T_ConstValueNode ): never{
    throw new GraphQLError( 'Upload literal unsupported.', { nodes: valueNode, } );
  },
} );

export {
  GraphQLServerForUploadScalar,
};

export default {
  GraphQLServerForUploadScalar,
};
