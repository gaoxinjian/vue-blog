// src/stores/theme.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement
    const body = document.body

    if (dark) {
      html.classList.add('dark')
      body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark.value = true
    }

    applyTheme(isDark.value)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme(isDark.value)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  return {
    isDark,
    toggleTheme,
    applyTheme,
    initTheme,
  }
})
