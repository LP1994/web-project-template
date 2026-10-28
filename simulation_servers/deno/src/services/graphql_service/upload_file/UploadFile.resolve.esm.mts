/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/upload_file/UploadFile.resolve.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

'use strict';

import {
  type DocumentNode as T_DocumentNode,
} from 'esm_sh_graphql';

import {
  type T_GraphQlUploadFile,
  type T_Resolvers,
  type Scalars as T_Scalars,
} from 'GSD2TSTD';

import {
  type T_GraphQLUploadFile,
} from 'graphql/graphql_server_for_upload_file/GraphQLServerForUploadFile.esm.mts';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

/**
 * 一个文件对象，该对象里有关于文件的元数据和文件存储的磁盘路径、文件大小等等信息。<br />
 */
class GraphQLUploadFile
  implements T_GraphQlUploadFile {

  // 值形如：'test.png'。
  public filename: T_Scalars['String']['output'];

  // 值形如：'image/png'。
  public mimetype: T_Scalars['String']['output'];

  // 值形如：'binary'，该值有：'7bit' | '8bit' | 'binary'。
  public encoding: T_Scalars['String']['output'];

  // 值形如：102400，单位为字节。
  public size: T_Scalars['String']['output'];

  // 值形如：'G:/WebStormWS/7788/1.png'。
  public filepath: T_Scalars['String']['output'];

  public constructor( {
    filename,
    mimetype,
    encoding,
    size,
    filepath,
  }: T_GraphQLUploadFile ){
    this.filename = filename;
    this.mimetype = mimetype;
    this.encoding = encoding;
    this.size = size;
    this.filepath = filepath;
  }

}

const typeDefs: T_DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./UploadFile.type.graphql` ) ) );

const resolvers: T_Resolvers = {
  Mutation: {
    singleUpload: {
      resolve: async (
        // @ts-expect-error
        parent,
        arg,
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ): Promise<T_GraphQlUploadFile> => {
        return new GraphQLUploadFile( {} );
      },
    },

    multipleUpload: {
      resolve: async (
        // @ts-expect-error
        parent,
        arg,
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ): Promise<Array<T_GraphQlUploadFile>> => {
        return [
          new GraphQLUploadFile( {} ),
        ];
      },
    },
  },
} as T_Resolvers;

export {
  resolvers,
  typeDefs,
};
