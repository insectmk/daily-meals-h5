<script setup lang="ts">
import RecipeCardList from '@/pages/recipe-cache/component/recipe-card-list.vue'
import { getSystemRecipePage } from '@/api/recipe'
</script>

<template>
  <RecipeCardList
    :recipe-list-api="getSystemRecipePage"
  />
</template>

<style scoped>

</style>
