/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const environment = process.env.NODE_ENV || "development";
const isDev = environment === "development";

module.exports = {
  mode: environment,
  entry: "./src/index.tsx",
  devtool: !isDev ? false : "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: isDev
      ? {
          name: "Foo",
          type: "umd",
        }
      : {
          type: "module",
        },
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  experiments: isDev
    ? {}
    : {
        outputModule: true,
      },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000,
  },
};
