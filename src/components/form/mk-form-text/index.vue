<script setup lang="ts">
// 属性
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
    default: '备注',
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
})

// 声明 emit 事件（用于更新父组件的 v-model）
const emit = defineEmits(['update:modelValue'])

// 监听输入变化，触发双向绑定
function handleInput(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <van-field
    :model-value="modelValue"
    rows="2"
    autosize
    :label="label"
    label-align="top"
    type="textarea"
    :maxlength="maxlength"
    :placeholder="placeholder"
    show-word-limit
    @update:model-value="handleInput"
  />
</template>

<style scoped>

</style>
