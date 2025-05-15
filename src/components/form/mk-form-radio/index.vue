<script setup lang="ts">
// 属性
defineProps({
  // 文本
  modelValue: { // 默认的 v-model 属性名
    type: [String, Number] as PropType<string | number>,
    required: true,
  },
  // label
  label: {
    type: String,
    required: false,
    default: '文本',
  },
  // 选项
  options: {
    type: Array as PropType<any[]>,
    required: true,
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
    :label="label"
    label-align="left"
    type="text"
  >
    <template #input>
      <van-radio-group
        :model-value="modelValue"
        direction="horizontal" @update:model-value="handleInput"
      >
        <van-radio
          v-for="option in options"
          :key="option.id" :name="option.value"
        >
          {{ option.label }}
        </van-radio>
      </van-radio-group>
    </template>
  </van-field>
</template>

<style scoped>

</style>
