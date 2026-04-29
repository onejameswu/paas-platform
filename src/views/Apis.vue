<template>
  <div class="apis-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>接口管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon> 新增接口
          </el-button>
        </div>
      </template>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-input v-model="searchText" placeholder="搜索接口名称/路径" prefix-icon="Search" clearable style="width: 280px" />
        <el-select v-model="filterGroup" placeholder="模块筛选" clearable style="width: 150px; margin-left: 12px">
          <el-option v-for="g in groups" :key="g" :label="g" :value="g" />
        </el-select>
        <el-select v-model="filterMethod" placeholder="请求方式" clearable style="width: 120px; margin-left: 12px">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
        </el-select>
      </div>

      <el-table :data="filteredApis" stripe style="margin-top: 16px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="接口名称" width="160" />
        <el-table-column prop="path" label="路径" width="240">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" class="path-tag">{{ row.path }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="method" label="方式" width="90">
          <template #default="{ row }">
            <el-tag :type="methodType(row.method)" size="small" effect="dark">{{ row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="所属模块" width="110">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.groupName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button text type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="接口名称" required>
          <el-input v-model="editForm.name" placeholder="如：用户登录" />
        </el-form-item>
        <el-form-item label="请求路径" required>
          <el-input v-model="editForm.path" placeholder="如：/api/auth/login" />
        </el-form-item>
        <el-form-item label="请求方式" required>
          <el-select v-model="editForm.method" style="width: 100%">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属模块">
          <el-input v-model="editForm.groupName" placeholder="如：认证模块" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" :rows="3" placeholder="接口功能描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getApiList, createApi, updateApi, deleteApi } from '@/mock'

const apis = ref([])
const searchText = ref('')
const filterGroup = ref('')
const filterMethod = ref('')
const dialogVisible = ref(false)
const editForm = ref({})
const dialogTitle = computed(() => editForm.value.id ? '编辑接口' : '新增接口')

const groups = computed(() => [...new Set(apis.value.map(a => a.groupName))])

const filteredApis = computed(() => {
  return apis.value.filter(a => {
    const matchSearch = !searchText.value || a.name.includes(searchText.value) || a.path.includes(searchText.value)
    const matchGroup = !filterGroup.value || a.groupName === filterGroup.value
    const matchMethod = !filterMethod.value || a.method === filterMethod.value
    return matchSearch && matchGroup && matchMethod
  })
})

function methodType(method) {
  const map = { GET: '', POST: 'success', PUT: 'warning', DELETE: 'danger' }
  return map[method] || 'info'
}

function handleAdd() {
  editForm.value = { name: '', path: '', method: 'GET', groupName: '', description: '', status: 1 }
  dialogVisible.value = true
}

function handleEdit(row) {
  editForm.value = { ...row }
  dialogVisible.value = true
}

async function handleSave() {
  if (!editForm.value.name || !editForm.value.path) {
    ElMessage.warning('请填写接口名称和路径')
    return
  }
  try {
    if (editForm.value.id) {
      await updateApi(editForm.value.id, editForm.value)
      ElMessage.success('接口更新成功')
    } else {
      await createApi(editForm.value)
      ElMessage.success('接口创建成功')
    }
    dialogVisible.value = false
    loadApis()
  } catch (err) {
    ElMessage.error(err.message)
  }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定要删除接口「${row.name}」吗？`, '提示', { type: 'warning' })
  try {
    await deleteApi(row.id)
    ElMessage.success('接口删除成功')
    loadApis()
  } catch (err) {
    ElMessage.error(err.message)
  }
}

async function loadApis() {
  const res = await getApiList()
  if (res.code === 0) apis.value = res.data.list
}

onMounted(loadApis)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.filter-bar { display: flex; align-items: center; }
.path-tag { font-family: monospace; font-size: 12px; }
</style>
