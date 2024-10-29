/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const through = require("through2");
const { rimraf, rimrafSync, native, nativeSync } = require("rimraf");

const dist = "ezuikit-js";

function generatePackageJSON() {
  return gulp
    .src("./package.json")
    .pipe(
      through.obj((file, enc, cb) => {
        const rawJSON = file.contents.toString();
        const parsed = JSON.parse(rawJSON);
        delete parsed.scripts;
        delete parsed.dependencies;
        delete parsed.devDependencies;
        delete parsed.publishConfig;
        // delete parsed.resolutions;
        delete parsed.packageManager;
        delete parsed.jest;

        //
        const distKeys = ["main"];
        for (const key of distKeys) {
          if (parsed[key]) {
            parsed[key] = parsed[key].replace(/\.\/dist\/|dist\//, "");
          }
        }

        // const exportsObj = {};
        // for (const key in parsed.exports) {
        //   exportsObj[key] = parsed.exports[key].replace(/\.\/dist\/|dist\//, './');
        // }
        // parsed.exports = exportsObj;

        delete parsed.amd;
        delete parsed.iife;
        delete parsed.umd;
        delete parsed.umdMin;

        parsed.name = "ezuikit-js";

        const stringified = JSON.stringify(parsed, null, 2);
        file.contents = Buffer.from(stringified);
        cb(null, file);
      }),
    )
    .pipe(gulp.dest(dist));
}

function generateGitIgnore() {
  return gulp
    .src(".gitignore")
    .pipe(
      through.obj((file, enc, cb) => {
        const stringified = `
node_modules
coverage
.nyc_output
.DS_Store
*.log
.vscode
.idea
dist
compiled
.awcache
.rpt2_cache
docs
stats.html
.DS_Store
.idea
.vscode
.setting
build/
npm-debug.log*
npm-error.log*
yarn-debug.log*
            `;

        file.contents = Buffer.from(stringified);
        cb(null, file);
      }),
    )
    .pipe(gulp.dest(dist));
}

function copyFile() {
  return gulp
    .src(["README.md", "CHANGELOG.md", "LICENSE", "dist/ezuikit.js"], {
      allowEmpty: true,
    })
    .pipe(gulp.dest(dist));
}

function copyStaticFile() {
  return gulp
    .src(["dist/ezuikit_static/**"], { allowEmpty: true })
    .pipe(gulp.dest(dist + "/ezuikit_static"));
}

function copyExamplesFile() {
  return gulp
    .src(["examples/**", `!**/node_modules/**`, `!examples/**/dist/**`], {
      allowEmpty: true,
    })
    .pipe(gulp.dest(dist + "/examples"));
}

function copyStaticToExamples() {
  const list = [
    "examples/react-demo/public/ezuikit_static",
    "examples/vue-demo/public/ezuikit_static",
    "examples/vue3-demo/public/ezuikit_static",
  ];
  rimrafSync(list);
  return gulp
    .src(["dist/ezuikit_static/**"], { allowEmpty: true })
    .pipe(gulp.dest(list[0]))
    .pipe(gulp.dest(list[1]))
    .pipe(gulp.dest(list[2]));
}

function copyVueExampleDistToPublic() {
  const targetDir = "./public/vue-demo";
  rimrafSync(targetDir);
  return gulp
    .src(["./examples/vue-demo/dist/**", `!examples/**/ezuikit_static/**`], {
      allowEmpty: true,
    })
    .pipe(gulp.dest(targetDir));
}

function copyVue3ExampleDistToPublic() {
  const targetDir = "./public/vue3-demo";
  rimrafSync(targetDir);
  return gulp
    .src(["./examples/vue3-demo/dist/**", `!examples/**/ezuikit_static/**`], {
      allowEmpty: true,
    })
    .pipe(gulp.dest("./public/vue3-demo"));
}

function copyReactExampleDistToPublic() {
  const targetDir = "./public/react-demo";
  rimrafSync(targetDir);
  return gulp
    .src(["./examples/react-demo/build/**", `!examples/**/ezuikit_static/**`], {
      allowEmpty: true,
    })
    .pipe(gulp.dest(targetDir));
}

// gulp buildExamples
exports.copyStaticToExamples = gulp.series(copyStaticToExamples);

// 执行前记得对每一个 example (vue, vue3, react) 进行构建
exports.copyExamplesDistToPublic = gulp.series(
  copyVueExampleDistToPublic,
  copyVue3ExampleDistToPublic,
  copyReactExampleDistToPublic,
);

exports.default = gulp.series(
  generatePackageJSON,
  generateGitIgnore,
  copyFile,
  copyStaticFile,
  copyExamplesFile,
);
