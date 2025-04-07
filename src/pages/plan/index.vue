<script setup lang="ts">
import { useRouter } from 'vue-router'
import { page as getDailyPlansPage } from '@/api/dailyplan'
import { formatDate } from '@vueuse/core'

defineOptions({
  name: 'PlanCache',
})

const router = useRouter()

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const dailyPlanList = ref([]) // 菜谱列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束
// const { t } = useI18n() // 多语言支持

/**
 * 加载
 */
function onLoad() {
  pageNo++ // 页面加1
  // 获取菜单
  getDailyPlansPage({
    pageNo,
    pageSize,
  }).then((res) => {
    // 将菜谱添加到列表中
    res.data.list.forEach((recipe) => {
      dailyPlanList.value.push(recipe)
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
      v-for="(dailyPlan, index) in dailyPlanList"
      :key="index"
      :border="false"
      class="mb-8 rounded-12"
      is-link
      @click="router.push(`/plan/${dailyPlan.id}`)"
    >
      <template #title>
        {{ formatDate(new Date(dailyPlan.planDate), 'YYYY年MM月DD日') }}
      </template>
      <template #label>
        {{ dailyPlan.memo }}
      </template>
    </van-cell>
  </van-list>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'PlanCache',
  meta: {
    i18n: 'layouts.plan',
    keepAlive: true
  },
}
</route>
