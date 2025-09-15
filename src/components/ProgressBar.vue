<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :class="progressClass"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
    <div class="progress-text">
      {{ progressPercent }}%
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * 定义组件属性
 */
const props = defineProps({
  /**
   * 当前进度值
   * @type {number}
   * @required
   */
  current: {
    type: Number,
    required: true
  },
  /**
   * 目标值
   * @type {number}
   * @required
   */
  target: {
    type: Number,
    required: true
  },
  /**
   * 是否已完成
   * @type {boolean}
   * @default false
   */
  completed: {
    type: Boolean,
    default: false
  }
})

/**
 * 计算进度百分比
 * @returns {number} 进度百分比，范围在0-100之间
 */
const progressPercent = computed(() => {
  if (props.completed) return 100
  if (props.target <= 0) return 0
  const percent = Math.min(100, Math.round((props.current / props.target) * 100))
  return percent
})

/**
 * 根据进度确定进度条样式类
 * @returns {string} 样式类名
 */
const progressClass = computed(() => {
  if (props.completed) return 'completed'
  if (progressPercent.value < 30) return 'low'
  if (progressPercent.value < 70) return 'medium'
  return 'high'
})
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
  border-radius: 10px;
}

/**
 * 低进度样式（0-29%）
 */
.progress-fill.low {
  background-color: #409eff;
}

/**
 * 中等进度样式（30-69%）
 */
.progress-fill.medium {
  background-color: #ffcc00;
}

/**
 * 高进度样式（70-99%）
 */
.progress-fill.high {
  background-color: #42b983;
}

/**
 * 已完成样式（100%）
 */
.progress-fill.completed {
  background-color: #42b983;
}

.progress-text {
  font-size: 18px;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}
</style>