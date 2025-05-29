<script setup lang="ts">
import { getCommentPage } from '@/api/user-comment'
import { ContentTypesEnum } from '@/api/user-collect/enums'

defineProps({
  // 菜谱ID
  recipeId: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <user-comment-card-list
    :list-api="getCommentPage"
    :query-param="{
      contentId: recipeId,
      contentType: ContentTypesEnum.RECIPE,
    }" min-height="0"
  />
</template>

<style scoped>

</style>
