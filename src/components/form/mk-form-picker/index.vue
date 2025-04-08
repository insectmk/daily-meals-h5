<script setup lang="ts">
import { useDictStore } from '@/stores'

// 属性
const prop = defineProps({
  modelValue: { // 默认的 v-model 属性名
    type: [String, Number], // 支持多种类型
    required: true,
  },
  // 字典标识
  dictType: {
    type: String,
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
})

// 事件
const emit = defineEmits(['update:modelValue']) // 声明 emit 事件

const dictStore = useDictStore()

const result = ref<string>(String(prop.modelValue)) // 内容显示
const showPicker = ref<boolean>(false) // 控制选择框显示

/**
 * 初始化选择的内容为label
 */
dictStore.getDictByType(prop.dictType).then(() => {
  result.value = dictStore.getDictLabelByValue(prop.dictType, String(prop.modelValue))
})

/**
 * 选择后
 * @param selectedValues
 */
function onConfirm({ selectedValues }) {
  // 触发事件通知父组件更新
  emit('update:modelValue', selectedValues[0])
  result.value = dictStore.getDictLabelByValue(prop.dictType, String(selectedValues)) // 表单显示的类型
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
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
    <MkPicker
      :dict-type="dictType"
      :value="modelValue"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<style scoped>

</style>
