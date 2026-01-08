// test-simple.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  try {
    console.log('\n1. 尝试创建客户端并查询...')
    const { data, error } = await supabase.from('articles').select('*').limit(1)

    if (error) {
      console.error('❌ 查询失败:')
      console.error('   错误信息:', error.message)
      console.error('   提示:', error.hint || '无')
      // 特定错误判断
      if (error.message.includes('JWT')) {
        console.error('   ⚠️ 错误类型: 密钥无效或格式错误')
      }
    } else {
      console.log('✅ 查询成功！')
      console.log('   数据:', data)
    }
  } catch (err) {
    console.error('❌ 客户端创建或网络错误:', err.message)
  }
}

test()
