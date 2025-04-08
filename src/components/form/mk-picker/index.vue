<script setup lang="ts">
import type { PickerFieldNames } from 'vant'
import type { DictInfo } from '@/api/system/type'
import { useDictStore } from '@/stores'

// 属性
const prop = defineProps({
  // 自定义列标识
  customFieldName: {
    type: Object as () => PickerFieldNames,
    required: false,
    default: () => ({
      text: 'label',
      value: 'value',
    }),
  },
  // 字典标识
  dictType: {
    type: String,
    required: true,
  },
  // 绑定值
  value: {
    type: [String, Number] as PropType<string | number>,
    required: true,
  },
})

// 事件
defineEmits(['confirm', 'cancel'])

const dictStore = useDictStore()

const columns = ref<DictInfo[]>([]) // 字典信息
// 从字典状态读取列表
dictStore.getDictByType(prop.dictType).then((res) => {
  columns.value = res
})
</script>

<template>
  <van-picker
    :columns-field-names="customFieldName"
    :columns="columns"
    :value="[value]"
    @confirm="({ selectedValues }) => { $emit('confirm', { selectedValues }) }"
    @cancel="$emit('cancel')"
  />
</template>

<style scoped>

</style>
