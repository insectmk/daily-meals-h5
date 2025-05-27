<script setup lang="ts">
// 属性
import { formatDate } from '@vueuse/core'

const prop = defineProps({
  // 时间戳
  modelValue: { // 默认的 v-model 属性名
    type: Number,
    required: true,
  },
  // label
  label: {
    type: String,
    required: false,
    default: '日期',
  },
  // 提示文字
  placeholder: {
    type: String,
    required: false,
    default: '点击选择日期',
  },
})

// 事件
const emit = defineEmits(['update:modelValue']) // 声明 emit 事件

const result = ref<string>(formatDate(new Date(prop.modelValue), 'YYYY-MM-DD')) // 内容显示
const showCalendar = ref<boolean>(false) // 日期选择器显示

/**
 * 日期选择后
 * @param date
 */
function onCalendarConfirm(date: Date) {
  // 触发事件通知父组件更新
  emit('update:modelValue', date.getTime())
  result.value = formatDate(date, 'YYYY-MM-DD') // 表单显示的日期
  showCalendar.value = false
}
</script>

<template>
  <van-field
    v-model="result"
    is-link
    readonly
    name="calendar"
    :label="label"
    :placeholder="placeholder"
    @click="showCalendar = true"
  />
  <van-calendar
    v-model:show="showCalendar"
    :show-confirm="false"
    :style="{ height: '500px' }"
    @confirm="onCalendarConfirm"
  />
</template>

<style scoped>

</style>
