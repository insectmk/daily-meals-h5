<script setup lang="ts">
import Comment from '@/pages/recipe/action-func-bar/func-icon/comment.vue'
import Share from '@/pages/recipe/action-func-bar/func-icon/share.vue'
import Collect from '@/pages/recipe/action-func-bar/func-icon/collect.vue'
import AddToPlan from '@/pages/recipe/action-func-bar/func-icon/add-to-plan.vue'
import AddToMenu from '@/pages/recipe/action-func-bar/func-icon/add-to-menu.vue'
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
  <van-action-bar id="recipe-info-action-bar" safe-area-inset-bottom placeholder>
    <!--  评论  -->
    <Comment :recipe="recipe" />
    <!--  分享 -->
    <Share />
    <!--  加入到菜单  -->
    <AddToMenu :recipe-id="recipe.id" />
    <!--  收藏 -->
    <Collect :recipe="recipe" />
    <!--  加入到计划  -->
    <AddToPlan :recipe-id="recipe.id" />
  </van-action-bar>
</template>

<style scoped>

</style>
