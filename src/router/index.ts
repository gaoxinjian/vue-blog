import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterPage.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogPage.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesPage.vue'),
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/TagsPage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue'),
    },
    {
      path: '/my-articles',
      name: 'my-articles',
      component: () => import('@/views/MyArticlesPage.vue'),
    },
    {
      path: '/write',
      name: 'write',
      component: () => import('@/views/WriteArticlePage.vue'),
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: () => import('@/views/ArticleDetail.vue'),
      props: true,
    },
    {
      path: '/article/create',
      name: 'ArticleCreate',
      component: () => import('@/views/ArticleEditPage.vue'),
      meta: { requiresAuth: true }, // 如果需要权限控制
    },
    {
      path: '/article/edit/:id',
      name: 'ArticleEdit',
      component: () => import('@/views/ArticleEditPage.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 先初始化认证状态
  await authStore.initAuth()
  const isAuthenticated = authStore.isAuthenticated

  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // 未登录，重定向到登录页
      next('/login')
    } else {
      next()
    }
  } else if (to.path === '/login' && isAuthenticated) {
    // 已登录用户访问登录页，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router
