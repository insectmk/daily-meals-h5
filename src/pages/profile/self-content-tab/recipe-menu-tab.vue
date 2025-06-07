<script setup lang="ts">
import { getSelfRecipeMenuPage } from '@/api/recipe-menu'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <van-cell
    title="新建菜单" is-link @click="() => {
      // 打开录入页面
      router.push({
        name: 'RecipeMenuForm', // 需指定路由名称
        //query: { recipeId: props.recipe.id },
      })
    }"
  />
  <RecipeMenuCardList :menu-list-api="getSelfRecipeMenuPage" min-height="45vh" />
</template>

<style scoped>

</style>
