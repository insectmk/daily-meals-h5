<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import RecipeCardList from '@/pages/recipe-cache/component/recipe-card-list.vue'
import { systemRecipePage } from '@/api/recipe'
import type { CommonResult, PageResult } from '@/api/type'

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const recipeList = ref<RecipeInfo[]>([]) // 菜谱列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束

/**
 * 加载
 */
function onLoad(callback: (res: CommonResult<PageResult<RecipeInfo>>) => void) {
  pageNo++ // 页面加1
  // 获取菜单
  systemRecipePage({
    pageNo,
    pageSize,
  }).then((res) => {
    callback(res) // 回调
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
</script>

<template>
  <RecipeCardList
    v-model:loading="loading"
    :finished="finished"
    :recipe-list="recipeList"
    @load="onLoad"
  />
</template>

<style scoped>

</style>
