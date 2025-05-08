<script setup lang="ts">
import RecipeCard from '@/components/recipe/recipe-card.vue'

import { getDailyPlanInfo } from '@/api/dailyplan'
import type { DailyPlanInfo, DailyPlanItemInfo } from '@/api/dailyplan/type'

const props = defineProps({
  // 计划ID
  planId: {
    type: Number,
    required: true,
  },
})

const refreshing = ref<boolean>(false) // 下拉刷新
const dailyPlan = ref<DailyPlanInfo>() // 计划信息

/**
 * 获取计划信息
 */
getDailyPlanInfo({ id: props.planId }).then((res) => {
  dailyPlan.value = res.data
})

/**
 * 菜谱列表
 */
const recipeList = computed(() => {
  if (dailyPlan.value) {
    return dailyPlan.value.items.map((item: DailyPlanItemInfo) => item.recipeInfo)
  }
  else {
    return []
  }
})

/**
 * 下拉刷新
 */
function onRefresh() {
  getDailyPlanInfo({ id: props.planId }).then((res) => {
    dailyPlan.value = res.data
    refreshing.value = false // 加载完毕
  })
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      style="min-height: 80vh;"
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
