// 重新导出所有 API 函数
export * from './articles'
export * from './auth'

// 组合 API
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
  getTags,
  getArticlesByCategory,
  getArticlesByTag,
} from './articles'

import { login, logout, getCurrentUser, checkAuth, refreshSession } from './auth'

export const api = {
  articles: {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getCategories,
    getTags,
    getArticlesByCategory,
    getArticlesByTag,
  },
  auth: {
    login,
    logout,
    getCurrentUser,
    checkAuth,
    refreshSession,
  },
}

export default api
