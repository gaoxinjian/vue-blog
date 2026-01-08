import { createPinia } from 'pinia'
import { useArticleStore } from './article'
import { useAuthStore } from './auth'

const pinia = createPinia()

export { useArticleStore, useAuthStore }
export default pinia
