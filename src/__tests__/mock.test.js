import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  mockApps,
  mockLogs,
  getMockMonitorData,
  mockLogin,
  getMockUsers,
  getDashboardStats,
  getUserMenus,
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  getApiList,
  createApi,
  updateApi,
  deleteApi,
  mockRoleMenus,
  mockLoginWithSession,
  getOnlineSessions,
  kickSession,
  validateToken,
  kickUserSessions,
  resetSessions
} from '../mock'

// 辅助函数：捕获 rejection 后重新抛出，避免 unhandled rejection 警告
function captureRejection(promise) {
  let captured = null
  const p = promise.catch(err => { captured = err; throw err })
  p.__captured = () => captured
  return p
}

describe('mock/index.js', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetSessions()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('导出数据', () => {
    it('mockApps 应为非空数组', () => {
      expect(Array.isArray(mockApps)).toBe(true)
      expect(mockApps.length).toBeGreaterThan(0)
      mockApps.forEach(app => {
        expect(app).toHaveProperty('id')
        expect(app).toHaveProperty('name')
        expect(app).toHaveProperty('status')
      })
    })

    it('mockLogs 应为非空数组', () => {
      expect(Array.isArray(mockLogs)).toBe(true)
      expect(mockLogs.length).toBeGreaterThan(0)
      mockLogs.forEach(log => {
        expect(log).toHaveProperty('id')
        expect(log).toHaveProperty('time')
        expect(log).toHaveProperty('user')
        expect(log).toHaveProperty('action')
      })
    })
  })

  describe('getMockMonitorData', () => {
    it('应返回完整的监控数据结构', () => {
      const data = getMockMonitorData()
      expect(data).toHaveProperty('cluster')
      expect(data).toHaveProperty('nodes')
      expect(data).toHaveProperty('cpuSeries')
      expect(data).toHaveProperty('memorySeries')
      expect(data).toHaveProperty('networkSeries')
      expect(data).toHaveProperty('topApps')
    })

    it('cluster 应包含正确的属性', () => {
      const data = getMockMonitorData()
      expect(data.cluster).toHaveProperty('name')
      expect(data.cluster).toHaveProperty('status')
      expect(data.cluster).toHaveProperty('nodes')
      expect(data.cluster).toHaveProperty('cpu')
      expect(data.cluster).toHaveProperty('memory')
      expect(data.cluster).toHaveProperty('storage')
    })

    it('nodes 应为 5 个节点', () => {
      const data = getMockMonitorData()
      expect(data.nodes.length).toBe(5)
    })

    it('时间序列数据应包含 20 个数据点', () => {
      const data = getMockMonitorData()
      expect(data.cpuSeries.length).toBe(20)
      expect(data.memorySeries.length).toBe(20)
      expect(data.networkSeries.length).toBe(20)
    })

    it('时间序列值应在 0-100 范围内', () => {
      const data = getMockMonitorData()
      data.cpuSeries.forEach(point => {
        expect(point.value).toBeGreaterThanOrEqual(0)
        expect(point.value).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('mockLogin', () => {
    it('应成功登录 admin 用户', async () => {
      const promise = mockLogin('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.message).toBe('登录成功')
      expect(result.data.userInfo).toHaveProperty('username', 'admin')
      expect(result.data.userInfo).toHaveProperty('role', 'superAdmin')
      expect(result.data.userInfo).not.toHaveProperty('password')
    })

    it('应成功登录 manager 用户', async () => {
      const promise = mockLogin('manager', 'manager123')
      await vi.advanceTimersByTimeAsync(500)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.userInfo.username).toBe('manager')
    })

    it('应成功登录 user 用户', async () => {
      const promise = mockLogin('user', 'user123')
      await vi.advanceTimersByTimeAsync(500)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.userInfo.username).toBe('user')
    })

    it('密码错误应拒绝登录', async () => {
      const promise = captureRejection(mockLogin('admin', 'wrongpassword'))
      await vi.advanceTimersByTimeAsync(500)
      await expect(promise).rejects.toEqual({ code: 401, message: '用户名或密码错误' })
    })

    it('用户不存在应拒绝登录', async () => {
      const promise = captureRejection(mockLogin('nonexistent', 'password'))
      await vi.advanceTimersByTimeAsync(500)
      await expect(promise).rejects.toEqual({ code: 401, message: '用户名或密码错误' })
    })

    it('禁用用户应拒绝登录', async () => {
      const promise = captureRejection(mockLogin('guest', 'guest123'))
      await vi.advanceTimersByTimeAsync(500)
      await expect(promise).rejects.toEqual({ code: 403, message: '账号已被禁用，请联系管理员' })
    })
  })

  describe('getMockUsers', () => {
    it('应返回用户列表（不含密码）', async () => {
      const promise = getMockUsers()
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.list.length).toBe(4)
      expect(result.data.total).toBe(4)
      result.data.list.forEach(user => {
        expect(user).not.toHaveProperty('password')
      })
    })
  })

  describe('getDashboardStats', () => {
    it('应返回仪表盘统计数据', async () => {
      const promise = getDashboardStats()
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data).toHaveProperty('totalUsers')
      expect(result.data).toHaveProperty('activeUsers')
      expect(result.data).toHaveProperty('totalApps')
      expect(result.data).toHaveProperty('runningApps')
      expect(result.data).toHaveProperty('errorApps')
      expect(result.data).toHaveProperty('cpuUsage')
      expect(result.data).toHaveProperty('totalApis')
      expect(result.data).toHaveProperty('totalMenus')
    })
  })

  describe('getUserMenus', () => {
    it('superAdmin 应获得所有 9 个菜单', async () => {
      const promise = getUserMenus('superAdmin')
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.menus.length).toBe(9)
    })

    it('admin 应获得 6 个菜单', async () => {
      const promise = getUserMenus('admin')
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.menus.length).toBe(6)
    })

    it('user 应获得 3 个菜单', async () => {
      const promise = getUserMenus('user')
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.menus.length).toBe(3)
    })

    it('未知角色应获得空菜单列表', async () => {
      const promise = getUserMenus('unknown_role')
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.menus.length).toBe(0)
    })
  })

  describe('getAllMenus', () => {
    it('应返回所有菜单列表', async () => {
      const promise = getAllMenus()
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.list.length).toBe(9)
      expect(result.data.total).toBe(9)
    })
  })

  describe('createMenu', () => {
    it('应成功创建新菜单', async () => {
      const newMenu = {
        parentId: 0,
        menuName: '测试菜单',
        menuCode: 'test',
        path: '/test',
        icon: 'Test',
        sortOrder: 9,
        visible: true,
        component: 'Test'
      }

      const promise = createMenu(newMenu)
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.message).toBe('菜单创建成功')
      expect(result.data.menu).toHaveProperty('id')
      expect(result.data.menu.menuName).toBe('测试菜单')
    })

    it('新菜单应自动分配给 superAdmin 角色', async () => {
      const newMenu = {
        parentId: 0,
        menuName: '自动权限菜单',
        menuCode: 'auto_perm',
        path: '/auto',
        icon: 'Star',
        sortOrder: 10,
        visible: true,
        component: 'Auto'
      }

      const promise = createMenu(newMenu)
      await vi.advanceTimersByTimeAsync(300)
      await promise

      const menuPromise = getUserMenus('superAdmin')
      await vi.advanceTimersByTimeAsync(200)
      const menuResult = await menuPromise
      const codes = menuResult.data.menus.map(m => m.menuCode)
      expect(codes).toContain('auto_perm')
    })

    it('superAdmin 已包含该菜单 ID 时不应重复添加', async () => {
      const p1 = createMenu({
        parentId: 0, menuName: '重复权限测试', menuCode: 'dup_perm',
        path: '/dup', icon: 'Copy', sortOrder: 11, visible: true, component: 'DupPerm'
      })
      await vi.advanceTimersByTimeAsync(300)
      const createResult = await p1
      const menuId = createResult.data.menu.id

      expect(mockRoleMenus.superAdmin.includes(menuId)).toBe(true)

      const nextId = menuId + 1
      mockRoleMenus.superAdmin.push(nextId)

      const p2 = createMenu({
        parentId: 0, menuName: 'Else分支测试', menuCode: 'else_branch',
        path: '/else', icon: 'Check', sortOrder: 12, visible: true, component: 'ElseBranch'
      })
      await vi.advanceTimersByTimeAsync(300)
      const result2 = await p2

      expect(result2.code).toBe(0)
      expect(result2.data.menu.id).toBe(nextId)

      const count = mockRoleMenus.superAdmin.filter(id => id === nextId).length
      expect(count).toBe(1)
    })
  })

  describe('updateMenu', () => {
    it('应成功更新存在的菜单', async () => {
      const promise = updateMenu(1, { menuName: '仪表盘-已更新' })
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.message).toBe('菜单更新成功')
    })

    it('更新后应能获取到新名称', async () => {
      const p1 = updateMenu(1, { menuName: '仪表盘-更新' })
      await vi.advanceTimersByTimeAsync(300)
      await p1

      const p2 = getAllMenus()
      await vi.advanceTimersByTimeAsync(300)
      const allResult = await p2
      const menu = allResult.data.list.find(m => m.id === 1)
      expect(menu.menuName).toBe('仪表盘-更新')
    })

    it('更新不存在的菜单应返回 404', async () => {
      const promise = captureRejection(updateMenu(9999, { menuName: '不存在' }))
      await vi.advanceTimersByTimeAsync(300)
      await expect(promise).rejects.toEqual({ code: 404, message: '菜单不存在' })
    })
  })

  describe('deleteMenu', () => {
    it('应成功删除存在的菜单', async () => {
      const p1 = createMenu({
        parentId: 0, menuName: '待删除菜单', menuCode: 'to_delete',
        path: '/to_delete', icon: 'Delete', sortOrder: 99, visible: true, component: 'Delete'
      })
      await vi.advanceTimersByTimeAsync(300)
      const createResult = await p1
      const menuId = createResult.data.menu.id

      const p2 = deleteMenu(menuId)
      await vi.advanceTimersByTimeAsync(300)
      const deleteResult = await p2

      expect(deleteResult.code).toBe(0)
      expect(deleteResult.message).toBe('菜单删除成功')
    })

    it('删除后菜单应从列表中移除', async () => {
      const p1 = createMenu({
        parentId: 0, menuName: '临时菜单', menuCode: 'temp',
        path: '/temp', icon: 'Temp', sortOrder: 100, visible: true, component: 'Temp'
      })
      await vi.advanceTimersByTimeAsync(300)
      const createResult = await p1
      const menuId = createResult.data.menu.id

      const p2 = deleteMenu(menuId)
      await vi.advanceTimersByTimeAsync(300)
      await p2

      const p3 = getAllMenus()
      await vi.advanceTimersByTimeAsync(300)
      const allResult = await p3
      const found = allResult.data.list.find(m => m.id === menuId)
      expect(found).toBeUndefined()
    })

    it('删除不存在的菜单应返回 404', async () => {
      const promise = captureRejection(deleteMenu(9999))
      await vi.advanceTimersByTimeAsync(300)
      await expect(promise).rejects.toEqual({ code: 404, message: '菜单不存在' })
    })

    it('删除菜单应清理角色权限引用', async () => {
      const p1 = createMenu({
        parentId: 0, menuName: '权限清理测试', menuCode: 'perm_test',
        path: '/perm_test', icon: 'Test', sortOrder: 101, visible: true, component: 'PermTest'
      })
      await vi.advanceTimersByTimeAsync(300)
      const createResult = await p1
      const menuId = createResult.data.menu.id

      const p2 = getUserMenus('superAdmin')
      await vi.advanceTimersByTimeAsync(200)
      const menuResult = await p2
      expect(menuResult.data.menus.some(m => m.id === menuId)).toBe(true)

      const p3 = deleteMenu(menuId)
      await vi.advanceTimersByTimeAsync(300)
      await p3

      const p4 = getUserMenus('superAdmin')
      await vi.advanceTimersByTimeAsync(200)
      const menuResult2 = await p4
      expect(menuResult2.data.menus.some(m => m.id === menuId)).toBe(false)
    })
  })

  describe('getApiList', () => {
    it('应返回接口列表', async () => {
      const promise = getApiList()
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.list.length).toBeGreaterThan(0)
      expect(result.data.total).toBeGreaterThan(0)
    })
  })

  describe('createApi', () => {
    it('应成功创建新接口', async () => {
      const newApi = {
        name: '测试接口',
        path: '/api/test',
        method: 'GET',
        groupName: '测试模块',
        status: 1,
        description: '单元测试创建的接口'
      }

      const promise = createApi(newApi)
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.message).toBe('接口创建成功')
      expect(result.data.api).toHaveProperty('id')
      expect(result.data.api).toHaveProperty('createTime')
      expect(result.data.api.name).toBe('测试接口')
    })
  })

  describe('updateApi', () => {
    it('应成功更新存在的接口', async () => {
      const promise = updateApi(1, { name: '用户登录-已更新', status: 0 })
      await vi.advanceTimersByTimeAsync(300)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.message).toBe('接口更新成功')
    })

    it('更新后应能获取到新数据', async () => {
      const p1 = updateApi(1, { description: '更新后的描述' })
      await vi.advanceTimersByTimeAsync(300)
      await p1

      const p2 = getApiList()
      await vi.advanceTimersByTimeAsync(300)
      const listResult = await p2
      const api = listResult.data.list.find(a => a.id === 1)
      expect(api.description).toBe('更新后的描述')
    })

    it('更新不存在的接口应返回 404', async () => {
      const promise = captureRejection(updateApi(9999, { name: '不存在' }))
      await vi.advanceTimersByTimeAsync(300)
      await expect(promise).rejects.toEqual({ code: 404, message: '接口不存在' })
    })
  })

  describe('deleteApi', () => {
    it('应成功删除存在的接口', async () => {
      const p1 = createApi({
        name: '待删除接口', path: '/api/to_delete', method: 'DELETE',
        groupName: '测试', status: 1, description: '待删除'
      })
      await vi.advanceTimersByTimeAsync(300)
      const createResult = await p1
      const apiId = createResult.data.api.id

      const p2 = deleteApi(apiId)
      await vi.advanceTimersByTimeAsync(300)
      const deleteResult = await p2

      expect(deleteResult.code).toBe(0)
      expect(deleteResult.message).toBe('接口删除成功')
    })

    it('删除后接口应从列表中移除', async () => {
      const p1 = createApi({
        name: '临时接口', path: '/api/temp', method: 'POST',
        groupName: '测试', status: 1, description: '临时'
      })
      await vi.advanceTimersByTimeAsync(300)
      const createResult = await p1
      const apiId = createResult.data.api.id

      const p2 = deleteApi(apiId)
      await vi.advanceTimersByTimeAsync(300)
      await p2

      const p3 = getApiList()
      await vi.advanceTimersByTimeAsync(300)
      const listResult = await p3
      const found = listResult.data.list.find(a => a.id === apiId)
      expect(found).toBeUndefined()
    })

    it('删除不存在的接口应返回 404', async () => {
      const promise = captureRejection(deleteApi(9999))
      await vi.advanceTimersByTimeAsync(300)
      await expect(promise).rejects.toEqual({ code: 404, message: '接口不存在' })
    })
  })

  // ---- 会话管理 API 测试 ----

  describe('mockLoginWithSession', () => {
    it('应成功登录并返回 Token', async () => {
      const promise = mockLoginWithSession('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.token).toBeTruthy()
      expect(result.data.token).toMatch(/^tk_/)
      expect(result.data.userInfo).toHaveProperty('username', 'admin')
      expect(result.data.userInfo).not.toHaveProperty('password')
    })

    it('应踢出同用户的旧会话', async () => {
      // 第一次登录
      const p1 = mockLoginWithSession('user', 'user123')
      await vi.advanceTimersByTimeAsync(500)
      const r1 = await p1
      const token1 = r1.data.token

      // 获取在线会话
      const p2 = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const sessions1 = await p2
      expect(sessions1.data.total).toBe(1)

      // 第二次登录（同一用户）
      const p3 = mockLoginWithSession('user', 'user123')
      await vi.advanceTimersByTimeAsync(500)
      const r2 = await p3
      const token2 = r2.data.token
      expect(r2.data.kickedSessions).toBe(1)
      expect(token2).not.toBe(token1)

      // 旧 Token 应失效
      const p4 = validateToken(token1)
      await vi.advanceTimersByTimeAsync(100)
      const valid1 = await p4
      expect(valid1.data.valid).toBe(false)

      // 新 Token 应有效
      const p5 = validateToken(token2)
      await vi.advanceTimersByTimeAsync(100)
      const valid2 = await p5
      expect(valid2.data.valid).toBe(true)
    })

    it('密码错误应拒绝登录', async () => {
      const promise = captureRejection(mockLoginWithSession('admin', 'wrong'))
      await vi.advanceTimersByTimeAsync(500)
      await expect(promise).rejects.toEqual({ code: 401, message: '用户名或密码错误' })
    })

    it('禁用用户应拒绝登录', async () => {
      const promise = captureRejection(mockLoginWithSession('guest', 'guest123'))
      await vi.advanceTimersByTimeAsync(500)
      await expect(promise).rejects.toEqual({ code: 403, message: '账号已被禁用，请联系管理员' })
    })
  })

  describe('getOnlineSessions', () => {
    it('应返回在线会话列表', async () => {
      // 先登录创建会话
      const p1 = mockLoginWithSession('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      await p1

      const p2 = mockLoginWithSession('manager', 'manager123')
      await vi.advanceTimersByTimeAsync(500)
      await p2

      const promise = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.total).toBe(2)
      expect(result.data.list[0]).toHaveProperty('id')
      expect(result.data.list[0]).toHaveProperty('username')
      expect(result.data.list[0]).toHaveProperty('nickName')
      expect(result.data.list[0]).toHaveProperty('role')
      expect(result.data.list[0]).toHaveProperty('ip')
      expect(result.data.list[0]).toHaveProperty('loginTime')
      expect(result.data.list[0]).toHaveProperty('lastActiveTime')
      expect(result.data.list[0]).toHaveProperty('status')
    })

    it('无会话时应返回空列表', async () => {
      const promise = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.total).toBe(0)
      expect(result.data.list).toEqual([])
    })

    it('过期会话应被清理且不返回', async () => {
      // 登录创建会话
      const p1 = mockLoginWithSession('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      await p1

      // 等待超过超时时间
      await vi.advanceTimersByTimeAsync(30 * 60 * 1000 + 1000)

      // 获取在线会话（应清理过期会话）
      const promise = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.total).toBe(0)
    })
  })

  describe('kickSession', () => {
    it('应成功踢出指定会话', async () => {
      // 先登录
      const p1 = mockLoginWithSession('user', 'user123')
      await vi.advanceTimersByTimeAsync(500)
      const loginResult = await p1
      const token = loginResult.data.token

      // 获取会话列表
      const p2 = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const sessions = await p2
      const sessionId = sessions.data.list[0].id

      // 踢出
      const p3 = kickSession(sessionId)
      await vi.advanceTimersByTimeAsync(200)
      const kickResult = await p3
      expect(kickResult.code).toBe(0)
      expect(kickResult.message).toBe('已踢出该用户')

      // Token 应失效
      const p4 = validateToken(token)
      await vi.advanceTimersByTimeAsync(100)
      const validResult = await p4
      expect(validResult.data.valid).toBe(false)
    })

    it('踢出不存在的会话应返回 404', async () => {
      const promise = captureRejection(kickSession(99999))
      await vi.advanceTimersByTimeAsync(200)
      await expect(promise).rejects.toEqual({ code: 404, message: '会话不存在' })
    })
  })

  describe('validateToken', () => {
    it('有效 Token 应返回 valid: true', async () => {
      const p1 = mockLoginWithSession('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      const loginResult = await p1
      const token = loginResult.data.token

      const promise = validateToken(token)
      await vi.advanceTimersByTimeAsync(100)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.valid).toBe(true)
      expect(result.data.session).toHaveProperty('username', 'admin')
    })

    it('无效 Token 应返回 valid: false', async () => {
      const promise = validateToken('invalid_token_xyz')
      await vi.advanceTimersByTimeAsync(100)
      const result = await promise

      expect(result.code).toBe(401)
      expect(result.data.valid).toBe(false)
    })

    it('会话超时后 Token 应返回 valid: false', async () => {
      const p1 = mockLoginWithSession('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      const loginResult = await p1
      const token = loginResult.data.token

      // 等待超过会话超时时间（30分钟 + 1秒）
      await vi.advanceTimersByTimeAsync(30 * 60 * 1000 + 1000)

      const promise = validateToken(token)
      await vi.advanceTimersByTimeAsync(100)
      const result = await promise

      expect(result.code).toBe(401)
      expect(result.data.valid).toBe(false)
    })

    it('Token 被踢出后应返回 valid: false', async () => {
      const p1 = mockLoginWithSession('user', 'user123')
      await vi.advanceTimersByTimeAsync(500)
      const loginResult = await p1
      const token = loginResult.data.token

      // 获取会话 ID 并踢出
      const p2 = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const sessions = await p2
      const sessionId = sessions.data.list[0].id

      const p3 = kickSession(sessionId)
      await vi.advanceTimersByTimeAsync(200)
      await p3

      // 验证 Token
      const p4 = validateToken(token)
      await vi.advanceTimersByTimeAsync(100)
      const result = await p4
      expect(result.data.valid).toBe(false)
    })

    it('验证时应自动续期 lastActiveTime', async () => {
      const p1 = mockLoginWithSession('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      const loginResult = await p1
      const token = loginResult.data.token

      // 第一次验证
      const p2 = validateToken(token)
      await vi.advanceTimersByTimeAsync(100)
      const r1 = await p2
      const time1 = r1.data.session.lastActiveTime

      // 等待一段时间后再次验证
      await vi.advanceTimersByTimeAsync(5000)
      const p3 = validateToken(token)
      await vi.advanceTimersByTimeAsync(100)
      const r2 = await p3
      const time2 = r2.data.session.lastActiveTime

      expect(time2).toBeGreaterThan(time1)
    })
  })

  describe('kickUserSessions', () => {
    it('应踢出指定用户的所有会话', async () => {
      // 同一用户登录两次（第二次会踢出第一次，所以只剩一个）
      const p1 = mockLoginWithSession('user', 'user123')
      await vi.advanceTimersByTimeAsync(500)
      await p1

      const p2 = mockLoginWithSession('user', 'user123')
      await vi.advanceTimersByTimeAsync(500)
      await p2

      // 再登录 admin
      const p3 = mockLoginWithSession('admin', 'admin123')
      await vi.advanceTimersByTimeAsync(500)
      await p3

      // 获取所有会话
      const p4 = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const before = await p4
      expect(before.data.total).toBe(2)

      // 踢出 user 的所有会话
      const p5 = kickUserSessions(3) // user 的 id 是 3
      await vi.advanceTimersByTimeAsync(200)
      const kickResult = await p5
      expect(kickResult.code).toBe(0)
      expect(kickResult.data.kickedCount).toBe(1)

      // 验证只剩 admin
      const p6 = getOnlineSessions()
      await vi.advanceTimersByTimeAsync(200)
      const after = await p6
      expect(after.data.total).toBe(1)
      expect(after.data.list[0].username).toBe('admin')
    })

    it('用户无会话时踢出应返回 0', async () => {
      const promise = kickUserSessions(99999)
      await vi.advanceTimersByTimeAsync(200)
      const result = await promise

      expect(result.code).toBe(0)
      expect(result.data.kickedCount).toBe(0)
    })
  })
})
