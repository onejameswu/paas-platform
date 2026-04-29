<template>
  <div class="monitor-page">
    <!-- 集群概览 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in clusterCards" :key="item.label">
        <el-card shadow="hover" class="cluster-card">
          <div class="cluster-card-body">
            <div>
              <p class="cluster-label">{{ item.label }}</p>
              <h3 :style="{ color: item.color }">{{ item.value }}</h3>
            </div>
            <el-icon :size="40" :color="item.color"><component :is="item.icon" /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 资源使用趋势 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>CPU 使用率</span></template>
          <div class="chart-container">
            <div v-for="point in monitorData.cpuSeries" :key="point.time" class="bar-item">
              <div class="bar" :style="{ height: point.value + '%', background: point.value > 80 ? '#f56c6c' : '#409eff' }"></div>
              <span class="bar-label">{{ point.time }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span>当前: <b>{{ currentCpu }}%</b></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>内存使用率</span></template>
          <div class="chart-container">
            <div v-for="point in monitorData.memorySeries" :key="point.time" class="bar-item">
              <div class="bar" :style="{ height: point.value + '%', background: point.value > 80 ? '#f56c6c' : '#67c23a' }"></div>
              <span class="bar-label">{{ point.time }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span>当前: <b>{{ currentMemory }}%</b></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>网络 I/O</span></template>
          <div class="chart-container">
            <div v-for="point in monitorData.networkSeries" :key="point.time" class="bar-item">
              <div class="bar" :style="{ height: point.value + '%', background: '#e6a23c' }"></div>
              <span class="bar-label">{{ point.time }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span>当前: <b>{{ currentNetwork }}%</b></span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 节点列表 + 应用排行 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header><span>集群节点</span></template>
          <el-table :data="monitorData.nodes" stripe size="small">
            <el-table-column prop="name" label="节点" width="100" />
            <el-table-column prop="ip" label="IP" width="120" />
            <el-table-column prop="role" label="角色" width="80">
              <template #default="{ row }">
                <el-tag :type="row.role === 'master' ? 'danger' : ''" size="small" effect="plain">{{ row.role }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === 'healthy' ? 'success' : 'warning'" size="small">{{ row.status === 'healthy' ? '正常' : '告警' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="cpu" label="CPU" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.cpu" :color="row.cpu > 80 ? '#f56c6c' : '#409eff'" :stroke-width="14" :text-inside="true" />
              </template>
            </el-table-column>
            <el-table-column prop="memory" label="内存" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.memory" :color="row.memory > 80 ? '#f56c6c' : '#67c23a'" :stroke-width="14" :text-inside="true" />
              </template>
            </el-table-column>
            <el-table-column prop="pods" label="Pods" width="70" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header><span>应用资源 Top 5</span></template>
          <div class="top-apps">
            <div v-for="(app, index) in monitorData.topApps" :key="app.name" class="top-app-item">
              <div class="top-app-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
              <div class="top-app-info">
                <div class="top-app-name">{{ app.name }}</div>
                <div class="top-app-metrics">
                  <span>CPU: <b>{{ app.cpu }}%</b></span>
                  <span>内存: <b>{{ app.memory }}MB</b></span>
                  <span>请求: <b>{{ app.requests }}/min</b></span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMockMonitorData } from '@/mock'

const monitorData = ref({ cluster: {}, nodes: [], cpuSeries: [], memorySeries: [], networkSeries: [], topApps: [] })

const clusterCards = computed(() => {
  const c = monitorData.value.cluster
  return [
    { label: '集群名称', value: c.name || '-', icon: 'Cloudy', color: '#409eff' },
    { label: '节点数', value: c.nodes || 0, icon: 'Monitor', color: '#67c23a' },
    { label: '运行 Pods', value: c.pods || 0, icon: 'Box', color: '#e6a23c' },
    { label: '命名空间', value: c.namespaces || 0, icon: 'Files', color: '#909399' }
  ]
})

const currentCpu = computed(() => monitorData.value.cluster.cpu?.percent || 0)
const currentMemory = computed(() => monitorData.value.cluster.memory?.percent || 0)
const currentNetwork = computed(() => {
  const series = monitorData.value.networkSeries
  return series.length > 0 ? Math.round(series[series.length - 1].value) : 0
})

onMounted(() => {
  monitorData.value = getMockMonitorData()
})
</script>

<style scoped>
.cluster-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cluster-label { color: #909399; font-size: 14px; margin-bottom: 4px; }
.cluster-card-body h3 { font-size: 22px; font-weight: 600; }

.chart-container {
  height: 180px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 0 4px;
}
.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.bar {
  width: 100%;
  min-height: 2px;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s;
}
.bar-label {
  font-size: 9px;
  color: #909399;
  margin-top: 4px;
  transform: rotate(-45deg);
  white-space: nowrap;
}
.chart-legend {
  text-align: center;
  font-size: 13px;
  color: #606266;
  margin-top: 8px;
}

.top-apps { display: flex; flex-direction: column; gap: 12px; }
.top-app-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  background: #f5f7fa;
}
.top-app-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}
.rank-1 { background: #f56c6c; }
.rank-2 { background: #e6a23c; }
.rank-3 { background: #409eff; }
.rank-4, .rank-5 { background: #909399; }
.top-app-info { flex: 1; }
.top-app-name { font-size: 14px; font-weight: 500; color: #303133; margin-bottom: 4px; }
.top-app-metrics {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}
</style>
