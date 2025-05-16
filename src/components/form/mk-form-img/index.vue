<script setup lang="ts">
import type { FieldRule, UploaderFileListItem } from 'vant'
import { uploadFile } from '@/api/infra'
import ResponseCode from '@/constants/response-code'
import { bytesToSize } from '@/utils/file-size-util'

// 属性
const props = defineProps({
  // 文件url
  modelValue: { // 默认的 v-model 属性名
    type: [String, Array] as PropType<string | string[]>,
    required: true,
  },
  // label
  label: {
    type: String,
    required: false,
    default: '备注',
  },
  // 最大上传数
  maxCount: {
    type: Number,
    required: false,
    default: 1,
  },
  // 是否开启多图片上传
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },
  // 表单验证规则
  rules: {
    type: Array as PropType<FieldRule[]>, // 更明确的数组类型声明
    required: false,
    default: () => [], // 使用工厂函数返回默认值
  },
  // 上传大小限制
  maxSize: {
    type: Number,
    required: false,
    default: 500 * 1024,
  },
})

// 声明 emit 事件（用于更新父组件的 v-model）
const emit = defineEmits(['update:modelValue'])

// 文件列表
const fileList = ref<UploaderFileListItem[]>([])

/**
 * 上传图片后
 * @param file
 */
function afterRead(file: UploaderFileListItem) {
  uploadFile({
    file: file.file,
  }).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      showNotify({ type: 'success', message: `图片上传成功！`, duration: 1500 })
      // 更新url到对象中
      file.url = res.data
      // 将URL更新到绑定的内容上
      if (props.multiple) {
        // 多选模式处理
        const currentValue = Array.isArray(props.modelValue)
          ? [...props.modelValue]
          : props.modelValue
            ? [props.modelValue]
            : []
        // 触发双向绑定，将上传的文件名绑定到字段中
        emit('update:modelValue', [...currentValue, res.data])
      }
      else {
        // 单选，直接赋值单个URL即可
        emit('update:modelValue', res.data) // 触发双向绑定，将上传的文件名绑定到字段中
      }
    }
  })
}

/**
 * 删除图片前
 * @param file
 */
function beforeDelete(file: UploaderFileListItem) {
  // 将URL更新到绑定的内容上
  if (props.multiple) {
    // 多选模式处理，删除图片
    const currentValue = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : props.modelValue
        ? [props.modelValue]
        : []
    // 触发双向绑定，将上传的文件名绑定到字段中
    emit('update:modelValue', [...currentValue.filter(curFile => curFile !== file.url)])
  }
  else {
    // 单选，改为空字符串
    emit('update:modelValue', '') // 触发双向绑定，将上传的文件名绑定到字段中
  }
  return true
}

/**
 * 超过最大上传大小
 * @param _file
 */
function onOversize(_file: UploaderFileListItem) {
  showToast(`图片大小不能超过${bytesToSize(props.maxSize)}`)
}
</script>

<template>
  <van-field name="uploader" :label="label" :rules="rules">
    <template #input>
      <van-uploader
        v-model="fileList"
        multiple
        :max-count="maxCount"
        :after-read="afterRead"
        :before-delete="beforeDelete"
        :max-size="maxSize"
        @oversize="onOversize"
      >
        <template #default>
          <slot name="default">
            <van-image width="80" height="80">
              <template #loading>
                <div class="i-carbon:camera" />
              </template>
            </van-image>
          </slot>
        </template>
        <template #preview-cover="{ file }">
          <slot name="preview-cover" :file="file" />
        </template>
      </van-uploader>
    </template>
  </van-field>
</template>

<style scoped>

</style>
