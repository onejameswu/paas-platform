# paas-platform

<p align="center">
  <strong>PaaS Platform - 企业级云原生应用管理平台</strong>
</p>

<p align="center">
  统一管理 SaaS 应用层、PaaS 平台层、IaaS 底座层，一站式云原生运维管理
</p>

---

## 项目简介

paas-platform 是一套面向企业的云原生应用管理平台前端工程，基于 Vue 3 全家桶构建。平台围绕 **SaaS / PaaS / IaaS 三层架构** 设计，覆盖从底层基础设施到上层业务应用的全链路管理能力。

```
┌─────────────────────────────────────────────────┐
│                  SaaS 应用层                      │
│   租户管理 · 应用商店 · 计费中心 · 工单系统       │
├─────────────────────────────────────────────────┤
│                  PaaS 平台层                      │
│   容器编排 · 服务治理 · CI/CD · 配置中心          │
├─────────────────────────────────────────────────┤
│                  IaaS 底座层                      │
│   集群管理 · 节点监控 · 资源调度 · 存储网络       │
└─────────────────────────────────────────────────┘
```

当前版本已实现 PaaS 核心管理功能，SaaS 和 IaaS 层提供数据库表结构预留，后续迭代扩展。

## 功能清单

### 已实现（PaaS 核心层）

- **统一认证中心** — 账号密码登录、Canvas 图形验证码、双因素认证（2FA/TOTP）
- **会话管理** — 多用户并发登录、在线会话监控、同账号互斥踢出、Token 自动续签、30 分钟超时
- **RBAC 权限模型** — superAdmin / admin / user 三级角色，基于菜单的细粒度权限控制
- **动态路由** — 菜单与路由解耦，超级管理员可在线新增/编辑/删除菜单，路由实时生效
- **应用生命周期管理** — 应用的创建、部署、启停、重启、扩缩容
- **用户管理** — 用户 CRUD、角色分配、账号启停、搜索筛选
- **操作审计** — 全量操作日志记录，按类型/状态/时间筛选
- **API 网关管理** — 接口注册、分组管理、状态控制
- **集群监控** — 集群概览、节点状态、CPU/内存/网络指标、应用资源排行
- **在线用户** — 实时会话列表、强制踢出、会话超时自动清理
- **系统设置** — 主题配置（浅色/深色桌面主题、自定义配色）、平台信息、安全策略

### 数据库设计（SaaS + IaaS 预留）

已建 9 张核心表，同时提供 MySQL 和 Oracle 两套 DDL：

| 层级 | 表名 | 说明 |
|------|------|------|
| 通用 | `sys_role` / `sys_user` / `sys_menu` / `sys_role_menu` | 角色、用户、菜单、权限 |
| PaaS | `sys_app` / `sys_log` / `sys_api` | 应用、日志、接口 |
| IaaS | `sys_cluster_node` / `sys_monitor_metric` | 集群节点、监控指标 |

## 技术选型

| 类别 | 技术 | 选型理由 |
|------|------|---------|
| 框架 | Vue 3.5 + Composition API | 性能提升、更好的 TypeScript 支持 |
| 构建 | Vite 5 | 极速 HMR、原生 ESM |
| 路由 | Vue Router 4 | 动态路由、路由守卫 |
| 状态 | Pinia 2 | Vue 官方推荐，TypeScript 友好 |
| UI | Element Plus 2 | 企业级组件库，中文生态完善 |
| 测试 | Vitest + @vue/test-utils | 与 Vite 深度集成，跑分快 |
| HTTP | Axios | 拦截器机制成熟，便于扩展 |

## 快速开始

```bash
# 克隆项目
git clone https://github.com/your-username/paas-platform.git
cd paas-platform

# 安装依赖
npm install

# 启动开发服务
npm run dev

# 运行测试（含覆盖率）
npm run test

# 生产构建
npm run build
```

启动后访问 http://localhost:8080

