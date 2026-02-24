<template>
  <div class="simple-audio-player">
    <!-- 当前歌曲信息 -->
    <div class="song-info" v-if="currentSong">
      <span class="song-name">{{ currentSong.name }}</span>
      <span class="song-artist" v-if="currentSong.artist"> - {{ currentSong.artist }}</span>
    </div>

    <!-- 进度条 -->
    <div class="progress-container" @click="seek">
      <div class="progress-bg">
        <div class="progress-current" :style="{ width: progressPercent + '%' }"></div>
        <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
      </div>
    </div>
    <div class="time-info">
      <span>{{ formatTime(currentTime) }}</span>
      <span>{{ formatTime(duration) }}</span>
    </div>

    <!-- 控制按钮 -->
    <div class="controls">
      <button @click="prev" :disabled="!hasPrev">⏮</button>
      <button @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</button>
      <button @click="next" :disabled="!hasNext">⏭</button>
    </div>

    <!-- 隐藏的 audio 元素 -->
    <audio ref="audioRef" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @ended="onEnded"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// 定义歌曲类型
export interface Song {
  url: string        // 音频直链
  name: string       // 歌曲名
  artist?: string    // 歌手（可选）
}

// 组件 props
const props = defineProps<{
  playlist: Song[]          // 播放列表
  autoplay?: boolean        // 是否自动播放（注意移动端限制）
  preload?: 'none' | 'metadata' | 'auto' // audio preload 属性
}>()

// 状态
const audioRef = ref<HTMLAudioElement>()
const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// 计算当前歌曲
const currentSong = computed(() => props.playlist[currentIndex.value])

// 是否可上一首/下一首
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.playlist.length - 1)

// 进度百分比
const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 监听当前歌曲变化，切换音频源
// 监听 currentSong 变化，更新 src
watch(currentSong, (newSong) => {
  if (!audioRef.value || !newSong) return
  const wasPlaying = isPlaying.value
  audioRef.value.src = newSong.url
  audioRef.value.load()
  if (wasPlaying) {
    // 如果之前是播放状态，尝试继续播放
    audioRef.value.play()
      .then(() => {
        isPlaying.value = true
      })
      .catch(err => {
        console.warn('切换歌曲后自动播放失败:', err)
        isPlaying.value = false
      })
  }
})

// 播放/暂停切换
const togglePlay = async () => {
  console.log('togglePlay 被点击，当前 isPlaying:', isPlaying.value)
  if (!audioRef.value) {
    console.warn('audioRef 不存在')
    return
  }

  // 如果 src 为空，先设置 src
  if (!audioRef.value.src && currentSong.value) {
    audioRef.value.src = currentSong.value.url
    audioRef.value.load()
  }

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    try {
      await audioRef.value.play()
      isPlaying.value = true
    } catch (error) {
      console.error('播放失败:', error)
      isPlaying.value = false
    }
  }
}

// 上一首
const prev = () => {
  if (hasPrev.value) {
    currentIndex.value--
    isPlaying.value = true // 切换到上一首后自动播放
  }
}

// 下一首
const next = () => {
  if (hasNext.value) {
    currentIndex.value++
    isPlaying.value = true
  }
}

// 进度条点击跳转
const seek = (e: MouseEvent) => {
  const progressBg = (e.currentTarget as HTMLElement).querySelector('.progress-bg')
  if (!progressBg || !audioRef.value) return
  const rect = progressBg.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const percent = Math.max(0, Math.min(1, clickX / rect.width))
  audioRef.value.currentTime = percent * duration.value
}

// audio 事件处理
const onTimeUpdate = (e: Event) => {
  const audio = e.target as HTMLAudioElement
  currentTime.value = audio.currentTime
}

const onLoaded = (e: Event) => {
  const audio = e.target as HTMLAudioElement
  duration.value = audio.duration
  // 如果开启了自动播放且音频已加载，尝试播放
  if (props.autoplay && isPlaying.value) {
    audio.play().catch(e => console.warn('自动播放失败:', e))
  }
}

const onEnded = async () => {
  if (hasNext.value) {
    // 直接修改 currentIndex，会触发 watch 中的自动播放逻辑
    currentIndex.value++
    // watch 中会根据 isPlaying 自动尝试播放
  } else {
    isPlaying.value = false
    currentTime.value = 0
  }
}

// 格式化时间（mm:ss）
const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 清理
onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})

onMounted(() => {
  if (currentSong.value && audioRef.value) {
    audioRef.value.src = currentSong.value.url
    audioRef.value.load()
  }
})
</script>

<style scoped>
.simple-audio-player {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-family: system-ui, sans-serif;
}

.song-info {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-weight: normal;
  color: #666;
  font-size: 0.9rem;
}

.progress-container {
  cursor: pointer;
  margin: 0.5rem 0;
}

.progress-bg {
  position: relative;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
}

.progress-current {
  position: absolute;
  height: 100%;
  background: #1db954; /* Spotify green, 可自定义 */
  border-radius: 2px;
  width: 0;
  pointer-events: none;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #1db954;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-bg:hover .progress-handle {
  opacity: 1;
}

.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.controls button {
  background: none;
  border: none;
  font-size: 1.8rem;
  /* line-height: 1; */
  cursor: pointer;
  color: #333;
  transition: color 0.2s;
  padding: 0 0.5rem;
}

.controls button:hover {
  color: #1db954;
}

.controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.controls button:disabled:hover {
  color: #333;
}
</style>
