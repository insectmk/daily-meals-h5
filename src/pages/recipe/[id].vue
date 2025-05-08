<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRecipeInfo } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import ActionFuncBar from '@/pages/recipe/action-func-bar/index.vue'

const route = useRoute()

const id = Number((route.params as { id: number }).id) // 路由参数：菜谱ID
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
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="sliderPicUrl in recipe.sliderPicUrls" :key="sliderPicUrl">
        <van-image
          height="200"
          width="100%"
          fit="fill"
          :src="sliderPicUrl"
        />
      </van-swipe-item>
    </van-swipe>
    <div v-html="recipe.recipeStep" />
    <!--  动作栏  -->
    <ActionFuncBar :recipe-id="id" />
  </div>
</template>

<style scoped>
</style>

<route lang="json5">
{
  name: 'RecipeInfo',
  meta: {
    title: '菜谱信息',
    i18n: 'recipe.info.title',
    keepAlive: true
  },
}
</route>
