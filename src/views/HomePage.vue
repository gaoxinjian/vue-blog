<!-- src/views/HomePage.vue -->
<template>
  <!-- 假设 Header 是独立的，例如在 App.vue 或 Layout 组件中 -->
  <div class="home-container">
    <!-- 1. 个人品牌标语区 (在Header下方) -->
    <section class="hero-section">
      <h1>探索代码与生活的交响曲</h1>
      <p class="subtitle">这里记录着我的阅读、旅行、音乐，以及一切热爱。</p>
    </section>

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
import { ref, onMounted, computed } from 'vue'
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
// import ArticleCard from '@/components/ArticleCard.vue'
import ArticleCard from '@/components/common/ArticleCard.vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '@/stores/article'
import { useRouter } from 'vue-router'
const router = useRouter()
const articleStore = useArticleStore()
const { filteredArticles } = storeToRefs(articleStore)
const pageSize = ref(6)

const currentPage = ref(1)

// --- 兴趣导航数据 ---
const interestNavs = ref([
  { id: 1, text: '阅读角落', path: '/reading', icon: Reading },
  { id: 2, text: '音乐空间', path: '/music', icon: Headset },
  { id: 3, text: '旅行纪行', path: '/travel', icon: Place },
  { id: 4, text: '徒步日志', path: '/hiking', icon: MapLocation },
])

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
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

// 可以在此处添加从 Pinia Store 或 API 获取数据的逻辑
onMounted(() => {
  // 例如：fetchHomeData();
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
}
.hero-section {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}
.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
.hero-section .subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
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
