<script setup lang="ts">
import { getSelfRecipePage as getRecipesPage } from '@/api/recipe'
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'
import RecipeMenuTab from '@/pages/profile/self-content-tab/recipe-menu-tab.vue'
import UserCollectTab from '@/pages/profile/self-content-tab/user-collect-tab/index.vue'

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
        min-height="50vh"
      />
    </van-tab>
    <van-tab name="food">
      <template #title>
        菜单
      </template>
      <RecipeMenuTab />
    </van-tab>
    <van-tab name="collect">
      <template #title>
        收藏
      </template>
      <UserCollectTab />
    </van-tab>
  </van-tabs>
</template>

<style scoped>

</style>
