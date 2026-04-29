import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '../store/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.classList.remove('dark-theme')
    document.documentElement.style.cssText = ''
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark-theme')
    document.documentElement.style.cssText = ''
  })

  describe('初始状态', () => {
    it('应使用默认主题值初始化', () => {
      const store = useThemeStore()
      expect(store.settings.primaryColor).toBe('#409eff')
      expect(store.settings.sidebarColor).toBe('#001529')
      expect(store.settings.desktopTheme).toBe('light')
      expect(store.settings.contentBgColor).toBe('#f0f2f5')
      expect(store.settings.headerBgColor).toBe('#ffffff')
      expect(store.settings.headerTextColor).toBe('#303133')
      expect(store.settings.cardBgColor).toBe('#ffffff')
      expect(store.settings.cardShadow).toBe(true)
      expect(store.settings.borderRadius).toBe(8)
      expect(store.settings.contentFontFamily).toBe('')
      expect(store.settings.contentFontSize).toBe(14)
      expect(store.settings.copyright).toBe('© 2026 云原生应用管理平台 All Rights Reserved')
    })
  })

  describe('loadSettings', () => {
    it('应从 localStorage 加载已保存的设置', () => {
      const saved = {
        primaryColor: '#ff0000',
        desktopTheme: 'dark',
        contentBgColor: '#1a1a1a'
      }
      localStorage.setItem('paas_theme_settings', JSON.stringify(saved))

      const store = useThemeStore()
      store.loadSettings()

      expect(store.settings.primaryColor).toBe('#ff0000')
      expect(store.settings.desktopTheme).toBe('dark')
      expect(store.settings.contentBgColor).toBe('#1a1a1a')
    })

    it('应在 localStorage 为空时保持默认值', () => {
      const store = useThemeStore()
      store.loadSettings()
      expect(store.settings.primaryColor).toBe('#409eff')
    })

    it('应在 localStorage 数据无效时捕获错误并保持默认值', () => {
      localStorage.setItem('paas_theme_settings', 'invalid-json{')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const store = useThemeStore()
      store.loadSettings()

      expect(consoleSpy).toHaveBeenCalled()
      expect(store.settings.primaryColor).toBe('#409eff')

      consoleSpy.mockRestore()
    })
  })

  describe('saveSettings', () => {
    it('应将设置保存到 localStorage', () => {
      const store = useThemeStore()
      store.settings.primaryColor = '#00ff00'
      store.saveSettings()

      const saved = JSON.parse(localStorage.getItem('paas_theme_settings'))
      expect(saved.primaryColor).toBe('#00ff00')
    })

    it('应在 localStorage 不可用时捕获错误', () => {
      const store = useThemeStore()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      store.saveSettings()

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
      Storage.prototype.setItem.mockRestore()
    })
  })

  describe('updateSettings', () => {
    it('应合并新设置并保存', () => {
      const store = useThemeStore()
      store.updateSettings({ primaryColor: '#123456', desktopTheme: 'dark' })

      expect(store.settings.primaryColor).toBe('#123456')
      expect(store.settings.desktopTheme).toBe('dark')

      const saved = JSON.parse(localStorage.getItem('paas_theme_settings'))
      expect(saved.primaryColor).toBe('#123456')
      expect(saved.desktopTheme).toBe('dark')
    })

    it('应保留未修改的设置', () => {
      const store = useThemeStore()
      store.updateSettings({ primaryColor: '#abcdef' })

      expect(store.settings.sidebarColor).toBe('#001529')
      expect(store.settings.logoText).toBe('云原生平台')
    })
  })

  describe('resetSettings', () => {
    it('应恢复所有设置为默认值', () => {
      const store = useThemeStore()
      store.updateSettings({
        primaryColor: '#ff0000',
        desktopTheme: 'dark',
        contentBgColor: '#000000',
        borderRadius: 20
      })

      store.resetSettings()

      expect(store.settings.primaryColor).toBe('#409eff')
      expect(store.settings.desktopTheme).toBe('light')
      expect(store.settings.contentBgColor).toBe('#f0f2f5')
      expect(store.settings.borderRadius).toBe(8)
    })

    it('重置后应保存到 localStorage', () => {
      const store = useThemeStore()
      store.updateSettings({ primaryColor: '#ff0000' })
      store.resetSettings()

      const saved = JSON.parse(localStorage.getItem('paas_theme_settings'))
      expect(saved.primaryColor).toBe('#409eff')
    })
  })

  describe('applyTheme', () => {
    it('应设置所有 CSS 变量', () => {
      const store = useThemeStore()
      store.applyTheme()

      const root = document.documentElement
      expect(root.style.getPropertyValue('--el-color-primary')).toBe('#409eff')
      expect(root.style.getPropertyValue('--content-bg')).toBe('#f0f2f5')
      expect(root.style.getPropertyValue('--header-bg')).toBe('#ffffff')
      expect(root.style.getPropertyValue('--header-text')).toBe('#303133')
      expect(root.style.getPropertyValue('--card-bg')).toBe('#ffffff')
      expect(root.style.getPropertyValue('--border-radius')).toBe('8px')
    })

    it('浅色主题应移除 dark-theme class', () => {
      const store = useThemeStore()
      store.settings.desktopTheme = 'light'
      store.applyTheme()

      expect(document.documentElement.classList.contains('dark-theme')).toBe(false)
    })

    it('深色主题应添加 dark-theme class', () => {
      const store = useThemeStore()
      store.settings.desktopTheme = 'dark'
      store.applyTheme()

      expect(document.documentElement.classList.contains('dark-theme')).toBe(true)
    })

    it('从深色切换到浅色应移除 dark-theme class', () => {
      const store = useThemeStore()
      store.settings.desktopTheme = 'dark'
      store.applyTheme()
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true)

      store.settings.desktopTheme = 'light'
      store.applyTheme()
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false)
    })

    it('设置了 contentFontFamily 时应设置 --content-font 变量', () => {
      const store = useThemeStore()
      store.settings.contentFontFamily = 'Arial, sans-serif'
      store.applyTheme()

      expect(document.documentElement.style.getPropertyValue('--content-font')).toBe('Arial, sans-serif')
    })

    it('contentFontFamily 为空时不应设置 --content-font 变量', () => {
      const store = useThemeStore()
      store.settings.contentFontFamily = ''
      store.applyTheme()

      expect(document.documentElement.style.getPropertyValue('--content-font')).toBe('')
    })

    it('应使用自定义值更新 CSS 变量', () => {
      const store = useThemeStore()
      store.settings.primaryColor = '#ff0000'
      store.settings.contentBgColor = '#1a1a1a'
      store.settings.borderRadius = 16
      store.applyTheme()

      const root = document.documentElement
      expect(root.style.getPropertyValue('--el-color-primary')).toBe('#ff0000')
      expect(root.style.getPropertyValue('--content-bg')).toBe('#1a1a1a')
      expect(root.style.getPropertyValue('--border-radius')).toBe('16px')
    })
  })

  describe('watch 自动触发', () => {
    it('primaryColor 变更应自动调用 applyTheme', () => {
      const store = useThemeStore()
      store.settings.primaryColor = '#ff0000'

      // 由于 watch 是异步的，需要等待下一个 tick
      return new Promise(resolve => setTimeout(() => {
        expect(document.documentElement.style.getPropertyValue('--el-color-primary')).toBe('#ff0000')
        resolve()
      }, 50))
    })

    it('desktopTheme 变更应自动调用 applyTheme', () => {
      const store = useThemeStore()
      store.settings.desktopTheme = 'dark'

      return new Promise(resolve => setTimeout(() => {
        expect(document.documentElement.classList.contains('dark-theme')).toBe(true)
        resolve()
      }, 50))
    })
  })
})
