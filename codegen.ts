
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/schema/schema.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#DataSourceContext",
      },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
      config: {
        contextType: "../context#DataSourceContext",
      },
    }
  }
};

export default config;
