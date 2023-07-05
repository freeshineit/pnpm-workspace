## pnpm

```bash

# 安装依赖
pnpm i
# or
pnpm install

# 根目录安装 webpack (w 是小写)
pnpm add webpack -w -D

# 在子包中安装依赖
pnpm add <dependent name> -r --filter <package name>

# 执行子包中的脚本
pnpm run --filter <package name> <scripts name>

# 子包相互引用
pnpm add <package A> -r --filter <package B>
```