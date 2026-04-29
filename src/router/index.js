import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

const staticRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes
})

// 视图组件映射
const viewComponentMap = {
  Dashboard: () => import('../views/Dashboard.vue'),
  Users: () => import('../views/Users.vue'),
  Apps: () => import('../views/Apps.vue'),
  Logs: () => import('../views/Logs.vue'),
  Monitor: () => import('../views/Monitor.vue'),
  Menus: () => import('../views/Menus.vue'),
  Apis: () => import('../views/Apis.vue')
}

let layoutAdded = false

// 动态生成路由
export function generateRoutes(menus) {
  if (layoutAdded) {
    router.removeRoute('Layout')
    layoutAdded = false
  }

  const firstPath = menus.length > 0 ? menus[0].path : '/dashboard'

  router.addRoute({
    name: 'Layout',
    path: '/',
    component: () => import('../views/Layout.vue'),
    redirect: firstPath,
    meta: { requiresAuth: true },
    children: menus.map(menu => ({
      path: menu.path.replace(/^\//, ''),
      name: menu.menuCode,
      component: viewComponentMap[menu.component] || viewComponentMap['Dashboard'],
      meta: {
        title: menu.menuName,
        icon: menu.icon,
        permission: menu.menuCode,
        dynamic: true
      }
    }))
  })

  layoutAdded = true
}

// 路由守卫
let isRefreshing = false

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 恢复登录状态
  if (!userStore.isLoggedIn) {
    userStore.restoreSession()
  }

  // 已登录 → 加载动态路由
  if (userStore.isLoggedIn && !layoutAdded) {
    if (isRefreshing) {
      next(false) // 防止并发重复加载
      return
    }
    isRefreshing = true
    try {
      await userStore.loadMenus()
      generateRoutes(userStore.menuList)
      // 路由已动态添加，用 next({ ...to, replace: true }) 重新导航
      next({ ...to, replace: true })
    } catch (e) {
      userStore.logOut()
      next('/login')
    } finally {
      isRefreshing = false
    }
    return
  }

  // 未登录且需要认证 → 跳转登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 已登录访问登录页 → 跳转第一个菜单
  if (to.path === '/login' && userStore.isLoggedIn && layoutAdded) {
    const firstMenu = userStore.menuList[0]
    next(firstMenu ? firstMenu.path : '/dashboard')
    return
  }

  next()
})

export default router
