<template>
  <div class="dashboard">
    <!-- 欢迎语 -->
    <div class="welcome-section">
      <h2>欢迎回来，{{ userStore.userInfo?.nickName }}</h2>
      <p>角色：{{ userStore.userInfo?.roleName }} | 云原生集群运行正常</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-body">
            <div class="stat-info">
              <p class="stat-title">{{ card.title }}</p>
              <h3 class="stat-value" :style="{ color: card.color }">{{ card.value }}</h3>
            </div>
            <el-icon :size="48" :color="card.color" class="stat-icon">
              <component :is="card.icon" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 资源使用 + 快捷操作 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <span>资源使用情况</span>
          </template>
          <div class="resource-list">
            <div class="resource-item" v-for="item in resources" :key="item.label">
              <div class="resource-header">
                <span>{{ item.label }}</span>
                <span class="resource-value">{{ item.value }}%</span>
              </div>
              <el-progress
                :percentage="item.value"
                :color="item.color"
                :stroke-width="20"
                :text-inside="true"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/apps')">
              <el-icon><Plus /></el-icon> 创建应用
            </el-button>
            <el-button type="success" @click="$router.push('/users')" v-if="userStore.hasMenuPermission('users')">
              <el-icon><User /></el-icon> 用户管理
            </el-button>
            <el-button type="warning" @click="$router.push('/logs')" v-if="userStore.hasMenuPermission('logs')">
              <el-icon><Document /></el-icon> 查看日志
            </el-button>
          </div>
        </el-card>

        <el-card shadow="hover" style="margin-top: 20px">
          <template #header>
            <span>系统信息</span>
          </template>
          <div class="sys-info">
            <div class="sys-info-item">
              <span>平台版本</span>
              <el-tag size="small">v2.0.0</el-tag>
            </div>
            <div class="sys-info-item">
              <span>运行时间</span>
              <span>128 天</span>
            </div>
            <div class="sys-info-item">
              <span>在线用户</span>
              <span>23</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近日志 -->
    <el-card shadow="hover" style="margin-top: 20px" v-if="userStore.hasMenuPermission('logs')">
      <template #header>
        <div class="card-header">
          <span>最近操作日志</span>
          <el-button text type="primary" @click="$router.push('/logs')">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentLogs" stripe size="small">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="ip" label="IP" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { getDashboardStats, mockLogs } from '@/mock'

const userStore = useUserStore()

const stats = ref({
  totalUsers: 0, activeUsers: 0, totalApps: 0, runningApps: 0,
  errorApps: 0, cpuUsage: 0, memoryUsage: 0, storageUsage: 0,
  todayLogs: 0, weekGrowth: 0
})

const statCards = computed(() => [
  { title: '用户总数', value: stats.value.totalUsers, icon: 'User', color: '#409eff' },
  { title: '运行应用', value: stats.value.runningApps, icon: 'Monitor', color: '#67c23a' },
  { title: '异常应用', value: stats.value.errorApps, icon: 'WarningFilled', color: '#f56c6c' },
  { title: '今日日志', value: stats.value.todayLogs, icon: 'Document', color: '#e6a23c' }
])

const resources = computed(() => [
  { label: 'CPU 使用率', value: stats.value.cpuUsage, color: '#409eff' },
  { label: '内存使用率', value: stats.value.memoryUsage, color: '#67c23a' },
  { label: '存储使用率', value: stats.value.storageUsage, color: '#e6a23c' }
])

const recentLogs = computed(() => mockLogs.slice(0, 5))

onMounted(() => {
  getDashboardStats().then(res => {
    if (res.code === 0) {
      stats.value = res.data
    }
  })
})
</script>

<style scoped>
.welcome-section {
  margin-bottom: 20px;
}

.welcome-section h2 {
  color: #303133;
  margin-bottom: 4px;
}

.welcome-section p {
  color: #909399;
  font-size: 14px;
}

.stat-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-title {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
}

.stat-icon {
  opacity: 0.8;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.resource-value {
  font-weight: 600;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-actions .el-button {
  width: 100%;
  justify-content: flex-start;
}

.sys-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sys-info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
