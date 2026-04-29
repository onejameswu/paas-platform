// ============================================================
// 云原生应用管理平台 - Mock 数据层
// ============================================================

// ---- 用户数据 ----
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', nickName: '超级管理员', avatarUrl: '', role: 'superAdmin', roleName: '超级管理员', email: 'admin@paas.com', phone: '13800000001', status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 2, username: 'manager', password: 'manager123', nickName: '运维经理', avatarUrl: '', role: 'admin', roleName: '普通管理员', email: 'manager@paas.com', phone: '13800000002', status: 1, createTime: '2024-03-15 10:30:00' },
  { id: 3, username: 'user', password: 'user123', nickName: '开发者小王', avatarUrl: '', role: 'user', roleName: '普通用户', email: 'user@paas.com', phone: '13800000003', status: 1, createTime: '2024-06-20 14:00:00' },
  { id: 4, username: 'guest', password: 'guest123', nickName: '访客用户', avatarUrl: '', role: 'user', roleName: '普通用户', email: 'guest@paas.com', phone: '13800000004', status: 0, createTime: '2024-08-10 09:00:00' }
]

// ---- 动态菜单数据 ----
let mockMenus = [
  { id: 1, parentId: 0, menuName: '仪表盘', menuCode: 'dashboard', path: '/dashboard', icon: 'Odometer', sortOrder: 1, visible: true, component: 'Dashboard' },
  { id: 2, parentId: 0, menuName: '用户管理', menuCode: 'users', path: '/users', icon: 'User', sortOrder: 2, visible: true, component: 'Users' },
  { id: 3, parentId: 0, menuName: '应用管理', menuCode: 'apps', path: '/apps', icon: 'Monitor', sortOrder: 3, visible: true, component: 'Apps' },
  { id: 4, parentId: 0, menuName: '日志审计', menuCode: 'logs', path: '/logs', icon: 'Document', sortOrder: 4, visible: true, component: 'Logs' },
  { id: 5, parentId: 0, menuName: '监控中心', menuCode: 'monitor', path: '/monitor', icon: 'DataLine', sortOrder: 5, visible: true, component: 'Monitor' },
  { id: 6, parentId: 0, menuName: '菜单管理', menuCode: 'menus', path: '/menus', icon: 'Menu', sortOrder: 6, visible: true, component: 'Menus' },
  { id: 7, parentId: 0, menuName: '接口管理', menuCode: 'apis', path: '/apis', icon: 'Connection', sortOrder: 7, visible: true, component: 'Apis' }
]

// ---- 角色菜单权限 ----
const mockRoleMenus = {
  superAdmin: [1, 2, 3, 4, 5, 6, 7],
  admin: [1, 2, 3, 4, 5],
  user: [1, 3, 5]
}

// ---- 接口管理数据 ----
let mockApis = [
  { id: 1, name: '用户登录', path: '/api/auth/login', method: 'POST', group: '认证模块', status: 1, description: '用户账号密码登录接口', createTime: '2024-01-01 00:00:00' },
  { id: 2, name: '用户登出', path: '/api/auth/logout', method: 'POST', group: '认证模块', status: 1, description: '退出登录，清除会话', createTime: '2024-01-01 00:00:00' },
  { id: 3, name: '获取用户列表', path: '/api/users', method: 'GET', group: '用户模块', status: 1, description: '分页获取用户列表，支持搜索筛选', createTime: '2024-01-05 10:00:00' },
  { id: 4, name: '创建用户', path: '/api/users', method: 'POST', group: '用户模块', status: 1, description: '创建新用户账号', createTime: '2024-01-05 10:00:00' },
  { id: 5, name: '获取应用列表', path: '/api/apps', method: 'GET', group: '应用模块', status: 1, description: '获取所有应用列表', createTime: '2024-02-01 10:00:00' },
  { id: 6, name: '部署应用', path: '/api/apps/deploy', method: 'POST', group: '应用模块', status: 1, description: '触发应用部署流程', createTime: '2024-02-01 10:00:00' },
  { id: 7, name: '获取监控数据', path: '/api/monitor/metrics', method: 'GET', group: '监控模块', status: 1, description: '获取集群监控指标数据', createTime: '2024-03-01 10:00:00' },
  { id: 8, name: '获取菜单列表', path: '/api/menus', method: 'GET', group: '系统模块', status: 1, description: '获取当前用户可见菜单', createTime: '2024-03-15 10:00:00' },
  { id: 9, name: '创建菜单', path: '/api/menus', method: 'POST', group: '系统模块', status: 1, description: '新增菜单项（超级管理员）', createTime: '2024-03-15 10:00:00' },
  { id: 10, name: '获取接口列表', path: '/api/apis', method: 'GET', group: '系统模块', status: 1, description: '获取所有接口配置列表', createTime: '2024-04-01 10:00:00' },
  { id: 11, name: '旧版兼容接口', path: '/api/v1/legacy', method: 'GET', group: '应用模块', status: 0, description: '旧版本兼容接口，已废弃', createTime: '2024-01-10 10:00:00' }
]

