<script setup lang="ts">
import { getPopularPublicRecipes } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import { useRouter } from 'vue-router'

const router = useRouter()

const popularPublicRecipeList = ref<RecipeInfo[]>() // 公共菜谱排行列表

/**
 * 获取公共菜谱排名
 */
getPopularPublicRecipes({
  rankLen: 5,
  mealType: [0, 1, 2].join(','),
}).then((res) => {
  popularPublicRecipeList.value = res.data
})
</script>

<template>
  <van-swipe :autoplay="3000" indicator-color="white">
    <van-swipe-item
      v-for="recipe in popularPublicRecipeList"
      :key="recipe.id"
      @click="router.push(`/recipe-cache/${recipe.id}`)"
    >
      <van-image
        height="200"
        width="100%"
        fit="fill"
        :src="recipe.picUrl"
      />
    </van-swipe-item>
  </van-swipe>
</template>

<route lang="json5">
{
  name: 'home',
  meta: {
    title: '主页',
    i18n: 'menus.home'
  },
}
</route>
