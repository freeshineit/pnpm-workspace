import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'site',
  },
  alias: {
    store: require.resolve('../packages/store/src'),
    pkg1: require.resolve('../packages/pkg1/src'),
  },
});
