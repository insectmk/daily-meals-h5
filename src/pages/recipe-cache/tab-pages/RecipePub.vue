<script setup lang="ts">
import RecipeCardList from '@/pages/recipe-cache/component/recipe-card-list.vue'
import { publicRecipePage } from '@/api/recipe'
</script>

<template>
  <RecipeCardList
    :recipe-list-api="publicRecipePage"
  />
</template>

<style scoped>

</style>
