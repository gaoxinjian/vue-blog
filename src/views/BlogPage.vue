<!-- src/views/BlogPage.vue -->
<template>
  <div class="blog-page">
    <h1>博客列表</h1>
    <p>博客功能正在开发中...</p>
    <el-button type="primary" @click="$router.push('/')"> 返回首页 </el-button>
  </div>
</template>

<script setup lang="ts">
// 占位组件
</script>

<style scoped>
.blog-page {
  text-align: center;
  padding: 100px 20px;
}

.blog-page h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.blog-page p {
  font-size: 1.2rem;
  color: var(--el-text-color-regular);
  margin-bottom: 30px;
}
</style>
