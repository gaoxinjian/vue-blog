<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Header组件 -->
    <HeaderComponent />
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition
          name="fade"
          mode="out-in"
          @before-leave="onBeforeLeave"
          @after-enter="onAfterEnter"
        >
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>

    <!-- Footer组件（后续添加） -->
    <!-- <Footer /> -->
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
// import { useRoute } from 'vue-router'

// const currentRoute = useRoute()

// 可选的调试钩子，帮助你观察过渡生命周期
const onBeforeLeave = () => {
  console.log('开始离开旧页面')
}
const onAfterEnter = () => {
  console.log('新页面进入完成')
}
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
  padding: 10px 0;
}
</style>
