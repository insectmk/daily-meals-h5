<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getRecipeInfo } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import ActionFuncBar from '@/pages/recipe/action-func-bar/index.vue'
import MorePopup from './more-popup/index.vue'
import RecipeComment from '@/pages/recipe/recipe-comment/index.vue'

const route = useRoute()
const router = useRouter()

const id = Number((route.params as { id: number }).id) // 路由参数：菜谱ID
const recipe = ref<RecipeInfo>()
const loading = ref<boolean>(true) // 加载中
const showMoreOperator = ref<boolean>(false) // 展示更多操作的弹窗

/**
 * 获取菜谱信息
 */
getRecipeInfo({ id }).then((res) => {
  recipe.value = res.data
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
    title="菜谱信息"
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
    <div class="recipe-step-container" v-html="recipe.recipeStep" />
    <!--  评论  -->
    <RecipeComment :recipe-id="recipe.id" />
    <!--  动作栏  -->
    <ActionFuncBar :recipe="recipe" />
    <!-- 更多操作弹窗 -->
    <MorePopup v-model:show="showMoreOperator" :recipe="recipe" />
  </div>
</template>

<style scoped>
/* 为所有通过v-html渲染的图片添加约束 */
.recipe-step-container :deep(img) {
  max-width: 100%; /* 限制最大宽度为容器宽度 */
  height: auto; /* 高度按比例自适应 */
  display: block; /* 消除图片底部间隙 */
  margin: 10px auto; /* 居中显示 */
  object-fit: contain; /* 完整显示图片（防止裁剪） */
}
</style>

<route lang="json5">
{
  name: 'RecipeInfo',
  meta: {
    title: '菜谱信息',
    i18n: 'recipe.info.title',
    keepAlive: true,
    customNav: true,
  },
}
</route>
