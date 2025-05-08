<script setup lang="ts">
import { getRecipeMenuPage } from '@/api/recipe-menu'
</script>

<template>
  <van-cell title="新建菜单" is-link />
  <RecipeMenuCardList :menu-list-api="getRecipeMenuPage" />
</template>

<style scoped>

</style>
