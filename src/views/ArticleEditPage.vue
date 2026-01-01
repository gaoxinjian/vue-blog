<template>
  <div class="editor-container">
    <el-page-header :icon="null" @back="goBack">
      <template #content>
        <span class="page-title">{{ isEditMode ? '编辑文章' : '撰写新文章' }}</span>
      </template>
    </el-page-header>

    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入文章标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类" clearable>
          <el-option
            v-for="cat in categories"
            :key="cat.value"
            :label="cat.label"
            :value="cat.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="内容标签" prop="tags">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入或选择标签"
          style="width: 100%"
        >
          <el-option v-for="tag in existingTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>

      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="form.summary"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <!-- Markdown 编辑器核心区域 -->
      <el-form-item label="正文内容" prop="content" class="editor-item">
        <div class="editor-wrapper">
          <!-- 编辑器头部标签 -->
          <div class="editor-header">
            <div
              v-for="tab in editorTabs"
              :key="tab.id"
              :class="['tab', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </div>
          </div>

          <!-- 编辑器主体：根据标签切换编辑/预览 -->
          <div class="editor-body">
            <!-- 编辑模式 -->
            <div v-show="activeTab === 'edit'" class="edit-pane">
              <Editor
                :value="form.content"
                :mode="activeTab"
                :plugins="plugins"
                :locale="zhHans"
                @change="handleEditorChange"
                class="bytemd-editor"
              />
            </div>

            <!-- 预览模式 -->
            <div v-show="activeTab === 'preview'" class="preview-pane markdown-body">
              <Viewer :value="form.content" :plugins="plugins" />
            </div>

            <!-- 双栏模式 -->
            <div v-show="activeTab === 'split'" class="split-pane">
              <div class="split-left">
                <Editor
                  :value="form.content"
                  mode="split"
                  :plugins="plugins"
                  :locale="zhHans"
                  @change="handleEditorChange"
                  class="bytemd-editor"
                />
              </div>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item class="form-actions">
        <el-button type="primary" @click="handleSubmit('publish')" :loading="submitting">
          {{ isEditMode ? '更新文章' : '发布文章' }}
        </el-button>
        <el-button @click="handleSubmit('draft')" :loading="submitting"> 保存为草稿 </el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

import { Editor, Viewer } from '@bytemd/vue-next'

import gfm from '@bytemd/plugin-gfm' // 支持表格、删除线等GitHub风格语法
import highlight from '@bytemd/plugin-highlight' // 代码高亮
import frontmatter from '@bytemd/plugin-frontmatter' // 解析Front Matter
import zhHans from 'bytemd/locales/zh_Hans.json'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/github.css'
import 'github-markdown-css/github-markdown.css'
import { useArticleStore, type ArticleState } from '@/stores/article'

// 在 ArticleEditorView.vue 的 <script setup> 顶部添加
interface ArticleFormData {
  id?: number
  title: string
  content: string
  summary: string
  author: string
  authorId: number
  category: string
  tags: string[]
  coverImage?: string
  isPublished: boolean // 注意：你的store用 isPublished，而不是 status
}

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const articleStore = useArticleStore()

// 编辑器插件和标签页状态
const plugins = [gfm(), highlight(), frontmatter()]
const editorTabs = [
  { id: 'edit', label: '编辑' },
  { id: 'preview', label: '预览' },
  { id: 'split', label: '分栏' },
]
const activeTab = ref('edit')

// 表单数据
// 修改 form 响应式对象
const form = reactive<ArticleFormData>({
  id: undefined as number | undefined,
  title: '',
  category: '',
  tags: [] as string[],
  summary: '',
  content: '',
  // 移除 status，改为 isPublished
  isPublished: false,
  // 可选：添加封面图字段
  coverImage: '',
  author: '杲新建',
  authorId: 0,
})

// 模拟数据
const categories = ref([
  { label: '技术笔记', value: 'tech' },
  { label: '生活随笔', value: 'life' },
  { label: '旅行游记', value: 'travel' },
  { label: '读书心得', value: 'reading' },
])

const existingTags = ref(['Vue', 'JavaScript', '旅行', '读书', '音乐', '徒步'])

