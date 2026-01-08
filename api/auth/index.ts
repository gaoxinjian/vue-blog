// /api/auth/login.ts
import { IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'
// 使用 Node.js 原生类型定义请求和响应
interface RequestWithBody extends IncomingMessage {
  body?: any
}

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 关键修改：使用 Node.js 原生函数签名
export default async function handler(req: RequestWithBody, res: ServerResponse) {
  // 设置响应头为 JSON
  res.setHeader('Content-Type', 'application/json')

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    res.statusCode = 405
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  try {
    // 关键：读取请求体，Vercel 环境会自动解析，我们直接使用
    const { email, password } = req.body

    // 1. 使用Supabase Auth进行登录
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      res.statusCode = 401
      return res.end(JSON.stringify({ error: 'Invalid credentials' }))
    }

    // 2. 登录成功
    res.statusCode = 200
    res.end(
      JSON.stringify({
        user: data.user,
        session: data.session,
        message: 'Login successful',
      }),
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Internal server error' }))
  }
}
