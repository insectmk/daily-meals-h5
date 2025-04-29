<script setup lang="ts">
import RecipeSelf from '@/pages/recipe-cache/tab-pages/RecipeSelf.vue'
import RecipePub from '@/pages/recipe-cache/tab-pages/RecipePub.vue'
import RecipeSystem from '@/pages/recipe-cache/tab-pages/RecipeSystem.vue'

defineOptions({
  name: 'RecipeCache',
})

const recipeTabActive = ref('system') // 当前所在tab

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
    <van-tab name="system">
      <template #title>
        系统菜谱
      </template>
      <RecipeSystem />
    </van-tab>
    <van-tab name="public">
      <template #title>
        公共菜谱
      </template>
      <RecipePub />
    </van-tab>
    <van-tab name="self">
      <template #title>
        我的菜谱
      </template>
      <RecipeSelf />
    </van-tab>
  </van-tabs>
</template>

<route lang="json5">
{
  name: 'RecipeCache',
  meta: {
    i18n: 'layouts.recipe',
    keepAlive: true
  },
}
</route>
