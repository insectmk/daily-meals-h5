<script setup lang="ts">
import type { FloatingBubbleOffset } from 'vant'
import { useWindowSize } from '@vant/use'
import { useRouter } from 'vue-router'

const router = useRouter()
const { width, height } = useWindowSize()

const bubbleOffset = ref<FloatingBubbleOffset>({
  x: width.value - 600,
  y: height.value - 200,
})

// 监控窗口
watch([width, height], () => {
  bubbleOffset.value.x = width.value - 600
  bubbleOffset.value.y = height.value - 200
})
</script>

<template>
  <van-floating-bubble v-model:offset="bubbleOffset" icon="plus" axis="lock" @click="router.push(`/recipe-cache/add`)" />
</template>

<style scoped>

</style>
