<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import RecipeCard from '@/components/recipe/recipe-card.vue'
import type { CommonResult, PageParam, PageResult } from '@/api/type'
import type { PropType } from 'vue'

const props = defineProps({
  // 获取菜谱的接口，或者直接为菜谱数组
  recipeListApi: {
    type: [Function, Array] as PropType<
      ((pageParam: PageParam) => Promise<CommonResult<PageResult<RecipeInfo>>>)
        |
      RecipeInfo[]
    >,
    required: true,
  },
  // 查询参数
  queryParam: {
    type: Object as PropType<any>,
    required: false,
  },
  minHeight: {
    type: String,
    required: false,
    default: '80vh',
  },
})

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const recipeList = ref<RecipeInfo[]>([]) // 菜谱列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束

const refreshing = ref<boolean>(false) // 下拉刷新

// 判断参数类型
if (typeof props.recipeListApi !== 'function') {
  recipeList.value = props.recipeListApi
}

/**
 * 加载更多
 */
function onLoad() {
  if (typeof props.recipeListApi !== 'function') {
    // 不是方法就退出，防止编译报错
    return
  }
  pageNo++ // 页面加1
  // 获取菜单
  props.recipeListApi({
    pageNo,
    pageSize,
    ...props.queryParam,
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
  recipeList.value = []
  pageNo = 0 // 当前页
  // 重新加载数据
  onLoad()
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
}
</script>

<template>
  <van-pull-refresh v-if="typeof recipeListApi === 'function'" v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :style="{
        minHeight,
      }"
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
  <van-list
    v-else
    :style="{
      minHeight,
    }"
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
</template>

<style scoped>

</style>
