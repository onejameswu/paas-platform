<template>
  <div class="settings-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><Setting /></el-icon>
          <span>系统设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 主题配置 -->
        <el-tab-pane label="主题配置" name="theme">
          <el-form label-width="140px" style="max-width: 600px">
            <el-divider content-position="left">界面主题</el-divider>

            <el-form-item label="主题色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.primaryColor" @change="handlePreview" />
                <span class="color-hex">{{ form.primaryColor }}</span>
                <div class="preset-colors">
                  <div v-for="c in presetColors" :key="c" class="color-dot" :style="{ background: c }" :class="{ active: form.primaryColor === c }" @click="form.primaryColor = c; handlePreview()" />
                </div>
              </div>
            </el-form-item>

            <el-form-item label="侧边栏背景色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.sidebarColor" @change="handlePreview" />
                <span class="color-hex">{{ form.sidebarColor }}</span>
              </div>
            </el-form-item>

            <el-form-item label="侧边栏文字色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.sidebarTextColor" show-alpha @change="handlePreview" />
                <span class="color-hex">{{ form.sidebarTextColor }}</span>
              </div>
            </el-form-item>

            <el-form-item label="菜单激活色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.sidebarActiveColor" @change="handlePreview" />
                <span class="color-hex">{{ form.sidebarActiveColor }}</span>
              </div>
            </el-form-item>

            <el-divider content-position="left">自定义桌面主题</el-divider>

            <el-form-item label="桌面主题">
              <el-radio-group v-model="form.desktopTheme" @change="handlePreview">
                <el-radio-button value="light">
                  <el-icon><Sunny /></el-icon> 浅色
                </el-radio-button>
                <el-radio-button value="dark">
                  <el-icon><Moon /></el-icon> 深色
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="内容区背景色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.contentBgColor" @change="handlePreview" />
                <span class="color-hex">{{ form.contentBgColor }}</span>
              </div>
            </el-form-item>

            <el-form-item label="顶栏背景色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.headerBgColor" @change="handlePreview" />
                <span class="color-hex">{{ form.headerBgColor }}</span>
              </div>
            </el-form-item>

            <el-form-item label="顶栏文字色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.headerTextColor" @change="handlePreview" />
                <span class="color-hex">{{ form.headerTextColor }}</span>
              </div>
            </el-form-item>

            <el-form-item label="卡片背景色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.cardBgColor" @change="handlePreview" />
                <span class="color-hex">{{ form.cardBgColor }}</span>
              </div>
            </el-form-item>

            <el-form-item label="卡片阴影">
              <el-switch v-model="form.cardShadow" active-text="开启" inactive-text="关闭" @change="handlePreview" />
            </el-form-item>

            <el-form-item label="圆角大小">
              <div class="slider-row">
                <el-slider v-model="form.borderRadius" :min="0" :max="24" :step="1" show-input input-size="small" style="flex: 1" @change="handlePreview" />
                <span class="slider-unit">px</span>
              </div>
            </el-form-item>

            <el-form-item label="内容字体">
              <el-input v-model="form.contentFontFamily" placeholder="留空使用默认字体" @change="handlePreview" />
            </el-form-item>

            <el-form-item label="内容字号">
              <div class="slider-row">
                <el-slider v-model="form.contentFontSize" :min="12" :max="20" :step="1" show-input input-size="small" style="flex: 1" @change="handlePreview" />
                <span class="slider-unit">px</span>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveTheme">保存主题</el-button>
              <el-button @click="resetTheme">恢复默认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 平台信息 -->
        <el-tab-pane label="平台信息" name="platform">
          <el-form label-width="140px" style="max-width: 600px">
            <el-form-item label="平台名称">
              <el-input v-model="form.logoText" placeholder="侧边栏显示的平台名称" maxlength="20" show-word-limit />
            </el-form-item>

            <el-form-item label="Logo 图片">
              <div class="logo-upload">
                <el-upload
                  class="logo-uploader"
                  action=""
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="image/*"
                  :on-change="handleLogoUpload"
                >
                  <img v-if="form.logoImage" :src="form.logoImage" class="logo-preview" />
                  <div v-else class="logo-placeholder">
                    <el-icon :size="28"><Plus /></el-icon>
                    <span>上传 Logo</span>
                  </div>
                </el-upload>
                <el-button v-if="form.logoImage" type="danger" link @click="form.logoImage = ''">移除</el-button>
              </div>
            </el-form-item>

            <el-form-item label="登录页标题">
              <el-input v-model="form.loginTitle" placeholder="登录页大标题" />
            </el-form-item>

            <el-form-item label="登录页副标题">
              <el-input v-model="form.loginSubtitle" placeholder="登录页英文副标题" />
            </el-form-item>

            <el-form-item label="版权信息">
              <el-input v-model="form.copyright" placeholder="页脚版权信息" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveTheme">保存设置</el-button>
              <el-button @click="resetTheme">恢复默认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form label-width="140px" style="max-width: 600px">
            <el-form-item label="图形验证码">
              <el-switch v-model="form.enableCaptcha" active-text="开启" inactive-text="关闭" />
              <div class="form-tip">登录时要求输入图形验证码，防止暴力破解</div>
            </el-form-item>

            <el-form-item label="双因素认证">
              <el-switch v-model="form.enable2FA" active-text="开启" inactive-text="关闭" />
              <div class="form-tip">登录成功后要求输入动态验证码（TOTP）</div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveTheme">保存设置</el-button>
              <el-button @click="resetTheme">恢复默认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useThemeStore } from '../store/theme'

const themeStore = useThemeStore()
const activeTab = ref('theme')

const presetColors = ['#409eff', '#1890ff', '#00b96b', '#f5222d', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']

const form = reactive({ ...themeStore.settings })

onMounted(() => {
  Object.assign(form, themeStore.settings)
})

function handlePreview() {
  themeStore.updateSettings({ ...form })
}

function handleLogoUpload(file) {
  if (!file.raw || !file.raw.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  if (file.raw.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.logoImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

function saveTheme() {
  themeStore.updateSettings({ ...form })
  ElMessage.success('设置已保存')
}

function resetTheme() {
  themeStore.resetSettings()
  Object.assign(form, themeStore.settings)
  ElMessage.success('已恢复默认设置')
}
</script>

<style scoped>
.settings-page { max-width: 900px; }
.card-header { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; }
.color-picker-row { display: flex; align-items: center; gap: 12px; }
.color-hex { font-family: monospace; font-size: 13px; color: #909399; }
.preset-colors { display: flex; gap: 6px; margin-left: 8px; }
.color-dot {
  width: 24px; height: 24px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent; transition: all 0.2s;
}
.color-dot:hover { transform: scale(1.15); }
.color-dot.active { border-color: #303133; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #303133; }
.logo-upload { display: flex; align-items: center; gap: 12px; }
.logo-uploader :deep(.el-upload) { border: 1px dashed #dcdfe6; border-radius: 8px; overflow: hidden; cursor: pointer; }
.logo-preview { width: 80px; height: 80px; object-fit: contain; display: block; }
.logo-placeholder { width: 80px; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #909399; font-size: 12px; }
.form-tip { font-size: 12px; color: #909399; margin-top: 4px; line-height: 1.5; }
.slider-row { display: flex; align-items: center; gap: 8px; flex: 1; }
.slider-unit { font-size: 13px; color: #909399; white-space: nowrap; }
</style>
