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
  ],
})

export default router
