/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/dot-notation */
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import swc from '@rollup/plugin-swc';
import serve from 'rollup-plugin-serve';
import { upperCamel } from '@skax/camel';
import { dts } from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';
import eslint from '@rollup/plugin-eslint';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import dayjs from 'dayjs';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * @description rollup config function
 * @param {object} pkg package.json
 * @param {string} pkg.name name
 * @param {string=} pkg.main main
 * @param {version=} pkg.version string
 * @param {string=} pkg.author author
 * @param {object=} pkg.devDependencies devDependencies
 * @param {("tsc" | "swc")=} pkg.compiler compiler
 * @param {port=} pkg.port port
 * @param {Array} configs config[]
 * @returns
 */
function generateConfig(pkg, configs) {
  // prettier-ignore
  const banner = `/*
* ${pkg.name} v${pkg.version}
* Copyright (c) ${dayjs().format("YYYY-MM-DD")} ${pkg.author}
* Released under the MIT License.
*/`;

  const input = pkg.main || 'src/index.ts';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const externals = Object.keys(pkg?.devDependencies || {});

  const defaultConfigs = [
    {
      input,
      output: [
        {
          file: 'dist/umd/index.js',
          format: 'umd',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          name: upperCamel(pkg?.name?.split('/')[1]),
          sourcemap: isDev,
          banner,
        },
      ],
    },
    {
      input,
      output: [
        {
          exports: 'auto',
          file: 'dist/lib/index.js',
          format: 'cjs',
          sourcemap: isDev,
          banner,
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
          sourcemap: isDev,
          banner,
        },
      ],
    },
  ];

  return [
    ...defaultConfigs.map((entry) => ({
      ...entry,
      external: ['react/jsx-runtime', ...externals],
      plugins: [
        eslint({
          throwOnError: true, // lint 结果有错误将会抛出异常
          // throwOnWarning: true,
          include: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.mjs', 'src/**/*.jsx', 'src/**/*.tsx'],
          exclude: ['node_modules/**', '**/__tests__/**'],
        }),
        pkg.compiler === 'tsc'
          ? typescript({
              declaration: false,
            })
          : swc({
              // https://swc.rs/docs/configuration/swcrc
              swc: {
                jsc: {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  target: ['umd', 'iife'].includes(entry.output[0].format) ? 'es5' : 'es2015',
                },
              },
              include: ['./src/**/*.{ts,js,mjs,tsx,jsx}'],
            }),
        resolve({
          // extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'],
        }),
        commonjs({ extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'] }),
        replace({
          __VERSION__: `${pkg.version}`,
          preventAssignment: true,
        }),
        isDev && entry.output[0].format === 'umd'
          ? serve({
              port: pkg.port || 3000,
              contentBase: ['public', 'dist'],
            })
          : null,
        isDev
          ? null
          : copy({
              copyOnce: true,
              targets: [
                { src: ['./CHANGELOG.md', './README.md', '../../LICENSE'], dest: './dist' },
                {
                  src: './package.json',
                  dest: './dist',
                  transform: (contents) => {
                    try {
                      const jsonObj = JSON.parse(contents);
                      delete jsonObj['scripts'];
                      delete jsonObj['devDependencies'];
                      jsonObj['main'] = './lib/index.js';
                      jsonObj['module'] = './es/index.mjs';
                      jsonObj['types'] = './types/index.d.ts';
                      jsonObj['files'] = [
                        'lib',
                        'es',
                        'umd',
                        'types',
                        'CHANGELOG.md',
                        'README.md',
                        'LICENSE',
                      ];
                      contents = JSON.stringify(jsonObj);
                    } catch (error) {}
                    return contents;
                  },
                },
              ],
            }),
        ...[entry.plugins || []],
      ].filter(Boolean),
    })),
    {
      input: defaultConfigs[0].input,
      output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
      plugins: [dts()],
      external: [/\.(css|less|scss|sass)$/],
    },
    ...(configs || []),
  ];
}

export default generateConfig;
