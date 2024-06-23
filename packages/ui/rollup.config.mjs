import generateConfig from '../../config/rollup.config';

// import swc from '@rollup/plugin-swc';

export default generateConfig([
  {
    input: './components/Button.tsx',
    output: {
      file: 'dist/components/button.js',
    },
  },
  {
    input: './components/Header.tsx',
    output: {
      file: 'dist/components/header.js',
    },
  },
]);
// .map((entry) => ({
//   ...entry,
//   external: ['react/jsx-runtime'],
//   plugins: [
//     swc({
//       // https://swc.rs/docs/configuration/swcrc
//       swc: {
//         jsc: {
//           target: 'es5',
//         },
//       },
//       include: ['**/src/**/*.{ts,js,tsx,jsx}'],
//     }),
//   ],
// }));
