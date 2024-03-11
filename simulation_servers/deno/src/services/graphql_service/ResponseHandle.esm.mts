/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/services/graphql_service/ResponseHandle.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-11-02 17:38:57 星期三
 */

/**
 * 该文件夹是用于响应“GraphQL请求”（POST请求、GET请求），如：
 * POST：https://127.0.0.1:9200/graphql
 *
 * GET：https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate1:%20serverDate,%0A%7D&variables={}&operationName=Test001
 * 例子：
 * 为了避免特殊字符的编码错误，最好是要先使用encodeURI处理一下“GraphQL查询”，如：
 * encodeURI(`query Test001{
 *     hello1: hello,
 * }
 *
 * query Test002{
 *     serverDate1: serverDate,
 * }`);
 * 处理完就成了这样：
 * query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate1:%20serverDate,%0A%7D
 *
 * var myHeaders = new Headers();
 * myHeaders.append("Accept", "application/json");
 * myHeaders.append("Cache-Control", "no-store");
 * myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
 * myHeaders.append("Host", "127.0.0.1:9200");
 * myHeaders.append("Connection", "keep-alive");
 *
 * var requestOptions = {
 *    method: 'GET',
 *    headers: myHeaders,
 *    redirect: 'follow'
 * };
 *
 * fetch("https://127.0.0.1:9200/graphql?query=query%20Test001%7B%0A%20%20%20%20hello1:%20hello,%0A%7D%0A%0Aquery%20Test002%7B%0A%20%20%20%20serverDate1:%20serverDate,%0A%7D&variables={}&operationName=Test001", requestOptions)
 *    .then(response => response.text())
 *    .then(result => console.log(result))
 *    .catch(error => console.log('error', error));
 *
 * 成功！完美！
 *
 *
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

import * as Mutation from './Mutation.esm.mts';

import {
  type QueryResolvers,
  type MutationResolvers,
  type QueryGetMessageArgs,
  type MutationCreateMessageArgs,
  type MutationUpdateMessageArgs,
} from 'GSD2TSTD';

type TypeResolvers = QueryResolvers<null, QueryGetMessageArgs> & MutationResolvers<null, MutationCreateMessageArgs & MutationUpdateMessageArgs>;

type TypeTypeDefsAndResolvers = {
  typeDefs: DocumentNode;
  resolvers: TypeResolvers;
};

const typeDefsArray: Array<DocumentNode> = [],
  resolversArray: Array<TypeResolvers> = [];

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

Object.values( Mutation as Record<string, TypeTypeDefsAndResolvers> ).forEach( (
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
