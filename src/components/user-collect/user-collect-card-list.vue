<script setup lang="ts">
import type { CommonResult, PageParam, PageResult } from '@/api/type'
import type { PropType } from 'vue'
import type { UserCollect } from '@/api/user-collect/type'

const props = defineProps({
  // 获取收藏夹的接口
  listApi: {
    type: Function as PropType<
      ((pageParam: PageParam) => Promise<CommonResult<PageResult<UserCollect>>>)
    >,
    required: true,
  },
  // 查询参数
  queryParam: {
    type: Object as PropType<any>,
    required: false,
  },
  // 最小宽度
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
const userCollectList = ref<UserCollect[]>([]) // 列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束

const refreshing = ref<boolean>(false) // 下拉刷新

/**
 * 加载更多
 */
function onLoad() {
  pageNo++ // 页面加1
  // 获取菜单
  props.listApi({
    pageNo,
    pageSize,
    ...props.queryParam,
  }).then((res) => {
    // 刷新加载状态
    refreshing.value = false
    // 将菜谱添加到列表中
    res.data.list.forEach((recipe) => {
      userCollectList.value.push(recipe)
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
  userCollectList.value = []
  pageNo = 0 // 当前页
  // 重新加载数据
  onLoad()
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
}

// 导出方法
defineExpose({
  query: onRefresh,
})
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :immediate-check="isAutoQuery"
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
          v-for="(userCollect, index) in userCollectList"
          :key="index"
          span="24"
        >
          <UserCollectCard :user-collect="userCollect" />
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
