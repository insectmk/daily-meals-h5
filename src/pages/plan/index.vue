<script setup lang="ts">
import { useRouter } from 'vue-router'
import { page as getDailyPlansPage } from '@/api/dailyplan'
import { computed } from 'vue'
import type { DailyPlanInfo } from '@/api/dailyplan/type'
import type { CalendarDayItem } from 'vant'

defineOptions({
  name: 'PlanCache',
})

const router = useRouter()

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const dailyPlanList = ref<DailyPlanInfo[]>([]) // 计划列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束
// const { t } = useI18n() // 多语言支持

// 计划最小时间
const minDate = computed(() => {
  if (dailyPlanList.value.length === 0)
    return new Date()
  return new Date(dailyPlanList.value.reduce((minPlanDate, dailyPlan) =>
    dailyPlan.planDate < minPlanDate
      ? dailyPlan.planDate
      : minPlanDate, dailyPlanList.value[0]?.planDate ?? 0))
})
// 计划最大时间
const maxDate = computed(() => {
  if (dailyPlanList.value.length === 0)
    return new Date()
  return new Date(dailyPlanList.value.reduce((maxPlanDate, dailyPlan) =>
    dailyPlan.planDate > maxPlanDate
      ? dailyPlan.planDate
      : maxPlanDate, dailyPlanList.value[0]?.planDate ?? 0))
})

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
    dailyPlanList.value = [...dailyPlanList.value, ...res.data.list]
    // 关闭加载
    loading.value = false
    if (res.data.list.length < pageSize) {
      // 所有数据刷新完成
      finished.value = true
    }
  })
}

/**
 * 自定义日期内容
 * @param day
 */
function formatter(day: CalendarDayItem) {
  const nowDate = new Date()

  // 今日的判断
  if (day.date.getMonth() === nowDate.getMonth()
    && day.date.getDate() === nowDate.getDate()) {
    day.text = '今天'
  }
  // 是否存在计划的判断
  const currentPlan = dailyPlanList.value.find((dailyPlan) => {
    const planDate = new Date(dailyPlan.planDate)
    return planDate.getMonth() === day.date.getMonth()
      && planDate.getDate() === day.date.getDate()
  })
  if (currentPlan) {
    day.topInfo = `${currentPlan.items.length}` // 菜谱数量
    day.bottomInfo = '已计划'
  }
  return day
}

/**
 * 选择日期后
 * @param value
 */
function onCalendarSelect(value: Date) {
  // 判断是否存在计划
  const currentPlan = dailyPlanList.value.find((dailyPlan) => {
    const planDate = new Date(dailyPlan.planDate)
    return planDate.getMonth() === value.getMonth()
      && planDate.getDate() === value.getDate()
  })
  if (currentPlan) {
    // 跳转到计划详情页
    router.push(`/plan/${currentPlan.id}`)
  }
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
    v-if="!loading"
    v-model:loading="loading"
    :finished="finished"
    finished-text="已经到底啦 ~"
    loading-text="加载中..."
    @load="onLoad"
  >
    <van-calendar
      :formatter="formatter"
      :min-date="minDate"
      :max-date="maxDate" title="计划"
      :poppable="false"
      :show-confirm="false"
      @select="onCalendarSelect"
    />
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
