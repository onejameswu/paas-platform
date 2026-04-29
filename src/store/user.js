import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserMenus } from '../mock'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)
  const userRole = computed(() => userInfo.value?.role || '')
  const isSuperAdmin = computed(() => userInfo.value?.role === 'superAdmin')

  // 动态菜单列表
  const menuList = ref([])

  function setUserInfo(info) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  function logOut() {
    userInfo.value = null
    menuList.value = []
    localStorage.removeItem('userInfo')
  }

  function restoreSession() {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try { userInfo.value = JSON.parse(stored) } catch { localStorage.removeItem('userInfo') }
    }
  }

  // 加载用户菜单
  async function loadMenus() {
    if (!userInfo.value) return
    try {
      const res = await getUserMenus(userInfo.value.role)
      if (res.code === 0) {
        menuList.value = res.data.menus
      }
    } catch (e) {
      console.error('加载菜单失败', e)
    }
  }

  // 判断是否有某个菜单权限
  function hasMenuPermission(menuCode) {
    return menuList.value.some(m => m.menuCode === menuCode)
  }

  return { userInfo, isLoggedIn, userRole, isSuperAdmin, menuList, setUserInfo, logOut, restoreSession, loadMenus, hasMenuPermission }
})
