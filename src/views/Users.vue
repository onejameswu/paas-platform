<template>
  <div class="users-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon> 新增用户
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchText"
          placeholder="搜索用户名/昵称"
          prefix-icon="Search"
          clearable
          style="width: 300px"
        />
        <el-select v-model="filterRole" placeholder="角色筛选" clearable style="width: 150px; margin-left: 12px">
          <el-option label="超级管理员" value="superAdmin" />
          <el-option label="普通管理员" value="admin" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </div>

      <!-- 用户表格 -->
      <el-table :data="filteredUsers" stripe style="margin-top: 16px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickName" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="roleName" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="roleTagType(row.role)" size="small">{{ row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              text
              :type="row.status === 1 ? 'danger' : 'success'"
              size="small"
              @click="toggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="!!editForm.id" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickName" />
        </el-form-item>
        <el-form-item label="密码" v-if="!editForm.id">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" style="width: 100%">
            <el-option label="超级管理员" value="superAdmin" />
            <el-option label="普通管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
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
import { ElMessage } from 'element-plus'
import { getMockUsers } from '@/mock'

const users = ref([])
const searchText = ref('')
const filterRole = ref('')
const dialogVisible = ref(false)
const editForm = ref({})

const dialogTitle = computed(() => editForm.value.id ? '编辑用户' : '新增用户')

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchSearch = !searchText.value ||
      u.username.includes(searchText.value) ||
      u.nickName.includes(searchText.value)
    const matchRole = !filterRole.value || u.role === filterRole.value
    return matchSearch && matchRole
  })
})

function roleTagType(role) {
  const map = { superAdmin: 'danger', admin: 'warning', user: 'success' }
  return map[role] || 'info'
}

function handleAdd() {
  editForm.value = { username: '', nickName: '', password: '', email: '', phone: '', role: 'user' }
  dialogVisible.value = true
}

function handleEdit(row) {
  editForm.value = { ...row }
  dialogVisible.value = true
}

function handleSave() {
  if (!editForm.value.id && !editForm.value.password) {
    ElMessage.warning('请输入密码')
    return
  }
  ElMessage.success(editForm.value.id ? '编辑成功' : '新增成功')
  dialogVisible.value = false
  loadUsers()
}

function toggleStatus(row) {
  row.status = row.status === 1 ? 0 : 1
  ElMessage.success(row.status === 1 ? '已启用' : '已禁用')
}

function loadUsers() {
  getMockUsers().then(res => {
    if (res.code === 0) {
      users.value = res.data.list
    }
  })
}

onMounted(loadUsers)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
}
</style>
