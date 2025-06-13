/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/dot-notation */
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import serve from "rollup-plugin-serve";
import { upperCamel } from "@skax/camel";
import { dts } from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";
import eslint from "@rollup/plugin-eslint";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
// import alias from "@rollup/plugin-alias";
import dayjs from "dayjs";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";

const isDev = process.env.NODE_ENV !== "production";

/**
 * @description rollup config function
 * @param {object} pkg package.json
 * @param {string} pkg.name name
 * @param {string=} pkg.main main
 * @param {version=} pkg.version string
 * @param {string=} pkg.author author
 * @param {object=} pkg.dependencies dependencies
 * @param {("tsc" | "swc")=} pkg.compiler compiler
 * @param {port=} pkg.port port
 * @param {Array} configs config[]
 * @returns
 */
function generateConfig(pkg, configs) {
  // prettier-ignore
  const banner = `/*
* ${pkg.name} v${pkg.version}
* Copyright (c) ${dayjs().format("YYYY-MM-DD")} ${pkg.author}
* Released under the MIT License.
*/`;

  const input = "src/index.ts";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const externals = Object.keys(pkg?.dependencies || {});

  const exportName = upperCamel(
    pkg?.name?.split("/").length > 1
      ? pkg?.name?.split("/")[pkg?.name?.split("/").length - 1]
      : pkg?.name,
  );

  const defaultConfigs = [
    {
      input,
      output: [
        {
          file: "dist/index.umd.js",
          format: "umd",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          name: exportName,
          sourcemap: isDev,
          banner,
        },
      ],
    },
    {
      input,
      output: [
        {
          file: "dist/index.js",
          format: "cjs",
          exports: "named",
          sourcemap: isDev,
          banner,
        },
      ],
    },
    {
      input,
      output: [
        {
          exports: "named",
          file: "dist/index.mjs",
          format: "esm",
          sourcemap: isDev,
          banner,
        },
      ],
    },
  ];

  return [
    ...defaultConfigs.map((entry) => ({
      ...entry,
      external: ["react/jsx-runtime", ...externals],
      plugins: [
        eslint({
          throwOnError: true, // lint 结果有错误将会抛出异常
          // throwOnWarning: true,
          include: [
            "src/**/*.ts",
            "src/**/*.js",
            "src/**/*.mjs",
            "src/**/*.jsx",
            "src/**/*.tsx",
          ],
          exclude: ["node_modules/**", "**/__tests__/**"],
        }),
        // alias({
        //   entries: [{ find: "@ak2021/store", replacement: "../store/src" }],
        // }),
        pkg.compiler === "tsc"
          ? typescript({
              declaration: false,
            })
          : swc({
              // https://swc.rs/docs/configuration/swcrc
              swc: {
                jsc: {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  target: ["umd", "iife"].includes(entry.output[0].format)
                    ? "es5"
                    : "es2015",
                },
              },
              include: ["./src/**/*.{ts,js,mjs,tsx,jsx}"],
            }),
        resolve({
          // extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'],
        }),
        commonjs({
          extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx", ".json"],
        }),
        replace({
          __VERSION__: `${pkg.version}`,
          preventAssignment: true,
        }),
        postcss({
          plugins: [autoprefixer(), cssnano({ preset: "default" })],
          sourceMap: isDev,
          extract: false,
          use: [
            [
              "sass",
              {
                silenceDeprecations: ["legacy-js-api"],
              },
            ],
          ],
        }),
        isDev && entry.output[0].format === "umd" && pkg.port
          ? serve({
              port: pkg.port,
              contentBase: ["public", "dist"],
            })
          : null,
        isDev
          ? null
          : copy({
              copyOnce: true,
              targets: [
                {
                  src: ["../../LICENSE"],
                  dest: "./",
                },
                // {
                //   src: "./package.json",
                //   dest: "./dist",
                //   transform: (contents) => {
                //     try {
                //       const jsonObj = JSON.parse(contents);
                //       delete jsonObj["scripts"];
                //       delete jsonObj["devDependencies"];
                //       jsonObj["main"] = "./dist/index.js";
                //       jsonObj["module"] = "./dist/index.mjs";
                //       jsonObj["types"] = "./dist/types/index.d.ts";
                //       jsonObj["files"] = [
                //         "dist",
                //         "CHANGELOG.md",
                //         "README.md",
                //         "LICENSE",
                //       ];
                //       contents = JSON.stringify(jsonObj);
                //     } catch (error) {}
                //     return contents;
                //   },
                // },
              ],
            }),
        ...[entry?.plugins || []],
      ].filter(Boolean),
    })),
    isDev
      ? null
      : {
          input: defaultConfigs[0].input,
          output: [{ file: "dist/types/index.d.ts", format: "es" }],
          plugins: [dts()],
          external: [/\.(css|less|scss|sass)$/],
        },
    ...(configs || []),
  ].filter(Boolean);
}

export default generateConfig;
