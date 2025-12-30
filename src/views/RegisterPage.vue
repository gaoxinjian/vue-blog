<!-- src/views/RegisterPage.vue -->
<template>
  <div class="register-page">
    <div class="register-container">
      <el-card class="register-card">
        <template #header>
          <div class="register-header">
            <h2>注册新账户</h2>
            <p>加入Vue3 Blog社区</p>
          </div>
        </template>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-width="100px"
          @submit.prevent="handleRegister"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-form-item label="个人简介" prop="bio">
            <el-input
              v-model="registerForm.bio"
              type="textarea"
              :rows="3"
              placeholder="简单介绍一下自己吧"
              :maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="registerForm.agree">
              我已阅读并同意
              <el-link type="primary" :underline="false">服务条款</el-link>
              和
              <el-link type="primary" :underline="false">隐私政策</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handleRegister"
              class="register-btn"
            >
              注册
            </el-button>
            <el-button @click="goToLogin"> 已有账户？登录 </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <div class="register-footer">
        <p>注册即表示您同意我们的服务条款和隐私政策</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Message, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  bio: '',
  agree: false,
})

// 表单验证规则
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  agree: [{ required: true, message: '请同意服务条款和隐私政策', trigger: 'change' }],
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  const isValid = await registerFormRef.value.validate()
  if (!isValid) return

  loading.value = true

  try {
    const result = await userStore.register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
    })

    if (result.success) {
      ElMessage.success('注册成功！')
      router.push('/')
    } else {
      ElMessage.error(result.error || '注册失败')
    }
  } catch (error) {
    ElMessage.error('注册过程中出现错误')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
  background: var(--el-bg-color-page);
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.register-card {
  box-shadow: var(--el-box-shadow);
}

.register-header {
  text-align: center;
}

.register-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 24px;
}

.register-header p {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.register-btn {
  width: 120px;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
