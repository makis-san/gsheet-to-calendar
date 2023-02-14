import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();

const bundle = (config) => ({
  ...config,
  external: (id) => {
    return !id.startsWith('.') && !path.isAbsolute(id);
  }
});

const esbuildBaseConfig = {
  minify: false,
  tsconfig: './tsconfig.json',
  sourceMap: false,
  define: {
    'process.env.CLIENT_ID': `"${process.env.CLIENT_ID}"`,
    'process.env.CLIENT_SECRET': `"${process.env.CLIENT_SECRET}"`,
    'process.env.DOC_API_KEY': `"${process.env.DOC_API_KEY}"`,
    'process.env.TIME_ZONE': `"${process.env.TIME_ZONE}"`,
    'process.env.DISABLE_OAUTH': `"${process.env.DISABLE_OAUTH}"`
  }
};

const baseOutput = (config) => ({
  format: 'commonjs',
  sourcemap: true,
  preserveModules: true,
  ...config
});

export default [
  /// CLI BUILD
  bundle({
    input: './src/cli.ts',
    plugins: [
      del({ targets: 'dist/*' }),
      peerDepsExternal({
        packageJsonPath: './package.json'
      }),
      esbuild(esbuildBaseConfig)
    ],
    output: baseOutput({
      dir: `./dist/cli`
    })
  }),
  {
    input: './src/cli.ts',
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ],
    output: baseOutput({
      dir: `./dist/cli`
    })
  },

  /// MODULE BUILD
  bundle({
    input: './src/module/index.ts',
    plugins: [
      peerDepsExternal({
        packageJsonPath: './package.json'
      }),
      esbuild({ ...esbuildBaseConfig, define: undefined })
    ],
    output: baseOutput({
      dir: `./dist/module`,
      preserveModules: false
    })
  }),

  {
    input: './src/module/index.ts',
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ],
    output: baseOutput({
      dir: `./dist/module`,
      preserveModules: false
    })
  }
];
