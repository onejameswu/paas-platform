-- ============================================================
-- 云原生应用管理平台 - 数据库表结构设计
-- 数据库: MySQL 8.0+
-- 字符集: utf8mb4
-- 说明: 包含用户、角色、菜单、接口、应用、日志、监控等核心表
-- ============================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `paas_platform`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE `paas_platform`;

-- ============================================================
-- 1. 角色表 (sys_role)
-- ============================================================
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '角色ID',
  `role_code`   VARCHAR(32)  NOT NULL                 COMMENT '角色编码 (superAdmin/admin/user)',
  `role_name`   VARCHAR(64)  NOT NULL                 COMMENT '角色名称',
  `description` VARCHAR(256) DEFAULT NULL             COMMENT '角色描述',
  `status`      TINYINT      NOT NULL DEFAULT 1       COMMENT '状态 (1=启用 0=禁用)',
  `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';

-- 初始角色数据
INSERT INTO `sys_role` (`id`, `role_code`, `role_name`, `description`, `status`) VALUES
(1, 'superAdmin', '超级管理员', '拥有系统全部权限，可管理所有模块', 1),
(2, 'admin',      '普通管理员', '可管理用户、应用、查看日志', 1),
(3, 'user',       '普通用户',   '仅可查看仪表盘和管理自己的应用', 1);


-- ============================================================
-- 2. 用户表 (sys_user)
-- ============================================================
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '用户ID',
  `username`    VARCHAR(64)  NOT NULL                 COMMENT '用户名 (登录账号)',
  `password`    VARCHAR(256) NOT NULL                 COMMENT '密码 (BCrypt加密存储)',
  `nick_name`   VARCHAR(64)  DEFAULT NULL             COMMENT '昵称',
  `email`       VARCHAR(128) DEFAULT NULL             COMMENT '邮箱',
  `phone`       VARCHAR(20)  DEFAULT NULL             COMMENT '手机号',
  `avatar_url`  VARCHAR(512) DEFAULT NULL             COMMENT '头像URL',
  `role_id`     BIGINT       NOT NULL                 COMMENT '角色ID',
  `status`      TINYINT      NOT NULL DEFAULT 1       COMMENT '状态 (1=正常 0=禁用)',
  `last_login`  DATETIME     DEFAULT NULL             COMMENT '最后登录时间',
  `last_ip`     VARCHAR(64)  DEFAULT NULL             COMMENT '最后登录IP',
  `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 初始用户数据 (密码为明文示意，实际应使用BCrypt加密)
-- admin/admin123  manager/manager123  user/user123  guest/guest123
INSERT INTO `sys_user` (`id`, `username`, `password`, `nick_name`, `email`, `phone`, `role_id`, `status`) VALUES
(1, 'admin',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '超级管理员', 'admin@paas.com',   '13800000001', 1, 1),
(2, 'manager', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '运维经理',     'manager@paas.com', '13800000002', 2, 1),
(3, 'user',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '开发者小王',   'user@paas.com',    '13800000003', 3, 1),
(4, 'guest',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '访客用户',     'guest@paas.com',   '13800000004', 3, 0);


-- ============================================================
-- 3. 菜单权限表 (sys_menu)
-- ============================================================
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '菜单ID',
  `parent_id`   BIGINT       NOT NULL DEFAULT 0       COMMENT '父菜单ID (0=顶级菜单)',
  `menu_name`   VARCHAR(64)  NOT NULL                 COMMENT '菜单名称',
  `menu_code`   VARCHAR(64)  NOT NULL                 COMMENT '菜单编码 (用于前端路由匹配)',
  `path`        VARCHAR(256) DEFAULT NULL             COMMENT '路由路径',
  `icon`        VARCHAR(64)  DEFAULT NULL             COMMENT '菜单图标',
  `sort_order`  INT          NOT NULL DEFAULT 0       COMMENT '排序 (越小越靠前)',
  `visible`     TINYINT      NOT NULL DEFAULT 1       COMMENT '是否可见 (1=显示 0=隐藏)',
  `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_menu_code` (`menu_code`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';

-- 初始菜单数据
INSERT INTO `sys_menu` (`id`, `parent_id`, `menu_name`, `menu_code`, `path`, `icon`, `sort_order`) VALUES
(1, 0, '仪表盘',   'dashboard', '/dashboard', 'Odometer',  1),
(2, 0, '用户管理', 'users',     '/users',     'User',      2),
(3, 0, '应用管理', 'apps',      '/apps',      'Monitor',   3),
(4, 0, '日志审计', 'logs',      '/logs',      'Document',  4);


-- ============================================================
-- 4. 角色-菜单关联表 (sys_role_menu)
-- ============================================================
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `id`      BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` BIGINT NOT NULL                COMMENT '角色ID',
  `menu_id` BIGINT NOT NULL                COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`),
  KEY `idx_menu_id` (`menu_id`),
  CONSTRAINT `fk_rm_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`),
  CONSTRAINT `fk_rm_menu` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- 角色权限分配
