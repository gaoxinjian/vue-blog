// /api/articles/[id].ts
import { IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'
import { parse } from 'url' // 用于解析查询参数

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface RequestWithBody extends IncomingMessage {
  body?: any
  query?: any
}

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json')

  // 解析 URL 获取查询参数，包括动态路由 [id]
  const parsedUrl = parse(req.url || '', true)
  const id = parsedUrl.query.id

  // GET - 获取单篇文章
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()

      if (error) throw error
      res.statusCode = 200
      res.end(JSON.stringify(data))
    } catch (error: any) {
      res.statusCode = error.code === 'PGRST116' ? 404 : 500
      res.end(
        JSON.stringify({
          error: error.code === 'PGRST116' ? 'Article not found' : error.message,
        }),
      )
    }
  }
  // PUT - 更新文章
  else if (req.method === 'PUT') {
    try {
      const { title, content, summary, category, tags } = req.body
      const { data, error } = await supabase
        .from('articles')
        .update({
          title,
          content,
          summary,
          category,
          tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      res.statusCode = 200
      res.end(JSON.stringify(data))
    } catch (error: any) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: error.message }))
    }
  }
  // DELETE - 删除文章
  else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id)

      if (error) throw error
      res.statusCode = 204 // 成功，无内容返回
      res.end()
    } catch (error: any) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: error.message }))
    }
  } else {
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method not allowed' }))
  }
}
