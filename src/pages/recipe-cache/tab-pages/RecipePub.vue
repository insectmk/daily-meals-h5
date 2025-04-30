<script setup lang="ts">
import RecipeCardList from '@/pages/recipe-cache/component/recipe-card-list.vue'
import { getPublicRecipePage } from '@/api/recipe'
</script>

<template>
  <RecipeCardList
    :recipe-list-api="getPublicRecipePage"
  />
</template>

<style scoped>

</style>
