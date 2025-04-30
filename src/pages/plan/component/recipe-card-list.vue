<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import RecipeCard from '@/pages/recipe-cache/component/recipe-card.vue'
import type { CommonResult, PageResult } from '@/api/type'

defineProps({
  // 菜谱列表
  recipeList: {
    type: Array as () => RecipeInfo[],
    required: true,
  },
  // 加载
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  // 是否结束
  finished: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits([
  // 加载
  'load',
  'update:loading',
  'update:finished',
])

// 监听输入变化，触发双向绑定
function handleLoading(value: string) {
  emit('update:loading', value)
}

const refreshing = ref<boolean>(false) // 下拉刷新

/**
 * 加载更多
 */
async function onLoad() {
  emit('load', (_res: CommonResult<PageResult<RecipeInfo>>) => {
    // 刷新加载状态
    refreshing.value = false
  })
}

/**
 * 下拉刷新
 */
function onRefresh() {
  // 清空列表数据
  emit('update:finished', false)
  // 重新加载数据
  onLoad()
  // 将 loading 设置为 true，表示处于加载状态
  emit('update:loading', true)
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      style="min-height: 80vh;"
      :loading="loading"
      :finished="finished"
      finished-text="已经到底啦 ~"
      loading-text="加载中..."
      @load="onLoad"
      @update:loading="handleLoading"
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
