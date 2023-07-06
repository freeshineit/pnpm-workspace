// Convert CommonJS modules to ES6
const commonjs = require('@rollup/plugin-commonjs');
// babel
const { babel } = require('@rollup/plugin-babel');
// so Rollup can find `rxjs`. lib
const resolve = require('@rollup/plugin-node-resolve');
// import eslint from '@rollup/plugin-eslint';

const pkg = require('./package.json')

module.exports = {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format:"umd",
      name:pkg.name
    },
    plugins: [
      resolve(),
      commonjs({ extensions: ['.js', '.ts'] }),
      babel({ babelHelpers: 'bundled' }),
    ]
};