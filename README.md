## pnpm workspace

![build](https://github.com/freeshineit/pnpm-workspace/workflows/build/badge.svg)

## scripts

node >=18.3

```bash

# 安装依赖
pnpm i
# or
pnpm install

# 根目录安装 webpack (w 是小写)
pnpm add webpack -w -D

# 给子包中安装依赖
pnpm add <dependent name> -r --filter <package name>

# 给子包pkg2安装lodash-es
pnpm add lodash-es -r --filter pkg2

# 执行子包中的脚本
pnpm run --filter <package name> <scripts name>

# 执行子包pkg2中的dev 脚本
pnpm run --filter pkg2 dev

# 子包相互引用
pnpm add <package A> -r --filter <package B>

# 执行所有子包中的脚本 注意星号
pnpm run --filter '*' build

# 发布npm包
```
