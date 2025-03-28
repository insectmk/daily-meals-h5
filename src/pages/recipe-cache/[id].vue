<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRecipeInfo } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'

const route = useRoute()

const id = route.params.id // 路由参数：菜谱ID
const recipe = ref<RecipeInfo>()
const loading = ref<boolean>(true) // 加载中
/**
 * 获取菜谱信息
 */
getRecipeInfo({ id }).then((res) => {
  recipe.value = res.data
  loading.value = false // 加载完毕
})
</script>

<template>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <div v-html="recipe.recipeStep" />
  </div>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'RecipeInfo',
  meta: {
    title: '菜谱信息',
    i18n: 'recipe.title.info',
    keepAlive: true
  },
}
</route>
