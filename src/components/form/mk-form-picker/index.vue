<script setup lang="ts">
import { useDictStore } from '@/stores'
import type { FieldRule, PickerFieldNames } from 'vant'
import type { CommonResult } from '@/api/type'

// 属性
const prop = defineProps({
  modelValue: { // 默认的 v-model 属性名
    type: [String, Number], // 支持多种类型
    required: true,
  },
  // 字典标识
  dictType: {
    type: [String, Function] as PropType<string | (() => Promise<CommonResult<any[]>>)>,
    required: true,
  },
  // label
  label: {
    type: String,
    required: false,
    default: '选择器',
  },
  // 提示文字
  placeholder: {
    type: String,
    required: false,
    default: '请选择内容',
  },
  // 表单验证规则
  rules: {
    type: Array as () => Array<FieldRule>, // 更明确的数组类型声明
    required: false,
    default: () => [], // 使用工厂函数返回默认值
  },
  // 自定义列标识
  customFieldName: {
    type: Object as () => PickerFieldNames,
    required: false,
    default: () => ({
      text: 'label',
      value: 'value',
    }),
  },
})

// 事件
const emit = defineEmits(['update:modelValue']) // 声明 emit 事件

const dictStore = useDictStore()

const result = ref<string>(String(prop.modelValue)) // 内容显示
const showPicker = ref<boolean>(false) // 控制选择框显示
const columns = ref<any[]>([]) // 列表信息

if (typeof prop.dictType === 'string') {
  // 从字典状态读取列表
  dictStore.getDictByType(prop.dictType).then((res) => {
    columns.value = res
    // 初始化选择的内容为label
    updateResult(String(prop.modelValue))
  })
}
else {
  // 从接口读取列表
  prop.dictType().then((res) => {
    columns.value = res.data
    // 初始化选择的内容为label
    updateResult(String(prop.modelValue))
  })
}

/**
 * 更改选择的内容为label
 * @param value
 */
function updateResult(value: string) {
  const column = columns.value.find(item => String(item[prop.customFieldName.value]) === value)
  if (column) {
    result.value = column[prop.customFieldName.text]
  }
  else {
    result.value = value
  }
}

/**
 * 选择后
 * @param selectedValues
 */
function onConfirm({ selectedValues }) {
  // 触发事件通知父组件更新
  emit('update:modelValue', selectedValues[0])
  updateResult(String(selectedValues)) // 表单显示的类型
  showPicker.value = false
}
</script>

<template>
  <van-field
    v-model="result"
    is-link
    readonly
    name="picker"
    :label="label"
    :placeholder="placeholder"
    :rules="rules"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
    <van-picker
      :columns-field-names="customFieldName"
      :columns="columns"
      :value="[modelValue]"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<style scoped>

</style>