// ---- 应用数据 ----
export const mockApps = [
  { id: 1, name: '电商前台', type: 'Web应用', status: 'running', instances: 3, cpu: '25%', memory: '512MB', createTime: '2024-01-15', owner: 'admin' },
  { id: 2, name: '用户服务', type: '微服务', status: 'running', instances: 2, cpu: '15%', memory: '256MB', createTime: '2024-02-20', owner: 'manager' },
  { id: 3, name: '订单服务', type: '微服务', status: 'stopped', instances: 0, cpu: '0%', memory: '0MB', createTime: '2024-03-10', owner: 'manager' },
  { id: 4, name: '数据分析平台', type: 'Web应用', status: 'running', instances: 1, cpu: '45%', memory: '1GB', createTime: '2024-04-05', owner: 'admin' },
  { id: 5, name: '消息队列', type: '中间件', status: 'running', instances: 2, cpu: '10%', memory: '512MB', createTime: '2024-05-12', owner: 'admin' },
  { id: 6, name: '文件存储服务', type: '微服务', status: 'error', instances: 1, cpu: '0%', memory: '128MB', createTime: '2024-06-01', owner: 'user' }
]

// ---- 日志数据 ----
export const mockLogs = [
  { id: 1, time: '2024-10-28 10:15:30', user: 'admin', action: '登录系统', type: 'login', ip: '192.168.1.100', status: 'success' },
  { id: 2, time: '2024-10-28 10:20:15', user: 'admin', action: '部署应用 [电商前台]', type: 'deploy', ip: '192.168.1.100', status: 'success' },
  { id: 3, time: '2024-10-28 10:25:00', user: 'manager', action: '登录系统', type: 'login', ip: '192.168.1.101', status: 'success' },
  { id: 4, time: '2024-10-28 10:30:45', user: 'manager', action: '修改用户 [user] 权限', type: 'permission', ip: '192.168.1.101', status: 'success' },
  { id: 5, time: '2024-10-28 10:35:20', user: 'user', action: '登录系统', type: 'login', ip: '192.168.1.102', status: 'success' },
  { id: 6, time: '2024-10-28 10:40:10', user: 'user', action: '创建应用 [测试服务]', type: 'deploy', ip: '192.168.1.102', status: 'success' },
  { id: 7, time: '2024-10-28 11:00:00', user: 'admin', action: '删除应用 [旧版API]', type: 'deploy', ip: '192.168.1.100', status: 'success' },
  { id: 8, time: '2024-10-28 11:15:30', user: 'guest', action: '登录系统', type: 'login', ip: '192.168.1.103', status: 'failed' },
  { id: 9, time: '2024-10-28 11:20:00', user: 'admin', action: '重启服务 [消息队列]', type: 'deploy', ip: '192.168.1.100', status: 'success' },
  { id: 10, time: '2024-10-28 11:30:15', user: 'manager', action: '查看审计日志', type: 'audit', ip: '192.168.1.101', status: 'success' },
  { id: 11, time: '2024-10-28 13:00:00', user: 'admin', action: '新增菜单 [监控中心]', type: 'config', ip: '192.168.1.100', status: 'success' },
  { id: 12, time: '2024-10-28 13:30:45', user: 'user', action: '扩容应用 [用户服务] 至3实例', type: 'deploy', ip: '192.168.1.102', status: 'success' },
  { id: 13, time: '2024-10-28 14:00:20', user: 'admin', action: '新增接口 [获取监控数据]', type: 'config', ip: '192.168.1.100', status: 'success' },
  { id: 14, time: '2024-10-28 14:30:00', user: 'manager', action: '停止应用 [订单服务]', type: 'deploy', ip: '192.168.1.101', status: 'success' },
  { id: 15, time: '2024-10-28 15:00:10', user: 'admin', action: '系统备份', type: 'config', ip: '192.168.1.100', status: 'success' }
]