-- 超级管理员: 全部权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4);
-- 普通管理员: 全部权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4);
-- 普通用户: 仪表盘 + 应用管理
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(3, 1), (3, 3);


-- ============================================================
-- 5. 应用表 (sys_app)
-- ============================================================
DROP TABLE IF EXISTS `sys_app`;
CREATE TABLE `sys_app` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '应用ID',
  `app_name`    VARCHAR(128) NOT NULL                 COMMENT '应用名称',
  `app_type`    VARCHAR(32)  NOT NULL DEFAULT 'web'   COMMENT '应用类型 (web/microservice/middleware)',
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'stopped' COMMENT '状态 (running/stopped/error)',
  `instances`   INT          NOT NULL DEFAULT 0       COMMENT '运行实例数',
  `cpu_usage`   VARCHAR(16)  DEFAULT '0%'             COMMENT 'CPU使用率',
  `memory_usage` VARCHAR(16) DEFAULT '0MB'            COMMENT '内存使用量',
  `owner_id`    BIGINT       DEFAULT NULL             COMMENT '负责人用户ID',
  `description` VARCHAR(512) DEFAULT NULL             COMMENT '应用描述',
  `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_owner_id` (`owner_id`),
  CONSTRAINT `fk_app_owner` FOREIGN KEY (`owner_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用管理表';

-- 初始应用数据
INSERT INTO `sys_app` (`id`, `app_name`, `app_type`, `status`, `instances`, `cpu_usage`, `memory_usage`, `owner_id`, `create_time`) VALUES
(1, '电商前台',     'web',          'running', 3, '25%',  '512MB', 1, '2024-01-15 10:00:00'),
(2, '用户服务',     'microservice', 'running', 2, '15%',  '256MB', 2, '2024-02-20 14:30:00'),
(3, '订单服务',     'microservice', 'stopped', 0, '0%',   '0MB',   2, '2024-03-10 09:00:00'),
(4, '数据分析平台', 'web',          'running', 1, '45%',  '1GB',   1, '2024-04-05 16:00:00'),
(5, '消息队列',     'middleware',   'running', 2, '10%',  '512MB', 1, '2024-05-12 11:00:00'),
(6, '文件存储服务', 'microservice', 'error',   1, '0%',   '128MB', 3, '2024-06-01 08:30:00');


-- ============================================================
-- 6. 操作日志表 (sys_log)
-- ============================================================
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '日志ID',
  `user_id`     BIGINT       DEFAULT NULL             COMMENT '操作用户ID',
  `username`    VARCHAR(64)  DEFAULT NULL             COMMENT '操作用户名 (冗余字段，便于查询)',
  `action`      VARCHAR(256) NOT NULL                 COMMENT '操作内容',
  `action_type` VARCHAR(32)  NOT NULL DEFAULT 'other' COMMENT '操作类型 (login/deploy/permission/config/audit)',
  `ip_address`  VARCHAR(64)  DEFAULT NULL             COMMENT '操作IP地址',
  `status`      VARCHAR(16)  NOT NULL DEFAULT 'success' COMMENT '操作结果 (success/failed)',
  `detail`      TEXT         DEFAULT NULL             COMMENT '详细信息 (JSON格式)',
  `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 初始日志数据
INSERT INTO `sys_log` (`user_id`, `username`, `action`, `action_type`, `ip_address`, `status`, `create_time`) VALUES
(1, 'admin',   '登录系统',                     'login',      '192.168.1.100', 'success', '2024-10-28 10:15:30'),
(1, 'admin',   '部署应用 [电商前台]',           'deploy',     '192.168.1.100', 'success', '2024-10-28 10:20:15'),
(2, 'manager', '登录系统',                     'login',      '192.168.1.101', 'success', '2024-10-28 10:25:00'),
(2, 'manager', '修改用户 [user] 权限',         'permission', '192.168.1.101', 'success', '2024-10-28 10:30:45'),
(3, 'user',    '登录系统',                     'login',      '192.168.1.102', 'success', '2024-10-28 10:35:20'),
(3, 'user',    '创建应用 [测试服务]',           'deploy',     '192.168.1.102', 'success', '2024-10-28 10:40:10'),
(1, 'admin',   '删除应用 [旧版API]',           'deploy',     '192.168.1.100', 'success', '2024-10-28 11:00:00'),
(4, 'guest',   '登录系统',                     'login',      '192.168.1.103', 'failed',  '2024-10-28 11:15:30'),
(1, 'admin',   '重启服务 [消息队列]',           'deploy',     '192.168.1.100', 'success', '2024-10-28 11:20:00'),
(2, 'manager', '查看审计日志',                 'audit',      '192.168.1.101', 'success', '2024-10-28 11:30:15'),
(1, 'admin',   '修改系统配置',                 'config',     '192.168.1.100', 'success', '2024-10-28 13:00:00'),
(3, 'user',    '扩容应用 [用户服务] 至3实例',   'deploy',     '192.168.1.102', 'success', '2024-10-28 13:30:45'),
(1, 'admin',   '创建新用户 [guest]',           'permission', '192.168.1.100', 'success', '2024-10-28 14:00:20'),
(2, 'manager', '停止应用 [订单服务]',           'deploy',     '192.168.1.101', 'success', '2024-10-28 14:30:00'),
(1, 'admin',   '系统备份',                     'config',     '192.168.1.100', 'success', '2024-10-28 15:00:10');


-- ============================================================
-- 7. 接口管理表 (sys_api)
-- ============================================================
DROP TABLE IF EXISTS `sys_api`;
CREATE TABLE `sys_api` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '接口ID',
  `name`        VARCHAR(128) NOT NULL                 COMMENT '接口名称',
  `path`        VARCHAR(256) NOT NULL                 COMMENT '请求路径',
  `method`      VARCHAR(16)  NOT NULL DEFAULT 'GET'   COMMENT '请求方式 (GET/POST/PUT/DELETE)',
  `group_name`  VARCHAR(64)  DEFAULT NULL             COMMENT '所属模块分组',
  `description` VARCHAR(512) DEFAULT NULL             COMMENT '接口描述',
  `status`      TINYINT      NOT NULL DEFAULT 1       COMMENT '状态 (1=启用 0=禁用)',
  `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_group` (`group_name`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='接口管理表';

-- 初始接口数据
INSERT INTO `sys_api` (`name`, `path`, `method`, `group_name`, `description`, `status`) VALUES
('用户登录',       '/api/auth/login',        'POST',   '认证模块', '用户账号密码登录接口', 1),
('用户登出',       '/api/auth/logout',       'POST',   '认证模块', '退出登录，清除会话', 1),
('获取用户列表',   '/api/users',             'GET',    '用户模块', '分页获取用户列表', 1),
('创建用户',       '/api/users',             'POST',   '用户模块', '创建新用户账号', 1),
('获取应用列表',   '/api/apps',              'GET',    '应用模块', '获取所有应用列表', 1),
('部署应用',       '/api/apps/deploy',       'POST',   '应用模块', '触发应用部署流程', 1),
('获取监控数据',   '/api/monitor/metrics',   'GET',    '监控模块', '获取集群监控指标', 1),
('获取菜单列表',   '/api/menus',             'GET',    '系统模块', '获取当前用户可见菜单', 1),
('创建菜单',       '/api/menus',             'POST',   '系统模块', '新增菜单项', 1),
('获取接口列表',   '/api/apis',              'GET',    '系统模块', '获取所有接口配置列表', 1),
('旧版兼容接口',   '/api/v1/legacy',         'GET',    '应用模块', '旧版本兼容接口，已废弃', 0);


-- ============================================================
-- 8. 集群节点表 (sys_cluster_node)
-- ============================================================
DROP TABLE IF EXISTS `sys_cluster_node`;
CREATE TABLE `sys_cluster_node` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '节点ID',
  `node_name`   VARCHAR(64)  NOT NULL                 COMMENT '节点名称',
  `ip_address`  VARCHAR(64)  NOT NULL                 COMMENT '节点IP',
  `role`        VARCHAR(32)  NOT NULL DEFAULT 'worker' COMMENT '角色 (master/worker)',
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'healthy' COMMENT '状态 (healthy/warning/error/offline)',
  `cpu_cores`   INT          NOT NULL DEFAULT 0       COMMENT 'CPU核心数',
  `cpu_usage`   INT          NOT NULL DEFAULT 0       COMMENT 'CPU使用率 (%)',
  `memory_total` BIGINT      NOT NULL DEFAULT 0       COMMENT '总内存 (MB)',
  `memory_usage` INT         NOT NULL DEFAULT 0       COMMENT '内存使用率 (%)',
  `pod_count`   INT          NOT NULL DEFAULT 0       COMMENT '运行Pod数',
  `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_node_name` (`node_name`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='集群节点表';

-- 初始节点数据
INSERT INTO `sys_cluster_node` (`node_name`, `ip_address`, `role`, `status`, `cpu_cores`, `cpu_usage`, `memory_total`, `memory_usage`, `pod_count`) VALUES
('node-01', '10.0.1.11', 'master', 'healthy', 8, 72, 16384, 58, 12),
('node-02', '10.0.1.12', 'worker', 'healthy', 8, 45, 16384, 38, 10),
('node-03', '10.0.1.13', 'worker', 'healthy', 8, 68, 16384, 55, 11),
('node-04', '10.0.1.14', 'worker', 'warning', 8, 88, 16384, 82, 8),
('node-05', '10.0.1.15', 'worker', 'healthy', 4, 35, 8192, 28, 7);


-- ============================================================
-- 9. 监控指标记录表 (sys_monitor_metric)
-- ============================================================
DROP TABLE IF EXISTS `sys_monitor_metric`;
CREATE TABLE `sys_monitor_metric` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '记录ID',
  `metric_type` VARCHAR(32)  NOT NULL                 COMMENT '指标类型 (cpu/memory/network/disk)',
  `node_name`   VARCHAR(64)  DEFAULT NULL             COMMENT '节点名称 (NULL=集群整体)',
  `value`       DECIMAL(8,2) NOT NULL                 COMMENT '指标值',
  `record_time` DATETIME     NOT NULL                 COMMENT '记录时间',
  PRIMARY KEY (`id`),
  KEY `idx_metric_type` (`metric_type`),
  KEY `idx_node_name` (`node_name`),
  KEY `idx_record_time` (`record_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='监控指标记录表';


-- ============================================================
-- 表关系说明
-- ============================================================
-- sys_user.role_id     → sys_role.id          (用户属于一个角色)
-- sys_role_menu.role_id → sys_role.id         (角色拥有多个菜单权限)
-- sys_role_menu.menu_id → sys_menu.id         (菜单被多个角色引用)
-- sys_app.owner_id      → sys_user.id         (应用属于一个负责人)
-- sys_log.user_id       → sys_user.id         (日志关联操作用户)
-- sys_monitor_metric.node_name → sys_cluster_node.node_name (指标关联节点)
--
-- ER关系图:
--
--  sys_role  1──N  sys_user
--     │               │
--     │  N──N          │ 1──N
--  sys_menu            │
--  (via sys_role_menu) │ 1──N
--                     sys_app
--                     sys_log
--
--  sys_api (独立表，接口配置)
--  sys_cluster_node 1──N sys_monitor_metric
-- ============================================================
