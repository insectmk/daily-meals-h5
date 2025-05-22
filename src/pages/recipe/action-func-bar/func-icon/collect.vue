<script setup lang="ts">
import { showToast } from 'vant'
import type { RecipeInfo } from '@/api/recipe/type'

defineProps({
  // 菜谱信息
  recipe: {
    type: Object as PropType<RecipeInfo>,
    required: true,
  },
})
</script>

<template>
  <van-action-bar-icon
    icon="star" text="收藏" :color="recipe.favor ? '#ff5000' : ''" @click="() => {
      showToast('敬请期待！！！');
    }"
  />
</template>

<style scoped>

</style>
