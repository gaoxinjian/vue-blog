import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from './router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/index.scss'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 延迟执行认证初始化，避免与 Supabase 初始化冲突
// setTimeout(() => {
import('@/stores/auth').then(({ useAuthStore }) => {
  const authStore = useAuthStore()
  // 静默初始化，不处理错误
  authStore.initAuth().catch(() => {
    // 静默忽略初始化错误
  })
})
// }, 10)
app.mount('#app')
