<script setup lang="ts">
import { getSelfRecipePage as getRecipesPage } from '@/api/recipe'
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'

const tabActive = ref('category') // 当前所在tab
</script>

<template>
  <van-tabs
    v-model:active="tabActive"
    animated swipeable sticky
    background="transparent"
  >
    <van-tab name="category">
      <template #title>
        菜谱
      </template>
      <RecipeCardList
        :recipe-list-api="getRecipesPage"
        min-height="55vh"
      />
    </van-tab>
    <van-tab name="food">
      <template #title>
        菜单
      </template>
      <p>这是我的菜单</p>
    </van-tab>
  </van-tabs>
</template>

<style scoped>

</style>
