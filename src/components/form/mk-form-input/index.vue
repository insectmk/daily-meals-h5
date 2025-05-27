<script setup lang="ts">
// 属性
defineProps({
  // 文本
  modelValue: { // 默认的 v-model 属性名
    type: [String, Number] as PropType<string | number>,
    required: true,
  },
  // 类型
  type: {
    /**
     *  <!-- 输入任意文本 -->
     *   <van-field v-model="text" label="文本" />
     *   <!-- 输入手机号，调起手机号键盘 -->
     *   <van-field v-model="tel" type="tel" label="手机号" />
     *   <!-- 允许输入正整数，调起纯数字键盘 -->
     *   <van-field v-model="digit" type="digit" label="整数" />
     *   <!-- 允许输入数字，调起带符号的纯数字键盘 -->
     *   <van-field v-model="number" type="number" label="数字" />
     *   <!-- 输入密码 -->
     *   <van-field v-model="password" type="password" label="密码" />
     */
    type: String as PropType<'text' | 'tel' | 'digit' | 'number' | 'password'>,
    required: false,
    default: 'text',
  },
  // label
  label: {
    type: String,
    required: false,
    default: '文本',
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
    :label="label"
    label-align="left"
    type="text"
    :placeholder="placeholder"
    @update:model-value="handleInput"
  />
</template>

<style scoped>

</style>
