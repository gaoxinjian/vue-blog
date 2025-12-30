import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/ArticleDetail.vue'),
      props: true,
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
  ],
})

// 添加路由守卫（可选）
router.beforeEach((to, from, next) => {
  // 这里可以添加权限检查等逻辑
  next()
})

export default router
