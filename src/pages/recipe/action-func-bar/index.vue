<script setup lang="ts">
import Comment from '@/pages/recipe/action-func-bar/func-icon/comment.vue'
import Share from '@/pages/recipe/action-func-bar/func-icon/share.vue'
import Collect from '@/pages/recipe/action-func-bar/func-icon/collect.vue'
import AddToPlan from '@/pages/recipe/action-func-bar/func-icon/add-to-plan.vue'
import AddToMenu from '@/pages/recipe/action-func-bar/func-icon/add-to-menu.vue'

defineProps({
  // 菜谱ID
  recipeId: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <van-action-bar safe-area-inset-bottom placeholder>
    <!--  评论  -->
    <Comment />
    <!--  分享 -->
    <Share />
    <!--  加入到菜单  -->
    <AddToMenu :recipe-id="recipeId" />
    <!--  收藏 -->
    <Collect />
    <!--  加入到计划  -->
    <AddToPlan :recipe-id="recipeId" />
  </van-action-bar>
</template>

<style scoped>

</style>
