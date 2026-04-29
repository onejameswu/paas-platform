<template>
  <div class="sessions-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>在线用户管理</span>
          <el-button type="primary" :icon="Refresh" @click="loadSessions">刷新</el-button>
        </div>
      </template>

      <el-alert
        title="会话管理说明"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 16px"
      >
        <template #default>
          系统支持多用户并发登录，同一账号在新设备登录时将自动踢出旧会话。
          管理员可在此查看所有在线用户并强制踢出指定会话。会话超时时间：30 分钟。
        </template>
      </el-alert>

      <el-table :data="sessions" stripe>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickName" label="昵称" width="120" />
        <el-table-column prop="roleName" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'superAdmin' ? 'danger' : row.role === 'admin' ? 'warning' : 'info'" size="small">
              {{ row.roleName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="登录IP" width="140" />
        <el-table-column prop="loginTime" label="登录时间" width="180" />
        <el-table-column prop="lastActiveTime" label="最后活跃" width="180" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'online' ? 'success' : 'info'" size="small" effect="dark">
              {{ row.status === 'online' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="{ row }">
            <el-button
              text
              type="danger"
              size="small"
              :disabled="row.role === 'superAdmin'"
              @click="handleKick(row)"
            >
              踢出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOnlineSessions, kickSession } from '@/mock'

const sessions = ref([])

async function loadSessions() {
  const res = await getOnlineSessions()
  if (res.code === 0) sessions.value = res.data.list
}

async function handleKick(row) {
  await ElMessageBox.confirm(`确定要踢出用户「${row.nickName}」(${row.username}) 吗？`, '踢出确认', { type: 'warning' })
  try {
    await kickSession(row.id)
    ElMessage.success(`已踢出用户 ${row.nickName}`)
    loadSessions()
  } catch (err) {
    ElMessage.error(err.message)
  }
}

onMounted(loadSessions)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
