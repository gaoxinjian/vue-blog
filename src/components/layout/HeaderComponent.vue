<template>
  <header class="main-header">
    <div class="container">
      <!-- logo -->
      <div class="logo-area" @click="toGoHome">
        <div class="logo">
          <el-icon class="logo-icon"><ElementPlus /></el-icon>
        </div>
        <span class="site-title">Ggalaxy Blog</span>
      </div>

      <!-- 导航菜单，桌面版 -->
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.path" @click="navigateTo(item.path)">
            <el-icon v-if="item.icon" class="nav-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="nav-text">{{ item.name }}</span>
          </li>
        </ul>
      </nav>

      <!-- 右侧功能区域 -->
      <div class="right-area">
        <!-- 搜索框（暂时隐藏，后续实现） -->
        <!-- <div class="search-box">
          <el-input
            v-model="searchText"
            placeholder="搜索文章..."
            size="small"
            :prefix-icon="Search"
            class="search-input"
          />
        </div> -->

        <!-- 暗色切换 -->
        <div class="theme-toggle" @click="toggleDarkMode">
          <el-tooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
            <el-icon class="theme-icon" :size="20">
              <component :is="isDark ? Sunny : Moon" />
            </el-icon>
          </el-tooltip>
        </div>

        <!-- 用户相关 -->
        <div class="user-area">
          <template v-if="!isLoginedIn">
            <el-button type="primary" size="small" @click="goToLogin">登录</el-button>
            <el-button type="primary" size="small" @click="goToRegister">注册</el-button>
          </template>
          <template v-else>
            <el-dropdown @command="handleUserCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar" class="user-avatar">
                  {{ userInitial }}
                </el-avatar>
                <span class="user-name">{{ userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="articles">
                    <el-icon><Document /></el-icon>我的文章
                  </el-dropdown-item>
                  <el-dropdown-item command="write">
                    <el-icon><Edit /></el-icon>写文章
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-btn" @click="toggleMobileMenu">
          <el-icon :size="24">
            <Menu />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 移动端菜单（滑动抽屉） -->
    <el-drawer
      v-model="showMobileMenu"
      title="菜单"
      direction="ltr"
      size="300px"
      :with-header="true"
      :modal="true"
      :lock-scroll="true"
      :append-to-body="true"
      :modal-append-to-body="true"
    >
      <div class="mobile-menu-content">
        <div v-if="isLoginedIn" class="mobile-user">
          <el-avatar :size="48" :src="userAvatar" class="mobile-avatar">
            {{ userInitial }}
          </el-avatar>
          <div class="mobile-user-info">
            <h3>{{ userName }}</h3>
            <p>{{ userEmail }}</p>
          </div>
        </div>

        <ul class="mobile-nav-list">
          <li
            v-for="item in navItems"
            :key="item.path"
            :class="['mobile-nav-item', { active: isActive(item.path) }]"
            @click="navigateTo(item.path)"
          >
            <el-icon class="mobile-nav-icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </li>

          <li v-if="!isLoginedIn" class="mobile-nav-item" @click="goToLogin">
            <el-icon><User /></el-icon>
            <span>登录</span>
          </li>
          <li v-if="!isLoginedIn" class="mobile-nav-item" @click="goToRegister">
            <el-icon><UserPlus /></el-icon>
            <span>注册</span>
          </li>
          <li v-if="isLoginedIn" class="mobile-nav-item" @click="handleUserCommand('logout')">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </li>
        </ul>

        <div class="mobile-theme-toggle" @click="toggleDarkMode">
          <el-icon>
            <component :is="isDark ? Sunny : Moon" />
          </el-icon>
          <span>{{ isDark ? '亮色模式' : '暗色模式' }}</span>
        </div>
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import {
  // 图标
  ElementPlus,
  HomeFilled,
  Notebook,
  Collection,
  PriceTag,
  Setting,
  User,
  Document,
  Edit,
  SwitchButton,
  ArrowDown,
  Menu,
  Sunny,
  Moon,
  /* UserPlus,
  Search, */
} from '@element-plus/icons-vue'
// import { id } from 'element-plus/es/locales.mjs'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

// 响应式数据
// const searchText = ref('')
const showMobileMenu = ref(false)

// 路由
const router = useRouter()
const route = useRoute()

// 使用Pinia Store
const userStore = useUserStore()
const themeStore = useThemeStore()

// 计算属性，用store里的数据
const isLoginedIn = computed(() => userStore.isLogined)
const userName = computed(() => userStore.user?.username || '未登录')
const userEmail = computed(() => userStore.user?.email || '')
const userAvatar = computed(() => userStore.user?.avatarUrl || '')
const userInitial = computed(() => userStore.userInitial)
const isDark = computed(() => themeStore.isDark)

// 导航菜单项
const navItems = [
  { name: '首页', path: '/', icon: HomeFilled },
  { name: '博客', path: '/blog', icon: Notebook },
  { name: '分类', path: '/categories', icon: Collection },
  { name: '标签', path: '/tags', icon: PriceTag },
  { name: '管理', path: '/admin', icon: Setting, requireAuth: true },
]

// 方法
const isActive = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path))
}
const navigateTo = (path: string) => {
  if (path === '/admin' && !isLoginedIn.value) {
    router.push('/login')
    return
  }
  router.push(path)
  showMobileMenu.value = false // 关闭移动端菜单
}
const toGoHome = () => {
  router.push('/')
}
const goToLogin = () => {
  router.push('/login')
  showMobileMenu.value = false
}
const goToRegister = () => {
  // 暂时跳转到登录页
  router.push('/login')
  showMobileMenu.value = false
}

