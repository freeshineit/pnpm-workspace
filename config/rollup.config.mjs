/* eslint-disable @typescript-eslint/no-var-requires */
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import swc from '@rollup/plugin-swc';
import serve from 'rollup-plugin-serve';
import { upperCamel } from '@skax/camel';
import { dts } from 'rollup-plugin-dts';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * @description rollup config function
 * @param {object} pkg package.json
 * @param {string} pkg.name name
 * @param {Array} configs package.json
 * @returns
 */
function generateConfig(pkg, configs) {
  const input = pkg.main || 'src/index.ts';

  configs = configs || [
    {
      input,
      output: [
        {
          file: 'dist/umd/index.umd.js',
          format: 'umd',
          name: upperCamel(pkg.name.split('/')[1]),
        },
      ],
    },
    {
      input,
      output: [
        {
          exports: 'auto',
          // Node 默认的模块规范, 可通过 Webpack 加载
          // https://javascript.ruanyifeng.com/nodejs/module.html
          // https://zh.wikipedia.org/wiki/CommonJS
          file: 'dist/lib/index.js',
          format: 'cjs',
        },
      ],
    },
    {
      input,
      output: [
        {
          exports: 'auto',
          file: 'dist/es/index.mjs',
          format: 'esm',
        },
      ],
    },
  ];
  return [
    ...configs.map((entry) => ({
      ...entry,
      external: ['react/jsx-runtime'],
      plugins: [
        swc({
          // https://swc.rs/docs/configuration/swcrc
          swc: {
            jsc: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              target: ['umd', 'iife'].includes(entry.output[0].format) ? 'es5' : 'es2015',
            },
          },
          include: ['**/src/**/*.{ts,js,tsx,jsx}'],
        }),
        resolve(),
        commonjs({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
        isDev
          ? serve({
              port: pkg.port || 3000,
              contentBase: ['public', 'dist'],
            })
          : null,
      ].filter(Boolean),
    })),
    {
      input: configs[0].input,
      output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
      plugins: [dts()],
    },
  ];
}

export default generateConfig;
