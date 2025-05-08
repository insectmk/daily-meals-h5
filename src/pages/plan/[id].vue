<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { DailyPlanInfo, DailyPlanItemInfo } from '@/api/dailyplan/type'
import { getDailyPlanInfo } from '@/api/dailyplan'
import PlanRecipeCardList from '@/pages/plan/plan-recipe-card-list/index.vue'

const route = useRoute()
// const { t } = useI18n() // 国际化

const id = Number((route.params as { id: number }).id) // 路由参数：计划ID
const dailyPlan = ref<DailyPlanInfo>() // 计划信息
const loading = ref<boolean>(true) // 加载中
/**
 * 获取计划信息
 */
getDailyPlanInfo({ id }).then((res) => {
  dailyPlan.value = res.data
  loading.value = false // 加载完毕
})

/**
 * 菜谱列表
 */
const recipeList = computed(() => {
  return dailyPlan.value.items.map((item: DailyPlanItemInfo) => item.recipeInfo)
})
</script>

<template>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <PlanRecipeCardList
      :plan-id="id"
      :recipe-list="recipeList"
    />
  </div>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'PlanInfo',
  meta: {
    title: '计划信息',
    i18n: 'plan.info.title',
    keepAlive: true
  },
}
</route>
