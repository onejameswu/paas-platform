<template>
  <div class="logs-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>日志审计</span>
          <el-button type="primary" @click="loadLogs">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-input
          v-model="searchText"
          placeholder="搜索用户/操作"
          prefix-icon="Search"
          clearable
          style="width: 250px"
        />
        <el-select v-model="filterType" placeholder="操作类型" clearable style="width: 150px; margin-left: 12px">
          <el-option label="登录" value="login" />
          <el-option label="部署" value="deploy" />
          <el-option label="权限" value="permission" />
          <el-option label="配置" value="config" />
          <el-option label="审计" value="audit" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px; margin-left: 12px">
          <el-option label="成功" value="success" />
          <el-option label="失败" value="failed" />
        </el-select>
      </div>

      <!-- 日志表格 -->
      <el-table :data="filteredLogs" stripe style="margin-top: 16px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="user" label="操作用户" width="120" />
        <el-table-column prop="action" label="操作内容" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="logTypeTag(row.type)" size="small" effect="plain">
              {{ logTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredLogs.length"
          layout="total, prev, pager, next"
          background
          small
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockLogs } from '@/mock'

const logs = ref([...mockLogs].reverse())
const searchText = ref('')
const filterType = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchSearch = !searchText.value ||
      log.user.includes(searchText.value) ||
      log.action.includes(searchText.value)
    const matchType = !filterType.value || log.type === filterType.value
    const matchStatus = !filterStatus.value || log.status === filterStatus.value
    return matchSearch && matchType && matchStatus
  })
})

function logTypeTag(type) {
  const map = { login: '', deploy: 'success', permission: 'warning', config: 'info', audit: '' }
  return map[type] || 'info'
}

function logTypeLabel(type) {
  const map = { login: '登录', deploy: '部署', permission: '权限', config: '配置', audit: '审计' }
  return map[type] || type
}

function loadLogs() {
  logs.value = [...mockLogs].reverse()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-bar {
  display: flex;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
