<script setup lang="ts">
import type { RecipeMenu } from '@/api/recipe-menu/type'
import RecipeMenuCard from '@/components/recipe-menu/recipe-menu-card.vue'
import type { CommonResult, PageParam, PageResult } from '@/api/type'
import type { PropType } from 'vue'
import type { RecipeMenuCardListExposed } from '@/components/recipe-menu/recipe-menu-card-list.type'

const props = defineProps({
  // 获取菜谱的接口
  menuListApi: {
    type: Function as PropType<(pageParam: PageParam) => Promise<CommonResult<PageResult<RecipeMenu>>>>,
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
  // 是否直接查询
  isAutoQuery: {
    type: Boolean,
    required: false,
    default: true,
  },
})

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const menuList = ref<RecipeMenu[]>([]) // 菜谱菜单列表
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
  props.menuListApi({
    pageNo,
    pageSize,
    ...props.queryParam,
  }).then((res) => {
    // 刷新加载状态
    refreshing.value = false
    // 将菜谱添加到列表中
    res.data.list.forEach((menu) => {
      menuList.value.push(menu)
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
  menuList.value = []
  pageNo = 0 // 当前页
  // 重新加载数据
  onLoad()
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
}

// 导出方法
defineExpose<RecipeMenuCardListExposed>({
  query: onRefresh,
})
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :style="{
        minHeight,
      }"
      :immediate-check="isAutoQuery"
      :finished="finished"
      finished-text="已经到底啦 ~"
      loading-text="加载中..."
      @load="onLoad"
    >
      <van-row>
        <van-col
          v-for="(menu, index) in menuList"
          :key="index"
          span="24"
        >
          <RecipeMenuCard :recipe-menu="menu" />
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
