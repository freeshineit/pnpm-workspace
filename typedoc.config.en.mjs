const formatDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

export default {
  entryPointStrategy: "packages",
  entryPoints: ["./packages/react-ui", "./packages/store", "./packages/web-components"],
  packageOptions: {
    entryPoints: ["src/index.ts"],
    readme: "README.md",
    includeVersion: true,
    exclude: ["**/__tests__/**/*", "**/e2e/**/*", "**/node_modules/**/*"],
  },
  out: "docs/en",
  plugin: ["typedoc-plugin-rename-defaults", "typedoc-plugin-mdn-links", "typedoc-plugin-replace-text"],
  exclude: ["node_modules", "__tests__/**/*", "packages/*/{__tests__,e2e}/**/*"],
  // includeVersion: true,
  hideGenerator: true,
  disableSources: false,
  tsconfig: "tsconfig.json",
  readme: "README.md",
  githubPages: true,
  gitRemote: "origin",
  highlightLanguages: ["typescript", "javascript", "css", "html", "json", "scss", "jsx", "tsx", "bash"],
  replaceText: {
    inCodeCommentText: true,
    inCodeCommentTags: true,
    inMarkdown: false,
    replacements: [
      // {
      //   pattern:"",
      //   replace: '',
      // },
    ],
  },
  lang: "en",
  navigationLinks: {
    Examples: "https://github.com/freeshineit/pnpm-workspace/tree/main/site",
    Github: "https://github.com/freeshineit/pnpm-workspace",
  },
  customFooterHtml: `<p style="text-align: center;">Copyright © ${formatDate} <a href="https://github.com/freeshineit" target="_blank">ShineShao</a></p>`,
};
