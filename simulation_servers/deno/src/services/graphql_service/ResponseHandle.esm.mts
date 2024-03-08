/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 该文件夹是用于响应“GraphQL请求”（POST请求），如：
 * https://127.0.0.1:9200/graphql
 *
 * 更多的对应关系见“src/configures/route_map_config/RouteMapConfig.esm.mts”中的变量“methodByPostForRouteHandle”中的配置。
 *
 * deno关于使用GraphQL的deno官方案例：
 * https://docs.deno.com/runtime/manual/basics/connecting_to_databases#server
 *
 * GraphQL官方教程：
 * https://graphql.org/graphql-js/
 *
 * graphql-http中关于在deno里使用GraphQL的案例：
 * https://github.com/graphql/graphql-http?tab=readme-ov-file#with-deno
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
 * 该模块，必须部署一个默认的导出值，且该值的类型必须为可执行的函数，详细见下面的Handle函数注解。
 */

'use strict';

import {
  type DocumentNode,

  buildSchema,
  print,
} from 'esmSH/graphql';

import {
  type HandlerOptions,
} from 'esmSH/graphql-http/lib/use/fetch';

import {
  mergeTypeDefs,
  mergeResolvers,
} from 'esmSH/@graphql-tools/merge';

import {
  type IResolvers,
} from 'esmSH/@graphql-tools/utils';

import {
  type TypeResponse001,
} from 'configures/GlobalParameters.esm.mts';

import {
  GraphQLServer,
} from 'graphql/GraphQLServer.esm.mts';

import * as Query from './Query.esm.mts';

type TypeTypeDefsAndResolvers = {
  typeDefs: DocumentNode;
  resolvers: any;
};

const typeDefsArray: Array<DocumentNode> = [],
  resolversArray: Array<any> = [];

Object.values( Query as Record<string, TypeTypeDefsAndResolvers> ).forEach( (
  {
    typeDefs,
    resolvers,
  }: TypeTypeDefsAndResolvers,
  // @ts-expect-error
  index: number,
  // @ts-expect-error
  array: Array<TypeTypeDefsAndResolvers>,
): void => {
  typeDefsArray.push( typeDefs );
  resolversArray.push( resolvers );
} );

const schema: DocumentNode = mergeTypeDefs( typeDefsArray ),
  rootValue: IResolvers = mergeResolvers( resolversArray );

/**
 * 当满足“Condition.esm.mts”中的条件时就会被执行以响应请求的处理函数。
 *
 * @param {Request} request 请求对象，无默认值，必须。
 *
 * @returns {TypeResponse001} 返回值类型为Response、Promise<Response>。
 */
function ResponseHandle( request: Request ): TypeResponse001{
  const options: HandlerOptions = {
    schema: buildSchema( print( schema ) ),
    rootValue: rootValue,
  };

  return GraphQLServer( {
    request,
    options,
  } );
}

// 必须部署这个默认的导出值。
export default ResponseHandle;
