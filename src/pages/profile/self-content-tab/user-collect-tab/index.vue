<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getSelfUserCollectPage } from '@/api/user-collect'

const router = useRouter()
</script>

<template>
  <van-cell
    title="新建收藏" is-link @click="() => {
      // 打开录入页面
      router.push({
        name: 'RecipeMenuForm', // 需指定路由名称
        //query: { recipeId: props.recipe.id },
      })
    }"
  />
  <UserCollectCardList :list-api="getSelfUserCollectPage" min-height="55vh" />
</template>

<style scoped>

</style>
