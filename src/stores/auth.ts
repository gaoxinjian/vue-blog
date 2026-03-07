import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import { supabase } from '@/lib/supabase'
import type { User } from '@/api/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')

  // 初始化认证状态
  const initAuth = async () => {
    try {
      const currentUser = await api.auth.getCurrentUser()
      user.value = currentUser
    } catch (err) {
      console.error('初始化认证状态失败:', err)
      user.value = null
    }
  }

  // 登录
  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const authResponse = await api.auth.login({ email, password })

      user.value = {
        id: authResponse.user.id,
        email: authResponse.user.email,
        display_name: authResponse.user.display_name || authResponse.user.email?.split('@')[0] || 'User',
      }

      error.value = null
      return true
    } catch (err: any) {
      error.value = err.message || '登录失败'
      console.error('登录失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async (): Promise<boolean> => {
    try {
      await api.auth.logout()
      user.value = null
      error.value = null
      return true
    } catch (err: any) {
      error.value = err.message || '登出失败'
      console.error('登出失败:', err)
      return false
    }
  }

  // 检查认证状态
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const isAuth = await api.auth.checkAuth()

      if (!isAuth) {
        user.value = null
      }

      return isAuth
    } catch (err) {
      console.error('检查认证状态失败:', err)
      user.value = null
      return false
    }
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('认证状态变化:', event)

    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
      user.value = {
        id: session.user.id,
        email: session.user.email!,
        display_name: session.user.user_metadata.display_name || session.user.email?.split('@')[0] || '游客',
      }
    } else if (event === 'SIGNED_OUT') {
      user.value = null
    }
  })

  return {
    // state
    user,
    loading,
    error,

    // getters
    isAuthenticated,
    userEmail,

    // actions
    initAuth,
    login,
    logout,
    checkAuthStatus,
  }
})
