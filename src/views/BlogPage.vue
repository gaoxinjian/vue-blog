<!-- src/views/BlogPage.vue -->
<template>
  <div class="blog-page">
    <div class="blog-container">
      <!-- 侧边栏筛选区 -->
      <aside class="sidebar">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索文章..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
            @clear="handleSearch"
          />
        </div>

        <!-- 分类筛选 -->
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <el-icon><Folder /></el-icon>
              <span>文章分类</span>
            </div>
          </template>
          <div class="filter-content">
            <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-card>

        <!-- 标签筛选 -->
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <el-icon><PriceTag /></el-icon>
              <span>热门标签</span>
            </div>
          </template>
          <div class="filter-content tags">
            <el-tag
              v-for="tag in allTags"
              :key="tag"
              :type="selectedTag === tag ? 'primary' : 'info'"
              class="tag-item"
              @click="handleTagClick(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-card>

        <!-- 热门文章 -->
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <el-icon><PriceTag /></el-icon>
              <span>热门文章</span>
            </div>
          </template>
          <div class="popular-articles">
            <div
              v-for="article in popularArticles"
              :key="article.id"
              class="popular-article"
              @click="goToArticle(article.id)"
            >
              <div class="popular-article-content">
                <h4 class="popular-article-title">{{ article.title }}</h4>
                <div class="popular-article-meta">
                  <span>{{ formatDate(article.createdAt) }}</span>
                  <span>·</span>
                  <span>{{ article.views }} 阅读</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 筛选状态显示 -->
        <div v-if="hasActiveFilters" class="active-filters">
          <el-tag v-if="selectedCategory" closable @close="clearCategory">
            分类: {{ selectedCategory }}
          </el-tag>
          <el-tag v-if="selectedTag" closable @close="clearTag"> 标签: {{ selectedTag }} </el-tag>
          <el-button v-if="hasActiveFilters" type="text" size="small" @click="clearAllFilters">
            清除所有筛选
          </el-button>
        </div>

        <!-- 文章列表 -->
        <div class="articles-grid">
          <template v-if="filteredArticles.length > 0">
            <article-card
              v-for="article in paginatedArticles"
              :key="article.id"
              :article="article"
              @click="goToArticle(article.id)"
              @like="handleLike(article.id)"
            />
          </template>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <el-empty description="暂无相关文章">
              <el-button type="primary" @click="clearAllFilters"> 清除筛选条件 </el-button>
            </el-empty>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="filteredArticles.length > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[6, 12, 24, 48]"
            :total="filteredArticles.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading">
          <el-skeleton :rows="6" animated />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useArticleStore, type ArticleState } from '@/stores/article'
import ArticleCard from '@/components/common/ArticleCard.vue'
import { Search, Folder, PriceTag } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

const router = useRouter()
const articleStore = useArticleStore()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const pageSize = ref(6)

// 从store中获取数据
const { isLoading, filteredArticles, categories, allTags } = storeToRefs(articleStore)

const { fetchArticles, likeArticle } = articleStore

// 计算属性
const hasActiveFilters = computed(() => {
  return selectedCategory.value !== '' || selectedTag.value !== '' || searchQuery.value !== ''
})

const popularArticles = computed(() => {
  return [...filteredArticles.value].sort((a, b) => b.views - a.views).slice(0, 5)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

// 方法
const handleSearch = () => {
  articleStore.searchQuery = searchQuery.value
  currentPage.value = 1
}

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category
  articleStore.selectedCategory = category
  currentPage.value = 1
}

const handleTagClick = (tag: string) => {
  selectedTag.value = tag === selectedTag.value ? '' : tag
  articleStore.selectedTag = selectedTag.value
  currentPage.value = 1
}

const clearCategory = () => {
  selectedCategory.value = ''
  articleStore.selectedCategory = ''
  currentPage.value = 1
}

const clearTag = () => {
  selectedTag.value = ''
  articleStore.selectedTag = ''
  currentPage.value = 1
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedTag.value = ''
  articleStore.resetFilters()
  currentPage.value = 1
}

const handleLike = async (articleId: number) => {
  try {
    await likeArticle(articleId)
    ElMessage.success('点赞成功！')
  } catch (error) {
    ElMessage.error('点赞失败' + (error as Error).message)
  }
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 生命周期
onMounted(async () => {
  console.log('blog page mounted')

  await fetchArticles()
  // 从store同步筛选状态
  searchQuery.value = articleStore.searchQuery
  selectedCategory.value = articleStore.selectedCategory
  selectedTag.value = articleStore.selectedTag
})
</script>

<style scoped>
.blog-page {
  padding: 20px 0 40px;
}

.blog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-box {
  margin-bottom: 10px;
}

.filter-card {
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--el-box-shadow-dark);
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.filter-header .el-icon {
  color: var(--el-color-primary);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-content.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.tag-item:hover {
  transform: scale(1.05);
}

.popular-articles {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popular-article {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.popular-article:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-border-color);
  transform: translateX(4px);
}

.popular-article-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.popular-article-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-article-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

/* 主内容区样式 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 0;
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 12px;
}

.active-filters .el-tag {
  font-size: 0.9rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.pagination {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color);
}

.loading {
  padding: 40px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .blog-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .filter-card:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
