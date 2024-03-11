/**
 * Project: web-project-template
 * FileDirPath: GraphqlCodegenConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

import {
  type CodegenConfig,
} from '@graphql-codegen/cli';

/**
 * 自定义的类型别名TypeDateFormatForObject，表示一个对象：
 * year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
type TypeDateFormatForObject = {
  /**
   * 表示年。
   */
  year: string;
  /**
   * 表示月。
   */
  month: string;
  /**
   * 表示日。
   */
  date: string;
  /**
   * 表示时。
   */
  hours: string;
  /**
   * 表示分。
   */
  minutes: string;
  /**
   * 表示秒。
   */
  seconds: string;
  /**
   * 表示周，当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化。
   */
  day: string;
};

/**
 * 返回传入的“Date实例对象”的年、月、日、时、分、秒、周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。<br />
 *
 * @param {Date} dateInstance 一个“Date实例对象”，默认值（当前时间）：new Date( Date.now() )，可选。<br />
 *
 * @returns {TypeDateFormatForObject} year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
function DateFormatForObject( dateInstance: Date = new Date( Date.now() ) ): TypeDateFormatForObject{
  const year: string = String( dateInstance.getFullYear() ),
    month: string = String( dateInstance.getMonth() + 1 ).padStart( 2, '0' ),
    date: string = String( dateInstance.getDate() ).padStart( 2, '0' ),
    hours: string = String( dateInstance.getHours() ).padStart( 2, '0' ),
    minutes: string = String( dateInstance.getMinutes() ).padStart( 2, '0' ),
    seconds: string = String( dateInstance.getSeconds() ).padStart( 2, '0' ),
    day001: number = dateInstance.getDay(),
    day: string = String( day001 === 0
                          ? '日'
                          : day001 );

  return {
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    day,
  };
}

const obj001: Record<string, string> = {
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六',
  '日': '日',
};

const GraphqlCodegenConfig: CodegenConfig = {
  overwrite: true,
  watch: true,
  emitLegacyCommonJSImports: false,
  silent: false,
  verbose: true,
  debug: false,
  errorsOnly: false,
  noSilentErrors: true,
  generates: {
    './simulation_servers/deno/src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts': {
      overwrite: true,
      schema: [
        './simulation_servers/deno/src/**/*.type.graphql',
      ],
      plugins: [
        'typescript',
        'typescript-resolvers',
      ],
      hooks: {
        beforeOneFileWrite: (
          // @ts-expect-error
          filePath: string,
          fileContent: string,
        ): string => {
          const {
            year,
            month,
            date,
            hours,
            minutes,
            seconds,
            day,
          }: TypeDateFormatForObject = DateFormatForObject();

          return `
/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: ${ year }-${ month }-${ date } ${ hours }:${ minutes }:${ seconds } 星期${ obj001[ day ] }
 */

'use strict';

${ fileContent }`;
        },
        afterAllFileWrite: [
          'prettier --write',
        ],
      },
    },

    './src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts': {
      overwrite: true,
      schema: [
        './src/graphQL/GraphQL.Schema.json',
      ],
      plugins: [
        'typescript',
        'typescript-resolvers',
      ],
      hooks: {
        beforeOneFileWrite: (
          // @ts-expect-error
          filePath: string,
          fileContent: string,
        ): string => {
          const {
            year,
            month,
            date,
            hours,
            minutes,
            seconds,
            day,
          }: TypeDateFormatForObject = DateFormatForObject();

          return `
/**
 * Project: web-project-template
 * FileDirPath: src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: ${ year }-${ month }-${ date } ${ hours }:${ minutes }:${ seconds } 星期${ obj001[ day ] }
 */

'use strict';

${ fileContent }`;
        },
        afterAllFileWrite: [
          'prettier --write',
        ],
      },
    },
  },
};

export default GraphqlCodegenConfig;
