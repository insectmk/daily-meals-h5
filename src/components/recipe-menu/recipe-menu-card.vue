<script setup lang="ts">
import type { RecipeMenu } from '@/api/recipe-menu/type'
import { useRouter } from 'vue-router'

defineProps({
  recipeMenu: {
    type: Object as PropType<RecipeMenu>,
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <van-card
    :title="recipeMenu.title"
    :desc="recipeMenu.subtitle"
    tag="菜单"
    :thumb="recipeMenu.picUrl"
    @click="router.push(`/recipe-menu/${recipeMenu.id}`)"
  />
</template>

<style scoped>

</style>