## 默认账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 超级管理员 | admin | admin123 | 拥有全部权限，豁免 2FA |
| 普通管理员 | manager | manager123 | 用户/应用/日志/监控/在线用户 |
| 普通用户 | user | user123 | 仪表盘/应用/监控 |

> 生产环境部署前请务必修改默认密码。

## 项目结构

```
paas-platform/
├── public/login-images/          # 登录页背景图
├── src/
│   ├── api/                      # 后端接口层（待接入）
│   ├── mock/                     # Mock 数据层（开发阶段）
│   ├── router/                   # 路由 & 动态路由生成
│   ├── store/                    # Pinia 状态管理
│   │   ├── user.js               # 用户、权限、菜单
│   │   └── theme.js              # 主题配置、桌面主题
│   ├── views/                    # 页面
│   │   ├── Login.vue             # 登录（验证码 + 2FA）
│   │   ├── Layout.vue            # 侧边栏 + 顶栏布局
│   │   ├── Dashboard.vue         # 仪表盘
│   │   ├── Users.vue             # 用户管理
│   │   ├── Apps.vue              # 应用管理
│   │   ├── Logs.vue              # 操作日志
│   │   ├── Monitor.vue           # 集群监控
│   │   ├── Menus.vue             # 菜单管理
│   │   ├── Apis.vue              # 接口管理
│   │   ├── Sessions.vue          # 在线用户
│   │   └── Settings.vue          # 系统设置
│   └── __tests__/                # 单元测试（覆盖率 100%）
├── sql/
│   ├── paas_platform.sql         # MySQL 8.0+
│   └── paas_platform_oracle.sql  # Oracle 12c+
└── vite.config.js
```

## 数据库初始化

### MySQL

```bash
mysql -u root -p < sql/paas_platform.sql
```

### Oracle

```bash
sqlplus user/password @sql/paas_platform_oracle.sql
```

## 部署架构

```
                    ┌─────────────┐
                    │   CDN / OSS  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Nginx LB   │
                    └──┬─────┬────┘
                       │     │
              ┌────────▼┐  ┌▼────────┐
              │  Node 1 │  │  Node 2 │   前端静态资源（多副本）
              └────┬────┘  └────┬────┘
                   │            │
              ┌────▼────────────▼────┐
              │    API Gateway      │
              └──┬─────────────┬───┘
                 │             │
          ┌──────▼──┐   ┌─────▼──────┐
          │ Service │   │  Service   │   后端微服务
          └────┬────┘   └─────┬──────┘
               │              │
     ┌─────────▼──────────────▼─────────┐
     │         Redis Cluster           │   会话 / 缓存 / 分布式锁
     └─────────────┬───────────────────┘
                   │
          ┌────────▼────────┐
          │  DB Primary     │   MySQL 主从 / Oracle RAC
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │  DB Replica(s)  │
          └─────────────────┘
```

### Nginx 配置示例

```nginx
upstream paas_frontend {
    server 10.0.1.11:80 weight=1;
    server 10.0.1.12:80 weight=1;
    keepalive 64;
}

server {
    listen 80;
    server_name paas.example.com;

    location / {
        proxy_pass http://paas_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /assets/ {
        proxy_pass http://paas_frontend;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 测试

```bash
# 运行全部测试 + 覆盖率
npm run test

# 仅运行测试（不含覆盖率）
npm run test:run
```

当前测试覆盖 3 个模块共 99 个用例，代码覆盖率 100%（Statements / Branches / Functions / Lines）。

## Roadmap

- [x] PaaS 核心管理（用户、应用、菜单、接口、日志、监控）
- [x] 会话管理（并发登录、互斥踢出、Token 续签）
- [x] 多数据库支持（MySQL + Oracle）
- [x] 自定义桌面主题（浅色/深色）
- [ ] SaaS 多租户管理
- [ ] 容器编排面板（Kubernetes Dashboard 集成）
- [ ] CI/CD 流水线管理
- [ ] 告警中心（Prometheus + AlertManager）
- [ ] 国际化（i18n）

## License

[MIT](./LICENSE)
