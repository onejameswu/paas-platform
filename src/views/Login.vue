<template>
  <div class="login-container">
    <!-- 左侧图片展示区 -->
    <div class="login-banner" :style="bannerStyle">
      <div class="banner-overlay">
        <div class="brand-info">
          <div class="brand-logo">
            <img v-if="themeStore.settings.logoImage" :src="themeStore.settings.logoImage" class="brand-logo-img" />
            <el-icon v-else :size="48" color="#fff"><Cloudy /></el-icon>
          </div>
          <h1>{{ themeStore.settings.loginTitle }}</h1>
          <p>{{ themeStore.settings.loginSubtitle }}</p>
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
    </div>

    <!-- 右侧登录窗口 -->
    <div class="login-panel">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <img v-if="themeStore.settings.logoImage" :src="themeStore.settings.logoImage" class="header-logo-img" />
            <el-icon v-else :size="32" color="#fff"><Cloudy /></el-icon>
          </div>
          <h2>欢迎登录</h2>
          <p>请输入您的账号信息</p>
        </div>

        <!-- 步骤 1: 账号密码 + 验证码 -->
        <div v-show="step === 1" class="login-form">
          <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="0">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" size="large" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large" show-password @keyup.enter="handleStep1" />
            </el-form-item>

            <!-- 图形验证码 -->
            <el-form-item v-if="themeStore.settings.enableCaptcha" prop="captcha">
              <div class="captcha-row">
                <el-input v-model="loginForm.captcha" placeholder="请输入验证码" size="large" @keyup.enter="handleStep1" class="captcha-input" />
                <canvas ref="captchaCanvasRef" class="captcha-canvas" width="120" height="40" @click="generateCaptcha" title="点击刷新验证码" />
              </div>
            </el-form-item>

            <el-form-item>
              <div class="login-options">
                <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
                <el-link type="primary" :underline="false">忘记密码？</el-link>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleStep1">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤 2: 双因素认证 -->
        <div v-show="step === 2" class="login-form">
          <div class="step2-header">
            <el-icon :size="48" color="#409eff"><Iphone /></el-icon>
            <h3>双因素认证</h3>
            <p>请输入您的动态验证码完成登录</p>
          </div>
          <el-form :model="twoFAForm" :rules="twoFARules" ref="twoFAFormRef" label-width="0">
            <el-form-item prop="code">
              <el-input
                v-model="twoFAForm.code"
                placeholder="请输入 6 位动态验证码"
                size="large"
                maxlength="6"
                @keyup.enter="handleStep2"
                class="code-input"
              >
                <template #prefix>
                  <el-icon><Key /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleStep2">
                验 证
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="large" class="login-btn back-btn" @click="step = 1">
                返回上一步
              </el-button>
            </el-form-item>
          </el-form>
          <div class="step2-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>演示环境请输入任意 6 位数字即可通过验证</span>
          </div>
        </div>
      </div>

      <div class="copyright">{{ themeStore.settings.copyright }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockLoginWithSession } from '../mock'
import { useUserStore } from '../store/user'
import { useThemeStore } from '../store/theme'
import { generateRoutes } from '../router'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const step = ref(1)
const loading = ref(false)
const rememberMe = ref(false)
const formRef = ref(null)
const twoFAFormRef = ref(null)
const captchaCanvasRef = ref(null)
let captchaAnswer = ''

const loginForm = reactive({ username: '', password: '', captcha: '' })
const twoFAForm = reactive({ code: '' })

const rules = computed(() => {
  const base = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }
  if (themeStore.settings.enableCaptcha) {
    base.captcha = [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  }
  return base
})

const twoFARules = {
  code: [
    { required: true, message: '请输入动态验证码', trigger: 'blur' },
    { len: 6, message: '验证码为 6 位数字', trigger: 'blur' }
  ]
}

// ---- 背景图片（仅使用默认图片，主题由后台管理员配置） ----
const defaultImage = '/login-images/bg1.jpg'

const bannerStyle = computed(() => ({
  backgroundImage: `url(${defaultImage})`
}))

// ---- 图形验证码 ----
function generateCaptcha() {
  const canvas = captchaCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const width = 120
  const height = 40

  // 背景
  ctx.fillStyle = '#f0f2f5'
  ctx.fillRect(0, 0, width, height)

  // 干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 60%, 70%)`
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }

  // 干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 60%, 70%)`
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 生成 4 位随机字符
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaAnswer = ''
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']
  for (let i = 0; i < 4; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)]
    captchaAnswer += char
    ctx.save()
    ctx.font = `bold ${20 + Math.random() * 8}px Arial`
    ctx.fillStyle = colors[i % colors.length]
    ctx.translate(20 + i * 24, 28)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillText(char, 0, 0)
    ctx.restore()
  }
}

