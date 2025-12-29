<!-- src/views/HomePage.vue -->
<template>
  <div class="home-page">
    <h1>Vue3 Blog 项目</h1>
    <p>基于 Vue3 + TypeScript + Vite 构建</p>

    <div class="tech-stack">
      <el-tag type="success">Vue3</el-tag>
      <el-tag type="info">TypeScript</el-tag>
      <el-tag type="warning">Vite</el-tag>
      <el-tag type="danger">Pinia</el-tag>
      <el-tag>Element Plus</el-tag>
    </div>

    <div class="actions">
      <el-button type="primary" size="large" @click="goToLogin"> 开始使用 </el-button>
      <el-button size="large" @click="openGitHub"> GitHub </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const openGitHub = () => {
  window.open('https://github.com/gaoxinjian/ggalaxy-blog', '_blank')
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 100px 20px;
}

.home h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #2c3e50;
}

.home p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.tech-stack {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.tech-stack .el-tag {
  font-size: 1rem;
  padding: 8px 16px;
}

.actions {
  margin-top: 40px;
}

.actions .el-button {
  margin: 0 10px;
  min-width: 120px;
}
</style>
