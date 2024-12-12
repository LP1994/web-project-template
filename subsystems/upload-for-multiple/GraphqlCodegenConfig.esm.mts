/**
 * Project: upload-for-multiple
 * FileDirPath: GraphqlCodegenConfig.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

'use strict';

import {
  type CodegenConfig as T_CodegenConfig,
} from '@graphql-codegen/cli';

/**
 * 自定义的类型别名T_DateFormatForObject，表示一个对象：
 * year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
type T_DateFormatForObject = {
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
 * @returns {T_DateFormatForObject} year：年、month：月、date：日、hours：时、minutes：分、seconds：秒、day：周（当为周日的时候返回的是字符串“日”，其他星期则是数字的字符串化）。
 */
function DateFormatForObject( dateInstance: Date = new Date( Date.now() ) ): T_DateFormatForObject{
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

/**
 * Codegen配置。
 * 详细配置见：node_modules/@graphql-codegen/plugin-helpers/typings/types.d.ts:339
 *
 * @type {T_CodegenConfig}
 */
const GraphqlCodegenConfig: T_CodegenConfig = {
  overwrite: true,
  watch: true,
  // 当没有文件要生成时，用于抑制非零退出代码的标志。
  ignoreNoDocuments: true,
  emitLegacyCommonJSImports: false,
  silent: false,
  verbose: true,
  debug: false,
  errorsOnly: false,
  noSilentErrors: true,
  /**
   * 允许您覆盖 @graphql-tools/graphql-tag-pluck 的配置，该工具可从代码文件中提取 GraphQL 操作。
   */
  // pluckConfig:{},

  // 通用的插件配置选项，会给所有的插件使用。
  config: {
    // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-visitor.d.ts:28   Start
    typesPrefix: 'T_',
    useTypeImports: true,
    emitLegacyCommonJSImports: false,
    printFieldsOnNewLines: true,
    // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-visitor.d.ts:28   End
  },

  generates: {
    /**
     * 详细配置见：node_modules/@graphql-codegen/plugin-helpers/typings/types.d.ts:217
     */
    './src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts': {
      overwrite: true,
      schema: [
        './src/graphQL/GraphQL.Schema.json',
        /*
         {
         'https://127.0.0.1:9200/graphql': {
         method: 'GET',
         headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json; charset=utf-8',
         'Cache-Control': 'no-cache',
         'Access-Control-Request-Headers': 'Authorization, Accept, Content-Type, Content-Language, Accept-Language, Cache-Control',
         'Access-Control-Request-Method': 'GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH',
         'user-agent': 'From Graphql Codegen',
         },
         },
         },
         */
      ],
      documents: [
        '!./src/graphQL/doc/*.{graphql,graphqls,gql}',
        '!./src/graphQL/test/*.{graphql,graphqls,gql}',
        '!./src/graphQL/GraphQL.Schema.json.graphql',
        '!./src/graphQL/api/GetSchemaJSON.graphql',
        './src/**/*.{graphql,graphqls,gql}',
      ],
      // 通用的插件配置选项，会给所有的插件使用。
      // config: {},
      plugins: [
        /**
         * typescript配置项详细见：
         * node_modules/@graphql-codegen/typescript/typings/config.d.ts:7
         * node_modules/@graphql-codegen/visitor-plugin-common/typings/base-types-visitor.d.ts:21
         * node_modules/@graphql-codegen/visitor-plugin-common/typings/base-visitor.d.ts:28
         */
        {
          'typescript': {
            // node_modules/@graphql-codegen/typescript/typings/config.d.ts:7   Start

            avoidOptionals: true,
            maybeValue: 'T | null | undefined | Promise< T | null | undefined >',
            inputMaybeValue: 'T | null | undefined | Promise< T | null | undefined >',

            // node_modules/@graphql-codegen/typescript/typings/config.d.ts:7   End

            // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-types-visitor.d.ts:21   Start

            declarationKind: {
              input: 'type',
              type: 'type',
              interface: 'interface',
              arguments: 'type',
            },
            wrapFieldDefinitions: true,
            fieldWrapperValue: 'T | Promise<T>',

            // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-types-visitor.d.ts:21   End
          },
        },

        /**
         * typescript-operations配置项详细见：
         * node_modules/@graphql-codegen/typescript-operations/typings/config.d.ts:8
         * node_modules/@graphql-codegen/visitor-plugin-common/typings/base-documents-visitor.d.ts:22
         * node_modules/@graphql-codegen/visitor-plugin-common/typings/base-types-visitor.d.ts:21
         * node_modules/@graphql-codegen/visitor-plugin-common/typings/base-visitor.d.ts:28
         */
        {
          'typescript-operations': {
            // node_modules/@graphql-codegen/typescript-operations/typings/config.d.ts:8   Start

            arrayInputCoercion: false,
            avoidOptionals: true,
            maybeValue: 'T | null | undefined | Promise< T | null | undefined >',

            // node_modules/@graphql-codegen/typescript-operations/typings/config.d.ts:8   End

            // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-documents-visitor.d.ts:22   Start

            // 如果设置为 "true"，它将导出创建的子类型，以便更容易访问在片段传播下声明的字段。
            exportFragmentSpreadSubTypes: true,
            // 如果设置为 "true"，将启用对片段变量解析的支持。
            experimentalFragmentVariables: true,

            // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-documents-visitor.d.ts:22   End

            // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-types-visitor.d.ts:21   Start

            declarationKind: {
              input: 'type',
              type: 'type',
              interface: 'interface',
              arguments: 'type',
            },
            wrapFieldDefinitions: true,
            fieldWrapperValue: 'T | Promise<T>',

            // node_modules/@graphql-codegen/visitor-plugin-common/typings/base-types-visitor.d.ts:21   End

          },
        },
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
          }: T_DateFormatForObject = DateFormatForObject();

          return `
/**
 * Project: upload-for-multiple
 * FileDirPath: src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: ${ year }-${ month }-${ date } ${ hours }:${ minutes }:${ seconds } 星期${ obj001[ day ] }
 */

'use strict';

${ fileContent }`;
        },
      },
    },
  },

  hooks: {
    afterAllFileWrite: [
      'prettier --write',
    ],
  },
};

export default GraphqlCodegenConfig;
