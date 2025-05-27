<script setup lang="ts">
import {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  Columns,
  EchoEditor,
  FindAndReplace,
  FontFamily,
  FontSize,
  FormatPainter,
  Fullscreen,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImageUpload,
  Indent,
  Italic,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  Preview,
  Printer,
  SlashCommand,
  Strike,
  Table,
  TaskList,
  TextAlign,
  Underline,
  Video,
  VideoUpload,
} from 'echo-editor'
import 'echo-editor/style.css'
import { showSuccessToast } from 'vant'
import type { FieldRule } from 'vant'
import { uploadFile } from '@/api/infra'
import ResponseCode from '@/constants/response-code'

const props = defineProps({
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
    default: '请输入内容...',
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

const content = ref('') // 富文本内容
const hideMenubar = ref<boolean>(true) // 隐藏菜单栏
const hideToolbar = ref<boolean>(true) // 隐藏工具栏

const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: props.placeholder,
    },
    characterCount: {
      limit: 50000,
    },
  }),
  History, // 撤销 重做
  Columns,
  FormatPainter, // 格式刷
  Clear, // 清除格式
  Heading.configure({ spacer: true }), // 正文与标题
  FontSize, // 字号调整
  FontFamily, // 字体调整
  Bold, // 加粗
  Italic,
  Underline, // 下划线
  Strike,
  MoreMark,
  Color.configure({ spacer: true }), // 字体颜色
  Highlight, // 高亮
  BulletList, // 项目列表
  OrderedList,
  TextAlign.configure({ types: ['heading', 'paragraph', 'image'], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link, // 链接
  Image,
  ImageUpload.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        uploadFile({
          file: files,
        }).then((res) => {
          if (res.code === ResponseCode.SUCCESS.code) {
            showSuccessToast(`图片上传成功！`)
            resolve(res.data) // 返回图片url字符串
          }
        })
      })
    },
  }),
  Video,
  VideoUpload.configure({
    upload: handleFileUpload,
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Fullscreen.configure({ spacer: true }), // 全屏
  CodeBlock,
  Table, // 表格
  Code,
  FindAndReplace.configure({ spacer: true }),
  Printer,
  Preview,
  Iframe,
]
// 监听内容变化
watch(content, (newValue, _oldValue) => {
  emit('update:modelValue', newValue)
})
watch(() => props.modelValue, (newValue) => {
  content.value = newValue
})

// 上传文件
async function handleFileUpload(files: File[]) {
  const f = files.map(file => ({
    src: URL.createObjectURL(file),
    alt: file.name,
  }))
  return Promise.resolve(f)
}
</script>

<template>
  <van-field
    :model-value="modelValue"
    rows="2"
    autosize
    label-align="top"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :rules="rules"
  >
    <template #label>
      {{ label }}
      <span
        class="hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors"
        @click="hideToolbar = !hideToolbar"
      >
        {{ !hideToolbar ? '关闭工具' : '打开工具' }}
      </span>
      <span
        class="hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors"
        @click="hideMenubar = !hideMenubar"
      >
        {{ !hideMenubar ? '关闭菜单' : '打开菜单' }}
      </span>
    </template>
    <template #input>
      <div class="w-7xl">
        <EchoEditor
          v-model="content"
          class="w-full"
          :hide-menubar="hideMenubar"
          :hide-toolbar="hideToolbar"
          :extensions="extensions"
        />
      </div>
    </template>
  </van-field>
</template>
