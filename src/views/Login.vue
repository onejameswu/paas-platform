<template>
  <div class="login-container">
    <!-- 左侧图片展示区 -->
    <div class="login-banner" :style="bannerStyle">
      <!-- 图片切换控制 -->
      <div class="banner-controls">
        <div class="image-switcher">
          <div
            v-for="(img, index) in imageList"
            :key="index"
            class="image-thumb"
            :class="{ active: currentImageIndex === index }"
            :style="{ backgroundImage: `url(${img.url})` }"
            @click="switchImage(index)"
          />
        </div>
        <div class="upload-btn" @click="triggerUpload" title="上传自定义图片">
          <el-icon :size="20"><Plus /></el-icon>
        </div>
      </div>

      <!-- 左侧品牌信息 -->
      <div class="banner-overlay">
        <div class="brand-info">
          <div class="brand-logo">
            <el-icon :size="48" color="#fff"><Cloudy /></el-icon>
          </div>
          <h1>云原生应用管理平台</h1>
          <p>Cloud-Native Application Management Platform</p>
          <div class="brand-features">
            <div class="feature-item">
              <el-icon :size="20"><Monitor /></el-icon>
              <span>容器集群管理</span>
            </div>
            <div class="feature-item">
              <el-icon :size="20"><Connection /></el-icon>
              <span>微服务治理</span>
            </div>
            <div class="feature-item">
              <el-icon :size="20"><DataAnalysis /></el-icon>
              <span>智能监控告警</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐藏的文件上传 -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleImageUpload"
      />
    </div>

    <!-- 右侧登录窗口 -->
    <div class="login-panel">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <el-icon :size="32" color="#409eff"><Cloudy /></el-icon>
          </div>
          <h2>欢迎登录</h2>
          <p>请输入您的账号信息</p>
        </div>

        <!-- 账号密码登录 -->
        <div v-show="!showQrcode" class="login-form">
          <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="0">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" size="large" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large" show-password @keyup.enter="handleLogin" />
            </el-form-item>
            <el-form-item>
              <div class="login-options">
                <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
                <el-link type="primary" :underline="false">忘记密码？</el-link>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="switch-login" @click="showQrcode = true">
            <el-icon><Iphone /></el-icon> 二维码登录
          </div>
        </div>

        <!-- 二维码登录 -->
        <div v-show="showQrcode" class="qrcode-login">
          <div class="qrcode-wrapper">
            <div class="qrcode-placeholder">
              <el-icon :size="80" color="#c0c4cc"><Iphone /></el-icon>
              <p>微信扫码登录</p>
            </div>
            <div class="mask" v-if="showmask" @click="refreshQrcode">二维码已过期，点击刷新</div>
          </div>
          <p class="qrcode-hint">{{ loginHint }}</p>
          <div class="switch-login" @click="showQrcode = false">
            <el-icon><User /></el-icon> 账号密码登录
          </div>
        </div>

        <!-- 测试账号 -->
        <div class="test-accounts">
          <el-divider>测试账号</el-divider>
          <div class="account-list">
            <el-tag v-for="account in testAccounts" :key="account.username" class="account-tag" :type="account.type" effect="plain" @click="fillAccount(account)">
              {{ account.label }}: {{ account.username }} / {{ account.password }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="copyright">
        © 2024 云原生应用管理平台 All Rights Reserved
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockLogin } from '../mock'
import { useUserStore } from '../store/user'
import { generateRoutes } from '../router'

const router = useRouter()
const userStore = useUserStore()

const showQrcode = ref(false)
const loading = ref(false)
const loginHint = ref('请使用微信扫描二维码登录')
const showmask = ref(false)
const formRef = ref(null)
const fileInputRef = ref(null)
const rememberMe = ref(false)

const loginForm = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const testAccounts = [
  { label: '超级管理员', username: 'admin', password: 'admin123', type: 'danger' },
  { label: '普通管理员', username: 'manager', password: 'manager123', type: 'warning' },
  { label: '普通用户', username: 'user', password: 'user123', type: 'success' }
]

// 背景图片管理
const defaultImages = [
  { url: '/login-images/bg1.jpg', name: '科技蓝' },
  { url: '/login-images/bg2.jpg', name: '未来城' },
  { url: '/login-images/bg3.jpg', name: '几何风' }
]

// 从 localStorage 读取自定义图片
const savedImages = ref([])
try {
  const saved = localStorage.getItem('login_custom_images')
  if (saved) savedImages.value = JSON.parse(saved)
} catch (e) {}

const imageList = computed(() => [...defaultImages, ...savedImages.value])
const currentImageIndex = ref(0)

