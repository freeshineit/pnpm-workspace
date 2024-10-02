## 开发

### 引用本地包

- 在`package.json`中安装对应的包。

  ```json
  "pkg1": "workspace:*"
  ```

- 在`.dumirc.ts` 中追加别名

  ```ts
  pkg1: require.resolve('../packages/pkg1/src'),
  ```

- 在 `tsconfig.json`中添加`path`

  ```json
  "pkg1": ["../packages/pkg1/src"]
  ```
