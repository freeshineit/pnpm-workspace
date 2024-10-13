module.exports = {
  extends: "xx",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: [
      "./tsconfig.json",
      "./packages/pkg2/tsconfig.json",
      "./packages/store/tsconfig.json",
      "./packages/ui/tsconfig.json",
      "./packages/web-components/tsconfig.json",
      "./packages/with-webpack/tsconfig.json",
    ],
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "no-debugger": "warn",
  },
};
