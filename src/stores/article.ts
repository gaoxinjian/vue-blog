import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { A } from 'vue-router/dist/router-CWoNjPRp.mjs'

// 文章状态接口
export interface ArticleState {
  id: number
  title: string
  content: string
  summary: string
  author: string
  authorId: number
  category: string
  tags: string[]
  coverImage?: string
  views: number
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
  isPublished: boolean
}

// 文章查询参数接口
export interface ArticleQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  tag?: string
  authorId?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'likes'
  order?: 'asc' | 'desc'
}

// 定义Store
export const useArticleStore = defineStore('article', () => {
  const articles = ref<ArticleState[]>([])
  const currentArticle = ref<ArticleState | null>(null)
  const totalArticles = ref(0)
  const isLoading = ref(false)
  const limit = ref(10)
  const page = ref(1)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedTag = ref('')

  // 模拟数据
  const mockArticles: ArticleState[] = [
    {
      id: 1,
      title: 'Vue3 组合式 API 完全指南',
      content: '# Vue3 组合式 API\n\n内容...',
      summary: '本文详细介绍 Vue3 组合式 API 的核心概念和使用技巧，帮助你快速上手 Vue3 开发。',
      author: '张三',
      authorId: 1,
      category: '前端开发',
      tags: ['Vue3', 'TypeScript', '前端'],
      coverImage:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1234,
      likes: 89,
      comments: 24,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      isPublished: true,
    },
    {
      id: 2,
      title: 'TypeScript 类型系统深入解析',
      content: '# TypeScript 类型系统\n\n内容...',
      summary: '深入理解 TypeScript 的类型系统，掌握高级类型技巧，提升代码质量和开发效率。',
      author: '李四',
      authorId: 2,
      category: 'TypeScript',
      tags: ['TypeScript', '类型系统', '教程'],
      coverImage:
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 856,
      likes: 67,
      comments: 18,
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      isPublished: true,
    },
    {
      id: 3,
      title: 'Vite vs Webpack：现代构建工具对比',
      content: '# Vite vs Webpack\n\n内容...',
      summary: '对比 Vite 和 Webpack 的优缺点，帮助你选择适合项目的构建工具。',
      author: '王五',
      authorId: 3,
      category: '构建工具',
      tags: ['Vite', 'Webpack', '构建工具'],
      coverImage:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 945,
      likes: 72,
      comments: 32,
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      isPublished: true,
    },
    {
      id: 4,
      title: 'Pinia 状态管理最佳实践',
      content: '# Pinia 状态管理\n\n内容...',
      summary: '学习 Pinia 状态管理的核心概念和最佳实践，构建可维护的大型应用。',
      author: '张三',
      authorId: 1,
      category: '状态管理',
      tags: ['Pinia', 'Vue3', '状态管理'],
      coverImage:
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 712,
      likes: 58,
      comments: 15,
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      isPublished: true,
    },
    {
      id: 5,
      title: 'Element Plus 组件库使用技巧',
      content: '# Element Plus\n\n内容...',
      summary: '掌握 Element Plus 组件库的高级用法和自定义技巧，提升开发效率。',
      author: '李四',
      authorId: 2,
      category: 'UI框架',
      tags: ['Element Plus', 'UI', '组件库'],
      coverImage:
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 623,
      likes: 45,
      comments: 12,
      createdAt: '2024-01-11T11:20:00Z',
      updatedAt: '2024-01-11T11:20:00Z',
      isPublished: true,
    },
  ]

  const totalPages = computed(() => {
    return Math.ceil(totalArticles.value / limit.value)
  })

  const filteredArticles = computed(() => {
    let filtered = [...articles.value]

    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // 分类过滤
    if (selectedCategory.value) {
      filtered = filtered.filter((article) => article.category === selectedCategory.value)
    }

    // 标签过滤
    if (selectedTag.value) {
      filtered = filtered.filter((article) => article.tags.includes(selectedTag.value))
    }

    return filtered
  })

  const categories = computed(() => {
    const cats = new Set(articles.value.map((article) => article.category))
    return Array.from(cats)
  })

  const allTags = computed(() => {
    const tags = new Set<string>()
    articles.value.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  })

  // Actions
  const fetchArticles = async (params?: ArticleQueryParams) => {
    isLoading.value = true

    try {
      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 应用查询参数
      if (params?.search) searchQuery.value = params.search
      if (params?.category) selectedCategory.value = params.category
      if (params?.tag) selectedTag.value = params.tag
      if (params?.page) page.value = params.page
      if (params?.limit) limit.value = params.limit

      // 这里应该从API获取数据，暂时使用模拟数据
      articles.value = mockArticles
      totalArticles.value = mockArticles.length
    } finally {
      isLoading.value = false
    }
  }

  const fetchArticleById = async (id: number) => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const article = mockArticles.find((article) => article.id === id)
      if (article) {
        currentArticle.value = article
        // 模拟增加浏览量
        article.views += 1
      }
      return article || null
    } finally {
      isLoading.value = false
    }
  }

  const createArticle = async (
    articleData: Omit<
      ArticleState,
      'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'
    >,
  ) => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newArticle: ArticleState = {
        ...articleData,
        id: articles.value.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: 0,
      }
      articles.value.push(newArticle)
      totalArticles.value += 1
      return newArticle
    } finally {
      isLoading.value = false
    }
  }

  const updateArticle = async (
    id: number,
    articleData: {
      title?: string
      content?: string
      summary?: string
      category?: string
      tags?: string[]
      coverImage?: string
      isPublished?: boolean
    },
  ) => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const index = articles.value.findIndex((article) => article.id === id)
      if (index !== -1 && articles.value[index]) {
        const article = articles.value[index]
        const updatedArticle = {
          ...article,
          ...articleData,
          id: article.id,
          updatedAt: new Date().toISOString(),
        }

        articles.value[index] = updatedArticle
        return updatedArticle
      } else {
        throw new Error('文章未找到')
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteArticle = async (id: number) => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const index = articles.value.findIndex((article) => article.id === id)
      if (index !== -1) {
        articles.value.splice(index, 1)
        totalArticles.value -= 1

        if (currentArticle.value?.id === id) {
          currentArticle.value = null
        }

        return true
      } else {
        throw new Error('文章未找到')
      }
    } finally {
      isLoading.value = false
    }
  }

  const likeArticle = async (id: number) => {
    const article = articles.value.find((article) => article.id === id)
    if (article) {
      article.likes += 1
      return article.likes
    }
    return 0
  }

  // 重置筛选
  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
    selectedTag.value = ''
    page.value = 1
  }

  return {
    articles,
    currentArticle,
    totalArticles,
    isLoading,
    limit,

    page,
    searchQuery,
    selectedCategory,
    selectedTag,
    totalPages,
    filteredArticles,
    categories,
    allTags,
    fetchArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    resetFilters,
  }
})