// ---- 登录流程 ----
function handleStep1() {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    // 验证图形验证码
    if (themeStore.settings.enableCaptcha) {
      if (loginForm.captcha.toUpperCase() !== captchaAnswer) {
        ElMessage.error('验证码错误')
        generateCaptcha()
        loginForm.captcha = ''
        return
      }
    }

    loading.value = true
    try {
      const res = await mockLoginWithSession(loginForm.username, loginForm.password)

      // 如果开启了 2FA 且非超级管理员，进入第二步
      // 超级管理员作为安全策略配置者，豁免双因素认证，避免被锁死
      if (themeStore.settings.enable2FA && res.data.userInfo.role !== 'superAdmin') {
        step.value = 2
        ElMessage.success('账号验证通过，请完成双因素认证')
      } else {
        completeLogin(res)
      }
    } catch (err) {
      ElMessage.error(err.message)
      if (themeStore.settings.enableCaptcha) {
        generateCaptcha()
        loginForm.captcha = ''
      }
    } finally {
      loading.value = false
    }
  })
}

function handleStep2() {
  twoFAFormRef.value.validate(async (valid) => {
    if (!valid) return

    // 演示环境：任意 6 位数字即可
    if (!/^\d{6}$/.test(twoFAForm.code)) {
      ElMessage.error('请输入正确的 6 位数字验证码')
      return
    }

    loading.value = true
    try {
      const res = await mockLoginWithSession(loginForm.username, loginForm.password)
      completeLogin(res)
    } catch (err) {
      ElMessage.error(err.message)
    } finally {
      loading.value = false
    }
  })
}

async function completeLogin(res) {
  ElMessage.success(res.message)
  userStore.setUserInfo(res.data.userInfo)
  if (res.data.token) {
    localStorage.setItem('sessionToken', res.data.token)
  }
  await userStore.loadMenus()
  generateRoutes(userStore.menuList)
  router.push('/dashboard')
}

onMounted(() => {
  themeStore.loadSettings()
  if (themeStore.settings.enableCaptcha) {
    nextTick(() => generateCaptcha())
  }
})
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
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%);
  display: flex;
  align-items: flex-end;
  padding: 60px;
  box-sizing: border-box;
}

.brand-info { color: #fff; max-width: 500px; }
.brand-logo {
  width: 72px; height: 72px; border-radius: 18px;
  background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px; overflow: hidden;
}
.brand-logo-img { width: 100%; height: 100%; object-fit: contain; }
.brand-info h1 { font-size: 32px; font-weight: 600; margin-bottom: 8px; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.brand-info p { font-size: 15px; opacity: 0.85; margin-bottom: 30px; }
.brand-features { display: flex; gap: 24px; }
.feature-item {
  display: flex; align-items: center; gap: 8px; font-size: 14px; opacity: 0.9;
  background: rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(6px);
}

/* ===== 右侧登录面板 ===== */
.login-panel {
  width: 520px; min-width: 520px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #f8f9fc; padding: 40px; box-sizing: border-box;
}
.login-card {
  width: 100%; max-width: 400px;
  padding: 40px 36px; background: #fff; border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
.login-header { text-align: center; margin-bottom: 32px; }
.logo-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: linear-gradient(135deg, #409eff, #0c3483);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  overflow: hidden;
}
.header-logo-img { width: 100%; height: 100%; object-fit: contain; }
.login-header h2 { font-size: 22px; color: #303133; margin-bottom: 6px; font-weight: 600; }
.login-header p { color: #909399; font-size: 14px; }

.captcha-row { display: flex; gap: 12px; width: 100%; }
.captcha-input { flex: 1; }
.captcha-canvas {
  height: 40px; border-radius: 6px; cursor: pointer;
  border: 1px solid #dcdfe6; flex-shrink: 0;
}

.login-options { width: 100%; display: flex; justify-content: space-between; align-items: center; }
.login-btn { width: 100%; border-radius: 8px; height: 44px; font-size: 16px; }
.back-btn { background: #f5f7fa; border-color: #dcdfe6; color: #606266; }

.step2-header { text-align: center; margin-bottom: 28px; }
.step2-header h3 { font-size: 18px; color: #303133; margin: 12px 0 6px; }
.step2-header p { color: #909399; font-size: 14px; }
.code-input :deep(.el-input__inner) { letter-spacing: 8px; font-size: 20px; text-align: center; }
.step2-tip {
  display: flex; align-items: center; gap: 6px; justify-content: center;
  margin-top: 16px; font-size: 12px; color: #909399;
}

.copyright { margin-top: 32px; color: #c0c4cc; font-size: 12px; text-align: center; }

/* ===== 响应式 ===== */
@media (max-width: 960px) {
  .login-container { flex-direction: column; }
  .login-banner { height: 35vh; min-height: 200px; }
  .login-panel { width: 100%; min-width: unset; flex: 1; }
  .banner-overlay { padding: 24px; align-items: flex-end; }
  .brand-info h1 { font-size: 22px; }
  .brand-features { gap: 10px; flex-wrap: wrap; }
  .feature-item { font-size: 12px; padding: 6px 12px; }
}
</style>