// 表单验证规则
// 更新验证规则，移除status相关验证
const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在2到100个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, message: '文章内容至少10个字符', trigger: 'blur' },
  ],
}

// 计算属性：判断是否为编辑模式
const isEditMode = computed(() => {
  return route.path.startsWith('/article/edit')
})

const submitting = ref(false)

// 编辑器内容变化处理
const handleEditorChange = (value: string) => {
  form.content = value
}

// 修改 loadArticleData 方法
const loadArticleData = async () => {
  if (isEditMode.value && route.params.id) {
    const articleId = Number(route.params.id)
    try {
      // 调用store方法获取文章
      const article = await articleStore.fetchArticleById(articleId)

      if (article) {
        // 将store的数据结构映射到表单
        form.id = article.id
        form.title = article.title
        form.category = article.category
        form.tags = article.tags || []
        form.summary = article.summary || ''
        form.content = article.content || ''
        // 注意映射：这里用isPublished，不是status
        form.isPublished = article.isPublished || false

        // 如果编辑页面需要显示作者信息
        // form.author = article.author
        // form.authorId = article.authorId
      }
    } catch (error) {
      console.error('加载文章数据失败:', error)
      ElMessage.error('加载文章失败')
    }
  }
}

// 提交处理
// 修改 handleSubmit 方法
const handleSubmit = async (action: 'publish' | 'draft') => {
  // 表单验证
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  submitting.value = true

  try {
    // 准备要提交的数据 - 适配你的store接口
    const articleData: Omit<
      ArticleState,
      'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'
    > = {
      title: form.title,
      content: form.content,
      summary: form.summary,
      // 这里需要实际的作者信息，可以先写死或从用户store获取
      author: '当前用户', // 需要从用户store获取
      authorId: 1, // 需要从用户store获取
      category: form.category,
      tags: form.tags,
      coverImage: form.coverImage || '',
      isPublished: action === 'publish',
    }

    // 根据模式调用不同的store方法
    if (isEditMode.value && form.id) {
      // 编辑模式：调用updateArticle
      await articleStore.updateArticle(form.id, {
        title: form.title,
        content: form.content,
        summary: form.summary,
        category: form.category,
        tags: form.tags,
        coverImage: form.coverImage,
        isPublished: action === 'publish',
      })
      ElMessage.success('文章更新成功')
    } else {
      // 创建模式：调用createArticle
      await articleStore.createArticle(articleData)
      ElMessage.success(action === 'publish' ? '文章发布成功' : '草稿保存成功')
    }

    // 成功后跳转
    router.push('/')
  } catch (error) {
    console.error('保存文章失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 重置表单
// 修改 handleReset 方法
const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？所有未保存的内容将会丢失。', '确认重置', {
    type: 'warning',
  }).then(() => {
    // 重置表单数据
    form.id = undefined
    form.title = ''
    form.category = ''
    form.tags = []
    form.summary = ''
    form.content = ''
    form.isPublished = false
    form.coverImage = ''

    // 如果是编辑模式，重新加载数据
    if (isEditMode.value) {
      loadArticleData()
    }
  })
}

// 返回上一页
const goBack = () => {
  if (form.content && !window.confirm('内容尚未保存，确定离开吗？')) {
    return
  }
  router.back()
}

// 页面加载时初始化
onMounted(() => {
  loadArticleData()
})
</script>

<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.editor-item {
  margin-bottom: 30px;
}

.editor-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.editor-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border-right: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.tab:hover {
  background-color: #e4e7ed;
}

.tab.active {
  background-color: #fff;
  font-weight: bold;
  border-bottom: 2px solid #409eff;
}

.editor-body {
  min-height: 500px;
}

.edit-pane,
.preview-pane,
.split-pane {
  height: 100%;
  width: 100%;
}
.bytemd-editor {
  height: 100%;
  display: block;
}
:deep(.bytemd) {
  height: 500px;
  border: none;
}

.preview-pane {
  padding: 20px;
  overflow-y: auto;
  height: 500px;
}

.split-pane {
  display: flex;
  height: 500px;
}

.split-left {
  flex: 1;
  border-right: 1px solid #dcdfe6;
}

.split-right {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.form-actions {
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 30px;
}
</style>
