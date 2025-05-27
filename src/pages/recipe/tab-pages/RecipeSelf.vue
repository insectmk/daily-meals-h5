<script setup lang="ts">
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'
import { getSelfRecipePage as getRecipesPage } from '@/api/recipe'
</script>

<template>
  <RecipeCardList
    :recipe-list-api="getRecipesPage"
  />
</template>

<style scoped>

</style>
