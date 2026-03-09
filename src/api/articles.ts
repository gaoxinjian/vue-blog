import { supabase } from '@/lib/supabase'
import type {
  Article,
  ArticleCreateDto,
  ArticleUpdateDto,
  PaginatedResponse,
  QueryParams,
  Categories,
} from './types'
// import { un } from 'vue-router/dist/router-CWoNjPRp.mjs'

// 获取文章列表
export const getArticles = async (
  params: QueryParams = {},
): Promise<PaginatedResponse<Article>> => {
  const {
    page = 1,
    pageSize = 10,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
    category,
    tag,
  } = params

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // 构建查询
  let query = supabase.from('articles').select('*, categories(id, content)', { count: 'exact' })

  // 应用筛选条件
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  // 排序
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // 分页
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('获取文章列表失败:', error)
    throw error
  }

  const total = count || 0

  // 处理分类详情，我感觉这里不处理也没问题，但是先不管这个
  const articles = data.map((article) => ({
    ...article,
    category_detail: article.categories || null,
  })) as Article[]

  return {
    data: articles as Article[],
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNext: to + 1 < total,
      hasPrev: page > 1,
    },
  }
}

// 获取单个文章
export const getArticleById = async (id: string): Promise<Article> => {
  const { data, error } = await supabase.from('articles').select('*, categories(id, content)').eq('id', id).single()

  if (error) {
    console.error(`获取文章 ${id} 失败:`, error)
    throw error
  }

  return data as Article
}

// 创建文章
export const createArticle = async (articleData: ArticleCreateDto): Promise<Article> => {
  const now = new Date().toISOString()

  // 准备插入数据
  const insertData = {
    title: articleData.title,
    content: articleData.content,
    excerpt: articleData.excerpt,
    cover_image: articleData.cover_image || null,
    category: articleData.category,
    tags: articleData.tags || [],
    is_published: articleData.is_published || false,
    created_at: now,
    updated_at: now,
  }

  const { data, error } = await supabase.from('articles').insert(insertData).select().single()

  if (error) {
    console.error('创建文章失败:', error)
    throw error
  }

  return data as Article
}

// 更新文章
export const updateArticle = async (
  id: string,
  articleData: ArticleUpdateDto,
): Promise<Article> => {
  const now = new Date().toISOString()

  // 准备更新数据
  const updateData: any = {
    updated_at: now,
  }

  // 只更新提供的字段
  if (articleData.title !== undefined) updateData.title = articleData.title
  if (articleData.content !== undefined) updateData.content = articleData.content
  if (articleData.excerpt !== undefined) updateData.excerpt = articleData.excerpt
  if (articleData.cover_image !== undefined) updateData.cover_image = articleData.cover_image
  if (articleData.category !== undefined) updateData.category = articleData.category
  if (articleData.tags !== undefined) updateData.tags = articleData.tags

  if (articleData.is_published !== undefined) {
    updateData.is_published = articleData.is_published
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`更新文章 ${id} 失败:`, error)
    throw error
  }

  return data as Article
}

// 删除文章
export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) {
    console.error(`删除文章 ${id} 失败:`, error)
    throw error
  }
}

// 获取所有分类
export const getCategories = async (): Promise<Categories[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    console.error('获取分类列表失败:', error)
    throw error
  }


  // 类型断言并去重
  const categories = data as { id: number; content: string }[]
  const newdata = Array.from(new Set(categories))
  return newdata
}

// 获取所有标签
export const getTags = async (): Promise<string[]> => {
  const { data, error } = await supabase.from('articles').select('tags').eq('is_published', true)

  if (error) {
    console.error('获取标签列表失败:', error)
    throw error
  }

  // 类型断言并合并所有标签
  const articles = data as { tags: string[] }[]
  const allTags = articles.flatMap((item) => item.tags || [])
  return [...new Set(allTags)]
}

// 根据分类获取文章
export const getArticlesByCategory = async (
  category: number | undefined,
  params: Omit<QueryParams, 'category'> = {},
): Promise<PaginatedResponse<Article>> => {
  return getArticles({
    ...params,
    category,
  })
}

// 根据标签获取文章
export const getArticlesByTag = async (
  tag: string,
  params: Omit<QueryParams, 'tag'> = {},
): Promise<PaginatedResponse<Article>> => {
  return getArticles({
    ...params,
    tag,
  })
}
