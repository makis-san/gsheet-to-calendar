import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();

const bundle = (config) => ({
  ...config,
  input: './src/cli.ts',
  external: (id) => {
    return !id.startsWith('.') && !path.isAbsolute(id);
  }
});

export default [
  bundle({
    plugins: [
      del({ targets: 'dist/*' }),
      peerDepsExternal({
        packageJsonPath: './package.json'
      }),
      esbuild({
        minify: false,
        tsconfig: './tsconfig.json',
        sourceMap: false,
        define: {
          'process.env.CLIENT_ID': `"${process.env.CLIENT_ID}"`,
          'process.env.CLIENT_SECRET': `"${process.env.CLIENT_SECRET}"`,
          'process.env.DOC_API_KEY': `"${process.env.DOC_API_KEY}"`,
          'process.env.TIME_ZONE': `"${process.env.TIME_ZONE}"`
        }
      })
    ],
    output: {
      dir: `./dist`,
      format: 'commonjs',
      sourcemap: true,
      preserveModules: true
    }
  }),
  {
    input: './src/cli.ts',
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ],
    output: {
      dir: `./dist`,
      format: 'commonjs',
      preserveModules: true
    }
  }
];
