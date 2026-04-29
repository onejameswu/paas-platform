<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <img v-if="themeStore.settings.logoImage" :src="themeStore.settings.logoImage" class="logo-img" />
        <el-icon v-else :size="28" color="#409eff"><Cloudy /></el-icon>
        <span v-show="!isCollapse" class="logo-text">{{ themeStore.settings.logoText }}</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :router="true"
        :background-color="themeStore.settings.sidebarColor"
        :text-color="themeStore.settings.sidebarTextColor"
        :active-text-color="themeStore.settings.sidebarActiveColor"
        class="side-menu"
      >
        <el-menu-item v-for="menu in userStore.menuList" :key="menu.menuCode" :index="menu.path">
          <el-icon><component :is="menu.icon" /></el-icon>
          <template #title>{{ menu.menuName }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" :size="20" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta?.title">{{ currentRoute.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" class="avatar">{{ userStore.userInfo?.nickName?.charAt(0) || 'U' }}</el-avatar>
              <span class="username">{{ userStore.userInfo?.nickName }}</span>
              <el-tag size="small" :type="roleTagType" effect="plain">{{ userStore.userInfo?.roleName }}</el-tag>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <el-icon><Message /></el-icon> {{ userStore.userInfo?.email }}
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import { generateRoutes } from '@/router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const currentRoute = computed(() => route)
const roleTagType = computed(() => {
  const roleMap = { superAdmin: 'danger', admin: 'warning', user: 'success' }
  return roleMap[userStore.userRole] || 'info'
})

function handleCommand(command) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logOut()
      ElMessage.success('已退出登录')
      router.push('/login')
    }).catch(() => {})
  }
}

onMounted(() => {
  themeStore.loadSettings()
  themeStore.applyTheme()
})
</script>

<style scoped>
.layout-container { height: 100vh; }
.aside {
  background-color: v-bind('themeStore.settings.sidebarColor');
  transition: width 0.3s;
  overflow: hidden;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #ffffff1a;
}
.logo-img { width: 28px; height: 28px; object-fit: contain; }
.logo-text { color: #fff; font-size: 16px; font-weight: 600; white-space: nowrap; }
.side-menu { border-right: none; height: calc(100vh - 60px); overflow-y: auto; }
.side-menu:not(.el-menu--collapse) { width: 220px; }
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  padding: 0 20px;
  height: 60px;
}
.header-left { display: flex; align-items: center; gap: 16px; }
.collapse-btn { cursor: pointer; color: #606266; }
.collapse-btn:hover { color: #409eff; }
.header-right { display: flex; align-items: center; }
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #606266;
}
.user-info:hover { color: #409eff; }
.avatar { background: #409eff; color: #fff; font-size: 14px; }
.username { font-size: 14px; }
.main-content { background: #f0f2f5; padding: 20px; overflow-y: auto; }
</style>
