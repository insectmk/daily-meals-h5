<script setup lang="ts">
import RecipeCardList from '@/pages/recipe-cache/component/recipe-card-list.vue'
import { systemRecipePage } from '@/api/recipe'
</script>

<template>
  <RecipeCardList
    :recipe-list-api="systemRecipePage"
  />
</template>

<style scoped>

</style>
