<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getRecipePage } from '@/api/recipe'
import RecipeCardList from '@/pages/recipe-cache/component/recipe-card-list.vue'

defineOptions({
  name: 'RecipeListFoodCategory',
})

const router = useRouter()
const route = useRoute()

const categoryId = (route.params as { categoryId: number }).categoryId // 路由参数：菜谱ID

/**
 * 返回操作
 */
function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <van-nav-bar
    :title="$t('recipe.category.title')"
    :left-text="$t('common.back')"
    left-arrow placeholder fixed
    @click-left="onBack"
  />
  <RecipeCardList :recipe-list-api="getRecipePage" :query-param="{ foodCategory: [categoryId] }" />
</template>

<style scoped>
</style>

<route lang="json5">
{
  name: 'RecipeListFoodCategory',
  meta: {
    title: '食材分类信息',
    i18n: 'recipe.foodCategory.title',
    keepAlive: false,
    customNav: true,
  },
}
</route>
