import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'site-react',
  },
  alias: {
    pkg1: require.resolve('../packages/pkg1/src'),
  },
});
