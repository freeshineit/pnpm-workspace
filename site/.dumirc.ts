import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'site',
  },
  alias: {
    '@ak2021/store': require.resolve('../packages/store/src'),
    '@ak2021/pkg1': require.resolve('../packages/pkg1/src'),
  },
});
