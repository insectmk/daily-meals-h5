<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDictStore } from '@/stores'
import type { DailyPlanInfo, DailyPlanItemInfo } from '@/api/dailyplan/type'
import { getDailyPlanInfo } from '@/api/dailyplan'
import type { DictInfo } from '@/api/system/type'
import { DICT_TYPE } from '@/constants/dict'

const route = useRoute()
const dictStore = useDictStore()
// const { t } = useI18n() // 国际化

const id = Number((route.params as { id: number }).id) // 路由参数：计划ID
const dailyPlan = ref<DailyPlanInfo>() // 计划信息
const loading = ref<boolean>(true) // 加载中
const tabActive = ref<string>('') // 当前所在tab
const mealTypes = ref<DictInfo[]>([]) // 餐次类型

/**
 * 获取餐次类型
 */
dictStore.getDictByType(DICT_TYPE.MEALS_STATIC_MEAL_TYPES).then((res) => {
  mealTypes.value = res
  tabActive.value = mealTypes.value[0].value // 当前所在tab
})

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
  const planItemList = dailyPlan.value.items // 计划明细信息（带菜谱信息）
  const mealTypeRecipeList = {}
  mealTypes.value.forEach((mealType) => {
    mealTypeRecipeList[mealType.value] = planItemList
      .filter(item => Number(item.mealType) === Number(mealType.value)) // 该餐次类型
      .map((item: DailyPlanItemInfo) => item.recipeInfo) // 组装菜谱
  })
  return mealTypeRecipeList
})
</script>

<template>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <van-tabs
      v-model:active="tabActive"
      animated swipeable sticky
      background="transparent"
    >
      <van-tab v-for="mealType in mealTypes" :key="mealType.value" :name="mealType.value">
        <template #title>
          {{ mealType.label }}
        </template>
        <RecipeCardList :recipe-list-api="recipeList[mealType.value]" min-height="85vh" />
      </van-tab>
    </van-tabs>
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
