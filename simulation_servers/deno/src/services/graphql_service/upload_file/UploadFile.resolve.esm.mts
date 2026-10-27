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
  // type T_Message,
  // type T_MessageInput,
  // type T_MutationCreateMessageArgs,
  // type T_MutationUpdateMessageArgs,
  // type T_QueryGetMessageArgs,
  type T_Resolvers,
  type Scalars as T_Scalars,
} from 'GSD2TSTD';

import {
  GraphqlParseByFilePath,
} from 'public/PublicTools.esm.mts';

import {
  type FileUpload as T_FileUpload,

  GraphQLUpload,
  Upload,
} from 'third_party_modules/graphql_upload_deno/src/index.ts';

class UploadFileResult {

  public url: T_Scalars['String']['output'];

  public constructor( url: T_Scalars['String']['input'] ){
    this.url = url;
  }

}

const typeDefs: T_DocumentNode = GraphqlParseByFilePath( new URL( import.meta.resolve( `./UploadFile.type.graphql` ) ) );

const resolvers: T_Resolvers = {
  // 标量实现
  Upload: GraphQLUpload,

  Mutation: {
    singleUpload: {
      resolve: async (
        // @ts-expect-error
        parent,
        arg,
        /*
         {
         file,
         }: {
         file: Promise<Upload>
         },
         */
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ) => {
        console.dir( arg );

        return new UploadFileResult( `https://127.0.0.1:9200/upload/png/1.png` );
      },
    },

    multipleUpload: {
      resolve: async (
        // @ts-expect-error
        parent,
        arg,
        /*
         {
         file,
         }: {
         file: Promise<Upload>
         },
         */
        // @ts-expect-error
        context,
        // @ts-expect-error
        info,
      ) => {
        console.dir( arg );

        return new UploadFileResult( `https://127.0.0.1:9200/upload/png/1.png` );
      },
    },
  },
} as T_Resolvers;

export {
  resolvers,
  typeDefs,
};
