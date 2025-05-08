<script setup lang="ts">
import { useDictStore } from '@/stores'
import type { FieldRule, PickerFieldNames } from 'vant'
import type { CommonResult } from '@/api/type'

// 属性
const props = defineProps({
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
  // 只读状态
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
})

// 事件
const emit = defineEmits([
  'update:modelValue', // 下拉更新
  'change', // 值改变
]) // 声明 emit 事件

// 监听 modelValue 的变化
watch(
  () => props.modelValue, // 监听目标
  (newVal, _oldVal) => {
    // 执行你的业务逻辑
    updateResult(String(newVal)) // 更新显示内容
  },
  // { immediate: true }, // 可选：立即触发一次（初始值）
)

const dictStore = useDictStore()

const result = ref<string>(String(props.modelValue)) // 内容显示
const showPicker = ref<boolean>(false) // 控制选择框显示
const columns = ref<any[]>([]) // 列表信息

if (typeof props.dictType === 'string') {
  // 从字典状态读取列表
  dictStore.getDictByType(props.dictType).then((res) => {
    columns.value = res
    // 初始化选中的内容
    initSelected()
    // 初始化选择的内容为label
    updateResult(String(props.modelValue))
  })
}
else {
  // 从接口读取列表
  props.dictType().then((res) => {
    columns.value = res.data
    // 初始化选中的内容
    initSelected()
    // 初始化选择的内容为label
    updateResult(String(props.modelValue))
  })
}

/**
 * 初始化选中的内容
 */
function initSelected() {
  // 如果绑定值为空之类的，默认选中第一个
  if (!props.modelValue) {
    emit('update:modelValue', columns.value[0][props.customFieldName.value])
  }
}

/**
 * 更改选择的内容为label
 * @param value
 */
function updateResult(value: string) {
  const column = columns.value.find(item => String(item[props.customFieldName.value]) === value)
  if (column) {
    result.value = column[props.customFieldName.text]
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

/**
 * 处理 Picker 的 change 事件
 * @param singleValue
 * @param columnIndex
 * @param selectedValues
 */
function handlePickerChange({
  singleValue,
  columnIndex,
  selectedValues,
}) {
  // 更新显示的值
  updateResult(selectedValues[0])
  const selectedTexts = [] // 选项显示值
  const column = columns.value.find(item => String(item[props.customFieldName.value]) === String(selectedValues[0]))
  if (column) {
    selectedTexts[0] = column[props.customFieldName.text]
  }
  else {
    selectedTexts[0] = selectedValues[0]
  }
  // 透传所有参数给父组件
  emit('change', {
    singleValue,
    columnIndex,
    selectedValues,
    selectedTexts,
  })
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
      :readonly="readonly"
      @change="handlePickerChange"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<style scoped>

</style>
