<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { DailyPlanInfo } from '@/api/dailyplan/type'
import { getDailyPlanInfo } from '@/api/dailyplan'

const route = useRoute()
const router = useRouter()
// const { t } = useI18n() // 国际化

const id = (route.params as { id: number }).id // 路由参数：计划ID
const dailyPlan = ref<DailyPlanInfo>() // 计划信息
const loading = ref<boolean>(true) // 加载中
/**
 * 获取计划信息
 */
getDailyPlanInfo({ id }).then((res) => {
  dailyPlan.value = res.data
  loading.value = false // 加载完毕
})
</script>

<template>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <p>{{}}</p>
    <van-cell
      v-for="(item, index) in dailyPlan.items"
      :key="index"
      :border="false"
      class="mb-8 rounded-12"
      is-link
      @click="router.push(`/recipe-cache/${item.recipeId}`)"
    >
      <template #title>
        {{ item.recipeName }}
      </template>
      <template #label>
        {{ item.mealType }}
      </template>
    </van-cell>
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
