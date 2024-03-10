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
  generates: {
    './simulation_servers/deno/src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts': {
      schema: [
        './simulation_servers/deno/src/**/*.type.graphql',
      ],
      plugins: [
        'typescript',
      ],
    },
    './src/graphql_schema_definition_to_ts_type_definition/GSD2TSTD.esm.mts': {
      schema: [
        './src/graphQL/GraphQL.Schema.json',
      ],
      plugins: [
        'typescript',
      ],
    },
  },
  hooks: {
    afterAllFileWrite: [
      'prettier --write',
    ],
  },
};

export default GraphqlCodegenConfig;
