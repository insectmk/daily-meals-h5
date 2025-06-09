<script setup lang="ts">
import { getPopularPublicRecipes, getRecipePage } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import { useRouter } from 'vue-router'
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'

defineOptions({
  name: 'RecipeNewest',
})

const router = useRouter()

const popularPublicRecipeList = ref<RecipeInfo[]>() // 公共菜谱排行列表

/**
 * 获取公共菜谱排名
 */
getPopularPublicRecipes({
  rankLen: 5,
  mealType: [0, 1, 2],
}).then((res) => {
  popularPublicRecipeList.value = res.data
})
</script>

<template>
  <!-- 搜索框 -->
  <van-sticky>
    <van-cell-group inset>
      <van-field
        left-icon="search"
        placeholder="搜索菜谱、菜单"
        :border="false"
        @click-input="router.push(`/search`)"
      />
    </van-cell-group>
  </van-sticky>
  <van-swipe :autoplay="3000" indicator-color="white">
    <van-swipe-item
      v-for="recipe in popularPublicRecipeList"
      :key="recipe.id"
      @click="router.push(`/recipe/${recipe.id}`)"
    >
      <van-image
        height="200"
        width="100%"
        fit="fill"
        :src="recipe.picUrl"
      />
    </van-swipe-item>
  </van-swipe>
  <van-divider
    :style="{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', padding: '0 16px' }"
  >
    最新菜谱
  </van-divider>
  <RecipeCardList
    :recipe-list-api="getRecipePage"
    min-height="50vh"
  />
</template>
