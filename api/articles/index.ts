// /api/articles/index.ts

console.log('=== /api/articles/index.ts 开始加载 ===')
console.log('当前时间:', new Date().toISOString())
console.log('环境变量 SUPABASE_URL 存在:', !!process.env.SUPABASE_URL)

import { IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface RequestWithBody extends IncomingMessage {
  body?: any
}

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json')

  // GET - 获取文章列表
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      res.statusCode = 200
      res.end(JSON.stringify(data))
    } catch (error: any) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: error.message }))
    }
  }
  // POST - 创建新文章
  else if (req.method === 'POST') {
    try {
      const { title, content, summary, category, tags } = req.body
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            title,
            content,
            summary,
            category,
            tags,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      res.statusCode = 201
      res.end(JSON.stringify(data))
    } catch (error: any) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: error.message }))
    }
  } else {
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method not allowed' }))
  }
}
