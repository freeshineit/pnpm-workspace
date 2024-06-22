import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'site',
  },
  alias: {
    '@ak2021/store': require.resolve('../packages/store/src'),
    '@ak2021/with-webpack': require.resolve('../packages/with-webpack/src'),
  },
});
