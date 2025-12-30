<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Header组件 -->
    <HeaderComponent />
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer组件（后续添加） -->
    <!-- <Footer /> -->
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  padding: 20px 0;
}
</style>
