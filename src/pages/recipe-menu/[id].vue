<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getRecipeMenu } from '@/api/recipe-menu'
import type { RecipeMenu } from '@/api/recipe-menu/type'

const route = useRoute()
const router = useRouter()

const id = Number((route.params as { id: number }).id) // 路由参数：菜谱菜单ID
const recipeMenu = ref<RecipeMenu>()
const loading = ref<boolean>(true) // 加载中

/**
 * 获取菜谱菜单信息
 */
getRecipeMenu(id).then((res) => {
  recipeMenu.value = res.data
  loading.value = false // 加载完毕
})

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
    :title="$t('recipe.menu.info.title')"
    :left-text="$t('common.back')"
    left-arrow placeholder fixed
    @click-left="onBack"
  />
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <h1>{{ recipeMenu.title }}</h1>
    <h2>{{ recipeMenu.subtitle }}</h2>
    <div v-html="recipeMenu.menuDesc" />
    <RecipeCardList :recipe-list-api="recipeMenu.recipes" min-height="0" />
  </div>
</template>

<style scoped>
</style>

<route lang="json5">
{
  name: 'RecipeMenuInfo',
  meta: {
    title: '菜谱菜单信息',
    i18n: 'recipe.info.title',
    customNav: true,
  },
}
</route>
