<!-- src/components/common/ArticleCard.vue -->
<template>
  <el-card
    class="article-card"
    :body-style="{ padding: '20px' }"
    shadow="hover"
    @click="$emit('click')"
  >
    <!-- 文章封面 -->
    <div v-if="article.coverImage" class="article-cover">
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="cover-image"
        @error="handleImageError"
      />
    </div>

    <!-- 文章内容 -->
    <div class="article-content">
      <!-- 分类标签 -->
      <div class="article-category">
        <el-tag size="small" effect="plain">
          {{ article.category }}
        </el-tag>
      </div>

      <!-- 标题 -->
      <h3 class="article-title">
        {{ article.title }}
      </h3>

      <!-- 摘要 -->
      <p class="article-summary">
        {{ article.summary }}
      </p>

      <!-- 标签 -->
      <div class="article-tags">
        <el-tag
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag"
          size="small"
          type="info"
          effect="plain"
          class="tag"
        >
          {{ tag }}
        </el-tag>
        <span v-if="article.tags.length > 3" class="more-tags">
          +{{ article.tags.length - 3 }}
        </span>
      </div>

      <!-- 元信息 -->
      <div class="article-meta">
        <div class="meta-left">
          <div class="author-info">
            <el-avatar :size="24" :src="getAvatarUrl(article.author)">
              {{ article.author.charAt(0) }}
            </el-avatar>
            <span class="author-name">{{ article.author }}</span>
          </div>

          <div class="meta-divider">·</div>

          <span class="meta-date">
            {{ formatDate(article.createdAt) }}
          </span>
        </div>

        <div class="meta-right">
          <!-- 阅读量 -->
          <div class="meta-item" @click.stop>
            <el-icon><View /></el-icon>
            <span>{{ formatNumber(article.views) }}</span>
          </div>

          <!-- 点赞 -->
          <div class="meta-item" @click.stop="$emit('like')">
            <el-icon :class="{ liked: isLiked }"><Star /></el-icon>
            <span>{{ formatNumber(article.likes) }}</span>
          </div>

          <!-- 评论 -->
          <div class="meta-item" @click.stop>
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ formatNumber(article.comments) }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ArticleState } from '@/stores/article'
import { View, Star, ChatDotRound } from '@element-plus/icons-vue'

interface Props {
  article: ArticleState
}

defineProps<Props>()
defineEmits<{
  click: []
  like: []
}>()

const isLiked = ref(false)

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src =
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
}

const getAvatarUrl = (author: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped>
.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-box-shadow-dark);
}

.article-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .cover-image {
  transform: scale(1.05);
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-category {
  margin-bottom: 12px;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--el-text-color-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-summary {
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  font-size: 0.75rem;
}

.more-tags {
  font-size: 0.75rem;
  color: var(--el-text-color-secondary);
  margin-left: 4px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 0.875rem;
  color: var(--el-text-color-primary);
}

.meta-divider {
  color: var(--el-text-color-placeholder);
}

.meta-date {
  font-size: 0.75rem;
  color: var(--el-text-color-secondary);
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.meta-item:hover {
  color: var(--el-color-primary);
}

.meta-item .el-icon {
  font-size: 1rem;
}

.meta-item .el-icon.liked {
  color: #ff6b6b;
  animation: like 0.5s ease;
}

@keyframes like {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-cover {
    height: 160px;
  }

  .article-title {
    font-size: 1.1rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .meta-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
