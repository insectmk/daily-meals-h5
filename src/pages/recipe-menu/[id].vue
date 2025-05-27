<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getRecipeMenu } from '@/api/recipe-menu'
import type { RecipeMenu } from '@/api/recipe-menu/type'
import MorePopup from '@/pages/recipe-menu/more-popup/index.vue'

const route = useRoute()
const router = useRouter()

const id = Number((route.params as { id: number }).id) // 路由参数：菜谱菜单ID
const recipeMenu = ref<RecipeMenu>()
const loading = ref<boolean>(true) // 加载中
const showMoreOperator = ref<boolean>(false) // 展示更多操作的弹窗

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
  >
    <template #right>
      <van-icon name="ellipsis" size="24" @click="showMoreOperator = true" />
    </template>
  </van-nav-bar>
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
    <!-- 更多操作弹窗 -->
    <MorePopup v-model:show="showMoreOperator" :menu="recipeMenu" />
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
