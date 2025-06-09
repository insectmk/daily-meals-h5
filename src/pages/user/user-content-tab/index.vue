<script setup lang="ts">
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'
import { getRecipeMenuPageByUser } from '@/api/recipe-menu'
import { getUserCollectPageByUser } from '@/api/user-collect'
import { getRecipePageByUser } from '@/api/recipe'
import { ContentTypesEnum } from '@/api/user-collect/enums'

defineProps({
  userId: { // 用户ID
    type: Number,
    required: true,
  },
})

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
        :recipe-list-api="getRecipePageByUser"
        :query-param="{
          userId,
        }"
        min-height="65vh"
      />
    </van-tab>
    <van-tab name="food">
      <template #title>
        菜单
      </template>
      <RecipeMenuCardList
        :menu-list-api="getRecipeMenuPageByUser"
        :query-param="{
          userId,
        }"
        min-height="65vh"
      />
    </van-tab>
    <van-tab name="collect">
      <template #title>
        收藏
      </template>
      <UserCollectCardList
        :list-api="getUserCollectPageByUser"
        :query-param="{
          userId,
          collectType: ContentTypesEnum.RECIPE,
        }"
        min-height="65vh"
      />
    </van-tab>
  </van-tabs>
</template>

<style scoped>

</style>
