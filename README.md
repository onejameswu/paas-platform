# Cloud-Native PaaS

<p align="center">
  <strong>云原生应用管理平台</strong>
</p>

<p align="center">
  基于 Vue 3 + Vite 5 + Element Plus + Pinia 构建的企业级 PaaS 管理系统前端
</p>

---

## 功能特性

- **用户认证** — 账号密码登录 / 微信扫码登录，支持记住密码
- **角色权限** — superAdmin / admin / user 三级角色，基于菜单的权限控制
- **动态菜单** — 超级管理员可自定义菜单，动态路由生成
- **应用管理** — 应用的创建、启停、重启等生命周期管理
- **用户管理** — 用户列表、搜索筛选、角色分配、账号启停
- **日志审计** — 操作日志查询、类型筛选、分页浏览
- **接口管理** — API 接口注册、编辑、分组管理
- **监控中心** — 集群概览、节点状态、资源使用率、应用排行
- **登录页定制** — 支持自定义背景图片上传和切换

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5+ | 渐进式 JavaScript 框架 |
| Vite | 5.4+ | 下一代前端构建工具 |
| Vue Router | 4.4+ | 动态路由 & 路由守卫 |
| Pinia | 2.2+ | 新一代状态管理 |
| Element Plus | 2.9+ | Vue 3 组件库 |
| Axios | 1.6+ | HTTP 请求库 |

## 项目结构

```
cloud-native-paas/
├── public/
│   ├── favicon.ico
│   └── login-images/          # 登录页背景图片
│       ├── bg1.jpg
│       ├── bg2.jpg
│       └── bg3.jpg
├── src/
│   ├── api/                   # 接口请求（待接入后端）
│   ├── assets/                # 静态资源
│   ├── mock/                  # Mock 数据
│   │   └── index.js
│   ├── router/                # 路由配置
│   │   └── index.js
│   ├── store/                 # Pinia 状态管理
│   │   └── user.js
│   ├── views/                 # 页面组件
│   │   ├── Login.vue          # 登录页
│   │   ├── Layout.vue         # 布局框架
│   │   ├── Dashboard.vue      # 仪表盘
│   │   ├── Users.vue          # 用户管理
│   │   ├── Apps.vue           # 应用管理
│   │   ├── Logs.vue           # 日志审计
│   │   ├── Monitor.vue        # 监控中心
│   │   ├── Menus.vue          # 菜单管理
│   │   └── Apis.vue           # 接口管理
│   ├── App.vue
│   └── main.js
├── sql/
│   └── paas_platform.sql      # 数据库表结构
├── index.html
├── package.json
├── vite.config.js
├── LICENSE
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0
- npm >= 9.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8080

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 测试账号

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 超级管理员 | admin | admin123 | 全部功能 |
| 普通管理员 | manager | manager123 | 用户/应用/日志/监控 |
| 普通用户 | user | user123 | 仪表盘/应用/日志 |

## 数据库

项目提供了完整的 MySQL 数据库表结构，包含以下 9 张核心表：

- `sys_role` — 系统角色表
- `sys_user` — 系统用户表
- `sys_menu` — 系统菜单表
- `sys_role_menu` — 角色-菜单关联表
- `sys_app` — 应用信息表
- `sys_log` — 操作日志表
- `sys_api` — 接口管理表
- `sys_cluster_node` — 集群节点表
- `sys_monitor_metric` — 监控指标表

详见 `sql/paas_platform.sql`

## License

[MIT](./LICENSE)
