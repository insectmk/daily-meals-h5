<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import RecipeCard from '@/pages/recipe-cache/component/recipe-card.vue'

defineProps({
  // 菜谱列表
  recipeList: {
    type: Array as () => RecipeInfo[],
    required: true,
  },
  // 加载
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  // 是否结束
  finished: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits([
  // 加载
  'load',
  'update:loading',
])

// 监听输入变化，触发双向绑定
function handleLoading(value: string) {
  emit('update:loading', value)
}
</script>

<template>
  <van-list
    :loading="loading"
    :finished="finished"
    finished-text="已经到底啦 ~"
    loading-text="加载中..."
    @load="$emit('load')"
    @update:loading="handleLoading"
  >
    <van-row>
      <van-col
        v-for="(recipe, index) in recipeList"
        :key="index"
        span="24"
      >
        <RecipeCard :recipe="recipe" />
      </van-col>
    </van-row>
  </van-list>
</template>

<style scoped>

</style>
