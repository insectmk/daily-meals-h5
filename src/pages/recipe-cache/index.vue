<script setup lang="ts">
import { page as getRecipesPage } from '@/api/recipe'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'RecipeCache',
})

const router = useRouter()

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const recipeList = ref([]) // 菜谱列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束
// const { t } = useI18n() // 多语言支持

/**
 * 加载
 */
function onLoad() {
  pageNo++ // 页面加1
  // 获取菜单
  getRecipesPage({
    pageNo,
    pageSize,
  }).then((res) => {
    // 将菜谱添加到列表中
    res.data.list.forEach((recipe) => {
      recipeList.value.push(recipe)
    })
    // 关闭加载
    loading.value = false
    if (res.data.list.length < pageSize) {
      // 所有数据刷新完成
      finished.value = true
    }
  })
}
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
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="已经到底啦 ~"
    loading-text="加载中..."
    @load="onLoad"
  >
    <van-cell
      v-for="(recipe, index) in recipeList"
      :key="index"
      :border="false"
      class="mb-8 rounded-12"
      is-link
      @click="router.push(`/recipe-cache/${recipe.id}`)"
    >
      <template #title>
        {{ recipe.name }}
      </template>
      <template #label>
        {{ recipe.recipeDesc }}
      </template>
    </van-cell>
  </van-list>
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
