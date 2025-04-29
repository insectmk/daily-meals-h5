<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import RecipeCard from '@/pages/recipe-cache/component/recipe-card.vue'
import type { CommonResult, PageParam, PageResult } from '@/api/type'
import type { PropType } from 'vue'

const props = defineProps({
  // 获取菜谱的接口
  recipeListApi: {
    type: Function as PropType<(pageParam: PageParam) => Promise<CommonResult<PageResult<RecipeInfo>>>>,
    required: true,
  },
})

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const recipeList = ref<RecipeInfo[]>([]) // 菜谱列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束

const refreshing = ref<boolean>(false) // 下拉刷新

/**
 * 加载更多
 */

/**
 * 加载
 */
function onLoad() {
  pageNo++ // 页面加1
  // 获取菜单
  props.recipeListApi({
    pageNo,
    pageSize,
  }).then((res) => {
    // 刷新加载状态
    refreshing.value = false
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
 * 下拉刷新
 */
function onRefresh() {
  // 清空列表数据
  finished.value = false
  // 重新加载数据
  onLoad()
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      style="min-height: 80vh;"
      :finished="finished"
      finished-text="已经到底啦 ~"
      loading-text="加载中..."
      @load="onLoad"
    >
      <van-row>
        <van-col
          v-for="(recipe, index) in recipeList"
          :key="index"
          span="24"
        >
          <RecipeCard :recipe="recipe" />
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
