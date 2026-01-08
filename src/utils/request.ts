import axios from 'axios'

// 创建 axios 实例（可选，如果你的 Vercel API 需要）
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token（Supabase 会自动管理）
    const token = localStorage.getItem('sb-access-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API 请求错误:', error)
    return Promise.reject(error)
  },
)

export default request
