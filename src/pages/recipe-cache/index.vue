<script setup lang="ts">
import { page as getRecipesPage, publicRecipePage } from '@/api/recipe'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'RecipeCache',
})

const router = useRouter()

let pageNo = 0 // 当前页
let pubPageNo = 0 // 公共菜谱当前页
const pageSize = 10 // 每页行数
const recipeList = ref([]) // 菜谱列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束
const pubRecipeList = ref([]) // 公共菜谱列表
const pubLoading = ref(false) // 公共菜谱-加载
const pubFinished = ref(false) // 公共菜谱-结束
const recipeTabActive = ref('self') // 当前所在tab
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

/**
 * 加载公共菜谱
 */
function pubOnLoad() {
  pubPageNo++ // 页面加1
  // 获取公共菜谱
  publicRecipePage({
    pageNo: pubPageNo,
    pageSize,
  }).then((res) => {
    // 将菜谱添加到列表中
    res.data.list.forEach((recipe) => {
      pubRecipeList.value.push(recipe)
    })
    // 关闭加载
    pubLoading.value = false
    if (res.data.list.length < pageSize) {
      // 所有数据刷新完成
      pubFinished.value = true
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
  <van-tabs v-model:active="recipeTabActive" swipeable sticky>
    <van-tab name="self">
      <template #title>
        <van-icon name="more-o" />我的菜谱
      </template>
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
    </van-tab>
    <van-tab name="public">
      <template #title>
        <van-icon name="more-o" />公共菜谱
      </template>
      <van-list
        v-model:loading="pubLoading"
        :finished="pubFinished"
        finished-text="已经到底啦 ~"
        loading-text="加载中..."
        @load="pubOnLoad"
      >
        <van-cell
          v-for="(recipe, index) in pubRecipeList"
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
