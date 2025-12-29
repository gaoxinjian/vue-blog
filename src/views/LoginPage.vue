<!-- src/views/LoginPage.vue -->
<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <h2>用户登录</h2>
          <p>欢迎回到 Vue3 Blog</p>
        </div>
      </template>

      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin"> 登录 </el-button>
          <el-button @click="$router.push('/')"> 返回首页 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
})

const handleLogin = () => {
  console.log('登录信息:', loginForm)
  // 这里将来会调用登录API
  router.push('/')
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
}

.login-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.login-header p {
  margin: 10px 0 0;
  color: var(--el-text-color-secondary);
}
</style>
