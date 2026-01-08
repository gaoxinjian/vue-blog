import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type {
  Article,
  ArticleCreateDto,
  ArticleUpdateDto,
  PaginatedResponse,
  QueryParams,
} from '@/api/types'

export const useArticleStore = defineStore('article', () => {
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  // 获取文章列表
  const fetchArticles = async (params: QueryParams = {}) => {
    loading.value = true
    error.value = null

    try {
      const response: PaginatedResponse<Article> = await api.articles.getArticles(params)
      articles.value = response.data
      pagination.value = response.pagination
    } catch (err: any) {
      error.value = err.message || '获取文章列表失败'
      console.error('获取文章列表失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 获取单个文章
  const fetchArticle = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const article = await api.articles.getArticleById(id)
      currentArticle.value = article
    } catch (err: any) {
      error.value = err.message || '获取文章失败'
      console.error('获取文章失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 创建文章
  const createArticle = async (articleData: ArticleCreateDto): Promise<Article> => {
    loading.value = true
    error.value = null

    try {
      const newArticle = await api.articles.createArticle(articleData)
      articles.value.unshift(newArticle)
      return newArticle
    } catch (err: any) {
      error.value = err.message || '创建文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新文章
  const updateArticle = async (id: string, articleData: ArticleUpdateDto): Promise<Article> => {
    loading.value = true
    error.value = null

    try {
      const updatedArticle = await api.articles.updateArticle(id, articleData)

      // 更新列表中的文章
      const index = articles.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        articles.value[index] = updatedArticle
      }

      // 更新当前文章
      if (currentArticle.value?.id === id) {
        currentArticle.value = updatedArticle
      }

      return updatedArticle
    } catch (err: any) {
      error.value = err.message || '更新文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除文章
  const deleteArticle = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.articles.deleteArticle(id)

      // 从列表中移除
      articles.value = articles.value.filter((a) => a.id !== id)

      // 清除当前文章
      if (currentArticle.value?.id === id) {
        currentArticle.value = null
      }
    } catch (err: any) {
      error.value = err.message || '删除文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      categories.value = await api.articles.getCategories()
    } catch (err) {
      console.error('获取分类列表失败:', err)
    }
  }

  // 获取标签列表
  const fetchTags = async () => {
    try {
      tags.value = await api.articles.getTags()
    } catch (err) {
      console.error('获取标签列表失败:', err)
    }
  }

  // 搜索文章
  const searchArticles = async (keyword: string) => {
    return await fetchArticles({
      search: keyword,
      page: 1,
    })
  }

  // 重置状态
  const reset = () => {
    articles.value = []
    currentArticle.value = null
    categories.value = []
    tags.value = []
    error.value = null
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    }
  }

  return {
    // state
    articles,
    currentArticle,
    categories,
    tags,
    loading,
    error,
    pagination,

    // actions
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchCategories,
    fetchTags,
    searchArticles,
    reset,
  }
})