// ---- 监控数据 ----
export function getMockMonitorData() {
  const now = Date.now()
  const generateTimeSeries = (base, variance, count = 20) => {
    const data = []
    for (let i = count - 1; i >= 0; i--) {
      const t = new Date(now - i * 60000)
      const label = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`
      data.push({ time: label, value: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance)) })
    }
    return data
  }

  return {
    cluster: {
      name: 'prod-cluster-01',
      status: 'healthy',
      nodes: 5,
      pods: 48,
      namespaces: 6,
      cpu: { total: 32, used: 20, percent: 62 },
      memory: { total: 64, used: 30, percent: 47 },
      storage: { total: 500, used: 175, percent: 35 }
    },
    nodes: [
      { name: 'node-01', ip: '10.0.1.11', status: 'healthy', cpu: 72, memory: 58, pods: 12, role: 'master' },
      { name: 'node-02', ip: '10.0.1.12', status: 'healthy', cpu: 45, memory: 38, pods: 10, role: 'worker' },
      { name: 'node-03', ip: '10.0.1.13', status: 'healthy', cpu: 68, memory: 55, pods: 11, role: 'worker' },
      { name: 'node-04', ip: '10.0.1.14', status: 'warning', cpu: 88, memory: 82, pods: 8, role: 'worker' },
      { name: 'node-05', ip: '10.0.1.15', status: 'healthy', cpu: 35, memory: 28, pods: 7, role: 'worker' }
    ],
    cpuSeries: generateTimeSeries(62, 30),
    memorySeries: generateTimeSeries(47, 20),
    networkSeries: generateTimeSeries(25, 40),
    topApps: [
      { name: '数据分析平台', cpu: 45, memory: 1024, requests: 1250 },
      { name: '电商前台', cpu: 25, memory: 512, requests: 3800 },
      { name: '用户服务', cpu: 15, memory: 256, requests: 5200 },
      { name: '消息队列', cpu: 10, memory: 512, requests: 8900 },
      { name: '文件存储服务', cpu: 0, memory: 128, requests: 0 }
    ]
  }
}

// ---- Mock API 函数 ----

export function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username && u.password === password)
      if (user) {
        if (user.status === 0) { reject({ code: 403, message: '账号已被禁用，请联系管理员' }); return }
        const { password: _, ...userInfo } = user
        resolve({ code: 0, message: '登录成功', data: { userInfo } })
      } else {
        reject({ code: 401, message: '用户名或密码错误' })
      }
    }, 500)
  })
}

export function getMockUsers() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, data: { list: mockUsers.map(u => { const { password, ...info } = u; return info }), total: mockUsers.length } })
    }, 300)
  })
}

export function getDashboardStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          totalUsers: mockUsers.length,
          activeUsers: mockUsers.filter(u => u.status === 1).length,
          totalApps: mockApps.length,
          runningApps: mockApps.filter(a => a.status === 'running').length,
          errorApps: mockApps.filter(a => a.status === 'error').length,
          cpuUsage: 62, memoryUsage: 48, storageUsage: 35,
          todayLogs: 156, weekGrowth: 12,
          totalApis: mockApis.filter(a => a.status === 1).length,
          totalMenus: mockMenus.filter(m => m.visible).length
        }
      })
    }, 300)
  })
}

// 获取用户可见菜单
export function getUserMenus(role) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allowedIds = mockRoleMenus[role] || []
      const menus = mockMenus.filter(m => m.visible && allowedIds.includes(m.id))
      resolve({ code: 0, data: { menus } })
    }, 200)
  })
}

// 获取所有菜单（管理用）
export function getAllMenus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, data: { list: [...mockMenus], total: mockMenus.length } })
    }, 300)
  })
}

// 创建菜单
export function createMenu(menu) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...mockMenus.map(m => m.id)) + 1
      const newMenu = { ...menu, id: newId }
      mockMenus.push(newMenu)
      // 超级管理员自动获得权限
      if (!mockRoleMenus.superAdmin.includes(newId)) {
        mockRoleMenus.superAdmin.push(newId)
      }
      resolve({ code: 0, message: '菜单创建成功', data: { menu: newMenu } })
    }, 300)
  })
}

// 更新菜单
export function updateMenu(id, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockMenus.findIndex(m => m.id === id)
      if (idx === -1) { reject({ code: 404, message: '菜单不存在' }); return }
      mockMenus[idx] = { ...mockMenus[idx], ...data }
      resolve({ code: 0, message: '菜单更新成功' })
    }, 300)
  })
}

// 删除菜单
export function deleteMenu(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockMenus.findIndex(m => m.id === id)
      if (idx === -1) { reject({ code: 404, message: '菜单不存在' }); return }
      mockMenus.splice(idx, 1)
      // 清理角色权限中的引用
      Object.keys(mockRoleMenus).forEach(role => {
        mockRoleMenus[role] = mockRoleMenus[role].filter(mid => mid !== id)
      })
      resolve({ code: 0, message: '菜单删除成功' })
    }, 300)
  })
}

// 获取接口列表
export function getApiList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, data: { list: [...mockApis], total: mockApis.length } })
    }, 300)
  })
}

// 创建接口
export function createApi(api) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...mockApis.map(a => a.id)) + 1
      const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      const newApi = { ...api, id: newId, createTime: now }
      mockApis.push(newApi)
      resolve({ code: 0, message: '接口创建成功', data: { api: newApi } })
    }, 300)
  })
}

// 更新接口
export function updateApi(id, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockApis.findIndex(a => a.id === id)
      if (idx === -1) { reject({ code: 404, message: '接口不存在' }); return }
      mockApis[idx] = { ...mockApis[idx], ...data }
      resolve({ code: 0, message: '接口更新成功' })
    }, 300)
  })
}

// 删除接口
export function deleteApi(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockApis.findIndex(a => a.id === id)
      if (idx === -1) { reject({ code: 404, message: '接口不存在' }); return }
      mockApis.splice(idx, 1)
      resolve({ code: 0, message: '接口删除成功' })
    }, 300)
  })
}
