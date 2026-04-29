import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'paas_theme_settings'

const defaultTheme = {
  primaryColor: '#409eff',
  sidebarColor: '#001529',
  sidebarTextColor: '#ffffffa6',
  sidebarActiveColor: '#409eff',
  logoText: '云原生平台',
  logoImage: '',
  loginTitle: '云原生应用管理平台',
  loginSubtitle: 'Cloud-Native Application Management Platform',
  copyright: '© 2026 云原生应用管理平台 All Rights Reserved',
  enableCaptcha: true,
  enable2FA: false,
  // 桌面主题
  desktopTheme: 'light',
  contentBgColor: '#f0f2f5',
  headerBgColor: '#ffffff',
  headerTextColor: '#303133',
  cardBgColor: '#ffffff',
  cardShadow: true,
  borderRadius: 8,
  contentFontFamily: '',
  contentFontSize: 14
}

export const useThemeStore = defineStore('theme', () => {
  const settings = ref({ ...defaultTheme })

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        settings.value = { ...defaultTheme, ...parsed }
      }
    } catch (e) {
      console.error('加载主题设置失败', e)
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (e) {
      console.error('保存主题设置失败', e)
    }
  }

  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }
    saveSettings()
  }

  function resetSettings() {
    settings.value = { ...defaultTheme }
    saveSettings()
  }

  function applyTheme() {
    const root = document.documentElement
    root.style.setProperty('--el-color-primary', settings.value.primaryColor)
    root.style.setProperty('--content-bg', settings.value.contentBgColor)
    root.style.setProperty('--header-bg', settings.value.headerBgColor)
    root.style.setProperty('--header-text', settings.value.headerTextColor)
    root.style.setProperty('--card-bg', settings.value.cardBgColor)
    root.style.setProperty('--border-radius', `${settings.value.borderRadius}px`)
    if (settings.value.contentFontFamily) {
      root.style.setProperty('--content-font', settings.value.contentFontFamily)
    }
    if (settings.value.desktopTheme === 'dark') {
      root.classList.add('dark-theme')
    } else {
      root.classList.remove('dark-theme')
    }
  }

  watch(() => settings.value.primaryColor, () => applyTheme(), { immediate: true })
  watch(() => settings.value.desktopTheme, () => applyTheme())

  return { settings, loadSettings, saveSettings, updateSettings, resetSettings, applyTheme }
})
