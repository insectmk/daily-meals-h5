<script setup lang="ts">
import { BaseKit, EchoEditor } from 'echo-editor'
import 'echo-editor/style.css'
import type { FieldRule } from 'vant'

defineProps({
  // 文本
  modelValue: { // 默认的 v-model 属性名
    type: String,
    required: true,
  },
  // label
  label: {
    type: String,
    required: false,
    default: '富文本',
  },
  // 最长字数
  maxlength: {
    type: Number,
    required: false,
    default: 50,
  },
  // 提示文字
  placeholder: {
    type: String,
    required: false,
    default: '请输入内容',
  },
  // 表单验证规则
  rules: {
    type: Array as () => Array<FieldRule>, // 更明确的数组类型声明
    required: false,
    default: () => [], // 使用工厂函数返回默认值
  },
})

// 声明 emit 事件（用于更新父组件的 v-model）
const emit = defineEmits(['update:modelValue'])

const content = ref('')
const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: 'Start writing...',
    },
  }),
]
// 监听内容变化
watch(content, (newValue, _oldValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <van-field
    :model-value="modelValue"
    rows="2"
    autosize
    :label="label"
    label-align="top"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :rules="rules"
  >
    <template #input>
      <div style="width: 100%">
        <EchoEditor v-model="content" :extensions="extensions" />
      </div>
    </template>
  </van-field>
</template>
