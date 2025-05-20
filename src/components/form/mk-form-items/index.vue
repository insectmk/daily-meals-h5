<script setup lang="ts">
// 属性
const prop = defineProps({
  modelValue: { // 默认的 v-model 属性名
    type: Array as PropType<any[]>, // 支持多种类型
    required: true,
  },
  // label
  label: {
    type: String,
    required: false,
    default: '选择器',
  },
  // 格式化内容的方法
  formatter: {
    type: Function as PropType<(item: any) => string>,
    required: false,
    default: (item: any) => item?.toString(),
  },
  // 默认表单数据
  defaultFormData: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

// 声明 emit 事件（用于更新父组件的 v-model）
const emit = defineEmits(['update:modelValue'])

const showPopup = ref<boolean>(false)
const formData = ref<any>(JSON.parse(JSON.stringify(prop.defaultFormData))) // 表单内容

/**
 * 添加明细
 */
function confirmItem() {
  // 添加表单数据到明细中
  emit('update:modelValue', [...prop.modelValue, formData.value])
  // 重置表单数据
  formData.value = JSON.parse(JSON.stringify(prop.defaultFormData))
  showPopup.value = false // 关闭表单
}

/**
 * 删除明细tag
 */
function handelItemDelete(item: any) {
  // 删除明细
  const newItems = [...prop.modelValue]
  const index = newItems.indexOf(item)
  if (index !== -1) {
    newItems.splice(index, 1)
  }
  emit('update:modelValue', [...newItems])
}
</script>

<template>
  <van-field
    autosize
    :label="label"
    label-align="top"
    right-icon="plus"
    show-word-limit
    @click="showPopup = true"
  >
    <template #input>
      <div>
        <van-tag
          v-for="(item, index) in modelValue"
          :key="index"
          class="mr-4"
          type="primary"
          closeable plain
          @close="handelItemDelete(item)"
        >
          {{ formatter(item) }}
        </van-tag>
      </div>
    </template>
  </van-field>
  <van-popup
    v-model:show="showPopup"
    destroy-on-close position="bottom" :style="{ height: '40%' }"
  >
    <div class="van-picker__toolbar">
      <van-button type="primary" class="van-picker__cancel van-haptics-feedback" @click="showPopup = false">
        取消
      </van-button>
      <van-button type="success" class="van-haptics-feedback van-picker__confirm" @click="confirmItem">
        确认
      </van-button>
    </div>
    <slot name="default" :item-data="formData" />
  </van-popup>
</template>

<style scoped>

</style>
