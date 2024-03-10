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
      ],
      hooks: {
        beforeOneFileWrite: (
          // @ts-expect-error
          filePath: string,
          fileContent: string,
        ): string => {
          return `
/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
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
      ],
      hooks: {
        beforeOneFileWrite: (
          // @ts-expect-error
          filePath: string,
          fileContent: string,
        ): string => {
          return `
/**
 * Project: web-project-template
 * FileDirPath: src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
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
