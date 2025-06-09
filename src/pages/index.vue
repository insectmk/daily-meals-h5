<script setup lang="ts">
import RecipeCategory from '@/pages/recipe/tab-pages/recipe-category/index.vue'
import FoodCategory from '@/pages/recipe/tab-pages/food-category/index.vue'
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'
import { getFavorUsersRecipePage } from '@/api/recipe'
import RecipeNewest from '@/pages/recipe/tab-pages/newest/index.vue'

defineOptions({
  name: 'Home',
})

const recipeTabActive = ref('newest') // 当前所在tab

// 用于记录滚动状态
const scrollTop = ref(0)
// 页面活动后
onActivated(() => {
  window.scrollTo(0, scrollTop.value)
})
// 路由跳转前
onBeforeRouteLeave(() => {
  scrollTop.value
    = window.scrollY
      || document.documentElement.scrollTop
      || document.body.scrollTop
})
</script>

<template>
  <van-tabs
    v-model:active="recipeTabActive"
    animated swipeable sticky
    background="transparent"
  >
    <van-tab name="userFavor">
      <template #title>
        关注
      </template>
      <RecipeCardList
        :recipe-list-api="getFavorUsersRecipePage"
      />
    </van-tab>
    <van-tab name="newest">
      <template #title>
        最新
      </template>
      <RecipeNewest />
    </van-tab>
    <van-tab name="category">
      <template #title>
        分类
      </template>
      <RecipeCategory />
    </van-tab>
    <van-tab name="food">
      <template #title>
        食材
      </template>
      <FoodCategory />
    </van-tab>
  </van-tabs>
</template>

<route lang="json5">
{
name: 'Home',
meta: {
  i18n: 'layouts.recipe',
  keepAlive: true
},
}
</route>
