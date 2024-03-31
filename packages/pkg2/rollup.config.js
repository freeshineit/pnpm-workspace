/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const swc = require('@rollup/plugin-swc');
const serve = require('rollup-plugin-serve');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: pkg.name,
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
      // ES2015 Module 规范,
      // https://exploringjs.com/es6/ch_modules.html
      exports: 'auto',
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    resolve(),
    commonjs({ extensions: ['.js', '.ts'] }),
    swc({
      // https://swc.rs/docs/configuration/swcrc
      swc: {
        jsc: {
          target: 'es5',
        },
      },
      include: ['**/src/**/*.{ts,js}'],
    }),
    serve({
      port: 3000,
      contentBase: ['public', 'dist'],
    }),
  ],
};
