<template>
  <div class="article-detail" v-if="article">
    <h1>{{ article.title }}</h1>
    <div class="meta">发布于 {{ dayjs(article.createdAt).format('YYYY-MM-DD HH:mm') }}</div>
    <!-- 关键：使用v-html渲染Markdown转换后的HTML -->
    <div class="content markdown-body" v-html="htmlContent"></div>
  </div>
  <el-empty v-else description="文章未找到" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked' // 使用你已有的marked库
import hljs from 'highlight.js' // 使用你已有的highlight.js
import 'highlight.js/styles/github.css' // 引入代码高亮样式
import { type ArticleState, useArticleStore } from '@/stores/article'
import dayjs from 'dayjs'

const route = useRoute()
const articleStore = useArticleStore()
const article = ref(<ArticleState | null>null)
const htmlContent = ref('')

onMounted(async () => {
  const id = Number(route.params.id)
  // 方式1：从Pinia Store中查找（如果文章数据已全局加载）
  // article.value = articleStore.articles.find(item => item.id === id)
  // 方式2：调用独立的API接口获取单篇文章详情（更推荐）
  await articleStore.fetchArticleById(id)
  article.value = articleStore.currentArticle

  // 配置marked使用highlight.js进行代码高亮
  marked.setOptions({
    // Marked's TypeScript definitions may not include `highlight` depending on the installed version,
    // so cast the options object to any to avoid a type error while still providing the function.
    highlight: function (code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  } as never)
  // 将Markdown内容转换为HTML
  if (article.value && article.value.content) {
    htmlContent.value = await marked(article.value.content)
  }
})
</script>

<style scoped>
/* 文章详情页面的CSS样式 */
/* 假设这是为文章详情页面的组件或页面添加的样式，可以放在 src/styles/ArticleDetail.css 或类似文件中 */

.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.article-header {
  text-align: center;
  margin-bottom: 30px;
}

.article-title {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #333;
}

.article-meta {
  font-size: 0.9em;
  color: #666;
}

.article-meta span {
  margin-right: 15px;
}

.article-content {
  font-size: 1.1em;
  color: #444;
}

.article-content h2 {
  margin-top: 30px;
  margin-bottom: 15px;
  color: #222;
}

.article-content p {
  margin-bottom: 15px;
}

.article-content img {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  border-radius: 8px;
}

.article-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.article-footer a {
  color: #007bff;
  text-decoration: none;
}

.article-footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-detail {
    padding: 15px;
  }

  .article-title {
    font-size: 2em;
  }
}
</style>
