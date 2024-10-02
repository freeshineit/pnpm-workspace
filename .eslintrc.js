module.exports = {
  extends: "xx",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["tsconfig.json"],
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/unbound-method": "off",
  },
};
