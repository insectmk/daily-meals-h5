<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
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

// tiptop 编辑器
const editor = useEditor({
  content: '',
  // 编辑器自动获取焦点
  autofocus: false,
  // 编辑器是否可用
  editable: true,
  injectCSS: false,
  // 使用扩展
  extensions: [
    StarterKit,
  ],
  // 更新时操作
  onUpdate: ({ editor }) => {
    const html = editor.getHTML() // 获取编辑器 HTML 内容
    emit('update:modelValue', html) // 触发双向绑定
  },
})

// 手动接管焦点控制
function handleFocus() {
  if (editor.value && !editor.value.isDestroyed) {
    editor.value.commands.focus()
  }
}
</script>

<template>
  <van-field
    :model-value="modelValue"
    rows="2"
    autosize
    :rules="rules"
    :label="label"
    label-align="top"
    type="textarea"
    :maxlength="maxlength"
    :placeholder="placeholder"
    show-word-limit
    @click="handleFocus"
  >
    <template #input>
      <div style="width: 100%">
        <EditorContent :editor="editor" />
      </div>
    </template>
  </van-field>
</template>

<style scoped>

</style>
