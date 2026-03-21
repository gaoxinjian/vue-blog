# ggalaxy-blog

一个基于 Vue 3 + TypeScript 构建的现代化个人博客系统。

## 技术栈

- **前端框架:** Vue 3 + Vite + TypeScript
- **UI 组件库:** Element Plus
- **状态管理:** Pinia
- **后端/数据库:** Supabase (PostgreSQL + Auth)
- **Markdown 编辑器:** ByteMD
- **部署平台:** Vercel

## 功能特性

- ✨ 文章发布、编辑、删除（支持 Markdown）
- 🏷️ 分类与标签管理
- 🔍 文章搜索与筛选
- 👤 用户认证（登录/注册）
- 📱 响应式布局，适配移动端
- 🎵 内置音乐播放器
- 🌓 主题切换（预留）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行单元测试
npm run test:unit

# 代码检查
npm run lint
```

## 环境变量

复制 `.env.example` 并配置：

```bash
cp .env.example .env.development
cp .env.example .env.production
```

需要配置的环境变量：
- `VITE_SUPABASE_URL` - Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY` - Supabase 匿名密钥

## 项目结构

```
src/
├── api/          # API 接口
├── components/   # 组件
├── lib/          # 第三方库配置
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
├── utils/        # 工具函数
└── views/        # 页面视图
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Vue3 Blog

![Vue3](https://img.shields.io/badge/Vue-3.x-42b883)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.x-409eff)

### 部署平台
https://vercel.com/galaxys-projects-f9be057c/ggalaxy-vue-blog

### 数据库平台(github账号登录)
https://supabase.com/

静态资源放置在七牛云

[基于 Vue3 + TypeScript 构建的现代化个人博客(点击前往)](https://blog.ggalaxy4123.com/)
