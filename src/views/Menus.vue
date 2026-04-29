<template>
  <div class="menus-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon> 新增菜单
          </el-button>
        </div>
      </template>

      <el-alert title="菜单变更后需要刷新页面才能在侧边栏生效" type="info" :closable="false" show-icon style="margin-bottom: 16px" />

      <el-table :data="menus" stripe row-key="id" default-expand-all>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="menuName" label="菜单名称" width="140" />
        <el-table-column prop="menuCode" label="菜单编码" width="120" />
        <el-table-column prop="path" label="路由路径" width="140" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <el-icon><component :is="row.icon" /></el-icon> {{ row.icon }}
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column prop="visible" label="可见" width="80">
          <template #default="{ row }">
            <el-tag :type="row.visible ? 'success' : 'info'" size="small">
              {{ row.visible ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="component" label="组件" width="120" />
        <el-table-column label="操作" fixed="right" width="200">
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
        <el-form-item label="菜单名称" required>
          <el-input v-model="editForm.menuName" placeholder="如：用户管理" />
        </el-form-item>
        <el-form-item label="菜单编码" required>
          <el-input v-model="editForm.menuCode" placeholder="如：users（唯一标识）" />
        </el-form-item>
        <el-form-item label="路由路径" required>
          <el-input v-model="editForm.path" placeholder="如：/users" />
        </el-form-item>
        <el-form-item label="图标">
          <el-select v-model="editForm.icon" placeholder="选择图标" filterable>
            <el-option v-for="icon in iconList" :key="icon" :label="icon" :value="icon" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editForm.sortOrder" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch v-model="editForm.visible" />
        </el-form-item>
        <el-form-item label="组件名">
          <el-input v-model="editForm.component" placeholder="如：Dashboard（需预先注册）" />
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
import { getAllMenus, createMenu, updateMenu, deleteMenu } from '@/mock'
import { useUserStore } from '@/store/user'
import { generateRoutes } from '@/router'

const userStore = useUserStore()
const menus = ref([])
const dialogVisible = ref(false)
const editForm = ref({})
const dialogTitle = computed(() => editForm.value.id ? '编辑菜单' : '新增菜单')

const iconList = ['Odometer', 'User', 'Monitor', 'Document', 'DataLine', 'Menu', 'Connection', 'Setting', 'Lock', 'Bell', 'Histogram', 'Coin']

function handleAdd() {
  editForm.value = { menuName: '', menuCode: '', path: '', icon: 'Document', sortOrder: 99, visible: true, component: 'Dashboard', parentId: 0 }
  dialogVisible.value = true
}

function handleEdit(row) {
  editForm.value = { ...row }
  dialogVisible.value = true
}

async function handleSave() {
  if (!editForm.value.menuName || !editForm.value.menuCode || !editForm.value.path) {
    ElMessage.warning('请填写菜单名称、编码和路径')
    return
  }
  try {
    if (editForm.value.id) {
      await updateMenu(editForm.value.id, editForm.value)
      ElMessage.success('菜单更新成功')
    } else {
      await createMenu(editForm.value)
      ElMessage.success('菜单创建成功')
    }
    dialogVisible.value = false
    await loadMenus()
    // 刷新动态路由
    await userStore.loadMenus()
    generateRoutes(userStore.menuList)
  } catch (err) {
    ElMessage.error(err.message)
  }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定要删除菜单「${row.menuName}」吗？`, '提示', { type: 'warning' })
  try {
    await deleteMenu(row.id)
    ElMessage.success('菜单删除成功')
    await loadMenus()
    await userStore.loadMenus()
    generateRoutes(userStore.menuList)
  } catch (err) {
    ElMessage.error(err.message)
  }
}

async function loadMenus() {
  const res = await getAllMenus()
  if (res.code === 0) menus.value = res.data.list
}

onMounted(loadMenus)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
