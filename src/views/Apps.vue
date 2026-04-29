<template>
  <div class="apps-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>应用管理</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon> 创建应用
          </el-button>
        </div>
      </template>

      <!-- 统计 -->
      <el-row :gutter="16" class="app-stats">
        <el-col :span="6">
          <div class="mini-stat">
            <span class="mini-stat-value">{{ apps.length }}</span>
            <span class="mini-stat-label">总应用</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="mini-stat">
            <span class="mini-stat-value success">{{ runningCount }}</span>
            <span class="mini-stat-label">运行中</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="mini-stat">
            <span class="mini-stat-value danger">{{ errorCount }}</span>
            <span class="mini-stat-label">异常</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="mini-stat">
            <span class="mini-stat-value info">{{ stoppedCount }}</span>
            <span class="mini-stat-label">已停止</span>
          </div>
        </el-col>
      </el-row>

      <!-- 应用列表 -->
      <el-table :data="apps" stripe style="margin-top: 16px">
        <el-table-column prop="name" label="应用名称" width="160" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="instances" label="实例数" width="100" />
        <el-table-column prop="cpu" label="CPU" width="100" />
        <el-table-column prop="memory" label="内存" width="100" />
        <el-table-column prop="owner" label="负责人" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" fixed="right" width="240">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === 'running'"
              text type="warning" size="small"
              @click="handleStop(row)"
            >停止</el-button>
            <el-button
              v-if="row.status === 'stopped'"
              text type="success" size="small"
              @click="handleStart(row)"
            >启动</el-button>
            <el-button
              v-if="row.status === 'error'"
              text type="danger" size="small"
              @click="handleRestart(row)"
            >重启</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="应用详情" width="500px">
      <el-descriptions :column="1" border v-if="currentApp">
        <el-descriptions-item label="应用名称">{{ currentApp.name }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ currentApp.type }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType(currentApp.status)" size="small">
            {{ statusLabel(currentApp.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="实例数">{{ currentApp.instances }}</el-descriptions-item>
        <el-descriptions-item label="CPU">{{ currentApp.cpu }}</el-descriptions-item>
        <el-descriptions-item label="内存">{{ currentApp.memory }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ currentApp.owner }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentApp.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockApps } from '@/mock'

const apps = ref([...mockApps])
const detailVisible = ref(false)
const currentApp = ref(null)

const runningCount = computed(() => apps.value.filter(a => a.status === 'running').length)
const errorCount = computed(() => apps.value.filter(a => a.status === 'error').length)
const stoppedCount = computed(() => apps.value.filter(a => a.status === 'stopped').length)

function statusType(status) {
  const map = { running: 'success', stopped: 'info', error: 'danger' }
  return map[status] || 'info'
}

function statusLabel(status) {
  const map = { running: '运行中', stopped: '已停止', error: '异常' }
  return map[status] || status
}

function handleCreate() {
  ElMessage.info('创建应用功能开发中...')
}

function handleDetail(row) {
  currentApp.value = row
  detailVisible.value = true
}

function handleStop(row) {
  ElMessageBox.confirm(`确定要停止应用 [${row.name}] 吗？`, '提示', { type: 'warning' })
    .then(() => {
      row.status = 'stopped'
      row.instances = 0
      row.cpu = '0%'
      row.memory = '0MB'
      ElMessage.success('应用已停止')
    }).catch(() => {})
}

function handleStart(row) {
  ElMessageBox.confirm(`确定要启动应用 [${row.name}] 吗？`, '提示', { type: 'info' })
    .then(() => {
      row.status = 'running'
      row.instances = 1
      row.cpu = '5%'
      row.memory = '128MB'
      ElMessage.success('应用已启动')
    }).catch(() => {})
}

function handleRestart(row) {
  ElMessageBox.confirm(`确定要重启应用 [${row.name}] 吗？`, '提示', { type: 'warning' })
    .then(() => {
      row.status = 'running'
      ElMessage.success('应用已重启')
    }).catch(() => {})
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-stats {
  margin-bottom: 8px;
}

.mini-stat {
  text-align: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.mini-stat-value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.mini-stat-value.success { color: #67c23a; }
.mini-stat-value.danger { color: #f56c6c; }
.mini-stat-value.info { color: #909399; }

.mini-stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
</style>
