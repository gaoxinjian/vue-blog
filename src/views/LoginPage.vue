<!-- src/views/LoginPage.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <el-card class="login-card">
        <template #header>
          <div class="login-header">
            <h2>用户登录</h2>
            <p>欢迎来到 Ggalaxy Blog</p>
          </div>
        </template>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="80px"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
              size="large"
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-link type="primary" :underline="false" class="forgot-link"> 忘记密码？ </el-link>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handleLogin"
              class="login-btn"
              size="large"
            >
              登录
            </el-button>
            <el-button @click="goToRegister" size="large"> 注册新账户 </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="login-footer">
        <p>还没有账户？ <el-link type="primary" @click="goToRegister">立即注册</el-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus' // 添加导入

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  remember: false,
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
}

// 处理登录逻辑
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const isValid = await loginFormRef.value.validate()
    if (!isValid) return

    loading.value = true
    const result = await userStore.login(loginForm.username, loginForm.password)

    if (result.success) {
      ElMessage.success('登录成功！')
      // 跳转到首页或原来的页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    } else {
      ElMessage.error(result.error || '登录失败')
    }
  } catch (error) {
    ElMessage.error('登录过程中出现错误')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

// 页面加载时检查是否有记住的用户名
onMounted(() => {
  const savedUsername = localStorage.getItem('remembered_username')
  if (savedUsername) {
    loginForm.username = savedUsername
    loginForm.remember = true
  }

  // 如果用户已登录，跳转到首页
  if (userStore.isLogined) {
    router.push('/')
  }
})

watch(
  () => loginForm.remember,
  (newVal) => {
    if (newVal) {
      localStorage.setItem('remembered_username', loginForm.username)
    } else {
      localStorage.removeItem('remembered_username')
    }
  },
)
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
  background: var(--el-bg-color-page);
  background-image:
    radial-gradient(at 40% 20%, hsla(240, 100%, 94%, 0.1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.1) 0px, transparent 50%);
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  box-shadow: var(--el-box-shadow-dark);
  border-radius: 12px;
  overflow: hidden;
}

.login-header {
  text-align: center;
  padding-bottom: 10px;
}

.login-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.forgot-link {
  font-size: 14px;
}

.login-btn {
  width: 120px;
  font-weight: 500;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.social-btn.github {
  background: #24292e;
  border-color: #24292e;
  color: white;
}

.social-btn.github:hover {
  background: #2f363d;
  border-color: #2f363d;
}

.social-btn.google {
  background: #4285f4;
  border-color: #4285f4;
  color: white;
}

.social-btn.google:hover {
  background: #3367d6;
  border-color: #3367d6;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.login-footer .el-link {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    padding: 20px 16px;
  }

  .login-header h2 {
    font-size: 24px;
  }
}
</style>
