import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../store/user'
import { getUserMenus } from '../mock'

// Mock getUserMenus to avoid setTimeout delays in unit tests
vi.mock('../mock', () => ({
  getUserMenus: vi.fn()
}))

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('初始状态', () => {
    it('userInfo 应为 null', () => {
      const store = useUserStore()
      expect(store.userInfo).toBeNull()
    })

    it('isLoggedIn 应为 false', () => {
      const store = useUserStore()
      expect(store.isLoggedIn).toBe(false)
    })

    it('userRole 应为空字符串', () => {
      const store = useUserStore()
      expect(store.userRole).toBe('')
    })

    it('isSuperAdmin 应为 false', () => {
      const store = useUserStore()
      expect(store.isSuperAdmin).toBe(false)
    })

    it('menuList 应为空数组', () => {
      const store = useUserStore()
      expect(store.menuList).toEqual([])
    })
  })

  describe('computed 属性', () => {
    it('设置用户后 isLoggedIn 应为 true', () => {
      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'superAdmin' })
      expect(store.isLoggedIn).toBe(true)
    })

    it('userRole 应返回用户角色', () => {
      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'admin' })
      expect(store.userRole).toBe('admin')
    })

    it('isSuperAdmin 在角色为 superAdmin 时应为 true', () => {
      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'superAdmin' })
      expect(store.isSuperAdmin).toBe(true)
    })

    it('isSuperAdmin 在角色为 admin 时应为 false', () => {
      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'admin' })
      expect(store.isSuperAdmin).toBe(false)
    })

    it('userInfo 为 null 时 userRole 应返回空字符串', () => {
      const store = useUserStore()
      expect(store.userRole).toBe('')
    })

    it('userInfo 无 role 字段时 userRole 应返回空字符串', () => {
      const store = useUserStore()
      store.setUserInfo({ id: 1 })
      expect(store.userRole).toBe('')
    })
  })

  describe('setUserInfo', () => {
    it('应设置用户信息', () => {
      const store = useUserStore()
      const info = { id: 1, username: 'admin', role: 'superAdmin' }
      store.setUserInfo(info)
      expect(store.userInfo).toEqual(info)
    })

    it('应将用户信息保存到 localStorage', () => {
      const store = useUserStore()
      const info = { id: 1, username: 'admin', role: 'superAdmin' }
      store.setUserInfo(info)

      const saved = JSON.parse(localStorage.getItem('userInfo'))
      expect(saved).toEqual(info)
    })
  })

  describe('logOut', () => {
    it('应清除用户信息', () => {
      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'superAdmin' })
      store.logOut()

      expect(store.userInfo).toBeNull()
      expect(store.isLoggedIn).toBe(false)
    })

    it('应清空菜单列表', () => {
      const store = useUserStore()
      store.menuList = [{ id: 1, menuCode: 'dashboard' }]
      store.logOut()

      expect(store.menuList).toEqual([])
    })

    it('应从 localStorage 移除 userInfo', () => {
      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'superAdmin' })
      store.logOut()

      expect(localStorage.getItem('userInfo')).toBeNull()
    })
  })

  describe('restoreSession', () => {
    it('应从 localStorage 恢复用户信息', () => {
      const info = { id: 1, username: 'admin', role: 'superAdmin' }
      localStorage.setItem('userInfo', JSON.stringify(info))

      const store = useUserStore()
      store.restoreSession()

      expect(store.userInfo).toEqual(info)
      expect(store.isLoggedIn).toBe(true)
    })

    it('localStorage 为空时 userInfo 应保持 null', () => {
      const store = useUserStore()
      store.restoreSession()
      expect(store.userInfo).toBeNull()
    })

    it('localStorage 数据无效时应清除并保持 null', () => {
      localStorage.setItem('userInfo', 'invalid-json{')

      const store = useUserStore()
      store.restoreSession()

      expect(store.userInfo).toBeNull()
      expect(localStorage.getItem('userInfo')).toBeNull()
    })
  })

  describe('loadMenus', () => {
    it('userInfo 为 null 时不应加载菜单', async () => {
      const store = useUserStore()
      await store.loadMenus()
      expect(store.menuList).toEqual([])
      expect(getUserMenus).not.toHaveBeenCalled()
    })

    it('应成功加载用户菜单', async () => {
      const menus = [
        { id: 1, menuCode: 'dashboard', menuName: '仪表盘' },
        { id: 2, menuCode: 'users', menuName: '用户管理' }
      ]
      getUserMenus.mockResolvedValue({ code: 0, data: { menus } })

      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'superAdmin' })
      await store.loadMenus()

      expect(getUserMenus).toHaveBeenCalledWith('superAdmin')
      expect(store.menuList).toEqual(menus)
    })

    it('返回 code 非 0 时不应更新菜单', async () => {
      getUserMenus.mockResolvedValue({ code: 1, message: '权限不足' })

      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'user' })
      await store.loadMenus()

      expect(store.menuList).toEqual([])
    })

    it('getUserMenus 抛出异常时应捕获错误', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      getUserMenus.mockRejectedValue(new Error('网络错误'))

      const store = useUserStore()
      store.setUserInfo({ id: 1, role: 'superAdmin' })
      await store.loadMenus()

      expect(consoleSpy).toHaveBeenCalledWith('加载菜单失败', expect.any(Error))
      expect(store.menuList).toEqual([])

      consoleSpy.mockRestore()
    })
  })

  describe('hasMenuPermission', () => {
    it('存在菜单权限时应返回 true', () => {
      const store = useUserStore()
      store.menuList = [
        { id: 1, menuCode: 'dashboard' },
        { id: 2, menuCode: 'users' }
      ]

      expect(store.hasMenuPermission('dashboard')).toBe(true)
      expect(store.hasMenuPermission('users')).toBe(true)
    })

    it('不存在菜单权限时应返回 false', () => {
      const store = useUserStore()
      store.menuList = [
        { id: 1, menuCode: 'dashboard' }
      ]

      expect(store.hasMenuPermission('settings')).toBe(false)
    })

    it('menuList 为空时应返回 false', () => {
      const store = useUserStore()
      expect(store.hasMenuPermission('dashboard')).toBe(false)
    })
  })
})
