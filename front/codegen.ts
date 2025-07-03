
import type { CodegenConfig } from '@graphql-codegen/cli';

// const config: CodegenConfig = {
//   overwrite: true,
//   schema: "http://localhost:4000",
//   documents: "src/**/*.js",
//   generates: {
//     "src/gql/": {
//       preset: "client",
//       plugins: []
//     }
//   }
// };

const config: CodegenConfig = {
  overwrite: true,
  schema: './mocked-schema.graphql',
  documents: './src/**/*.graphql',
  generates: {
    './src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  }
};

export default config;
