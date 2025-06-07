<script setup lang="ts">
import UserCommentCard from '@/components/user-comment/user-comment-card.vue'
import type { CommonResult, PageParam, PageResult } from '@/api/type'
import type { PropType } from 'vue'
import type { UserComment } from '@/api/user-comment/type'
import type { UserCommentCardListExposed } from '@/components/user-comment/user-comment-card-list.type'

const props = defineProps({
  // 获取内容的接口
  listApi: {
    type: Function as PropType<(pageParam: PageParam) => Promise<CommonResult<PageResult<UserComment>>>>,
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

const emits = defineEmits(['cardClick'])

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const commentList = ref<UserComment[]>([]) // 评论列表
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
  // 获取内容
  props.listApi({
    pageNo,
    pageSize,
    ...props.queryParam,
  }).then((res) => {
    // 刷新加载状态
    refreshing.value = false
    // 将菜谱添加到列表中
    res.data.list.forEach((menu) => {
      commentList.value.push(menu)
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
  commentList.value = []
  pageNo = 0 // 当前页
  // 重新加载数据
  onLoad()
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
}

/**
 * 卡片点击
 */
function cardClickHandler(common: UserComment) {
  emits('cardClick', common)
}

// 导出方法
defineExpose<UserCommentCardListExposed>({
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
          v-for="(comment, index) in commentList"
          :key="index"
          span="24"
        >
          <UserCommentCard :comment="comment" @card-click="cardClickHandler(comment)" />
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
