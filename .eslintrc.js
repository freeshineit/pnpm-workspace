module.exports = {
  extends: "xx",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: true,
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "no-debugger": "warn",
  },
};
