/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/database/mongo/MongooseConnect.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-12-07 08:34:26 星期三
 */

/**
 * 开始使用“mongoose”连接MongoDB数据库，并返回：数据库连接实例，用于关闭、切换数据库等等操作、初始化数据库连接成功后的默认数据库实例（在连接数据库的配置中指定）。
 */

'use strict';

import {
  type Connection,

  Mongoose,
} from 'npm:mongoose';

import {
  config,
  dbName,
  uri,
} from './MongooseConfig.esm.mts';

/**
 * 自定义类型，表示一个函数类型。<br />
 *
 * 有一个函数参数：methodName，该参数的值目前仅有一个：'close'，表示“mongoose”驱动器的“Connection类”执行了“close()”，无默认值，可选。
 */
export type TypeCBFun001 = ( methodName?: string ) => void;

export type TypeMongooseConnect = {
  /**
   * 数据库连接实例，用于关闭、切换数据库等等操作。
   */
  MongooseClient: Connection;
};

export type TypeMongooseConnectForSingleton = {
  /**
   * 该自定义“MyMongooseConnection”类是继承了“Mongoose”驱动器的“Connection类”。<br />
   * 1、扩展了在关闭数据库连接时（即“mongoose”驱动器的“Connection类”执行了“close()”时）执行回调函数（函数类型见TypeCBFun001），用于处理指定的逻辑。<br />
   * 2、这个回调函数（函数类型见TypeCBFun001）的初始化是在该自定义“MyMongooseConnection”类在被实例化时，传给构造函数的参数，该参数的数据类型为一个函数（函数类型见TypeCBFun001）。<br />
   */
  MyMongooseConnection: MyMongooseConnection;
  /**
   * 数据库连接实例，用于关闭、切换数据库等等操作。
   */
  MongooseClient: Connection;
};

let mongooseConnectForSingleton: TypeMongooseConnectForSingleton | null;

/**
 * 该自定义“MyMongooseConnection”类是继承了“Mongoose”驱动器的“Connection类”。<br />
 * 1、扩展了在关闭数据库连接时（即“mongoose”驱动器的“Connection类”执行了“close()”时）执行回调函数（函数类型见TypeCBFun001），用于处理指定的逻辑。<br />
 * 2、这个回调函数（函数类型见TypeCBFun001）的初始化是在该自定义“MyMongooseConnection”类在被实例化时，传给构造函数的参数，该参数的数据类型为一个函数（函数类型见TypeCBFun001）。<br />
 */
export class MyMongooseConnection
  extends ( new Mongoose() ).Connection {

  /**
   * 该私有属性是一个函数（函数类型见TypeCBFun001）。<br />
   * 该函数（函数类型见TypeCBFun001）是在关闭数据库连接时（即“mongoose”驱动器的“Connection类”执行了“close()”时，用于处理指定的逻辑。<br />
   *
   * @param {string} methodName 该参数的值目前仅有一个：'close'，表示“mongoose”驱动器的“Connection类”执行了“close()”，无默认值，可选。
   */
  #cb: TypeCBFun001 = (
    // @ts-expect-error
    methodName?: string
  ): void => {
  };

  /**
   * 该自定义“MyMongooseConnection”类是继承了“Mongoose”驱动器的“Connection类”。<br />
   * 1、扩展了在关闭数据库连接时（即“mongoose”驱动器的“Connection类”执行了“close()”时）执行回调函数（函数类型见TypeCBFun001），用于处理指定的逻辑。<br />
   * 2、这个回调函数（函数类型见TypeCBFun001）的初始化是在该自定义“MyMongooseConnection”类在被实例化时，传给构造函数的参数，该参数的数据类型为一个函数（函数类型见TypeCBFun001）。<br />
   *
   * @param {TypeCBFun001 | undefined} cb 该函数（函数类型见TypeCBFun001）是在关闭数据库连接时（即“mongoose”驱动器的“Connection类”执行了“close()”时）执行的，用于处理指定的逻辑，默认值：( methodName?: string ): void => {}，可选。
   */
  constructor( cb: TypeCBFun001 | undefined = (
    // @ts-expect-error
    methodName?: string
  ): void => {
  } ){
    super();

    this.#cb = cb;
  }

  /**
   * 用于关闭数据库连接，并在关闭后执行指定的回调函数（函数类型见TypeCBFun001），并为该回调函数传入一个字符串'close'，表示“mongoose”驱动器的“Connection类”执行了“close()”。
   *
   * @param {boolean} force 是否强制关闭连接，true表示强制关闭连接，默认值：true，可选。
   *
   * @returns {Promise<void>}
   */
  override async close( force: boolean = true ): Promise<void>{
    await super.close( force );

    this.#cb( 'close' );
  }

}

/**
 * 开始使用“mongoose”连接MongoDB数据库，并返回一个对象。
 *
 * @returns {TypeMongooseConnect} 返回值是一个对象，类型为TypeMongooseConnect。
 */
function MongooseConnect(): TypeMongooseConnect{
  const mongoose: Mongoose = new Mongoose(),
    MongooseClient: Connection = mongoose.createConnection( uri, config ).useDb( dbName );

  return {
    MongooseClient,
  };
}

/**
 * 单例的，开始使用“mongoose”连接MongoDB数据库，并返回一个对象。
 *
 * @returns {Promise<TypeMongooseConnectForSingleton>} 返回值是一个对象，类型为TypeMongooseConnectForSingleton。
 */
async function MongooseConnectForSingleton(): Promise<TypeMongooseConnectForSingleton>{
  if( !mongooseConnectForSingleton ){
    const myMongooseConnection: MyMongooseConnection = new MyMongooseConnection( ( methodName?: string ): void => {
      if( methodName === 'close' ){
        mongooseConnectForSingleton = null;
      }
    } );

    mongooseConnectForSingleton = {
      MyMongooseConnection: myMongooseConnection,
      MongooseClient: ( await myMongooseConnection.openUri( uri, config ) ).useDb( dbName ),
    };
  }

  return mongooseConnectForSingleton as TypeMongooseConnectForSingleton;
}

export {
  MongooseConnect,
  MongooseConnectForSingleton,
};

export default {
  MongooseConnect,
  MongooseConnectForSingleton,
};
