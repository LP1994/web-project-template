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
  type T_Resolvers,
  type Scalars as T_Scalars,
  type T_UploadFileResult,
} from 'GSD2TSTD';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

class UploadFileResult
  implements T_UploadFileResult {

  public url: T_Scalars['String']['output'];

  public constructor( url: T_Scalars['String']['input'] ){
    this.url = url;
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
      ): Promise<T_UploadFileResult> => {
        return new UploadFileResult( `https://127.0.0.1:9200/upload/png/1.png` );
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
      ): Promise<Array<T_UploadFileResult>> => {
        return [
          new UploadFileResult( `https://127.0.0.1:9200/upload/png/1.png` ),
        ];
      },
    },
  },
} as T_Resolvers;

export {
  resolvers,
  typeDefs,
};
