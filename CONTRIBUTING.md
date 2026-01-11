# 贡献指南

感谢你考虑为本项目做出贡献！

## 开发流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feat/amazing-feature`)
3. 提交你的更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 开启一个 Pull Request

## 开发规范

### 代码风格

- 使用 ESLint 和 Prettier 保持代码风格一致
- 提交前会自动运行 lint 和格式化检查
- 运行 `pnpm lint` 修复 lint 问题
- 运行 `pnpm fmt` 格式化代码

### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：

- `feat`: 新功能
- `fix`: 修复 bug
- `enhance`: 增强功能
- `refactor`: 重构
- `docs`: 文档更新
- `style`: 代码格式调整
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `perf`: 性能优化
- `ci`: CI 配置
- `build`: 构建相关

示例：

```
feat(store): add user authentication

- Add login/logout functionality
- Add token management
- Add user state management

Closes #123
```

### 测试

- 确保所有测试通过
- 为新功能添加测试
- 保持测试覆盖率

### 文档

- 更新相关文档
- 为新功能添加使用示例
- 保持 README 和 API 文档同步

## 发布流程

1. 确保所有测试通过
2. 更新 CHANGELOG
3. 运行 `pnpm version` 更新版本号
4. 运行 `pnpm release` 发布到 npm

## 问题反馈

- 使用 GitHub Issues 报告 bug
- 提供详细的复现步骤
- 包含环境信息（Node.js 版本、操作系统等）

## 行为准则

- 尊重所有贡献者
- 保持友好和专业
- 接受建设性的批评