// 读取上次选择的图片索引
try {
  const savedIndex = localStorage.getItem('login_bg_index')
  if (savedIndex !== null) {
    const idx = parseInt(savedIndex)
    if (idx >= 0 && idx < imageList.value.length) currentImageIndex.value = idx
  }
} catch (e) {}

const bannerStyle = computed(() => ({
  backgroundImage: `url(${imageList.value[currentImageIndex.value]?.url || defaultImages[0].url})`
}))

function switchImage(index) {
  currentImageIndex.value = index
  localStorage.setItem('login_bg_index', String(index))
}

function triggerUpload() {
  fileInputRef.value?.click()
}

function handleImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const newImage = {
      url: event.target.result,
      name: file.name.replace(/\.[^.]+$/, '')
    }
    savedImages.value.push(newImage)
    try {
      localStorage.setItem('login_custom_images', JSON.stringify(savedImages.value))
    } catch (e) {
      ElMessage.warning('存储空间不足，请删除部分自定义图片')
      savedImages.value.pop()
      return
    }
    // 自动切换到新上传的图片
    switchImage(imageList.value.length - 1)
    ElMessage.success('图片上传成功')
  }
  reader.readAsDataURL(file)
  // 重置 input，允许重复上传同一文件
  e.target.value = ''
}

function fillAccount(account) {
  loginForm.username = account.username
  loginForm.password = account.password
}

function handleLogin() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await mockLogin(loginForm.username, loginForm.password)
      ElMessage.success(res.message)
      userStore.setUserInfo(res.data.userInfo)
      await userStore.loadMenus()
      generateRoutes(userStore.menuList)
      router.push('/dashboard')
    } catch (err) {
      ElMessage.error(err.message)
    } finally {
      loading.value = false
    }
  })
}

function refreshQrcode() {
  showmask.value = false
  loginHint.value = '请使用微信扫描二维码登录'
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* ===== 左侧图片展示区 ===== */
.login-banner {
  flex: 1;
  min-width: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  transition: background-image 0.6s ease;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%);
  display: flex;
  align-items: flex-end;
  padding: 60px;
  box-sizing: border-box;
}

.brand-info {
  color: #fff;
  max-width: 500px;
}

.brand-logo {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.brand-info h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.brand-info p {
  font-size: 15px;
  opacity: 0.85;
  margin-bottom: 30px;
}

.brand-features {
  display: flex;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(6px);
}

/* 图片切换控制 */
.banner-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.image-switcher {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 6px 10px;
  border-radius: 24px;
}

.image-thumb {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
  opacity: 0.6;
}

.image-thumb:hover {
  opacity: 0.9;
  transform: scale(1.1);
}

.image-thumb.active {
  border-color: #fff;
  opacity: 1;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

.upload-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s;
  border: 1px dashed rgba(255, 255, 255, 0.5);
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.1);
}

/* ===== 右侧登录面板 ===== */
.login-panel {
  width: 520px;
  min-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fc;
  padding: 40px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px 36px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #409eff, #0c3483);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.login-header h2 {
  font-size: 22px;
  color: #303133;
  margin-bottom: 6px;
  font-weight: 600;
}

.login-header p {
  color: #909399;
  font-size: 14px;
}

.login-options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-btn {
  width: 100%;
  border-radius: 8px;
  height: 44px;
  font-size: 16px;
}

.switch-login {
  text-align: center;
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.switch-login:hover {
  color: #66b1ff;
}

.qrcode-login {
  text-align: center;
}

.qrcode-wrapper {
  position: relative;
  display: inline-block;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 auto;
}

.qrcode-placeholder p {
  color: #909399;
  font-size: 14px;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.qrcode-hint {
  color: #909399;
  font-size: 13px;
  margin: 12px 0;
}

.test-accounts {
  margin-top: 24px;
}

.account-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.account-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.account-tag:hover {
  transform: scale(1.05);
}

.copyright {
  margin-top: 32px;
  color: #c0c4cc;
  font-size: 12px;
  text-align: center;
}

/* ===== 响应式 ===== */
@media (max-width: 960px) {
  .login-container {
    flex-direction: column;
  }

  .login-banner {
    height: 35vh;
    min-height: 200px;
  }

  .login-panel {
    width: 100%;
    min-width: unset;
    flex: 1;
  }

  .banner-overlay {
    padding: 24px;
    align-items: flex-end;
  }

  .brand-info h1 {
    font-size: 22px;
  }

  .brand-features {
    gap: 10px;
    flex-wrap: wrap;
  }

  .feature-item {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
