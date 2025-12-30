// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户信息接口
interface User {
  id: number
  username: string
  email: string
  avatarUrl?: string
  bio?: string
  createdAt: string
}

// 定义Store
export const useUserStore = defineStore('user', () => {
  // 用户状态
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isInitialized = ref<boolean>(false)

  // 计算属性：是否已登录
  const isLogined = computed(() => !!user.value)
  const userInitial = computed(() => user.value?.username?.charAt(0).toUpperCase() || '')

  // Actions 业务逻辑
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (username: string, password: string) => {
    try {
      // 模拟api调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟返回数据
      const mockUser: User = {
        id: 1,
        username,
        email: `${username}@example.com`,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=${username}',
        bio: 'This is a mock user.',
        createdAt: new Date().toISOString(),
      }

      const mockToken = 'mock-jwt-token' + Date.now()

      // 设置用户信息和token
      user.value = mockUser
      token.value = mockToken

      // 保存到本地存储
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)

      return { success: true, user: mockUser, token: mockToken }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: '登录失败，请检查用户名和密码' }
    }
  }

  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const register = async (userData: { username: string; email: string; password: string }) => {
    try {
      // 模拟注册API
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newUser: User = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        createdAt: new Date().toISOString(),
      }

      const newToken = 'mock-jwt-token-' + Date.now()

      user.value = newUser
      token.value = newToken

      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, error: '注册失败，请稍后重试' }
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user.value) return { success: false, error: '用户未登录' }

    try {
      // 模拟更新API
      await new Promise((resolve) => setTimeout(resolve, 500))
      user.value = { ...user.value, ...profileData }
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true, user: user.value }
    } catch (error) {
      console.error('更新失败:', error)
      return { success: false, error: '更新失败' }
    }
  }

  // 初始化，从本地存储加载用户状态
  const initialize = () => {
    if (isInitialized.value) return

    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      } catch (error) {
        console.error('恢复用户状态失败:', error)
        // 清除无效数据
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    isInitialized.value = true
  }

  return {
    user,
    isLogined,
    isInitialized,
    userInitial,
    token,

    login,
    logout,
    register,
    updateProfile,
    initialize,
  }
})
