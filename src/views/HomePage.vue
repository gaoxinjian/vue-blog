<!-- src/views/HomePage.vue -->
<template>
  <div class="home-container">
    <!-- 2. 主要内容区域 (左右两栏) -->
    <el-row :gutter="30" class="main-content">
      <!-- 左栏：智能文章流 (较宽) -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <section class="section-card">
          <h2>
            <el-icon><Collection /></el-icon> 最新动态
          </h2>
          <!-- 智能文章流列表将在这里渲染 -->
          <div class="article-flow">
            <article-card
              v-for="article in paginatedArticles"
              :key="article.id"
              :article="article"
              class="article-card"
              @click="goToArticle(article.id)"
            />
          </div>
        </section>
      </el-col>

      <!-- 右栏：侧边导航与信息 (较窄) -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <!-- a. 兴趣入口导航 -->
        <section class="section-card interest-nav">
          <h2>
            <el-icon><Grid /></el-icon> 探索我的世界
          </h2>
          <el-row :gutter="20">
            <el-col :span="12" v-for="nav in interestNavs" :key="nav.id">
              <router-link :to="nav.path" class="nav-link">
                <div class="nav-card">
                  <el-icon size="24" class="nav-icon"><component :is="nav.icon" /></el-icon>
                  <span class="nav-text">{{ nav.text }}</span>
                </div>
              </router-link>
            </el-col>
          </el-row>
        </section>

        <!-- b. 音乐播放器 -->
        <section class="section-card music-player">
          <h2><el-icon></el-icon> 此刻听觉</h2>
          <!-- 播放器组件将放在这里 -->
          <div class="player-placeholder">播放器组件待接入</div>
          <h3>我喜欢的歌</h3>
          <ul class="playlist">
            <li v-for="song in playlist" :key="song.id">{{ song.name }} - {{ song.artist }}</li>
          </ul>
        </section>

        <!-- c. “此刻我在...” -->
        <section class="section-card current-status">
          <h2>
            <el-icon><Promotion /></el-icon> 此刻我在
          </h2>
          <p>{{ currentStatus.text }}</p>
          <small class="update-time">{{ currentStatus.updateTime }}</small>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import {
  Collection,
  Grid,
  /* Headphone */
  Promotion,
  Reading,
  Headset,
  Place,
  MapLocation,
} from '@element-plus/icons-vue'
import ArticleCard from '@/components/common/ArticleCard.vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '@/stores/article'
import { useRouter } from 'vue-router'

const router = useRouter()
const articleStore = useArticleStore()
const { filteredArticles } = storeToRefs(articleStore)
const { fetchArticles } = articleStore
const pageSize = ref(6)
const currentPage = ref(1)

// --- 兴趣导航数据 ---
const interestNavs = ref([
  { id: 1, text: '阅读角落', path: '/', icon: Reading },
  { id: 2, text: '音乐空间', path: '/', icon: Headset },
  { id: 3, text: '旅行纪行', path: '/', icon: Place },
  { id: 4, text: '徒步日志', path: '/', icon: MapLocation },
])

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  // return filteredArticles.value.slice(start, end)
  return (filteredArticles.value || []).slice(start, end)
})

// --- 音乐播放列表数据 (示例) ---
const playlist = ref([
  { id: 1, name: 'Clair de Lune', artist: 'Debussy' },
  { id: 2, name: 'Blinding Lights', artist: 'The Weeknd' },
  // ... 更多歌曲
])

// --- “此刻我在...” 数据 ---
const currentStatus = ref({
  text: '重读《百年孤独》，并单曲循环《Traveling Light》',
  updateTime: '更新于今天上午',
})

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 添加一个标志，表示数据是否已加载
const isDataLoaded = ref(false)

// 可以在此处添加从 Pinia Store 或 API 获取数据的逻辑
onMounted(async () => {
  try {
    await fetchArticles() // 假设这个动作会更新 filteredArticles
    isDataLoaded.value = true
    console.log('首页数据加载完成')
  } catch (error) {
    console.error('首页数据加载失败:', error)
    // 即使失败，也设置标志，避免无限等待
    isDataLoaded.value = true
  }
})

// [修复] 9. 在组件卸载前，可以清理一些可能引起冲突的副作用（如果需要的话）
onUnmounted(() => {
  console.log('HomePage 组件卸载')
  // 例如：清除未完成的定时器、取消未完成的网络请求等
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openGitHub = () => {
  window.open('https://github.com/gaoxinjian/ggalaxy-blog', '_blank')
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1.5rem 1rem 1.5rem;
  display: block;
}
.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}
.section-card h2 {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  color: #34495e;
}
.section-card h2 .el-icon {
  margin-right: 8px;
}
.article-card {
  margin-bottom: 10px;
}

/* 为目标列添加粘性定位 */
.main-content > .el-col:last-child {
  position: sticky;
  top: 69px; /* 根据 Header 高度调整，一般比 Header 高 20px，留出呼吸空间 */
  height: fit-content; /* 高度由内容决定 */
  max-height: calc(100vh - 100px); /* 可选：防止过高，设置最大高度 */

  /* 新增：隐藏滚动条的核心代码 */
  overflow-y: auto; /* 确保可以滚动 */
  scrollbar-width: none; /* 针对 Firefox：隐藏滚动条 */
}
/* 针对 Webkit 内核的浏览器 (Chrome, Safari, Edge) */
.main-content > .el-col:last-child::-webkit-scrollbar {
  display: none; /* 完全隐藏滚动条 */
}
/* 添加一个平滑的滚动效果 */
.main-content > .el-col:last-child {
  scroll-behavior: smooth;
}
/* 可选：优化右栏内部模块的排列 */
.main-content > .el-col:last-child .section-card {
  margin-bottom: 1.5rem; /* 保持模块间距 */
}
/* 确保最后一个模块没有过大的底边距 */
.main-content > .el-col:last-child .section-card:last-child {
  margin-bottom: 0;
}

/* 兴趣导航卡片样式 */
.interest-nav .nav-link {
  text-decoration: none;
}
.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}
.nav-card:hover {
  border-color: #409eff;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}
.nav-icon {
  margin-bottom: 10px;
  color: #409eff;
}
.nav-text {
  font-size: 0.9rem;
  color: #555;
}
/* 音乐播放器区域 */
.player-placeholder {
  background: #f8f9fa;
  border-radius: 8px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  margin-bottom: 1.5rem;
}
.playlist li {
  padding: 0.5rem 0;
  border-bottom: 1px dashed #eee;
}
/* 当前状态 */
.current-status p {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0.5rem 0;
}
.update-time {
  color: #95a5a6;
  font-style: italic;
}
</style>
