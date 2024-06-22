/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const swc = require('@rollup/plugin-swc');
const serve = require('rollup-plugin-serve');
const { upperCamel } = require('@skax/camel');
const { dts } = require('rollup-plugin-dts');
const isDev = process.env.NODE_ENV !== 'production';

const input = 'src/index.ts';

/**
 * @description rollup config function
 * @param {object} pkg package.json
 * @param {string} pkg.name name
 * @returns
 */
function generateConfig(pkg) {
  return [
    {
      input,
      output: [
        {
          file: 'dist/index.umd.js',
          format: 'umd',
          name: upperCamel(pkg.name.split('/')[1]),
        },
        {
          exports: 'auto',
          // Node 默认的模块规范, 可通过 Webpack 加载
          // https://javascript.ruanyifeng.com/nodejs/module.html
          // https://zh.wikipedia.org/wiki/CommonJS
          file: 'dist/index.js',
          format: 'cjs',
        },
        {
          exports: 'auto',
          file: 'dist/index.mjs',
          format: 'esm',
        },
      ],
      plugins: [
        swc({
          // https://swc.rs/docs/configuration/swcrc
          swc: {
            jsc: {
              target: 'es5',
            },
          },
          include: ['**/src/**/*.{ts,js}'],
        }),
        resolve(),
        commonjs({ extensions: ['.js', '.ts'] }),
        isDev
          ? serve({
              port: 3000,
              contentBase: ['public', 'dist'],
            })
          : null,
      ].filter(Boolean),
    },
    {
      input,
      output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
      plugins: [dts()],
    },
  ];
}

module.exports = generateConfig;