const toggleDarkMode = () => {
  themeStore.toggleTheme()
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'articles':
      router.push('/my-articles')
      break
    case 'write':
      router.push('/write')
      break
    case 'logout':
      // 处理退出登录
      userStore.logout()
      router.push('/')
      break
  }
  showMobileMenu.value = false
}

onMounted(() => {
  userStore.initialize()
  themeStore.initTheme()
})
</script>

<style scoped lang="scss">
.main-header {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background-color: var(--el-bg-color-overlay);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}
.logo-area {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  user-select: none;
  &:hover {
    .logo-icon {
      transform: rotate(15deg);
    }
    .site-title {
      color: var(--el-color-primary);
    }
  }
}
.logo {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--el-color-primary), #a855f7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-icon {
  color: white;
  font-size: 20px;
  transition: transform 0.3s ease;
}
.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  transition: color 0.3s ease;
}
.desktop-nav {
  @media (max-width: 768px) {
    display: none;
  }
}

.nav-list {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-regular);

  &:hover {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }

  &.active {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);

    .nav-icon {
      color: var(--el-color-primary);
    }
  }
}

.nav-icon {
  font-size: 16px;
}

.nav-text {
  font-size: 15px;
  font-weight: 500;
}

.right-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.theme-toggle {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: var(--el-fill-color-light);
  }
}
.theme-icon {
  color: var(--el-text-color-regular);
  transition:
    color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.user-area {
  @media (max-width: 768px) {
    display: none;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--el-fill-color-light);
  }
}
.user-avatar {
  background: linear-gradient(135deg, var(--el-color-primary), #a855f7);
}

.user-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: var(--el-fill-color-light);
  }

  @media (max-width: 768px) {
    display: block;
  }
}

/* 移动端菜单样式 */
:deep(.el-drawer) {
  z-index: 10000 !important; /* 确保在最上层 */
}

:deep(.el-drawer__header) {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}
.mobile-menu-content {
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
}

/* 确保移动端菜单项有足够的点击区域 */
.mobile-nav-item {
  min-height: 56px;
  display: flex;
  align-items: center;
}

.mobile-user {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--el-fill-color-light);
  border-radius: 12px;
  margin-bottom: 20px;
}

.mobile-avatar {
  background: linear-gradient(135deg, var(--el-color-primary), #a855f7);
}

.mobile-user-info h3 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.mobile-user-info p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;

  &:hover {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }

  &.active {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}

.mobile-nav-icon {
  font-size: 20px;
  width: 24px;
}

.mobile-theme-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-regular);
  margin-top: 20px;
  background: var(--el-fill-color-light);

  &:hover {
    background: var(--el-fill-color);
    color: var(--el-color-primary);
  }
}
</style>
