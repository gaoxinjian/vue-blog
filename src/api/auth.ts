import { supabase } from '@/lib/supabase'
import type { LoginCredentials, AuthResponse, User } from './types'

// 登录
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (error) throw error

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
  }
}

// 登出
export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 获取当前用户 - 使用更安全的方法
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // 先检查会话
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.warn('获取会话失败:', sessionError)
      return null
    }

    // 没有会话则返回 null
    if (!session) {
      return null
    }

    // 使用会话中的用户信息，而不是调用 getUser
    return {
      id: session.user.id,
      email: session.user.email!,
    }
  } catch (err) {
    console.warn('获取当前用户失败（忽略错误）:', err)
    return null
  }
}

// 检查是否已登录
export const checkAuth = async (): Promise<boolean> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return !!session
  } catch (err) {
    console.warn('检查登录状态失败:', err)
    return false
  }
}

// 刷新 session
export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.warn('刷新 session 失败:', error)
      return false
    }

    return !!data.session
  } catch (err) {
    console.warn('刷新 session 异常:', err)
    return false
  }
}
