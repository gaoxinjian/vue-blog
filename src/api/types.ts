// 基础实体类型
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// 文章相关 - 与数据库表结构完全匹配
export interface Article extends BaseEntity {
  title: string
  content: string
  excerpt: string
  cover_image: string | null
  category: string | null
  tags: string[]
  is_published: boolean
}

export interface ArticleCreateDto {
  title: string
  content: string
  excerpt: string
  cover_image?: string | null
  category?: string | null
  tags?: string[]
  is_published?: boolean
}

export interface ArticleUpdateDto extends Partial<ArticleCreateDto> {
  id: string
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 查询参数
export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: 'created_at' | 'updated_at' | 'title'
  sortOrder?: 'asc' | 'desc'
  category?: string
  tag?: string
  published?: boolean
}

// 认证相关
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
  }
  session: {
    access_token: string
    refresh_token: string
  }
}

// 用户信息
export interface User {
  id: string
  email: string
}
